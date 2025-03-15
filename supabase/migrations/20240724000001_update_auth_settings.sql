-- Update auth settings to allow localhost URLs
UPDATE auth.config
SET redirect_urls = array_append(redirect_urls, 'http://localhost:5173/verify-otp');

UPDATE auth.config
SET redirect_urls = array_append(redirect_urls, 'http://localhost:5173/dashboard');

UPDATE auth.config
SET redirect_urls = array_append(redirect_urls, 'http://localhost:5173/login');

UPDATE auth.config
SET redirect_urls = array_append(redirect_urls, 'http://localhost:5173');

-- Enable email confirmations
UPDATE auth.config
SET enable_signup = true;
