
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  Settings, LogOut, Bell, Search, Menu, X,
  BarChart3, Tag, MessageSquare, ShieldCheck,
  UserCircle, Download, CreditCard, ChevronLeft, ChevronRight,
  Heart, Wallet, LifeBuoy, TrendingUp, Scale, Shield,
  DollarSign, Zap, Fingerprint, FileText, Activity, Lock,
  Globe, Terminal, Mail, Star, Share2, Award,
  ArrowLeft, Sun, Moon, Sparkles, Sliders, Receipt,
  Gift, Percent, Landmark, HelpCircle, History, LayoutGrid
} from 'lucide-react';
import { AppUser, AppView } from '../types';
import ProfileDropdown from './ProfileDropdown';
import Breadcrumbs from './Breadcrumbs';
import { useTheme } from '../store';
import { MockApiService } from '../MockApiService';

interface DashboardLayoutProps {
  user: AppUser;
  onLogout: () => void;
  children: React.ReactNode;
  activeSection: AppView;
  onNavigate: (view: AppView) => void;
  onBackToHome: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user, onLogout, children, activeSection, onNavigate, onBackToHome
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = useMemo(() => {
    if (user.role === 'admin') {
      return [
        { id: 'admin-grid', label: 'Command Center', icon: LayoutGrid },
        { id: 'admin-dashboard', label: 'Intelligence', icon: LayoutDashboard },
        { id: 'admin-analytics', label: 'Telemetry', icon: BarChart3 },
        { type: 'separator', label: 'Asset Management' },
        { id: 'admin-projects', label: 'Inventory', icon: Package },

        { id: 'admin-seo', label: 'Growth Engine', icon: TrendingUp },
        { id: 'admin-token-lab', label: 'SEO Token Lab', icon: Globe },
        { type: 'separator', label: 'Fiscal Control' },
        { id: 'admin-orders', label: 'Invoices', icon: Receipt },
        { id: 'admin-payments', label: 'Treasury', icon: Wallet },
        { id: 'admin-tax', label: 'Fiscal Rules', icon: Scale },
        { id: 'admin-coupons', label: 'Reward Engine', icon: Percent },
        { id: 'admin-referrals', label: 'Growth Nodes', icon: Award },
        { type: 'separator', label: 'Personnel & Reach' },
        { id: 'admin-users', label: 'Global Users', icon: Users },
        { id: 'admin-team', label: 'Core Team', icon: ShieldCheck },
        { id: 'admin-roles', label: 'RBAC Matrix', icon: Lock },
        { type: 'separator', label: 'Support & Logic' },
        { id: 'admin-support', label: 'Help Desk', icon: HelpCircle },
        { id: 'admin-enquiries', label: 'Enquiry Management', icon: Mail },
        { id: 'admin-feedback', label: 'Feedback Management', icon: MessageSquare },
        { id: 'admin-logs', label: 'Forensic Logs', icon: History },
        { id: 'admin-settings', label: 'Core Config', icon: Settings },
      ];
    } else {
      return [
        { id: 'user-dashboard', label: 'Workspace', icon: LayoutDashboard },
        { id: 'user-profile', label: 'Profile Identity', icon: UserCircle },
        { id: 'user-orders', label: 'Acquisitions', icon: CreditCard },
        { id: 'user-projects', label: 'Asset Library', icon: Download },
        { id: 'user-referrals', label: 'Partner Lab', icon: Award },
        { id: 'user-settings', label: 'Preferences', icon: Settings },
      ];
    }
  }, [user.role]);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    sections: any[];
    data: any[];
  }>({ sections: [], data: [] });
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Ctrl/Cmd + K Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Search Logic ---
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ sections: [], data: [] });
        return;
      }

      setIsSearching(true);
      const query = searchQuery.toLowerCase();

      // 1. Search Menu Sections
      const matchedSections = menuItems.filter((item: any) =>
        item.type !== 'separator' && item.label && item.label.toLowerCase().includes(query)
      );

      // 2. Search Mock Data (Simulating a unified index)
      // In a real app, this would be a single API call to a search endpoint.
      // Here, we'll aggregate from MockApiService for demo purposes.
      let matchedData: any[] = [];

      try {
        const [users, projects, tickets, logs] = await Promise.all([
          MockApiService.getUsers(),
          MockApiService.getProjects(),
          MockApiService.getTickets(),
          MockApiService.getLogs()
        ]);

        const foundUsers = (users || []).filter(u =>
          `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.toLowerCase().includes(query)
        ).map(u => ({ id: u.id, label: `${u.firstName} ${u.lastName}`, sub: u.email, type: 'user', icon: UserCircle, view: 'admin-users' }));

        const foundProjects = (projects || []).filter(p =>
          (p.name && p.name.toLowerCase().includes(query)) || (p.sku && p.sku.toLowerCase().includes(query))
        ).map(p => ({ id: p.id, label: p.name, sub: p.sku, type: 'asset', icon: Package, view: 'admin-projects' }));

        const foundTickets = (tickets || []).filter(t =>
          (t.subject && t.subject.toLowerCase().includes(query)) || (t.id && t.id.toLowerCase().includes(query))
        ).map(t => ({ id: t.id, label: t.subject, sub: t.id, type: 'ticket', icon: LifeBuoy, view: 'admin-support' }));

        // Only search logs if query is specific enough (e.g., ID or specific keyword)
        const foundLogs = query.length > 3 ? (logs || []).filter(l =>
          (l.action && l.action.toLowerCase().includes(query)) || (l.description && l.description.toLowerCase().includes(query))
        ).slice(0, 3).map(l => ({ id: l.id, label: l.action || 'Unknown Action', sub: l.timestamp, type: 'log', icon: FileText, view: 'admin-logs' })) : [];

        matchedData = [...foundUsers, ...foundProjects, ...foundTickets, ...foundLogs];

      } catch (err) {
        console.error("Search aggregation failed", err);
      }

      setSearchResults({
        sections: matchedSections,
        data: matchedData
      });
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, menuItems]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FAFAFA]/50 dark:bg-[#050505]/50 backdrop-blur-xl">
      {/* --- Branding Header --- */}
      <div className="p-6 shrink-0 flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-primary-600 to-primary-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 ring-1 ring-white/20">
          <Zap size={22} className="fill-current" />
        </div>
        {(!isCollapsed || isMobileOpen) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-lg font-display font-black dark:text-white tracking-tight leading-none">RESOURCES</span>
            <span className="text-[9px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500 uppercase tracking-[0.25em] mt-0.5">Enterprise OS</span>
          </motion.div>
        )}
      </div>

      {/* --- Safe Area for Scrolling --- */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 hide-scrollbar">
        {menuItems.map((item: any, idx: number) => {
          if (item.type === 'separator') {
            return (!isCollapsed || isMobileOpen) ? (
              <div key={idx} className="mt-6 mb-3 px-4 flex items-center gap-4">
                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] whitespace-nowrap">{item.label}</span>
                <div className="h-px bg-slate-200 dark:bg-zinc-800 w-full" />
              </div>
            ) : <div key={idx} className="h-px bg-slate-200 dark:bg-zinc-800 my-6 mx-2" />;
          }

          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 group outline-none ${isActive
                ? 'bg-white dark:bg-[#0F0F0F] text-primary-600 dark:text-primary-400 shadow-sm border border-slate-100 dark:border-white/5 shadow-slate-200/50 dark:shadow-none'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'
                }`}
            >
              {isActive && (!isCollapsed || isMobileOpen) && (
                <motion.div
                  layoutId="activeSideNav"
                  className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                />
              )}

              <div className={`relative z-10 p-1 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : 'group-hover:bg-slate-100 dark:group-hover:bg-white/10'}`}>
                <item.icon size={18} className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
              </div>

              {(!isCollapsed || isMobileOpen) && (
                <span className={`text-xs font-bold truncate tracking-tight ${isActive ? 'translate-x-1' : ''} transition-transform duration-300`}>{item.label}</span>
              )}

              {isActive && (!isCollapsed || isMobileOpen) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* --- User Mini Profile --- */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 shrink-0 bg-white/50 dark:bg-[#0A0A0A]/50 backdrop-blur-sm">
        <div className={`flex items-center gap-3 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''} p-2.5 rounded-[1.25rem] bg-slate-50 dark:bg-[#0F0F0F] border border-slate-100 dark:border-white/5 hover:border-primary-500/20 transition-all group`}>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-zinc-800 overflow-hidden shadow-inner ring-2 ring-white dark:ring-black">
              <img src={user.avatar} className="w-full h-full object-cover" alt={user.firstName} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
          </div>

          {(!isCollapsed || isMobileOpen) && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black dark:text-white truncate">{user.firstName} {user.lastName}</div>
              <div className="text-[9px] text-slate-400 truncate font-medium">Enterprise Admin</div>
            </div>
          )}

          {(!isCollapsed || isMobileOpen) && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // --- Breadcrumb Generator ---
  const breadcrumbs = useMemo(() => {
    const activeItem = menuItems.find((item: any) => item.id === activeSection);

    const crumbs = [
      { label: user.role === 'admin' ? 'Command Center' : 'Workspace', view: user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard' }
    ];

    if (activeItem && activeSection !== (user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard')) {
      crumbs.push({ label: activeItem.label, view: activeSection });
    }

    return crumbs;
  }, [activeSection, menuItems, user.role]);

  return (
    <div className="flex h-screen bg-[#F8F9FB] dark:bg-black overflow-hidden font-sans selection:bg-primary-500/20">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 90 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col bg-white dark:bg-[#050505] border-r border-slate-200/50 dark:border-zinc-900/50 h-full relative z-[100] shadow-2xl shadow-slate-200/50 dark:shadow-black/50"
      >
        <SidebarContent />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 rounded-full flex items-center justify-center text-slate-400 hover:text-primary-500 shadow-md hover:scale-110 transition-all z-[110]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[1000] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#050505] z-[1010] shadow-2xl lg:hidden flex flex-col"
            >
              <SidebarContent />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-4 p-2 rounded-xl bg-transparent text-slate-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FB] dark:bg-black overflow-hidden relative">
        {/* --- Premium Header --- */}
        <header className="h-24 px-8 flex items-center justify-between shrink-0 z-40 bg-[#FAFAFA]/80 dark:bg-black/80 backdrop-blur-xl">
          <div className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500"
              >
                <Menu size={18} />
              </button>

              {/* Integrated Breadcrumbs */}
              <div className="hidden md:block">
                <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
              </div>
            </div>
            <h1 className="text-2xl font-display font-black dark:text-white tracking-tight leading-none hidden md:block">
              {breadcrumbs[breadcrumbs.length - 1].label}
            </h1>
          </div>

          {/* --- Global Search & Actions --- */}
          <div className="flex items-center gap-6">
            <div ref={searchContainerRef} className="relative hidden xl:block">
              <div
                className={`flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-[#0c0c0c] border rounded-2xl transition-all group cursor-text w-96 ${isSearchFocused || searchQuery
                  ? 'border-primary-500 shadow-lg shadow-primary-500/10 ring-2 ring-primary-500/10'
                  : 'border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-md'
                  }`}
                onClick={() => searchInputRef.current?.focus()}
              >
                <Search size={16} className={`transition-colors ${isSearchFocused ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-500'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search across ecosystem..."
                  className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-400 w-full"
                />

                {searchQuery ? (
                  <button onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }} className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400">
                    <X size={14} />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <span className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-900 text-[9px] font-black text-slate-400">⌘</span>
                    <span className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-900 text-[9px] font-black text-slate-400">K</span>
                  </div>
                )}
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {(isSearchFocused && searchQuery) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 rounded-[1.5rem] shadow-2xl overflow-hidden z-[900]"
                  >
                    <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto hide-scrollbar">

                      {isSearching ? (
                        <div className="py-12 flex flex-col items-center justify-center opacity-50 space-y-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scanning Protocol...</p>
                        </div>
                      ) : (
                        <>
                          {/* Section Matches */}
                          {searchResults.sections.length > 0 && (
                            <div className="px-2 py-2">
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Navigation</div>
                              {searchResults.sections.map((item: any) => (
                                <button
                                  key={item.id}
                                  onClick={() => { onNavigate(item.id); setIsSearchFocused(false); }}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group text-left"
                                >
                                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <item.icon size={16} />
                                  </div>
                                  <span className="text-sm font-bold dark:text-white">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Data Matches */}
                          {searchResults.data.length > 0 && (
                            <div className="px-2 py-2">
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Global Index</div>
                              {searchResults.data.map((item: any) => (
                                <button
                                  key={item.id}
                                  onClick={() => { if (item.view) onNavigate(item.view); setIsSearchFocused(false); }}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group text-left"
                                >
                                  <div className={`p-2 rounded-lg ${item.type === 'user' ? 'bg-emerald-500/10 text-emerald-500' :
                                    item.type === 'ticket' ? 'bg-amber-500/10 text-amber-500' :
                                      'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                                    }`}>
                                    <item.icon size={16} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold dark:text-white line-clamp-1">{item.label}</div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500">{item.type}</span>
                                      {item.sub && <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{item.sub}</span>}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {searchResults.sections.length === 0 && searchResults.data.length === 0 && (
                            <div className="py-12 text-center opacity-50">
                              <Search size={32} className="mx-auto mb-2 text-slate-300" />
                              <p className="text-xs font-bold text-slate-500">No signals found in registry.</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-950 border-t dark:border-zinc-900 flex justify-between items-center text-[9px] text-slate-400 font-medium">
                      <div className="flex gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-500">↩</span> to select
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-500">esc</span> to close
                      </div>
                      <span>Global Index Active</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-3 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-slate-200/60 dark:border-white/5 text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all shadow-sm">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="relative p-3 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-slate-200/60 dark:border-white/5 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/30 transition-all shadow-sm">
                <Bell size={20} />
                <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-black" />
              </button>
              <div className="h-8 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block mx-1" />
              <ProfileDropdown user={user} onNavigate={onNavigate} onLogout={onLogout} />
            </div>
          </div>
        </header>

        {/* Mobile Breadcrumb Fallback */}
        <div className="md:hidden px-6 pb-2">
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
        </div>

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-y-auto p-6 md:px-10 md:pb-10 hide-scrollbar scroll-smooth">
          <div className="max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
