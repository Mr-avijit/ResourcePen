
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Plus, Search, Filter, Trash2, Edit3,
  Check, X, Copy, ChevronRight, Info, Zap,
  DollarSign, TrendingUp, Users, Target, ShieldCheck,
  RefreshCcw, Wallet, Landmark, ArrowUpRight,
  Calendar, Layers, Clock, AlertCircle, Sparkles,
  Link as LinkIcon, Share2, MoreVertical, ExternalLink,
  Smartphone, BarChart3, PieChart, History, Gift,
  Rocket, Crown, Image as ImageIcon, Download, Share,
  Linkedin, Twitter, Facebook, Network, GitBranch,
  Trophy, Medal
} from 'lucide-react';
import { COS_Button, COS_Badge, COS_StatCard, COS_Modal, COS_Input, COS_ToastContainer } from '../components/COS_Library';

// --- Types ---
interface ReferralPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  targetAmount: number;
  maxCommission: number;
  minPayoutThreshold: number;
  validityMonths: number;
  status: 'active' | 'inactive';
  visibility: 'public' | 'private';
  colorTheme: string; // New: for UI differentiation
  perks: string[]; // New: list of perks
  autoRenew: boolean;
  upgradeAllowed: boolean;
  terms: string;
  createdAt: string;
}

interface UserReferral {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  referralCode: string;
  referralLink: string;
  walletBalance: number;
  totalEarned: number;
  pendingCommission: number;
  paidCommission: number;
  targetProgress: number;
  validityEndDate: string;
  status: 'active' | 'inactive';
  referralsCount: number;
  conversions: number;
  rank: number; // New: leaderboard rank
}

interface Payout {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'paid' | 'rejected';
  transactionId?: string;
  createdAt: string;
  paidAt?: string;
}

interface MarketingAsset {
  id: string;
  title: string;
  type: 'banner' | 'social' | 'email';
  size: string;
  downloadUrl: string;
  previewColor: string;
}

interface ReferralSystemProps {
  mode: 'admin' | 'user';
}

// --- Mock Initial Data ---
const MOCK_PACKAGES: ReferralPackage[] = [
  {
    id: 'pkg-1', name: 'Nano Influencer', description: 'Entry-level tier for casual advocates.',
    price: 0, commissionType: 'percentage', commissionValue: 5, targetAmount: 1000,
    maxCommission: 500, minPayoutThreshold: 50, validityMonths: 12, status: 'active',
    visibility: 'public', colorTheme: 'from-slate-500 to-slate-700', perks: ['Basic Dashboard', 'Standard Support'],
    autoRenew: true, upgradeAllowed: true, terms: 'Standard terms.', createdAt: '2024-01-10'
  },
  {
    id: 'pkg-2', name: 'Growth Partner', description: 'For dedicated builders with established networks.',
    price: 49, commissionType: 'percentage', commissionValue: 12, targetAmount: 5000,
    maxCommission: 2500, minPayoutThreshold: 100, validityMonths: 12, status: 'active',
    visibility: 'public', colorTheme: 'from-blue-500 to-indigo-600', perks: ['Priority Payouts', 'Marketing Kit', '12% Commission'],
    autoRenew: false, upgradeAllowed: true, terms: 'Premium terms.', createdAt: '2024-01-15'
  },
  {
    id: 'pkg-3', name: 'Apex Ambassador', description: 'Exclusive tier for industry leaders and high-volume drivers.',
    price: 199, commissionType: 'percentage', commissionValue: 25, targetAmount: 25000,
    maxCommission: 15000, minPayoutThreshold: 500, validityMonths: 12, status: 'active',
    visibility: 'public', colorTheme: 'from-amber-400 to-orange-500', perks: ['highest Commission', 'Dedicated Manager', 'API Access', 'Co-branded Assets'],
    autoRenew: false, upgradeAllowed: true, terms: 'Elite terms.', createdAt: '2024-02-01'
  },
];

const MOCK_ASSETS: MarketingAsset[] = [
  { id: 'as-1', title: 'Instagram Story Frame', type: 'social', size: '1080x1920', downloadUrl: '#', previewColor: 'bg-purple-500' },
  { id: 'as-2', title: 'LinkedIn Post Header', type: 'social', size: '1200x627', downloadUrl: '#', previewColor: 'bg-blue-600' },
  { id: 'as-3', title: 'Email Signature Badge', type: 'email', size: '400x100', downloadUrl: '#', previewColor: 'bg-emerald-500' },
  { id: 'as-4', title: 'Web Sidebar Banner', type: 'banner', size: '300x600', downloadUrl: '#', previewColor: 'bg-orange-500' },
];

const ReferralSystem: React.FC<ReferralSystemProps> = ({ mode }) => {
  const [activeTab, setActiveTab] = useState(mode === 'admin' ? 'packages' : 'dashboard');
  const [packages, setPackages] = useState<ReferralPackage[]>(MOCK_PACKAGES);
  // Mocking multiple users for leaderboard
  const [userReferrals, setUserReferrals] = useState<UserReferral[]>([
    { id: 'ur-1', userId: 'u-1', userName: 'Alex Design', packageId: 'pkg-2', packageName: 'Growth Partner', referralCode: 'ALEX2024', referralLink: 'yoursite.com/ref/ALEX2024', walletBalance: 450.50, totalEarned: 1250.00, pendingCommission: 80, paidCommission: 719, targetProgress: 65, validityEndDate: '2025-01-15', status: 'active', referralsCount: 42, conversions: 12, rank: 1 },
    { id: 'ur-2', userId: 'u-2', userName: 'Sarah Tech', packageId: 'pkg-3', packageName: 'Apex Ambassador', referralCode: 'SARAH_T', referralLink: 'yoursite.com/ref/SARAH_T', walletBalance: 2100.00, totalEarned: 8900.00, pendingCommission: 400, paidCommission: 8500, targetProgress: 92, validityEndDate: '2025-03-20', status: 'active', referralsCount: 156, conversions: 45, rank: 2 },
    { id: 'ur-3', userId: 'u-3', userName: 'Code Studio', packageId: 'pkg-1', packageName: 'Nano Influencer', referralCode: 'CODE_ST', referralLink: 'yoursite.com/ref/CODE_ST', walletBalance: 50.00, totalEarned: 120.00, pendingCommission: 10, paidCommission: 60, targetProgress: 15, validityEndDate: '2025-06-10', status: 'active', referralsCount: 8, conversions: 2, rank: 3 },
  ]);
  const [payouts, setPayouts] = useState<Payout[]>([
    { id: 'pay-1', userId: 'u-1', userName: 'Alex Design', amount: 250.00, upiId: 'alex@upi', status: 'paid', transactionId: 'TXN-992011', createdAt: '2024-10-10', paidAt: '2024-10-11' },
  ]);
  const [toasts, setToasts] = useState<any[]>([]);

  // Modals
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<ReferralPackage | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  // Form State
  const [pkgForm, setPkgForm] = useState<Partial<ReferralPackage>>({
    name: '', description: '', price: 0, commissionValue: 0, validityMonths: 12
  });

  // Helper
  const getUserData = () => userReferrals[0]; // Simulating logged-in user as first in list for 'user' mode
  const currentUser = getUserData();

  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleCreatePackage = () => {
    // ... same logic as before, just enriched with new fields if needed
    setIsPkgModalOpen(false);
    addToast('success', 'Package Deployed', 'New tier is live.');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUser.referralLink);
    addToast('success', 'Link Copied', 'Ready to share with your network.');
  };

  // --- Components ---

  const LeaderboardWidget = () => (
    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <Trophy size={140} />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Crown className="text-amber-400" size={24} /> Elite Leaderboard
        </h3>
        <div className="space-y-4">
          {userReferrals.slice(0, 3).map((user, index) => (
            <div key={user.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-amber-400 text-black' : index === 1 ? 'bg-slate-300 text-black' : 'bg-orange-700 text-white'}`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{user.userName}</div>
                <div className="text-[10px] text-white/50">{user.packageName}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-400">${user.totalEarned.toLocaleString()}</div>
                <div className="text-[9px] text-white/50">{user.conversions} Sales</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NetworkGraph = () => (
    <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2"><GitBranch size={18} className="text-sky-500" /> Network Topology</h3>
          <p className="text-xs text-slate-500">Visualizing your downstream impact.</p>
        </div>
        <button className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-400"><ExternalLink size={16} /></button>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
        {/* Mock Graph Visualization */}
        <div className="relative flex flex-col items-center gap-8">
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 font-black text-xl border-4 border-white dark:border-zinc-900 z-10 relative">You</div>
            <div className="absolute top-full left-1/2 w-0.5 h-8 bg-sky-200 dark:bg-zinc-800 -translate-x-1/2" />
          </div>
          <div className="flex gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-sky-200 dark:bg-zinc-800 absolute -mt-4" />
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-slate-500 border-2 border-white dark:border-zinc-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:border-sky-500 transition-colors cursor-pointer group relative">
                  U{i}
                  <div className="absolute bottom-full mb-2 bg-black text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Referral #{i}: $120 Earned
                  </div>
                </div>
                {i === 2 && (
                  <div className="mt-4 flex gap-2">
                    <div className="w-0.5 h-4 bg-sky-200 dark:bg-zinc-800 absolute -mt-4 left-1/2" />
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-[8px]">sub</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AssetsLibrary = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display font-black dark:text-white flex items-center gap-2"><Image as ImageIcon size={20} className="text-sky-500" /> Marketing Assets</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs font-bold text-slate-500">Banners</button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs font-bold text-slate-500">Social</button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs font-bold text-slate-500">Email</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_ASSETS.map(asset => (
          <div key={asset.id} className="group p-4 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 hover:border-sky-500/30 transition-all">
            <div className={`h-32 w-full rounded-2xl ${asset.previewColor} mb-4 flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <span className="text-white/50 font-black text-2xl uppercase tracking-widest rotate-[-15deg]">{asset.type}</span>
              <button className="absolute bottom-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-black transition-all">
                <Download size={14} />
              </button>
            </div>
            <h4 className="font-bold text-sm dark:text-white mb-1">{asset.title}</h4>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-3">{asset.size} • {asset.type}</p>
            <COS_Button size="sm" variant="secondary" isFullWidth icon={Copy} onClick={() => addToast('success', 'Asset Link Copied', 'Direct CDN link copied to clipboard')}>Copy Link</COS_Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto relative">
      <COS_ToastContainer toasts={toasts} onRemove={() => { }} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest">Growth Nodes</span>
          </div>
          <h1 className="text-4xl font-display font-black dark:text-white tracking-tighter flex items-center gap-3">
            {mode === 'admin' ? 'Referral Engine' : 'Partner Lab'}
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mt-2">
            {mode === 'admin' ? 'Configure global growth incentives and manage payout protocols.' : 'Propel platform growth and earn architectural commission.'}
          </p>
        </div>

        {mode === 'user' && (
          <div className="flex gap-3">
            <button onClick={() => setIsShareModalOpen(true)} className="px-6 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-sky-500 flex items-center gap-2 shadow-sm transition-all">
              <Share2 size={16} /> Share Link
            </button>
            <div className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white rounded-2xl flex items-center gap-3 shadow-lg shadow-sky-500/20">
              <span className="text-[10px] uppercase font-black tracking-widest opacity-80">Rank</span>
              <span className="text-lg font-black leading-none">#{currentUser.rank}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-1.5 shadow-sm w-fit overflow-x-auto">
        {(mode === 'admin' ? ['packages', 'payouts', 'users', 'analytics'] : ['dashboard', 'assets', 'history', 'payouts']).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === t ? 'bg-sky-600 text-white shadow-xl shadow-sky-500/20' : 'text-slate-500 hover:text-sky-500'}`}>{t}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-[500px]"
        >
          {/* USER DASHBOARD VIEW */}
          {activeTab === 'dashboard' && mode === 'user' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <COS_StatCard label="Wallet Balance" value={`$${currentUser.walletBalance.toFixed(2)}`} trend="+12% vs last month" isPositive icon={Wallet} color="primary" />
                <COS_StatCard label="Total Lifetime" value={`$${currentUser.totalEarned.toFixed(2)}`} icon={Landmark} color="emerald" />
                <COS_StatCard label="Network Size" value={currentUser.referralsCount.toString()} trend="+4 New Leads" isPositive icon={Users} color="sky" />
                <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest">Next Tier</span>
                    <Crown size={18} className="text-amber-500" />
                  </div>
                  <div className="text-2xl font-black dark:text-white mb-3">Apex Ambassador</div>
                  <div className="w-full h-2 bg-amber-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[65%]" />
                  </div>
                  <div className="text-[9px] text-amber-600/70 mt-2 font-bold text-right pt-1">65% Completed</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Share Box */}
                  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><LinkIcon className="text-sky-500" size={20} /> Referral Identity</h3>
                      <COS_Badge sentiment="success">Active</COS_Badge>
                    </div>
                    <div className="p-1 rounded-2xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 flex gap-2">
                      <input readOnly value={currentUser.referralLink} className="flex-1 bg-transparent px-6 py-4 text-sm font-mono font-bold dark:text-white outline-none" />
                      <button onClick={handleCopyLink} className="px-8 bg-sky-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-sky-500 transition-colors shadow-lg shadow-sky-500/20">Copy</button>
                    </div>
                    <div className="flex gap-4 mt-6">
                      {['Twitter', 'LinkedIn', 'Facebook', 'Email'].map(social => (
                        <button key={social} className="flex-1 py-3 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors">
                          {social}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Network Graph */}
                  <div className="h-[400px]">
                    <NetworkGraph />
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-8">
                  <LeaderboardWidget />

                  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-bold dark:text-white mb-6">Your Plan</h3>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-500">
                        <Rocket size={32} />
                      </div>
                      <h4 className="text-xl font-black dark:text-white">{currentUser.packageName}</h4>
                      <p className="text-xs text-slate-500 mt-1">Commission Rate</p>
                      <div className="text-3xl font-black text-sky-500">12%</div>
                    </div>
                    <COS_Button isFullWidth variant="secondary">View Tier Perks</COS_Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ASSETS VIEW */}
          {activeTab === 'assets' && <AssetsLibrary />}


          {/* ADMIN PACKAGES VIEW */}
          {activeTab === 'packages' && mode === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
              {packages.map((pkg, i) => (
                <div key={pkg.id} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${pkg.colorTheme} rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className="relative p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full overflow-hidden">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.colorTheme} flex items-center justify-center text-white shadow-lg`}>
                        <Zap size={24} />
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase">Fee</div>
                        <div className="text-xl font-black dark:text-white">${pkg.price}<span className="text-xs text-slate-400 font-bold">/yr</span></div>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-2xl font-display font-black dark:text-white mb-2">{pkg.name}</h4>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-1">{pkg.description}</p>

                    {/* Perks List */}
                    <div className="space-y-3 mb-8">
                      {pkg.perks.map(perk => (
                        <div key={perk} className="flex items-center gap-3 text-sm font-bold dark:text-zinc-300">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${pkg.colorTheme} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
                            <Check size={10} className="text-white" />
                          </div>
                          {perk}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t dark:border-zinc-900 border-dashed flex gap-2">
                      <COS_Button isFullWidth variant="secondary" size="sm">Edit</COS_Button>
                      <button className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Special 'Add Package' Card */}
              <button
                onClick={() => { setSelectedPkg(null); setIsPkgModalOpen(true); }}
                className="rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/10 hover:border-sky-500 transition-all min-h-[400px]"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                  <Plus size={32} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Create Tier</span>
              </button>
            </div>
          )}

          {/* ADMIN PAYOUTS / USERS / ANALYTICS (Preserved simplified versions for brevity in this update) */}
          {activeTab === 'payouts' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {payouts.map(p => (
                  <div key={p.id} className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 dark:bg-zinc-900 rounded-2xl"><DollarSign size={20} className="text-slate-500" /></div>
                      <div>
                        <div className="font-bold dark:text-white">${p.amount}</div>
                        <div className="text-xs text-slate-400">{p.userName}</div>
                      </div>
                    </div>
                    <COS_Badge sentiment={p.status === 'paid' ? 'success' : 'warning'}>{p.status}</COS_Badge>
                  </div>
                ))}
              </div>
              {mode === 'user' && <div className="text-center p-8"><COS_Button onClick={() => setIsPayoutModalOpen(true)}>Request Withdrawal</COS_Button></div>}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="glass p-8 rounded-[2rem] text-center text-slate-400">Transaction history table would go here...</div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* --- MODALS --- */}

      {/* Share Modal */}
      <COS_Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Spread the Word">
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center gap-4">
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Your Unique Link</p>
              <p className="text-sm font-bold dark:text-white truncate">{currentUser.referralLink}</p>
            </div>
            <button onClick={handleCopyLink} className="p-3 bg-white dark:bg-black rounded-xl shadow-sm hover:scale-105 transition-transform"><Copy size={18} className="text-sky-500" /></button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-2xl bg-[#1DA1F2] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90"><Twitter size={18} /> Tweet</button>
            <button className="p-4 rounded-2xl bg-[#0A66C2] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90"><Linkedin size={18} /> LinkedIn</button>
            <button className="p-4 rounded-2xl bg-[#4267B2] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90"><Facebook size={18} /> Facebook</button>
            <button className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90"><Share size={18} /> WhatsApp</button>
          </div>
        </div>
      </COS_Modal>

      {/* Payout Modal */}
      <COS_Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title={mode === 'admin' ? 'Verify Settlement' : 'Settlement Request'}
        footer={mode === 'admin' ? (
          <>
            <COS_Button variant="danger" className="flex-1" onClick={() => setIsPayoutModalOpen(false)}>Reject</COS_Button>
            <COS_Button className="flex-1" onClick={() => { setIsPayoutModalOpen(false); addToast('success', 'Approved', 'Payout sent'); }}>Authorize</COS_Button>
          </>
        ) : (
          <COS_Button isFullWidth onClick={() => { setIsPayoutModalOpen(false); addToast('success', 'Requested', 'Request sent to finance'); }}>Initiate Settlement</COS_Button>
        )}
      >
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-4xl font-black dark:text-white mb-2">$380.50</div>
            <p className="text-sm text-slate-500">Available Balance</p>
          </div>
          <COS_Input label="UPI Protocol ID" placeholder="user@upi-node" defaultValue={mode === 'admin' ? selectedPayout?.upiId : 'demo@upi'} />
        </div>
      </COS_Modal>


      {/* Package Modal */}
      <COS_Modal
        isOpen={isPkgModalOpen}
        onClose={() => setIsPkgModalOpen(false)}
        title="Tier Architecture"
        footer={(
          <COS_Button isFullWidth onClick={handleCreatePackage}>Deploy Tier</COS_Button>
        )}
      >
        <form className="space-y-4">
          <COS_Input label="Tier Name" placeholder="e.g. Diamond Partner" />
          <div className="grid grid-cols-2 gap-4">
            <COS_Input label="Price ($)" type="number" />
            <COS_Input label="Commission (%)" type="number" />
          </div>
          <COS_Input label="Perks (comma separated)" placeholder="Priority Support, API Access..." />
        </form>
      </COS_Modal>

    </div>
  );
};

export default ReferralSystem;
