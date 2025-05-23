-- Create logs table for tracking user interactions
CREATE TABLE public.logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  level text NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message text NOT NULL,
  data jsonb,
  environment text NOT NULL,
  source text,
  user_session_id text,
  user_agent text,
  url text
);

-- Create an index for faster queries
CREATE INDEX idx_logs_created_at ON public.logs(created_at);
CREATE INDEX idx_logs_level ON public.logs(level);
CREATE INDEX idx_logs_session ON public.logs(user_session_id);

-- Enable Row Level Security
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for logging)
CREATE POLICY "Allow log inserts" ON public.logs
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading logs (for admin/analysis)
CREATE POLICY "Allow log reads" ON public.logs
  FOR SELECT 
  USING (true); 