
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Eye, GraduationCap, Download, RefreshCcw, Star, Zap, ArrowRight, Store } from 'lucide-react';
import { Product } from '../types';
import { MockApiService } from '../MockApiService';
import { COS_Spinner, COS_Badge } from '../components/COS_Library';
import StoreModal from './StoreModal';

interface ProductsProps {
  onSelectProduct: (product: Product) => void;
  onPreviewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ onSelectProduct, onPreviewProduct, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(['All']);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await MockApiService.getProjects();
        setProducts(data);
        const uniqueCats = ['All', ...new Set(data.map(p => p.category))];
        setCategories(uniqueCats);
      } catch (err) {
        console.error("Discovery error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(p =>
    (filter === 'All' || p.category === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section id="products" className="py-32 bg-slate-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600/10 text-primary-600 rounded-xl text-[11px] font-black uppercase mb-8 tracking-[0.2em] border border-primary-500/20 shadow-sm">
            <Zap size={14} className="fill-current" /> Premium Registry
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-black mb-6 dark:text-white tracking-tighter leading-none"
          >
            Digital Asset Nexus
          </motion.h2>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium max-w-2xl mx-auto mb-8">Acquire high-fidelity architectural blueprints and premium production codebases.</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsStoreOpen(true)}
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold shadow-2xl hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
          >
            <Store size={20} /> Access Full Store
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filter === cat
                  ? 'bg-primary-600 text-white border-primary-600 shadow-2xl shadow-primary-600/30'
                  : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-500 border-slate-100 dark:border-white/5 shadow-sm hover:border-primary-500/30'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search registry nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 outline-none text-sm shadow-xl focus:ring-2 focus:ring-primary-500/20 dark:text-white transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center opacity-40">
            <COS_Spinner size={56} />
            <p className="mt-6 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Manifest...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                <div className="aspect-[4/3] bg-slate-100 dark:bg-zinc-950 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Floating Action Bar */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <button onClick={() => onSelectProduct(product)} className="flex-1 bg-white/90 dark:bg-black/90 backdrop-blur-md text-xs font-bold py-3 rounded-xl hover:bg-white dark:hover:bg-black transition-colors shadow-lg mr-2">Quick View</button>
                    <button onClick={() => onAddToCart(product)} className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 hover:bg-primary-500 transition-colors">
                      <ShoppingCart size={16} />
                    </button>
                  </div>

                  {product.isBestSeller && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">Bestseller</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/10 px-2 py-1 rounded-md">{product.category}</span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={12} className="fill-current" />
                        <span className="text-xs font-bold">{product.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold dark:text-white leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">{product.name}</h3>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">License</span>
                      <span className="font-display font-black text-xl dark:text-white">${product.price}</span>
                    </div>
                    <button className="text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                      Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="py-32 text-center opacity-30">
            <RefreshCcw size={64} className="mx-auto mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-widest">Registry mismatch</h3>
            <p className="text-sm mt-2">No assets found matching current filtration protocols.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isStoreOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[2000]"
          >
            <StoreModal
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onClose={() => setIsStoreOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Products;
