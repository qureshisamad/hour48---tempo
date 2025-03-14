-- This migration adds a view to see auth.users data in the public schema

CREATE OR REPLACE VIEW public.users AS
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  created_at,
  updated_at,
  last_sign_in_at
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.users TO anon, authenticated, service_role;
