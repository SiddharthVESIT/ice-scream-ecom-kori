'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch { setUser(null); }
            } else {
                setUser(null);
            }
        };
        checkUser();
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        router.push('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass-card border-b border-kori-sage/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl">🧊</span>
                    <span className="font-display text-xl font-semibold text-kori-charcoal tracking-wide group-hover:text-kori-sage transition-colors">
                        Kori<span className="text-kori-sage">氷</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/products" className="text-sm font-medium text-kori-charcoal-light hover:text-kori-sage transition-colors">
                        Flavors
                    </Link>
                    <Link href="/products?category=subscription" className="text-sm font-medium text-kori-gold hover:text-kori-sage transition-colors">
                        Kori Club
                    </Link>
                    <Link href="/checkout" className="text-sm font-medium text-kori-charcoal-light hover:text-kori-sage transition-colors">
                        Cart
                    </Link>
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium text-kori-charcoal-light hover:text-kori-sage transition-colors">
                                My Account
                            </Link>
                            {user.role === 'admin' && (
                                <Link href="/admin" className="text-xs font-medium text-kori-charcoal-light/50 hover:text-kori-sage transition-colors border border-kori-sage/20 px-3 py-1 rounded-full">
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="text-sm font-medium bg-kori-sage text-white px-4 py-1.5 rounded-full hover:bg-kori-sage/90 transition-colors shadow-sm">
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-kori-charcoal p-2"
                    aria-label="Toggle menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-kori-sage/10 bg-kori-white/95 backdrop-blur-sm">
                    <div className="px-6 py-4 space-y-3">
                        <Link href="/products" className="block text-sm text-kori-charcoal-light hover:text-kori-sage">Flavors</Link>
                        <Link href="/products?category=subscription" className="block text-sm text-kori-gold hover:text-kori-sage">Kori Club</Link>
                        <Link href="/checkout" className="block text-sm text-kori-charcoal-light hover:text-kori-sage">Cart</Link>
                        {user ? (
                            <>
                                <Link href="/dashboard" className="block text-sm text-kori-charcoal-light hover:text-kori-sage">My Account</Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin" className="block text-xs text-kori-charcoal-light/50 hover:text-kori-sage">Admin</Link>
                                )}
                                <button onClick={handleLogout} className="block text-sm text-red-400 hover:text-red-500 text-left w-full">Logout</button>
                            </>
                        ) : (
                            <Link href="/login" className="block text-sm text-kori-sage font-medium">Sign In</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
