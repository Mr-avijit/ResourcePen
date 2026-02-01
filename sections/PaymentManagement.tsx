import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, CreditCard, ArrowUpRight, ArrowDownLeft, 
  Search, Filter, Download, MoreHorizontal, Eye, 
  RotateCcw, ShieldCheck, CheckCircle2, XCircle, 
  Clock, FileText, Share2, FilterX, ChevronRight, 
  ExternalLink, Wallet, Globe, Info, RefreshCcw,
  Plus, History, BarChart3, TrendingUp, AlertCircle,
  X, Mail, User, Briefcase, Printer, Lock
} from 'lucide-react';

// --- Types ---
type PaymentStatus = 'successful' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'Visa •••• 4242' | 'Mastercard •••• 8812' | 'Ethereum' | 'PayPal';

interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  projectName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  date: string;
  time: string;
  fee: number;
}

// --- Mock Data ---
const MOCK_PAYMENTS: Transaction[] = [
  { id: 'TRX-99021', customerName: 'Jonathan Wick', customerEmail: 'j.wick@continental.com', projectName: 'Horizon Dashboard Pro', amount: 149.00, currency: 'USD', status: 'successful', method: 'Visa •••• 4242', date: 'Oct 24, 2024', time: '14:22:10', fee: 4.47 },
  { id: 'TRX-99020', customerName: 'Sarah Connor', customerEmail: 's.connor@cyberdyne.io', projectName: 'CryptoNext Pro', amount: 1240.00, currency: 'USD', status: 'pending', method: 'Ethereum', date: 'Oct 24, 2024', time: '13:05:44', fee: 12.00 },
  { id: 'TRX-99019', customerName: 'Bruce Wayne', customerEmail: 'b.wayne@waynecorp.com', projectName: 'EcoShop Kit', amount: 79.00, currency: 'USD', status: 'failed', method: 'Mastercard •••• 8812', date: 'Oct 23, 2024', time: '10:15:22', fee: 0.00 },
  { id: 'TRX-99018', customerName: 'Peter Parker', customerEmail: 'p.parker@dailybugle.com', projectName: 'Nexus Portfolio', amount: 59.00, currency: 'USD', status: 'refunded', method: 'PayPal', date: 'Oct 22, 2024', time: '18:30:00', fee: 1.77 },
  { id: 'TRX-99017', customerName: 'Diana Prince', customerEmail: 'diana@themyscira.gov', projectName: 'Horizon Dashboard Pro', amount: 149.00, currency: 'USD', status: 'successful', method: 'Visa •••• 4242', date: 'Oct 21, 2024', time: '09:12:33', fee: 4.47 },
];

const PaymentManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Logic ---
  const filteredTx = useMemo(() => {
    return MOCK_PAYMENTS.filter(tx => {
      const matchesSearch = (tx.customerName + tx.projectName + tx.id).toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const successful = MOCK_PAYMENTS.filter(tx => tx.status === 'successful').reduce((acc, tx) => acc + tx.amount, 0);
    const pending = MOCK_PAYMENTS.filter(tx => tx.status === 'pending').length;
    return { successful, pending };
  }, []);

  // --- Styles ---
  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case 'successful': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'refunded': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return '';
    }
  };

  const handleRefundInitiation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowRefundModal(false);
      setSelectedTx(null);
      // In real app, update state here
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Fintech Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Financial Treasury
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={16} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mt-1">Audit, reconcile, and manage platform architectural revenue flows.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 border dark:border-white/5">
             <div className="px-4 py-2 flex flex-col">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Volume</span>
               <span className="text-sm font-black dark:text-white">${stats.successful.toLocaleString()}</span>
             </div>
             <div className="w-px h-8 self-center bg-slate-200 dark:bg-zinc-800" />
             <div className="px-4 py-2 flex flex-col">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">In Triage</span>
               <span className="text-sm font-black text-amber-500">{stats.pending} Tx</span>
             </div>
          </div>
          <button className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all flex items-center gap-2">
            <Download size={16} /> Settlement Report
          </button>
        </div>
      </div>

      {/* --- Control Bar --- */}
      <div className="glass p-4 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by TxID, customer name or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all dark:text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-xs font-bold focus:ring-2 focus:ring-primary-500/20 outline-none dark:text-white cursor-pointer"
          >
            <option value="all">Lifecycle: All</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-slate-400 hover:text-primary-500 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* --- Transaction Ledger --- */}
      <div className="glass rounded-[3rem] border border-slate-200 dark:border-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-900/30 border-b dark:border-zinc-900">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Protocol ID</th>
                <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Architect / Project</th>
                <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Amount</th>
                <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Method</th>
                <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest text-center">Status</th>
                <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest text-right px-8">Analysis Time</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-900/50">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Wallet size={48} />
                      <p className="font-bold">No transactions found in this temporal segment.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
                  <motion.tr 
                    key={tx.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedTx(tx)}
                    className="group hover:bg-slate-50 dark:hover:bg-zinc-900/20 cursor-pointer transition-all"
                  >
                    <td className="px-8 py-5">
                      <div className="font-mono text-xs font-black dark:text-zinc-500 group-hover:text-primary-500 transition-colors">{tx.id}</div>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-xs text-primary-500">
                          {tx.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold dark:text-white">{tx.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{tx.projectName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="text-sm font-black dark:text-white font-mono">${tx.amount.toFixed(2)}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{tx.currency}</div>
                    </td>
                    <td className="py-5">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
                         {tx.method.includes('Visa') || tx.method.includes('Mastercard') ? <CreditCard size={14} /> : tx.method === 'Ethereum' ? <Globe size={14} /> : <ArrowUpRight size={14} />}
                         {tx.method}
                       </div>
                    </td>
                    <td className="py-5 text-center">
                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(tx.status)}`}>
                         {tx.status}
                       </span>
                    </td>
                    <td className="py-5 text-right px-8">
                       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{tx.date}</div>
                       <div className="text-[9px] text-slate-500 font-medium">{tx.time}</div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Detail Drawer --- */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTx(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white dark:bg-[#080808] z-[1010] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-8 flex items-center justify-between border-b dark:border-zinc-900 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                     <FileText size={24} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-display font-black dark:text-white">Tx Forensics</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">{selectedTx.id}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-10 hide-scrollbar space-y-10">
                {/* Visual Receipt */}
                <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Settlement Amount</div>
                          <div className="text-4xl font-display font-black tracking-tighter">${selectedTx.amount.toFixed(2)}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedTx.status)}`}>
                          {selectedTx.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                         <div>
                           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Architect</div>
                           <div className="text-sm font-bold truncate">{selectedTx.customerName}</div>
                         </div>
                         <div>
                           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Method</div>
                           <div className="text-sm font-bold flex items-center gap-2"><CreditCard size={14} className="text-primary-500" /> Visa</div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 p-8 opacity-5">
                      <DollarSign size={200} />
                   </div>
                </div>

                {/* Ledger Breakdown */}
                <div className="space-y-6">
                   <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 ml-1">Reconciliation Matrix</h5>
                   <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">Gross Payload</span>
                        <span className="text-sm font-black dark:text-white font-mono">${selectedTx.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2">Platform Engine Fee <Info size={12} className="text-slate-400" /></span>
                        <span className="text-sm font-black text-red-500 font-mono">-${selectedTx.fee.toFixed(2)}</span>
                      </div>
                      <div className="pt-4 border-t dark:border-zinc-900 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Net Settlement</span>
                        <span className="text-lg font-black text-emerald-500 font-mono">${(selectedTx.amount - selectedTx.fee).toFixed(2)}</span>
                      </div>
                   </div>
                </div>

                {/* Customer Identity */}
                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-100 dark:border-zinc-900 shadow-sm">
                   <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-primary-600/10 text-primary-500 flex items-center justify-center text-2xl font-black">
                        {selectedTx.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-black dark:text-white mb-1">{selectedTx.customerName}</h4>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-2"><Mail size={14} /> {selectedTx.customerEmail}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-primary-500/10 hover:text-primary-500 transition-all">
                        <User size={14} /> Member Profile
                      </button>
                      <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-primary-500/10 hover:text-primary-500 transition-all">
                        <History size={14} /> Purchase Logs
                      </button>
                   </div>
                </div>

                {/* Internal Compliance Info */}
                <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">
                     <Lock size={14} /> Compliance Payload
                   </div>
                   <div className="font-mono text-[10px] text-slate-500 break-all leading-relaxed">
                     IP: 192.168.1.1 | Fingerprint: 8a3f...d9c2 | Provider: Stripe_v3.1 | AuthCode: 299302
                   </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/50 backdrop-blur-md flex gap-4">
                <button 
                  onClick={() => setShowRefundModal(true)}
                  className="flex-1 py-5 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-3xl font-black uppercase tracking-widest text-xs border dark:border-zinc-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center gap-3"
                >
                  <RotateCcw size={18} /> Initialize Refund
                </button>
                <button className="p-5 bg-primary-600 text-white rounded-3xl shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all">
                  <Download size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Refund Modal --- */}
      <AnimatePresence>
        {showRefundModal && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRefundModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-black rounded-[3rem] p-10 overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <RotateCcw size={40} />
                </div>
                <h3 className="text-2xl font-display font-black dark:text-white mb-2">Reverse Transaction?</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-500 leading-relaxed">
                  You are initiating a full reversal of <b className="dark:text-white">${selectedTx?.amount.toFixed(2)}</b> for <b className="dark:text-white">{selectedTx?.customerName}</b>. This process is irreversible once finalized.
                </p>
              </div>

              <div className="space-y-6 mb-10">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reversal Reason</label>
                   <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-xs font-bold focus:ring-2 focus:ring-red-500 transition-all outline-none cursor-pointer dark:text-white">
                      <option>Architect requested refund</option>
                      <option>Duplicate transaction protocol</option>
                      <option>System anomaly / Error</option>
                      <option>Fraud detection override</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Architect Notification</label>
                   <textarea rows={3} placeholder="Add a personal note to the architect (optional)..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-xs font-bold focus:ring-2 focus:ring-red-500 transition-all outline-none dark:text-white" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowRefundModal(false)} className="py-4 bg-slate-100 dark:bg-zinc-900 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-200 transition-all">Abort Protocol</button>
                <button 
                  onClick={handleRefundInitiation}
                  disabled={isProcessing}
                  className="py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-500 transition-all disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCcw className="animate-spin mx-auto" size={16} /> : 'Finalize Reversal'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentManagement;