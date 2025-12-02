import React from 'react';
import { Puzzle, CheckCircle, Lock } from 'lucide-react';
import puzzle1 from '../assets/puzzles/1.jpg';
import puzzle2 from '../assets/puzzles/2.jpg';
import puzzle3 from '../assets/puzzles/3.jpg';
import puzzle4 from '../assets/puzzles/4.jpg';
import puzzle5 from '../assets/puzzles/5.jpg';

const PUZZLE_IMAGES = [puzzle1, puzzle2, puzzle3, puzzle4, puzzle5];
const START_DATE = new Date('2025-11-29T00:00:00'); // Start sequence from today (Nov 29)

const DailyPuzzle = ({ dailyReads }) => {
    // Calculate pieces to show (0 to 5)
    const piecesToHide = Math.max(0, 5 - dailyReads);
    const isCompleted = piecesToHide === 0;

    // Determine which image to show based on date
    const today = new Date();
    // Reset time part to ensure consistent day calculation
    today.setHours(0, 0, 0, 0);

    // Calculate days passed since start date
    const diffTime = today.getTime() - START_DATE.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Select image index (cycling through available images)
    // If before start date (e.g. today), default to 0 (image 1)
    let imageIndex = diffDays;
    if (imageIndex < 0) imageIndex = 0;

    // Use modulo to cycle if we run out of images
    const currentImageIndex = imageIndex % PUZZLE_IMAGES.length;
    const currentImage = PUZZLE_IMAGES[currentImageIndex];

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 animate-fadeInUp">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 sm:p-4 flex items-center justify-center border-b-2 border-purple-400">
                    <div className="text-white font-bold text-base sm:text-lg text-center leading-tight">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <span>🎁</span>
                            <span>הפאזל היומי שלי!</span>
                        </div>
                        <div className="text-sm sm:text-base font-medium opacity-90">
                            מי מסתתר בתמונה? קראו עוד 5 סיפורים ותגלו!
                        </div>
                    </div>
                </div>

                {/* Success Message Banner */}
                {isCompleted && (
                    <div className="bg-purple-600/50 backdrop-blur-sm p-4 text-center animate-fadeInDown border-b border-purple-400">
                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                            כל הכבוד! גילית את התמונה! 🎉
                        </span>
                    </div>
                )}

                {/* Puzzle Area */}
                <div className="relative aspect-video w-full bg-purple-900/30 overflow-hidden p-4 sm:p-6">
                    {/* The Hidden Image */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <img
                            src={currentImage}
                            alt={`Daily Puzzle ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay Custom Layout */}
                        {!isCompleted && (
                            <div className="absolute inset-0 w-full h-full">
                                {/* 4 Corner Pieces */}
                                {[
                                    { id: 0, className: "top-0 right-0" }, // Top Right
                                    { id: 1, className: "top-0 left-0" }, // Top Left
                                    { id: 2, className: "bottom-0 right-0" }, // Bottom Right
                                    { id: 3, className: "bottom-0 left-0" }, // Bottom Left
                                ].map((piece) => {
                                    const isRevealed = dailyReads > piece.id;
                                    if (isRevealed) return null;

                                    return (
                                        <div
                                            key={piece.id}
                                            className={`absolute w-1/2 h-1/2 ${piece.className}`}
                                        >
                                            <div className="absolute inset-0 bg-purple-300/90 backdrop-blur-md flex items-center justify-center border-2 border-white">
                                                <Lock className="text-purple-500 w-8 sm:w-12 h-8 sm:h-12 opacity-60" />
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Center Piece - Glowing Gift Box */}
                                {dailyReads < 5 && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] sm:w-1/2 h-[60%] sm:h-1/2 z-20">
                                        {/* Outer glow effect */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 blur-xl sm:blur-2xl opacity-60 animate-pulse"></div>

                                        {/* Main circle with gradient border */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-0.5 sm:p-1 shadow-2xl">
                                            {/* Inner circle */}
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
                                                {/* Radial gradient background */}
                                                <div className="absolute inset-0 bg-gradient-radial from-purple-600/50 to-transparent"></div>

                                                {/* Gift icon */}
                                                <div className="relative z-10 text-4xl sm:text-6xl mb-1 sm:mb-2 drop-shadow-lg">
                                                    🎁
                                                </div>

                                                {/* Question mark */}
                                                <div className="relative z-10 text-white text-2xl sm:text-4xl font-bold mb-0.5 sm:mb-1 drop-shadow-lg">
                                                    ?
                                                </div>

                                                {/* Counter */}
                                                <div className="relative z-10 text-white text-base sm:text-2xl font-bold bg-purple-800/50 px-2 sm:px-4 py-0.5 sm:py-1 rounded-full border-2 border-yellow-400">
                                                    {dailyReads}/5
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="p-4 bg-purple-700">
                    <div className="flex justify-between mb-2 text-sm font-bold text-white">
                        <span>התקדמות יומית</span>
                        <span>{Math.min(dailyReads, 5)} / 5</span>
                    </div>
                    <div className="h-6 bg-purple-900/50 rounded-full overflow-hidden border-2 border-purple-500">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-1000 ease-out rounded-full shadow-lg"
                            style={{ width: `${Math.min((dailyReads / 5) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Add custom CSS for radial gradient */}
            <style jsx>{`
                .bg-gradient-radial {
                    background: radial-gradient(circle at center, var(--tw-gradient-stops));
                }
            `}</style>
        </div>
    );
};

export default DailyPuzzle;
