-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON technicians;
DROP POLICY IF EXISTS "Enable read access for all users" ON technicians;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON technicians;

-- Create new policies with proper conditions
CREATE POLICY "Enable insert for authenticated users only"
ON technicians
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON technicians
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable update for users based on user_id"
ON technicians
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
