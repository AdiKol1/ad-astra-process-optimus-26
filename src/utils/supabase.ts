import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not configured - using mock client for development');
      supabaseInstance = {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          signIn: () => Promise.resolve({ data: null, error: null }),
          signOut: () => Promise.resolve({ error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        },
        from: () => ({
          insert: () => Promise.resolve({ data: null, error: null }),
          select: () => Promise.resolve({ data: [], error: null }),
          update: () => Promise.resolve({ data: null, error: null }),
          delete: () => Promise.resolve({ data: null, error: null })
        })
      };
    } else {
      // Validate URL format
      try {
        new URL(supabaseUrl);
      } catch (error) {
        throw new Error(`Invalid Supabase URL: ${error instanceof Error ? error.message : 'Invalid URL format'}`);
      }

      logger.info('Initializing Supabase client');
      
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          storage: localStorage
        }
      });
    }
  }
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

// Hook for React components
export const useSupabase = () => {
  return supabase;
};