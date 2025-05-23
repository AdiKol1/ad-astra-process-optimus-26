import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth/AuthContext';
import {
  checkUserPermission,
  getUserPermissions,
  getUserRoles,
  getUserPermissionSummary,
  canAccessResource,
  getUserHighestRoleLevel,
  hasMinimumRoleLevel,
  type Permission,
  type UserRole,
  type UserPermissionSummary
} from '../services/auth/permissionsService';

// =============================================================================
// TYPES
// =============================================================================

interface UsePermissionsReturn {
  // Permission data
  permissions: Permission[];
  roles: UserRole[];
  permissionSummary: UserPermissionSummary | null;
  highestRoleLevel: number;
  
  // Loading states
  loading: boolean;
  permissionsLoading: boolean;
  rolesLoading: boolean;
  
  // Permission checking functions
  hasPermission: (permissionName: string) => boolean;
  hasAnyPermission: (permissionNames: string[]) => boolean;
  hasAllPermissions: (permissionNames: string[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  hasRoleLevel: (minimumLevel: number) => boolean;
  
  // Refresh functions
  refreshPermissions: () => Promise<void>;
  refreshRoles: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  
  // State
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [permissionSummary, setPermissionSummary] = useState<UserPermissionSummary | null>(null);
  const [highestRoleLevel, setHighestRoleLevel] = useState<number>(0);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);

  // =============================================================================
  // DATA FETCHING FUNCTIONS
  // =============================================================================

  const fetchPermissions = useCallback(async (userId: string) => {
    setPermissionsLoading(true);
    try {
      const userPermissions = await getUserPermissions(userId);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async (userId: string) => {
    setRolesLoading(true);
    try {
      const userRoles = await getUserRoles(userId);
      setRoles(userRoles);
      
      // Calculate highest role level
      const maxLevel = userRoles.reduce((max, role) => 
        Math.max(max, role.role.level), 0
      );
      setHighestRoleLevel(maxLevel);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
      setHighestRoleLevel(0);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchPermissionSummary = useCallback(async (userId: string) => {
    try {
      const summary = await getUserPermissionSummary(userId);
      setPermissionSummary(summary);
    } catch (error) {
      console.error('Error fetching permission summary:', error);
      setPermissionSummary(null);
    }
  }, []);

  const fetchAllData = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPermissions(userId),
        fetchRoles(userId),
        fetchPermissionSummary(userId)
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchPermissions, fetchRoles, fetchPermissionSummary]);

  // =============================================================================
  // PERMISSION CHECKING FUNCTIONS
  // =============================================================================

  const hasPermission = useCallback((permissionName: string): boolean => {
    return permissions.some(permission => permission.name === permissionName);
  }, [permissions]);

  const hasAnyPermission = useCallback((permissionNames: string[]): boolean => {
    return permissionNames.some(permissionName => hasPermission(permissionName));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissionNames: string[]): boolean => {
    return permissionNames.every(permissionName => hasPermission(permissionName));
  }, [hasPermission]);

  const canAccess = useCallback((resource: string, action: string): boolean => {
    return permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  }, [permissions]);

  const hasRoleLevel = useCallback((minimumLevel: number): boolean => {
    return highestRoleLevel >= minimumLevel;
  }, [highestRoleLevel]);

  // =============================================================================
  // REFRESH FUNCTIONS
  // =============================================================================

  const refreshPermissions = useCallback(async (): Promise<void> => {
    if (user?.id) {
      await fetchPermissions(user.id);
    }
  }, [user?.id, fetchPermissions]);

  const refreshRoles = useCallback(async (): Promise<void> => {
    if (user?.id) {
      await fetchRoles(user.id);
    }
  }, [user?.id, fetchRoles]);

  const refreshAll = useCallback(async (): Promise<void> => {
    if (user?.id) {
      await fetchAllData(user.id);
    }
  }, [user?.id, fetchAllData]);

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Initial data fetch when user changes
  useEffect(() => {
    if (user?.id) {
      fetchAllData(user.id);
    } else {
      // Clear data when no user
      setPermissions([]);
      setRoles([]);
      setPermissionSummary(null);
      setHighestRoleLevel(0);
      setLoading(false);
    }
  }, [user?.id, fetchAllData]);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // Permission data
    permissions,
    roles,
    permissionSummary,
    highestRoleLevel,
    
    // Loading states
    loading,
    permissionsLoading,
    rolesLoading,
    
    // Permission checking functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    hasRoleLevel,
    
    // Refresh functions
    refreshPermissions,
    refreshRoles,
    refreshAll
  };
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(permissionName: string): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(permissionName);
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useHasAnyPermission(permissionNames: string[]): boolean {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(permissionNames);
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useHasAllPermissions(permissionNames: string[]): boolean {
  const { hasAllPermissions } = usePermissions();
  return hasAllPermissions(permissionNames);
}

/**
 * Hook to check if user can access a specific resource with an action
 */
export function useCanAccess(resource: string, action: string): boolean {
  const { canAccess } = usePermissions();
  return canAccess(resource, action);
}

/**
 * Hook to check if user has minimum role level
 */
export function useHasRoleLevel(minimumLevel: number): boolean {
  const { hasRoleLevel } = usePermissions();
  return hasRoleLevel(minimumLevel);
}

/**
 * Hook to get user's highest role level
 */
export function useHighestRoleLevel(): number {
  const { highestRoleLevel } = usePermissions();
  return highestRoleLevel;
}

/**
 * Hook for dashboard access (requires dashboard_view permission)
 */
export function useCanViewDashboard(): boolean {
  return useHasPermission('dashboard_view');
}

/**
 * Hook for user management access (requires users_view permission)
 */
export function useCanManageUsers(): boolean {
  return useHasPermission('users_view');
}

/**
 * Hook for lead management access (requires leads_view permission)
 */
export function useCanManageLeads(): boolean {
  return useHasPermission('leads_view');
}

/**
 * Hook for analytics access (requires analytics_view permission)
 */
export function useCanViewAnalytics(): boolean {
  return useHasPermission('analytics_view');
}

/**
 * Hook for settings access (requires settings_view permission)
 */
export function useCanViewSettings(): boolean {
  return useHasPermission('settings_view');
}

/**
 * Hook for role management access (requires permissions_manage permission)
 */
export function useCanManageRoles(): boolean {
  return useHasPermission('permissions_manage');
}

/**
 * Hook to check if user is super admin (level 100)
 */
export function useIsSuperAdmin(): boolean {
  return useHasRoleLevel(100);
}

/**
 * Hook to check if user can manage other users (level 80+)
 */
export function useCanManageAdmins(): boolean {
  return useHasRoleLevel(80);
}

export default usePermissions; 