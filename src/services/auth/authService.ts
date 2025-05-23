/**
 * Authentication Service
 * 
 * Handles admin authentication, session management, and security operations
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperAdmin: boolean;
  lastLoginAt?: string;
  loginCount: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AdminUser;
  sessionToken?: string;
  message: string;
}

export interface SessionInfo {
  user: AdminUser;
  sessionToken: string;
  expiresAt: string;
}

class AuthService {
  private static readonly SESSION_KEY = 'admin_session';
  private static readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  /**
   * Hash password using SHA-256 (matches database expectation)
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate session token
   */
  private generateSessionToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Login admin user with database validation
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      logger.info('Admin login attempt', { email: credentials.email });

      // Hash the password to match database
      const passwordHash = await this.hashPassword(credentials.password);

      // Call the database validation function
      const { data, error } = await supabase.rpc('validate_admin_login', {
        p_email: credentials.email.toLowerCase(),
        p_password_hash: passwordHash
      });

      if (error) {
        logger.error('Database error during login', { error, email: credentials.email });
        throw error;
      }

      if (!data || data.length === 0) {
        await this.logActivity({
          userId: null,
          action: 'login_failed',
          description: `Failed login attempt for ${credentials.email} - no data returned`,
          success: false,
        });

        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      const result = data[0];

      if (!result.success) {
        await this.logActivity({
          userId: null,
          action: 'login_failed',
          description: `Failed login attempt for ${credentials.email} - ${result.message}`,
          success: false,
        });

        telemetry.track('admin_login_failed', {
          email: credentials.email,
          reason: result.message,
        });

        return {
          success: false,
          message: result.message,
        };
      }

      // Create user object from database result
      const user: AdminUser = {
        id: result.user_id,
        email: result.email,
        firstName: result.first_name,
        lastName: result.last_name,
        isSuperAdmin: result.is_super_admin,
        lastLoginAt: new Date().toISOString(),
        loginCount: 1, // Could be enhanced to get from database
      };

      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + AuthService.SESSION_DURATION).toISOString();

      // Store session in localStorage
      const sessionInfo: SessionInfo = {
        user,
        sessionToken,
        expiresAt,
      };

      localStorage.setItem(AuthService.SESSION_KEY, JSON.stringify(sessionInfo));

      // Create database session record
      await this.createDatabaseSession(user.id, sessionToken, expiresAt);

      // Log activity
      await this.logActivity({
        userId: user.id,
        action: 'login',
        description: 'Admin user logged in successfully',
        success: true,
      });

      telemetry.track('admin_login_success', {
        userId: user.id,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
      });

      logger.info('Admin login successful', { 
        userId: user.id, 
        email: user.email,
        isSuperAdmin: user.isSuperAdmin
      });

      return {
        success: true,
        user,
        sessionToken,
        message: 'Login successful',
      };

    } catch (error) {
      logger.error('Login error', { error, email: credentials.email });
      
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Create database session record
   */
  private async createDatabaseSession(userId: string, sessionToken: string, expiresAt: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt,
          ip_address: null, // Could be enhanced with real IP detection
          user_agent: navigator.userAgent,
          device_info: {
            platform: navigator.platform,
            language: navigator.language,
          },
        });

      if (error) {
        logger.error('Failed to create database session', { error, userId });
      }
    } catch (error) {
      logger.error('Error creating database session', { error, userId });
    }
  }

  /**
   * Logout admin user and clean up sessions
   */
  async logout(): Promise<void> {
    try {
      const session = this.getCurrentSession();
      
      if (session) {
        // Revoke database session
        await this.revokeDatabaseSession(session.sessionToken);

        await this.logActivity({
          userId: session.user.id,
          action: 'logout',
          description: 'Admin user logged out',
          success: true,
        });

        telemetry.track('admin_logout', {
          userId: session.user.id,
          email: session.user.email,
        });

        logger.info('Admin logout', { 
          userId: session.user.id, 
          email: session.user.email 
        });
      }

      // Clear session from localStorage
      localStorage.removeItem(AuthService.SESSION_KEY);

    } catch (error) {
      logger.error('Logout error', { error });
    }
  }

  /**
   * Revoke database session
   */
  private async revokeDatabaseSession(sessionToken: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_sessions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_reason: 'user_logout',
        })
        .eq('session_token', sessionToken);

      if (error) {
        logger.error('Failed to revoke database session', { error, sessionToken });
      }
    } catch (error) {
      logger.error('Error revoking database session', { error, sessionToken });
    }
  }

  /**
   * Validate session with database
   */
  async validateSession(sessionToken: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select(`
          expires_at,
          is_active,
          admin_user_id,
          admin_users!inner(is_active)
        `)
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return false;
      }

      // Check if session is expired
      if (new Date(data.expires_at) <= new Date()) {
        // Auto-revoke expired session
        await this.revokeDatabaseSession(sessionToken);
        return false;
      }

      // Check if user is still active
      if (!data.admin_users.is_active) {
        await this.revokeDatabaseSession(sessionToken);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error validating session', { error, sessionToken });
      return false;
    }
  }

  /**
   * Get current session if valid
   */
  getCurrentSession(): SessionInfo | null {
    try {
      const sessionData = localStorage.getItem(AuthService.SESSION_KEY);
      
      if (!sessionData) {
        return null;
      }

      const session: SessionInfo = JSON.parse(sessionData);
      
      // Check if session is expired
      if (new Date(session.expiresAt) <= new Date()) {
        localStorage.removeItem(AuthService.SESSION_KEY);
        return null;
      }

      return session;
    } catch (error) {
      logger.error('Error getting current session', { error });
      localStorage.removeItem(AuthService.SESSION_KEY);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): AdminUser | null {
    const session = this.getCurrentSession();
    return session?.user || null;
  }

  /**
   * Refresh session token
   */
  async refreshSession(): Promise<boolean> {
    try {
      const session = this.getCurrentSession();
      
      if (!session) {
        return false;
      }

      // Validate with database
      const isValid = await this.validateSession(session.sessionToken);
      if (!isValid) {
        localStorage.removeItem(AuthService.SESSION_KEY);
        return false;
      }

      // Generate new token and extend expiration
      const newSessionToken = this.generateSessionToken();
      const newExpiresAt = new Date(Date.now() + AuthService.SESSION_DURATION).toISOString();

      // Update database session
      await supabase
        .from('admin_sessions')
        .update({
          session_token: newSessionToken,
          expires_at: newExpiresAt,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_token', session.sessionToken);

      const updatedSession: SessionInfo = {
        ...session,
        sessionToken: newSessionToken,
        expiresAt: newExpiresAt,
      };

      localStorage.setItem(AuthService.SESSION_KEY, JSON.stringify(updatedSession));

      await this.logActivity({
        userId: session.user.id,
        action: 'session_refreshed',
        description: 'Session token refreshed',
        success: true,
      });

      return true;
    } catch (error) {
      logger.error('Error refreshing session', { error });
      return false;
    }
  }

  /**
   * Log admin activity to database
   */
  async logActivity(activity: {
    userId: string | null;
    action: string;
    description: string;
    resourceType?: string;
    resourceId?: string;
    success: boolean;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      // Log to database
      const { error } = await supabase
        .from('admin_activity_log')
        .insert({
          admin_user_id: activity.userId,
          action: activity.action,
          description: activity.description,
          resource_type: activity.resourceType || null,
          resource_id: activity.resourceId || null,
          success: activity.success,
          metadata: activity.metadata || {},
          ip_address: null, // Could be enhanced with real IP detection
          user_agent: navigator.userAgent,
        });

      if (error) {
        logger.error('Failed to log activity to database', { error, activity });
      }

      // Also log to console for development
      logger.info('Admin activity', {
        userId: activity.userId,
        action: activity.action,
        description: activity.description,
        success: activity.success,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Error logging admin activity', { error, activity });
    }
  }

  /**
   * Get admin activities from database
   */
  async getAdminActivities(limit = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select(`
          *,
          admin_users(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Error fetching admin activities', { error });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting admin activities', { error });
      return [];
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const session = this.getCurrentSession();
      
      if (!session) {
        return {
          success: false,
          message: 'Not authenticated',
        };
      }

      // Verify current password
      const currentHash = await this.hashPassword(currentPassword);
      const { data: user } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('id', session.user.id)
        .single();

      if (!user || user.password_hash !== currentHash) {
        return {
          success: false,
          message: 'Current password is incorrect',
        };
      }

      // Update password
      const newHash = await this.hashPassword(newPassword);
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: newHash })
        .eq('id', session.user.id);

      if (error) {
        logger.error('Failed to update password', { error, userId: session.user.id });
        return {
          success: false,
          message: 'Failed to update password',
        };
      }

      await this.logActivity({
        userId: session.user.id,
        action: 'password_changed',
        description: 'User changed password',
        success: true,
      });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      logger.error('Error changing password', { error });
      return {
        success: false,
        message: 'Failed to change password',
      };
    }
  }

  /**
   * Check if current user has super admin privileges
   */
  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isSuperAdmin || false;
  }

  /**
   * Get all admin users (super admin only)
   */
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      if (!this.isSuperAdmin()) {
        throw new Error('Unauthorized: Super admin access required');
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, first_name, last_name, is_super_admin, is_active, last_login_at, login_count')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isSuperAdmin: user.is_super_admin,
        lastLoginAt: user.last_login_at,
        loginCount: user.login_count || 0,
      }));
    } catch (error) {
      logger.error('Error fetching admin users', { error });
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService(); 