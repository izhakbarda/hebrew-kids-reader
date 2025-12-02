-- ============================================
-- CLEANUP DUPLICATE USERS - AUTOMATED SCRIPT
-- ============================================
-- This script identifies duplicate users and generates DELETE commands
-- to remove all but the oldest account for each user.
--
-- IMPORTANT: Review the generated DELETE commands before running them!
-- ============================================

-- STEP 1: Identify all duplicates and show which ones will be kept vs deleted
WITH duplicates AS (
    SELECT 
        raw_user_meta_data->>'full_name' as full_name,
        raw_user_meta_data->>'child_name' as child_name,
        id,
        email,
        created_at,
        ROW_NUMBER() OVER (
            PARTITION BY raw_user_meta_data->>'full_name' 
            ORDER BY created_at ASC
        ) as row_num
    FROM auth.users
    WHERE raw_user_meta_data->>'full_name' IS NOT NULL
)
SELECT 
    full_name,
    child_name,
    id,
    email,
    created_at,
    CASE 
        WHEN row_num = 1 THEN '✓ KEEP (oldest)'
        ELSE '✗ DELETE (duplicate)'
    END as action
FROM duplicates
WHERE full_name IN (
    SELECT full_name 
    FROM duplicates 
    GROUP BY full_name 
    HAVING COUNT(*) > 1
)
ORDER BY full_name, created_at;

-- ============================================
-- STEP 2: Generate DELETE commands for duplicates
-- INCLUDES deletion of related data (read history, read counts)
-- Copy and run these commands ONE BY ONE after reviewing
-- ============================================

WITH duplicates AS (
    SELECT 
        raw_user_meta_data->>'full_name' as full_name,
        id,
        email,
        created_at,
        ROW_NUMBER() OVER (
            PARTITION BY raw_user_meta_data->>'full_name' 
            ORDER BY created_at ASC
        ) as row_num
    FROM auth.users
    WHERE raw_user_meta_data->>'full_name' IS NOT NULL
)
SELECT 
    format(
        E'-- Deleting duplicate for: %s (%s)\n' ||
        'DELETE FROM user_book_read_history WHERE user_id = %L;\n' ||
        'DELETE FROM user_book_reads WHERE user_id = %L;\n' ||
        'DELETE FROM auth.users WHERE id = %L;\n',
        full_name,
        email,
        id,
        id,
        id
    ) as delete_commands
FROM duplicates
WHERE row_num > 1  -- Only delete duplicates, keep the first (oldest) one
ORDER BY full_name, created_at;

-- ============================================
-- ALTERNATIVE: Delete ALL duplicates in one transaction
-- ============================================
-- WARNING: This will delete ALL duplicate users at once!
-- Only use this if you've reviewed the list above and are confident.
-- Uncomment and run as a single transaction:

/*
BEGIN;

-- Delete read history for duplicate users
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY raw_user_meta_data->>'full_name' 
            ORDER BY created_at ASC
        ) as row_num
    FROM auth.users
    WHERE raw_user_meta_data->>'full_name' IS NOT NULL
)
DELETE FROM user_book_read_history 
WHERE user_id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);

-- Delete read counts for duplicate users
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY raw_user_meta_data->>'full_name' 
            ORDER BY created_at ASC
        ) as row_num
    FROM auth.users
    WHERE raw_user_meta_data->>'full_name' IS NOT NULL
)
DELETE FROM user_book_reads 
WHERE user_id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);

-- Delete duplicate users (keep oldest)
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY raw_user_meta_data->>'full_name' 
            ORDER BY created_at ASC
        ) as row_num
    FROM auth.users
    WHERE raw_user_meta_data->>'full_name' IS NOT NULL
)
DELETE FROM auth.users 
WHERE id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);

COMMIT;
*/

-- ============================================
-- STEP 3: After deleting duplicates, verify no duplicates remain
-- ============================================

-- Run this query after cleanup to verify:
SELECT 
    raw_user_meta_data->>'full_name' as full_name,
    COUNT(*) as count
FROM auth.users
WHERE raw_user_meta_data->>'full_name' IS NOT NULL
GROUP BY raw_user_meta_data->>'full_name'
HAVING COUNT(*) > 1;

-- If this returns no rows, cleanup was successful!

-- ============================================
-- STEP 4: Verify data integrity
-- ============================================

-- Check for orphaned read history (should return 0 rows):
-- SELECT COUNT(*) FROM user_book_read_history 
-- WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Check for orphaned read counts (should return 0 rows):
-- SELECT COUNT(*) FROM user_book_reads 
-- WHERE user_id NOT IN (SELECT id FROM auth.users);
