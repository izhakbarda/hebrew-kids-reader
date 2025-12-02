import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://dfgaassdidgrgrmqucvf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZ2Fhc3NkaWRncmdybXF1Y3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNjc5MDcsImV4cCI6MjA3OTg0MzkwN30.hTsDgv-WhsrkZ6xYdZnMYZBLxf3hl7XCF_TCHGY5tcI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'hkr-auth-token',
    }
});
