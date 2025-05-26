-- Safe Production Database Setup Script
-- This script checks for existing objects and only creates what's missing

-- Enable RLS if not already enabled
ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;

-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  business_context JSONB DEFAULT '{}',
  source TEXT DEFAULT 'website',
  utm_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('form_submission', 'email_sent', 'call_made', 'meeting_scheduled', 'note_added', 'status_changed', 'contact_message')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_leads_email' AND n.nspname = 'public') THEN
        CREATE INDEX idx_leads_email ON leads(email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_leads_created_at' AND n.nspname = 'public') THEN
        CREATE INDEX idx_leads_created_at ON leads(created_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_leads_status' AND n.nspname = 'public') THEN
        CREATE INDEX idx_leads_status ON leads(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_lead_activities_lead_id' AND n.nspname = 'public') THEN
        CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_lead_activities_created_at' AND n.nspname = 'public') THEN
        CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at);
    END IF;
END $$;

-- Create or replace updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Drop existing trigger if it exists, then recreate it
DROP TRIGGER IF EXISTS set_updated_at_leads ON leads;
CREATE TRIGGER set_updated_at_leads
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on both tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (using exception handling for safety)
DO $$
BEGIN
    -- Try to create policy for leads table
    BEGIN
        EXECUTE 'CREATE POLICY "Allow all operations" ON leads FOR ALL USING (true) WITH CHECK (true)';
    EXCEPTION 
        WHEN duplicate_object THEN
            -- Policy already exists, skip
            NULL;
    END;
    
    -- Try to create policy for lead_activities table  
    BEGIN
        EXECUTE 'CREATE POLICY "Allow all operations" ON lead_activities FOR ALL USING (true) WITH CHECK (true)';
    EXCEPTION 
        WHEN duplicate_object THEN
            -- Policy already exists, skip
            NULL;
    END;
END $$;

-- Insert sample data only if tables are empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM leads LIMIT 1) THEN
        INSERT INTO leads (name, email, company, role, business_context, source, status, score) VALUES
        ('John Doe', 'john@example.com', 'Tech Corp', 'CTO', '{"company_size": "50-100", "timeline": "immediate"}', 'assessment_form', 'new', 85),
        ('Jane Smith', 'jane@startup.com', 'Startup Inc', 'CEO', '{"company_size": "10-50", "timeline": "3_months"}', 'audit_form', 'contacted', 92),
        ('Mike Johnson', 'mike@enterprise.com', 'Enterprise LLC', 'Operations Manager', '{"company_size": "500+", "timeline": "6_months"}', 'contact_form', 'qualified', 78);
    END IF;
END $$;

-- Verify the setup
SELECT 'Setup completed successfully!' as status;
SELECT COUNT(*) as leads_count FROM leads;
SELECT COUNT(*) as activities_count FROM lead_activities; 