/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, type AdminUser, type LoginCredentials, type LoginResponse } from '@/services/auth/authService';
import { logger } from '@/utils/logger';

interface AuthContextType {
  // State
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  
  // Utilities
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const session = authService.getCurrentSession();
        
        if (session) {
          setUser(session.user);
          logger.info('User session restored', { userId: session.user.id });
        }
      } catch (error) {
        logger.error('Error initializing auth', { error });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh session periodically
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        const refreshed = await authService.refreshSession();
        if (!refreshed) {
          // Session expired or invalid, logout
          await handleLogout();
        }
      } catch (error) {
        logger.error('Error refreshing session', { error });
        await handleLogout();
      }
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  const handleLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
        logger.info('User logged in', { userId: response.user.id });
      }
      
      return response;
    } catch (error) {
      logger.error('Login error in context', { error });
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      logger.info('User logged out');
    } catch (error) {
      logger.error('Logout error in context', { error });
    }
  };

  const handleRefreshSession = async (): Promise<boolean> => {
    try {
      const refreshed = await authService.refreshSession();
      
      if (refreshed) {
        const session = authService.getCurrentSession();
        if (session) {
          setUser(session.user);
        }
      } else {
        setUser(null);
      }
      
      return refreshed;
    } catch (error) {
      logger.error('Error refreshing session in context', { error });
      setUser(null);
      return false;
    }
  };

  const handleIsSuperAdmin = (): boolean => {
    return authService.isSuperAdmin();
  };

  const value: AuthContextType = {
    // State
    user,
    isAuthenticated: !!user,
    isLoading,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    refreshSession: handleRefreshSession,
    
    // Utilities
    isSuperAdmin: handleIsSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Hook to require authentication
 */
export const useRequireAuth = (): AuthContextType => {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login page
      window.location.href = '/admin/login';
    }
  }, [auth.isAuthenticated, auth.isLoading]);
  
  return auth;
}; 