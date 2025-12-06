import React from 'react';
import { LogOut, User } from 'lucide-react';

const SubjectSelection = ({ onSelectSubject, onLogout, user }) => {
    const isAdmin = user?.fullName === 'יצחק ברדה' || user?.name === 'יצחק ברדה';

    return (
        <div className="p-5 sm:p-8 min-h-screen flex flex-col items-center">
            {/* Header Section */}
            <div className="w-full flex justify-center sm:justify-start mb-12 relative">
                <div className="flex items-center gap-3 sm:absolute sm:top-0 sm:left-0">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                        <User size={20} />
                        <span className="font-medium">שלום, {user.name}</span>
                        {isAdmin && <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>}
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm px-4 py-2 rounded-full text-white transition-all"
                        title="התנתק"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <h1 className="text-white text-5xl sm:text-6xl font-bold mb-16 text-center mt-10" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
                מה רוצים ללמוד היום?
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full px-4">
                {/* Language Card */}
                <div
                    onClick={() => onSelectSubject('language')}
                    className="bg-white rounded-3xl p-10 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                    style={{ borderTop: '8px solid #3B82F6' }}
                >
                    <div className="text-8xl mb-6 transition-transform duration-300 group-hover:scale-110 filter drop-shadow-lg">
                        📚
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">שפה</h2>
                    <p className="text-gray-500 text-xl">סיפורים מעניינים וכיפיים</p>
                </div>

                {/* Math Card */}
                <div
                    onClick={() => onSelectSubject('math')}
                    className="bg-white rounded-3xl p-10 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                    style={{ borderTop: '8px solid #F97316' }}
                >
                    <div className="text-8xl mb-6 transition-transform duration-300 group-hover:scale-110 filter drop-shadow-lg">
                        🔢
                    </div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">חשבון</h2>
                    <p className="text-gray-500 text-xl">תרגילים ומשחקים בחשבון</p>
                </div>
            </div>
        </div>
    );
};

export default SubjectSelection;
