import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper to get dynamic dates
const today = new Date();
const getDate = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

const getDateOnly = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const getTimeToday = (hours: number, minutes: number = 0) => {
  const date = new Date(today);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

async function seed() {
  console.log('Starting seed...');

  try {
    // Create demo users
    console.log('Creating demo users...');
    const johnAuth = await supabase.auth.admin.createUser({
      email: 'john@famify-demo.com',
      password: 'Demo123!',
      email_confirm: true,
      user_metadata: { name: 'John' },
    });

    const patriciaAuth = await supabase.auth.admin.createUser({
      email: 'patricia@famify-demo.com',
      password: 'Demo123!',
      email_confirm: true,
      user_metadata: { name: 'Patricia' },
    });

    if (!johnAuth.data.user || !patriciaAuth.data.user) {
      throw new Error('Failed to create users');
    }

    const johnId = johnAuth.data.user.id;
    const patriciaId = patriciaAuth.data.user.id;

    console.log('Users created:', { johnId, patriciaId });

    // Create family
    console.log('Creating family...');
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({
        name: 'The Johnsons',
        created_by: johnId,
      })
      .select()
      .single();

    if (familyError || !family) throw familyError;
    const familyId = family.id;
    console.log('Family created:', familyId);

    // Add family members
    console.log('Adding family members...');
    await supabase.from('family_members').insert([
      { family_id: familyId, user_id: johnId, role: 'parent' },
      { family_id: familyId, user_id: patriciaId, role: 'parent' },
    ]);

    // Create events (dynamic dates)
    console.log('Creating events...');
    await supabase.from('events').insert([
      {
        family_id: familyId,
        title: "Julia's Health Checkup",
        start_time: getTimeToday(14, 0),
        category: 'health',
        assigned_to: [patriciaId],
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Family Dinner',
        start_time: getTimeToday(19, 0),
        category: 'family',
        assigned_to: [johnId, patriciaId],
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Piano Lessons',
        start_time: getTimeToday(16, 0),
        category: 'activity',
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Weekend Shopping',
        start_time: getDate(5) + 'T10:00:00Z',
        category: 'chores',
        assigned_to: [patriciaId],
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Soccer Practice',
        start_time: getDate(1) + 'T15:00:00Z',
        category: 'activity',
        assigned_to: [johnId],
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Dentist Appointment',
        start_time: getDate(1) + 'T10:00:00Z',
        category: 'health',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Movie Night',
        start_time: getDate(4) + 'T20:00:00Z',
        category: 'family',
        assigned_to: [johnId, patriciaId],
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Grocery Run',
        start_time: getDate(5) + 'T11:00:00Z',
        category: 'chores',
        assigned_to: [johnId],
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Play Date',
        start_time: getDate(2) + 'T14:00:00Z',
        category: 'family',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Swimming Class',
        start_time: getDate(3) + 'T09:00:00Z',
        category: 'activity',
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'PTA Meeting',
        start_time: getDate(3) + 'T18:00:00Z',
        category: 'other',
        assigned_to: [patriciaId],
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Sunday Brunch',
        start_time: getDate(6) + 'T10:30:00Z',
        category: 'family',
        assigned_to: [johnId, patriciaId],
        created_by: johnId,
      },
    ]);

    // Create tasks
    console.log('Creating tasks...');
    await supabase.from('tasks').insert([
      {
        family_id: familyId,
        title: 'Pay electricity bill',
        assigned_to: patriciaId,
        due_date: getDate(-7),
        is_completed: false,
        priority: 'high',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Pick up kids from soccer practice',
        assigned_to: johnId,
        due_date: getDate(-1),
        is_completed: false,
        priority: 'medium',
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Prepare dinner',
        assigned_to: johnId,
        due_date: getTimeToday(18, 0),
        is_completed: false,
        priority: 'medium',
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Parent-teacher conference',
        due_date: getDate(1),
        is_completed: false,
        priority: 'high',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Book summer camp',
        assigned_to: patriciaId,
        due_date: getDate(3),
        is_completed: false,
        priority: 'medium',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Fix bathroom faucet',
        assigned_to: johnId,
        due_date: getDate(5),
        is_completed: false,
        priority: 'low',
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Order school supplies',
        assigned_to: patriciaId,
        due_date: getDate(2),
        is_completed: false,
        priority: 'medium',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Schedule family photo',
        assigned_to: johnId,
        due_date: getDate(-2),
        is_completed: true,
        priority: 'low',
        created_by: johnId,
      },
    ]);

    // Create lists
    console.log('Creating lists...');
    const { data: groceryList } = await supabase
      .from('lists')
      .insert({
        family_id: familyId,
        title: 'Grocery Shopping',
        type: 'grocery',
        created_by: patriciaId,
      })
      .select()
      .single();

    const { data: schoolList } = await supabase
      .from('lists')
      .insert({
        family_id: familyId,
        title: 'Back to School',
        type: 'shopping',
        created_by: johnId,
      })
      .select()
      .single();

    if (groceryList) {
      await supabase.from('list_items').insert([
        { list_id: groceryList.id, name: 'Chicken', quantity: '1', unit: 'kg', sort_order: 1 },
        { list_id: groceryList.id, name: 'Tomatoes', quantity: '500', unit: 'g', sort_order: 2 },
        { list_id: groceryList.id, name: 'Orange Juice', quantity: '1', unit: 'L', sort_order: 3 },
        {
          list_id: groceryList.id,
          name: 'Bread',
          quantity: '500',
          unit: 'g',
          is_checked: true,
          sort_order: 4,
        },
        { list_id: groceryList.id, name: 'Milk', quantity: '2', unit: 'L', sort_order: 5 },
        { list_id: groceryList.id, name: 'Eggs', quantity: '12', unit: 'pcs', sort_order: 6 },
        { list_id: groceryList.id, name: 'Rice', quantity: '1', unit: 'kg', sort_order: 7 },
        { list_id: groceryList.id, name: 'Apples', quantity: '6', unit: 'pcs', sort_order: 8 },
      ]);
    }

    if (schoolList) {
      await supabase.from('list_items').insert([
        { list_id: schoolList.id, name: 'Backpack', quantity: '1', is_checked: true, sort_order: 1 },
        { list_id: schoolList.id, name: 'Notebooks', quantity: '5', sort_order: 2 },
        { list_id: schoolList.id, name: 'Pencils', quantity: '12', sort_order: 3 },
        { list_id: schoolList.id, name: 'Lunch box', quantity: '1', sort_order: 4 },
        { list_id: schoolList.id, name: 'Water bottle', quantity: '1', is_checked: true, sort_order: 5 },
      ]);
    }

    // Create meal plans
    console.log('Creating meal plans...');
    await supabase.from('meal_plans').insert([
      {
        family_id: familyId,
        date: getDateOnly(0),
        meal_type: 'dinner',
        description: 'Grilled Fish 🐟 • Sautéed Vegetables • Strawberry Cheesecake 🧁',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        date: getDateOnly(1),
        meal_type: 'breakfast',
        description: 'Soft Bread 🍞 • Hot Chocolate ☕',
        created_by: johnId,
      },
      {
        family_id: familyId,
        date: getDateOnly(1),
        meal_type: 'lunch',
        description: 'Tomato Salad 🍅 • Yogurt 🥛',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        date: getDateOnly(2),
        meal_type: 'dinner',
        description: 'Pasta Bolognese 🍝 • Garlic Bread 🧄',
        created_by: johnId,
      },
      {
        family_id: familyId,
        date: getDateOnly(3),
        meal_type: 'breakfast',
        description: 'Pancakes 🥞 • Fresh Juice 🍊',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        date: getDateOnly(4),
        meal_type: 'lunch',
        description: 'Chicken Wrap 🌯 • Fruit Salad 🍇',
        created_by: johnId,
      },
      {
        family_id: familyId,
        date: getDateOnly(5),
        meal_type: 'dinner',
        description: 'Homemade Pizza 🍕 • Caesar Salad 🥗',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        date: getDateOnly(6),
        meal_type: 'breakfast',
        description: 'Eggs Benedict 🍳 • Avocado Toast 🥑',
        created_by: johnId,
      },
      {
        family_id: familyId,
        date: getDateOnly(6),
        meal_type: 'dinner',
        description: 'BBQ Chicken 🍗 • Corn on the Cob 🌽 • Coleslaw',
        created_by: patriciaId,
      },
    ]);

    // Create reminders
    console.log('Creating reminders...');
    await supabase.from('reminders').insert([
      {
        family_id: familyId,
        user_id: patriciaId,
        title: 'Take vitamins',
        remind_at: getTimeToday(9, 0),
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        user_id: johnId,
        title: 'Turn off the oven',
        remind_at: getTimeToday(18, 0),
        created_by: johnId,
      },
      {
        family_id: familyId,
        user_id: patriciaId,
        title: 'Call dentist',
        remind_at: getTimeToday(14, 0),
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        user_id: johnId,
        title: 'Pick up dry cleaning',
        remind_at: getDate(1) + 'T10:00:00Z',
        created_by: johnId,
      },
      {
        family_id: familyId,
        user_id: patriciaId,
        title: 'Water the plants',
        remind_at: getDate(1) + 'T07:00:00Z',
        created_by: patriciaId,
      },
    ]);

    // Create notes
    console.log('Creating notes...');
    await supabase.from('notes').insert([
      {
        family_id: familyId,
        title: "Julia's Note",
        content: 'HEY MOMMY! I LOVE YOU SO MUCH! 💖',
        created_by: johnId,
      },
      {
        family_id: familyId,
        title: 'Budget',
        content: 'Grocery budget this week: $150. Farmers market on Saturday.',
        created_by: patriciaId,
      },
      {
        family_id: familyId,
        title: 'Piano Recital',
        content: "Julia's piano recital June 15th — invite grandparents! Buy flowers.",
        created_by: johnId,
      },
    ]);

    // Create posts
    console.log('Creating posts...');
    const posts = await supabase
      .from('posts')
      .insert([
        {
          family_id: familyId,
          author_id: johnId,
          content: 'Julia lost her first tooth today! 🦷 So proud!',
          visibility: 'family',
        },
        {
          family_id: familyId,
          author_id: patriciaId,
          content: 'Family hiking trip was amazing! 🏔️',
          visibility: 'family',
        },
        {
          family_id: familyId,
          author_id: johnId,
          content: 'First day of school! They grow up so fast 😢💕',
          visibility: 'family',
        },
        {
          family_id: familyId,
          author_id: patriciaId,
          content: 'Made homemade pasta tonight 👩‍🍳',
          visibility: 'family',
        },
        {
          family_id: familyId,
          author_id: johnId,
          content: 'Soccer team won their first game! ⚽🏆',
          visibility: 'family',
        },
        {
          family_id: familyId,
          author_id: patriciaId,
          content: 'Sunday game night — Julia destroyed us at Uno 😂',
          visibility: 'family',
        },
        {
          family_id: familyId,
          author_id: johnId,
          content: 'Planted a garden with the kids 🌱',
          visibility: 'family',
        },
        {
          family_id: familyId,
          author_id: patriciaId,
          content: 'Julia drew the most beautiful family picture 🎨',
          visibility: 'family',
        },
      ])
      .select();

    if (posts.data && posts.data.length > 0) {
      // Add likes
      await supabase.from('post_likes').insert([
        { post_id: posts.data[0].id, user_id: patriciaId },
        { post_id: posts.data[1].id, user_id: johnId },
        { post_id: posts.data[2].id, user_id: patriciaId },
        { post_id: posts.data[4].id, user_id: patriciaId },
      ]);

      // Add comments
      await supabase.from('post_comments').insert([
        { post_id: posts.data[0].id, user_id: patriciaId, content: 'So sweet! Time flies 💕' },
        { post_id: posts.data[1].id, user_id: johnId, content: 'Best day ever! 🎉' },
        { post_id: posts.data[5].id, user_id: johnId, content: 'She is the Uno champion! 😄' },
      ]);
    }

    // Create notifications
    console.log('Creating notifications...');
    await supabase.from('notifications').insert([
      {
        user_id: patriciaId,
        family_id: familyId,
        type: 'task',
        title: 'Task Assigned',
        message: 'John assigned you: Pay electricity bill',
        is_read: false,
      },
      {
        user_id: johnId,
        family_id: familyId,
        type: 'event',
        title: 'Upcoming Event',
        message: 'Soccer Practice tomorrow at 3 PM',
        is_read: false,
      },
      {
        user_id: patriciaId,
        family_id: familyId,
        type: 'like',
        title: 'New Like',
        message: 'John liked your post',
        is_read: true,
      },
      {
        user_id: johnId,
        family_id: familyId,
        type: 'comment',
        title: 'New Comment',
        message: 'Patricia commented on your post',
        is_read: false,
      },
    ]);

    console.log('✅ Seed completed successfully!');
    console.log(`
Demo Credentials:
Email: john@famify-demo.com
Password: Demo123!

or

Email: patricia@famify-demo.com
Password: Demo123!

Family Name: The Johnsons
    `);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
