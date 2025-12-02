import { supabase } from './src/lib/supabase.js';
import { incrementBookRead, getBookReads } from './src/lib/db.js';

async function testDatabase() {
    console.log('Testing database connection...\n');

    // Test 1: Check if we can connect to Supabase
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.log('❌ Not logged in. Please log in first.');
            return;
        }
        console.log('✅ Connected to Supabase');
        console.log('User ID:', user.id);
        console.log('User Email:', user.email);
        console.log('User Name:', user.user_metadata?.child_name || 'N/A');
        console.log('');

        // Test 2: Try to get current book reads
        console.log('Fetching current book reads...');
        const reads = await getBookReads(user.id);
        console.log('Current reads:', reads);
        console.log('');

        // Test 3: Try to increment a book read
        console.log('Incrementing read count for book ID 1...');
        const result = await incrementBookRead(user.id, 1);
        console.log('Result:', result);
        console.log('');

        // Test 4: Fetch reads again to verify
        console.log('Fetching updated book reads...');
        const updatedReads = await getBookReads(user.id);
        console.log('Updated reads:', updatedReads);
        console.log('');

        console.log('✅ All tests completed!');
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testDatabase();
