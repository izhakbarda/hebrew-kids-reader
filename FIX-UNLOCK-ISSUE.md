# How to Fix the Book Unlock Issue

## Problem
When the admin presses unlock for a book, it remains locked because the database update fails due to Row Level Security (RLS) policies.

## Root Cause
The Supabase `app_settings` table has RLS policies that prevent the admin user from updating the `mandatory_book_id` setting.

## Solution Steps

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor (left sidebar)

### Step 2: Find Your Admin User ID
Run this query to find the admin user's ID:

```sql
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE raw_user_meta_data->>'full_name' = 'יצחק ברדה'
   OR raw_user_meta_data->>'child_name' = 'יצחק ברדה';
```

Copy the `id` value - you'll need it in the next step.

### Step 3: Check Current RLS Policies
Run this to see current policies on the `app_settings` table:

```sql
SELECT * FROM pg_policies WHERE tablename = 'app_settings';
```

### Step 4: Update RLS Policies
You have two options:

#### Option A: Allow admin by name (Recommended)
```sql
-- Drop existing policies if needed
DROP POLICY IF EXISTS "Allow admin to manage app_settings" ON app_settings;
DROP POLICY IF EXISTS "Allow authenticated users to read app_settings" ON app_settings;

-- Create policy for admin to manage settings
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

-- Allow all users to read settings
CREATE POLICY "Allow authenticated users to read app_settings"
ON app_settings
FOR SELECT
USING (auth.role() = 'authenticated');
```

#### Option B: Allow admin by specific user ID
Replace `YOUR-ADMIN-USER-ID-HERE` with the ID from Step 2:

```sql
-- Drop existing policies if needed
DROP POLICY IF EXISTS "Allow admin to manage app_settings" ON app_settings;
DROP POLICY IF EXISTS "Allow authenticated users to read app_settings" ON app_settings;

-- Create policy for specific admin user
CREATE POLICY "Allow admin to manage app_settings"
ON app_settings
FOR ALL
USING (auth.uid() = 'YOUR-ADMIN-USER-ID-HERE')
WITH CHECK (auth.uid() = 'YOUR-ADMIN-USER-ID-HERE');

-- Allow all users to read settings
CREATE POLICY "Allow authenticated users to read app_settings"
ON app_settings
FOR SELECT
USING (auth.role() = 'authenticated');
```

### Step 5: Test the Fix
1. Go back to your app at http://localhost:5173
2. Login as admin (יצחק ברדה)
3. Go to the library
4. Click the lock icon on any book to lock it
5. Click the lock icon again to unlock it
6. Check the browser console - you should see:
   - "Setting mandatory book: { action: 'UNLOCKING' }"
   - "Database update result: { setting_value: null }"
   - "Confirmed mandatory book ID from DB: null"
7. All books should now be unlocked!

## Verification
After applying the fix, the console should show successful database updates without any RLS policy errors.

## Alternative Quick Fix (If you have direct database access)
If you want to temporarily disable RLS on the app_settings table (NOT recommended for production):

```sql
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
```

But it's better to use proper policies as shown above.
