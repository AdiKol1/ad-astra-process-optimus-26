import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data.message || 'An error occurred with the API';
  }
  if (error.request) {
    return 'No response received from the server';
  }
  return error.message || 'An unexpected error occurred';
};
