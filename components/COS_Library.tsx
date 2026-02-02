
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon, Check, X, AlertCircle, Loader2, Eye,
  ShoppingCart, Bell, CheckCircle2, Info
} from 'lucide-react';

/**
 * COS - Component Orchestration System
 * Enterprise-grade UI Library Foundation for Resources Pen
 */

// Helper utility (defined before use in organisms)
const XCircleIcon = ({ size, className }: { size?: number, className?: string }) => (
  <X size={size} className={className} />
);

export const COS_Label: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <label className={`text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 ${className}`}>
    {children}
  </label>
);

// --- 1. ATOMS: Primitives & Tokens ---

export type COS_Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
export type COS_Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface COS_ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: COS_Variant;
  size?: COS_Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  isLoading?: boolean;
  isFullWidth?: boolean;
}

export const COS_Button: React.FC<COS_ButtonProps> = ({
  children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight,
  isLoading, isFullWidth, className = '', ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl";

  const variants = {
    primary: "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-400/50",
    secondary: "bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:border-cyan-500 hover:text-cyan-500",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-900",
    danger: "bg-red-600 text-white shadow-xl shadow-red-500/20 hover:bg-red-500",
    success: "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-500",
    warning: "bg-amber-500 text-white shadow-xl shadow-amber-500/20 hover:bg-amber-400",
    info: "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-500"
  };

  const sizes = {
    xs: "px-3 py-1.5 text-[9px]",
    sm: "px-4 py-2.5 text-[10px]",
    md: "px-6 py-3.5 text-xs",
    lg: "px-8 py-4 text-sm",
    xl: "px-10 py-5 text-base"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isFullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {Icon && !isLoading && <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
      {IconRight && !isLoading && <IconRight size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
    </button>
  );
};

export const COS_Badge: React.FC<{
  children: React.ReactNode,
  sentiment?: COS_Variant | 'neutral'
}> = ({ children, sentiment = 'neutral' }) => {
  const styles = {
    neutral: "bg-slate-100 dark:bg-zinc-900 text-slate-500 border-slate-200 dark:border-zinc-800",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    info: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    primary: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    secondary: "bg-slate-100 dark:bg-zinc-800 text-slate-400 border-transparent",
    ghost: "bg-transparent text-slate-400 border-slate-200 dark:border-zinc-800"
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${styles[sentiment as keyof typeof styles] || styles.neutral}`}>
      {children}
    </span>
  );
};

export const COS_Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string,
  icon?: LucideIcon,
  error?: string,
  hint?: string
}> = ({ label, icon: Icon, error, hint, className = '', ...props }) => (
  <div className="space-y-2 group w-full">
    {label && (
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[9px] font-bold text-slate-300 dark:text-zinc-600">{hint}</span>}
      </div>
    )}
    <div className={`relative group/input ${error ? 'animate-shake' : ''}`}>
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-cyan-500 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input
        className={`w-full bg-white dark:bg-black/40 border-2 border-slate-100 dark:border-white/5 rounded-3xl ${Icon ? 'pl-11' : 'px-6'} py-5 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:bg-black/60 focus:ring-4 focus:ring-cyan-500/10 transition-all shadow-lg shadow-black/20 ${className}`}
        {...props}
      />
      {error && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
          <AlertCircle size={16} />
        </div>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-[10px] font-bold text-red-500 flex items-center gap-1 px-1"
        >
          <AlertCircle size={12} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export const COS_StatCard: React.FC<{
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: string;
}> = ({ label, value, trend, isPositive, icon: Icon, color = 'primary' }) => (
  <motion.div
    whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
    className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm group hover:border-primary-500 transition-all relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3.5 rounded-[1.25rem] bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 text-${color}-500 group-hover:scale-110 transition-transform shadow-inner`}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <div className="text-4xl font-display font-black dark:text-white mb-1.5 tracking-tighter">{value}</div>
      <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.25em]">{label}</div>
    </div>
  </motion.div>
);

export const COS_Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#0c0c0c] rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        >
          <header className="p-8 md:p-10 border-b dark:border-zinc-900 flex items-center justify-between">
            <h3 className="text-2xl font-display font-black dark:text-white tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-500 hover:text-red-500 transition-colors"><X size={20} /></button>
          </header>
          <div className="p-8 md:p-10 overflow-y-auto max-h-[60vh] hide-scrollbar">
            {children}
          </div>
          {footer && (
            <footer className="p-8 md:p-10 border-t dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/50 flex gap-4">
              {footer}
            </footer>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

interface Toast {
  id: string;
  type: COS_Variant;
  title: string;
  message: string;
}

export const COS_ToastContainer: React.FC<{ toasts: Toast[], onRemove: (id: string) => void }> = ({ toasts, onRemove }) => (
  <div className="fixed bottom-8 left-8 z-[3000] space-y-4 max-w-sm w-full pointer-events-none">
    <AnimatePresence>
      {toasts.map(t => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="pointer-events-auto p-5 rounded-[2rem] glass border shadow-2xl flex items-start gap-4 relative overflow-hidden group"
          style={{ borderColor: t.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : t.type === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)' }}
        >
          <div className={`p-2.5 rounded-xl ${t.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
            t.type === 'danger' ? 'bg-red-500/10 text-red-500' :
              'bg-primary-500/10 text-primary-500'
            }`}>
            {t.type === 'success' ? <CheckCircle2 size={18} /> : <XCircleIcon size={18} />}
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-black dark:text-white uppercase tracking-wider">{t.title}</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">{t.message}</p>
          </div>
          <button onClick={() => onRemove(t.id)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"><X size={16} /></button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export const COS_OTPInput: React.FC<{ length?: number, onComplete?: (code: string) => void }> = ({ length = 6, onComplete }) => {
  const [vals, setVals] = useState(new Array(length).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;
    const newVals = [...vals];
    newVals[idx] = val.substring(val.length - 1);
    setVals(newVals);
    if (val && idx < length - 1) inputRefs.current[idx + 1]?.focus();
    if (newVals.every(v => v !== "") && onComplete) onComplete(newVals.join(""));
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !vals[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {vals.map((v, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          value={v}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          className="w-12 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 text-center text-xl font-black focus:ring-2 focus:ring-primary-500/20 transition-all outline-none dark:text-white"
        />
      ))}
    </div>
  );
};

export const COS_Spinner: React.FC<{ size?: number, color?: string }> = ({ size = 24, color = 'currentColor' }) => (
  <Loader2 size={size} className="animate-spin text-primary-500" style={{ color }} />
);

export const COS_DataGrid: React.FC<{
  headers: string[];
  children: React.ReactNode;
  isLoading?: boolean;
}> = ({ headers, children, isLoading }) => (
  <div className="glass rounded-[3rem] border border-slate-200 dark:border-zinc-900 overflow-hidden shadow-sm relative">
    <div className="overflow-x-auto hide-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-zinc-950/50 border-b dark:border-zinc-900">
            {headers.map((h, i) => (
              <th key={i} className={`px-8 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] ${i === headers.length - 1 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-900/50">
          {isLoading ? (
            <tr>
              <td colSpan={headers.length} className="py-24 text-center">
                <COS_Spinner size={32} />
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
    </div>
  </div>
);

export const COS_ProductCard: React.FC<{
  product: any;
  onSelect: (p: any) => void;
  onAction: (p: any) => void;
}> = ({ product, onSelect, onAction }) => (
  <motion.div
    layout
    whileHover={{ y: -10 }}
    className="group relative bg-white dark:bg-[#0c0c0c] rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all"
  >
    <div className="aspect-[4/3] relative overflow-hidden">
      <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
        <COS_Button size="sm" variant="secondary" onClick={() => onSelect(product)} icon={Eye}>Preview</COS_Button>
        <COS_Button size="sm" onClick={() => onAction(product)} icon={ShoppingCart}>Add</COS_Button>
      </div>
    </div>
    <div className="p-7">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold dark:text-white group-hover:text-primary-500 transition-colors truncate max-w-[70%]">{product.name}</h3>
        <div className="text-lg font-black dark:text-white">${product.price}</div>
      </div>
    </div>
  </motion.div>
);
