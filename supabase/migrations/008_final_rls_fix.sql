-- FINAL RLS FIX - Using helper function to avoid recursion

-- ============================================
-- STEP 1: Create helper function (bypasses RLS)
-- ============================================

-- This function checks if a user is a member of a family
-- SECURITY DEFINER means it runs with elevated privileges and bypasses RLS
CREATE OR REPLACE FUNCTION is_family_member(check_family_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM family_members
    WHERE family_id = check_family_id
      AND user_id = check_user_id
  );
END;
$$;

-- ============================================
-- STEP 2: Fix Profiles policies (simple)
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON profiles;

-- Simple: all authenticated users can view all profiles
-- Safe because profiles only has: id, name, avatar, role
CREATE POLICY "All authenticated can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- STEP 3: Fix Families policies (using helper)
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can view families" ON families;
DROP POLICY IF EXISTS "Authenticated users can create families" ON families;
DROP POLICY IF EXISTS "Users can view own families" ON families;
DROP POLICY IF EXISTS "Users can view member families" ON families;
DROP POLICY IF EXISTS "Users can create families" ON families;

-- Users can view families they created
CREATE POLICY "View own created families"
  ON families FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Users can view families they are members of (using helper function)
CREATE POLICY "View member families"
  ON families FOR SELECT
  TO authenticated
  USING (is_family_member(id, auth.uid()));

-- Users can create families
CREATE POLICY "Create families"
  ON families FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- ============================================
-- STEP 4: Fix Family Members policies (simple)
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can view family members" ON family_members;
DROP POLICY IF EXISTS "Users can add themselves to families" ON family_members;
DROP POLICY IF EXISTS "Users can remove themselves from families" ON family_members;
DROP POLICY IF EXISTS "Users can view own memberships" ON family_members;
DROP POLICY IF EXISTS "Users can view family member list" ON family_members;
DROP POLICY IF EXISTS "Users can join families" ON family_members;
DROP POLICY IF EXISTS "Users can leave families" ON family_members;

-- View all family members (safe, non-sensitive data)
CREATE POLICY "View all family members"
  ON family_members FOR SELECT
  TO authenticated
  USING (true);

-- Users can add themselves to families
CREATE POLICY "Join families"
  ON family_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can remove themselves
CREATE POLICY "Leave families"
  ON family_members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- WHY THIS WORKS
-- ============================================
-- 1. Profiles: Simple USING (true) - no recursion
-- 2. Families: Uses helper function that bypasses RLS - no recursion
-- 3. Family Members: Simple USING (true) - no recursion
-- 4. The helper function doesn't trigger RLS because of SECURITY DEFINER

-- This solves both problems:
-- - No infinite recursion
-- - No "6 rows" errors (policies are specific enough)
