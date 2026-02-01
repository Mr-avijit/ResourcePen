import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Download, ExternalLink,
    ChevronDown, CheckCircle2, Clock, AlertCircle,
    FileText, Package, CreditCard, RefreshCcw
} from 'lucide-react';

const MOCK_ORDERS = [
    { id: 'ORD-7241', date: 'Oct 24, 2024', amount: 149.00, status: 'completed', items: ['Horizon Dashboard Pro'], invoice: 'INV-001' },
    { id: 'ORD-7240', date: 'Oct 22, 2024', amount: 49.00, status: 'processing', items: ['UI Kit - Basic'], invoice: 'INV-002' },
    { id: 'ORD-7199', date: 'Sep 15, 2024', amount: 299.00, status: 'completed', items: ['Enterprise License', 'Priority Support'], invoice: 'INV-003' },
    { id: 'ORD-7012', date: 'Aug 02, 2024', amount: 89.00, status: 'refunded', items: ['Mobile Starter Kit'], invoice: 'INV-004' },
];

const UserOrders: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredOrders = MOCK_ORDERS.filter(order => {
        if (filter !== 'all' && order.status !== filter) return false;
        if (search && !order.id.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'processing': return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
            case 'refunded': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
            default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={14} />;
            case 'processing': return <RefreshCcw size={14} className="animate-spin" />;
            case 'refunded': return <AlertCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest">Secure Ledger</span>
                    </div>
                    <h1 className="text-4xl font-display font-black dark:text-white tracking-tight">Acquisitions</h1>
                </div>

                <div className="flex gap-4">
                    {/* Search & Filter */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search transaction ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500/20 w-64 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500/20 transition-all cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {filteredOrders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden hover:border-sky-500/30 transition-all"
                        >
                            {/* Header Row */}
                            <div
                                className="p-6 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer"
                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(order.status)}`}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black dark:text-white font-mono">{order.id}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{order.date}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 justify-between md:justify-end flex-1">
                                    <div className="text-right">
                                        <div className="text-sm font-black dark:text-white">${order.amount.toFixed(2)}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</div>
                                    </div>

                                    <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>

                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${expandedId === order.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Expando Detail */}
                            <motion.div
                                initial={false}
                                animate={{ height: expandedId === order.id ? 'auto' : 0 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-6 pt-0 border-t border-slate-100 dark:border-zinc-800/50">
                                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Included Assets</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800">
                                                        <div className="p-1.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400">
                                                            <FileText size={12} />
                                                        </div>
                                                        <span className="text-xs font-bold dark:text-slate-200">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Method</h4>
                                                <div className="flex items-center gap-3">
                                                    <CreditCard size={16} className="text-slate-400" />
                                                    <span className="text-sm font-bold dark:text-white">Visa ending in 4242</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mt-8">
                                                <button className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                                                    <ExternalLink size={14} /> View Invoice
                                                </button>
                                                <button className="flex-1 py-3 rounded-xl bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20">
                                                    <Download size={14} /> Download Assets
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserOrders;
