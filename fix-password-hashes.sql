-- Fix password hashes to use SHA-256 instead of bcrypt
-- The application uses SHA-256 hashing, not bcrypt

-- Update admin@adastra.com password hash
UPDATE public.admin_users 
SET password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE email = 'admin@adastra.com';

-- Update test@adastra.com password hash  
UPDATE public.admin_users 
SET password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE email = 'test@adastra.com';

-- Verify the updates
SELECT email, password_hash, first_name, last_name, is_super_admin
FROM public.admin_users 
WHERE email IN ('admin@adastra.com', 'test@adastra.com');

-- Test the login function with the new hash
SELECT 'Testing admin login with SHA-256 hash:' as test;
SELECT * FROM validate_admin_login('admin@adastra.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');

SELECT 'Testing test user login with SHA-256 hash:' as test;
SELECT * FROM validate_admin_login('test@adastra.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'); 