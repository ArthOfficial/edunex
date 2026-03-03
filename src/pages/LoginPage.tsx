import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
    return (
        <div className="flex min-h-screen w-full relative overflow-hidden bg-background font-sans">
            {/* Background Beams */}
            <div className="beam beam-left"></div>
            <div className="beam beam-right"></div>

            {/* Side Branding Section */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative z-10">
                <div className="max-w-lg text-center space-y-8 animate-fade-up">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                            <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-extrabold text-foreground tracking-tight">EduNex</h1>
                    </div>

                    <p className="text-2xl text-muted font-light italic">
                        "Empowering Education, Simplifying Management"
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <div className="clay-card px-6 py-3 flex items-center gap-2 text-sm font-bold text-foreground">
                            <span className="text-primary"><i className="fas fa-chart-pie"></i></span> Analytics
                        </div>
                        <div className="clay-card px-6 py-3 flex items-center gap-2 text-sm font-bold text-foreground">
                            <span className="text-primary"><i className="fas fa-users"></i></span> Student Mgmt
                        </div>
                        <div className="clay-card px-6 py-3 flex items-center gap-2 text-sm font-bold text-foreground">
                            <span className="text-primary"><i className="fas fa-coins"></i></span> Fee Collection
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #0F766E 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
                </div>
            </div>

            {/* Login Form Section */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
                <div className="clay-card p-10 w-full max-w-md space-y-8 animate-fade-up delay-100">
                    <div className="text-center space-y-4">
                        <div className="inline-block bg-teal-50 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            🏫 Westwood Academy
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Welcome Back 👋</h2>
                        <p className="text-muted">Sign in to your admin portal</p>
                    </div>

                    {/* ─────────────────────────────────────────── */}
                    {/* 📝 Author: Narco / Arth                    */}
                    {/* 🔗 GitHub: https://github.com/ArthOfficial  */}
                    {/* 🌐 Website: https://arth-hub.vercel.app     */}
                    {/* © 2026 Arth — All rights reserved.          */}
                    {/* ─────────────────────────────────────────── */}

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted ml-1">Email Address</label>
                            <input
                                type="email"
                                className="clay-input w-full p-4 text-foreground placeholder-gray-400"
                                placeholder="your@school.edu"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="clay-input w-full p-4 text-foreground placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                                    <i className="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-muted font-medium hover:text-foreground transition-colors">
                                <input type="checkbox" className="accent-primary w-4 h-4 rounded" defaultChecked />
                                Remember me
                            </label>
                            <a href="#" className="text-primary font-bold hover:underline">Forgot password?</a>
                        </div>

                        <Link
                            to="/dashboard"
                            className="clay-btn w-full py-4 font-bold text-lg flex items-center justify-center gap-2 group"
                        >
                            Sign In
                            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-muted">or</span>
                        </div>
                    </div>

                    <button className="clay-btn-outline w-full py-3 font-bold flex items-center justify-center gap-3">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Sign in with Google
                    </button>

                    <div className="text-center text-xs text-muted pt-4">
                        Powered by EduNex • v2.4.1
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
