import { supabase } from './supabase';

// Track ongoing increment operations to prevent duplicates
const processingIncrements = new Set();

// Helper function to get today's start time in UTC
const getTodayStartUTC = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return todayStart.toISOString();
};

export const incrementBookRead = async (userId, bookId) => {
    const key = `${userId}-${bookId}`;

    // Prevent duplicate calls
    if (processingIncrements.has(key)) {
        console.log('Already processing increment for this book, skipping...');
        return null;
    }

    processingIncrements.add(key);

    try {
        // Insert a new read event in history table
        const { error: historyError } = await supabase
            .from('user_book_read_history')
            .insert({
                user_id: userId,
                book_id: bookId,
                read_at: new Date().toISOString()
            });

        if (historyError) {
            console.error('Error inserting read history:', historyError);
            processingIncrements.delete(key);
            return null;
        }

        // Update or insert aggregate count in user_book_reads
        const { data: existingData, error: selectError } = await supabase
            .from('user_book_reads')
            .select('read_count')
            .eq('user_id', userId)
            .eq('book_id', bookId)
            .maybeSingle();

        if (selectError) {
            console.error('Error checking book read:', selectError);
            processingIncrements.delete(key);
            return null;
        }

        if (existingData) {
            // Record exists, increment it
            const { data: updatedData, error: updateError } = await supabase
                .from('user_book_reads')
                .update({
                    read_count: existingData.read_count + 1,
                    last_read_at: new Date().toISOString()
                })
                .eq('user_id', userId)
                .eq('book_id', bookId)
                .select()
                .single();

            if (updateError) {
                console.error('Error updating book read:', updateError);
                processingIncrements.delete(key);
                return null;
            }

            processingIncrements.delete(key);
            return updatedData;
        } else {
            // Record doesn't exist, create it
            const { data: newData, error: insertError } = await supabase
                .from('user_book_reads')
                .insert({
                    user_id: userId,
                    book_id: bookId,
                    read_count: 1
                })
                .select()
                .single();

            if (insertError) {
                console.error('Error inserting book read:', insertError);
                processingIncrements.delete(key);
                return null;
            }

            processingIncrements.delete(key);
            return newData;
        }
    } catch (err) {
        console.error('Unexpected error in incrementBookRead:', err);
        processingIncrements.delete(key);
        return null;
    }
};

export const getBookReads = async (userId) => {
    try {
        // Get total counts from user_book_reads
        const { data: totalData, error: totalError } = await supabase
            .from('user_book_reads')
            .select('book_id, read_count')
            .eq('user_id', userId);

        if (totalError) {
            console.error('Error fetching book reads:', totalError);
            return {};
        }

        // Get today's reads from user_book_read_history
        const todayStart = getTodayStartUTC();
        const { data: todayData, error: todayError } = await supabase
            .from('user_book_read_history')
            .select('book_id')
            .eq('user_id', userId)
            .gte('read_at', todayStart);

        if (todayError) {
            console.error('Error fetching today\'s reads:', todayError);
            // Continue with just total counts if today's query fails
        }

        // Count today's reads per book
        const todayCounts = {};
        if (todayData) {
            todayData.forEach(item => {
                todayCounts[item.book_id] = (todayCounts[item.book_id] || 0) + 1;
            });
        }

        // Combine total and today's counts
        const readsMap = {};
        totalData.forEach(item => {
            readsMap[item.book_id] = {
                total: item.read_count,
                today: todayCounts[item.book_id] || 0
            };
        });

        return readsMap;
    } catch (err) {
        console.error('Unexpected error in getBookReads:', err);
        return {};
    }
};

export const getMandatoryBookId = async () => {
    try {
        const { data, error } = await supabase
            .from('app_settings')
            .select('setting_value')
            .eq('setting_key', 'mandatory_book_id')
            .single();

        if (error) {
            console.error('Error fetching mandatory book setting:', error);
            return null;
        }

        return data?.setting_value;
    } catch (err) {
        console.error('Unexpected error in getMandatoryBookId:', err);
        return null;
    }
};

export const setMandatoryBookId = async (bookId) => {
    try {
        const { data, error } = await supabase
            .from('app_settings')
            .upsert({
                setting_key: 'mandatory_book_id',
                setting_value: bookId,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error setting mandatory book:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error in setMandatoryBookId:', err);
        return null;
    }
};
