// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "https://gjkagdysjgljjbnagoib.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqa2FnZHlzamdsampibmFnb2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NTAyMDcsImV4cCI6MjA0OTAyNjIwN30.Ufv6PUFpfPZdQHlDU3wZBrwOB7K-df6lkqWpdXDRKlk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);