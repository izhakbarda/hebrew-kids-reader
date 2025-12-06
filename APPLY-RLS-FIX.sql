-- STEP 1: First, run GET-ADMIN-ID.sql to get your admin user ID
-- Copy the ID value and replace YOUR_ADMIN_USER_ID_HERE below with that ID

-- STEP 2: Drop existing policies
DROP POLICY IF EXISTS "Allow admin to manage app_settings" ON app_settings;
DROP POLICY IF EXISTS "Allow authenticated users to read app_settings" ON app_settings;

-- STEP 3: Create new policies using the specific admin user ID
-- Replace YOUR_ADMIN_USER_ID_HERE with the actual ID from STEP 1
CREATE POLICY "Allow admin to manage app_settings"
ON app_settings
FOR ALL
USING (auth.uid() = 'YOUR_ADMIN_USER_ID_HERE'::uuid)
WITH CHECK (auth.uid() = 'YOUR_ADMIN_USER_ID_HERE'::uuid);

-- STEP 4: Allow all authenticated users to read app_settings
CREATE POLICY "Allow authenticated users to read app_settings"
ON app_settings
FOR SELECT
USING (auth.role() = 'authenticated');

-- EXAMPLE: If your admin ID is 9ee75062-fd7d-4604-a3e7-18b32caa58ab, it would look like:
-- CREATE POLICY "Allow admin to manage app_settings"
-- ON app_settings
-- FOR ALL
-- USING (auth.uid() = '9ee75062-fd7d-4604-a3e7-18b32caa58ab'::uuid)
-- WITH CHECK (auth.uid() = '9ee75062-fd7d-4604-a3e7-18b32caa58ab'::uuid);
