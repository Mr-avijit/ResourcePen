
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Edit2,
  Trash2, Shield, UserCheck, UserMinus, Mail,
  Calendar, LayoutGrid, List, Check,
  ChevronLeft, ChevronRight, X, UserPlus,
  ArrowUpDown, RefreshCcw, ShieldAlert, Sparkles, Activity,
  Clock, MapPin, Smartphone, Key, Lock, AlertTriangle, MoreVertical,
  CheckCircle2, Ban, Download, Upload, Globe, BarChart3,
  Map as MapIcon, FileSpreadsheet, Send, Power
} from 'lucide-react';
import { AppUser, AppRole } from '../types';
import { MockApiService } from '../MockApiService';
import { COS_Spinner, COS_Button, COS_Modal, COS_Input, COS_Badge, COS_ToastContainer } from '../components/COS_Library';

// --- Utility Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    suspended: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border ${styles[status] || 'bg-slate-500/10 text-slate-500'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
      {status}
    </span>
  );
};

const RoleBadge = ({ role }: { role: string }) => (
  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border ${role === 'admin'
    ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
    : 'bg-slate-50 dark:bg-zinc-900/50 text-slate-500 border-slate-200 dark:border-zinc-800'
    }`}>
    {role === 'admin' ? <Shield size={10} /> : <Users size={10} />}
    {role}
  </span>
);

// --- Modals ---

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<AppUser>) => Promise<void>;
  initialData?: AppUser | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<AppUser>>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    status: 'active',
    plan: 'Free'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ firstName: '', lastName: '', email: '', role: 'user', status: 'active', plan: 'Free' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/30">
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
            {initialData ? <Edit2 size={18} className="text-primary-500" /> : <UserPlus size={18} className="text-primary-500" />}
            {initialData ? 'Update Identity' : 'Enroll New Identity'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <COS_Input label="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="Ex: Alex" required />
            <COS_Input label="Last Name" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="Ex: Mercer" required />
          </div>

          <COS_Input label="Network Handle (Email)" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="user@network.com" required icon={Mail} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clearance Level</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as AppRole })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial Status</label>
              <select
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <COS_Button variant="ghost" onClick={onClose} type="button">Cancel</COS_Button>
            <COS_Button type="submit" disabled={isSubmitting} icon={isSubmitting ? RefreshCcw : UserPlus}>
              {initialData ? 'Update Record' : 'Enroll Identity'}
            </COS_Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Drawer ---

const UserDetailDrawer = ({ user, onClose, onEdit, onDelete }: { user: AppUser, onClose: () => void, onEdit: (u: AppUser) => void, onDelete: (id: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'security'>('details');

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#0c0c0c] border-l border-slate-200 dark:border-zinc-800 shadow-2xl z-[1500] flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-start bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              className="w-16 h-16 rounded-2xl border-2 border-white dark:border-zinc-800 shadow-lg bg-white"
              alt=""
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#0c0c0c] ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'suspended' ? 'bg-rose-500' : 'bg-amber-500'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white leading-tight">{user.firstName} {user.lastName}</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">{user.id}</p>
            <div className="flex gap-2 mt-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-zinc-800 px-6">
        {['details', 'timeline', 'security'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === t ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">

        {activeTab === 'details' && (
          <>
            {/* ID Card */}
            <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />
              <div className="relative z-10 flex justify-between items-start">
                <div className="font-mono text-xs opacity-60">IDENTITY PROTOCOL V2</div>
                <Sparkles size={16} className="text-yellow-400 opacity-80" />
              </div>

              <div className="mt-8 relative z-10 flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Network Handle</div>
                  <div className="text-lg font-bold tracking-tight">{user.email}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono opacity-60">
                <span>JOINED: {new Date(user.joinedAt || Date.now()).toLocaleDateString()}</span>
                <span>PLAN: {user.plan || 'BASIC'}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Activity size={14} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Velocity</span>
                </div>
                <div className="text-2xl font-black dark:text-white">98%</div>
                <div className="text-[10px] text-emerald-500 font-bold mt-1">Excellent Engagement</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Shield size={14} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Trust Score</span>
                </div>
                <div className="text-2xl font-black dark:text-white">100</div>
                <div className="text-[10px] text-primary-500 font-bold mt-1">Verified Identity</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Administrative Controls</h4>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => onEdit(user)} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Edit2 size={16} /></div>
                    <div className="text-left">
                      <div className="text-xs font-bold dark:text-white">Edit Profile</div>
                      <div className="text-[10px] text-slate-400">Update personal details</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </button>

                <button className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Lock size={16} /></div>
                    <div className="text-left">
                      <div className="text-xs font-bold dark:text-white">Reset Credentials</div>
                      <div className="text-[10px] text-slate-400">Send recovery email</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </button>

                <button onClick={() => onDelete(user.id)} className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors"><Trash2 size={16} /></div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-red-600 dark:text-red-400">Terminate Identity</div>
                      <div className="text-[10px] text-red-400 dark:text-red-500/70">Permanent removal</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-red-300" />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'timeline' && (
          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800">
            {[
              { title: 'User Enrolled', date: '2 days ago', icon: UserPlus, color: 'blue' },
              { title: 'Plan Upgraded', date: '1 day ago', icon: CreditCard, color: 'emerald' },
              { title: 'Security Alert', date: '5 hours ago', icon: Shield, color: 'amber' },
              { title: 'Login Detected', date: 'Just now', icon: MapPin, color: 'slate' }
            ].map((event, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[1.35rem] w-6 h-6 rounded-full bg-white dark:bg-[#0c0c0c] border-2 border-slate-200 dark:border-zinc-800 flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full bg-${event.color}-500`} />
                </div>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${event.color}-500/10 text-${event.color}-500`}>
                    <event.icon size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold dark:text-white">{event.title}</h4>
                    <p className="text-xs text-slate-400">{event.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-medium flex gap-3">
              <AlertTriangle className="shrink-0" size={16} />
              This account has 2FA enabled but reused a password from a recent breach.
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Device History</h4>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop size={18} className="text-slate-400" />
                  <div>
                    <div className="text-xs font-bold dark:text-white">MacBook Pro</div>
                    <div className="text-[10px] text-slate-400">San Francisco, US • Active Now</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-slate-400" />
                  <div>
                    <div className="text-xs font-bold dark:text-white">iPhone 14</div>
                    <div className="text-[10px] text-slate-400">New York, US • 2d ago</div>
                  </div>
                </div>
              </div>
            </div>
            <COS_Button variant="danger" isFullWidth icon={Power}>Force Logout All Devices</COS_Button>
          </div>
        )}

      </div>
    </motion.div>
  );
};
import { Laptop, CreditCard } from 'lucide-react';


const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'analytics'>('directory');
  const [viewType, setViewType] = useState<'table' | 'card'>('table');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // For bulk actions
  const [toasts, setToasts] = useState<any[]>([]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      const data = await MockApiService.getUsers();
      await new Promise(r => setTimeout(r, 400));
      setUsers(data || []);
    } catch (err) {
      console.error("Forensic user fetch failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleCreateUser = async (userData: Partial<AppUser>) => {
    try {
      await MockApiService.createUser(userData);
      await refreshUsers();
      addToast('success', 'User Enrolled', 'Identity added to the ledger.');
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleUpdateUser = async (userData: Partial<AppUser>) => {
    if (!editingUser) return;
    try {
      await MockApiService.updateUser(editingUser.id, userData);
      await refreshUsers();
      setEditingUser(null);
      if (selectedUser?.id === editingUser.id) {
        setSelectedUser({ ...selectedUser, ...userData } as AppUser);
      }
      addToast('success', 'Profile Synced', 'User details updated.');
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("WARNING: This action will permanently erase the identity node. Proceed?")) {
      try {
        await MockApiService.deleteUser(id);
        setSelectedUser(null);
        await refreshUsers();
        addToast('info', 'Identity Terminated', 'User removed securely.');
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewType === 'table' ? 5 : 8;

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // PER USER REQUEST: Do not show admin rows
      if (user.role === 'admin') return false;

      const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter.toLowerCase();
      const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter.toLowerCase();
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter, users]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Analytics Logic (Mock)
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => u.role === 'admin').length
  }), [users]);

  return (
    <div className="space-y-8 pb-12 relative animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen">
      <COS_ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Personnel Directory
            <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
              Live Ledger
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mt-1 mb-4">
            Real-time identity management and access control node.
          </p>

          {/* Main Tabs */}
          <div className="flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-2xl p-1 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center ${activeTab === 'directory' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <List size={14} /> Directory
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center ${activeTab === 'analytics' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <BarChart3 size={14} /> Intelligence
            </button>
          </div>
        </div>

        <div className="flex gap-3 items-end">
          <button onClick={() => addToast('info', 'Exporting...', 'Downloading CSV report...')} className="p-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 text-slate-500 rounded-xl hover:text-primary-500 transition-colors shadow-sm">
            <Download size={20} />
          </button>
          <button
            onClick={() => refreshUsers()}
            className="px-5 py-3.5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex items-center gap-2 group h-[48px]">
            <RefreshCcw size={16} className={`group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} /> Sync
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all flex items-center gap-2 active:scale-95 h-[48px]">
            <UserPlus size={16} /> Enroll Identity
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'directory' && (
          <motion.div key="directory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Identities', value: stats.total.toString(), icon: Users, color: 'indigo', detail: '+12% growth' },
                { label: 'Active Nodes', value: stats.active.toString(), icon: Activity, color: 'emerald', detail: 'Online now' },
                { label: 'Access Suspended', value: stats.suspended.toString(), icon: Ban, color: 'rose', detail: 'Requires action' },
                { label: 'Administrators', value: stats.admins.toString(), icon: Shield, color: 'amber', detail: 'System access' },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-[1.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:shadow-lg hover:border-slate-300 dark:hover:border-zinc-700 transition-all relative overflow-hidden">
                  <div className={`absolute top-0 right-0 p-16 bg-${stat.color}-500/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none transition-opacity opacity-50 group-hover:opacity-100`} />
                  <div className="relative z-10">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${stat.color}-500`}></div>
                      {stat.label}
                    </div>
                    <div className="text-3xl font-black dark:text-white tracking-tight group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">{stat.detail}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 flex items-center justify-center relative z-10 border border-${stat.color}-500/20`}>
                    <stat.icon size={22} strokeWidth={2.5} />
                  </div>
                </div>
              ))}
            </div>

            {/* Control Bar */}
            <div className="glass p-2 rounded-[1.5rem] border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm bg-white/50 dark:bg-[#0c0c0c]/50 backdrop-blur-sm sticky top-4 z-20">
              <div className="flex items-center gap-3 px-4 w-full md:w-auto flex-1">
                <div className="p-2 bg-slate-100 dark:bg-zinc-900 rounded-lg text-slate-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search ledger by name, email or ID..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-transparent outline-none text-sm font-bold text-slate-700 dark:text-white w-full placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto p-1 items-center">
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-2 mr-4 animate-in fade-in slide-in-from-right-4">
                    <span className="text-xs font-bold text-primary-500">{selectedUsers.length} Selected</span>
                    <button onClick={() => addToast('info', 'Batch Action', 'Suspension protocol initiated')} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100"><Ban size={16} /></button>
                    <button onClick={() => addToast('info', 'Batch Action', 'Email broadcast queued')} className="p-2 bg-indigo-50 text-indigo-500 rounded-lg hover:bg-indigo-100"><Mail size={16} /></button>
                  </div>
                )}

                <div className="relative group">
                  <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }} className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer transition-all outline-none">
                    <option>All Roles</option><option>User</option> {/* Removed Admin option */}
                  </select>
                  <ChevronLeft size={12} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-[-90deg] text-slate-400 pointer-events-none" />
                </div>
                <div className="relative group">
                  <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer transition-all outline-none">
                    <option>All Status</option><option>Active</option><option>Pending</option><option>Suspended</option>
                  </select>
                  <ChevronLeft size={12} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-[-90deg] text-slate-400 pointer-events-none" />
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800 mx-2" />
                <button onClick={() => { setViewType('card'); setCurrentPage(1); }} className={`p-2.5 rounded-xl transition-colors ${viewType === 'card' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => { setViewType('table'); setCurrentPage(1); }} className={`p-2.5 rounded-xl transition-colors ${viewType === 'table' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center opacity-40 animate-pulse">
                <COS_Spinner size={48} />
                <p className="mt-4 font-black uppercase tracking-widest text-[10px] text-slate-500">Decrypting Ledger...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-32 text-center opacity-40 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-[2rem]">
                <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Users size={32} />
                </div>
                <h3 className="text-lg font-bold dark:text-white uppercase tracking-widest">NO USER FOUND</h3>
                <p className="font-medium text-sm text-slate-400 mt-2">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <>
                {/* View: TABLE */}
                {viewType === 'table' && (
                  <div className="glass rounded-[2rem] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm bg-white dark:bg-[#0c0c0c]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 dark:bg-zinc-900/40 border-b border-slate-100 dark:border-zinc-800">
                            <th className="px-8 py-5 w-[40px]">
                              <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300"
                                onChange={(e) => setSelectedUsers(e.target.checked ? paginatedUsers.map(u => u.id) : [])}
                                checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.includes(u.id))}
                              />
                            </th>
                            <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] w-[40%]">Personnel</th>
                            <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] w-[15%]">Role</th>
                            <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] w-[15%]">Status</th>
                            <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] w-[15%]">Joined</th>
                            <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right px-8 w-[15%]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                          {paginatedUsers.map((user, idx) => (
                            <motion.tr
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              key={user.id}
                              onClick={() => setSelectedUser(user)}
                              className={`group hover:bg-slate-50 dark:hover:bg-zinc-900/30 transition-all cursor-pointer relative ${selectedUsers.includes(user.id) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                            >
                              <td className="px-8 py-4" onClick={e => e.stopPropagation()}>
                                <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 text-primary-600 focus:ring-primary-500"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => toggleSelectUser(user.id)}
                                />
                              </td>
                              <td className="px-2 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-10 h-10 rounded-xl shadow-sm object-cover bg-slate-100" alt="" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold dark:text-white group-hover:text-primary-600 transition-colors flex items-center gap-2">
                                      {user.firstName} {user.lastName}
                                      {user.status === 'active' && <CheckCircle2 size={12} className="text-emerald-500" />}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4"><RoleBadge role={user.role} /></td>
                              <td className="py-4"><StatusBadge status={user.status} /></td>
                              <td className="py-4">
                                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 font-mono">
                                  {new Date(user.joinedAt || Date.now()).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="py-4 text-right px-8">
                                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                  <button onClick={() => setEditingUser(user)} className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-slate-400 hover:text-primary-500 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-all"><Edit2 size={14} /></button>
                                  <button onClick={() => handleDeleteUser(user.id)} className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-slate-400 hover:text-red-500 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-all"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* View: CARD GRID */}
                {viewType === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedUsers.map((user, idx) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`group p-6 rounded-[1.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 hover:border-primary-500/30 dark:hover:border-primary-500/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden ${selectedUsers.includes(user.id) ? 'ring-2 ring-primary-500' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <RoleBadge role={user.role} />
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingUser(user); }}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-primary-500 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>

                        <div className="flex flex-col items-center text-center mb-6">
                          <div className="relative mb-4">
                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-20 h-20 rounded-2xl object-cover bg-slate-50 dark:bg-zinc-900 shadow-lg" alt="" />
                            <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-white dark:border-[#0c0c0c] ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          </div>
                          <h3 className="text-lg font-bold dark:text-white leading-tight">{user.firstName} {user.lastName}</h3>
                          <p className="text-xs text-slate-400 font-mono mt-1">{user.email}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</div>
                          <StatusBadge status={user.status} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-8 p-4 bg-white/50 dark:bg-[#0c0c0c]/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} Users
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-500 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-black text-slate-700 dark:text-white px-2">Page {currentPage}</span>
                    <button
                      onClick={() => setCurrentPage(p => (startIndex + itemsPerPage < filteredUsers.length ? p + 1 : p))}
                      disabled={startIndex + itemsPerPage >= filteredUsers.length}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-500 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 shadow-sm min-h-[400px]">
                <h3 className="text-lg font-bold dark:text-white mb-2 flex items-center gap-2"><MapIcon size={18} className="text-emerald-500" /> Geo-Distribution</h3>
                <p className="text-xs text-slate-400 mb-8">User density by region.</p>
                <div className="flex items-center justify-center h-[250px] bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-zinc-800 text-slate-300">
                  <Globe size={64} className="opacity-20 animate-pulse" />
                  <span className="ml-4 font-black uppercase text-xs tracking-widest">Map Visualization Module</span>
                </div>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 shadow-sm min-h-[400px]">
                <h3 className="text-lg font-bold dark:text-white mb-2 flex items-center gap-2"><Activity size={18} className="text-primary-500" /> Registration Velocity</h3>
                <p className="text-xs text-slate-400 mb-8">New signups over time.</p>
                <div className="flex items-end justify-between h-[250px] gap-2 px-4">
                  {[30, 45, 25, 60, 80, 50, 90, 40, 70, 45, 60, 75].map((h, i) => (
                    <div key={i} className="w-full bg-primary-500/10 rounded-t-xl hover:bg-primary-500/30 transition-colors relative group">
                      <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-primary-500 rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawers & Modals */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="fixed inset-0 bg-black z-[1400] backdrop-blur-sm" />
            <UserDetailDrawer
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onEdit={(u) => { setSelectedUser(null); setEditingUser(u); }}
              onDelete={(id) => { setSelectedUser(null); handleDeleteUser(id); }}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isAddModalOpen || editingUser) && (
          <UserFormModal
            isOpen={true}
            onClose={() => { setIsAddModalOpen(false); setEditingUser(null); }}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            initialData={editingUser}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserManagement;
