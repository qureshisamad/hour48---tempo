-- Remove the line that's causing the error
-- The technicians table is already part of the supabase_realtime publication

-- Create policy to allow authenticated users to insert technician records
CREATE POLICY "Users can create their own technician profile"
ON technicians
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
