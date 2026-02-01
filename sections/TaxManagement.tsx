import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Globe, DollarSign, Download, Plus, Search,
  Filter, MoreVertical, Edit3, Trash2, ShieldCheck,
  AlertCircle, CheckCircle2, ChevronRight, X,
  MapPin, Percent, FileText, Landmark, BarChart3,
  History, Settings, RefreshCcw, Info, Check, Save
} from 'lucide-react';
import { COS_Button, COS_Badge, COS_Input, COS_Modal, COS_StatCard, COS_ToastContainer } from '../components/COS_Library';

// --- Types ---
type TaxType = 'VAT' | 'Sales Tax' | 'GST' | 'Service Tax' | 'HST';
type TaxStatus = 'active' | 'inactive' | 'review-required';

interface TaxRule {
  id: string;
  region: string;
  countryCode: string;
  type: TaxType;
  rate: number;
  status: TaxStatus;
  lastUpdated: string;
  totalCollected: number;
}

// --- Mock Data ---
const INITIAL_RULES: TaxRule[] = [
  { id: 'TAX-001', region: 'European Union', countryCode: 'EU', type: 'VAT', rate: 21, status: 'active', lastUpdated: '2024-09-12', totalCollected: 42800 },
  { id: 'TAX-002', region: 'United States (California)', countryCode: 'US-CA', type: 'Sales Tax', rate: 8.75, status: 'active', lastUpdated: '2024-10-01', totalCollected: 12450 },
  { id: 'TAX-003', region: 'United Kingdom', countryCode: 'GB', type: 'VAT', rate: 20, status: 'active', lastUpdated: '2024-08-20', totalCollected: 18900 },
  { id: 'TAX-004', region: 'India', countryCode: 'IN', type: 'GST', rate: 18, status: 'review-required', lastUpdated: '2024-05-15', totalCollected: 5600 },
  { id: 'TAX-005', region: 'Canada', countryCode: 'CA', type: 'GST', rate: 5, status: 'inactive', lastUpdated: '2023-12-01', totalCollected: 0 },
];

const TaxManagement: React.FC = () => {
  const [rules, setRules] = useState<TaxRule[]>(INITIAL_RULES);
  const [search, setSearch] = useState('');
  const [selectedRule, setSelectedRule] = useState<TaxRule | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Notification State
  const [toasts, setToasts] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<TaxRule>>({
    region: '', countryCode: '', type: 'VAT', rate: 0, status: 'active'
  });

  // --- Logic ---

  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const filteredRules = useMemo(() => {
    return rules.filter(rule =>
      rule.region.toLowerCase().includes(search.toLowerCase()) ||
      rule.countryCode.toLowerCase().includes(search.toLowerCase()) ||
      rule.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rules]);

  const stats = useMemo(() => {
    const total = rules.reduce((acc, r) => acc + r.totalCollected, 0);
    const activeCount = rules.filter(r => r.status === 'active').length;
    const reviewCount = rules.filter(r => r.status === 'review-required').length;
    return { total, activeCount, reviewCount };
  }, [rules]);

  const getStatusColor = (status: TaxStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'review-required': return 'warning';
      default: return 'neutral';
    }
  };

  // --- Handlers ---

  const handleAddRule = () => {
    if (!formData.region || !formData.countryCode || !formData.rate) {
      addToast('danger', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newRule: TaxRule = {
      id: `TAX-${Math.floor(Math.random() * 1000)}`,
      region: formData.region!,
      countryCode: formData.countryCode!,
      type: formData.type || 'VAT',
      rate: Number(formData.rate),
      status: 'active',
      lastUpdated: new Date().toISOString().split('T')[0],
      totalCollected: 0
    };

    setRules(prev => [newRule, ...prev]);
    setIsAddModalOpen(false);
    setFormData({ region: '', countryCode: '', type: 'VAT', rate: 0, status: 'active' });
    addToast('success', 'Nexus Created', `${newRule.region} jurisdiction added successfully.`);
  };

  const handleUpdateRule = () => {
    if (!selectedRule) return;

    setRules(prev => prev.map(r => r.id === selectedRule.id ? {
      ...selectedRule,
      lastUpdated: new Date().toISOString().split('T')[0]
    } : r));

    setIsEditMode(false);
    addToast('success', 'Protocol Updated', `Tax logic for ${selectedRule.region} has been updated.`);
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    setSelectedRule(null);
    addToast('info', 'Nexus Dissolved', 'Jurisdiction removed from compliance monitoring.');
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <COS_ToastContainer toasts={toasts} onRemove={() => { }} />

      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Fiscal Compliance
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Scale size={20} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-2 max-w-2xl">
            Configure global tax jurisdictions, collection logic, and nexus triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-1.5 shadow-sm">
            <div className="px-6 py-2 flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Collection</span>
              <span className="text-lg font-display font-black dark:text-white">${stats.total.toLocaleString()}</span>
            </div>
            <div className="w-px h-10 self-center bg-slate-100 dark:bg-zinc-800" />
            <div className="px-6 py-2 flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Nexuses</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-display font-black text-primary-500">{stats.activeCount}</span>
                {stats.reviewCount > 0 && <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1"><AlertCircle size={8} /> {stats.reviewCount} Check</span>}
              </div>
            </div>
          </div>
          <COS_Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
            className="shadow-xl shadow-primary-500/20"
          >
            Add Nexus
          </COS_Button>
        </div>
      </div>

      {/* --- Control Bar --- */}
      <div className="glass p-4 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={20} />
          <input
            type="text"
            placeholder="Search by region, country code, or tax type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-black rounded-[2rem] border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm font-bold transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {['All', 'Active', 'Review', 'Inactive'].map(filter => (
            <button key={filter} className="px-6 py-3 bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-white dark:hover:bg-zinc-800 transition-all border dark:border-white/5">{filter}</button>
          ))}
          <button className="p-3 bg-slate-100 dark:bg-zinc-900 text-slate-500 rounded-2xl border dark:border-white/5 hover:text-primary-500">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* --- Main Grid View --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRules.map((rule, i) => (
            <motion.div
              key={rule.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedRule(rule); setIsEditMode(false); }}
              className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 group relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all hover:border-indigo-500/30"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-center text-indigo-500 border dark:border-indigo-500/20 group-hover:scale-110 transition-transform shadow-inner">
                  <Globe size={28} />
                </div>
                <COS_Badge sentiment={getStatusColor(rule.status)}>{rule.status}</COS_Badge>
              </div>

              <div className="space-y-2 mb-8">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> {rule.countryCode}
                </div>
                <h3 className="text-xl font-bold dark:text-white truncate pr-2">{rule.region}</h3>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-900 text-[10px] font-bold text-slate-500">{rule.type}</div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border dark:border-zinc-800/50">
                <div>
                  <div className="text-2xl font-display font-black text-primary-500 tracking-tighter">
                    {rule.rate}%
                  </div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rate</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black dark:text-white tracking-tight">
                    ${(rule.totalCollected / 1000).toFixed(1)}k
                  </div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Collected</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                  <History size={12} />
                  <span>{rule.lastUpdated}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                  <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State Add Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddModalOpen(true)}
          className="p-8 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 group hover:border-primary-500/50 hover:bg-primary-500/5 transition-all text-slate-400 hover:text-primary-500 min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">New Jurisdiction</span>
        </motion.button>
      </div>

      {/* --- Detail Drawer --- */}
      <AnimatePresence>
        {selectedRule && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRule(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white dark:bg-[#080808] z-[1010] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b dark:border-zinc-900 bg-white/50 dark:bg-black/50 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-inner text-xl">
                    <Settings size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black dark:text-white">Rule Forensics</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nexus ID: {selectedRule.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <COS_Button size="sm" variant="success" icon={Save} onClick={handleUpdateRule}>Save</COS_Button>
                  ) : (
                    <COS_Button size="sm" variant="secondary" icon={Edit3} onClick={() => setIsEditMode(true)}>Edit</COS_Button>
                  )}
                  <button onClick={() => setSelectedRule(null)} className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-red-500 transition-colors ml-2">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 hide-scrollbar space-y-10">
                <div className="p-10 rounded-[2.5rem] bg-indigo-900 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">Nexus Location</div>
                        <div className="text-3xl font-display font-black tracking-tighter">{selectedRule.region}</div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 bg-white/10`}>
                        {selectedRule.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Tax Engine</div>
                        {isEditMode ? (
                          <select
                            value={selectedRule.type}
                            onChange={e => setSelectedRule({ ...selectedRule, type: e.target.value as TaxType })}
                            className="w-full bg-indigo-800/50 border border-indigo-400/30 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none"
                          >
                            <option>VAT</option><option>Sales Tax</option><option>GST</option><option>HST</option>
                          </select>
                        ) : (
                          <div className="text-sm font-bold truncate flex items-center gap-2"><Landmark size={14} className="text-indigo-200" /> {selectedRule.type}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Authority rate</div>
                        {isEditMode ? (
                          <input
                            type="number"
                            value={selectedRule.rate}
                            onChange={e => setSelectedRule({ ...selectedRule, rate: parseFloat(e.target.value) })}
                            className="w-24 bg-indigo-800/50 border border-indigo-400/30 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none"
                          />
                        ) : (
                          <div className="text-sm font-bold flex items-center gap-2"><Percent size={14} className="text-indigo-200" /> {selectedRule.rate}%</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 p-8 opacity-10">
                    <Scale size={200} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Regulatory Intelligence</h5>
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 space-y-6">
                    <div className="flex justify-between items-center group">
                      <span className="text-xs font-medium text-slate-500">Threshold Monitoring</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-black text-emerald-500">Compliant</span>
                      </div>
                    </div>
                    <div className="w-full h-px bg-slate-200 dark:bg-zinc-900" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Reporting Frequency</span>
                      <span className="text-sm font-black dark:text-white uppercase tracking-widest">Quarterly</span>
                    </div>
                    <div className="w-full h-px bg-slate-200 dark:bg-zinc-900" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Last Transmission</span>
                      <span className="text-sm font-black text-slate-500 font-mono">{selectedRule.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {selectedRule.status === 'review-required' && (
                  <div className="p-8 rounded-[3rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-4 animate-pulse">
                    <AlertCircle className="text-amber-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h6 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">Protocol Review Triggered</h6>
                      <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">The tax rate for this jurisdiction has been marked for manual review due to a detected legislative update.</p>
                      <button className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-amber-600 transition-colors">Acknowledge Update</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t dark:border-zinc-900 bg-white/50 dark:bg-black/50 backdrop-blur-md flex gap-4 shrink-0">
                {!isEditMode && (
                  <button
                    onClick={() => handleDeleteRule(selectedRule.id)}
                    className="w-full py-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-red-500 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-3 group"
                  >
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform" /> Dissolve Jurisdiction
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Add Modal --- */}
      <COS_Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Jurisdiction">
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 flex items-start gap-4">
            <Globe size={24} className="text-indigo-500 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">Global Nexus Detection</h4>
              <p className="text-xs text-indigo-700/70 dark:text-indigo-300/70 leading-relaxed">Establish a new fiscal collection point. Changes will propagate to the checkout engine immediately.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <COS_Input
              label="Region Name"
              placeholder="e.g. California"
              value={formData.region}
              onChange={e => setFormData({ ...formData, region: e.target.value })}
              icon={MapPin}
            />
            <COS_Input
              label="Country ISO"
              placeholder="e.g. US-CA"
              value={formData.countryCode}
              onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
              icon={Globe}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tax Protocol</label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as TaxType })}
                  className="w-full px-6 py-5 rounded-[1.5rem] bg-white dark:bg-black border-2 border-slate-100 dark:border-zinc-900 appearance-none text-sm font-bold outline-none focus:border-indigo-500 dark:text-white transition-all shadow-sm"
                >
                  <option>VAT</option>
                  <option>Sales Tax</option>
                  <option>GST</option>
                  <option>Service Tax</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
            <COS_Input
              label="Statutory Rate (%)"
              type="number"
              placeholder="0.00"
              value={formData.rate}
              onChange={e => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
              icon={Percent}
            />
          </div>

          <div className="pt-6 border-t dark:border-zinc-900">
            <COS_Button isFullWidth size="lg" onClick={handleAddRule} icon={Check}>Initialize Nexus</COS_Button>
          </div>
        </div>
      </COS_Modal>
    </div>
  );
};

export default TaxManagement;