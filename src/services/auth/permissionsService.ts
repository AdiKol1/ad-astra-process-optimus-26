import { supabase } from '../../lib/supabase';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  level: number;
  color: string;
  is_system_role: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface UserRole {
  id: string;
  admin_user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
  role: Role;
}

export interface UserPermissionSummary {
  user_id: string;
  roles: UserRole[];
  permissions: Permission[];
  highest_role_level: number;
}

// =============================================================================
// PERMISSION CHECKING FUNCTIONS
// =============================================================================

/**
 * Check if a user has a specific permission
 */
export async function checkUserPermission(
  userId: string,
  permissionName: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('user_has_permission', {
      p_user_id: userId,
      p_permission_name: permissionName
    });

    if (error) {
      console.error('Error checking user permission:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error in checkUserPermission:', error);
    return false;
  }
}

/**
 * Get all effective permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  try {
    const { data, error } = await supabase.rpc('get_user_permissions', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }

    return data?.map((item: any) => ({
      id: item.permission_id || '',
      name: item.permission_name,
      description: item.permission_description,
      category: item.category,
      resource: item.resource,
      action: item.action,
      is_active: true,
      created_at: '',
      updated_at: ''
    })) || [];
  } catch (error) {
    console.error('Error in getUserPermissions:', error);
    return [];
  }
}

/**
 * Get all active roles for a user
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  try {
    const { data, error } = await supabase.rpc('get_user_roles', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error getting user roles:', error);
      return [];
    }

    return data?.map((item: any) => ({
      id: item.role_id,
      admin_user_id: userId,
      role_id: item.role_id,
      assigned_at: item.assigned_at,
      expires_at: item.expires_at,
      is_active: true,
      role: {
        id: item.role_id,
        name: item.role_name,
        display_name: item.display_name,
        description: item.description,
        level: item.level,
        color: item.color,
        is_system_role: true,
        is_active: true,
        created_at: '',
        updated_at: ''
      }
    })) || [];
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
  }
}

/**
 * Get comprehensive permission summary for a user
 */
export async function getUserPermissionSummary(userId: string): Promise<UserPermissionSummary> {
  try {
    const [roles, permissions] = await Promise.all([
      getUserRoles(userId),
      getUserPermissions(userId)
    ]);

    const highest_role_level = roles.reduce((max, role) => 
      Math.max(max, role.role.level), 0
    );

    return {
      user_id: userId,
      roles,
      permissions,
      highest_role_level
    };
  } catch (error) {
    console.error('Error in getUserPermissionSummary:', error);
    return {
      user_id: userId,
      roles: [],
      permissions: [],
      highest_role_level: 0
    };
  }
}

// =============================================================================
// PERMISSION MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Get all available permissions
 */
export async function getAllPermissions(): Promise<Permission[]> {
  try {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('resource', { ascending: true })
      .order('action', { ascending: true });

    if (error) {
      console.error('Error getting all permissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPermissions:', error);
    return [];
  }
}

/**
 * Get permissions grouped by category
 */
export async function getPermissionsByCategory(): Promise<Record<string, Permission[]>> {
  try {
    const permissions = await getAllPermissions();
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  } catch (error) {
    console.error('Error in getPermissionsByCategory:', error);
    return {};
  }
}

// =============================================================================
// ROLE MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Get all available roles
 */
export async function getAllRoles(): Promise<Role[]> {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('is_active', true)
      .order('level', { ascending: false });

    if (error) {
      console.error('Error getting all roles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    return [];
  }
}

/**
 * Get role with its permissions
 */
export async function getRoleWithPermissions(roleId: string): Promise<RoleWithPermissions | null> {
  try {
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('id', roleId)
      .eq('is_active', true)
      .single();

    if (roleError) {
      console.error('Error getting role:', roleError);
      return null;
    }

    const { data: permissionsData, error: permissionsError } = await supabase
      .from('admin_role_permissions')
      .select(`
        admin_permissions (*)
      `)
      .eq('role_id', roleId);

    if (permissionsError) {
      console.error('Error getting role permissions:', permissionsError);
      return null;
    }

    const permissions = permissionsData?.map((item: any) => item.admin_permissions).filter(Boolean) || [];

    return {
      ...roleData,
      permissions
    };
  } catch (error) {
    console.error('Error in getRoleWithPermissions:', error);
    return null;
  }
}

/**
 * Create a new custom role
 */
export async function createRole(
  roleData: Omit<Role, 'id' | 'created_at' | 'updated_at' | 'is_system_role'>,
  permissionIds: string[],
  createdBy: string
): Promise<{ success: boolean; data?: Role; error?: string }> {
  try {
    // Create the role
    const { data: newRole, error: roleError } = await supabase
      .from('admin_roles')
      .insert({
        ...roleData,
        created_by: createdBy,
        is_system_role: false
      })
      .select()
      .single();

    if (roleError) {
      console.error('Error creating role:', roleError);
      return { success: false, error: 'Failed to create role' };
    }

    // Assign permissions to the role
    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(permissionId => ({
        role_id: newRole.id,
        permission_id: permissionId,
        granted_by: createdBy
      }));

      const { error: permissionsError } = await supabase
        .from('admin_role_permissions')
        .insert(rolePermissions);

      if (permissionsError) {
        console.error('Error assigning permissions to role:', permissionsError);
        // Try to cleanup the created role
        await supabase.from('admin_roles').delete().eq('id', newRole.id);
        return { success: false, error: 'Failed to assign permissions to role' };
      }
    }

    return { success: true, data: newRole };
  } catch (error) {
    console.error('Error in createRole:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update an existing role
 */
export async function updateRole(
  roleId: string,
  updates: Partial<Omit<Role, 'id' | 'created_at' | 'updated_at' | 'is_system_role'>>,
  permissionIds?: string[],
  updatedBy?: string
): Promise<{ success: boolean; data?: Role; error?: string }> {
  try {
    // Check if role is system role
    const { data: existingRole, error: checkError } = await supabase
      .from('admin_roles')
      .select('is_system_role')
      .eq('id', roleId)
      .single();

    if (checkError) {
      return { success: false, error: 'Role not found' };
    }

    if (existingRole.is_system_role) {
      return { success: false, error: 'Cannot modify system roles' };
    }

    // Update the role
    const { data: updatedRole, error: updateError } = await supabase
      .from('admin_roles')
      .update(updates)
      .eq('id', roleId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating role:', updateError);
      return { success: false, error: 'Failed to update role' };
    }

    // Update permissions if provided
    if (permissionIds !== undefined) {
      // Remove existing permissions
      await supabase
        .from('admin_role_permissions')
        .delete()
        .eq('role_id', roleId);

      // Add new permissions
      if (permissionIds.length > 0) {
        const rolePermissions = permissionIds.map(permissionId => ({
          role_id: roleId,
          permission_id: permissionId,
          granted_by: updatedBy
        }));

        const { error: permissionsError } = await supabase
          .from('admin_role_permissions')
          .insert(rolePermissions);

        if (permissionsError) {
          console.error('Error updating role permissions:', permissionsError);
          return { success: false, error: 'Failed to update role permissions' };
        }
      }
    }

    return { success: true, data: updatedRole };
  } catch (error) {
    console.error('Error in updateRole:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a custom role
 */
export async function deleteRole(roleId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if role is system role
    const { data: existingRole, error: checkError } = await supabase
      .from('admin_roles')
      .select('is_system_role')
      .eq('id', roleId)
      .single();

    if (checkError) {
      return { success: false, error: 'Role not found' };
    }

    if (existingRole.is_system_role) {
      return { success: false, error: 'Cannot delete system roles' };
    }

    // Soft delete the role
    const { error: deleteError } = await supabase
      .from('admin_roles')
      .update({ is_active: false })
      .eq('id', roleId);

    if (deleteError) {
      console.error('Error deleting role:', deleteError);
      return { success: false, error: 'Failed to delete role' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteRole:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// =============================================================================
// USER ROLE ASSIGNMENT FUNCTIONS
// =============================================================================

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string,
  assignedBy: string,
  expiresAt?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('admin_user_roles')
      .insert({
        admin_user_id: userId,
        role_id: roleId,
        assigned_by: assignedBy,
        expires_at: expiresAt || null
      });

    if (error) {
      console.error('Error assigning role to user:', error);
      return { success: false, error: 'Failed to assign role to user' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in assignRoleToUser:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Remove a role from a user
 */
export async function removeRoleFromUser(
  userId: string,
  roleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('admin_user_roles')
      .update({ is_active: false })
      .eq('admin_user_id', userId)
      .eq('role_id', roleId);

    if (error) {
      console.error('Error removing role from user:', error);
      return { success: false, error: 'Failed to remove role from user' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in removeRoleFromUser:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update user role assignments
 */
export async function updateUserRoles(
  userId: string,
  roleIds: string[],
  assignedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Deactivate all current roles
    await supabase
      .from('admin_user_roles')
      .update({ is_active: false })
      .eq('admin_user_id', userId);

    // Assign new roles
    if (roleIds.length > 0) {
      const userRoles = roleIds.map(roleId => ({
        admin_user_id: userId,
        role_id: roleId,
        assigned_by: assignedBy
      }));

      const { error: assignError } = await supabase
        .from('admin_user_roles')
        .insert(userRoles);

      if (assignError) {
        console.error('Error assigning new roles:', assignError);
        return { success: false, error: 'Failed to assign new roles' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateUserRoles:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if user can access a specific resource
 */
export async function canAccessResource(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId);
    return permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  } catch (error) {
    console.error('Error in canAccessResource:', error);
    return false;
  }
}

/**
 * Get user's highest role level
 */
export async function getUserHighestRoleLevel(userId: string): Promise<number> {
  try {
    const roles = await getUserRoles(userId);
    return roles.reduce((max, role) => Math.max(max, role.role.level), 0);
  } catch (error) {
    console.error('Error in getUserHighestRoleLevel:', error);
    return 0;
  }
}

/**
 * Check if user has role level at least the specified level
 */
export async function hasMinimumRoleLevel(userId: string, minimumLevel: number): Promise<boolean> {
  try {
    const userLevel = await getUserHighestRoleLevel(userId);
    return userLevel >= minimumLevel;
  } catch (error) {
    console.error('Error in hasMinimumRoleLevel:', error);
    return false;
  }
}

export default {
  // Permission checking
  checkUserPermission,
  getUserPermissions,
  getUserRoles,
  getUserPermissionSummary,
  
  // Permission management
  getAllPermissions,
  getPermissionsByCategory,
  
  // Role management
  getAllRoles,
  getRoleWithPermissions,
  createRole,
  updateRole,
  deleteRole,
  
  // User role assignment
  assignRoleToUser,
  removeRoleFromUser,
  updateUserRoles,
  
  // Utility functions
  canAccessResource,
  getUserHighestRoleLevel,
  hasMinimumRoleLevel
}; 