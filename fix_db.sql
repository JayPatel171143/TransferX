-- RUN THIS TO FIX YOUR TABLE
-- You are missing the 'expires_at' column which causes the error!

ALTER TABLE public.files 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT (now() + interval '24 hours');

CREATE INDEX IF NOT EXISTS idx_files_expires_at ON public.files(expires_at);

-- This creates the column and sets a default expiration of 24 hours for any existing files.
