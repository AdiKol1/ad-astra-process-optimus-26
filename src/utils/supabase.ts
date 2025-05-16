import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use fallbacks instead of failing when environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn('Missing Supabase environment variables, using mock configuration');
  // Use fallback values that won't throw errors but will create a non-functional client
  supabaseUrl = 'https://example.supabase.co';
  supabaseAnonKey = 'fallback-key-for-development';
}

// Validate URL format with a try-catch to avoid throwing
try {
  new URL(supabaseUrl);
} catch (error) {
  logger.warn(`Invalid Supabase URL, using fallback: ${error instanceof Error ? error.message : 'Invalid URL format'}`);
  supabaseUrl = 'https://example.supabase.co';
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    logger.info('Initializing Supabase client');
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: localStorage
      }
    });
  }
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

// Hook for React components
export const useSupabase = () => {
  return supabase;
};