-- Update auth settings to allow localhost URLs
INSERT INTO auth.config (redirect_urls)
VALUES (ARRAY['http://localhost:5173/verify-otp', 'http://localhost:5173/dashboard', 'http://localhost:5173/login', 'http://localhost:5173'])
ON CONFLICT (id) DO UPDATE
SET redirect_urls = array_cat(auth.config.redirect_urls, ARRAY['http://localhost:5173/verify-otp', 'http://localhost:5173/dashboard', 'http://localhost:5173/login', 'http://localhost:5173']);

-- Enable email confirmations
UPDATE auth.config
SET enable_signup = true
WHERE id = 1;
