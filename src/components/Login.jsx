import React, { useState } from 'react';
import { LogIn, Loader } from 'lucide-react';
import { loginByName } from '../lib/authHelper';

const Login = ({ onLogin }) => {
    const [selectedName, setSelectedName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedName) return;

        setLoading(true);
        setError('');

        const { user, error: authError } = await loginByName(selectedName);

        if (authError) {
            // Show user-friendly error message
            if (authError.includes('not found in authorized list')) {
                setError('השם לא נמצא ברשימת המשתמשים המורשים');
            } else {
                setError('שגיאה בהתחברות. אנא נסו שוב.');
            }
            setLoading(false);
        } else if (user) {
            // Success
            const userData = {
                id: user.id,
                name: user.user_metadata?.child_name || selectedName.split(' ')[0],
                email: user.email,
                fullName: selectedName // Store full name for admin check
            };
            onLogin(userData);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-pink-400"></div>

                <div className="text-center mb-8">
                    <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                        <LogIn size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">מי אני?</h2>
                    <p className="text-gray-500">הקלידו את השם המלא שלכם</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">השם שלי</label>
                        <input
                            type="text"
                            value={selectedName}
                            onChange={(e) => setSelectedName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg bg-white"
                            placeholder="הקלידו את השם המלא שלכם..."
                            dir="rtl"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedName}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <Loader className="animate-spin" />
                        ) : (
                            <>
                                <span>כניסה</span>
                                <LogIn size={20} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
