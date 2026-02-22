-- Famify Database Schema
-- Paste this entire file into the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('parent', 'child', 'caregiver')),
  date_of_birth DATE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'parent'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FAMILIES TABLES
-- ============================================
CREATE TABLE families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE DEFAULT SUBSTR(MD5(RANDOM()::TEXT), 1, 8),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('parent', 'child', 'caregiver')) DEFAULT 'parent',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_id, user_id)
);

CREATE TABLE child_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  parent_id UUID REFERENCES profiles(id),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  age_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLANNER TABLES
-- ============================================
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location TEXT,
  category TEXT CHECK (category IN ('health', 'family', 'activity', 'chores', 'other')) DEFAULT 'other',
  created_by UUID REFERENCES profiles(id),
  assigned_to UUID[] DEFAULT '{}',
  recurrence JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('grocery', 'shopping', 'custom')) DEFAULT 'grocery',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity TEXT,
  unit TEXT,
  is_checked BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  remind_at TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FEED TABLES
-- ============================================
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id),
  content TEXT,
  media_urls TEXT[] DEFAULT '{}',
  visibility TEXT CHECK (visibility IN ('family', 'public')) DEFAULT 'family',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SAVED PLACES TABLE (Needle feature)
-- ============================================
CREATE TABLE saved_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  place_name TEXT,
  category TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rating NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_events_family_id ON events(family_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_tasks_family_id ON tasks(family_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_lists_family_id ON lists(family_id);
CREATE INDEX idx_list_items_list_id ON list_items(list_id);
CREATE INDEX idx_meal_plans_family_id ON meal_plans(family_id);
CREATE INDEX idx_meal_plans_date ON meal_plans(date);
CREATE INDEX idx_reminders_family_id ON reminders(family_id);
CREATE INDEX idx_notes_family_id ON notes(family_id);
CREATE INDEX idx_posts_family_id ON posts(family_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_saved_places_family_id ON saved_places(family_id);

-- ============================================
-- VIEWS
-- ============================================
CREATE VIEW family_members_with_profiles AS
SELECT
  fm.id,
  fm.family_id,
  fm.user_id,
  fm.role,
  fm.joined_at,
  p.name,
  p.avatar_url,
  p.date_of_birth
FROM family_members fm
JOIN profiles p ON fm.user_id = p.id;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view profiles in their family"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members fm1
      JOIN family_members fm2 ON fm1.family_id = fm2.family_id
      WHERE fm1.user_id = auth.uid() AND fm2.user_id = profiles.id
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Families policies
CREATE POLICY "Family members can view their family"
  ON families FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = families.id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create families"
  ON families FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Family members policies
CREATE POLICY "Family members can view members of their families"
  ON family_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.family_id = family_members.family_id
      AND fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can add family members"
  ON family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.family_id = family_members.family_id
      AND fm.user_id = auth.uid()
      AND fm.role = 'parent'
    )
  );

CREATE POLICY "Parents can remove family members"
  ON family_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.family_id = family_members.family_id
      AND fm.user_id = auth.uid()
      AND fm.role = 'parent'
    )
  );

-- Child profiles policies
CREATE POLICY "Family members can view child profiles"
  ON child_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = child_profiles.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Parents can manage child profiles"
  ON child_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = child_profiles.family_id
      AND family_members.user_id = auth.uid()
      AND family_members.role = 'parent'
    )
  );

-- Events policies
CREATE POLICY "Family members can view events"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = events.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can create events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = events.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can update events"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = events.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can delete events"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = events.family_id
      AND family_members.user_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Family members can view tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = tasks.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = tasks.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can update tasks"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = tasks.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can delete tasks"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = tasks.family_id
      AND family_members.user_id = auth.uid()
    )
  );

-- Lists policies
CREATE POLICY "Family members can view lists"
  ON lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = lists.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can create lists"
  ON lists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = lists.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can update lists"
  ON lists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = lists.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can delete lists"
  ON lists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = lists.family_id
      AND family_members.user_id = auth.uid()
    )
  );

-- List items policies
CREATE POLICY "Family members can view list items"
  ON list_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN family_members ON family_members.family_id = lists.family_id
      WHERE lists.id = list_items.list_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can manage list items"
  ON list_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN family_members ON family_members.family_id = lists.family_id
      WHERE lists.id = list_items.list_id
      AND family_members.user_id = auth.uid()
    )
  );

-- Meal plans policies
CREATE POLICY "Family members can view meal plans"
  ON meal_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = meal_plans.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can manage meal plans"
  ON meal_plans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = meal_plans.family_id
      AND family_members.user_id = auth.uid()
    )
  );

-- Reminders policies
CREATE POLICY "Family members can view reminders"
  ON reminders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = reminders.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can manage reminders"
  ON reminders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = reminders.family_id
      AND family_members.user_id = auth.uid()
    )
  );

-- Notes policies
CREATE POLICY "Family members can view notes"
  ON notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = notes.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can manage notes"
  ON notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = notes.family_id
      AND family_members.user_id = auth.uid()
    )
  );

-- Posts policies
CREATE POLICY "Users can view family posts"
  ON posts FOR SELECT
  USING (
    visibility = 'public' OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = posts.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can create posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = posts.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update their posts"
  ON posts FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their posts"
  ON posts FOR DELETE
  USING (author_id = auth.uid());

-- Post likes policies
CREATE POLICY "Authenticated users can view likes"
  ON post_likes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  USING (user_id = auth.uid());

-- Post comments policies
CREATE POLICY "Authenticated users can view comments"
  ON post_comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can comment"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their comments"
  ON post_comments FOR DELETE
  USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Saved places policies
CREATE POLICY "Family members can view saved places"
  ON saved_places FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = saved_places.family_id
      AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can manage saved places"
  ON saved_places FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM family_members
      WHERE family_members.family_id = saved_places.family_id
      AND family_members.user_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE BUCKETS SETUP NOTE
-- ============================================
-- IMPORTANT: After running this migration, manually create these two Storage buckets in Supabase dashboard:
-- 1. Bucket name: "avatars" - Set to PUBLIC
-- 2. Bucket name: "posts" - Set to PUBLIC
