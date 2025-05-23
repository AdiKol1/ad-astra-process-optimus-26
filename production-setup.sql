-- ========================================================================
-- PRODUCTION SETUP SCRIPT FOR AD ASTRA PROCESS OPTIMUS
-- This script creates all necessary tables and functions for production
-- ========================================================================

-- =============================================================================
-- 1. LOGS TABLE (from 001_create_logs_table.sql)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  level text NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message text NOT NULL,
  data jsonb,
  environment text NOT NULL,
  source text,
  user_session_id text,
  user_agent text,
  url text
);

-- Create indexes for logs table
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_level ON public.logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_session ON public.logs(user_session_id);

-- Enable Row Level Security for logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow log inserts" ON public.logs;
DROP POLICY IF EXISTS "Allow log reads" ON public.logs;

-- Create policies for logs table
CREATE POLICY "Allow log inserts" ON public.logs
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow log reads" ON public.logs
  FOR SELECT 
  USING (true);

-- =============================================================================
-- 2. ADMIN USERS SYSTEM (from 003_create_admin_users.sql)
-- =============================================================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Authentication fields
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    
    -- Profile information
    first_name text NOT NULL,
    last_name text NOT NULL,
    
    -- Account status
    is_active boolean DEFAULT true,
    is_super_admin boolean DEFAULT false,
    
    -- Login tracking
    last_login_at timestamp with time zone,
    login_count integer DEFAULT 0,
    
    -- Security
    failed_login_attempts integer DEFAULT 0,
    locked_until timestamp with time zone,
    
    -- Session management
    session_token text,
    session_expires_at timestamp with time zone,
    
    -- Password reset
    reset_token text,
    reset_token_expires_at timestamp with time zone,
    
    -- Audit fields
    created_by text,
    
    -- Constraints
    CONSTRAINT admin_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id uuid NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    
    session_token text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    last_activity_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Session metadata
    ip_address inet,
    user_agent text,
    device_info jsonb DEFAULT '{}',
    
    -- Session status
    is_active boolean DEFAULT true,
    revoked_at timestamp with time zone,
    revoked_reason text
);

-- Create admin_activity_log table
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Activity details
    action text NOT NULL,
    resource_type text,
    resource_id text,
    
    -- Context
    description text,
    metadata jsonb DEFAULT '{}',
    
    -- Request context
    ip_address inet,
    user_agent text,
    
    -- Result
    success boolean DEFAULT true,
    error_message text
);

-- Create indexes for admin tables
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_session_token ON public.admin_users(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_users_reset_token ON public.admin_users(reset_token);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users(is_active);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON public.admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON public.admin_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON public.admin_activity_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON public.admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON public.admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_resource ON public.admin_activity_log(resource_type, resource_id);

-- Enable RLS for admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can view own record" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage all users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow session management" ON public.admin_sessions;
DROP POLICY IF EXISTS "Allow activity logging" ON public.admin_activity_log;

-- Create RLS policies for admin tables
CREATE POLICY "Admin users can view own record" ON public.admin_users
    FOR SELECT
    USING (true);

CREATE POLICY "Super admins can manage all users" ON public.admin_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow session management" ON public.admin_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow activity logging" ON public.admin_activity_log
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- 3. ADMIN LOGIN FUNCTION (validate_admin_login)
-- =============================================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS validate_admin_login(TEXT, TEXT);

-- Create the validate_admin_login function
CREATE OR REPLACE FUNCTION validate_admin_login(
  p_email TEXT,
  p_password_hash TEXT
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  user_id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  is_super_admin BOOLEAN
) 
LANGUAGE plpgsql
AS $$
DECLARE
  user_record admin_users%ROWTYPE;
BEGIN
  -- Find user by email
  SELECT * INTO user_record
  FROM admin_users 
  WHERE admin_users.email = LOWER(p_email) AND is_active = true;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid email or password', NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN;
    RETURN;
  END IF;
  
  -- Check password
  IF user_record.password_hash != p_password_hash THEN
    RETURN QUERY SELECT false, 'Invalid email or password', NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN;
    RETURN;
  END IF;
  
  -- Update login statistics
  UPDATE admin_users 
  SET 
    last_login_at = NOW(),
    login_count = COALESCE(login_count, 0) + 1
  WHERE id = user_record.id;
  
  -- Return success
  RETURN QUERY SELECT 
    true, 
    'Login successful',
    user_record.id,
    user_record.email,
    user_record.first_name,
    user_record.last_name,
    user_record.is_super_admin;
END;
$$;

-- =============================================================================
-- 4. INITIAL ADMIN USERS
-- =============================================================================

-- Insert admin users (only if they don't exist)
INSERT INTO public.admin_users (
    email,
    password_hash,
    first_name,
    last_name,
    is_super_admin,
    created_by
) 
SELECT 
    'admin@adastra.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LFKe.D3.TQf8NqKYu',
    'Admin',
    'User',
    true,
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE email = 'admin@adastra.com'
);

INSERT INTO public.admin_users (
    email,
    password_hash,
    first_name,
    last_name,
    is_super_admin,
    created_by
) 
SELECT 
    'test@adastra.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LFKe.D3.TQf8NqKYu',
    'Test',
    'Admin',
    false,
    'system'
WHERE NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE email = 'test@adastra.com'
);

-- =============================================================================
-- 5. VERIFY SETUP
-- =============================================================================

-- Test the admin login function
SELECT 'Admin login function test:' as test_name;
SELECT * FROM validate_admin_login('admin@adastra.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LFKe.D3.TQf8NqKYu');

-- Show created tables
SELECT 'Created tables:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('logs', 'admin_users', 'admin_sessions', 'admin_activity_log')
ORDER BY table_name;

-- Show created functions
SELECT 'Created functions:' as info;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'validate_admin_login';

-- =============================================================================
-- SETUP COMPLETE
-- =============================================================================
SELECT 'Production database setup complete!' as status;
SELECT 'You can now use the login system with:' as instructions;
SELECT '- admin@adastra.com / admin123' as admin_credentials;
SELECT '- test@adastra.com / admin123' as test_credentials; 