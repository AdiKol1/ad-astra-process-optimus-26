import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback for development
const initSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing. Using development fallback configuration.');
    // For development only
    if (import.meta.env.DEV) {
      return createClient(
        'https://gjkagdysjgljjbnagoib.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqa2FnZHlzamdsampibmFnb2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NTAyMDcsImV4cCI6MjA0OTAyNjIwN30.Ufv6PUFpfPZdQHlDU3wZBrwOB7K-df6lkqWpdXDRKlk'
      );
    }
    throw new Error('Supabase configuration is required for production environment');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = initSupabase();

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data?.message || error.response.data || 'An error occurred';
  }
  return error.message || 'An error occurred';
};
