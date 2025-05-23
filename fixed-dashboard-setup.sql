-- ========================================================================
-- FIXED DASHBOARD SETUP FOR AD ASTRA PROCESS OPTIMUS
-- Step-by-step approach to ensure all tables exist before data insertion
-- ========================================================================

-- =============================================================================
-- 1. HELPER FUNCTIONS
-- =============================================================================

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 2. CREATE ALL TABLES FIRST
-- =============================================================================

-- Create permissions table FIRST
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    color TEXT DEFAULT '#6b7280',
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create role permissions table
CREATE TABLE IF NOT EXISTS public.admin_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.admin_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.admin_permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

-- Create user roles table (depends on admin_users existing)
CREATE TABLE IF NOT EXISTS public.admin_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.admin_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT unique_user_role UNIQUE (admin_user_id, role_id)
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Contact Information
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    industry text,
    job_title text,
    
    -- Lead Source & Attribution
    source text NOT NULL DEFAULT 'unknown',
    source_details jsonb DEFAULT '{}',
    utm_source text,
    utm_medium text,
    utm_campaign text,
    referrer_url text,
    landing_page text,
    
    -- Assessment Integration
    assessment_id uuid,
    assessment_completed boolean DEFAULT false,
    assessment_score integer,
    assessment_data jsonb DEFAULT '{}',
    
    -- Business Context
    company_size text,
    process_volume text,
    timeline_expectation text,
    annual_revenue text,
    current_tools text[],
    pain_points text[],
    
    -- Lead Management
    status text DEFAULT 'new' CHECK (status IN (
        'new', 'contacted', 'qualified', 'demo_scheduled', 'proposal_sent', 
        'negotiation', 'closed_won', 'closed_lost', 'nurturing', 'unresponsive'
    )),
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    lead_score integer DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    qualification_score integer DEFAULT 0 CHECK (qualification_score >= 0 AND qualification_score <= 100),
    
    -- Assignment & Ownership
    assigned_to text,
    assigned_at timestamp with time zone,
    
    -- Categorization
    tags text[] DEFAULT '{}',
    lead_type text DEFAULT 'prospect' CHECK (lead_type IN ('prospect', 'marketing_qualified', 'sales_qualified', 'opportunity', 'customer')),
    
    -- Communication & Notes
    notes text,
    internal_notes text,
    
    -- Engagement Tracking
    last_activity_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    last_contact_at timestamp with time zone,
    next_follow_up_at timestamp with time zone,
    
    -- Email & Website Engagement
    email_opens integer DEFAULT 0,
    email_clicks integer DEFAULT 0,
    website_sessions integer DEFAULT 1,
    page_views integer DEFAULT 1,
    
    -- Opportunity & Financial
    estimated_deal_value numeric DEFAULT 0,
    estimated_monthly_value numeric DEFAULT 0,
    estimated_close_date date,
    probability integer DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    
    -- Metadata
    custom_fields jsonb DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT leads_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create lead activities table
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    activity_type text NOT NULL CHECK (activity_type IN (
        'email_sent', 'email_opened', 'call_made', 'meeting_scheduled', 
        'note_added', 'status_changed', 'website_visit', 'assessment_completed'
    )),
    
    title text NOT NULL,
    description text,
    performed_by text,
    automated boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'
);

-- =============================================================================
-- 3. CREATE INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON public.lead_activities(lead_id);

-- =============================================================================
-- 4. ENABLE RLS AND CREATE POLICIES
-- =============================================================================

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow all on lead_activities" ON public.lead_activities;
DROP POLICY IF EXISTS "Allow all on admin_permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Allow all on admin_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Allow all on admin_role_permissions" ON public.admin_role_permissions;
DROP POLICY IF EXISTS "Allow all on admin_user_roles" ON public.admin_user_roles;

-- Create policies
CREATE POLICY "Allow all on leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on lead_activities" ON public.lead_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin_permissions" ON public.admin_permissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin_roles" ON public.admin_roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin_role_permissions" ON public.admin_role_permissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin_user_roles" ON public.admin_user_roles FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- 5. CREATE TRIGGERS
-- =============================================================================

DROP TRIGGER IF EXISTS set_updated_at_leads ON public.leads;
CREATE TRIGGER set_updated_at_leads
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 6. CREATE FUNCTIONS
-- =============================================================================

-- Function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
RETURNS TABLE(permission_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT p.name
    FROM admin_permissions p
    JOIN admin_role_permissions rp ON p.id = rp.permission_id
    JOIN admin_user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.admin_user_id = p_user_id 
    AND ur.is_active = true
    AND p.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(p_user_id UUID)
RETURNS TABLE(
    role_id UUID,
    role_name TEXT,
    display_name TEXT,
    description TEXT,
    level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.name, r.display_name, r.description, r.level
    FROM admin_roles r
    JOIN admin_user_roles ur ON r.id = ur.role_id
    WHERE ur.admin_user_id = p_user_id 
    AND ur.is_active = true
    AND r.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 7. INSERT SAMPLE DATA (only after all tables exist)
-- =============================================================================

-- Insert permissions
INSERT INTO public.admin_permissions (name, description, category, resource, action) VALUES
('dashboard_view', 'View dashboard overview', 'dashboard', 'dashboard', 'read'),
('leads_view', 'View leads list and details', 'leads', 'lead', 'read'),
('leads_create', 'Create new leads', 'leads', 'lead', 'create'),
('leads_update', 'Update existing leads', 'leads', 'lead', 'update'),
('users_view', 'View admin users list', 'users', 'admin_user', 'read'),
('users_manage', 'Manage admin users', 'users', 'admin_user', 'update')
ON CONFLICT (name) DO NOTHING;

-- Insert roles
INSERT INTO public.admin_roles (name, display_name, description, level, is_system_role) VALUES
('super_admin', 'Super Administrator', 'Full system access', 100, true),
('admin', 'Administrator', 'Standard admin access', 80, true),
('user', 'User', 'Basic user access', 20, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample leads
INSERT INTO public.leads (
    name, email, company, industry, job_title, source, status, priority, 
    lead_score, phone, company_size, timeline_expectation, notes
) VALUES
('John Smith', 'john.smith@techcorp.com', 'TechCorp Inc', 'Technology', 'CTO', 'website', 'new', 'high', 85, '+1-555-0123', '51-200', '3-6 months', 'Interested in process automation'),
('Sarah Johnson', 'sarah.j@manufacturing.com', 'Manufacturing Co', 'Manufacturing', 'Operations Manager', 'referral', 'contacted', 'medium', 72, '+1-555-0456', '201-500', '6-12 months', 'Looking to optimize production workflows'),
('Mike Chen', 'mike.chen@startup.io', 'StartupIO', 'Software', 'Founder', 'assessment', 'qualified', 'high', 93, '+1-555-0789', '1-10', '1-3 months', 'Completed assessment with high score'),
('Lisa Brown', 'lisa.brown@consulting.com', 'Consulting Partners', 'Consulting', 'Partner', 'organic', 'demo_scheduled', 'urgent', 88, '+1-555-0321', '11-50', '1-3 months', 'Demo scheduled for next week'),
('David Wilson', 'david.w@healthcare.org', 'Healthcare Solutions', 'Healthcare', 'Director of Operations', 'hero_form', 'nurturing', 'low', 45, '+1-555-0654', '500+', '1+ year', 'Long-term potential, budget constraints')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 8. ASSIGN PERMISSIONS TO ROLES AND USERS
-- =============================================================================

-- Assign permissions to roles
DO $$
DECLARE
    super_admin_role_id UUID;
    admin_role_id UUID;
    user_role_id UUID;
    user_admin_id UUID;
BEGIN
    -- Get role IDs
    SELECT id INTO super_admin_role_id FROM admin_roles WHERE name = 'super_admin';
    SELECT id INTO admin_role_id FROM admin_roles WHERE name = 'admin';
    SELECT id INTO user_role_id FROM admin_roles WHERE name = 'user';
    
    -- Assign all permissions to super admin
    INSERT INTO admin_role_permissions (role_id, permission_id)
    SELECT super_admin_role_id, id FROM admin_permissions
    ON CONFLICT (role_id, permission_id) DO NOTHING;
    
    -- Assign most permissions to admin (except users_manage)
    INSERT INTO admin_role_permissions (role_id, permission_id)
    SELECT admin_role_id, id FROM admin_permissions WHERE name != 'users_manage'
    ON CONFLICT (role_id, permission_id) DO NOTHING;
    
    -- Assign basic permissions to user
    INSERT INTO admin_role_permissions (role_id, permission_id)
    SELECT user_role_id, id FROM admin_permissions WHERE name IN ('dashboard_view', 'leads_view')
    ON CONFLICT (role_id, permission_id) DO NOTHING;
    
    -- Assign super admin role to admin user
    SELECT id INTO user_admin_id FROM admin_users WHERE email = 'admin@adastra.com';
    IF user_admin_id IS NOT NULL THEN
        INSERT INTO admin_user_roles (admin_user_id, role_id) VALUES
        (user_admin_id, super_admin_role_id)
        ON CONFLICT (admin_user_id, role_id) DO NOTHING;
    END IF;
END;
$$;

-- =============================================================================
-- 9. VERIFICATION
-- =============================================================================

SELECT 'Tables created successfully!' as status;
SELECT COUNT(*) as permissions_count FROM admin_permissions;
SELECT COUNT(*) as roles_count FROM admin_roles;
SELECT COUNT(*) as leads_count FROM leads;
SELECT 'Setup complete!' as result; 