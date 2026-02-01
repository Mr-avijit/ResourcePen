import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Eye, EyeOff,
  Camera, Check, X, Save, Edit3,
  Key, Smartphone, Globe, Shield,
  RefreshCcw, CheckCircle2, Copy, Fingerprint,
  Laptop, MapPin, Terminal, AlertTriangle, LogOut
} from 'lucide-react';
import { useAuth, useNavigation } from '../store';

const UserProfile: React.FC = () => {
  const { user, login } = useAuth(); // using login to simulate data refresh if needed
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Mock Active Sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'MacBook Pro M3', os: 'macOS 15.0', location: 'San Francisco, USA', ip: '192.168.1.1', lastActive: 'Current Session', status: 'active' },
    { id: 2, device: 'iPhone 15 Pro', os: 'iOS 18.1', location: 'San Francisco, USA', ip: '10.0.0.4', lastActive: '2 hours ago', status: 'idle' }
  ]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // Here you would call an actual update function from useAuth or API
    }, 1500);
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const terminateSession = (id: number) => {
    // In a real app, this would be a modal or confirm dialog
    // For now, we simulate immediate termination
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const securityScore = is2FAEnabled ? 95 : 60;

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`flex h-2 w-2 rounded-full ${isEditing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              {isEditing ? 'SYSTEM UNLOCKED // WRITE ACCESS' : 'SYSTEM SECURED // READ ONLY'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight dark:text-white uppercase">
            Identity Mainframe
          </h1>
        </div>

        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="group px-6 py-3 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 dark:border-zinc-800 hover:border-sky-500 hover:text-sky-500 transition-all flex items-center gap-3"
            >
              <Terminal size={14} className="group-hover:text-sky-500 transition-colors" /> Override Protocol
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-zinc-900 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all"
              >
                Abort
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-sky-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-sky-500 transition-all flex items-center gap-3 shadow-lg shadow-sky-500/20"
              >
                {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                Commit Patch
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- Left Column: Avatar & Clearance --- */}
        <div className="lg:col-span-4 space-y-6">

          {/* Operative Card */}
          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-zinc-800/50 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-zinc-950 relative group/avatar">
                    <img src={user?.avatar} className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-500" alt="Operative" />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                        <Camera size={24} className="mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Upload Raw</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 p-2.5 rounded-xl bg-emerald-500 text-white shadow-lg ring-4 ring-white dark:ring-zinc-900">
                  <Shield size={16} fill="currentColor" />
                </div>
              </div>

              <h2 className="text-2xl font-display font-black dark:text-white uppercase tracking-tight mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-black uppercase tracking-widest border border-sky-500/20">
                  {user?.role === 'admin' ? 'Level 5 Admin' : 'Level 1 User'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{user?.plan} Class</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clearance</div>
                  <div className="text-xl font-black text-emerald-500">ALPHA</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Score</div>
                  <div className="text-xl font-black text-sky-500">{securityScore}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* UUID Card */}
          <div className="p-6 rounded-3xl bg-slate-900 dark:bg-black text-white shadow-xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md">
                <Fingerprint size={20} className="text-sky-400" />
              </div>
              <button onClick={handleCopyId} className="hover:text-sky-400 transition-colors">
                {copiedId ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="font-mono text-xs text-slate-400 mb-1 uppercase tracking-widest">Neural ID</div>
            <div className="font-mono text-sm break-all text-sky-400 font-bold tracking-tight">
              {user?.id || 'UID-NULL-GENESIS-01'}
            </div>
          </div>

        </div>

        {/* --- Right Column: Forms & Security --- */}
        <div className="lg:col-span-8 space-y-8">

          {/* Data Inputs */}
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 relative">
            <h3 className="text-xl font-display font-black dark:text-white flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-sky-500 rounded-full" />
              Waitlist Parameters
              <span className="text-[10px] font-mono text-slate-400 uppercase ml-auto">Encrypted protocol v2.4</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Given Name</label>
                <div className={`flex items-center px-4 py-4 rounded-2xl border transition-all ${isEditing ? 'bg-white dark:bg-zinc-950 border-sky-500/50 ring-2 ring-sky-500/10' : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-500'}`}>
                  <User size={16} className="text-slate-400 mr-3" />
                  <input
                    type="text"
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    className="bg-transparent w-full text-sm font-bold outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Family Name</label>
                <div className={`flex items-center px-4 py-4 rounded-2xl border transition-all ${isEditing ? 'bg-white dark:bg-zinc-950 border-sky-500/50 ring-2 ring-sky-500/10' : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-500'}`}>
                  <User size={16} className="text-slate-400 mr-3" />
                  <input
                    type="text"
                    value={lastName} onChange={e => setLastName(e.target.value)}
                    disabled={!isEditing}
                    className="bg-transparent w-full text-sm font-bold outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Communcation Node</label>
                <div className={`flex items-center px-4 py-4 rounded-2xl border transition-all ${isEditing ? 'bg-white dark:bg-zinc-950 border-sky-500/50 ring-2 ring-sky-500/10' : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-500'}`}>
                  <Mail size={16} className="text-slate-400 mr-3" />
                  <input
                    type="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="bg-transparent w-full text-sm font-bold outline-none dark:text-white font-mono"
                  />
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded ml-2">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Layer */}
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <h3 className="text-xl font-display font-black dark:text-white flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-red-500 rounded-full" />
              Security Layer
            </h3>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white shadow-sm">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-black dark:text-white mb-1">Two-Factor Authentication</div>
                    <p className="text-xs text-slate-500 max-w-sm">Secure your account with an additional security layer via Authenticator App.</p>
                  </div>
                </div>
                <button
                  onClick={() => isEditing && setIs2FAEnabled(!is2FAEnabled)}
                  disabled={!isEditing}
                  className={`relative w-14 h-8 rounded-full transition-colors ${is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-800'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${is2FAEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Access Key</label>
                <div className={`flex items-center px-4 py-4 rounded-2xl border transition-all ${isEditing ? 'bg-white dark:bg-zinc-950 border-red-500/50 ring-2 ring-red-500/10' : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-slate-500'}`}>
                  <Key size={16} className="text-slate-400 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isEditing ? "Enter new passphrase" : "••••••••••••••••"}
                    disabled={!isEditing}
                    className="bg-transparent w-full text-sm font-bold outline-none dark:text-white font-mono"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <h3 className="text-xl font-display font-black dark:text-white flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-amber-500 rounded-full" />
              Active Sessions
            </h3>

            <div className="space-y-4">
              <AnimatePresence>
                {sessions.map(session => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-400 shadow-sm">
                        <Laptop size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold dark:text-white flex items-center gap-2">
                          {session.device}
                          {session.status === 'active' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{session.os} • {session.location} • {session.ip}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{session.lastActive}</div>
                      {session.status !== 'active' && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                          title="Terminate Session"
                        >
                          <LogOut size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {sessions.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">No active sessions found.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] px-8 py-4 bg-emerald-600 text-white rounded-[2rem] shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 size={24} />
            Identity Matrix Patched Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
