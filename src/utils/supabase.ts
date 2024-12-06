import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For development, provide mock client if configuration is missing
const createMockClient = () => ({
  functions: {
    invoke: async () => {
      console.warn('Using mock Supabase client. Please configure your environment variables.');
      return { data: null, error: null };
    }
  }
});

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();