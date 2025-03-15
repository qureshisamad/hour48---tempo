-- Fix clients table RLS policy to allow insertion during signup

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Clients can insert their own profile" ON clients;

-- Create policy to allow clients to insert their own profile
CREATE POLICY "Clients can insert their own profile"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add a public access policy for clients table to allow insertion during signup
DROP POLICY IF EXISTS "Public access to clients" ON clients;
CREATE POLICY "Public access to clients"
  ON clients FOR SELECT
  USING (true);
