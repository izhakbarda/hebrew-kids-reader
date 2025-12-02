import React, { useState, useEffect, useRef } from 'react';
import Library from './components/Library';
import Reader from './components/Reader';
import Login from './components/Login';
import { books } from './data/books';
import { getBookReads, incrementBookRead, getMandatoryBookId, setMandatoryBookId } from './lib/db';
import { supabase } from './lib/supabase';

function App() {
    const [currentView, setCurrentView] = useState('library');
    const [currentBook, setCurrentBook] = useState(null);
    const [user, setUser] = useState(null);
    const [readCounts, setReadCounts] = useState({});
    const [mandatoryBookId, setMandatoryBookIdState] = useState(null);
    const processingFinish = useRef(false);

    // Check for existing session on mount
    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                const userData = {
                    id: session.user.id,
                    name: session.user.user_metadata?.child_name || 'ילד',
                    fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.child_name || 'ילד',
                    email: session.user.email
                };
                setUser(userData);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                const userData = {
                    id: session.user.id,
                    name: session.user.user_metadata?.child_name || 'ילד',
                    fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.child_name || 'ילד',
                    email: session.user.email
                };
                setUser(userData);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadData = async () => {
        // Load mandatory book setting (global)
        const mBookId = await getMandatoryBookId();
        setMandatoryBookIdState(mBookId);

        // Load user read counts if logged in
        if (user && user.id) {
            console.log('Loading read counts for user:', user.id);
            const counts = await getBookReads(user.id);
            console.log('Read counts loaded:', counts);
            setReadCounts(counts);
        }
    };

    // Initial load
    useEffect(() => {
        loadData();
    }, [user]);

    // Reload data when app comes to foreground
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('App became visible, reloading data...');
                loadData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user]);


    const handleSelectBook = (book) => {
        setCurrentBook(book);
        setCurrentView('reader');
        processingFinish.current = false; // Reset when selecting a new book
    };

    const handleBackToLibrary = () => {
        setCurrentView('library');
        setCurrentBook(null);
        processingFinish.current = false; // Reset when going back
    };

    const handleLogin = (userData) => {
        setUser(userData);
        setCurrentView('library');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const handleFinishBook = async (bookId) => {
        // Prevent duplicate calls (React StrictMode calls effects twice)
        if (processingFinish.current) {
            console.log('Already processing finish, skipping duplicate call');
            return;
        }

        processingFinish.current = true;
        console.log('Book finished! Book ID:', bookId, 'User:', user);

        if (user && user.id) {
            console.log('Incrementing read count...');
            const result = await incrementBookRead(user.id, bookId);
            console.log('Increment result:', result);
            await loadData(); // Reload counts and settings
        }
        handleBackToLibrary();
    };

    const handleSetMandatoryBook = async (bookId) => {
        // If clicking the already mandatory book, toggle it off (set to null)
        const newId = mandatoryBookId === bookId ? null : bookId;

        // Optimistic update
        setMandatoryBookIdState(newId);

        // DB update
        await setMandatoryBookId(newId);

        // Reload to confirm
        const confirmedId = await getMandatoryBookId();
        setMandatoryBookIdState(confirmedId);
    };

    // If no user is logged in, show Login screen
    if (!user) {
        return (
            <div className="min-h-screen font-sans" dir="rtl">
                <Login onLogin={handleLogin} />
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans" dir="rtl">
            {currentView === 'library' && (
                <Library
                    books={books}
                    onSelectBook={handleSelectBook}
                    onLogout={handleLogout}
                    user={user}
                    readCounts={readCounts}
                    mandatoryBookId={mandatoryBookId}
                    onSetMandatoryBook={handleSetMandatoryBook}
                />
            )}
            {currentView === 'reader' && (
                <Reader
                    book={currentBook}
                    onBack={handleBackToLibrary}
                    onFinish={() => handleFinishBook(currentBook.id)}
                />
            )}
        </div>
    );
}

export default App;
