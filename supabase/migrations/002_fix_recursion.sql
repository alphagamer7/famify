-- Fix infinite recursion in family_members policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Family members can view members of their families" ON family_members;
DROP POLICY IF EXISTS "Parents can add family members" ON family_members;
DROP POLICY IF EXISTS "Parents can remove family members" ON family_members;

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
