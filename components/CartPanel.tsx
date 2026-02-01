import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Trash2, Tag, ShoppingBag,
  Plus, Minus, ShieldCheck, ArrowRight, Lock,
  CreditCard, Truck
} from 'lucide-react';
import { CartItem } from '../store';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => Promise<void>;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const stats = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [items]);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise(r => setTimeout(r, 800));
    await onCheckout();
    setIsCheckingOut(false);
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const drawerVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 200 }
    },
    exit: {
      x: '100%',
      transition: { ease: 'easeInOut', duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md h-full bg-white dark:bg-black shadow-2xl flex flex-col border-l border-white/10"
          >
            {/* 1. Header Section */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                Shopping Cart
                <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold px-2 py-1 rounded-full">
                  {items.length}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 2. Scrollable Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-zinc-950/50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <ShoppingBag size={48} className="text-slate-300 mb-4" />
                  <p className="text-sm font-medium">Your cart is empty.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="group flex gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800 rounded-lg p-1">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center bg-white dark:bg-zinc-700 rounded shadow-sm hover:text-primary-600 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center bg-white dark:bg-zinc-700 rounded shadow-sm hover:text-primary-600 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* 3. Footer Summary & Action */}
            {items.length > 0 && (
              <div className="p-6 bg-white dark:bg-black border-t border-slate-100 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {/* Cost Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-semibold dark:text-white">${stats.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-semibold dark:text-white">{stats.shipping === 0 ? 'Free' : `$${stats.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax</span>
                    <span className="font-semibold dark:text-white">${stats.tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-zinc-800 my-2" />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="font-display font-black text-primary-600">${stats.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Primary Action */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm tracking-wide hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      Checkout <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-slate-400 opacity-80">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
                    <Lock size={12} /> Secure
                  </div>
                  <div className="w-px h-3 bg-slate-200 dark:bg-zinc-800" />
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
                    <CreditCard size={12} /> Encrypted
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;
