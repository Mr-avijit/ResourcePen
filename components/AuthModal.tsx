
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Crown, Check, Eye, EyeOff, Github } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  onLogin: (mode: 'login' | 'signup', credentials?: { email: string, password?: string }) => Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, setMode, onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => emailInputRef.current?.focus(), 400);
      setError(null);
    }
  }, [isOpen]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      await onLogin(mode, { email, password });
      onClose();
    } catch (err: any) {
      setError('Identity verification failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await onLogin(mode);
      onClose();
    } catch (err) {
      setError(`Failed to authenticate with ${provider}.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8 overflow-y-auto overflow-x-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#0c0c0c] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[400px] my-4"
        >
          {/* Close Button Mobile (top right of container) */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 rounded-full bg-black/10 text-black/60 dark:text-white/60 z-50 hover:bg-black/20"
          >
            <X size={20} />
          </button>

          {/* LEFT SIDE - VISUAL / BRANDING */}
          <div className="relative w-full md:w-5/12 overflow-hidden bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 p-6 md:p-8 flex flex-col justify-center text-white">
            {/* Background Abstract Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-tr from-white/10 to-transparent rounded-[40%] animate-[spin_20s_linear_infinite]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-bl from-blue-400/20 to-purple-500/20 rounded-full blur-3xl" />
              {/* Floating Spheres */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] right-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 shadow-xl opacity-80"
              />
              <motion.div
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-tr from-violet-400 to-fuchsia-600 shadow-xl opacity-80"
              />
              {/* Wavy bottom shape (SVG simulation via Clip Path or Mask) */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-white/10 blur-xl rounded-t-[100%]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center md:text-left">
              <div className="absolute -top-32 -left-4 md:-left-4 md:-top-40">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-violet-900 shadow-lg mb-8">
                  <Crown size={20} fill="currentColor" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
                Welcome<br />Page
              </h1>
              <p className="text-blue-100 text-lg md:text-xl font-light tracking-wide mb-8">
                {mode === 'login' ? 'Sign In To Your Account' : 'Start Your Journey'}
              </p>

              <div className="hidden md:block mt-auto pt-10">
                <p className="text-white/60 text-xs font-medium tracking-widest uppercase">www.yoursite.com</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="w-full md:w-7/12 p-6 md:p-10 relative flex flex-col justify-center bg-white dark:bg-[#0c0c0c]">
            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="hidden md:block absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="max-w-lg mx-auto w-full">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Hello ! <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">
                    Good Morning
                  </span>
                </h2>
                <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 font-medium">
                  <span className="text-fuchsia-600 font-bold">{mode === 'login' ? 'Login' : 'Create'}</span>
                  <span>{mode === 'login' ? 'Your Account' : 'New Account'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all active:scale-95 group"
                >
                  <GoogleIcon />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all active:scale-95 group"
                >
                  <Github size={20} className="text-slate-800 dark:text-white" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">GitHub</span>
                </button>
              </div>

              <div className="relative flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or with email</span>
                <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1" />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleAuthAction} className="space-y-4">
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group relative">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full py-2 bg-transparent border-b-2 border-slate-200 dark:border-zinc-800 focus:border-violet-500 dark:focus:border-violet-500 outline-none text-slate-800 dark:text-white font-semibold transition-colors placeholder-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div className="group relative">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full py-2 bg-transparent border-b-2 border-slate-200 dark:border-zinc-800 focus:border-violet-500 dark:focus:border-violet-500 outline-none text-slate-800 dark:text-white font-semibold transition-colors placeholder-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="group relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 bg-transparent border-b-2 border-slate-200 dark:border-zinc-800 focus:border-violet-500 dark:focus:border-violet-500 outline-none text-slate-800 dark:text-white font-semibold transition-colors placeholder-transparent"
                    placeholder="john@example.com"
                  />
                  {/* Floating Gradient Line (Optional, basic border-b covers it, but we can add a fancy glow) */}
                </div>

                {/* Password Input */}
                <div className="group relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2 bg-transparent border-b-2 border-slate-200 dark:border-zinc-800 focus:border-violet-500 dark:focus:border-violet-500 outline-none text-slate-800 dark:text-white font-semibold transition-colors placeholder-transparent pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="group relative">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full py-2 bg-transparent border-b-2 border-slate-200 dark:border-zinc-800 focus:border-violet-500 dark:focus:border-violet-500 outline-none text-slate-800 dark:text-white font-semibold transition-colors placeholder-transparent pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Extras */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${remember ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-zinc-700'}`}>
                      {remember && <Check size={12} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={remember} onChange={() => setRemember(!remember)} />
                    <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors">Remember</span>
                  </label>

                  <button type="button" className="text-sm font-bold text-slate-400 hover:text-violet-600 transition-colors">
                    Forgot Password ?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-black uppercase tracking-widest rounded-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (mode === 'login' ? 'Submit' : 'Create Account')}
                </button>

                {/* Toggle Mode */}
                <div className="text-center pt-3">
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-xs font-bold text-slate-500 hover:text-violet-600 transition-colors uppercase tracking-widest"
                  >
                    {mode === 'login' ? 'Create Account' : 'Already have an account?'}
                  </button>
                </div>

                {/* Demo Hint (Subtle) */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-zinc-900 rounded border border-slate-100 dark:border-zinc-800 text-[10px] text-slate-400 text-center">
                  Demo: admin@resourcespen.com / admin123
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
