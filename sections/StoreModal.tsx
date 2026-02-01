
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ShoppingCart, Eye, Star, Zap, ArrowRight, Filter, X,
    LayoutGrid, List as ListIcon, SlidersHorizontal, Package,
    Shield, Cpu, Disc, Database, Terminal, ChevronDown, Check
} from 'lucide-react';
import { Product } from '../types';
import { MockApiService } from '../MockApiService';
import Navbar from '../components/Navbar';
import CartPanel from '../components/CartPanel';
import { useCart, useNavigation, useTheme, useAuth } from '../store';
import { COS_Spinner, COS_Button } from '../components/COS_Library';

interface StoreProps {
    onSelectProduct: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onClose: () => void;
}

const StoreModal: React.FC<StoreProps> = ({ onSelectProduct, onAddToCart, onClose }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState(['All']);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');

    // Store hooks for Navbar functionality
    const { cart: items, removeFromCart, updateQuantity } = useCart();
    const navigation = useNavigation();
    const themeContext = useTheme();
    const authContext = useAuth();

    // Mock handler for checkout
    const handleCheckout = async () => {
        if (navigation) {
            navigation.navigate('checkout');
        }
        setIsCartOpen(false);
        onClose();
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await MockApiService.getProjects();
                setProducts(data);
                const uniqueCats = ['All', ...new Set(data.filter(p => p.category).map(p => p.category))];
                setCategories(uniqueCats);
            } catch (err) {
                console.error("Store error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = products.filter(p =>
        (filter === 'All' || p.category === filter) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0; // Default (mock data order)
    });

    return (
        <div className="fixed inset-0 z-[2000] bg-zinc-950 flex flex-col font-sans text-slate-100 animate-in fade-in duration-300">
            {/* 1. TOP NAV / SYSTEM HEADER */}
            <div className="relative z-50">
                <Navbar
                    onNavigateHome={() => onClose()}
                    onCartClick={() => setIsCartOpen(true)}
                    theme={'dark'} // Force dark for this module
                    toggleTheme={() => { }}
                    user={authContext?.user || null}
                    cartCount={items?.length || 0}
                    onOpenCart={() => setIsCartOpen(true)}
                    onNavigateDashboard={() => {
                        if (authContext?.role === 'admin') navigation?.navigate('admin-dashboard');
                        else navigation?.navigate('user-dashboard');
                    }}
                    openAuth={() => { }}
                />
            </div>

            <div className="flex-1 flex overflow-hidden pt-20 max-w-[1920px] w-full mx-auto">
                {/* 2. SIDEBAR - FILTER TERMINAL */}
                <aside className="w-80 hidden xl:flex flex-col bg-[#09090b] border-r border-zinc-800 h-full overflow-hidden shrink-0">
                    <div className="p-6 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-500 border border-primary-500/20">
                                <Terminal size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-display font-black uppercase tracking-tight text-white">Query Parameters</h3>
                                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Filter Matrix Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Categories Group */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 pl-1">Primary Index</h4>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-between group ${filter === cat
                                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${filter === cat ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700 group-hover:bg-slate-500'}`} />
                                            {cat}
                                        </div>
                                        {filter === cat && <ChevronDown size={14} className="-rotate-90 text-cyan-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Simulation */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Value Delta</h4>
                            <div className="px-4 py-6 bg-black/40 rounded-xl border border-white/10">
                                <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
                                    <span>$0.00</span>
                                    <span>$5,000.00</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-cyan-600 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-zinc-800">
                        <button onClick={onClose} className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-950/20 hover:text-red-500 hover:border-red-900/50 transition-all flex items-center justify-center gap-2">
                            <X size={14} /> Abort Sequence
                        </button>
                    </div>
                </aside>

                {/* 3. MAIN DEPOT AREA */}
                <main className="flex-1 flex flex-col bg-black relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                    {/* Toolbar */}
                    <header className="px-8 py-6 flex flex-col gap-6 md:flex-row md:items-center justify-between z-10 sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
                        {/* Mobile Filter Toggle */}
                        <div className="xl:hidden">
                            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                                {categories.map(cat => (
                                    <button
                                        key={cat} onClick={() => setFilter(cat)}
                                        className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest whitespace-nowrap border ${filter === cat ? 'bg-primary-600 border-primary-600 text-white' : 'border-zinc-800 text-zinc-500'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Module */}
                        <div className="flex-1 max-w-xl relative group">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <div className="relative flex items-center bg-black/50 border border-white/10 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500/50 focus-within:border-cyan-500/50 transition-all backdrop-blur-sm">
                                <Search className="ml-4 text-slate-500 group-focus-within:text-cyan-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="SEARCH ASSET DATABASE..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent border-none py-3 px-4 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:ring-0"
                                />
                                <div className="px-3 border-l border-white/10 text-[10px] font-black text-slate-600 uppercase">CMD+K</div>
                            </div>
                        </div>

                        {/* View Controls */}
                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase rounded-lg px-3 py-2 outline-none focus:border-primary-500"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-asc">Price &uarr;</option>
                                <option value="price-desc">Price &darr;</option>
                            </select>

                            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <ListIcon size={16} />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Content Grid */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <COS_Spinner size={64} />
                                <div className="mt-8 font-mono text-xs text-primary-500 animate-pulse">DECRYPTING ASSET MANIFEST...</div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <Package size={64} className="text-zinc-700 mb-4" />
                                <h3 className="text-xl font-display font-black uppercase text-zinc-500">Sector Empty</h3>
                                <p className="font-mono text-xs text-zinc-600">No assets match current query parameters.</p>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4' : 'grid-cols-1'}`}>
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map((product, i) => (
                                        <motion.div
                                            layout
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`group relative bg-zinc-900/40 rounded-xl border border-zinc-800 overflow-hidden hover:border-primary-500/50 hover:bg-zinc-900/80 transition-all duration-300 ${viewMode === 'list' ? 'flex flex-row h-48' : 'flex flex-col'}`}
                                        >
                                            {/* Top Status Bar (Grid Only) */}
                                            {viewMode === 'grid' && (
                                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}

                                            {/* Image Section */}
                                            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 border-r border-zinc-800' : 'aspect-video border-b border-zinc-800'}`}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                                                {/* Holographic Badge */}
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    <div className="px-2 py-1 bg-black/60 backdrop-blur border border-white/10 rounded text-[9px] font-black uppercase tracking-widest text-white">
                                                        {product.category}
                                                    </div>
                                                    {product.price === 0 && (
                                                        <div className="px-2 py-1 bg-emerald-500/20 backdrop-blur border border-emerald-500/30 rounded text-[9px] font-black uppercase tracking-widest text-emerald-400">
                                                            Open Source
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quick Actions Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                                    <button onClick={() => onSelectProduct(product)} className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded hover:scale-105 transition-transform">
                                                        View Specs
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Data Block */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-200 group-hover:text-primary-400 transition-colors line-clamp-1">{product.name}</h3>
                                                    <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                                                        <Cpu size={12} /> v2.4
                                                    </div>
                                                </div>

                                                <p className="text-xs text-zinc-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                                                    {product.description || "No tactical description available for this asset."}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between">
                                                    <div className="font-mono text-lg font-bold text-white">
                                                        {product.price > 0 ? `$${product.price}` : 'FREE'}
                                                    </div>

                                                    <button
                                                        onClick={() => onAddToCart(product)}
                                                        className="px-4 py-2 bg-zinc-800 hover:bg-primary-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn"
                                                    >
                                                        <ShoppingCart size={14} className="group-hover/btn:animate-bounce" />
                                                        Deploy
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Cart Integration */}
            <CartPanel
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={items}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default StoreModal;
