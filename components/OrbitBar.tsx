
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Layout, User, BarChart3, Award, Plus, X, 
  ShoppingCart, MessageSquare, PenTool, Settings, 
  LogOut, Sun, Moon, Zap, Shield, Search, 
  Wallet, FileText, Heart, Sliders, Bell,
  Sparkles, Target, Layers, MousePointer2,
  ChevronUp, Fingerprint, ChevronRight, ChevronLeft,
  Globe, Briefcase, HelpCircle, Users, Star, 
  Tag, Download, ExternalLink, ShieldCheck,
  TrendingUp, Scale, Terminal, Info, Mail,
  LogIn, UserPlus, CreditCard, Laptop, ShoppingBag,
  ArrowRight, RefreshCw, LayoutDashboard
} from 'lucide-react';
import { AppUser, AppView, AppRole } from '../types';

interface OrbitBarProps {
  user: AppUser | null;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  openAuth: (mode: 'login' | 'signup') => void;
  onOpenCart: () => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
  currentView?: AppView;
}

const MENU_SCHEMA = {
  platform: [
    { id: 'home', label: 'Home', icon: Home, view: 'home' },
    { id: 'about', label: 'About Us', icon: Info, view: 'home' },
    { id: 'pricing', label: 'Pricing', icon: Tag, view: 'home' },
    { id: 'careers', label: 'Careers', icon: Briefcase, view: 'home' },
  ],
  marketplace: {
    id: 'market_group',
    label: 'Marketplace',
    icon: Layout,
    sub: [
      { label: 'All Projects', view: 'products' },
      { label: 'Website Projects', view: 'products' },
      { label: 'Digital Products', view: 'products' },
      { label: 'SaaS Templates', view: 'products' },
      { label: 'UI Kits', view: 'products' },
      { label: 'Categories', view: 'products' },
      { label: 'Popular', view: 'products' },
      { label: 'Trending', view: 'products' },
    ]
  },
  services: {
    id: 'services_group',
    label: 'Services',
    icon: Zap,
    sub: [
      { label: 'Website Development', view: 'services' },
      { label: 'UI/UX Design', view: 'services' },
      { label: 'SEO Services', view: 'services' },
      { label: 'Digital Marketing', view: 'services' },
      { label: 'Maintenance', view: 'services' },
      { label: 'Hosting', view: 'services' },
    ]
  },
  discovery: [
    { id: 'blog', label: 'Blog Insights', icon: PenTool, view: 'blog-list' },
    { id: 'team', label: 'Our Team', icon: Users, view: 'home' },
    { id: 'testimonials', label: 'Success Stories', icon: Star, view: 'home' },
  ],
  support: {
    id: 'support_group',
    label: 'Support Hub',
    icon: HelpCircle,
    sub: [
      { label: 'Enquiry', view: 'contact' },
      { label: 'Feedback', view: 'contact' },
      { label: 'Help Center', view: 'home' },
      { label: 'Live Chat', view: 'home' },
      { label: 'FAQ', view: 'home' },
    ]
  }
};

const OrbitBar: React.FC<OrbitBarProps> = ({ 
  user, onNavigateHome, onNavigateDashboard, 
  openAuth, onOpenCart, toggleTheme, theme,
  currentView = 'home'
}) => {
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [navStack, setNavStack] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (isCommandCenterOpen) return;
      setIsVisible(false);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => setIsVisible(true), 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [isCommandCenterOpen]);

  const toggleCommandCenter = () => {
    setIsCommandCenterOpen(!isCommandCenterOpen);
    setNavStack([]);
    setIsVisible(true);
  };

  const pushNav = (item: any) => {
    if (item.sub) setNavStack([...navStack, item]);
    else executeNav(item);
  };

  const popNav = () => setNavStack(navStack.slice(0, -1));

  const executeNav = (item: any) => {
    if (item.view === 'home') onNavigateHome();
    else if (item.view) {
       const el = document.getElementById(item.view);
       if (el) el.scrollIntoView({ behavior: 'smooth' });
       else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsCommandCenterOpen(false);
  };

  const currentLevel = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  const MenuItem: React.FC<{ item: any, isSub?: boolean }> = ({ item, isSub = false }) => {
    const hasSub = !!item.sub;
    return (
      <div className="w-full">
        <button 
          onClick={() => hasSub ? pushNav(item) : executeNav(item)}
          className={`w-full flex items-center justify-between p-5 rounded-[2rem] transition-all active:scale-[0.98] ${
            isSub ? 'bg-slate-50 dark:bg-zinc-900/40' : 'bg-white dark:bg-[#0c0c0c] border border-slate-100 dark:border-white/5 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isSub ? 'bg-white dark:bg-black' : 'bg-slate-50 dark:bg-zinc-900'} text-primary-500`}>
              {item.icon ? <item.icon size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-primary-500/30" />}
            </div>
            <span className={`text-sm font-black uppercase tracking-widest ${isSub ? 'text-slate-500 dark:text-zinc-400' : 'dark:text-white'}`}>
              {item.label}
            </span>
          </div>
          {hasSub && <ChevronRight size={18} className="text-slate-400" />}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[600] px-6 lg:hidden flex justify-center pointer-events-none">
      
      {/* --- Global Command Center Overlay --- */}
      <AnimatePresence>
        {isCommandCenterOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed inset-0 amoled-surface dark:bg-black bg-slate-50 z-[1000] pointer-events-auto flex flex-col overflow-hidden"
          >
            <header className="p-8 border-b dark:border-zinc-900 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-xl shrink-0">
               <div className="flex items-center gap-4">
                  {navStack.length > 0 ? (
                    <button onClick={popNav} className="p-3 bg-slate-100 dark:bg-zinc-900 rounded-2xl text-primary-500 active:scale-90 transition-all">
                      <ChevronLeft size={24} />
                    </button>
                  ) : (
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">P</div>
                  )}
                  <div>
                    <h3 className="text-2xl font-display font-black dark:text-white tracking-tight">
                      {currentLevel ? currentLevel.label : 'Command Center'}
                    </h3>
                  </div>
               </div>
               <button onClick={toggleCommandCenter} className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-red-500 transition-colors">
                 <X size={24} />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 hide-scrollbar pb-32">
               {!currentLevel && (
                 <section>
                    {user ? (
                      <div className="p-6 rounded-[2.5rem] bg-primary-600 text-white shadow-2xl flex items-center justify-between overflow-hidden relative">
                         <div className="flex items-center gap-5 relative z-10">
                            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-4 border-white/20">
                              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 className="text-xl font-bold">{user.firstName} {user.lastName}</h4>
                               <span className="px-2 py-0.5 bg-white/20 rounded-md text-[9px] font-black uppercase tracking-widest">{user.role}</span>
                            </div>
                         </div>
                         <button onClick={() => { onNavigateDashboard(); setIsCommandCenterOpen(false); }} className="p-4 bg-white/20 rounded-2xl backdrop-blur-md relative z-10">
                            <ArrowRight size={20} />
                         </button>
                         <Fingerprint size={120} className="absolute -bottom-10 -right-10 opacity-10" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => { openAuth('login'); setIsCommandCenterOpen(false); }} className="py-5 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border dark:border-white/10 rounded-[2.25rem] font-black uppercase text-[10px] tracking-widest">Sign In</button>
                        <button onClick={() => { openAuth('signup'); setIsCommandCenterOpen(false); }} className="py-5 bg-primary-600 text-white rounded-[2.25rem] shadow-xl font-black uppercase text-[10px] tracking-widest">Join Lab</button>
                      </div>
                    )}
                 </section>
               )}

               <div className="space-y-12">
                  {!currentLevel ? (
                    <>
                      <div className="space-y-4">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Platform Core</div>
                         <div className="grid grid-cols-1 gap-3">
                            {MENU_SCHEMA.platform.map(item => <MenuItem key={item.id} item={item} />)}
                            <MenuItem item={MENU_SCHEMA.marketplace} />
                            <MenuItem item={MENU_SCHEMA.services} />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Intelligence Hub</div>
                         <div className="grid grid-cols-1 gap-3">
                            {MENU_SCHEMA.discovery.map(item => <MenuItem key={item.id} item={item} />)}
                            <MenuItem item={MENU_SCHEMA.support} />
                         </div>
                      </div>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      {currentLevel.sub.map((sub: any, idx: number) => (
                        <MenuItem key={idx} item={sub} isSub />
                      ))}
                    </motion.div>
                  )}
               </div>

               {!currentLevel && (
                 <div className="pt-10 border-t dark:border-zinc-900 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={toggleTheme} className="flex items-center gap-3 p-5 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border dark:border-white/5">
                          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                             {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{theme === 'dark' ? 'Solar' : 'Void'}</span>
                       </button>
                       <button onClick={onOpenCart} className="flex items-center gap-3 p-5 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border dark:border-white/5">
                          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500">
                             <ShoppingCart size={18} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vault</span>
                       </button>
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Responsive Mobile Dock --- */}
      <motion.div 
        initial={{ y: 150, opacity: 0 }}
        animate={{ 
          y: isVisible || isCommandCenterOpen ? 0 : 150,
          opacity: isVisible || isCommandCenterOpen ? 1 : 0
        }}
        transition={{ 
          y: { type: 'spring', damping: 25, stiffness: 200 },
          opacity: { duration: 0.25 }
        }}
        className="relative w-full max-w-[360px] pointer-events-auto"
      >
        <motion.div 
          animate={{ 
            boxShadow: isCommandCenterOpen 
              ? '0 0 60px rgba(14, 165, 233, 0.5)' 
              : '0 20px 80px rgba(0,0,0,0.6)'
          }}
          className="absolute inset-0 rounded-[3rem] border border-white/10 pointer-events-none"
        />

        <nav className="glass relative w-full h-20 rounded-[3rem] flex items-center justify-between px-6 shadow-2xl border-t border-white/20 dark:border-white/5 overflow-visible">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onNavigateHome}
            className={`flex flex-col items-center justify-center w-12 h-14 relative outline-none ${currentView === 'home' ? 'text-primary-500' : 'text-slate-400'}`}
          >
            <Home size={22} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex flex-col items-center justify-center w-12 h-14 relative outline-none ${currentView === 'products' ? 'text-primary-500' : 'text-slate-400'}`}
          >
            <Layout size={22} />
          </motion.button>

          <div className="relative -top-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleCommandCenter}
              className={`w-18 h-18 rounded-[2.25rem] bg-primary-600 text-white flex items-center justify-center shadow-2xl border-4 border-white dark:border-[#0c0c0c] transition-all relative z-[100] ${isCommandCenterOpen ? 'rotate-[135deg] bg-rose-500 shadow-rose-500/30' : 'shadow-primary-500/40'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-[inherit]" />
              {isCommandCenterOpen ? <Plus size={32} /> : <Zap size={32} className="fill-current" />}
              
              {!isCommandCenterOpen && (
                <motion.div 
                  animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.6, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute -inset-2 rounded-[2.5rem] border-2 border-primary-500/40 pointer-events-none"
                />
              )}
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => user ? onNavigateDashboard() : openAuth('login')}
            className={`flex flex-col items-center justify-center w-12 h-14 relative outline-none ${currentView?.includes('dashboard') ? 'text-primary-500' : 'text-slate-400'}`}
          >
            <BarChart3 size={22} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => user ? executeNav({ view: 'user-profile' }) : openAuth('signup')}
            className="flex flex-col items-center justify-center w-12 h-14 relative outline-none text-slate-400"
          >
            {user ? (
               <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-primary-500/40 shadow-inner">
                  <img src={user.avatar} className="w-full h-full object-cover" />
               </div>
            ) : (
              <User size={22} />
            )}
          </motion.button>
        </nav>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
      `}} />
    </div>
  );
};

export default OrbitBar;
