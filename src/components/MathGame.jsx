import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Star, Rocket, Trophy, HelpCircle, Volume2 } from 'lucide-react';

// --- Utility Components ---

const TenFrame = ({ n1, n2, showHint, isFriendsOfTen, isFlashMode, operation }) => {
    // Total cells is always 10
    const cells = Array(10).fill(null);

    // Fill cells based on numbers
    // Addition: n1 (Blue) + n2 (Red)
    // Subtraction: n1 (Blue, total) - n2 (Red/Faded, removed)

    return (
        <div className={`grid grid-cols-5 gap-2 bg-gray-100 p-4 rounded-xl border-2 border-gray-200 w-full max-w-[300px] mx-auto mb-6 ${isFlashMode ? 'animate-pulse' : ''}`} dir="ltr">
            {cells.map((_, i) => {
                let content = null;
                let colorClass = "";

                if (operation === 'subtraction') {
                    // Subtraction Logic: Show n1 dots total. The last n2 dots are "removed"
                    if (i < n1 - n2) {
                        // Remaining dots (Blue)
                        colorClass = "bg-blue-500 shadow-[0_4px_0_#1e40af]";
                    } else if (i < n1) {
                        // Subtracted dots (Red, faded/outlined)
                        colorClass = "bg-red-500/30 border-2 border-red-500 border-dashed shadow-none";
                    } else {
                        // Empty slot
                        colorClass = "bg-gray-200/50 border border-gray-300";
                    }
                } else {
                    // Addition Logic
                    if (i < n1) {
                        // First number dots
                        colorClass = "bg-blue-500 shadow-[0_4px_0_#1e40af]";
                    } else if (i < n1 + n2) {
                        // Second number dots
                        if (isFriendsOfTen && !showHint) {
                            // In "Friends of 10", we might hide the second part initially or show empty slots
                            colorClass = "border-2 border-dashed border-gray-400 bg-transparent";
                        } else {
                            colorClass = "bg-red-500 shadow-[0_4px_0_#991b1b]";
                        }
                    } else {
                        // Empty slot
                        colorClass = "bg-gray-200/50 border border-gray-300";
                    }
                }

                return (
                    <div key={i} className="aspect-square rounded-full flex items-center justify-center relative">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-500 ${colorClass}`}></div>
                    </div>
                );
            })}
        </div>
    );
};

const FuelGauge = ({ value, max }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className="w-full max-w-md mx-auto mb-6 relative" dir="ltr">
            <div className="flex justify-between text-white text-sm font-bold mb-1 px-2">
                <span>{value}/{max}</span>
                <span></span>
            </div>
            <div className="h-6 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out relative"
                    style={{ width: `${percentage}%` }}
                >
                </div>
            </div>
        </div>
    );
};

// --- Main Game Component ---

const MathGame = ({ onBack }) => {
    const [gameState, setGameState] = useState('menu'); // menu, playing, summary
    const [gameMode, setGameMode] = useState('zen'); // zen, friends, speed, flash
    const [operation, setOperation] = useState('addition'); // addition, subtraction
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', null
    const [timeLeft, setTimeLeft] = useState(60);
    const [questionCount, setQuestionCount] = useState(0);
    const [showTenFrame, setShowTenFrame] = useState(true); // For flash mode

    // Sound effects placeholders (using simple Audio if available, or just visual feedback)
    const playSound = (type) => {
        // In a real app, we'd play actual sounds here
        // const audio = new Audio(`/sounds/${type}.mp3`);
        // audio.play();
    };

    const generateQuestion = (mode) => {
        let n1, n2, answer, type;

        if (mode === 'friends') {
            // Friends of 10: n1 + ? = 10 (Only for addition currently)
            n1 = Math.floor(Math.random() * 11); // 0 to 10
            n2 = 10 - n1;
            answer = n2;
            type = 'missing_addend'; // 3 + ? = 10
        } else {
            if (operation === 'subtraction') {
                // Subtraction: n1 - n2 = ?
                // n1 should be between 0 and 10
                n1 = Math.floor(Math.random() * 11); // 0 to 10
                // n2 should be less than or equal to n1
                n2 = Math.floor(Math.random() * (n1 + 1));
                answer = n1 - n2;
                type = 'diff';
            } else {
                // Addition: n1 + n2 = ?
                // Sum <= 10
                const sum = Math.floor(Math.random() * 11); // 0 to 10
                n1 = Math.floor(Math.random() * (sum + 1));
                n2 = sum - n1;
                answer = sum;
                type = 'sum';
            }
        }

        // Generate options
        const opts = new Set([answer]);
        while (opts.size < 3) {
            let fake;
            if (mode === 'friends') {
                fake = Math.floor(Math.random() * 11);
            } else {
                fake = Math.floor(Math.random() * 11);
            }
            if (fake !== answer) opts.add(fake);
        }

        return {
            n1,
            n2,
            answer,
            type,
            options: Array.from(opts).sort(() => Math.random() - 0.5)
        };
    };

    const startGame = (mode) => {
        setGameMode(mode);
        setGameState('playing');
        setScore(0);
        setStreak(0);
        setQuestionCount(0);
        setTimeLeft(60);
        nextQuestion(mode);
    };

    const nextQuestion = (mode) => {
        setQuestion(generateQuestion(mode));
        setFeedback(null);
        setShowHint(false);

        // Flash mode: show ten frame for 2 seconds then hide
        if (mode === 'flash') {
            setShowTenFrame(true);
            setTimeout(() => {
                setShowTenFrame(false);
            }, 2000);
        } else {
            setShowTenFrame(true);
        }
    };

    const handleAnswer = (selectedOption) => {
        if (feedback) return; // Prevent double clicking

        if (selectedOption === question.answer) {
            // Correct
            setFeedback('correct');
            playSound('correct');
            setScore(s => s + 1);
            setStreak(s => s + 1);
            setQuestionCount(c => c + 1);

            setTimeout(() => {
                if ((gameMode === 'zen' || gameMode === 'flash') && questionCount >= 9) {
                    setGameState('summary');
                } else {
                    nextQuestion(gameMode);
                }
            }, 1500);
        } else {
            // Incorrect
            setFeedback('incorrect');
            playSound('incorrect');
            setStreak(0);

            // In flash mode, show the ten frame again when incorrect
            if (gameMode === 'flash') {
                setShowTenFrame(true);
            }

            // Don't advance, just show feedback
            setTimeout(() => {
                setFeedback(null);
                // In flash mode, hide the ten frame again after showing the answer
                if (gameMode === 'flash') {
                    setTimeout(() => {
                        setShowTenFrame(false);
                    }, 2000);
                }
            }, 1500);
        }
    };

    // Timer for Speed Mode
    useEffect(() => {
        if (gameMode === 'speed' && gameState === 'playing') {
            const timer = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        clearInterval(timer);
                        setGameState('summary');
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameMode, gameState]);

    // --- Renders ---

    if (gameState === 'menu') {
        return (
            <div className="min-h-screen p-6 flex flex-col items-center justify-center text-white">
                <button onClick={onBack} className="absolute top-6 left-6 bg-white/20 p-2 rounded-full hover:bg-white/30 transition z-50">
                    <ArrowLeft size={24} />
                </button>

                <h1 className="text-5xl font-bold mb-8 text-center drop-shadow-lg">משחקי חשבון 🔢</h1>

                {/* Operation Toggle */}
                <div className="bg-white/10 p-1 rounded-full flex mb-8 w-full max-w-xs mx-auto">
                    <button
                        onClick={() => setOperation('addition')}
                        className={`flex-1 py-2 rounded-full font-bold transition-all ${operation === 'addition' ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/10'}`}
                    >
                        חיבור (+)
                    </button>
                    <button
                        onClick={() => setOperation('subtraction')}
                        className={`flex-1 py-2 rounded-full font-bold transition-all ${operation === 'subtraction' ? 'bg-white text-red-600 shadow-lg' : 'text-white hover:bg-white/10'}`}
                    >
                        חיסור (-)
                    </button>
                </div>

                <div className="grid gap-6 w-full max-w-md">
                    <button
                        onClick={() => startGame('zen')}
                        className="bg-white text-blue-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4"
                    >
                        <div className="bg-blue-100 p-3 rounded-full text-3xl">🧘</div>
                        <div className="text-right">
                            <h3 className="text-2xl font-bold">לימוד רגוע</h3>
                            <p className="text-gray-500">בלי לחץ זמן, עם עזרים</p>
                        </div>
                    </button>

                    <button
                        onClick={() => startGame('flash')}
                        className="bg-white text-yellow-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4"
                    >
                        <div className="bg-yellow-100 p-3 rounded-full text-3xl">🧠</div>
                        <div className="text-right">
                            <h3 className="text-2xl font-bold">הבזק</h3>
                            <p className="text-gray-500">זיכרון לטווח קצר</p>
                        </div>
                    </button>

                    {operation === 'addition' && (
                        <button
                            onClick={() => startGame('friends')}
                            className="bg-white text-purple-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4"
                        >
                            <div className="bg-purple-100 p-3 rounded-full text-3xl">🤝</div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold">חברים של 10</h3>
                                <p className="text-gray-500">להשלים ל-10</p>
                            </div>
                        </button>
                    )}

                    <button
                        onClick={() => startGame('speed')}
                        className="bg-white text-orange-600 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4"
                    >
                        <div className="bg-orange-100 p-3 rounded-full text-3xl">🚀</div>
                        <div className="text-right">
                            <h3 className="text-2xl font-bold">אתגר המהירות</h3>
                            <p className="text-gray-500">כמה תספיקו בדקה?</p>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'summary') {
        return (
            <div className="min-h-screen p-6 flex flex-col items-center justify-center text-white text-center">
                <div className="text-8xl mb-6 animate-bounce">🏆</div>
                <h2 className="text-5xl font-bold mb-4">כל הכבוד!</h2>
                <p className="text-2xl mb-8">צברת {score} נקודות!</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setGameState('menu')}
                        className="bg-white/20 hover:bg-white/30 px-8 py-3 rounded-full text-xl font-bold backdrop-blur-sm transition"
                    >
                        תפריט ראשי
                    </button>
                    <button
                        onClick={() => startGame(gameMode)}
                        className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full text-xl font-bold shadow-lg transition"
                    >
                        שחק שוב
                    </button>
                </div>
            </div>
        );
    }

    // Playing State
    return (
        <div className="min-h-screen p-4 flex flex-col items-center relative">
            {/* Top Bar */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-6 text-white">
                <div className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <span className="font-bold text-xl">{score}</span>
                </div>
                {gameMode === 'speed' ? (
                    <div className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-300 animate-pulse' : ''}`}>
                        {timeLeft}s
                    </div>
                ) : (
                    <div></div>
                )}
                <button onClick={() => setGameState('menu')} className="bg-white/20 p-2 rounded-full hover:bg-white/30">
                    <ArrowLeft />
                </button>
            </div>

            {/* Fuel Gauge */}
            <FuelGauge value={(gameMode === 'zen' || gameMode === 'flash') ? questionCount : score} max={(gameMode === 'zen' || gameMode === 'flash') ? 10 : 20} />

            {/* Game Card */}
            <div className={`bg-white rounded-[2rem] p-6 sm:p-10 w-full max-w-md shadow-2xl transition-all duration-300 ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>

                {/* Visual Aid (Ten Frame) */}
                {((gameMode === 'zen' || gameMode === 'friends' || (gameMode === 'flash' && showTenFrame)) || (gameMode === 'speed' && feedback === 'incorrect')) && (
                    <TenFrame
                        n1={question.n1}
                        n2={question.n2}
                        showHint={showHint || gameMode === 'zen'}
                        isFriendsOfTen={gameMode === 'friends'}
                        isFlashMode={gameMode === 'flash' && showTenFrame}
                        operation={operation}
                    />
                )}



                {/* Question */}
                <div className="text-center mb-10" dir="ltr">
                    <div className="text-5xl sm:text-7xl font-bold text-gray-800 flex items-center justify-center gap-2 sm:gap-4">
                        {question.type === 'sum' ? (
                            <>
                                <span className="text-blue-600">{question.n1}</span>
                                <span className="text-gray-400">+</span>
                                <span className="text-red-500">{question.n2}</span>
                                <span className="text-gray-400">=</span>
                                <span className="text-gray-800">?</span>
                            </>
                        ) : question.type === 'diff' ? (
                            <>
                                <span className="text-blue-600">{question.n1}</span>
                                <span className="text-gray-400">-</span>
                                <span className="text-red-500">{question.n2}</span>
                                <span className="text-gray-400">=</span>
                                <span className="text-gray-800">?</span>
                            </>
                        ) : (
                            <>
                                <span className="text-blue-600">{question.n1}</span>
                                <span className="text-gray-400">+</span>
                                <span className="bg-gray-200 w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-400 text-3xl sm:text-5xl">?</span>
                                <span className="text-gray-400">=</span>
                                <span className="text-gray-800">10</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(opt)}
                            disabled={feedback === 'correct'}
                            className={`
                                aspect-square rounded-full text-2xl sm:text-4xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95
                                ${feedback === 'correct' && opt === question.answer
                                    ? 'bg-green-500 text-white ring-4 ring-green-300'
                                    : 'bg-slate-800 text-white hover:bg-slate-700'
                                }
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MathGame;
