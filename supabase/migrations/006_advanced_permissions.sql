-- =============================================================================
-- Migration: Advanced Permissions System
-- Description: Implement role-based access control with granular permissions
-- Version: 006
-- =============================================================================

-- =============================================================================
-- PERMISSIONS TABLE - Define all available permissions in the system
-- =============================================================================
CREATE TABLE public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'dashboard', 'leads', 'users', 'analytics', 'settings'
    resource TEXT NOT NULL, -- 'lead', 'admin_user', 'dashboard', 'analytics'
    action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'export', 'import'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique permission combinations
    CONSTRAINT unique_permission_combo UNIQUE (resource, action)
);

-- =============================================================================
-- ROLES TABLE - Define user roles with hierarchical structure
-- =============================================================================
CREATE TABLE public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1, -- 1=lowest, 100=highest (super admin)
    color TEXT DEFAULT '#6b7280', -- Color for UI badges
    is_system_role BOOLEAN DEFAULT false, -- Cannot be deleted if true
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    
    -- Ensure level uniqueness for system roles
    CONSTRAINT unique_system_role_level UNIQUE (level, is_system_role) DEFERRABLE INITIALLY DEFERRED
);

-- =============================================================================
-- ROLE PERMISSIONS TABLE - Many-to-many relationship
-- =============================================================================
CREATE TABLE public.admin_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.admin_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.admin_permissions(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate role-permission assignments
    CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

-- =============================================================================
-- USER ROLES TABLE - Assign roles to users (users can have multiple roles)
-- =============================================================================
CREATE TABLE public.admin_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.admin_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NULL, -- NULL = never expires
    is_active BOOLEAN DEFAULT true,
    
    -- Prevent duplicate user-role assignments
    CONSTRAINT unique_user_role UNIQUE (admin_user_id, role_id)
);

-- =============================================================================
-- INDEXES for Performance
-- =============================================================================

-- Permissions indexes
CREATE INDEX idx_admin_permissions_category ON public.admin_permissions(category);
CREATE INDEX idx_admin_permissions_resource ON public.admin_permissions(resource);
CREATE INDEX idx_admin_permissions_active ON public.admin_permissions(is_active);

-- Roles indexes
CREATE INDEX idx_admin_roles_level ON public.admin_roles(level);
CREATE INDEX idx_admin_roles_active ON public.admin_roles(is_active);
CREATE INDEX idx_admin_roles_system ON public.admin_roles(is_system_role);

-- Role permissions indexes
CREATE INDEX idx_admin_role_permissions_role ON public.admin_role_permissions(role_id);
CREATE INDEX idx_admin_role_permissions_permission ON public.admin_role_permissions(permission_id);

-- User roles indexes
CREATE INDEX idx_admin_user_roles_user ON public.admin_user_roles(admin_user_id);
CREATE INDEX idx_admin_user_roles_role ON public.admin_user_roles(role_id);
CREATE INDEX idx_admin_user_roles_active ON public.admin_user_roles(is_active);
CREATE INDEX idx_admin_user_roles_expires ON public.admin_user_roles(expires_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =============================================================================

-- Enable RLS
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_user_roles ENABLE ROW LEVEL SECURITY;

-- Permissions policies (readable by all authenticated admins)
CREATE POLICY "Allow reading permissions" ON public.admin_permissions
    FOR SELECT USING (true);

-- Roles policies (readable by all authenticated admins)
CREATE POLICY "Allow reading roles" ON public.admin_roles
    FOR SELECT USING (true);

-- Role permissions policies
CREATE POLICY "Allow reading role permissions" ON public.admin_role_permissions
    FOR SELECT USING (true);

-- User roles policies
CREATE POLICY "Allow reading user roles" ON public.admin_user_roles
    FOR SELECT USING (true);

-- Management policies (for super admins and role managers)
CREATE POLICY "Allow permission management" ON public.admin_permissions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow role management" ON public.admin_roles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow role permission management" ON public.admin_role_permissions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow user role management" ON public.admin_user_roles
    FOR ALL USING (true) WITH CHECK (true);

-- =============================================================================
-- TRIGGERS for Automatic Updates
-- =============================================================================

-- Update timestamp triggers
CREATE TRIGGER set_updated_at_admin_permissions
    BEFORE UPDATE ON public.admin_permissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_admin_roles
    BEFORE UPDATE ON public.admin_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- PREDEFINED PERMISSIONS
-- =============================================================================

-- Dashboard permissions
INSERT INTO public.admin_permissions (name, description, category, resource, action) VALUES
('dashboard_view', 'View dashboard overview', 'dashboard', 'dashboard', 'read'),
('dashboard_export', 'Export dashboard data', 'dashboard', 'dashboard', 'export');

-- Lead management permissions
INSERT INTO public.admin_permissions (name, description, category, resource, action) VALUES
('leads_view', 'View leads list and details', 'leads', 'lead', 'read'),
('leads_create', 'Create new leads', 'leads', 'lead', 'create'),
('leads_update', 'Update existing leads', 'leads', 'lead', 'update'),
('leads_delete', 'Delete leads', 'leads', 'lead', 'delete'),
('leads_export', 'Export leads data', 'leads', 'lead', 'export'),
('leads_import', 'Import leads from files', 'leads', 'lead', 'import'),
('leads_bulk_actions', 'Perform bulk operations on leads', 'leads', 'lead', 'bulk_update'),
('leads_advanced_search', 'Use advanced search and filters', 'leads', 'lead', 'advanced_search');

-- User management permissions
INSERT INTO public.admin_permissions (name, description, category, resource, action) VALUES
('users_view', 'View admin users list', 'users', 'admin_user', 'read'),
('users_create', 'Create new admin users', 'users', 'admin_user', 'create'),
('users_update', 'Update admin user information', 'users', 'admin_user', 'update'),
('users_delete', 'Deactivate admin users', 'users', 'admin_user', 'delete'),
('users_reset_password', 'Reset user passwords', 'users', 'admin_user', 'reset_password'),
('users_manage_roles', 'Assign roles to users', 'users', 'admin_user', 'manage_roles'),
('users_view_activity', 'View user activity logs', 'users', 'admin_user', 'view_activity');

-- Analytics permissions
INSERT INTO public.admin_permissions (name, description, category, resource, action) VALUES
('analytics_view', 'View analytics dashboard', 'analytics', 'analytics', 'read'),
('analytics_advanced', 'Access advanced analytics features', 'analytics', 'analytics', 'advanced'),
('analytics_export', 'Export analytics reports', 'analytics', 'analytics', 'export'),
('analytics_custom_reports', 'Create custom reports', 'analytics', 'analytics', 'create_reports');

-- Settings permissions
INSERT INTO public.admin_permissions (name, description, category, resource, action) VALUES
('settings_view', 'View system settings', 'settings', 'settings', 'read'),
('settings_update', 'Update system settings', 'settings', 'settings', 'update'),
('settings_backup', 'Create system backups', 'settings', 'settings', 'backup'),
('settings_restore', 'Restore from backups', 'settings', 'settings', 'restore');

-- Permission management permissions
INSERT INTO public.admin_permissions (name, description, category, resource, action) VALUES
('permissions_view', 'View permissions and roles', 'users', 'permission', 'read'),
('permissions_manage', 'Manage permissions and roles', 'users', 'permission', 'update'),
('roles_create', 'Create new roles', 'users', 'role', 'create'),
('roles_update', 'Update existing roles', 'users', 'role', 'update'),
('roles_delete', 'Delete custom roles', 'users', 'role', 'delete');

-- =============================================================================
-- PREDEFINED ROLES
-- =============================================================================

-- Super Admin (Level 100) - Has all permissions
INSERT INTO public.admin_roles (name, display_name, description, level, color, is_system_role) VALUES
('super_admin', 'Super Administrator', 'Full system access with all permissions', 100, '#dc2626', true);

-- Admin Manager (Level 80) - Can manage users and roles but not system settings
INSERT INTO public.admin_roles (name, display_name, description, level, color, is_system_role) VALUES
('admin_manager', 'Admin Manager', 'Manage users, roles, and permissions', 80, '#7c3aed', true);

-- Lead Manager (Level 60) - Full lead management access
INSERT INTO public.admin_roles (name, display_name, description, level, color, is_system_role) VALUES
('lead_manager', 'Lead Manager', 'Full access to lead management features', 60, '#059669', true);

-- Analyst (Level 40) - Read access with analytics
INSERT INTO public.admin_roles (name, display_name, description, level, color, is_system_role) VALUES
('analyst', 'Analyst', 'View access with advanced analytics capabilities', 40, '#0891b2', true);

-- Viewer (Level 20) - Basic read access only
INSERT INTO public.admin_roles (name, display_name, description, level, color, is_system_role) VALUES
('viewer', 'Viewer', 'Basic read-only access to dashboard and leads', 20, '#6b7280', true);

-- =============================================================================
-- ROLE PERMISSION ASSIGNMENTS
-- =============================================================================

-- Super Admin gets all permissions
INSERT INTO public.admin_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.admin_roles r, public.admin_permissions p
WHERE r.name = 'super_admin';

-- Admin Manager permissions
INSERT INTO public.admin_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.admin_roles r, public.admin_permissions p
WHERE r.name = 'admin_manager' AND p.name IN (
    'dashboard_view', 'dashboard_export',
    'leads_view', 'leads_update', 'leads_export', 'leads_advanced_search',
    'users_view', 'users_create', 'users_update', 'users_delete', 'users_reset_password', 'users_manage_roles', 'users_view_activity',
    'analytics_view', 'analytics_export',
    'settings_view',
    'permissions_view', 'permissions_manage', 'roles_create', 'roles_update', 'roles_delete'
);

-- Lead Manager permissions
INSERT INTO public.admin_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.admin_roles r, public.admin_permissions p
WHERE r.name = 'lead_manager' AND p.name IN (
    'dashboard_view', 'dashboard_export',
    'leads_view', 'leads_create', 'leads_update', 'leads_delete', 'leads_export', 'leads_import', 'leads_bulk_actions', 'leads_advanced_search',
    'analytics_view', 'analytics_export',
    'settings_view'
);

-- Analyst permissions
INSERT INTO public.admin_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.admin_roles r, public.admin_permissions p
WHERE r.name = 'analyst' AND p.name IN (
    'dashboard_view', 'dashboard_export',
    'leads_view', 'leads_export', 'leads_advanced_search',
    'analytics_view', 'analytics_advanced', 'analytics_export', 'analytics_custom_reports',
    'settings_view'
);

-- Viewer permissions
INSERT INTO public.admin_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.admin_roles r, public.admin_permissions p
WHERE r.name = 'viewer' AND p.name IN (
    'dashboard_view',
    'leads_view',
    'analytics_view',
    'settings_view'
);

-- =============================================================================
-- ASSIGN DEFAULT ROLES TO EXISTING USERS
-- =============================================================================

-- Assign Super Admin role to existing super admin users
INSERT INTO public.admin_user_roles (admin_user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM public.admin_users u, public.admin_roles r
WHERE u.is_super_admin = true AND r.name = 'super_admin';

-- Assign Lead Manager role to regular admin users
INSERT INTO public.admin_user_roles (admin_user_id, role_id, assigned_by)
SELECT u.id, r.id, (SELECT id FROM public.admin_users WHERE is_super_admin = true LIMIT 1)
FROM public.admin_users u, public.admin_roles r
WHERE u.is_super_admin = false AND r.name = 'lead_manager';

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.user_has_permission(
    p_user_id UUID,
    p_permission_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    has_permission BOOLEAN := false;
BEGIN
    -- Check if user has the permission through any of their active roles
    SELECT EXISTS(
        SELECT 1
        FROM public.admin_user_roles ur
        JOIN public.admin_role_permissions rp ON ur.role_id = rp.role_id
        JOIN public.admin_permissions p ON rp.permission_id = p.id
        JOIN public.admin_roles r ON ur.role_id = r.id
        WHERE ur.admin_user_id = p_user_id
          AND p.name = p_permission_name
          AND ur.is_active = true
          AND r.is_active = true
          AND p.is_active = true
          AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$;

-- Function to get user's effective permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
RETURNS TABLE(
    permission_name TEXT,
    permission_description TEXT,
    category TEXT,
    resource TEXT,
    action TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT 
        p.name,
        p.description,
        p.category,
        p.resource,
        p.action
    FROM public.admin_user_roles ur
    JOIN public.admin_role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.admin_permissions p ON rp.permission_id = p.id
    JOIN public.admin_roles r ON ur.role_id = r.id
    WHERE ur.admin_user_id = p_user_id
      AND ur.is_active = true
      AND r.is_active = true
      AND p.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ORDER BY p.category, p.resource, p.action;
END;
$$;

-- Function to get user's roles
CREATE OR REPLACE FUNCTION public.get_user_roles(p_user_id UUID)
RETURNS TABLE(
    role_id UUID,
    role_name TEXT,
    display_name TEXT,
    description TEXT,
    level INTEGER,
    color TEXT,
    assigned_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.name,
        r.display_name,
        r.description,
        r.level,
        r.color,
        ur.assigned_at,
        ur.expires_at
    FROM public.admin_user_roles ur
    JOIN public.admin_roles r ON ur.role_id = r.id
    WHERE ur.admin_user_id = p_user_id
      AND ur.is_active = true
      AND r.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ORDER BY r.level DESC;
END;
$$;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.admin_permissions IS 'System permissions for role-based access control';
COMMENT ON TABLE public.admin_roles IS 'User roles with hierarchical levels';
COMMENT ON TABLE public.admin_role_permissions IS 'Many-to-many mapping of roles to permissions';
COMMENT ON TABLE public.admin_user_roles IS 'User role assignments with expiration support';

COMMENT ON FUNCTION public.user_has_permission IS 'Check if user has specific permission through their roles';
COMMENT ON FUNCTION public.get_user_permissions IS 'Get all effective permissions for a user';
COMMENT ON FUNCTION public.get_user_roles IS 'Get all active roles for a user'; 