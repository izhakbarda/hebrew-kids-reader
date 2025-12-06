-- Fix RLS policies for app_settings table to allow admin access
-- This script should be run in the Supabase SQL Editor

-- First, let's check if the table exists and view current policies
-- You can run: SELECT * FROM pg_policies WHERE tablename = 'app_settings';

-- Drop existing policies if any (optional, only if you want to recreate them)
-- DROP POLICY IF EXISTS "Allow admin to update app_settings" ON app_settings;
-- DROP POLICY IF EXISTS "Allow admin to insert app_settings" ON app_settings;
-- DROP POLICY IF EXISTS "Allow all to read app_settings" ON app_settings;

-- Create policy to allow admin user to INSERT/UPDATE app_settings
-- Replace 'your-admin-user-id' with the actual user ID of יצחק ברדה
-- You can find the user ID by running: SELECT id, email, raw_user_meta_data FROM auth.users;

CREATE POLICY "Allow admin to manage app_settings"
ON app_settings
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'full_name' = 'יצחק ברדה'
    OR raw_user_meta_data->>'child_name' = 'יצחק ברדה'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_user_meta_data->>'full_name' = 'יצחק ברדה'
    OR raw_user_meta_data->>'child_name' = 'יצחק ברדה'
  )
);

-- Also allow all authenticated users to READ app_settings (for mandatory book display)
CREATE POLICY "Allow authenticated users to read app_settings"
ON app_settings
FOR SELECT
USING (auth.role() = 'authenticated');

-- Alternative approach: If you want to use a specific user ID instead
-- First find the admin user ID:
-- SELECT id FROM auth.users WHERE raw_user_meta_data->>'full_name' = 'יצחק ברדה';
-- Then use it like this:
/*
CREATE POLICY "Allow specific admin to manage app_settings"
ON app_settings
FOR ALL
USING (auth.uid() = 'PASTE-ADMIN-USER-ID-HERE')
WITH CHECK (auth.uid() = 'PASTE-ADMIN-USER-ID-HERE');
*/
