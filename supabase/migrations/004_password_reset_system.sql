-- =============================================================================
-- Migration: Password Reset System
-- Description: Add password reset functionality with secure tokens and email tracking
-- Version: 004
-- =============================================================================

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS public.admin_password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_password_reset_tokens_admin_user_id ON public.admin_password_reset_tokens(admin_user_id);
CREATE INDEX idx_password_reset_tokens_token_hash ON public.admin_password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_expires_at ON public.admin_password_reset_tokens(expires_at);

-- Create email logs table for tracking password reset emails
CREATE TABLE IF NOT EXISTS public.admin_email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    email_type TEXT NOT NULL CHECK (email_type IN ('password_reset', 'account_locked', 'login_alert', 'welcome')),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_data JSONB DEFAULT '{}',
    sent_at TIMESTAMPTZ NULL,
    delivered_at TIMESTAMPTZ NULL,
    failed_at TIMESTAMPTZ NULL,
    failure_reason TEXT NULL,
    email_provider TEXT DEFAULT 'console', -- 'console', 'sendgrid', 'ses', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for email logs
CREATE INDEX idx_admin_email_logs_admin_user_id ON public.admin_email_logs(admin_user_id);
CREATE INDEX idx_admin_email_logs_email_type ON public.admin_email_logs(email_type);
CREATE INDEX idx_admin_email_logs_sent_at ON public.admin_email_logs(sent_at);

-- Add updated_at trigger for password reset tokens
CREATE OR REPLACE FUNCTION public.update_admin_password_reset_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_admin_password_reset_tokens_updated_at
    BEFORE UPDATE ON public.admin_password_reset_tokens
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_password_reset_tokens_updated_at();

-- Add updated_at trigger for email logs
CREATE OR REPLACE FUNCTION public.update_admin_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_admin_email_logs_updated_at
    BEFORE UPDATE ON public.admin_email_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_email_logs_updated_at();

-- Enable RLS
ALTER TABLE public.admin_password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_password_reset_tokens
CREATE POLICY "Service role can manage password reset tokens" ON public.admin_password_reset_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for admin_email_logs  
CREATE POLICY "Service role can manage email logs" ON public.admin_email_logs
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- Password Reset Functions
-- =============================================================================

-- Function to initiate password reset
CREATE OR REPLACE FUNCTION public.initiate_password_reset(
    p_email TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    token TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_token TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- Find user by email
    SELECT id INTO v_user_id
    FROM public.admin_users 
    WHERE email = LOWER(p_email) AND is_active = true;
    
    -- Always return success to prevent email enumeration
    -- But only actually create token if user exists
    IF v_user_id IS NOT NULL THEN
        -- Generate secure token (32 bytes = 64 hex chars)
        v_token := encode(gen_random_bytes(32), 'hex');
        
        -- Hash the token for storage
        v_token_hash := encode(sha256(v_token::bytea), 'hex');
        
        -- Set expiration (15 minutes)
        v_expires_at := NOW() + interval '15 minutes';
        
        -- Invalidate any existing tokens for this user
        UPDATE public.admin_password_reset_tokens 
        SET used_at = NOW()
        WHERE admin_user_id = v_user_id AND used_at IS NULL;
        
        -- Create new token
        INSERT INTO public.admin_password_reset_tokens (
            admin_user_id,
            token_hash,
            expires_at
        ) VALUES (
            v_user_id,
            v_token_hash,
            v_expires_at
        );
        
        -- Log email request
        INSERT INTO public.admin_email_logs (
            admin_user_id,
            email_type,
            recipient_email,
            subject,
            template_data
        ) VALUES (
            v_user_id,
            'password_reset',
            p_email,
            'Password Reset Request',
            jsonb_build_object(
                'token', v_token,
                'expires_at', v_expires_at::text
            )
        );
        
        RETURN QUERY SELECT 
            true, 
            'Password reset email sent if account exists',
            v_token;
    ELSE
        -- Still return success but with empty token
        RETURN QUERY SELECT 
            true, 
            'Password reset email sent if account exists',
            ''::TEXT;
    END IF;
END;
$$;

-- Function to validate password reset token
CREATE OR REPLACE FUNCTION public.validate_password_reset_token(
    p_token TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    user_id UUID,
    email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record public.admin_password_reset_tokens%ROWTYPE;
    v_user_record public.admin_users%ROWTYPE;
BEGIN
    -- Hash the provided token
    v_token_hash := encode(sha256(p_token::bytea), 'hex');
    
    -- Find token
    SELECT * INTO v_token_record
    FROM public.admin_password_reset_tokens 
    WHERE token_hash = v_token_hash 
      AND used_at IS NULL
      AND expires_at > NOW();
    
    -- Check if token exists and is valid
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            false, 
            'Invalid or expired reset token',
            NULL::UUID,
            NULL::TEXT;
        RETURN;
    END IF;
    
    -- Get user details
    SELECT * INTO v_user_record
    FROM public.admin_users 
    WHERE id = v_token_record.admin_user_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            false, 
            'User account not found or inactive',
            NULL::UUID,
            NULL::TEXT;
        RETURN;
    END IF;
    
    -- Return success
    RETURN QUERY SELECT 
        true, 
        'Token is valid',
        v_user_record.id,
        v_user_record.email;
END;
$$;

-- Function to reset password with token
CREATE OR REPLACE FUNCTION public.reset_password_with_token(
    p_token TEXT,
    p_new_password_hash TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record public.admin_password_reset_tokens%ROWTYPE;
BEGIN
    -- Hash the provided token
    v_token_hash := encode(sha256(p_token::bytea), 'hex');
    
    -- Find and validate token
    SELECT * INTO v_token_record
    FROM public.admin_password_reset_tokens 
    WHERE token_hash = v_token_hash 
      AND used_at IS NULL
      AND expires_at > NOW();
    
    -- Check if token exists and is valid
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            false, 
            'Invalid or expired reset token';
        RETURN;
    END IF;
    
    -- Update password
    UPDATE public.admin_users 
    SET 
        password_hash = p_new_password_hash,
        failed_login_attempts = 0,
        locked_until = NULL,
        updated_at = NOW()
    WHERE id = v_token_record.admin_user_id AND is_active = true;
    
    -- Mark token as used
    UPDATE public.admin_password_reset_tokens 
    SET used_at = NOW()
    WHERE id = v_token_record.id;
    
    -- Log activity
    INSERT INTO public.admin_activity_log (
        admin_user_id,
        action,
        description,
        success,
        metadata
    ) VALUES (
        v_token_record.admin_user_id,
        'password_reset',
        'Password reset via email token',
        true,
        jsonb_build_object('method', 'email_token')
    );
    
    RETURN QUERY SELECT 
        true, 
        'Password reset successfully';
END;
$$;

-- Function to cleanup expired tokens (should be run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_password_reset_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.admin_password_reset_tokens
    WHERE expires_at < NOW() - interval '1 day';
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;

-- =============================================================================
-- Comments
-- =============================================================================

COMMENT ON TABLE public.admin_password_reset_tokens IS 'Secure password reset tokens for admin users';
COMMENT ON TABLE public.admin_email_logs IS 'Log of all emails sent to admin users';

COMMENT ON FUNCTION public.initiate_password_reset IS 'Create password reset token and log email request';
COMMENT ON FUNCTION public.validate_password_reset_token IS 'Validate a password reset token';
COMMENT ON FUNCTION public.reset_password_with_token IS 'Reset password using valid token';
COMMENT ON FUNCTION public.cleanup_expired_password_reset_tokens IS 'Clean up expired password reset tokens'; 