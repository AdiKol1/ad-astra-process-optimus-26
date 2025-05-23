/**
 * Password Reset Service
 * 
 * Handles password reset functionality with secure tokens and email notifications
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { telemetry } from '@/utils/monitoring/telemetry';

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  token?: string; // Only returned in development for testing
}

export interface TokenValidationResponse {
  success: boolean;
  message: string;
  email?: string;
  userId?: string;
}

export interface PasswordResetWithTokenRequest {
  token: string;
  newPassword: string;
}

export interface EmailLog {
  id: string;
  adminUserId: string;
  emailType: string;
  recipientEmail: string;
  subject: string;
  templateData: Record<string, any>;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  failureReason?: string;
  emailProvider: string;
  createdAt: string;
}

class PasswordResetService {
  private isDevelopment = import.meta.env.DEV;

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
   * Initiate password reset process
   */
  async initiatePasswordReset(request: PasswordResetRequest): Promise<PasswordResetResponse> {
    try {
      logger.info('Password reset initiated', { email: request.email });

      // Call database function to create reset token
      const { data, error } = await supabase.rpc('initiate_password_reset', {
        p_email: request.email.toLowerCase().trim()
      });

      if (error) {
        logger.error('Database error during password reset initiation', { error, email: request.email });
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No response from password reset function');
      }

      const result = data[0];

      // Track analytics
      telemetry.track('password_reset_initiated', {
        email: request.email,
        hasToken: !!result.token,
      });

      // In development, we'll simulate sending the email and return the token for testing
      if (this.isDevelopment && result.token) {
        this.simulatePasswordResetEmail(request.email, result.token);
        
        logger.info('Password reset token generated (development)', { 
          email: request.email,
          token: result.token,
          message: 'Check console for reset link'
        });

        return {
          success: true,
          message: result.message + ' (Check console for reset link in development)',
          token: result.token, // Only include in development
        };
      }

      // In production, we would integrate with an email service here
      // For now, we'll just log it
      if (result.token) {
        logger.info('Password reset would be sent via email service', {
          email: request.email,
          message: 'Integration with email service needed for production'
        });
      }

      return {
        success: true,
        message: result.message,
      };

    } catch (error) {
      logger.error('Password reset initiation error', { error, email: request.email });

      telemetry.track('password_reset_error', {
        email: request.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        success: false,
        message: 'Failed to initiate password reset. Please try again.',
      };
    }
  }

  /**
   * Validate password reset token
   */
  async validatePasswordResetToken(token: string): Promise<TokenValidationResponse> {
    try {
      logger.info('Validating password reset token');

      const { data, error } = await supabase.rpc('validate_password_reset_token', {
        p_token: token
      });

      if (error) {
        logger.error('Database error during token validation', { error });
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'Invalid token response',
        };
      }

      const result = data[0];

      telemetry.track('password_reset_token_validated', {
        success: result.success,
        hasUserId: !!result.user_id,
      });

      if (result.success) {
        logger.info('Password reset token validated successfully', {
          userId: result.user_id,
          email: result.email,
        });

        return {
          success: true,
          message: result.message,
          email: result.email,
          userId: result.user_id,
        };
      } else {
        logger.warn('Password reset token validation failed', {
          message: result.message,
        });

        return {
          success: false,
          message: result.message,
        };
      }

    } catch (error) {
      logger.error('Token validation error', { error });

      return {
        success: false,
        message: 'Failed to validate reset token. Please try again.',
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPasswordWithToken(request: PasswordResetWithTokenRequest): Promise<PasswordResetResponse> {
    try {
      logger.info('Resetting password with token');

      // Validate token first
      const validation = await this.validatePasswordResetToken(request.token);
      if (!validation.success) {
        return {
          success: false,
          message: validation.message,
        };
      }

      // Hash the new password
      const newPasswordHash = await this.hashPassword(request.newPassword);

      // Call database function to reset password
      const { data, error } = await supabase.rpc('reset_password_with_token', {
        p_token: request.token,
        p_new_password_hash: newPasswordHash
      });

      if (error) {
        logger.error('Database error during password reset', { error });
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No response from password reset function');
      }

      const result = data[0];

      telemetry.track('password_reset_completed', {
        success: result.success,
        userId: validation.userId,
        email: validation.email,
      });

      if (result.success) {
        logger.info('Password reset completed successfully', {
          userId: validation.userId,
          email: validation.email,
        });

        return {
          success: true,
          message: result.message,
        };
      } else {
        logger.error('Password reset failed', {
          message: result.message,
          userId: validation.userId,
        });

        return {
          success: false,
          message: result.message,
        };
      }

    } catch (error) {
      logger.error('Password reset error', { error });

      return {
        success: false,
        message: 'Failed to reset password. Please try again.',
      };
    }
  }

  /**
   * Get password reset email logs for debugging/admin purposes
   */
  async getPasswordResetLogs(adminUserId?: string): Promise<EmailLog[]> {
    try {
      let query = supabase
        .from('admin_email_logs')
        .select('*')
        .eq('email_type', 'password_reset')
        .order('created_at', { ascending: false })
        .limit(50);

      if (adminUserId) {
        query = query.eq('admin_user_id', adminUserId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching password reset logs', { error });
        throw error;
      }

      return (data || []).map((log: any) => ({
        id: log.id,
        adminUserId: log.admin_user_id,
        emailType: log.email_type,
        recipientEmail: log.recipient_email,
        subject: log.subject,
        templateData: log.template_data,
        sentAt: log.sent_at,
        deliveredAt: log.delivered_at,
        failedAt: log.failed_at,
        failureReason: log.failure_reason,
        emailProvider: log.email_provider,
        createdAt: log.created_at,
      }));

    } catch (error) {
      logger.error('Error getting password reset logs', { error });
      return [];
    }
  }

  /**
   * Clean up expired tokens (for maintenance)
   */
  async cleanupExpiredTokens(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_password_reset_tokens');

      if (error) {
        logger.error('Error cleaning up expired tokens', { error });
        throw error;
      }

      const deletedCount = data || 0;
      logger.info('Cleaned up expired password reset tokens', { deletedCount });

      return deletedCount;
    } catch (error) {
      logger.error('Token cleanup error', { error });
      return 0;
    }
  }

  /**
   * Simulate sending password reset email in development
   */
  private simulatePasswordResetEmail(email: string, token: string): void {
    if (!this.isDevelopment) return;

    const resetUrl = `${window.location.origin}/admin/reset-password?token=${token}`;
    
    // Create a styled console message
    const emailContent = `
╔══════════════════════════════════════════════════════════════╗
║                    PASSWORD RESET EMAIL                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  To: ${email.padEnd(52, ' ')} ║
║  Subject: Password Reset Request                             ║
║                                                              ║
║  Hi there,                                                   ║
║                                                              ║
║  You requested a password reset for your admin account.      ║
║  Click the link below to reset your password:               ║
║                                                              ║
║  🔗 ${resetUrl.padEnd(50, ' ')} ║
║                                                              ║
║  This link will expire in 15 minutes.                       ║
║                                                              ║
║  If you didn't request this, please ignore this email.      ║
║                                                              ║
║  Best regards,                                               ║
║  Ad Astra Admin Team                                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

🔗 RESET LINK: ${resetUrl}

⚠️  DEVELOPMENT MODE: In production, this would be sent via email service.
`;

    console.info('%c📧 Password Reset Email Sent (Development Mode)', 'color: #2563eb; font-size: 14px; font-weight: bold;');
    console.info(emailContent);

    // Also show a browser notification if possible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Password Reset Email Sent', {
        body: `Check console for reset link sent to ${email}`,
        icon: '/favicon.ico',
      });
    }
  }

  /**
   * Request notification permission for development mode
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!this.isDevelopment || !('Notification' in window)) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Mark email as sent (for when real email service is integrated)
   */
  async markEmailAsSent(emailLogId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_email_logs')
        .update({
          sent_at: new Date().toISOString(),
          email_provider: 'production_service', // Update when real service is integrated
        })
        .eq('id', emailLogId);

      if (error) {
        logger.error('Error marking email as sent', { error, emailLogId });
      }
    } catch (error) {
      logger.error('Error updating email status', { error, emailLogId });
    }
  }

  /**
   * Mark email as failed (for when real email service is integrated)
   */
  async markEmailAsFailed(emailLogId: string, failureReason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_email_logs')
        .update({
          failed_at: new Date().toISOString(),
          failure_reason: failureReason,
        })
        .eq('id', emailLogId);

      if (error) {
        logger.error('Error marking email as failed', { error, emailLogId });
      }
    } catch (error) {
      logger.error('Error updating email failure status', { error, emailLogId });
    }
  }
}

// Export singleton instance
export const passwordResetService = new PasswordResetService(); 