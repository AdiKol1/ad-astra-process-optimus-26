import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL: ${error instanceof Error ? error.message : 'Invalid URL format'}`);
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