-- COPY ALL TEXT BELOW THIS LINE ----------------------------------

-- 1. Create the 'files' table
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

-- 2. Create indexes for speed
CREATE INDEX IF NOT EXISTS idx_files_code ON files(code);
CREATE INDEX IF NOT EXISTS idx_files_expires_at ON files(expires_at);

-- 3. Disable Row Level Security (Required for public access)
ALTER TABLE files DISABLE ROW LEVEL SECURITY;

-- 4. Successful Setup Confirmation
SELECT 'SETUP COMPLETED SUCCESSFULLY' as status;

-- COPY ALL TEXT ABOVE THIS LINE ----------------------------------
