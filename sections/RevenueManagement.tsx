import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Calendar,
  Download, ArrowUpRight, ArrowDownRight, BarChart3,
  Zap, PieChart, RefreshCcw, Info, ExternalLink,
  ChevronRight, CreditCard, Wallet, Banknote,
  Target, Sparkles, Filter, MoreHorizontal,
  Layers, Database, ShieldCheck, Activity,
  Landmark, ArrowRightLeft, History, FileCheck,
  Building, Globe, Briefcase, CheckCircle2, AlertCircle,
  Plus, Search, ArrowUp, ArrowDown
} from 'lucide-react';
import { COS_Button, COS_Badge, COS_Input, COS_Modal, COS_DataGrid, COS_StatCard, COS_ToastContainer } from '../components/COS_Library';

// --- Types & Mock Data ---

type TransactionType = 'credit' | 'debit';
type TransactionStatus = 'completed' | 'pending' | 'failed';
type TransactionCategory = 'Sale' | 'Payout' | 'Refund' | 'Subscription' | 'Service Fee';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: TransactionCategory;
  recipient?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-8842', date: '2024-10-24', description: 'Enterprise License - Horizon UI', amount: 2450.00, type: 'credit', status: 'completed', category: 'Sale', recipient: 'Acme Corp' },
  { id: 'TXN-8841', date: '2024-10-23', description: 'Cloud Hosting Fees', amount: 124.50, type: 'debit', status: 'completed', category: 'Service Fee', recipient: 'AWS' },
  { id: 'TXN-8840', date: '2024-10-23', description: 'Affiliate Payout - Oct', amount: 850.00, type: 'debit', status: 'pending', category: 'Payout', recipient: 'Partner Network' },
  { id: 'TXN-8839', date: '2024-10-22', description: 'EcoShop Mobile Kit', amount: 89.00, type: 'credit', status: 'completed', category: 'Sale', recipient: 'User #921' },
  { id: 'TXN-8838', date: '2024-10-22', description: 'Refund - Order #221', amount: 49.00, type: 'debit', status: 'completed', category: 'Refund', recipient: 'User #884' },
  { id: 'TXN-8837', date: '2024-10-21', description: 'Consultation Retainer', amount: 1500.00, type: 'credit', status: 'completed', category: 'Subscription', recipient: 'TechFlow' },
  { id: 'TXN-8836', date: '2024-10-20', description: 'SaaS Starter Pack', amount: 129.00, type: 'credit', status: 'completed', category: 'Sale', recipient: 'User #880' },
  { id: 'TXN-8835', date: '2024-10-19', description: 'Server Maintenance', amount: 250.00, type: 'debit', status: 'completed', category: 'Service Fee', recipient: 'DevOps Inc' },
];

const ANALYTICS_DATA = [50, 70, 45, 90, 65, 80, 55, 75, 85, 95, 80, 92];

// --- Sub-components ---

const AnimatedMoney = ({ value, prefix = "$" }: { value: number, prefix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
};

const RevenueManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts' | 'settings'>('overview');
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = transactions.filter(t => t.type === 'credit').reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    return { totalRevenue, totalExpenses, netProfit };
  }, [transactions]);

  // Toast Helper
  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // --- Views ---

  const OverviewView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={120} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Banknote size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Revenue</span>
            </div>
            <div className="text-4xl font-display font-black dark:text-white mb-2 tracking-tight">
              <AnimatedMoney value={stats.totalRevenue} />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
              <ArrowUp size={12} /> +18.4% vs last month
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={120} className="text-amber-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <CreditCard size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Costs</span>
            </div>
            <div className="text-4xl font-display font-black dark:text-white mb-2 tracking-tight">
              <AnimatedMoney value={stats.totalExpenses} />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 w-fit px-2 py-1 rounded-lg">
              <ArrowUp size={12} /> +4.2% increased
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-slate-900 opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/20 text-white">
                <Wallet size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Net Profit</span>
            </div>
            <div className="text-4xl font-display font-black text-white mb-2 tracking-tight">
              <AnimatedMoney value={stats.netProfit} />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
              High Margin: 78%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <Activity size={20} className="text-primary-500" /> Cashflow Velocity
            </h3>
            <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-xl p-1">
              {['1W', '1M', '3M', '1Y'].map((p, i) => (
                <button key={p} className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${i === 1 ? 'bg-white dark:bg-zinc-800 shadow-sm text-primary-500' : 'text-slate-400'}`}>{p}</button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full flex items-end justify-between gap-2">
            {ANALYTICS_DATA.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative cursor-pointer">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05, duration: 1 }}
                  className="w-full bg-slate-100 dark:bg-zinc-900 rounded-t-xl group-hover:bg-primary-500 transition-colors relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <div className="absolute -top-8 bg-black text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  ${(h * 150).toLocaleString()}
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary-500 transition-colors">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold dark:text-white mb-8 flex items-center gap-2">
            <PieChart size={20} className="text-indigo-500" /> Revenue Sources
          </h3>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Product Sales', pct: 65, profit: '$540k', color: 'bg-indigo-500' },
              { label: 'Services', pct: 25, profit: '$210k', color: 'bg-emerald-500' },
              { label: 'Subscriptions', pct: 10, profit: '$82k', color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold dark:text-white">{item.label}</span>
                  <span className="text-xs font-black text-slate-500">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
                <div className="text-right mt-1 text-[10px] text-slate-400">{item.profit} YTD</div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t dark:border-zinc-900">
            <COS_Button isFullWidth variant="secondary" icon={Download}>Export Financial Report</COS_Button>
          </div>
        </div>
      </div>
    </div>
  );

  const TransactionsView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-[#0c0c0c] rounded-[3rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text" placeholder="Search transactions..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-zinc-900 rounded-2xl border-none outline-none text-sm font-bold dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-500 hover:text-primary-500 text-xs font-black uppercase tracking-wide transition-colors">Filter</button>
          <button className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-500 hover:text-primary-500 text-xs font-black uppercase tracking-wide transition-colors">Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-zinc-900 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="pb-4 pl-4">ID / Date</th>
              <th className="pb-4">Description</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Counterparty</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right pr-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-900">
            {transactions
              .filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.recipient?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((txn, i) => (
                <tr key={txn.id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="py-4 pl-4">
                    <div className="font-mono text-xs font-bold dark:text-white">{txn.id}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{txn.date}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm font-bold dark:text-zinc-300">{txn.description}</div>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-500">{txn.category}</span>
                  </td>
                  <td className="py-4 text-sm dark:text-zinc-400">{txn.recipient || '-'}</td>
                  <td className="py-4">
                    <COS_Badge sentiment={
                      txn.status === 'completed' ? 'success' :
                        txn.status === 'pending' ? 'warning' : 'danger'
                    }>{txn.status}</COS_Badge>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <span className={`text-sm font-black ${txn.type === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                      {txn.type === 'credit' ? '+' : '-'}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PayoutsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="md:col-span-2 p-10 rounded-[3rem] bg-gradient-to-r from-indigo-900 to-indigo-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Landmark size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-indigo-200 text-sm font-black uppercase tracking-widest mb-2">Available for Payout</div>
            <div className="text-6xl font-display font-black mb-4">$42,850.00</div>
            <p className="text-indigo-200 text-sm max-w-md opacity-80">Funds available for withdrawal to your connected bank account. Standard processing time is 1-3 business days.</p>
          </div>
          <COS_Button onClick={() => { setShowPayoutModal(true); }} size="xl" className="shadow-2xl shadow-black/20 bg-white text-indigo-900 hover:bg-indigo-50">Request Payout</COS_Button>
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
        <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
          <Building size={18} className="text-slate-400" /> Connected Accounts
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between group hover:border-indigo-500 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                <Landmark size={20} className="text-slate-500" />
              </div>
              <div>
                <div className="font-bold dark:text-white">Chase Business Checking</div>
                <div className="text-xs text-slate-500">**** 8842</div>
              </div>
            </div>
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Primary</div>
          </div>
          <COS_Button variant="secondary" isFullWidth icon={Plus}>Add Bank Account</COS_Button>
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
        <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
          <History size={18} className="text-slate-400" /> Recent Payouts
        </h3>
        <div className="space-y-4">
          {[
            { id: '1', date: 'Oct 15, 2024', amount: '$12,500.00', status: 'Settled' },
            { id: '2', date: 'Sep 15, 2024', amount: '$10,250.00', status: 'Settled' },
            { id: '3', date: 'Aug 15, 2024', amount: '$9,800.00', status: 'Settled' },
          ].map(p => (
            <div key={p.id} className="flex justify-between items-center py-2 border-b dark:border-zinc-900 last:border-0">
              <div>
                <div className="text-sm font-bold dark:text-white">{p.amount}</div>
                <div className="text-[10px] text-slate-400">{p.date}</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <CheckCircle2 size={12} className="text-emerald-500" /> {p.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 relative">
      <COS_ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Treasury Command
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Landmark size={24} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-2 max-w-2xl">
            Monitor liquidity, manage asset allocation, and control financial outflows for the enterprise.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-[#0c0c0c] p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 flex gap-1 shadow-sm overflow-x-auto hide-scrollbar">
          {['overview', 'transactions', 'payouts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'transactions' && <TransactionsView />}
        {activeTab === 'payouts' && <PayoutsView />}
      </div>

      {/* --- Payout Modal --- */}
      <COS_Modal isOpen={showPayoutModal} onClose={() => setShowPayoutModal(false)} title="Initiate Transfer">
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 flex items-start gap-4">
            <Info size={24} className="shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-bold">
              Transfers are processed via ACH or Wire depending on the amount. Please ensure the receiving account details are verified to avoid delays.
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount to Withdraw</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                <input
                  type="number" className="w-full pl-10 pr-6 py-5 bg-slate-50 dark:bg-zinc-900 rounded-3xl text-2xl font-black outline-none border-2 border-transparent focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="0.00" autoFocus
                />
              </div>
              <div className="text-[10px] font-bold text-slate-400 text-right">Max Available: $42,850.00</div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination Account</label>
              <select className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border-none outline-none text-sm font-bold dark:text-white appearance-none">
                <option>Chase Business Checking (**** 8842)</option>
                <option>Silicon Valley Bank (**** 9921)</option>
              </select>
            </div>
          </div>

          <COS_Button
            size="lg" isFullWidth icon={ArrowUpRight}
            onClick={() => {
              setShowPayoutModal(false);
              addToast('success', 'Transfer Initiated', 'Funds are being processed for payout.');
            }}
          >
            Confirm Withdrawal
          </COS_Button>
        </div>
      </COS_Modal>
    </div>
  );
};

export default RevenueManagement;