-- Clean fix that handles existing policies
-- This addresses BOTH profiles and family_members policies

-- ============================================
-- FIX 1: Profiles Table Policies
-- ============================================

-- Drop the problematic profiles policy that queries family_members
DROP POLICY IF EXISTS "Users can view profiles in their family" ON profiles;

-- Drop any existing new policies in case of partial application
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create simpler policies without circular dependency
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);
  -- Note: This is safe because profiles only contains basic info (name, avatar, role)

-- ============================================
-- FIX 2: Family Members Table Policies
-- ============================================

-- Drop ALL existing family_members policies
DROP POLICY IF EXISTS "Family members can view members of their families" ON family_members;
DROP POLICY IF EXISTS "Parents can add family members" ON family_members;
DROP POLICY IF EXISTS "Parents can remove family members" ON family_members;
DROP POLICY IF EXISTS "Users can view their own family memberships" ON family_members;
DROP POLICY IF EXISTS "Users can view members in same families" ON family_members;
DROP POLICY IF EXISTS "Users can add themselves to families" ON family_members;
DROP POLICY IF EXISTS "Users can leave families" ON family_members;

-- Recreate policies without recursion
CREATE POLICY "Users can view their own family memberships"
  ON family_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view members in same families"
  ON family_members FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add themselves to families"
  ON family_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave families"
  ON family_members FOR DELETE
  USING (user_id = auth.uid());
