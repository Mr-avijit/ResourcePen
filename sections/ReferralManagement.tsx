import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Award, DollarSign, Share2, Link as LinkIcon, 
  TrendingUp, UserPlus, Gift, ExternalLink, Copy, 
  Check, Search, Filter, MoreVertical, Star, 
  ChevronRight, ArrowUpRight, Zap, ShieldCheck, 
  RefreshCcw, Info, Globe, Mail, MessageSquare, 
  X, MousePointer2, Trophy, Target, Heart
} from 'lucide-react';

// --- Types ---
interface Referrer {
  id: string;
  name: string;
  avatar: string;
  referralsCount: number;
  conversions: number;
  earnings: number;
  status: 'elite' | 'pro' | 'rising';
  code: string;
}

interface ReferralActivity {
  id: string;
  userName: string;
  action: 'signup' | 'purchase' | 'bonus';
  time: string;
  amount?: number;
  referrer: string;
}

// --- Mock Data ---
const MOCK_REFERRERS: Referrer[] = [
  { id: 'REF-001', name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', referralsCount: 1420, conversions: 284, earnings: 14200, status: 'elite', code: 'ALEX_ELITE' },
  { id: 'REF-002', name: 'Elena Petrova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', referralsCount: 840, conversions: 112, earnings: 5600, status: 'pro', code: 'DESIGN_ELENA' },
  { id: 'REF-003', name: 'Marcus Wong', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', referralsCount: 520, conversions: 64, earnings: 3200, status: 'pro', code: 'MARCUS_CODE' },
  { id: 'REF-004', name: 'Sarah Jenkins', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', referralsCount: 210, conversions: 18, earnings: 900, status: 'rising', code: 'SARAH_SaaS' },
];

const MOCK_ACTIVITY: ReferralActivity[] = [
  { id: 'ACT-01', userName: 'TechCorp Solutions', action: 'purchase', time: '12m ago', amount: 450, referrer: 'Alex Rivera' },
  { id: 'ACT-02', userName: 'John Developer', action: 'signup', time: '1h ago', referrer: 'Elena Petrova' },
  { id: 'ACT-03', userName: 'Stellar Apps', action: 'purchase', time: '3h ago', amount: 120, referrer: 'Alex Rivera' },
  { id: 'ACT-04', userName: 'UI Masters', action: 'bonus', time: '5h ago', amount: 50, referrer: 'Marcus Wong' },
];

const ReferralManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState<Referrer | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredReferrers = useMemo(() => {
    return MOCK_REFERRERS.filter(r => 
      r.name.toLowerCase().includes(search.toLowerCase()) || 
      r.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Growth Command
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
              <TrendingUp size={16} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mt-1">Orchestrate advocates, referral funnels, and revenue share protocols.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-2xl p-1 shadow-sm">
              <div className="px-6 py-2 flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Payouts</span>
                <span className="text-sm font-black dark:text-white">$24,500.00</span>
              </div>
              <div className="w-px h-8 self-center bg-slate-100 dark:bg-zinc-800" />
              <div className="px-6 py-2 flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active advocates</span>
                <span className="text-sm font-black text-primary-500">1,248 Elite</span>
              </div>
           </div>
           <button 
             onClick={() => setIsShareModalOpen(true)}
             className="px-5 py-3 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all flex items-center gap-2 active:scale-95"
           >
             <UserPlus size={16} /> Enroll Partner
           </button>
        </div>
      </div>

      {/* --- KPI Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Referrals', value: '12,840', grow: '+14.2%', icon: Users, color: 'text-primary-500' },
          { label: 'Avg. Conversion', value: '8.4%', grow: '+2.1%', icon: Target, color: 'text-emerald-500' },
          { label: 'Revenue Share', value: '20.0%', grow: 'Stable', icon: DollarSign, color: 'text-amber-500' },
          { label: 'Conversion Velocity', value: '1.2h', grow: '-14m', icon: Zap, color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm group hover:border-primary-500/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.grow.startsWith('+') ? 'text-emerald-500' : stat.grow.startsWith('-') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {stat.grow}
              </span>
            </div>
            <div className="text-2xl font-display font-black dark:text-white mb-0.5 tracking-tight">{stat.value}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Leaderboard Column --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[3rem] border border-slate-200 dark:border-zinc-900 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
               <div>
                 <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                   <Trophy size={22} className="text-yellow-500" />
                   Elite Leaderboard
                 </h3>
                 <p className="text-xs text-slate-400 font-medium mt-1">High-performing advocates by conversion volume.</p>
               </div>
               <div className="relative group">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search partners..."
                   className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white w-48"
                 />
               </div>
             </div>

             <div className="space-y-4">
                {filteredReferrers.map((ref, i) => (
                  <motion.div
                    key={ref.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-[2rem] bg-slate-50/50 dark:bg-[#080808]/50 border border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white dark:hover:bg-zinc-950 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                       <div className="relative">
                         <img src={ref.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-zinc-800 shadow-lg" alt="" />
                         <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md ${
                           i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-700'
                         }`}>
                           {i + 1}
                         </div>
                       </div>
                       <div>
                         <div className="text-sm font-black dark:text-white flex items-center gap-2">
                           {ref.name}
                           {ref.status === 'elite' && <ShieldCheck size={14} className="text-primary-500" />}
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ref.status} Tier Partner</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 text-center">
                       <div>
                         <div className="text-xs font-black dark:text-white">{ref.referralsCount}</div>
                         <div className="text-[8px] font-bold text-slate-400 uppercase">Referrals</div>
                       </div>
                       <div>
                         <div className="text-xs font-black text-emerald-500">{ref.conversions}</div>
                         <div className="text-[8px] font-bold text-slate-400 uppercase">Conversions</div>
                       </div>
                       <div>
                         <div className="text-xs font-black dark:text-white">${(ref.earnings / 1000).toFixed(1)}k</div>
                         <div className="text-[8px] font-bold text-slate-400 uppercase">Payouts</div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <div className="px-4 py-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl text-[10px] font-mono font-bold dark:text-primary-400">
                         {ref.code}
                       </div>
                       <button 
                         onClick={() => handleCopy(ref.code, ref.id)}
                         className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-400 hover:text-primary-500 transition-all"
                       >
                         {copiedId === ref.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                       </button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="p-10 rounded-[3rem] bg-zinc-900 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                     Automated Protocol
                   </div>
                   <h4 className="text-3xl font-display font-black leading-none">Smart Bonus Engine</h4>
                   <p className="text-zinc-400 text-sm max-w-sm">System has detected high activity. Suggested incentive: +5% commission for top 10 referrers next week.</p>
                   <button className="px-8 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-emerald-50 transition-all active:scale-95">
                     Deploy Incentive
                   </button>
                </div>
                <div className="relative">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <Zap size={64} className="animate-pulse" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- Side Activity Column --- */}
        <div className="space-y-8">
           <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900 shadow-sm">
              <h4 className="text-lg font-bold dark:text-white mb-8 flex items-center gap-2">
                <RefreshCcw size={18} className="text-primary-500" /> Pulse Activity
              </h4>
              <div className="space-y-6">
                 {MOCK_ACTIVITY.map((act, i) => (
                   <div key={act.id} className="flex gap-4 relative">
                      {i < MOCK_ACTIVITY.length - 1 && (
                        <div className="absolute top-10 left-5 w-px h-6 bg-slate-100 dark:bg-zinc-900" />
                      )}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        act.action === 'purchase' ? 'bg-emerald-500/10 text-emerald-500' : 
                        act.action === 'signup' ? 'bg-primary-500/10 text-primary-500' : 
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                         {act.action === 'purchase' ? <DollarSign size={18} /> : 
                          act.action === 'signup' ? <UserPlus size={18} /> : <Award size={18} />}
                      </div>
                      <div className="flex-1">
                         <div className="text-xs font-bold dark:text-white truncate max-w-[140px]">{act.userName}</div>
                         <div className="text-[10px] text-slate-500 font-medium">
                           {act.action === 'purchase' ? 'Completed Deployment' : 
                            act.action === 'signup' ? 'Joined Ecosystem' : 'Earned Milestone'}
                         </div>
                         <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                           via <span className="text-primary-500">{act.referrer}</span> • {act.time}
                         </div>
                      </div>
                      {act.amount && (
                        <div className="text-xs font-black dark:text-white text-right">
                          +${act.amount}
                        </div>
                      )}
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 dark:bg-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-500 transition-all border dark:border-zinc-800">
                View Deep Logs
              </button>
           </div>

           <div className="p-8 rounded-[3rem] bg-gradient-to-br from-primary-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <Target size={32} className="mb-4 text-white/80" />
                 <h4 className="text-xl font-bold mb-2">Program Metrics</h4>
                 <p className="text-xs text-primary-100 font-medium mb-8 leading-relaxed">Referrals account for <span className="font-black text-white">32% of total growth</span> this quarter. Retention is 40% higher for referred users.</p>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                       <span>Conversion Funnel</span>
                       <span>82% Health</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Globe size={180} />
              </div>
           </div>
        </div>
      </div>

      {/* --- Enrollment Modal --- */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShareModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0c0c0c] rounded-[3.5rem] p-10 overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                  <UserPlus size={32} />
                </div>
                <h3 className="text-2xl font-display font-black dark:text-white mb-2">Partner Onboarding</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-500">Initiate a new high-conversion referral protocol.</p>
              </div>

              <div className="space-y-6 mb-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Architect Identity</label>
                    <input type="text" placeholder="Full name or company name..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Redemption Code</label>
                    <div className="relative group">
                       <LinkIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="text" placeholder="e.g. PARTNER_X_2025" className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-mono font-bold focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commission Tier</label>
                       <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none dark:text-white cursor-pointer">
                          <option>Rising (15%)</option>
                          <option>Pro (20%)</option>
                          <option>Elite (30%)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Duration</label>
                       <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none dark:text-white cursor-pointer">
                          <option>Indefinite</option>
                          <option>6 Months</option>
                          <option>1 Year</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setIsShareModalOpen(false)} className="py-4 bg-slate-100 dark:bg-zinc-900 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-all">Abort Protocol</button>
                <button onClick={() => setIsShareModalOpen(false)} className="py-4 bg-primary-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all active:scale-95">Finalize Onboarding</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReferralManagement;