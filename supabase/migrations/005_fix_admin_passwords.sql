-- =============================================================================
-- Migration: Fix Admin Passwords to use SHA-256
-- Description: Update existing admin users to use SHA-256 hashes instead of bcrypt
-- Version: 005
-- =============================================================================

-- Update admin user passwords to use SHA-256 hashes
-- Password: "admin123" 
-- SHA-256 hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

UPDATE public.admin_users 
SET password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE email IN ('admin@adastra.com', 'test@adastra.com');

-- Reset failed login attempts for all users
UPDATE public.admin_users 
SET failed_login_attempts = 0, locked_until = NULL
WHERE failed_login_attempts > 0 OR locked_until IS NOT NULL;

-- Update the password validation function comment
COMMENT ON FUNCTION validate_admin_login IS 'Validate admin login with SHA-256 password hash'; 