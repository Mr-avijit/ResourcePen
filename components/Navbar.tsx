
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sun, Moon, Home, Layout, Zap, PenTool, Mail, Search, X } from 'lucide-react';
import { AppUser, AppView } from '../types';
import ProfileDropdown from './ProfileDropdown';
import { useNavigation } from '../store';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  openAuth: (mode: 'login' | 'signup') => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  user: AppUser | null;
  onNavigateDashboard: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  theme, toggleTheme, openAuth, cartCount,
  onOpenCart, onNavigateHome, user
}) => {
  const { navigate } = useNavigation();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Products', view: 'products', icon: Layout },
    { label: 'Solutions', view: 'services', icon: Zap },
    { label: 'Resources', view: 'blog-list', icon: PenTool },
    { label: 'Support', view: 'contact', icon: Mail },
  ];

  return (
    <>
      <>
        <nav className="fixed top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 max-w-[1440px] mx-auto z-[100] rounded-[2rem] border border-slate-200/40 dark:border-white/[0.08] bg-white/70 dark:bg-black/60 backdrop-blur-2xl transition-all duration-500 supports-[backdrop-filter]:bg-white/50 shadow-2xl shadow-slate-200/20 dark:shadow-black/40">
          <div className="px-6 md:px-8 h-20 flex items-center justify-between gap-6 md:gap-10">
            {/* Brand */}
            <motion.div
              onClick={onNavigateHome}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 ring-4 ring-white/10 dark:ring-black/10">P</div>
              <span className="text-xl font-display font-black dark:text-white tracking-tighter">RESOURCES PEN</span>
            </motion.div>

            {/* Dynamic Search */}
            <div className="hidden lg:flex flex-1 justify-end max-w-md relative ml-auto mr-8">
              <AnimatePresence mode="popLayout" initial={false}>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ width: 48, opacity: 0, paddingLeft: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: 48, opacity: 0 }}
                    transition={{ type: "spring", mass: 0.5, stiffness: 200, damping: 25 }}
                    className="relative w-full"
                  >
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500 pointer-events-none" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search resources..."
                      className="w-full bg-white dark:bg-zinc-900/80 border-0 ring-1 ring-slate-200 dark:ring-white/10 focus:ring-2 focus:ring-primary-500/30 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium transition-all outline-none dark:text-white placeholder:text-slate-400/80 shadow-2xl shadow-slate-200/50 dark:shadow-black/50"
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    layoutId="search-trigger"
                    onClick={() => setIsSearchOpen(true)}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-zinc-900/30 rounded-full text-slate-500 hover:text-primary-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all border border-slate-200/50 dark:border-white/5"
                  >
                    <Search size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Search</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Menu */}
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map(item => (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => navigate(item.view as AppView)}
                    className="relative z-10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors dark:text-slate-300 group-hover:text-primary-600"
                  >
                    {item.label}
                  </button>
                  {/* Hover Pill Effect */}
                  <div className="absolute inset-0 bg-primary-50 dark:bg-primary-900/10 rounded-full scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out -z-0"></div>
                </div>
              ))}
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all text-slate-500">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button onClick={onOpenCart} className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all text-slate-500 group">
                <ShoppingCart size={20} className="group-hover:text-primary-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-black">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Auth/User Logic */}
              <div className="hidden md:block pl-2 border-l border-slate-200 dark:border-white/10">
                {user ? (
                  <ProfileDropdown user={user} onNavigate={navigate} onLogout={() => window.location.reload()} />
                ) : (
                  <button
                    onClick={() => openAuth('login')}
                    className="px-6 py-2.5 bg-primary-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-all active:scale-95"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </>
    </>
  );
};

export default Navbar;
