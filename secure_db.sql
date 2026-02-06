-- SECURITY HARDENING SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Enable Row Level Security (RLS)
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy: ALLOW Uploads (Inserts) for everyone (Anonymous)
CREATE POLICY "Allow public uploads" 
ON public.files 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Create Policy: DENY Direct Reads (Selects) for everyone
-- We are NOT creating a SELECT policy. By default, with RLS enabled, no one can select.
-- Access will be granted ONLY via the secure functions below.

-- 4. Secure Function: Get File Metadata (Hides Password & URL for protected files)
CREATE OR REPLACE FUNCTION get_file_metadata(p_search_code text)
RETURNS TABLE (
    code text,
    original_name text,
    size bigint,
    mimetype text,
    is_protected boolean,
    url text -- Will be NULL if protected
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with admin privileges
AS $$
DECLARE
    v_file record;
BEGIN
    SELECT * INTO v_file FROM files WHERE files.code = p_search_code;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Return data based on protection status
    -- formatting: return query doesn't work well with logic, so we build the result
    code := v_file.code;
    original_name := v_file.original_name;
    size := v_file.size;
    mimetype := v_file.mimetype;
    
    IF v_file.password IS NOT NULL AND trim(v_file.password) <> '' THEN
        is_protected := true;
        url := NULL; -- HIDE URL
    ELSE
        is_protected := false;
        url := v_file.url; -- Show URL
    END IF;

    RETURN NEXT;
END;
$$;

-- 5. Secure Function: Verify Password (Returns URL if correct)
CREATE OR REPLACE FUNCTION verify_file_password(p_search_code text, p_password text)
RETURNS TABLE (
    success boolean,
    url text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stored_pass text;
    v_url text;
BEGIN
    SELECT password, url INTO v_stored_pass, v_url 
    FROM files 
    WHERE files.code = p_search_code;
    
    IF v_stored_pass = p_password THEN
        success := true;
        url := v_url;
    ELSE
        success := false;
        url := NULL;
    END IF;
    
    RETURN NEXT;
END;
$$;

-- 6. Grant Access to Anonymous Users to call these functions
GRANT EXECUTE ON FUNCTION get_file_metadata(text) TO anon;
GRANT EXECUTE ON FUNCTION verify_file_password(text, text) TO anon;

SELECT 'SECURITY SETUP COMPLETED' as status;
