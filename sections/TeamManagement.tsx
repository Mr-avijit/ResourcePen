
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, Lock, Key, UserPlus, Trash2, Edit3,
  Check, X, ChevronRight, Info, Search, Filter,
  ShieldCheck, ShieldAlert, Globe, Activity, MoreVertical,
  Mail, Star, Zap, Settings, AlertCircle, History,
  LogOut, Hash, FileText
} from 'lucide-react';
import { COS_Button, COS_Badge, COS_Input, COS_Modal, COS_ToastContainer } from '../components/COS_Library';

// --- Types ---
type RoleType = 'Owner' | 'Admin' | 'Architect' | 'Editor' | 'Support';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  status: 'active' | 'away' | 'offline';
  lastActive: string;
  joinedDate: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

// --- Mock Data ---
const PERMISSIONS: Permission[] = [
  { id: 'p1', name: 'Project Creation', description: 'Can initiate new project genesis protocols' },
  { id: 'p2', name: 'Financial Audit', description: 'Access to treasury and revenue analytics' },
  { id: 'p3', name: 'User Moderation', description: 'Manage member access and permissions' },
  { id: 'p4', name: 'CMS Deployment', description: 'Publish and edit global platform content' },
  { id: 'p5', name: 'Support Triage', description: 'Resolve architectural and billing tickets' },
];

const MOCK_TEAM: TeamMember[] = [
  { id: 'tm1', name: 'Alex Architect', email: 'alex@resourcespen.com', role: 'Owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', status: 'active', lastActive: 'Now', joinedDate: 'Oct 2021' },
  { id: 'tm2', name: 'Elena Petrova', email: 'elena@resourcespen.com', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', status: 'active', lastActive: '5m ago', joinedDate: 'Jan 2022' },
  { id: 'tm3', name: 'Marcus Wong', email: 'marcus@resourcespen.com', role: 'Architect', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', status: 'away', lastActive: '2h ago', joinedDate: 'Mar 2022' },
  { id: 'tm4', name: 'Sarah Jenkins', email: 'sarah@resourcespen.com', role: 'Editor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'active', lastActive: '12m ago', joinedDate: 'Jun 2023' },
  { id: 'tm5', name: 'David Smith', email: 'david@resourcespen.com', role: 'Support', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', status: 'offline', lastActive: '1d ago', joinedDate: 'Aug 2023' },
];

const MOCK_LOGS: AuditLog[] = [
  { id: 'l1', user: 'Alex Architect', action: 'Modified Permission', target: 'Editor Role', time: '10 mins ago', severity: 'high' },
  { id: 'l2', user: 'Elena Petrova', action: 'Invited Member', target: 'new_hire@resourcespen.com', time: '1 hour ago', severity: 'medium' },
  { id: 'l3', user: 'System', action: 'Automated Backup', target: 'Core Database', time: '2 hours ago', severity: 'low' },
];

const TeamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'matrix' | 'audit'>('members');
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<any[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Forms
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Architect' as RoleType });
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});

  // Permission Matrix State
  const [rolePerms, setRolePerms] = useState<Record<RoleType, string[]>>({
    Owner: ['p1', 'p2', 'p3', 'p4', 'p5'],
    Admin: ['p1', 'p2', 'p3', 'p4'],
    Architect: ['p1', 'p4'],
    Editor: ['p4'],
    Support: ['p5'],
  });

  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const togglePermission = (role: RoleType, permId: string) => {
    if (role === 'Owner') {
      addToast('warning', 'Action Denied', 'Owner permissions are immutable.');
      return;
    }
    setRolePerms(prev => {
      const current = prev[role];
      const next = current.includes(permId)
        ? current.filter(id => id !== permId)
        : [...current, permId];

      // Log this change
      const newLog: AuditLog = {
        id: `l-${Date.now()}`,
        user: 'You',
        action: current.includes(permId) ? 'Revoked Permission' : 'Grant Permission',
        target: `${permId} for ${role}`,
        time: 'Just now',
        severity: 'high'
      };
      setLogs([newLog, ...logs]);

      return { ...prev, [role]: next };
    });
    addToast('info', 'Matrix Updated', 'Permission protocol adjusted.');
  };

  const handleInvite = () => {
    if (!inviteForm.email || !inviteForm.name) {
      addToast('danger', 'Validation Error', 'All fields are required.');
      return;
    }
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteForm.name}`,
      status: 'offline',
      lastActive: 'Never',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setTeam([...team, newMember]);
    setIsAddModalOpen(false);
    addToast('success', 'Invitation Sent', `Protocol invite dispatched to ${inviteForm.email}`);
    setInviteForm({ name: '', email: '', role: 'Architect' });

    // Log
    setLogs([{ id: `l-${Date.now()}`, user: 'You', action: 'Platform Invite', target: newMember.email, time: 'Just now', severity: 'medium' }, ...logs]);
  };

  const handleDeleteMember = (id: string) => {
    const member = team.find(m => m.id === id);
    if (member?.role === 'Owner') {
      addToast('danger', 'Action Forbidden', 'Cannot remove the Core Owner.');
      return;
    }
    setTeam(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Member Removed', 'User access tokens revoked.');

    // Log
    setLogs([{ id: `l-${Date.now()}`, user: 'You', action: 'Termination', target: member?.email || 'Unknown', time: 'Just now', severity: 'high' }, ...logs]);
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setEditForm({ name: member.name, role: member.role });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedMember) return;
    setTeam(prev => prev.map(m => m.id === selectedMember.id ? { ...m, ...editForm } : m));
    setIsEditModalOpen(false);
    addToast('success', 'Profile Updated', 'Member details synchronized.');
  };

  const filteredTeam = useMemo(() => {
    return team.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, team]);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <COS_ToastContainer toasts={toasts} onRemove={() => { }} />

      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Core Team
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Users size={16} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mt-1">Manage architectural permissions and elite personnel access levels.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-2xl p-1 shadow-sm">
            {['members', 'roles', 'matrix', 'audit'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all flex items-center gap-2 active:scale-95"
          >
            <UserPlus size={16} /> Enroll
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* --- Personnel Grid --- */}
        {activeTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass p-4 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex items-center gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or role identity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm font-bold transition-all dark:text-white"
                />
              </div>
              <button className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border dark:border-white/5 text-slate-400 hover:text-primary-500 transition-colors">
                <Filter size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeam.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 group relative overflow-hidden shadow-sm hover:shadow-2xl transition-all"
                >
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-400 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-white dark:border-zinc-800 shadow-xl">
                        <img src={member.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-black ${member.status === 'active' ? 'bg-emerald-500' : member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold dark:text-white tracking-tight">{member.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <RoleBadge role={member.role} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{member.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-zinc-400">
                      <Mail size={14} className="text-primary-500" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-zinc-400">
                      <Activity size={14} className="text-primary-500" />
                      Last seen: {member.lastActive}
                    </div>
                  </div>

                  <div className="pt-6 border-t dark:border-zinc-900 flex gap-3">
                    <button onClick={() => openEditModal(member)} className="flex-1 py-3 bg-slate-50 dark:bg-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-500 transition-all border dark:border-zinc-800">
                      <Edit3 size={14} className="inline mr-2" /> Edit Info
                    </button>
                    <button onClick={() => handleDeleteMember(member.id)} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- Role Definitions --- */}
        {activeTab === 'roles' && (
          <motion.div
            key="roles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(Object.keys(rolePerms) as RoleType[]).map((role, i) => (
              <div key={role} className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Shield size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {role === 'Owner' ? 'Genesis Layer' : 'Permissioned Layer'}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-display font-black dark:text-white tracking-tight">{role}</h3>
                  <p className="text-sm text-slate-500 mt-1">Foundational access level for platform orchestration.</p>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Lock size={12} /> Active Capabilities
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rolePerms[role].map(pId => (
                      <span key={pId} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-bold border border-emerald-500/20">
                        {PERMISSIONS.find(p => p.id === pId)?.name}
                      </span>
                    ))}
                    {rolePerms[role].length === 0 && <span className="text-[10px] text-slate-400 italic">No assigned permissions</span>}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- Access Matrix --- */}
        {activeTab === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-[3rem] border border-slate-200 dark:border-zinc-900 overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-zinc-900/30 border-b dark:border-zinc-900">
                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Capability Matrix</th>
                    {(Object.keys(rolePerms) as RoleType[]).map(role => (
                      <th key={role} className="py-8 text-center text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest min-w-[120px]">
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-zinc-900/50">
                  {PERMISSIONS.map((perm) => (
                    <tr key={perm.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-all">
                      <td className="px-10 py-6">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{perm.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium mt-0.5">{perm.description}</div>
                      </td>
                      {(Object.keys(rolePerms) as RoleType[]).map(role => (
                        <td key={role} className="py-6 text-center">
                          <button
                            onClick={() => togglePermission(role, perm.id)}
                            disabled={role === 'Owner'}
                            className={`w-12 h-6 rounded-full relative transition-all inline-block align-middle ${rolePerms[role].includes(perm.id)
                                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-200 dark:bg-zinc-800'
                              } ${role === 'Owner' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                          >
                            <motion.div animate={{ x: rolePerms[role].includes(perm.id) ? 26 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-amber-500/5 border-t dark:border-zinc-900 flex items-center gap-4">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Changes to the Capability Matrix are applied globally and in real-time. Role identities marked 'Genesis Layer' have immutable permissions.</p>
            </div>
          </motion.div>
        )}

        {/* --- Audit Logs --- */}
        {activeTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-8 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
              <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                <History size={20} className="text-slate-500" /> Security Audit Trail
              </h3>
              <div className="space-y-2">
                {logs.map(log => (
                  <div key={log.id} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 hover:border-primary-500/30 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${log.severity === 'high' ? 'bg-red-500' : log.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <div className="text-sm font-bold dark:text-white min-w-[150px]">{log.user}</div>
                      <div className="text-sm text-slate-500 dark:text-zinc-400"><span className="font-bold text-slate-700 dark:text-zinc-300">{log.action}:</span> {log.target}</div>
                    </div>
                    <div className="text-xs font-mono text-slate-400">{log.time}</div>
                  </div>
                ))}
                {logs.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No audit records found.</div>}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- Modals --- */}

      {/* Invite Modal */}
      <COS_Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Team Enrollment">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-2">
            <UserPlus size={32} />
          </div>
          <p className="text-sm text-slate-500 mb-6">Initiate a new architectural access protocol.</p>
          <div className="space-y-4 text-left">
            <COS_Input label="Full Name" placeholder="Jane Doe" value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} icon={Users} />
            <COS_Input label="Email Route" placeholder="jane@corp" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} icon={Mail} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Layer</label>
              <select
                value={inviteForm.role}
                onChange={e => setInviteForm({ ...inviteForm, role: e.target.value as RoleType })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none dark:text-white cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Architect">Architect</option>
                <option value="Editor">Editor</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>
          <COS_Button isFullWidth onClick={handleInvite}>Send Secure Invite</COS_Button>
        </div>
      </COS_Modal>

      {/* Edit Modal */}
      <COS_Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Personnel">
        <div className="space-y-6">
          <COS_Input label="Display Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Assignment</label>
            <select
              value={editForm.role}
              disabled={selectedMember?.role === 'Owner'}
              onChange={e => setEditForm({ ...editForm, role: e.target.value as RoleType })}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none dark:text-white cursor-pointer disabled:opacity-50"
            >
              <option value="Admin">Admin</option>
              <option value="Architect">Architect</option>
              <option value="Editor">Editor</option>
              <option value="Support">Support</option>
              {selectedMember?.role === 'Owner' && <option value="Owner">Owner</option>}
            </select>
            {selectedMember?.role === 'Owner' && <p className="text-[10px] text-amber-500 font-bold">Ownership role cannot be modified.</p>}
          </div>
          <COS_Button isFullWidth onClick={handleSaveEdit}>Synchronize Profile</COS_Button>
        </div>
      </COS_Modal>

    </div>
  );
};

// --- Sub-components ---
const RoleBadge = ({ role }: { role: string }) => {
  const isElite = ['Owner', 'Admin'].includes(role);
  return (
    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1 ${isElite ? 'bg-primary-500/10 text-primary-500 border-primary-500/20' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500 border-slate-200 dark:border-zinc-800'
      }`}>
      {isElite && <Star size={10} className="fill-current" />}
      {role}
    </span>
  );
};

export default TeamManagement;