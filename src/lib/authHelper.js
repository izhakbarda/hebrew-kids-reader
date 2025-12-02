import { supabase } from './supabase';
import { authorizedUsers } from '../data/authorizedUsers';

// Helper to generate deterministic credentials from a name
const generateCredentials = (fullName) => {
    // Create a simple numeric hash from the name
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
        const char = fullName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Make it positive and convert to string
    const hashStr = Math.abs(hash).toString();

    const email = `user${hashStr}@hkr.app`;
    const password = `pass_${hashStr}_${fullName.length}`; // Add length for extra uniqueness

    return { email, password };
};

export const loginByName = async (fullName) => {
    // Normalize the input: trim whitespace and normalize spaces
    const normalizedInput = fullName.trim().replace(/\s+/g, ' ');

    // Check if user exists (also normalize the stored names for comparison)
    const userExists = authorizedUsers.some(name =>
        name.trim().replace(/\s+/g, ' ') === normalizedInput
    );

    if (!userExists) {
        console.log('User not found. Input:', normalizedInput);
        console.log('Available users:', authorizedUsers);
        return { error: 'User not found in authorized list' };
    }

    const { email, password } = generateCredentials(normalizedInput);
    const firstName = normalizedInput.split(' ')[0];

    try {
        // 1. Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!signInError && signInData.user) {
            return { user: signInData.user };
        }

        // 2. If sign in fails (likely user doesn't exist yet), try to sign up
        console.log('Sign in failed, attempting to create user...', signInError?.message);

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    child_name: firstName,
                    full_name: normalizedInput
                }
            }
        });

        if (signUpError) {
            console.error('Sign up error:', signUpError);
            return { error: signUpError.message };
        }

        return { user: signUpData.user };

    } catch (err) {
        console.error('Unexpected auth error:', err);
        return { error: 'An unexpected error occurred' };
    }
};
