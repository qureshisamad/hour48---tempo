-- Fix technician insert policy

-- Add policy to allow insertion of technician records
DROP POLICY IF EXISTS "Allow authenticated users to insert technicians" ON technicians;
CREATE POLICY "Allow authenticated users to insert technicians"
  ON technicians FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add policy to allow public access to technicians table for easier debugging
DROP POLICY IF EXISTS "Public access to technicians" ON technicians;
CREATE POLICY "Public access to technicians"
  ON technicians FOR SELECT
  USING (true);

-- Make sure realtime is enabled
ALTER PUBLICATION supabase_realtime ADD TABLE technicians;
