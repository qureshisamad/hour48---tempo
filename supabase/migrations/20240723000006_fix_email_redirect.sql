-- Update the auth.email_templates to use the correct redirect URL
UPDATE auth.email_templates
SET template = REPLACE(template, 'http://localhost:3000', '{{.SiteURL}}')
WHERE template LIKE '%http://localhost:3000%';

-- Also update any other hardcoded URLs
UPDATE auth.email_templates
SET template = REPLACE(template, 'http://localhost:5173', '{{.SiteURL}}')
WHERE template LIKE '%http://localhost:5173%';

-- Update the redirect_to column in auth.identities
UPDATE auth.identities
SET identity_data = jsonb_set(
  identity_data,
  '{email_confirm_redirect_url}',
  to_jsonb('{{.SiteURL}}/verify-otp'::text)
)
WHERE identity_data->>'email_confirm_redirect_url' LIKE 'http://localhost%';
