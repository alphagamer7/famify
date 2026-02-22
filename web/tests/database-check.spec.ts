import { test, expect } from '@playwright/test';

test('Check database state after login', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.getByLabel('Email').fill('john@famify-demo.com');
  await page.getByLabel('Password').fill('Demo123!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL(/\/(dashboard|family-setup)/, { timeout: 10000 });

  // Wait a bit for data to load
  await page.waitForTimeout(3000);

  // Execute database queries in the browser context
  const diagnostics = await page.evaluate(async () => {
    // Access the supabase client from window - it's exposed by the React app
    // @ts-ignore
    const { supabase } = window;

    const results: any = {};

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    results.userId = user?.id;
    results.userEmail = user?.email;

    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();
    results.profile = profile;
    results.profileError = profileError?.message;

    // Check family_members
    const { data: memberships, error: membershipError } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user?.id);
    results.memberships = memberships;
    results.membershipError = membershipError?.message;

    // Check families
    const { data: families, error: familiesError } = await supabase
      .from('families')
      .select('*');
    results.families = families;
    results.familiesError = familiesError?.message;

    // Check all family_members (to see if there's any data)
    const { data: allMembers, error: allMembersError } = await supabase
      .from('family_members')
      .select('*');
    results.allMembers = allMembers;
    results.allMembersError = allMembersError?.message;

    return results;
  });

  console.log('📊 Database Diagnostics:');
  console.log('========================');
  console.log('User ID:', diagnostics.userId);
  console.log('User Email:', diagnostics.userEmail);
  console.log('');
  console.log('Profile:', JSON.stringify(diagnostics.profile, null, 2));
  console.log('Profile Error:', diagnostics.profileError);
  console.log('');
  console.log('Memberships:', JSON.stringify(diagnostics.memberships, null, 2));
  console.log('Membership Error:', diagnostics.membershipError);
  console.log('');
  console.log('Families:', JSON.stringify(diagnostics.families, null, 2));
  console.log('Families Error:', diagnostics.familiesError);
  console.log('');
  console.log('All Members:', JSON.stringify(diagnostics.allMembers, null, 2));
  console.log('All Members Error:', diagnostics.allMembersError);

  // Take screenshot
  await page.screenshot({ path: 'database-check.png', fullPage: true });

  // Expectations
  expect(diagnostics.userId).toBeTruthy();
  expect(diagnostics.profile).toBeTruthy();
});
