-- Create leads management system tables
-- Migration: 002_create_leads_tables.sql

-- =============================================================================
-- LEADS TABLE - Core lead information and management
-- =============================================================================
CREATE TABLE public.leads (
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
    source text NOT NULL DEFAULT 'unknown', -- 'assessment', 'hero_form', 'contact_page', 'referral', 'organic'
    source_details jsonb DEFAULT '{}', -- Additional source context
    utm_source text,
    utm_medium text,
    utm_campaign text,
    utm_content text,
    utm_term text,
    referrer_url text,
    landing_page text,
    
    -- Assessment Integration
    assessment_id uuid,
    assessment_completed boolean DEFAULT false,
    assessment_score integer,
    assessment_data jsonb DEFAULT '{}', -- Store full assessment responses
    
    -- Business Context
    company_size text, -- '1-10', '11-50', '51-200', '201-500', '500+'
    process_volume text, -- 'low', 'medium', 'high'
    timeline_expectation text, -- '1-3 months', '3-6 months', '6-12 months', '1+ year'
    annual_revenue text, -- '$0-1M', '$1-10M', '$10-50M', '$50M+'
    current_tools text[], -- Array of current tools/systems they use
    pain_points text[], -- Array of key challenges
    
    -- Lead Management
    status text DEFAULT 'new' CHECK (status IN (
        'new', 'contacted', 'qualified', 'demo_scheduled', 'proposal_sent', 
        'negotiation', 'closed_won', 'closed_lost', 'nurturing', 'unresponsive'
    )),
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    lead_score integer DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    qualification_score integer DEFAULT 0 CHECK (qualification_score >= 0 AND qualification_score <= 100),
    
    -- Assignment & Ownership
    assigned_to text, -- User ID or email of assigned team member
    assigned_at timestamp with time zone,
    
    -- Categorization
    tags text[] DEFAULT '{}',
    lead_type text DEFAULT 'prospect' CHECK (lead_type IN ('prospect', 'marketing_qualified', 'sales_qualified', 'opportunity', 'customer')),
    
    -- Communication & Notes
    notes text,
    internal_notes text, -- Private notes not visible to lead
    
    -- Engagement Tracking
    last_activity_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    last_contact_at timestamp with time zone,
    next_follow_up_at timestamp with time zone,
    
    -- Email Engagement
    email_opens integer DEFAULT 0,
    email_clicks integer DEFAULT 0,
    email_bounces integer DEFAULT 0,
    email_unsubscribed boolean DEFAULT false,
    
    -- Website Engagement  
    website_sessions integer DEFAULT 1,
    page_views integer DEFAULT 1,
    time_on_site integer DEFAULT 0, -- seconds
    pages_visited text[] DEFAULT '{}',
    
    -- Opportunity & Financial
    estimated_deal_value numeric DEFAULT 0,
    estimated_monthly_value numeric DEFAULT 0,
    estimated_close_date date,
    probability integer DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    
    -- Lifecycle
    first_contact_date timestamp with time zone,
    last_qualification_date timestamp with time zone,
    conversion_date timestamp with time zone,
    
    -- Metadata
    custom_fields jsonb DEFAULT '{}',
    integration_data jsonb DEFAULT '{}', -- For CRM integrations
    
    -- Constraints
    CONSTRAINT leads_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT leads_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[\d\s\-\(\)\.]+$')
);

-- =============================================================================
-- LEAD ACTIVITIES TABLE - Activity timeline and interaction history
-- =============================================================================
CREATE TABLE public.lead_activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Activity Details
    activity_type text NOT NULL CHECK (activity_type IN (
        'email_sent', 'email_opened', 'email_clicked', 'email_replied',
        'call_made', 'call_received', 'voicemail_left', 'voicemail_received',
        'meeting_scheduled', 'meeting_completed', 'demo_completed',
        'proposal_sent', 'contract_sent', 'contract_signed',
        'note_added', 'status_changed', 'score_changed', 'assigned',
        'website_visit', 'page_view', 'form_submitted', 'download',
        'social_interaction', 'referral_made', 'assessment_started', 'assessment_completed'
    )),
    
    title text NOT NULL,
    description text,
    
    -- Context & Metadata
    performed_by text, -- User who performed the activity
    automated boolean DEFAULT false, -- Whether this was an automated activity
    
    -- Activity-specific data
    metadata jsonb DEFAULT '{}', -- Flexible storage for activity-specific data
    
    -- Email-specific fields
    email_subject text,
    email_template_id text,
    email_status text, -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
    
    -- Call-specific fields
    call_duration integer, -- seconds
    call_outcome text, -- 'connected', 'voicemail', 'no_answer', 'busy'
    call_notes text,
    
    -- Meeting-specific fields
    meeting_type text, -- 'discovery', 'demo', 'proposal', 'closing'
    meeting_duration integer, -- minutes
    meeting_attendees text[],
    
    -- System tracking
    ip_address inet,
    user_agent text,
    referrer_url text,
    
    -- Integration data
    external_id text, -- ID from external systems (CRM, email tools, etc.)
    external_system text -- Which external system this came from
);

-- =============================================================================
-- LEAD SCORING RULES TABLE - Configurable lead scoring
-- =============================================================================
CREATE TABLE public.lead_scoring_rules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    name text NOT NULL,
    description text,
    category text NOT NULL, -- 'demographic', 'behavioral', 'engagement', 'firmographic'
    
    -- Rule Logic
    field_name text NOT NULL, -- What field to evaluate
    operator text NOT NULL CHECK (operator IN ('equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'in', 'not_in')),
    value text NOT NULL, -- Value to compare against
    score_impact integer NOT NULL, -- Points to add/subtract
    
    -- Rule Settings
    is_active boolean DEFAULT true,
    priority integer DEFAULT 0, -- Higher priority rules are evaluated first
    
    -- Constraints
    created_by text,
    notes text
);

-- =============================================================================
-- INDEXES for Performance
-- =============================================================================

-- Leads table indexes
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_company ON public.leads(company);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_updated_at ON public.leads(updated_at);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_lead_score ON public.leads(lead_score);
CREATE INDEX idx_leads_priority ON public.leads(priority);
CREATE INDEX idx_leads_assessment_id ON public.leads(assessment_id);
CREATE INDEX idx_leads_last_activity ON public.leads(last_activity_at);
CREATE INDEX idx_leads_next_follow_up ON public.leads(next_follow_up_at);

-- Composite indexes for common queries
CREATE INDEX idx_leads_status_priority ON public.leads(status, priority);
CREATE INDEX idx_leads_assigned_status ON public.leads(assigned_to, status);
CREATE INDEX idx_leads_source_status ON public.leads(source, status);

-- Lead activities indexes
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_created_at ON public.lead_activities(created_at);
CREATE INDEX idx_lead_activities_type ON public.lead_activities(activity_type);
CREATE INDEX idx_lead_activities_performed_by ON public.lead_activities(performed_by);

-- Composite index for activity timeline
CREATE INDEX idx_lead_activities_lead_timeline ON public.lead_activities(lead_id, created_at DESC);

-- Lead scoring rules indexes
CREATE INDEX idx_scoring_rules_active ON public.lead_scoring_rules(is_active);
CREATE INDEX idx_scoring_rules_category ON public.lead_scoring_rules(category);
CREATE INDEX idx_scoring_rules_priority ON public.lead_scoring_rules(priority);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_rules ENABLE ROW LEVEL SECURITY;

-- Leads table policies
CREATE POLICY "Allow all operations on leads" ON public.leads
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Lead activities policies  
CREATE POLICY "Allow all operations on lead_activities" ON public.lead_activities
    FOR ALL
    USING (true) 
    WITH CHECK (true);

-- Lead scoring rules policies
CREATE POLICY "Allow read access to scoring rules" ON public.lead_scoring_rules
    FOR SELECT
    USING (true);

CREATE POLICY "Allow admin operations on scoring rules" ON public.lead_scoring_rules
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- TRIGGERS for Automatic Updates
-- =============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_leads
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_scoring_rules
    BEFORE UPDATE ON public.lead_scoring_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to update last_activity_at when activities are added
CREATE OR REPLACE FUNCTION public.update_lead_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.leads 
    SET last_activity_at = NEW.created_at
    WHERE id = NEW.lead_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last activity
CREATE TRIGGER update_lead_activity_timestamp
    AFTER INSERT ON public.lead_activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_lead_last_activity();

-- =============================================================================
-- INITIAL LEAD SCORING RULES
-- =============================================================================
INSERT INTO public.lead_scoring_rules (name, description, category, field_name, operator, value, score_impact, priority) VALUES 
-- Demographic scoring
('Enterprise Email Domain', 'Company email (not gmail/yahoo/etc)', 'demographic', 'email', 'not_contains', '@gmail.com,@yahoo.com,@hotmail.com,@outlook.com', 10, 100),
('Has Company', 'Lead provided company name', 'demographic', 'company', 'not_equals', '', 5, 90),
('Has Phone', 'Lead provided phone number', 'demographic', 'phone', 'not_equals', '', 5, 85),

-- Firmographic scoring
('Large Company Size', 'Company has 200+ employees', 'firmographic', 'company_size', 'in', '201-500,500+', 15, 80),
('Medium Company Size', 'Company has 50-200 employees', 'firmographic', 'company_size', 'equals', '51-200', 10, 75),
('High Revenue Company', 'Annual revenue $10M+', 'firmographic', 'annual_revenue', 'in', '$10-50M,$50M+', 20, 70),

-- Behavioral scoring
('Assessment Completed', 'Completed full assessment', 'behavioral', 'assessment_completed', 'equals', 'true', 25, 60),
('High Assessment Score', 'Assessment score above 80', 'behavioral', 'assessment_score', 'greater_than', '80', 15, 55),
('Medium Assessment Score', 'Assessment score 60-80', 'behavioral', 'assessment_score', 'greater_than', '60', 10, 50),

-- Engagement scoring
('Multiple Website Sessions', 'More than 3 website sessions', 'engagement', 'website_sessions', 'greater_than', '3', 10, 40),
('Email Engagement', 'Opened emails', 'engagement', 'email_opens', 'greater_than', '0', 5, 30),
('High Page Views', 'Viewed many pages', 'engagement', 'page_views', 'greater_than', '5', 8, 25),

-- Timeline scoring (urgency)
('Urgent Timeline', 'Needs solution in 1-3 months', 'demographic', 'timeline_expectation', 'equals', '1-3 months', 15, 20),
('Near-term Timeline', 'Needs solution in 3-6 months', 'demographic', 'timeline_expectation', 'equals', '3-6 months', 10, 15);

-- =============================================================================
-- COMMENTS for Documentation
-- =============================================================================
COMMENT ON TABLE public.leads IS 'Core leads management table storing prospect and customer information';
COMMENT ON TABLE public.lead_activities IS 'Activity timeline and interaction history for leads';
COMMENT ON TABLE public.lead_scoring_rules IS 'Configurable rules for automatic lead scoring';

COMMENT ON COLUMN public.leads.lead_score IS 'Calculated lead score (0-100) based on scoring rules';
COMMENT ON COLUMN public.leads.qualification_score IS 'Manual qualification score set by sales team';
COMMENT ON COLUMN public.leads.assessment_data IS 'Full assessment responses stored as JSON';
COMMENT ON COLUMN public.leads.custom_fields IS 'Flexible storage for additional lead data';
COMMENT ON COLUMN public.leads.integration_data IS 'Data from external CRM/marketing tools'; 