import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Smartphone, Database, Code, Shield, Globe, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigation, useCart } from '../store';
import StoreModal from './StoreModal';

const CATEGORIES = [
    { id: 'cat-saas', label: 'SaaS Architecture', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10', count: 124 },
    { id: 'cat-mobile', label: 'Mobile Ecosystems', icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-500/10', count: 85 },
    { id: 'cat-backend', label: 'Backend Nodes', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10', count: 42 },
    { id: 'cat-web3', label: 'Web3 Protocols', icon: Globe, color: 'text-purple-500', bg: 'bg-purple-500/10', count: 18 },
    { id: 'cat-security', label: 'Security Core', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-500/10', count: 29 },
    { id: 'cat-devtools', label: 'Dev Infrastructure', icon: Code, color: 'text-amber-500', bg: 'bg-amber-500/10', count: 56 },
];

const Categories: React.FC = () => {
    const { navigate } = useNavigation();
    const { addToCart } = useCart();
    const [isStoreOpen, setIsStoreOpen] = useState(false);

    return (
        <section className="py-24 bg-slate-50/50 dark:bg-black relative overflow-hidden">
            {/* Soft Divider */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Centered Soft Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-white/5">
                            Browse by Sector
                        </h3>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight"
                    >
                        Exploration Nodes
                    </motion.h2>
                </div>

                {/* Soft Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            onClick={() => setIsStoreOpen(true)}
                            className="group cursor-pointer relative"
                        >
                            <div className="h-full bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:-translate-y-1 relative overflow-hidden flex items-center gap-6">

                                {/* Icon */}
                                <div className={`w-16 h-16 shrink-0 rounded-[1.5rem] ${cat.bg} ${cat.color} flex items-center justify-center text-current shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                    <cat.icon size={32} className="stroke-[1.5]" />
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors mb-1">{cat.label}</h4>
                                    <p className="text-sm font-medium text-slate-400 group-hover:text-slate-500 dark:group-hover:text-zinc-400 transition-colors">
                                        {cat.count} Processed Nodes
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary-600 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                                    <ArrowRight size={18} />
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Action */}
                <div className="mt-16 text-center">
                    <motion.button
                        onClick={() => setIsStoreOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-full shadow-2xl hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                    >
                        View All Categories <ArrowRight size={20} />
                    </motion.button>
                </div>

            </div>

            {/* Store Modal Overlay */}
            <AnimatePresence>
                {isStoreOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm"
                    >
                        <StoreModal
                            onClose={() => setIsStoreOpen(false)}
                            onSelectProduct={(p) => {
                                setIsStoreOpen(false);
                                navigate('product-detail', p);
                            }}
                            onAddToCart={addToCart}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Categories;
