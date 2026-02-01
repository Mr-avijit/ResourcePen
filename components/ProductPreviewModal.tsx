
import React from 'react';
// Fix: Added motion type workaround for React 19 compatibility
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { X, Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductPreviewModalProps {
  product: Product;
  onClose: () => void;
  onViewDetails: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({ product, onClose, onViewDetails, onAddToCart }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 rounded-full glass hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square md:aspect-auto overflow-hidden">
            <img src={product.image} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">{product.category}</span>
              <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                <Star size={14} className="fill-current" /> 4.9
              </div>
            </div>
            <h2 className="text-3xl font-display font-extrabold mb-4 dark:text-white">{product.name}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {/* Fix: tech is an object, using tech.name as key and string content */}
              {product.techStack.slice(0, 3).map(tech => (
                <span key={tech.name} className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-semibold">{tech.name}</span>
              ))}
              {/* Fix: handled potential undefined techStack or slice logic */}
              <span className="text-slate-500 text-xs flex items-center">+{Math.max(0, (product.techStack?.length || 0) - 3)} more</span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                ${product.price}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onViewDetails(product)}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                <Eye size={18} /> View Details
              </button>
              <button 
                onClick={() => onAddToCart(product)}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-500 shadow-xl shadow-primary-500/20 transition-all"
              >
                <ShoppingCart size={18} /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductPreviewModal;
