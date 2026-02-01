
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, LogOut, LayoutDashboard,
  Globe, UserCircle, CreditCard
} from 'lucide-react';
import { AppUser, AppView } from '../types';
import { useNavigation } from '../store';

interface ProfileDropdownProps {
  user: AppUser;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onNavigate, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { view } = useNavigation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDashboard = view.includes('dashboard') || view.startsWith('admin-') || view.startsWith('user-');

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-zinc-900"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md">
          <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-[#0c0c0c] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-zinc-800 overflow-hidden z-[500]"
          >
            {/* User Meta */}
            <div className="p-5 border-b dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20">
              <div className="font-bold dark:text-white">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-slate-500 truncate mt-0.5">{user.email}</div>
            </div>

            {/* Contextual Links */}
            <div className="p-2 space-y-1">
              {isDashboard ? (
                <button
                  onClick={() => { onNavigate('home'); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-primary-600 dark:hover:text-white transition-all"
                >
                  <Globe size={18} />
                  Back to landing page
                </button>
              ) : (
                <button
                  onClick={() => { onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'user-dashboard'); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-primary-600 dark:hover:text-white transition-all"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
              )}

              <button
                onClick={() => { onNavigate('user-profile'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-primary-600 dark:hover:text-white transition-all"
              >
                <UserCircle size={18} />
                Profile
              </button>

              <button
                onClick={() => { onNavigate(user.role === 'admin' ? 'admin-settings' : 'user-settings' as AppView); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-primary-600 dark:hover:text-white transition-all"
              >
                <Settings size={18} />
                Settings
              </button>
            </div>

            {/* Logout Node */}
            <div className="p-2 border-t dark:border-zinc-900">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
