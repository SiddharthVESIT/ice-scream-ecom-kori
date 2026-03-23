'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
        const body = isLogin ? { email, password } : { fullName, email, password };

        try {
            const res = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Save user and token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // trigger storage event so Navbar re-renders
            window.dispatchEvent(new Event('storage'));

            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
                // Optionally scroll to flavor quiz
                setTimeout(() => {
                    const quizSection = document.getElementById('flavor-quiz');
                    if (quizSection) quizSection.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wabi-sabi-bg min-h-[80vh] flex items-center justify-center px-6">
            <div className="glass-card max-w-md w-full p-8 rounded-3xl animate-fade-in">
                <div className="text-center mb-8">
                    <span className="text-4xl block mb-4">🧊</span>
                    <h1 className="font-display text-2xl font-bold text-kori-charcoal">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-kori-charcoal-light/60 text-sm mt-2">
                        {isLogin ? 'Sign in to access your Kori Club and flavors' : 'Join Kori氷 to curate your flavor profile'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-semibold text-kori-charcoal-light mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-kori-sage/20 focus:outline-none focus:border-kori-sage/60 transition-colors"
                                placeholder="Kenji Sato"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold text-kori-charcoal-light mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-kori-sage/20 focus:outline-none focus:border-kori-sage/60 transition-colors"
                            placeholder="kenji@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-kori-charcoal-light mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-kori-sage/20 focus:outline-none focus:border-kori-sage/60 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-kori-charcoal text-white rounded-xl font-medium hover:bg-kori-charcoal/90 transition-all duration-300 shadow-sm mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-kori-charcoal-light/50">
                        {isLogin ? 'New to Kori氷? ' : 'Already have an account? '}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-kori-sage font-medium hover:underline underline-offset-4"
                    >
                        {isLogin ? 'Create an account' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
