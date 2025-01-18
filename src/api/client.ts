import { supabase } from '@/integrations/supabase/client';
import { API_CONFIG } from './config';

interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  body?: any;
  requiresAuth?: boolean;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async request<T>({ method, path, body, requiresAuth = true }: ApiRequestConfig): Promise<T> {
    try {
      // Get current session if auth is required
      if (requiresAuth) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
        }
      }

      const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
      });

      const response = await fetch(`${API_CONFIG.baseURL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          error.message || 'An error occurred',
          response.status,
          error.code
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'An unexpected error occurred',
        500,
        'INTERNAL_ERROR'
      );
    }
  },

  get<T>(path: string, requiresAuth = true) {
    return this.request<T>({ method: 'GET', path, requiresAuth });
  },

  post<T>(path: string, body: any, requiresAuth = true) {
    return this.request<T>({ method: 'POST', path, body, requiresAuth });
  },

  put<T>(path: string, body: any, requiresAuth = true) {
    return this.request<T>({ method: 'PUT', path, body, requiresAuth });
  },

  delete<T>(path: string, requiresAuth = true) {
    return this.request<T>({ method: 'DELETE', path, requiresAuth });
  },
};
