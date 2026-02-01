import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, ShoppingBag, CreditCard, Sparkles,
  Zap, Package, Clock, FileText, ArrowRight,
  Shield, Activity, Terminal, ChevronRight, AlertCircle,
  Cpu, Database, Wifi
} from 'lucide-react';
import { useAuth, useNavigation } from '../store';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = (id: number) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // In a real app, this would trigger a file download
      alert("Secure asset decryption complete. Download started.");
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">
      {/* --- Mission Control Header --- */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 group">
        <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Cpu size={300} strokeWidth={0.5} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Node Secure</span>
            </div>

            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter dark:text-white mb-2">
                WELCOME BACK, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">
                  {user?.firstName?.toUpperCase() || 'OPERATIVE'}
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg">
                Your digital command center is ready. System integrity is at 100%. Access your assets below.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[240px]">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clearance Level</span>
                <Shield size={14} className="text-sky-500" />
              </div>
              <div className="text-xl font-black dark:text-white uppercase tracking-tight">{user?.plan || 'Standard'} Tier</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Network Status</span>
                <Wifi size={14} className="text-emerald-500" />
              </div>
              <div className="text-xl font-black dark:text-white uppercase tracking-tight font-mono">ONLINE</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- System Metrics Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Assets', value: '14', icon: Package, color: 'text-sky-500', bg: 'bg-sky-500/10' },
          { label: 'Support Tickets', value: '01', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Credits Available', value: '$450.00', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'System Pings', value: '2.4ms', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
          >
            <div className={`absolute top-0 right-0 p-8 rounded-bl-[4rem] opacity-20 transition-transform group-hover:scale-150 ${stat.bg}`}>
              <stat.icon size={48} className={stat.color} />
            </div>
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="text-4xl font-display font-black dark:text-white tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Digital Vault (Assets) --- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
              <Database size={24} className="text-sky-500" />
              Digital Vault
            </h3>
            <button
              onClick={() => navigate('products')}
              className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 hover:gap-3 transition-all"
            >
              Browse Market <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="group relative rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500">
                <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-zinc-950 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60" />
                  <img
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1614064641938-3bcee529cf91' : '1635070041078-e363dbe005cb'}?w=800&auto=format&fit=crop&q=60`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 saturate-0 group-hover:saturate-100"
                    alt="Asset Preview"
                  />

                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                      v{i}.4.2
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <h4 className="text-xl font-black text-white mb-1">Horizon Dashboard OS</h4>
                    <p className="text-slate-300 text-xs font-medium line-clamp-1">Enterprise grade React dashboard system.</p>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors">
                      View Docs
                    </button>
                    <button
                      onClick={() => handleDownload(i)}
                      disabled={downloadingId === i}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 text-[10px] font-black uppercase text-white hover:bg-sky-500 transition-all disabled:opacity-70 disabled:cursor-wait"
                    >
                      {downloadingId === i ? (
                        <span className="animate-pulse">Decrypting...</span>
                      ) : (
                        <>
                          <Download size={14} /> Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Transaction Log --- */}
        <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 flex flex-col h-full">
          <h3 className="text-xl font-display font-black dark:text-white mb-6 flex items-center gap-3">
            <Terminal size={22} className="text-emerald-500" />
            System Ledger
          </h3>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] hide-scrollbar pr-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 hover:border-emerald-500/30 transition-all cursor-default relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono dark:text-slate-200 group-hover:text-emerald-500 transition-colors">INV-2024-00{item}</div>
                    <div className="text-[10px] font-medium text-slate-400 mt-0.5">Oct 2{item}, 2024 • 14:30</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black dark:text-white">$149.00</div>
                  <div className="text-[8px] font-black text-emerald-500 uppercase mt-0.5 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">Paid</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('user-orders')}
            className="w-full mt-6 py-4 rounded-xl border border-slate-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          >
            Access Full Archive
          </button>
        </div>
      </div>

      {/* --- Footer Status --- */}
      <div className="flex items-center justify-between py-6 px-4 border-t border-slate-200 dark:border-zinc-800/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
        <span>System Version 2.4.0</span>
        <span className="flex items-center gap-2">
          Secure Connection <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </span>
      </div>
    </div>
  );
};

export default UserDashboard;
