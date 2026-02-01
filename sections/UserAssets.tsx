import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Download, ExternalLink,
    Box, Layers, Grid, List, Star,
    Cpu, Database, Layout, Shield, Zap
} from 'lucide-react';

const MOCK_ASSETS = [
    { id: 1, name: 'Horizon Dashboard OS', version: '2.4.0', type: 'Design System', category: 'UI Kit', size: '142 MB', rating: 5, image: '1614064641938-3bcee529cf91' },
    { id: 2, name: 'EcoShop E-Commerce', version: '1.2.1', type: 'Full Stack', category: 'Template', size: '89 MB', rating: 4, image: '1635070041078-e363dbe005cb' },
    { id: 3, name: 'FinTech Viz Library', version: '3.0.0', type: 'Component Lib', category: 'Charts', size: '45 MB', rating: 5, image: '1551288049-bebda4e38f71' },
    { id: 4, name: 'CyberAuth Identity', version: '1.0.5', type: 'Backend Module', category: 'Security', size: '12 MB', rating: 5, image: '1550745165-9cc0b441f37e' },
];

const UserAssets: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest">Digital Vault</span>
                    </div>
                    <h1 className="text-4xl font-display font-black dark:text-white tracking-tight">Asset Library</h1>
                </div>

                <div className="flex gap-4">
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold outline-none focus:ring-2 focus:ring-sky-500/20 w-64 transition-all"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 shadow-sm text-sky-500' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 shadow-sm text-sky-500' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {['All', 'UI Kits', 'Templates', 'Security', 'Data Viz', '3D Models'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat
                                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:border-sky-500/30 hover:text-sky-500'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {MOCK_ASSETS.map((asset, i) => (
                    viewMode === 'grid' ? (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-sky-500/10 hover:border-sky-500/30 transition-all duration-300"
                        >
                            {/* Image Area */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-zinc-950">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60" />
                                <img
                                    src={`https://images.unsplash.com/photo-${asset.image}?w=800&auto=format&fit=crop&q=60`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={asset.name}
                                />
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                                        <Box size={16} />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded bg-sky-500 text-white text-[9px] font-black uppercase tracking-widest">v{asset.version}</span>
                                        <span className="px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest">{asset.size}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold dark:text-white mb-1 line-clamp-1">{asset.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                                    <span className="font-medium">{asset.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <div className="flex items-center gap-0.5 text-amber-500">
                                        <Star size={10} fill="currentColor" /> {asset.rating}.0
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                                        Details
                                    </button>
                                    <button className="py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        <Download size={14} /> Get
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group flex flex-col md:flex-row md:items-center gap-6 p-4 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-sky-500/30 transition-all"
                        >
                            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-zinc-950 overflow-hidden shrink-0">
                                <img src={`https://images.unsplash.com/photo-${asset.image}?w=200&auto=format&fit=crop&q=60`} className="w-full h-full object-cover" alt="" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-black dark:text-white mb-1">{asset.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[10px] font-bold uppercase">{asset.category}</span>
                                    <span>v{asset.version}</span>
                                    <span>• {asset.size}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <button className="p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors">
                                    <ExternalLink size={18} />
                                </button>
                                <button className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2">
                                    <Download size={14} /> Download
                                </button>
                            </div>
                        </motion.div>
                    )
                ))}
            </div>
        </div>
    );
};

export default UserAssets;
