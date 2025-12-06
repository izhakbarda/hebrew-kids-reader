-- Run this query in Supabase SQL Editor to get your admin user ID
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE raw_user_meta_data->>'full_name' = 'יצחק ברדה'
   OR raw_user_meta_data->>'child_name' = 'יצחק ברדה';

-- Copy the 'id' value from the result
-- It will look something like: 9ee75062-fd7d-4604-a3e7-18b32caa58ab
