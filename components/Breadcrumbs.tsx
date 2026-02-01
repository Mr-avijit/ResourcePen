
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
// Fixed: Changed import source from '../store' to '../types' to resolve module error
import { Breadcrumb } from '../types';

interface BreadcrumbsProps {
  items: Breadcrumb[];
  onNavigate: (view: any, params?: any) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  if (items.length <= 1) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <button
            onClick={() => onNavigate(item.view, item.params)}
            className={`flex items-center gap-1.5 transition-colors hover:uppercase ${index === items.length - 1
                ? 'px-3 py-1 bg-white dark:bg-zinc-900 rounded-lg text-primary-600 shadow-sm border border-slate-200 dark:border-zinc-800'
                : 'hover:text-primary-500'
              }`}
          >
            {index === 0 && <Home size={12} />}
            {item.label}
          </button>
          {index < items.length - 1 && (
            <ChevronRight size={12} className="text-slate-300 dark:text-zinc-700" />
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
};

export default Breadcrumbs;