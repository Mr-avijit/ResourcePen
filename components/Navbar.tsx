
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sun, Moon, Home, Layout, Zap, PenTool, Mail } from 'lucide-react';
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
  const { view, navigate } = useNavigation();
  const [activeSection, setActiveSection] = React.useState('sec-hero');

  const navItems = [
    { label: 'Home', id: 'sec-hero', icon: Home },
    { label: 'Products', id: 'sec-products', icon: Layout },
    { label: 'Solutions', id: 'sec-services', icon: Zap },
    { label: 'Resources', id: 'sec-blog', icon: PenTool },
    { label: 'Support', id: 'sec-contact', icon: Mail },
  ];

  // Scroll Spy Logic
  React.useEffect(() => {
    const handleScroll = () => {
      // Only active on home view
      if (view !== 'home') return;

      const scrollPosition = window.scrollY + 150; // Offset for navbar

      // Find the current section
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handleNavClick = (id: string) => {
    if (view !== 'home') {
      navigate('home');
      // Optional: Add logic to scroll after navigation if needed, 
      // but for now simple navigation to home is a good fallback
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

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

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 mx-auto">
              {navItems.map(item => {
                const isActive = activeSection === item.id && view === 'home';

                return (
                  <div key={item.label} className="relative group">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`relative z-10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                    >
                      {item.label}
                    </button>
                    {/* Active/Hover Pill Effect */}
                    {(isActive) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-full -z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Hover Effect (only when not active) */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-50 dark:bg-white/5 rounded-full scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out -z-10"></div>
                    )}
                  </div>
                );
              })}
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
