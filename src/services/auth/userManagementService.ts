/**
 * User Management Service
 * 
 * Handles CRUD operations for admin users (Super Admin only)
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';
import { authService } from './authService';

export interface CreateAdminUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isSuperAdmin?: boolean;
}

export interface UpdateAdminUserRequest {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isSuperAdmin?: boolean;
  isActive?: boolean;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserManagementStats {
  totalUsers: number;
  activeUsers: number;
  superAdmins: number;
  recentLogins: number; // last 7 days
}

export interface UserManagementResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

class UserManagementService {
  /**
   * Hash password using SHA-256 (matches auth service)
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Check if current user has super admin privileges
   */
  private ensureSuperAdmin(): void {
    if (!authService.isSuperAdmin()) {
      throw new Error('Unauthorized: Super Admin access required');
    }
  }

  /**
   * Create new admin user
   */
  async createAdminUser(request: CreateAdminUserRequest): Promise<UserManagementResponse<AdminUserListItem>> {
    try {
      this.ensureSuperAdmin();

      logger.info('Creating new admin user', { 
        email: request.email,
        isSuperAdmin: request.isSuperAdmin 
      });

      // Validate input
      if (!request.email || !request.password || !request.firstName || !request.lastName) {
        return {
          success: false,
          message: 'All fields are required'
        };
      }

      if (request.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', request.email.toLowerCase())
        .single();

      if (existingUser) {
        return {
          success: false,
          message: 'An admin user with this email already exists'
        };
      }

      // Hash password
      const passwordHash = await this.hashPassword(request.password);

      // Create user
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          email: request.email.toLowerCase(),
          password_hash: passwordHash,
          first_name: request.firstName,
          last_name: request.lastName,
          is_super_admin: request.isSuperAdmin || false,
          created_by: authService.getCurrentUser()?.email || 'system'
        })
        .select(`
          id,
          email,
          first_name,
          last_name,
          is_super_admin,
          is_active,
          last_login_at,
          login_count,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        logger.error('Database error creating admin user', { error, email: request.email });
        throw error;
      }

      // Log activity
      await authService.logActivity({
        userId: authService.getCurrentUser()?.id || null,
        action: 'create_admin_user',
        description: `Created admin user: ${request.email}`,
        resourceType: 'admin_user',
        resourceId: data.id,
        success: true,
        metadata: {
          newUserEmail: request.email,
          isSuperAdmin: request.isSuperAdmin
        }
      });

      telemetry.track('admin_user_created', {
        createdBy: authService.getCurrentUser()?.id,
        newUserEmail: request.email,
        isSuperAdmin: request.isSuperAdmin
      });

      const adminUser: AdminUserListItem = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: `${data.first_name} ${data.last_name}`,
        isSuperAdmin: data.is_super_admin,
        isActive: data.is_active,
        lastLoginAt: data.last_login_at,
        loginCount: data.login_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      logger.info('Admin user created successfully', { 
        id: data.id,
        email: request.email 
      });

      return {
        success: true,
        data: adminUser,
        message: 'Admin user created successfully'
      };

    } catch (error) {
      logger.error('Error creating admin user', { error, email: request.email });

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Failed to create admin user. Please try again.'
      };
    }
  }

  /**
   * Get all admin users
   */
  async getAdminUsers(): Promise<UserManagementResponse<AdminUserListItem[]>> {
    try {
      this.ensureSuperAdmin();

      const { data, error } = await supabase
        .from('admin_users')
        .select(`
          id,
          email,
          first_name,
          last_name,
          is_super_admin,
          is_active,
          last_login_at,
          login_count,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Database error fetching admin users', { error });
        throw error;
      }

      const adminUsers: AdminUserListItem[] = (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: `${user.first_name} ${user.last_name}`,
        isSuperAdmin: user.is_super_admin,
        isActive: user.is_active,
        lastLoginAt: user.last_login_at,
        loginCount: user.login_count || 0,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));

      return {
        success: true,
        data: adminUsers,
        message: 'Admin users retrieved successfully'
      };

    } catch (error) {
      logger.error('Error fetching admin users', { error });

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Failed to fetch admin users'
      };
    }
  }

  /**
   * Update admin user
   */
  async updateAdminUser(request: UpdateAdminUserRequest): Promise<UserManagementResponse<AdminUserListItem>> {
    try {
      this.ensureSuperAdmin();

      logger.info('Updating admin user', { id: request.id });

      const currentUser = authService.getCurrentUser();
      
      // Prevent user from changing their own super admin status
      if (request.id === currentUser?.id && request.isSuperAdmin === false) {
        return {
          success: false,
          message: 'You cannot remove super admin privileges from your own account'
        };
      }

      // Prevent deactivating your own account
      if (request.id === currentUser?.id && request.isActive === false) {
        return {
          success: false,
          message: 'You cannot deactivate your own account'
        };
      }

      // Build update object
      const updateData: any = {};
      if (request.email) updateData.email = request.email.toLowerCase();
      if (request.firstName) updateData.first_name = request.firstName;
      if (request.lastName) updateData.last_name = request.lastName;
      if (typeof request.isSuperAdmin === 'boolean') updateData.is_super_admin = request.isSuperAdmin;
      if (typeof request.isActive === 'boolean') updateData.is_active = request.isActive;

      if (Object.keys(updateData).length === 0) {
        return {
          success: false,
          message: 'No changes specified'
        };
      }

      // Check if email is being changed and already exists
      if (request.email) {
        const { data: existingUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', request.email.toLowerCase())
          .neq('id', request.id)
          .single();

        if (existingUser) {
          return {
            success: false,
            message: 'An admin user with this email already exists'
          };
        }
      }

      // Update user
      const { data, error } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', request.id)
        .select(`
          id,
          email,
          first_name,
          last_name,
          is_super_admin,
          is_active,
          last_login_at,
          login_count,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        logger.error('Database error updating admin user', { error, id: request.id });
        throw error;
      }

      // Log activity
      await authService.logActivity({
        userId: currentUser?.id || null,
        action: 'update_admin_user',
        description: `Updated admin user: ${data.email}`,
        resourceType: 'admin_user',
        resourceId: request.id,
        success: true,
        metadata: {
          changes: updateData,
          targetUserEmail: data.email
        }
      });

      telemetry.track('admin_user_updated', {
        updatedBy: currentUser?.id,
        targetUserId: request.id,
        targetUserEmail: data.email,
        changes: Object.keys(updateData)
      });

      const adminUser: AdminUserListItem = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: `${data.first_name} ${data.last_name}`,
        isSuperAdmin: data.is_super_admin,
        isActive: data.is_active,
        lastLoginAt: data.last_login_at,
        loginCount: data.login_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      logger.info('Admin user updated successfully', { 
        id: request.id,
        email: data.email 
      });

      return {
        success: true,
        data: adminUser,
        message: 'Admin user updated successfully'
      };

    } catch (error) {
      logger.error('Error updating admin user', { error, id: request.id });

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Failed to update admin user'
      };
    }
  }

  /**
   * Delete admin user (deactivate)
   */
  async deleteAdminUser(userId: string): Promise<UserManagementResponse<void>> {
    try {
      this.ensureSuperAdmin();

      logger.info('Deleting admin user', { id: userId });

      const currentUser = authService.getCurrentUser();
      
      // Prevent user from deleting their own account
      if (userId === currentUser?.id) {
        return {
          success: false,
          message: 'You cannot delete your own account'
        };
      }

      // Get user info before deletion
      const { data: userToDelete } = await supabase
        .from('admin_users')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single();

      if (!userToDelete) {
        return {
          success: false,
          message: 'Admin user not found'
        };
      }

      // Deactivate instead of hard delete for audit purposes
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) {
        logger.error('Database error deleting admin user', { error, id: userId });
        throw error;
      }

      // Revoke all active sessions for this user
      await supabase
        .from('admin_sessions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_reason: 'account_deactivated'
        })
        .eq('admin_user_id', userId);

      // Log activity
      await authService.logActivity({
        userId: currentUser?.id || null,
        action: 'delete_admin_user',
        description: `Deactivated admin user: ${userToDelete.email}`,
        resourceType: 'admin_user',
        resourceId: userId,
        success: true,
        metadata: {
          deletedUserEmail: userToDelete.email,
          deletedUserName: `${userToDelete.first_name} ${userToDelete.last_name}`
        }
      });

      telemetry.track('admin_user_deleted', {
        deletedBy: currentUser?.id,
        deletedUserId: userId,
        deletedUserEmail: userToDelete.email
      });

      logger.info('Admin user deactivated successfully', { 
        id: userId,
        email: userToDelete.email 
      });

      return {
        success: true,
        message: 'Admin user deactivated successfully'
      };

    } catch (error) {
      logger.error('Error deleting admin user', { error, id: userId });

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Failed to delete admin user'
      };
    }
  }

  /**
   * Reset user password (generates new temporary password)
   */
  async resetUserPassword(userId: string): Promise<UserManagementResponse<{ temporaryPassword: string }>> {
    try {
      this.ensureSuperAdmin();

      logger.info('Resetting user password', { id: userId });

      // Generate temporary password
      const temporaryPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      const passwordHash = await this.hashPassword(temporaryPassword);

      // Get user info
      const { data: user } = await supabase
        .from('admin_users')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single();

      if (!user) {
        return {
          success: false,
          message: 'Admin user not found'
        };
      }

      // Update password and clear failed attempts
      const { error } = await supabase
        .from('admin_users')
        .update({
          password_hash: passwordHash,
          failed_login_attempts: 0,
          locked_until: null
        })
        .eq('id', userId);

      if (error) {
        logger.error('Database error resetting user password', { error, id: userId });
        throw error;
      }

      // Revoke all active sessions for this user
      await supabase
        .from('admin_sessions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_reason: 'password_reset_by_admin'
        })
        .eq('admin_user_id', userId);

      // Log activity
      await authService.logActivity({
        userId: authService.getCurrentUser()?.id || null,
        action: 'reset_user_password',
        description: `Reset password for admin user: ${user.email}`,
        resourceType: 'admin_user',
        resourceId: userId,
        success: true,
        metadata: {
          targetUserEmail: user.email
        }
      });

      telemetry.track('admin_user_password_reset', {
        resetBy: authService.getCurrentUser()?.id,
        targetUserId: userId,
        targetUserEmail: user.email
      });

      logger.info('User password reset successfully', { 
        id: userId,
        email: user.email 
      });

      return {
        success: true,
        data: { temporaryPassword },
        message: 'Password reset successfully'
      };

    } catch (error) {
      logger.error('Error resetting user password', { error, id: userId });

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Failed to reset user password'
      };
    }
  }

  /**
   * Get user management statistics
   */
  async getUserManagementStats(): Promise<UserManagementResponse<UserManagementStats>> {
    try {
      this.ensureSuperAdmin();

      // Get basic user counts
      const { data: userCounts } = await supabase
        .from('admin_users')
        .select('is_super_admin, is_active');

      if (!userCounts) {
        throw new Error('Failed to fetch user statistics');
      }

      const totalUsers = userCounts.length;
      const activeUsers = userCounts.filter((u: any) => u.is_active).length;
      const superAdmins = userCounts.filter((u: any) => u.is_super_admin && u.is_active).length;

      // Get recent logins (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentLoginData } = await supabase
        .from('admin_users')
        .select('last_login_at')
        .gte('last_login_at', sevenDaysAgo.toISOString())
        .eq('is_active', true);

      const recentLogins = recentLoginData?.length || 0;

      const stats: UserManagementStats = {
        totalUsers,
        activeUsers,
        superAdmins,
        recentLogins
      };

      return {
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      };

    } catch (error) {
      logger.error('Error getting user management stats', { error });

      if (error instanceof Error && error.message.includes('Unauthorized')) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: false,
        message: 'Failed to get user statistics'
      };
    }
  }
}

// Export singleton instance
export const userManagementService = new UserManagementService(); 