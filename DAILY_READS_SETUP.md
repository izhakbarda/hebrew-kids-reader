# Daily Read Count Feature - Setup Instructions

## ✅ Code Changes Complete

The following files have been updated:
- ✅ `src/lib/db.js` - Updated to track individual reads and return daily counts
- ✅ `src/components/Library.jsx` - Updated to display combined format
- ✅ `SUPABASE_DAILY_READS.sql` - New migration script created

## 🚀 Required Action: Run Database Migration

You need to run the SQL migration to create the new `user_book_read_history` table.

### Steps:

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Open SQL Editor**
3. **Copy and paste** the contents of `SUPABASE_DAILY_READS.sql`
4. **Click "Run"**

### What the migration does:
- Creates `user_book_read_history` table to track individual read events with timestamps
- Adds indexes for better query performance
- Sets up Row Level Security (RLS) policies

## 📊 How It Works

### Display Format:
```
🏆 קראתי 5 פעמים (2 היום)
```

- **Total count**: Shows all-time reads from `user_book_reads` table
- **Daily count**: Counts reads from `user_book_read_history` where `read_at >= today 00:00`
- **Daily count only shows** if the user read the book today (otherwise just shows total)

### Examples:
- Read 5 times total, 2 today: **"🏆 קראתי 5 פעמים (2 היום)"**
- Read 3 times total, 0 today: **"🏆 קראתי 3 פעמים"**
- Read 1 time total, 1 today: **"🏆 קראתי 1 פעמים (1 היום)"**

## 🧪 Testing

After running the migration:

1. **Login** to the app
2. **Read a book** to completion
3. **Check the library** - should show: "🏆 קראתי 1 פעמים (1 היום)"
4. **Read the same book again**
5. **Check the library** - should show: "🏆 קראתי 2 פעמים (2 היום)"
6. **Tomorrow** - the daily count will reset, showing: "🏆 קראתי 2 פעמים"

## 🔧 Troubleshooting

If you see errors:
- **"relation does not exist"**: You need to run the SQL migration
- **No daily count showing**: Check browser console for errors
- **Wrong timezone**: The app uses UTC midnight as day boundary

## 📝 Notes

- Daily counts reset at midnight UTC
- The `user_book_reads` table still exists for aggregate counts (performance)
- Each book finish creates a new row in `user_book_read_history`
- Old read counts are preserved and will continue to work
