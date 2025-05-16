import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

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

// Create a single Supabase instance with modern storage configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: {
      getItem: (key) => {
        const value = localStorage.getItem(key);
        logger.debug('Storage get:', { key, hasValue: !!value });
        return value;
      },
      setItem: (key, value) => {
        logger.debug('Storage set:', { key });
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        logger.debug('Storage remove:', { key });
        localStorage.removeItem(key);
      }
    }
  },
  global: {
    headers: {
      'x-client-info': `@ad-astra/process-optimus@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`
    }
  }
}); 