import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Home, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const Reader = ({ book, onBack, onFinish }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = book.pages.length;
    const page = book.pages[currentPage];

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const celebrate = () => {
        // Fire confetti from multiple angles for a bigger celebration!
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Fire from left side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });

            // Fire from right side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    const handleFinish = () => {
        celebrate();
        // Wait a moment for the celebration to start before navigating away
        setTimeout(() => {
            if (onFinish) {
                onFinish();
            } else {
                onBack();
            }
        }, 500);
    };

    const progress = ((currentPage + 1) / totalPages) * 100;

    return (
        <div className="min-h-screen flex flex-col items-center p-2 sm:p-4" style={{ background: '#6B72D8' }}>
            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-4 sm:mb-8 px-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg text-purple-700 hover:bg-white hover:shadow-xl active:scale-95 transition-all font-bold text-sm sm:text-lg"
                >
                    <Home size={20} className="sm:w-6 sm:h-6" />
                    <span className="hidden sm:inline">חֲזָרָה לַסִּפְרִיָּה</span>
                    <span className="sm:hidden">חזרה</span>
                </button>
                <div className="text-base sm:text-xl font-bold text-white truncate max-w-[50%]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    {book.title}
                </div>
            </div>

            {/* Book Content */}
            <div className="flex-1 w-full max-w-4xl bg-white rounded-3xl sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col mb-4 sm:mb-8 border-4 sm:border-8 border-white/50">
                {/* Image Section */}
                <div className={`w-full ${book.coverColor} flex items-center justify-center p-8 sm:p-12 min-h-[200px] sm:min-h-[300px]`}>
                    <div className="text-[6rem] sm:text-[8rem] md:text-[10rem] drop-shadow-lg animate-bounce-slow">
                        {page.image}
                    </div>
                </div>

                {/* Text Section */}
                <div className="w-full p-6 sm:p-8 md:p-12 flex flex-col justify-center items-center text-center bg-white">
                    <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-relaxed font-bold text-slate-800 mb-4 sm:mb-8">
                        {page.text}
                    </p>

                    <div className="text-slate-400 font-bold text-base sm:text-xl">
                        עַמּוּד {currentPage + 1} מִתּוֹךְ {totalPages}
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            {/* Navigation Controls */}
            <div className="w-full max-w-4xl flex justify-between items-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-2 pb-4 sm:pb-0">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-xl transition-all min-w-[80px] sm:min-w-[120px] justify-center ${currentPage === 0
                        ? 'bg-white/30 text-white/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                        }`}
                >
                    <ArrowRight size={24} className="sm:w-8 sm:h-8" />
                    <span className="hidden sm:inline">הַקּוֹדֵם</span>
                </button>

                {/* Progress Bar */}
                <div className="flex-1 h-3 sm:h-4 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden mx-2 sm:mx-4 shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out rounded-full shadow-lg"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {currentPage === totalPages - 1 ? (
                    <button
                        onClick={handleFinish}
                        className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all min-w-[80px] sm:min-w-[120px] justify-center"
                    >
                        <span className="hidden sm:inline">סִיַּמְתִּי!</span>
                        <span className="sm:hidden">סיימתי</span>
                        <CheckCircle size={24} className="sm:w-8 sm:h-8" />
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all min-w-[80px] sm:min-w-[120px] justify-center"
                    >
                        <span className="hidden sm:inline">הַבָּא</span>
                        <span className="sm:hidden">הבא</span>
                        <ArrowLeft size={24} className="sm:w-8 sm:h-8" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Reader;
