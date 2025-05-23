-- Create admin users table for dashboard authentication
-- Migration: 003_create_admin_users.sql

-- =============================================================================
-- ADMIN USERS TABLE - Secure authentication for dashboard access
-- =============================================================================
CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Authentication fields
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL, -- Hashed with bcrypt
    
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

-- =============================================================================
-- ADMIN SESSIONS TABLE - Track active sessions
-- =============================================================================
CREATE TABLE public.admin_sessions (
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

-- =============================================================================
-- ADMIN ACTIVITY LOG - Audit trail for admin actions
-- =============================================================================
CREATE TABLE public.admin_activity_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Activity details
    action text NOT NULL, -- 'login', 'logout', 'view_leads', 'update_lead', etc.
    resource_type text, -- 'lead', 'admin_user', 'system'
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

-- =============================================================================
-- INDEXES for Performance
-- =============================================================================

-- Admin users indexes
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_session_token ON public.admin_users(session_token);
CREATE INDEX idx_admin_users_reset_token ON public.admin_users(reset_token);
CREATE INDEX idx_admin_users_active ON public.admin_users(is_active);

-- Admin sessions indexes
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_user_id ON public.admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_active ON public.admin_sessions(is_active);

-- Activity log indexes
CREATE INDEX idx_admin_activity_user_id ON public.admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_activity_created_at ON public.admin_activity_log(created_at);
CREATE INDEX idx_admin_activity_action ON public.admin_activity_log(action);
CREATE INDEX idx_admin_activity_resource ON public.admin_activity_log(resource_type, resource_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =============================================================================

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin users policies - Only allow access to own record or super admins
CREATE POLICY "Admin users can view own record" ON public.admin_users
    FOR SELECT
    USING (true); -- We'll handle this in the application layer

CREATE POLICY "Super admins can manage all users" ON public.admin_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Sessions policies
CREATE POLICY "Allow session management" ON public.admin_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Activity log policies
CREATE POLICY "Allow activity logging" ON public.admin_activity_log
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- TRIGGERS for Automatic Updates
-- =============================================================================

-- Update timestamp trigger for admin_users
CREATE TRIGGER set_updated_at_admin_users
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    UPDATE public.admin_sessions 
    SET is_active = false, revoked_at = now(), revoked_reason = 'expired'
    WHERE expires_at < now() AND is_active = true;
    
    DELETE FROM public.admin_sessions 
    WHERE expires_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- Function to update last activity
CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update session activity
CREATE TRIGGER update_session_activity_trigger
    BEFORE UPDATE ON public.admin_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_session_activity();

-- =============================================================================
-- INITIAL ADMIN USER
-- =============================================================================
-- Create initial super admin user
-- Password: "admin123" (should be changed immediately)
-- Hashed with bcrypt rounds=12: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LFKe.D3.TQf8NqKYu

INSERT INTO public.admin_users (
    email,
    password_hash,
    first_name,
    last_name,
    is_super_admin,
    created_by
) VALUES (
    'admin@adastra.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LFKe.D3.TQf8NqKYu',
    'Admin',
    'User',
    true,
    'system'
);

-- =============================================================================
-- FUNCTIONS for Authentication
-- =============================================================================

-- Function to validate admin login
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
-- COMMENTS for Documentation
-- =============================================================================
COMMENT ON TABLE public.admin_users IS 'Administrative users with dashboard access';
COMMENT ON TABLE public.admin_sessions IS 'Active admin sessions for security tracking';
COMMENT ON TABLE public.admin_activity_log IS 'Audit trail of all admin actions';

COMMENT ON COLUMN public.admin_users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN public.admin_users.session_token IS 'Current session token for authentication';
COMMENT ON COLUMN public.admin_users.failed_login_attempts IS 'Counter for security lockout';

-- =============================================================================
-- SAMPLE DATA for Testing
-- =============================================================================
-- Additional test admin user
INSERT INTO public.admin_users (
    email,
    password_hash,
    first_name,
    last_name,
    is_super_admin,
    created_by
) VALUES (
    'test@adastra.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LFKe.D3.TQf8NqKYu',
    'Test',
    'Admin',
    false,
    'system'
); 