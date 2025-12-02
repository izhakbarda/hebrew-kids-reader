-- ============================================
-- Clean User Book Read Counts and History
-- ============================================

-- Option 1: Delete ALL read history and counts for ALL users
-- WARNING: This will permanently delete all reading history
DELETE FROM public.user_book_read_history;
DELETE FROM public.user_book_reads;

-- Option 2: Delete read history for a SPECIFIC user
-- Replace 'USER_ID_HERE' with the actual user ID
-- DELETE FROM public.user_book_read_history 
-- WHERE user_id = 'USER_ID_HERE';
-- DELETE FROM public.user_book_reads 
-- WHERE user_id = 'USER_ID_HERE';

-- Option 3: Delete read history for a SPECIFIC book (all users)
-- Replace X with the actual book ID
-- DELETE FROM public.user_book_read_history 
-- WHERE book_id = X;
-- DELETE FROM public.user_book_reads 
-- WHERE book_id = X;

-- Option 4: Delete read history for a specific user AND book
-- DELETE FROM public.user_book_read_history 
-- WHERE user_id = 'USER_ID_HERE' AND book_id = X;
-- DELETE FROM public.user_book_reads 
-- WHERE user_id = 'USER_ID_HERE' AND book_id = X;

-- Option 5: Delete only TODAY's read history (keep total counts)
-- This removes today's reads but keeps the aggregate counts
-- DELETE FROM public.user_book_read_history 
-- WHERE read_at >= CURRENT_DATE;

-- Option 6: Delete read history older than X days
-- Replace 30 with the number of days you want to keep
-- DELETE FROM public.user_book_read_history 
-- WHERE read_at < NOW() - INTERVAL '30 days';

-- ============================================
-- Verify the cleanup
-- ============================================

-- After running the delete, verify with:
-- SELECT * FROM public.user_book_read_history;
-- SELECT * FROM public.user_book_reads;

-- To see how many records remain:
-- SELECT COUNT(*) FROM public.user_book_read_history;
-- SELECT COUNT(*) FROM public.user_book_reads;
