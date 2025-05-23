import React, { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

// =============================================================================
// TYPES
// =============================================================================

interface PermissionGuardProps {
  children: ReactNode;
  
  // Permission requirements (any one of these can be used)
  permission?: string;
  permissions?: string[];
  anyPermissions?: string[];
  allPermissions?: string[];
  
  // Resource-based access
  resource?: string;
  action?: string;
  
  // Role level requirements
  minimumRoleLevel?: number;
  maximumRoleLevel?: number;
  
  // Fallback content
  fallback?: ReactNode;
  
  // Show loading state while checking permissions
  showLoadingState?: boolean;
  loadingComponent?: ReactNode;
  
  // Invert the permission check (show when user DOESN'T have permission)
  invert?: boolean;
  
  // Debug mode - shows permission details in console
  debug?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PermissionGuard({
  children,
  permission,
  permissions,
  anyPermissions,
  allPermissions,
  resource,
  action,
  minimumRoleLevel,
  maximumRoleLevel,
  fallback = null,
  showLoadingState = false,
  loadingComponent,
  invert = false,
  debug = false
}: PermissionGuardProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    hasRoleLevel,
    highestRoleLevel,
    loading,
    permissions: userPermissions,
    roles: userRoles
  } = usePermissions();

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (loading && showLoadingState) {
    return (
      <>
        {loadingComponent || (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Checking permissions...</span>
          </div>
        )}
      </>
    );
  }

  // =============================================================================
  // PERMISSION CHECKING LOGIC
  // =============================================================================

  let hasAccess = true;

  // Single permission check
  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  // Multiple permissions (all required)
  if (permissions && permissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(permissions);
  }

  // Any of the specified permissions
  if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAccess && hasAnyPermission(anyPermissions);
  }

  // All of the specified permissions
  if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAccess && hasAllPermissions(allPermissions);
  }

  // Resource-based access
  if (resource && action) {
    hasAccess = hasAccess && canAccess(resource, action);
  }

  // Role level checks
  if (minimumRoleLevel !== undefined) {
    hasAccess = hasAccess && hasRoleLevel(minimumRoleLevel);
  }

  if (maximumRoleLevel !== undefined) {
    hasAccess = hasAccess && (highestRoleLevel <= maximumRoleLevel);
  }

  // Invert the check if requested
  if (invert) {
    hasAccess = !hasAccess;
  }

  // =============================================================================
  // DEBUG OUTPUT
  // =============================================================================

  if (debug) {
    console.group('PermissionGuard Debug');
    console.log('Props:', {
      permission,
      permissions,
      anyPermissions,
      allPermissions,
      resource,
      action,
      minimumRoleLevel,
      maximumRoleLevel,
      invert
    });
    console.log('User permissions:', userPermissions.map(p => p.name));
    console.log('User roles:', userRoles.map(r => `${r.role.display_name} (${r.role.level})`));
    console.log('Highest role level:', highestRoleLevel);
    console.log('Has access:', hasAccess);
    console.groupEnd();
  }

  // =============================================================================
  // RENDER
  // =============================================================================

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

// =============================================================================
// CONVENIENCE COMPONENTS
// =============================================================================

/**
 * Component that renders children only for super admins
 */
export function SuperAdminOnly({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard minimumRoleLevel={100} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for admin managers and above
 */
export function AdminManagerOnly({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard minimumRoleLevel={80} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for lead managers and above
 */
export function LeadManagerOnly({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard minimumRoleLevel={60} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for users with dashboard access
 */
export function DashboardAccess({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard permission="dashboard_view" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for users with user management access
 */
export function UserManagementAccess({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard permission="users_view" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for users with lead management access
 */
export function LeadManagementAccess({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard permission="leads_view" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for users with analytics access
 */
export function AnalyticsAccess({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard permission="analytics_view" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for users with settings access
 */
export function SettingsAccess({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard permission="settings_view" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Component that renders children only for users with role management access
 */
export function RoleManagementAccess({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <PermissionGuard permission="permissions_manage" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Higher-order component that wraps a component with permission checking
 */
export function withPermissions<T extends object>(
  Component: React.ComponentType<T>,
  permissionConfig: Omit<PermissionGuardProps, 'children'>
) {
  return function PermissionWrappedComponent(props: T) {
    return (
      <PermissionGuard {...permissionConfig}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}

export default PermissionGuard; 