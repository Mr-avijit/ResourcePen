import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell, Globe, Shield, Moon, Sun, Smartphone,
    Mail, Key, Database, RefreshCcw, ToggleLeft, ToggleRight,
    Monitor, Volume2, CreditCard, Save, AlertCircle
} from 'lucide-react';
import { useAuth } from '../store';

const UserSettings: React.FC = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState('system');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        security: true
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest">Configuration</span>
                    </div>
                    <h1 className="text-4xl font-display font-black dark:text-white tracking-tight">System Preferences</h1>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-8 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-sm"
                >
                    {isLoading ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Config
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Nav (simulated for visual structure, could be functional links) */}
                <div className="space-y-4">
                    {['General', 'Notifications', 'Privacy & Security', 'Billing', 'API Access', 'Integrations'].map((item, i) => (
                        <button
                            key={item}
                            className={`w-full text-left px-6 py-4 rounded-xl flex items-center justify-between group transition-all ${i === 0 ? 'bg-white dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/50'}`}
                        >
                            <span className={`text-sm font-bold ${i === 0 ? 'text-sky-500' : 'text-slate-500 dark:text-zinc-500 group-hover:dark:text-white'}`}>{item}</span>
                            {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Appearance Section */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                        <h3 className="text-xl font-display font-black dark:text-white mb-8 flex items-center gap-3">
                            <Monitor size={20} className="text-sky-500" /> Interface Aesthetics
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: 'light', icon: Sun, label: 'Light Mode' },
                                { id: 'dark', icon: Moon, label: 'Dark Mode' },
                                { id: 'system', icon: Monitor, label: 'System Sync' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setTheme(opt.id)}
                                    className={`p-6 rounded-[1.5rem] border flex flex-col items-center gap-4 transition-all ${theme === opt.id ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400' : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-400 hover:border-slate-300 dark:hover:border-zinc-700'}`}
                                >
                                    <opt.icon size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                        <h3 className="text-xl font-display font-black dark:text-white mb-8 flex items-center gap-3">
                            <Bell size={20} className="text-amber-500" /> Alerts & Signals
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                                        <Mail size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold dark:text-white">Email Digests</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Weekly summary of architectural metrics</div>
                                    </div>
                                </div>
                                <button onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))} className="text-sky-500">
                                    {notifications.email ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-300" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                                        <Smartphone size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold dark:text-white">Push Notifications</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Real-time operative alerts</div>
                                    </div>
                                </div>
                                <button onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))} className="text-sky-500">
                                    {notifications.push ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-300" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                                        <Shield size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold dark:text-white">Security Alerts</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Critical login events and breaches</div>
                                    </div>
                                </div>
                                <button className="text-emerald-500 cursor-not-allowed opacity-80" title="Security alerts cannot be disabled">
                                    <ToggleRight size={32} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Regional Settings */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                        <h3 className="text-xl font-display font-black dark:text-white mb-8 flex items-center gap-3">
                            <Globe size={20} className="text-emerald-500" /> Regional Nodes
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Zone</label>
                                <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none dark:text-white">
                                    <option>Pacific Standard Time (PST)</option>
                                    <option>Eastern Standard Time (EST)</option>
                                    <option>UTC (Coordinated Universal Time)</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Language Protocol</label>
                                <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none dark:text-white">
                                    <option>English (United States)</option>
                                    <option>Spanish (Español)</option>
                                    <option>French (Français)</option>
                                    <option>Japanese (日本語)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] border border-red-500/20 bg-red-500/5">
                        <h3 className="text-xl font-display font-black text-red-500 mb-4 flex items-center gap-3">
                            <AlertCircle size={20} /> Danger Zone
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">Irreversible actions regarding your account data and identity.</p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 rounded-xl bg-white dark:bg-zinc-900 text-red-500 border border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:border-red-500 transition-colors">
                                Export All Data
                            </button>
                            <button className="px-6 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
                                Delete Identity
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserSettings;
