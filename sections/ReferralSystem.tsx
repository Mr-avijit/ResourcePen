
import React, { useState, useMemo } from 'react';
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
  Trophy, Medal, Lock, Unlock, Eye, EyeOff, Palette
} from 'lucide-react';
import { COS_Button, COS_Badge, COS_StatCard, COS_Modal, COS_Input, COS_ToastContainer, COS_Label } from '../components/COS_Library';
import { ReferralPackage, UserReferral, Payout } from '../types';

// --- Default Data with Enhanced Fields ---
const MOCK_PACKAGES: ReferralPackage[] = [
  {
    id: 'pkg-1', name: 'Nano Influencer', description: 'Entry-level tier for casual advocates.',
    price: 0, commissionType: 'percentage', commissionValue: 5, targetAmount: 1000,
    maxCommission: 500, minPayoutThreshold: 50, validityMonths: 12, status: 'active',
    visibility: 'public', colorTheme: 'from-slate-500 to-slate-700',
    features: ['Basic Dashboard', 'Standard Support', 'Monthly Payouts'],
    permissions: ['view_dashboard', 'share_link'],
    tierLevel: 1, marketingMaterialAccess: false, prioritySupport: false,
    autoRenew: true, upgradeAllowed: true, terms: 'Standard terms.', createdAt: '2024-01-10'
  },
  {
    id: 'pkg-2', name: 'Growth Partner', description: 'For dedicated builders with established networks.',
    price: 49, commissionType: 'percentage', commissionValue: 12, targetAmount: 5000,
    maxCommission: 2500, minPayoutThreshold: 100, validityMonths: 12, status: 'active',
    visibility: 'public', colorTheme: 'from-blue-500 to-indigo-600',
    features: ['Priority Payouts', 'Marketing Kit', '12% Commission', 'Detailed Analytics'],
    permissions: ['view_dashboard', 'share_link', 'view_analytics', 'access_assets'],
    tierLevel: 3, marketingMaterialAccess: true, prioritySupport: true,
    autoRenew: false, upgradeAllowed: true, terms: 'Premium terms.', createdAt: '2024-01-15'
  },
  {
    id: 'pkg-3', name: 'Apex Ambassador', description: 'Exclusive tier for industry leaders and high-volume drivers.',
    price: 199, commissionType: 'percentage', commissionValue: 25, targetAmount: 25000,
    maxCommission: 15000, minPayoutThreshold: 500, validityMonths: 12, status: 'active',
    visibility: 'public', colorTheme: 'from-amber-400 to-orange-500',
    features: ['Highest Commission', 'Dedicated Manager', 'API Access', 'Co-branded Assets', 'White-label Options'],
    permissions: ['view_dashboard', 'share_link', 'view_analytics', 'access_assets', 'manage_sub_affiliates', 'api_access'],
    tierLevel: 5, marketingMaterialAccess: true, prioritySupport: true,
    autoRenew: false, upgradeAllowed: true, terms: 'Elite terms.', createdAt: '2024-02-01'
  },
];

interface ReferralSystemProps {
  mode: 'admin' | 'user';
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ mode }) => {
  const [activeTab, setActiveTab] = useState(mode === 'admin' ? 'packages' : 'dashboard');
  const [packages, setPackages] = useState<ReferralPackage[]>(MOCK_PACKAGES);
  const [toasts, setToasts] = useState<any[]>([]);

  // Modals
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [pkgStep, setPkgStep] = useState(1); // 1: Identity, 2: Economics, 3: Permissions

  // New Package State
  const [newPkg, setNewPkg] = useState<Partial<ReferralPackage>>({
    name: '', description: '', price: 0, commissionValue: 10,
    colorTheme: 'from-blue-500 to-indigo-600',
    permissions: [], features: [], tierLevel: 1,
    visibility: 'public', status: 'active'
  });

  const [featureInput, setFeatureInput] = useState('');

  // --- Handlers ---
  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleAddFeature = () => {
    if (featureInput && !newPkg.features?.includes(featureInput)) {
      setNewPkg(prev => ({ ...prev, features: [...(prev.features || []), featureInput] }));
      setFeatureInput('');
    }
  };

  const togglePermission = (perm: string) => {
    setNewPkg(prev => {
      const perms = prev.permissions || [];
      return {
        ...prev,
        permissions: perms.includes(perm) ? perms.filter(p => p !== perm) : [...perms, perm]
      };
    });
  };

  const handleCreatePackage = () => {
    const pkg: ReferralPackage = {
      ...newPkg as ReferralPackage,
      id: `pkg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      commissionType: 'percentage', // Default for now
    };
    setPackages(prev => [...prev, pkg]);
    setIsPkgModalOpen(false);
    setNewPkg({
      name: '', description: '', price: 0, commissionValue: 10,
      colorTheme: 'from-blue-500 to-indigo-600',
      permissions: [], features: [], tierLevel: 1,
      visibility: 'public', status: 'active'
    });
    setPkgStep(1);
    addToast('success', 'Tier Deployed', `${pkg.name} is now active.`);
  };

  // --- Render Steps for Modal ---
  const renderStep1_Identity = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <COS_Input
          label="Tier Name"
          placeholder="e.g. Diamond Partner"
          value={newPkg.name}
          onChange={e => setNewPkg({ ...newPkg, name: e.target.value })}
          icon={Award}
        />
        <div className="space-y-3">
          <COS_Label>Visual Theme</COS_Label>
          <div className="flex gap-2">
            {[
              { val: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500' },
              { val: 'from-emerald-400 to-teal-600', bg: 'bg-emerald-500' },
              { val: 'from-amber-400 to-orange-500', bg: 'bg-amber-500' },
              { val: 'from-purple-500 to-pink-600', bg: 'bg-purple-500' },
              { val: 'from-slate-500 to-slate-700', bg: 'bg-slate-500' },
            ].map(theme => (
              <button
                key={theme.val}
                onClick={() => setNewPkg({ ...newPkg, colorTheme: theme.val })}
                className={`w-10 h-10 rounded-full ${theme.bg} transition-transform hover:scale-110 border-4 ${newPkg.colorTheme === theme.val ? 'border-white dark:border-zinc-800 ring-2 ring-primary-500' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <COS_Label>Description</COS_Label>
        <textarea
          className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none min-h-[100px]"
          placeholder="Describe the target audience and benefits..."
          value={newPkg.description}
          onChange={e => setNewPkg({ ...newPkg, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <COS_Label>Hierarchy Level (1-5)</COS_Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(lvl => (
              <button
                key={lvl}
                onClick={() => setNewPkg({ ...newPkg, tierLevel: lvl as any })}
                className={`flex-1 py-2 rounded-lg font-black text-sm border ${newPkg.tierLevel === lvl ? 'bg-primary-500 text-white border-primary-500' : 'bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <COS_Label>Visibility</COS_Label>
          <div className="flex gap-2 p-1 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
            <button onClick={() => setNewPkg({ ...newPkg, visibility: 'public' })} className={`flex-1 py-2 rounded-lg text-xs font-bold ${newPkg.visibility === 'public' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-slate-400'}`}>Public</button>
            <button onClick={() => setNewPkg({ ...newPkg, visibility: 'private' })} className={`flex-1 py-2 rounded-lg text-xs font-bold ${newPkg.visibility === 'private' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-slate-400'}`}>Invite Only</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2_Economics = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <COS_Input
          label="Entry Price ($)"
          type="number"
          value={newPkg.price}
          onChange={e => setNewPkg({ ...newPkg, price: parseFloat(e.target.value) })}
          icon={DollarSign}
        />
        <COS_Input
          label="Commission Rate (%)"
          type="number"
          value={newPkg.commissionValue}
          onChange={e => setNewPkg({ ...newPkg, commissionValue: parseFloat(e.target.value) })}
          icon={Zap}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <COS_Input
          label="Min Payout Threshold ($)"
          type="number"
          value={newPkg.minPayoutThreshold || 0}
          onChange={e => setNewPkg({ ...newPkg, minPayoutThreshold: parseFloat(e.target.value) })}
          placeholder="e.g. 50"
        />
        <COS_Input
          label="Validity (Months)"
          type="number"
          value={newPkg.validityMonths || 12}
          onChange={e => setNewPkg({ ...newPkg, validityMonths: parseInt(e.target.value) })}
          placeholder="e.g. 12"
        />
      </div>
      <div className="space-y-3 pt-4 border-t dark:border-zinc-900">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${newPkg.autoRenew ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'}`} onClick={() => setNewPkg({ ...newPkg, autoRenew: !newPkg.autoRenew })}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${newPkg.autoRenew ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm font-bold dark:text-white">Enable Auto-Renewal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${newPkg.upgradeAllowed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'}`} onClick={() => setNewPkg({ ...newPkg, upgradeAllowed: !newPkg.upgradeAllowed })}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${newPkg.upgradeAllowed ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm font-bold dark:text-white">Allow Plan Upgrades</span>
        </div>
      </div>
    </div>
  );

  const renderStep3_Capabilities = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      {/* Features List */}
      <div className="space-y-3">
        <COS_Label>Key Features / Perks</COS_Label>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold outline-none"
            placeholder="e.g. Priority Support"
            value={featureInput}
            onChange={e => setFeatureInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddFeature()}
          />
          <COS_Button onClick={handleAddFeature} icon={Plus}>Add</COS_Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {newPkg.features?.map((f, i) => (
            <div key={i} className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-2">
              {f}
              <button onClick={() => setNewPkg(prev => ({ ...prev, features: prev.features?.filter(itm => itm !== f) }))}><X size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="space-y-3">
        <COS_Label>Permissions & Access</COS_Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'view_dashboard', label: 'View Dashboard' },
            { id: 'view_analytics', label: 'View Deep Analytics' },
            { id: 'access_assets', label: 'Access Marketing Assets' },
            { id: 'create_referral_links', label: 'Create Custom Links' },
            { id: 'manage_sub_affiliates', label: 'Manage Sub-Affiliates' },
            { id: 'api_access', label: 'API Access' },
            { id: 'priority_payouts', label: 'Priority Payouts' },
            { id: 'custom_branding', label: 'Custom Branding' },
          ].map(perm => (
            <div
              key={perm.id}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${newPkg.permissions?.includes(perm.id) ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300'}`}
              onClick={() => togglePermission(perm.id)}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${newPkg.permissions?.includes(perm.id) ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300'}`}>
                {newPkg.permissions?.includes(perm.id) && <Check size={14} />}
              </div>
              <span className="text-sm font-bold dark:text-zinc-300">{perm.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t dark:border-zinc-900">
        <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${newPkg.marketingMaterialAccess ? 'bg-sky-500' : 'bg-slate-300 dark:bg-zinc-700'}`} onClick={() => setNewPkg({ ...newPkg, marketingMaterialAccess: !newPkg.marketingMaterialAccess })}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${newPkg.marketingMaterialAccess ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
        <span className="text-sm font-bold dark:text-white">Enable Access to Marketing Library</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto relative">
      <COS_ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest">Growth Protocol</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black dark:text-white tracking-tighter">Referral Engine</h1>
        </div>

        {mode === 'admin' && (
          <COS_Button onClick={() => { setIsPkgModalOpen(true); setPkgStep(1); }} icon={Plus} size="lg" className="shadow-xl shadow-primary-500/20">
            Create New Tier
          </COS_Button>
        )}
      </div>

      {/* --- CONTENT AREA --- */}
      {mode === 'admin' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group perspective"
              >
                {/* Holographic BG */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.colorTheme} rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700`} />

                {/* Card Content */}
                <div className="relative h-full p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden">

                  {/* Top Badge */}
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.colorTheme} text-white flex items-center justify-center shadow-lg font-black text-2xl`}>
                      {pkg.tierLevel}
                    </div>
                    <div className="flex flex-col items-end">
                      <COS_Badge sentiment={pkg.status === 'active' ? 'success' : 'neutral'}>{pkg.status}</COS_Badge>
                      <div className="mt-2 text-right">
                        <div className="text-3xl font-display font-black dark:text-white">${pkg.price}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Per Year</div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black dark:text-white mb-2">{pkg.name}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">{pkg.description}</p>

                  {/* Commission Bar */}
                  <div className="mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-500">Commission</span>
                      <span className="text-xl font-black text-indigo-500">{pkg.commissionValue}{pkg.commissionType === 'percentage' ? '%' : '$'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${pkg.colorTheme}`} style={{ width: `${Math.min(pkg.commissionValue * 2, 100)}%` }} />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 flex-1 mb-8">
                    {pkg.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-emerald-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{feat}</span>
                      </div>
                    ))}
                    {pkg.features.length > 4 && (
                      <div className="text-xs text-slate-400 pl-8">+ {pkg.features.length - 4} more benefits</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t dark:border-zinc-900 border-dashed">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold text-xs hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-[#0c0c0c] rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5">
          <h3 className="text-xl font-bold dark:text-white">User Dashboard View</h3>
          <p className="text-slate-500 mt-2">Currently optimizing the admin experience. Switch to Admin mode.</p>
        </div>
      )}

      {/* --- CREATE PACKAGE MODAL --- */}
      <COS_Modal
        isOpen={isPkgModalOpen}
        onClose={() => setIsPkgModalOpen(false)}
        title="Tier Architecture Studio"
        maxWidth="2xl"
        footer={(
          <div className="flex gap-4 w-full">
            {pkgStep > 1 && (
              <COS_Button variant="secondary" onClick={() => setPkgStep(prev => prev - 1)}>Back</COS_Button>
            )}
            <div className="flex-1" />
            {pkgStep < 3 ? (
              <COS_Button onClick={() => setPkgStep(prev => prev + 1)}>Next Step <ChevronRight size={16} /></COS_Button>
            ) : (
              <COS_Button onClick={handleCreatePackage} icon={Rocket}>Deploy Tier</COS_Button>
            )}
          </div>
        )}
      >
        <div className="mb-8">
          {/* Stepper */}
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 dark:bg-zinc-800 -z-10" />
            {[
              { id: 1, label: 'Identity' },
              { id: 2, label: 'Economics' },
              { id: 3, label: 'Capabilities' }
            ].map(step => (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-white dark:bg-[#0c0c0c] px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${pkgStep >= step.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 dark:bg-zinc-900 text-slate-400'}`}>
                  {step.id}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${pkgStep >= step.id ? 'text-primary-500' : 'text-slate-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {pkgStep === 1 && renderStep1_Identity()}
          {pkgStep === 2 && renderStep2_Economics()}
          {pkgStep === 3 && renderStep3_Capabilities()}
        </div>
      </COS_Modal>

    </div>
  );
};

export default ReferralSystem;
