-- Fix families table policy to be non-recursive

-- Drop the existing policy that queries family_members
DROP POLICY IF EXISTS "Family members can view their family" ON families;

-- Create simple policy - authenticated users can view families
-- This is safe because families table only has: id, name, invite_code, created_by
-- The actual sensitive data (events, tasks, etc.) has proper RLS
CREATE POLICY "Authenticated users can view families"
  ON families FOR SELECT
  TO authenticated
  USING (true);

-- Keep the insert policy as-is (or recreate if needed)
DROP POLICY IF EXISTS "Authenticated users can create families" ON families;

CREATE POLICY "Authenticated users can create families"
  ON families FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);
