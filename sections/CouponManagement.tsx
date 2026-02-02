import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Plus, Search, Filter, Copy, Check,
  Trash2, Edit3, Calendar, Users, TrendingUp,
  Clock, AlertCircle, CheckCircle2, ChevronRight,
  MoreVertical, RefreshCcw, Info, ArrowUpRight,
  X, Scissors, Gift, Percent, DollarSign, Zap,
  Timer, Rocket, Flame, Layers, BarChart3,
  History, FileSpreadsheet, Sparkles, Target
} from 'lucide-react';
import { COS_Button, COS_Badge, COS_Input, COS_Modal, COS_ToastContainer } from '../components/COS_Library';

// --- Types ---
type DiscountType = 'percentage' | 'fixed';
type CouponStatus = 'active' | 'expired' | 'disabled';
type AudienceType = 'all' | 'new_users' | 'vip' | 'returning';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  expiryDate: string;
  status: CouponStatus;
  usageCount: number;
  usageLimit: number | null;
  minSpend?: number;
  audience: AudienceType;
  totalSaved: number;
  isLimitedTimeOffer?: boolean;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  code: string;
  user: string;
  saved: number;
  timestamp: string;
}

// --- Mock Data ---
const MOCK_COUPONS: Coupon[] = [
  { id: 'CP-001', code: 'ARCHITECT20', description: '20% off for verified architects', type: 'percentage', value: 20, expiryDate: '2025-12-31', status: 'active', usageCount: 142, usageLimit: 500, minSpend: 100, audience: 'vip', totalSaved: 2840, createdAt: '2024-01-15' },
  { id: 'CP-002', code: 'WELCOME100', description: 'Fixed $100 off enterprise plans', type: 'fixed', value: 100, expiryDate: '2025-06-30', status: 'active', usageCount: 84, usageLimit: 100, minSpend: 1000, audience: 'new_users', totalSaved: 8400, createdAt: '2024-02-01' },
  { id: 'CP-003', code: 'BLACKFRIDAY', description: 'Universal 50% seasonal discount', type: 'percentage', value: 50, expiryDate: '2024-11-30', status: 'expired', usageCount: 1205, usageLimit: null, audience: 'all', totalSaved: 42175, createdAt: '2023-11-01' },
  { id: 'CP-004', code: 'BETA_TESTER', description: 'Early access internal rewards', type: 'percentage', value: 15, expiryDate: '2025-01-01', status: 'disabled', usageCount: 12, usageLimit: 50, audience: 'vip', totalSaved: 180, createdAt: '2024-03-10' },
  { id: 'CP-005', code: 'FLASH_50', description: 'Limited Time Offer - 1 Hour Special', type: 'percentage', value: 50, expiryDate: '2025-12-31', status: 'active', usageCount: 45, usageLimit: 100, totalSaved: 1250, isLimitedTimeOffer: true, audience: 'all', createdAt: '2024-10-24' },
];

const MOCK_ACTIVITY: ActivityLog[] = [
  { id: 'L-1', code: 'FLASH_50', user: 'alice@corp.com', saved: 50, timestamp: '2 mins ago' },
  { id: 'L-2', code: 'ARCHITECT20', user: 'bob@design.studio', saved: 120, timestamp: '15 mins ago' },
  { id: 'L-3', code: 'WELCOME100', user: 'new_startup_llc', saved: 100, timestamp: '1 hour ago' },
  { id: 'L-4', code: 'ARCHITECT20', user: 'sarah_styles', saved: 45, timestamp: '2 hours ago' },
];

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics' | 'logs'>('campaigns');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLTOModalOpen, setIsLTOModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | CouponStatus>('all');
  const [toasts, setToasts] = useState<any[]>([]);

  // Form States
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '', description: '', type: 'percentage', value: 0,
    expiryDate: '', usageLimit: 0, status: 'active', minSpend: 0, audience: 'all'
  });
  const [newLTO, setNewLTO] = useState<Partial<Coupon>>({
    code: '', description: '', type: 'percentage', value: 0,
    expiryDate: '', usageLimit: 0, status: 'active', isLimitedTimeOffer: true
  });
  const [bulkConfig, setBulkConfig] = useState({ prefix: 'PROMO', count: 10, value: 15 });

  // --- Logic ---
  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, filterStatus]);

  const stats = useMemo(() => {
    const active = coupons.filter(c => c.status === 'active').length;
    const totalSavings = coupons.reduce((acc, c) => acc + c.totalSaved, 0);
    const totalUsages = coupons.reduce((acc, c) => acc + c.usageCount, 0);
    return { active, totalSavings, totalUsages };
  }, [coupons]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    addToast('success', 'Copied', `Code ${code} ready for distribution.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status === 'active' ? 'disabled' : 'active';
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    addToast('danger', 'Deleted', 'Promotion removed from engine.');
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.value) {
      addToast('danger', 'Error', 'Code and value are required.');
      return;
    }
    const coupon: Coupon = {
      id: `CP-${Date.now()}`,
      code: newCoupon.code!.toUpperCase(),
      description: newCoupon.description || '',
      type: newCoupon.type as DiscountType,
      value: Number(newCoupon.value),
      expiryDate: newCoupon.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      usageCount: 0,
      usageLimit: Number(newCoupon.usageLimit) || null,
      minSpend: Number(newCoupon.minSpend) || 0,
      audience: (newCoupon.audience as AudienceType) || 'all',
      totalSaved: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCoupons([coupon, ...coupons]);
    setIsCreateModalOpen(false);
    addToast('success', 'Launched', `Reward ${coupon.code} is now active.`);
    setNewCoupon({ code: '', description: '', type: 'percentage', value: 0, expiryDate: '', usageLimit: 0, status: 'active', minSpend: 0, audience: 'all' });
  };

  const handleCreateLTO = () => {
    if (!newLTO.code || !newLTO.value) return;
    const lto: Coupon = {
      id: `LTO-${Date.now()}`,
      code: newLTO.code!.toUpperCase(),
      description: newLTO.description || 'Limited Time Offer',
      type: newLTO.type as DiscountType,
      value: Number(newLTO.value),
      expiryDate: newLTO.expiryDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      usageCount: 0,
      usageLimit: Number(newLTO.usageLimit) || 100,
      minSpend: 0,
      audience: 'all',
      totalSaved: 0,
      isLimitedTimeOffer: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCoupons([lto, ...coupons]);
    setIsLTOModalOpen(false);
    addToast('success', 'Urgency Mode', `LTO ${lto.code} ignited.`);
  };

  const handleBulkGenerate = () => {
    const newCoupons: Coupon[] = [];
    for (let i = 0; i < bulkConfig.count; i++) {
      const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
      newCoupons.push({
        id: `BLK-${Date.now()}-${i}`,
        code: `${bulkConfig.prefix}_${uniqueId}`,
        description: `Bulk Batch ${new Date().toLocaleDateString()}`,
        type: 'percentage',
        value: bulkConfig.value,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        usageCount: 0,
        usageLimit: 1,
        audience: 'all',
        totalSaved: 0,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setCoupons([...newCoupons, ...coupons]);
    setIsBulkModalOpen(false);
    addToast('success', 'Batch Generated', `${bulkConfig.count} unique codes created.`);
  };

  // --- Styles ---
  const getStatusStyle = (status: CouponStatus) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'expired': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  // --- Views ---

  const AnalyticsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
        <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-primary-500" /> Redemption Velocity</h3>
        <div className="h-48 w-full flex items-end gap-3">
          {[45, 60, 30, 85, 55, 70, 95].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end group">
              <div className="w-full bg-slate-100 dark:bg-zinc-900 rounded-t-xl relative overflow-hidden group-hover:bg-primary-500/20 transition-colors" style={{ height: `${h}%` }}>
                <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ delay: i * 0.1, duration: 1 }} className="absolute bottom-0 w-full bg-gradient-to-t from-primary-600 to-primary-400" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-slate-400">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>

      <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
        <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2"><Target size={20} className="text-emerald-500" /> Audience Heatmap</h3>
        <div className="space-y-6">
          {[
            { label: 'Verified Architects', val: 65, color: 'bg-emerald-500' },
            { label: 'New Signups', val: 20, color: 'bg-indigo-500' },
            { label: 'Returning Enterprise', val: 15, color: 'bg-amber-500' }
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-xs font-bold mb-2 dark:text-zinc-300">
                <span>{s.label}</span>
                <span>{s.val}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} className={`h-full ${s.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ActivityFeedView = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      {MOCK_ACTIVITY.map((log, i) => (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={log.id} className="p-4 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 flex items-center justify-between group hover:border-primary-500/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-slate-500">
              <TicketIcon type="log" />
            </div>
            <div>
              <div className="text-sm font-bold dark:text-white">{log.user}</div>
              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <span className="text-primary-500">{log.code}</span> • {log.timestamp}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-emerald-500">-${log.saved}</div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">Saved</div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <COS_ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Reward Engine
            <div className="p-2 rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
              <Gift size={24} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-2 max-w-2xl">
            Architect incentives, engineer scarcity with LTOs, and track redemption velocity.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white dark:bg-[#0c0c0c] p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
          {[
            { id: 'campaigns', icon: Layers, label: 'Campaigns' },
            { id: 'analytics', icon: BarChart3, label: 'Intelligence' },
            { id: 'logs', icon: History, label: 'Ledger' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[600px] space-y-8">

        {/* --- CAMPAIGNS VIEW --- */}
        {activeTab === 'campaigns' && (
          <>
            {/* LTO Banner */}
            <div className="p-8 rounded-[3rem] bg-gradient-to-r from-indigo-950 to-indigo-900 text-white relative overflow-hidden shadow-2xl group border border-indigo-500/20">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Timer size={200} />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-200">
                      <Flame size={12} className="text-orange-400" /> High Urgency Protocol
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                    Flash Deal Generator
                  </h2>
                  <p className="text-indigo-200/80 max-w-lg text-sm leading-relaxed font-medium">
                    Deploy scarcity-driven campaigns. LTOs are automatically tagged with countdown timers on the storefront to boost conversion.
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <button
                    onClick={() => setIsLTOModalOpen(true)}
                    className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket size={16} /> Launch LTO
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="glass p-3 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={20} />
                <input
                  type="text" placeholder="Filter rewards..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-black rounded-[2rem] border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm font-bold transition-all dark:text-white"
                />
              </div>
              <button onClick={() => setIsBulkModalOpen(true)} className="px-6 py-4 bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:text-primary-500 flex items-center gap-2 border dark:border-white/5">
                <FileSpreadsheet size={16} /> Batch Gen
              </button>
              <button onClick={() => setIsCreateModalOpen(true)} className="px-8 py-4 bg-primary-600 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-primary-500 flex items-center gap-2">
                <Plus size={16} /> New Reward
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredCoupons.map((coupon, i) => (
                  <motion.div
                    key={coupon.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative group"
                  >
                    <div className={`relative p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border shadow-sm hover:shadow-2xl transition-all h-full flex flex-col group/card ${coupon.isLimitedTimeOffer ? 'border-orange-500/30 dark:border-orange-500/20' : 'border-slate-200 dark:border-white/5'}`}>

                      {coupon.isLimitedTimeOffer && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                          <Flame size={10} /> Limited Time Offer
                        </div>
                      )}

                      {/* Perforation Decor */}
                      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 dark:bg-black rounded-full border border-slate-200 dark:border-white/5 -translate-y-1/2 z-10" />
                      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 dark:bg-black rounded-full border border-slate-200 dark:border-white/5 -translate-y-1/2 z-10" />

                      <div className="flex justify-between items-start mb-8 relative">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border dark:border-zinc-800 ${coupon.type === 'percentage' ? 'bg-primary-500/10 text-primary-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {coupon.type === 'percentage' ? <Percent size={24} /> : <DollarSign size={24} />}
                        </div>
                        <div className="flex items-center gap-2">
                          {coupon.minSpend! > 0 && <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 text-[9px] font-bold text-slate-500 border dark:border-zinc-800">Min ${coupon.minSpend}</span>}
                          <button onClick={() => toggleStatus(coupon.id)} className={`w-10 h-5 rounded-full relative transition-colors ${coupon.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-800'}`}>
                            <motion.div animate={{ x: coupon.status === 'active' ? 22 : 2 }} className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 mb-8">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 group-hover:border-primary-500/30 transition-colors">
                          <h3 className="flex-1 text-center text-xl font-mono font-black dark:text-white tracking-tight">{coupon.code}</h3>
                          <button
                            onClick={() => handleCopy(coupon.code, coupon.id)}
                            className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-slate-400 hover:text-primary-500 transition-all active:scale-90 shadow-sm"
                          >
                            {copiedId === coupon.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium leading-relaxed px-2 line-clamp-2">{coupon.description}</p>

                        <div className="flex items-center gap-4 pt-2 px-2">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{coupon.expiryDate}</span>
                          </div>
                          <div className="w-px h-3 bg-slate-200 dark:bg-zinc-800" />
                          <div className="flex items-center gap-2">
                            <Target size={14} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{coupon.audience.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Usage  */}
                      <div className="space-y-3 pt-6 border-t border-dashed dark:border-zinc-800">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span>Redemption Cap</span>
                          <span className="text-primary-500">{coupon.usageLimit ? `${Math.round((coupon.usageCount / coupon.usageLimit) * 100)}%` : '∞'}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: coupon.usageLimit ? `${(coupon.usageCount / coupon.usageLimit) * 100}%` : '5%' }} className={`h-full ${coupon.status === 'expired' ? 'bg-red-500' : 'bg-primary-500'}`} />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue Impact</span>
                          <span className="text-lg font-black dark:text-white tracking-tighter">${coupon.totalSaved.toLocaleString()}</span>
                        </div>
                        <button onClick={() => deleteCoupon(coupon.id)} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* --- ANALYTICS VIEW --- */}
        {activeTab === 'analytics' && <AnalyticsView />}

        {/* --- LOGS VIEW --- */}
        {activeTab === 'logs' && <ActivityFeedView />}

      </div>

      {/* --- MODALS --- */}

      {/* Create Standard Reward */}
      <COS_Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Reward Logic">
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <COS_Input label="Coupon Code" placeholder="e.g. SUMMER25" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} icon={Tag} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logic Type</label>
              <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-2xl">
                <button onClick={() => setNewCoupon({ ...newCoupon, type: 'percentage' })} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newCoupon.type === 'percentage' ? 'bg-white dark:bg-zinc-800 text-primary-500 shadow-sm' : 'text-slate-400'}`}>% Percent</button>
                <button onClick={() => setNewCoupon({ ...newCoupon, type: 'fixed' })} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newCoupon.type === 'fixed' ? 'bg-white dark:bg-zinc-800 text-emerald-500 shadow-sm' : 'text-slate-400'}`}>$ Flat</button>
              </div>
            </div>
            <COS_Input label="Value" type="number" value={newCoupon.value} onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })} icon={DollarSign} />
          </div>
          <COS_Input label="Description" value={newCoupon.description} onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })} icon={Layers} />

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Target size={14} /> Targeting Rules</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Min. Spend</label>
                <input type="number" value={newCoupon.minSpend} onChange={e => setNewCoupon({ ...newCoupon, minSpend: Number(e.target.value) })} className="w-full px-4 py-3 bg-white dark:bg-black rounded-xl text-sm font-bold border dark:border-zinc-800 dark:text-white" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Audience</label>
                <select value={newCoupon.audience} onChange={e => setNewCoupon({ ...newCoupon, audience: e.target.value as any })} className="w-full px-4 py-3 bg-white dark:bg-black rounded-xl text-sm font-bold border dark:border-zinc-800 dark:text-white">
                  <option value="all">All Users</option>
                  <option value="new_users">First Time Only</option>
                  <option value="vip">VIP Tier</option>
                  <option value="returning">Returning</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <COS_Input label="Expiry" type="date" value={newCoupon.expiryDate} onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} />
            <COS_Input label="Use Limit" type="number" value={newCoupon.usageLimit} onChange={e => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })} icon={Users} />
          </div>

          <div className="pt-4 border-t dark:border-zinc-900">
            <COS_Button isFullWidth onClick={handleCreateCoupon} size="lg">Initialize Reward</COS_Button>
          </div>
        </div>
      </COS_Modal>

      {/* LTO Modal */}
      <COS_Modal isOpen={isLTOModalOpen} onClose={() => setIsLTOModalOpen(false)} title="Launch Flash Deal">
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-4">
            <Flame size={24} className="text-orange-500 shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-orange-900 dark:text-orange-200 mb-1">High Urgency Mode</h4>
              <p className="text-xs text-orange-800/70 dark:text-orange-300/70 leading-relaxed">
                Creates a temporary discount code with a visual countdown timer on the user's dashboard.
              </p>
            </div>
          </div>
          <COS_Input label="LTO Code" placeholder="FLASH_SALE" value={newLTO.code} onChange={e => setNewLTO({ ...newLTO, code: e.target.value })} icon={Zap} />
          <div className="grid grid-cols-2 gap-6">
            <COS_Input label="Discount %" type="number" value={newLTO.value} onChange={e => setNewLTO({ ...newLTO, value: Number(e.target.value) })} icon={Percent} />
            <COS_Input label="Duration (Hrs)" type="number" placeholder="24" icon={Clock} />
          </div>
          <COS_Button isFullWidth onClick={handleCreateLTO} size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 border-none text-white icon-white shadow-lg shadow-orange-500/30">
            <Rocket size={18} className="mr-2" /> Ignite Campaign
          </COS_Button>
        </div>
      </COS_Modal>

      {/* Bulk Modal */}
      <COS_Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Batch Generation">
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-4">
            <Sparkles size={24} className="text-indigo-500 shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">Mass Production</h4>
              <p className="text-xs text-indigo-800/70 dark:text-indigo-300/70 leading-relaxed">
                Generate up to 500 unique single-use codes for email marketing campaigns.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <COS_Input label="Prefix" placeholder="PROMO" value={bulkConfig.prefix} onChange={e => setBulkConfig({ ...bulkConfig, prefix: e.target.value })} />
            <COS_Input label="Quantity" type="number" value={bulkConfig.count} onChange={e => setBulkConfig({ ...bulkConfig, count: Number(e.target.value) })} icon={Layers} />
          </div>
          <COS_Input label="Discount Value (%)" type="number" value={bulkConfig.value} onChange={e => setBulkConfig({ ...bulkConfig, value: Number(e.target.value) })} icon={Percent} />
          <COS_Button isFullWidth onClick={handleBulkGenerate} size="lg">Generate {bulkConfig.count} Codes</COS_Button>
        </div>
      </COS_Modal>

    </div>
  );
};

const TicketIcon = ({ type }: { type: string }) => <Tag size={18} />;

export default CouponManagement;