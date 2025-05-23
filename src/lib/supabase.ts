import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For development, create a mock client if environment variables are missing
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured - using mock client for development');
  supabase = {
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

  // Create a single Supabase instance with modern storage configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
}

export { supabase }; 