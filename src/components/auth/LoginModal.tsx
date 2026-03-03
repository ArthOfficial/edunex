import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Mail,
    Lock,
    ArrowRight,
    ArrowLeft,
    GraduationCap,
    Github,
    Chrome,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
    KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalView = 'login' | 'forgot-email' | 'forgot-code' | 'forgot-newpass';

// SECURITY: Code should be generated server-side and sent via email.
// This is a temporary measure — replace with proper OTP flow.
const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE || '';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login, isTransitioning, role } = useAuth();
    const navigate = useNavigate();

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<{ type: 'error' | 'success' | 'info' | null, message: string }>({ type: null, message: '' });

    // Forgot password state
    const [view, setView] = useState<ModalView>('login');
    const [resetEmail, setResetEmail] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    const resetForgotState = () => {
        setView('login');
        setResetEmail('');
        setSecurityCode('');
        setNewPassword('');
        setConfirmPassword('');
        setStatus({ type: null, message: '' });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', message: 'Verifying credentials...' });

        try {
            await login(email, password);

            setStatus({ type: 'success', message: `Welcome ${email.split('@')[0]}! Initiating workspace...` });

            setTimeout(() => {
                onClose();
                const targetRoute = role === 'superadmin' ? '/super-admin' : '/dashboard';
                navigate(targetRoute);
                setStatus({ type: null, message: '' });
            }, 300);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setStatus({ type: 'error', message });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'success', message: 'Email accepted! Enter your security code.' });
        setTimeout(() => {
            setView('forgot-code');
            setStatus({ type: null, message: '' });
            setLoading(false);
        }, 800);
    };

    const handleSecurityCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (securityCode.trim() === SECURITY_CODE) {
            setStatus({ type: 'success', message: 'Code verified! Set your new password.' });
            setTimeout(() => {
                setView('forgot-newpass');
                setStatus({ type: null, message: '' });
            }, 800);
        } else {
            setStatus({ type: 'error', message: 'Invalid security code. Please try again.' });
        }
    };

    const handleNewPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        setStatus({ type: 'info', message: 'Updating password...' });

        try {
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: resetEmail.trim().toLowerCase(),
                    securityCode: SECURITY_CODE,
                    newPassword,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setStatus({ type: 'error', message: result.error || 'Failed to update password.' });
                setLoading(false);
                return;
            }

            setStatus({ type: 'success', message: 'Password updated! You can now log in.' });
            setTimeout(() => {
                resetForgotState();
            }, 1500);
        } catch {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const getHeaderTitle = () => {
        switch (view) {
            case 'forgot-email': return 'Reset Password';
            case 'forgot-code': return 'Security Check';
            case 'forgot-newpass': return 'New Password';
            default: return 'Welcome Back';
        }
    };

    const getHeaderSubtitle = () => {
        switch (view) {
            case 'forgot-email': return 'Enter your email';
            case 'forgot-code': return 'Verify identity';
            case 'forgot-newpass': return 'Almost done';
            default: return 'EduNex School OS';
        }
    };

    const getHeaderIcon = () => {
        switch (view) {
            case 'forgot-email': return <Mail className="text-lime-400 w-7 h-7" />;
            case 'forgot-code': return <ShieldCheck className="text-lime-400 w-7 h-7" />;
            case 'forgot-newpass': return <KeyRound className="text-lime-400 w-7 h-7" />;
            default: return <GraduationCap className="text-lime-400 w-7 h-7" />;
        }
    };

    return (
        <AnimatePresence>
            {(isOpen && !isTransitioning) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-[#FAF9F6] rounded-[40px] shadow-2xl shadow-emerald-900/20 border-[8px] border-white overflow-hidden flex flex-col"
                    >
                        {/* Status Bar */}
                        <AnimatePresence>
                            {status.type && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className={`px-8 py-3 flex items-center gap-3 text-sm font-bold border-b border-white/20
                                        ${status.type === 'error' ? 'bg-rose-500 text-white' :
                                            status.type === 'success' ? 'bg-emerald-500 text-white' :
                                                'bg-lime-400 text-emerald-900'}`}
                                >
                                    {status.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {status.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                {view !== 'login' && (
                                    <button
                                        onClick={resetForgotState}
                                        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-900/40 hover:text-emerald-900 transition-colors border border-gray-100 mr-1"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <div className="w-12 h-12 rounded-2xl bg-emerald-900 flex items-center justify-center shadow-lg shadow-emerald-900/20">
                                    {getHeaderIcon()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-emerald-900 tracking-tight">{getHeaderTitle()}</h2>
                                    <p className="text-sm font-bold text-emerald-900/40 uppercase tracking-widest">{getHeaderSubtitle()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { onClose(); resetForgotState(); }}
                                className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-emerald-900/40 hover:text-emerald-900 transition-colors border border-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-0">
                            <AnimatePresence mode="wait">
                                {/* ═══ LOGIN VIEW ═══ */}
                                {view === 'login' && (
                                    <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                                        <form onSubmit={handleLogin} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider ml-4">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5" />
                                                        <input
                                                            type="email"
                                                            required
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="w-full bg-white border border-gray-100 rounded-3xl px-14 py-4 text-emerald-900 font-bold placeholder:text-emerald-900/10 focus:ring-4 focus:ring-emerald-900/5 transition-all outline-none shadow-sm"
                                                            placeholder="Enter your email"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider ml-4">Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5" />
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            required
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="w-full bg-white border border-gray-100 rounded-3xl px-14 py-4 text-emerald-900 font-bold placeholder:text-emerald-900/10 focus:ring-4 focus:ring-emerald-900/5 transition-all outline-none shadow-sm"
                                                            placeholder="••••••••"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-900/20 hover:text-emerald-900 transition-colors"
                                                        >
                                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between px-2">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-emerald-900/10 text-emerald-900 focus:ring-0 transition-all" />
                                                    <span className="text-sm font-bold text-emerald-900/60 group-hover:text-emerald-900">Remember me</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => { setView('forgot-email'); setStatus({ type: null, message: '' }); }}
                                                    className="text-sm font-bold text-emerald-900 hover:text-emerald-700 underline decoration-lime-400 decoration-2 underline-offset-4"
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-emerald-900 text-white rounded-3xl py-5 font-bold text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                                            >
                                                {loading ? (
                                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Enter Workspace
                                                        <ArrowRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        <div className="mt-10 mb-2 flex items-center gap-4">
                                            <div className="flex-1 h-px bg-emerald-900/5"></div>
                                            <span className="text-[10px] font-black text-emerald-900/20 uppercase tracking-[0.2em]">Or social log-in</span>
                                            <div className="flex-1 h-px bg-emerald-900/5"></div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="flex items-center justify-center gap-3 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-emerald-900 hover:bg-gray-50 transition-colors shadow-sm">
                                                <Chrome className="w-5 h-5" />
                                                Google
                                            </button>
                                            <button className="flex items-center justify-center gap-3 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-emerald-900 hover:bg-gray-50 transition-colors shadow-sm">
                                                <Github className="w-5 h-5" />
                                                GitHub
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ═══ FORGOT PASSWORD — STEP 1: EMAIL ═══ */}
                                {view === 'forgot-email' && (
                                    <motion.div key="forgot-email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <form onSubmit={handleForgotEmail} className="space-y-6">
                                            <p className="text-sm text-emerald-900/60 font-medium px-1">
                                                Enter the email address associated with your account. We'll verify it and ask for your security code.
                                            </p>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider ml-4">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5" />
                                                    <input
                                                        type="email"
                                                        required
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        className="w-full bg-white border border-gray-100 rounded-3xl px-14 py-4 text-emerald-900 font-bold placeholder:text-emerald-900/10 focus:ring-4 focus:ring-emerald-900/5 transition-all outline-none shadow-sm"
                                                        placeholder="your@email.com"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-emerald-900 text-white rounded-3xl py-5 font-bold text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                                            >
                                                {loading ? (
                                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Verify Email
                                                        <ArrowRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {/* ═══ FORGOT PASSWORD — STEP 2: SECURITY CODE ═══ */}
                                {view === 'forgot-code' && (
                                    <motion.div key="forgot-code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <form onSubmit={handleSecurityCode} className="space-y-6">
                                            <p className="text-sm text-emerald-900/60 font-medium px-1">
                                                Enter the 4-digit security code to verify your identity for <span className="font-bold text-emerald-900">{resetEmail}</span>.
                                            </p>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider ml-4">Security Code</label>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5" />
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength={4}
                                                        value={securityCode}
                                                        onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, ''))}
                                                        className="w-full bg-white border border-gray-100 rounded-3xl px-14 py-4 text-emerald-900 font-bold text-center text-2xl tracking-[0.5em] placeholder:text-emerald-900/10 placeholder:text-base placeholder:tracking-normal focus:ring-4 focus:ring-emerald-900/5 transition-all outline-none shadow-sm"
                                                        placeholder="Enter 4-digit code"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={securityCode.length !== 4}
                                                className="w-full bg-emerald-900 text-white rounded-3xl py-5 font-bold text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                                            >
                                                Verify Code
                                                <ShieldCheck className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {/* ═══ FORGOT PASSWORD — STEP 3: NEW PASSWORD ═══ */}
                                {view === 'forgot-newpass' && (
                                    <motion.div key="forgot-newpass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                        <form onSubmit={handleNewPassword} className="space-y-6">
                                            <p className="text-sm text-emerald-900/60 font-medium px-1">
                                                Create a new password for <span className="font-bold text-emerald-900">{resetEmail}</span>.
                                            </p>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider ml-4">New Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5" />
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            required
                                                            minLength={6}
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className="w-full bg-white border border-gray-100 rounded-3xl px-14 py-4 text-emerald-900 font-bold placeholder:text-emerald-900/10 focus:ring-4 focus:ring-emerald-900/5 transition-all outline-none shadow-sm"
                                                            placeholder="Min 6 characters"
                                                            autoFocus
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-900/20 hover:text-emerald-900 transition-colors"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider ml-4">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5" />
                                                        <input
                                                            type="password"
                                                            required
                                                            minLength={6}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="w-full bg-white border border-gray-100 rounded-3xl px-14 py-4 text-emerald-900 font-bold placeholder:text-emerald-900/10 focus:ring-4 focus:ring-emerald-900/5 transition-all outline-none shadow-sm"
                                                            placeholder="Re-enter password"
                                                        />
                                                    </div>
                                                    {confirmPassword && newPassword !== confirmPassword && (
                                                        <p className="text-xs text-rose-500 font-bold ml-4">Passwords do not match</p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                                                className="w-full bg-emerald-900 text-white rounded-3xl py-5 font-bold text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                                            >
                                                {loading ? (
                                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Update Password
                                                        <KeyRound className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Step indicator for forgot flow */}
                        {view !== 'login' && (
                            <div className="px-8 pb-6 flex items-center justify-center gap-2">
                                {['forgot-email', 'forgot-code', 'forgot-newpass'].map((step, i) => (
                                    <div
                                        key={step}
                                        className={`h-2 rounded-full transition-all duration-300 ${step === view ? 'w-8 bg-emerald-900' :
                                            ['forgot-email', 'forgot-code', 'forgot-newpass'].indexOf(view) > i ? 'w-2 bg-emerald-500' :
                                                'w-2 bg-emerald-900/10'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Footer Decoration */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-lime-400 via-emerald-800 to-lime-500"></div>
                    </motion.div>
                </motion.div>
            )}

            {isTransitioning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[200] bg-[#FAF9F6] flex items-center justify-center"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-4 border-emerald-900/10 border-t-emerald-900 rounded-full animate-spin" />
                        <h2 className="text-emerald-900 font-black text-xl tracking-tight">Syncing Workspace...</h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
