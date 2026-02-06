-- Complete Supabase Schema for TransferX
-- Run this in your Supabase SQL Editor

-- 1. Create the files table if it doesn't exist
CREATE TABLE IF NOT EXISTS files (
    id BIGSERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    original_name TEXT NOT NULL,
    storage_name TEXT NOT NULL,
    size BIGINT NOT NULL,
    mimetype TEXT,
    url TEXT NOT NULL,
    password TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_files_code ON files(code);

-- 3. Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_files_expires_at ON files(expires_at);

-- 4. Disable Row Level Security (RLS) for simplicity
-- WARNING: This allows public access. For production, configure proper RLS policies.
ALTER TABLE files DISABLE ROW LEVEL SECURITY;

-- 5. Grant permissions (if needed)
-- GRANT ALL ON files TO anon;
-- GRANT ALL ON files TO authenticated;

-- 6. Verify the table structure
-- Run this to check: SELECT * FROM information_schema.columns WHERE table_name = 'files';
