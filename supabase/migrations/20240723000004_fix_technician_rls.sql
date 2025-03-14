-- First, make sure RLS is enabled on the technicians table
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be conflicting
DROP POLICY IF EXISTS "Users can create their own technician profile" ON technicians;
DROP POLICY IF EXISTS "Allow authenticated users to insert technicians" ON technicians;
DROP POLICY IF EXISTS "Public access to technicians" ON technicians;

-- Create a policy that allows authenticated users to insert their own technician profile
CREATE POLICY "Users can insert own technician profile"
  ON technicians FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to select technicians (for public viewing)
CREATE POLICY "Anyone can view technicians"
  ON technicians FOR SELECT
  USING (true);

-- Create a policy that allows users to update their own technician profile
CREATE POLICY "Users can update own technician profile"
  ON technicians FOR UPDATE
  USING (auth.uid() = user_id);
