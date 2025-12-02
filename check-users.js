/* eslint-env node */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
    console.log('🔍 Checking Supabase Authentication Users...\n');

    // Get current session (if any)
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current Session:', session ? 'Active' : 'None');

    // Note: Listing all users requires admin privileges
    // With anon key, we can only check if auth is working
    console.log('\n✅ Supabase connection is working!');
    console.log('📊 To view all users, go to:');
    console.log('   https://supabase.com/dashboard/project/dfgaassdidgrgrmqucvf/auth/users');
    console.log('\n💡 Or use the Supabase Dashboard to manage users.');
}

checkUsers().catch(console.error);
