import React from 'react';
import { LogOut, User, Lock, ArrowLeft } from 'lucide-react';

const Library = ({ books, onSelectBook, onLogout, user, readCounts, mandatoryBookId, onSetMandatoryBook, onBack }) => {
    // Exact color mapping to match the book emojis
    const bookStyles = [
        { emoji: '📘', borderColor: '#3B82F6' }, // Blue book - bright blue
        { emoji: '📕', borderColor: '#EC4899' }, // Pink/Magenta book
        { emoji: '📙', borderColor: '#F97316' }, // Orange book
        { emoji: '📗', borderColor: '#22C55E' }, // Green book - lime green
        { emoji: '📕', borderColor: '#EF4444' }, // Red book
        { emoji: '📒', borderColor: '#EAB308' }, // Yellow book
        { emoji: '📘', borderColor: '#06B6D4' }, // Cyan book
        { emoji: '📔', borderColor: '#8B5CF6' }, // Purple book
        { emoji: '📓', borderColor: '#6366F1' }, // Indigo book
    ];

    const isAdmin = user?.fullName === 'יצחק ברדה' || user?.name === 'יצחק ברדה';
    const REQUIRED_READS = 5;

    // Find if there's a book that needs to be read multiple times before unlocking others
    const blockingBook = user && mandatoryBookId
        ? books.find(b => b.id === mandatoryBookId && (readCounts[b.id]?.total || 0) < REQUIRED_READS)
        : null;

    console.log('Library Debug:', {
        user: user?.name,
        mandatoryBookId,
        blockingBook: blockingBook?.title,
        totalBooks: books.length
    });

    return (
        <div className="p-5 sm:p-8 min-h-screen">
            <header className="text-center mb-12 animate-fadeInDown relative">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 bg-white/20 p-2 rounded-full hover:bg-white/30 transition z-50 text-white"
                    title="חזור"
                >
                    <ArrowLeft size={24} />
                </button>

                <h1 className="text-white text-5xl sm:text-6xl font-bold mb-3 flex items-center justify-center gap-4" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
                    📚 הספרייה שלי
                </h1>
                <p className="text-white/95 text-xl sm:text-2xl font-light">
                    עולם של ספרים
                </p>

                {blockingBook && (
                    <div className="mt-6 bg-yellow-100/90 backdrop-blur-sm text-yellow-800 px-6 py-3 rounded-2xl inline-flex items-center gap-3 shadow-lg animate-bounce-subtle mx-auto max-w-2xl">
                        <div className="bg-yellow-500 text-white p-2 rounded-full">
                            <Lock size={24} />
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">הספרייה נעולה!</p>
                            <p>יש לקרוא את הספר "{blockingBook.title}" {REQUIRED_READS} פעמים כדי להציג את שאר הספרים.</p>
                        </div>
                    </div>
                )}
            </header>

            <section>
                <h2 className="text-white text-3xl sm:text-4xl font-semibold text-center mb-8 flex items-center justify-center gap-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    ✨ הספרים שלי
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {books.slice().reverse()
                        .filter(book => !blockingBook || book.id === blockingBook.id)
                        .map((book, index) => {
                            const styleIndex = index % bookStyles.length;
                            const bookStyle = bookStyles[styleIndex];
                            const animationDelay = `${(index % 9) * 0.1}s`;

                            const isLocked = blockingBook && blockingBook.id !== book.id;

                            // Hide locked books completely
                            if (isLocked) return null;

                            const isBlockingBook = blockingBook && blockingBook.id === book.id;
                            const isMandatory = mandatoryBookId === book.id;
                            const readsLeft = isBlockingBook ? REQUIRED_READS - (readCounts[book.id]?.total || 0) : 0;

                            return (
                                <div
                                    key={book.id}
                                    onClick={() => !isLocked && onSelectBook(book)}
                                    className={`bg-white rounded-3xl p-10 text-center transition-all duration-300 shadow-xl relative overflow-hidden group animate-fadeInUp ${isLocked ? 'cursor-not-allowed opacity-75 grayscale-[0.5]' : 'cursor-pointer hover:shadow-2xl'}`}
                                    style={{
                                        animationDelay,
                                        transform: 'translateY(0)',
                                        borderTop: `8px solid ${isLocked ? '#9CA3AF' : bookStyle.borderColor}`,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLocked) e.currentTarget.style.transform = 'translateY(-15px) scale(1.03)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    }}
                                >
                                    {isLocked && (
                                        <div className="absolute inset-0 bg-gray-200/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-gray-500">
                                            <Lock size={48} className="mb-2 opacity-70" />
                                            <span className="font-bold text-lg">נעול</span>
                                        </div>
                                    )}

                                    {isMandatory && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                                                חובה לקרוא!
                                            </div>
                                        </div>
                                    )}

                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSetMandatoryBook(book.id);
                                            }}
                                            className={`absolute top-4 left-4 z-30 p-2 rounded-full shadow-lg transition-all ${isMandatory ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                            title={isMandatory ? "בטל חובת קריאה" : "קבע כספר חובה"}
                                        >
                                            <Lock size={16} />
                                        </button>
                                    )}

                                    {/* Book icon */}
                                    <div className="text-7xl mb-5 transition-transform duration-300 group-hover:scale-110" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}>
                                        {bookStyle.emoji}
                                    </div>

                                    {/* Book title */}
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                                        {book.title}
                                    </h3>

                                    {/* Book description */}
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {book.pages.length} עמודים
                                    </p>

                                    {/* Read count or Requirement */}
                                    {isBlockingBook ? (
                                        <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
                                            <p className="text-yellow-800 font-bold text-sm mb-1">התקדמות:</p>
                                            <div className="flex justify-center gap-1 mb-1">
                                                {[...Array(REQUIRED_READS)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-3 rounded-full ${i < (readCounts[book.id]?.total || 0) ? 'bg-green-500' : 'bg-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-yellow-700">
                                                עוד {readsLeft} קריאות לפתיחת הספרייה
                                            </p>
                                        </div>
                                    ) : (
                                        readCounts && readCounts[book.id]?.total > 0 && (
                                            <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                                <span className="text-lg">🏆</span>
                                                <span>
                                                    קראתי {readCounts[book.id].total} פעמים
                                                    {readCounts[book.id].today > 0 && ` (${readCounts[book.id].today} היום)`}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            );
                        })}
                </div>
            </section>
        </div>
    );
};

export default Library;
