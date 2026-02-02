
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Key, Copy, Plus, Trash2, Edit3,
  Check, X, ChevronRight, Info, Search, Filter,
  ShieldCheck, ShieldAlert, Globe, Activity, MoreVertical,
  Layers, Zap, Settings, AlertCircle, Eye, FileCode,
  Users, Database, Layout, CreditCard, MessageSquare,
  Package, Share2, CheckCircle2, FileJson,
  Fingerprint, Terminal, History, GitBranch
} from 'lucide-react';
import { COS_Button, COS_Input, COS_Modal, COS_ToastContainer, COS_Badge, COS_StatCard } from '../components/COS_Library';

// --- Types ---
type PermissionGroup = 'Projects' | 'Financials' | 'Personnel' | 'Content' | 'System';

interface Permission {
  id: string;
  group: PermissionGroup;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'critical'; // Added risk level
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
  isSystem: boolean;
  color: string;
  userCount: number; // Added user count metric
  lastModified: string; // Added timestamp
}

interface RoleHistoryLog {
  id: string;
  action: string;
  admin: string;
  timestamp: string;
  roleId: string;
}

// --- Mock Data ---
const PERMISSIONS: Permission[] = [
  { id: 'p1', group: 'Projects', name: 'Create Project', description: 'Initiate new project genesis protocols', riskLevel: 'medium' },
  { id: 'p2', group: 'Projects', name: 'Delete Project', description: 'Permanent deletion of architectural assets', riskLevel: 'critical' },
  { id: 'p3', group: 'Financials', name: 'View Revenue', description: 'Access to global revenue streams and analytics', riskLevel: 'medium' },
  { id: 'p4', group: 'Financials', name: 'Process Refunds', description: 'Trigger financial reversal protocols', riskLevel: 'critical' },
  { id: 'p5', group: 'Personnel', name: 'Invite Members', description: 'Add new users to the ecosystem', riskLevel: 'low' },
  { id: 'p6', group: 'Personnel', name: 'Manage Roles', description: 'Configure RBAC protocols and permissions', riskLevel: 'critical' },
  { id: 'p7', group: 'Content', name: 'Edit Blog', description: 'Modify community insights and articles', riskLevel: 'low' },
  { id: 'p8', group: 'System', name: 'Global Settings', description: 'Full access to system configuration layers', riskLevel: 'critical' },
];

const INITIAL_ROLES: Role[] = [
  { id: 'r1', name: 'MASTER ARCHITECT', description: 'Full spectrum system orchestration with genesis layer access.', permissionIds: PERMISSIONS.map(p => p.id), isSystem: true, color: 'primary', userCount: 2, lastModified: '2024-01-01' },
  { id: 'r2', name: 'PRODUCT LEAD', description: 'Manage project inventory and standard personnel workflows.', permissionIds: ['p1', 'p3', 'p5', 'p7'], isSystem: false, color: 'indigo', userCount: 5, lastModified: '2024-03-15' },
  { id: 'r3', name: 'FINANCIAL AUDITOR', description: 'Strict focus on revenue integrity and refund protocols.', permissionIds: ['p3', 'p4'], isSystem: false, color: 'emerald', userCount: 1, lastModified: '2024-02-10' },
  { id: 'r4', name: 'SUPPORT TIER 1', description: 'Basic interaction with users and content modification.', permissionIds: ['p7'], isSystem: false, color: 'amber', userCount: 12, lastModified: '2024-04-01' },
];

const MOCK_HISTORY: RoleHistoryLog[] = [
  { id: 'h1', action: 'Added "Delete Project" capability', admin: 'Alex.A', timestamp: '2 hours ago', roleId: 'r2' },
  { id: 'h2', action: 'Created Role Identity', admin: 'Alex.A', timestamp: '2 days ago', roleId: 'r2' },
  { id: 'h3', action: 'Revoked "Global Settings"', admin: 'System', timestamp: '1 week ago', roleId: 'r4' },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'matrix' | 'policy' | 'users' | 'history'>('matrix');
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<any[]>([]);

  // Forms
  const [newRoleForm, setNewRoleForm] = useState({ name: '', description: '' });

  const activeRole = useMemo(() => roles.find(r => r.id === selectedRoleId) || roles[0], [roles, selectedRoleId]);

  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const togglePermission = (roleId: string, permId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId && !role.isSystem) {
        const hasPerm = role.permissionIds.includes(permId);
        const newPermissions = hasPerm
          ? role.permissionIds.filter(id => id !== permId)
          : [...role.permissionIds, permId];
        addToast('info', 'Permission Updated', `${hasPerm ? 'Revoked' : 'Granted'} access for ${role.name}`);
        return { ...role, permissionIds: newPermissions, lastModified: new Date().toISOString().split('T')[0] };
      } else if (role.id === roleId && role.isSystem) {
        addToast('warning', 'Immutable Role', 'System roles cannot be modified.');
      }
      return role;
    }));
  };

  const cloneRole = (role: Role) => {
    const newRole: Role = {
      ...role,
      id: `r-${Date.now()}`,
      name: `${role.name} Copy`,
      isSystem: false,
      color: 'slate',
      userCount: 0,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
    addToast('success', 'Role Duplicated', 'New identity created from template.');
  };

  const deleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isSystem) {
      addToast('danger', 'Action Denied', 'Genesis roles cannot be deleted.');
      return;
    }
    setRoles(roles.filter(r => r.id !== id));
    if (selectedRoleId === id) setSelectedRoleId(roles[0].id);
    addToast('info', 'Role Deleted', 'Identity removed from registry.');
  };

  const handleCreateRole = () => {
    if (!newRoleForm.name) {
      addToast('danger', 'Validation Error', 'Role name is required.');
      return;
    }
    const newRole: Role = {
      id: `r-${Date.now()}`,
      name: newRoleForm.name.toUpperCase(),
      description: newRoleForm.description || 'Custom role definition',
      permissionIds: [],
      isSystem: false,
      color: 'indigo',
      userCount: 0,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
    setIsModalOpen(false);
    setNewRoleForm({ name: '', description: '' });
    addToast('success', 'Identity Created', 'New role is ready for configuration.');
  };

  const handleCopyPolicy = () => {
    const policyCode = JSON.stringify({
      Version: "2025-01-01",
      RoleName: activeRole.name.toUpperCase().replace(/\s/g, '_'),
      Description: activeRole.description,
      Statements: [{
        Effect: "Allow",
        Action: activeRole.permissionIds.map(pid => `resourcespen:${PERMISSIONS.find(p => p.id === pid)?.group.toLowerCase()}:${PERMISSIONS.find(p => p.id === pid)?.name.toLowerCase().replace(/\s/g, '_')}`),
        Resource: "*"
      }]
    }, null, 2);

    navigator.clipboard.writeText(policyCode);
    addToast('success', 'Protocol Copied', 'JSON Policy copied to clipboard.');
  };

  const permissionGroups = Array.from(new Set(PERMISSIONS.map(p => p.group)));

  // Risk Score Calculation
  const riskScore = useMemo(() => {
    let score = 0;
    activeRole.permissionIds.forEach(pid => {
      const p = PERMISSIONS.find(perm => perm.id === pid);
      if (p?.riskLevel === 'critical') score += 10;
      else if (p?.riskLevel === 'medium') score += 5;
      else score += 1;
    });
    return Math.min(100, score); // Cap at 100
  }, [activeRole]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <COS_ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-display font-black dark:text-white tracking-tighter flex items-center gap-4">
            Governance & RBAC
            <div className="p-2 rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-500/30">
              <ShieldCheck size={24} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-base font-medium mt-2 max-w-2xl">
            Configure role identities and define granular permission boundaries for the ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-[#0c0c0c] border border-slate-100 dark:border-white/5 rounded-3xl p-1 shadow-sm flex overflow-x-auto max-w-[400px] hide-scrollbar">
            {[
              { id: 'matrix', icon: Layout, label: 'Matrix' },
              { id: 'users', icon: Users, label: 'Assignees' },
              { id: 'policy', icon: FileJson, label: 'JSON Policy' },
              { id: 'history', icon: History, label: 'Audit Log' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === tab.id ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-primary-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/40 hover:bg-primary-500 transition-all flex items-center gap-3 active:scale-95 shrink-0"
          >
            <Plus size={18} /> Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

        {/* --- Role List Sidebar --- */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick Stats Grid for Active Role (Mobile/Tablet friendly summary) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-100 dark:border-zinc-900">
              <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Assigned Users</div>
              <div className="text-2xl font-black dark:text-white flex items-center gap-2">
                <Users size={18} className="text-primary-500" /> {activeRole.userCount}
              </div>
            </div>
            <div className="p-5 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-100 dark:border-zinc-900">
              <div className="text-[10px] uppercase font-black text-slate-400 mb-1">Risk Factor</div>
              <div className={`text-2xl font-black flex items-center gap-2 ${riskScore > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                <Activity size={18} /> {riskScore}%
              </div>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white dark:bg-black rounded-[2rem] border border-slate-100 dark:border-zinc-800 text-sm font-bold outline-none focus:ring-4 focus:ring-primary-500/10 dark:text-white shadow-sm transition-all"
            />
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto hide-scrollbar pr-2">
            {roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(role => {
              const isActive = selectedRoleId === role.id;
              return (
                <motion.button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full p-8 rounded-[2.5rem] text-left transition-all relative overflow-hidden border group ${isActive
                      ? 'bg-primary-50/50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30 shadow-xl shadow-primary-500/10'
                      : 'bg-white dark:bg-zinc-950 border-slate-100 dark:border-zinc-900 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                >
                  {isActive && (
                    <motion.div layoutId="activeRoleBar" className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500" />
                  )}

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`p-4 rounded-2xl ${isActive ? 'bg-primary-100/50 dark:bg-primary-900/30 text-primary-600' : 'bg-slate-50 dark:bg-zinc-900/50 text-slate-400'} flex items-center justify-center transition-colors`}>
                      {role.isSystem ? <Shield size={22} /> : <Fingerprint size={22} />}
                    </div>
                    {role.isSystem && (
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 bg-primary-100/60 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg backdrop-blur-sm">GENESIS</span>
                    )}
                  </div>

                  <h3 className={`text-base font-black tracking-widest relative z-10 transition-colors uppercase ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-300'}`}>
                    {role.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex -space-x-2">
                      {[1, 2].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900" />)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{role.userCount} Assignees</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* --- Main Configuration Area --- */}
        <div className="xl:col-span-8">
          <AnimatePresence mode="wait">
            {/* Header for Detail View */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-display font-black dark:text-white tracking-tight">{activeRole.name}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">{activeRole.description}</p>
              </div>
              {!activeRole.isSystem && (
                <div className="flex gap-2">
                  <button onClick={() => cloneRole(activeRole)} className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-sky-500 transition-colors shadow-sm"><Copy size={18} /></button>
                  <button onClick={() => deleteRole(activeRole.id)} className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-red-500 transition-colors shadow-sm"><Trash2 size={18} /></button>
                </div>
              )}
            </motion.div>

            {viewMode === 'matrix' && (
              <motion.div
                key="matrix"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-[3.5rem] border border-slate-100 dark:border-zinc-900 overflow-hidden shadow-2xl"
              >
                <div className="overflow-x-auto hide-scrollbar">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-zinc-950/50">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Protocol Capability</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] text-center">Authorization Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-900/50">
                      {permissionGroups.map(group => (
                        <React.Fragment key={group}>
                          <tr className="bg-slate-100/30 dark:bg-zinc-900/20">
                            <td colSpan={2} className="px-10 py-4">
                              <div className="flex items-center gap-3">
                                <Layers size={14} className="text-primary-500" />
                                <span className="text-[10px] font-black text-slate-900 dark:text-zinc-200 uppercase tracking-widest">{group} Layer</span>
                              </div>
                            </td>
                          </tr>
                          {PERMISSIONS.filter(p => p.group === group).map(perm => {
                            const isAllowed = activeRole.permissionIds.includes(perm.id);
                            return (
                              <tr key={perm.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-950/30 transition-all">
                                <td className="px-10 py-6">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${perm.riskLevel === 'critical' ? 'bg-red-500' : perm.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <div>
                                      <div className="font-bold text-slate-900 dark:text-white text-base">{perm.name}</div>
                                      <div className="text-xs text-slate-500 dark:text-zinc-500 font-medium mt-0.5">{perm.description}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-10 py-6">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => togglePermission(activeRole.id, perm.id)}
                                      disabled={activeRole.isSystem}
                                      className={`w-14 h-7 rounded-full relative transition-all outline-none ${isAllowed
                                          ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                                          : 'bg-slate-200 dark:bg-zinc-800'
                                        } ${activeRole.isSystem ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
                                    >
                                      <motion.div
                                        animate={{ x: isAllowed ? 32 : 4 }}
                                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden"
                                      >
                                        {isAllowed && <Check size={10} className="text-emerald-500" />}
                                        {!isAllowed && <X size={10} className="text-slate-300" />}
                                      </motion.div>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-8 bg-amber-500/5 border-t dark:border-zinc-900 flex items-start gap-4">
                  <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                  <div className="space-y-1">
                    <p className="text-xs font-black dark:text-zinc-200 uppercase tracking-widest">Architectural Constraint</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                      Changes to standard roles are applied globally and in real-time. System roles marked 'Genesis' are foundational and possess immutable authorization protocols.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === 'policy' && (
              <motion.div
                key="policy"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="p-12 rounded-[3.5rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden font-mono">
                  <div className="flex justify-between items-center mb-10 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-white/5 text-primary-400"><FileCode size={24} /></div>
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-white/70">{activeRole.name.replace(/\s/g, '_')}_POLICY.JSON</span>
                    </div>
                    <button
                      onClick={handleCopyPolicy}
                      className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
                    >
                      <Copy size={14} /> Copy Protocol
                    </button>
                  </div>
                  <div className="text-sm space-y-2 text-zinc-400 leading-relaxed overflow-x-auto hide-scrollbar">
                    <pre className="whitespace-pre-wrap">
                      {`{
  "Version": "2025-01-01",
  "RoleName": "${activeRole.name.toUpperCase().replace(/\s/g, '_')}",
  "Description": "${activeRole.description}",
  "Statements": [
    {
      "Effect": "Allow",
      "Action": [
${activeRole.permissionIds.map(pid => {
                        const p = PERMISSIONS.find(perm => perm.id === pid);
                        return `        "resourcespen:${p?.group.toLowerCase()}:${p?.name.toLowerCase().replace(/\s/g, '_')}"`;
                      }).join(',\n')}
      ],
      "Resource": "*"
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === 'history' && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><History size={18} /> Change Log</h3>
                  <div className="space-y-4">
                    {MOCK_HISTORY.map(log => (
                      <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500">
                          <Terminal size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold dark:text-white">{log.action}</div>
                          <div className="text-xs text-slate-500">by <span className="text-primary-500">{log.admin}</span> • {log.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Users size={18} /> Assigned Personnel</h3>
                  <div className="text-center py-20 text-slate-400">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users size={32} />
                    </div>
                    <p className="text-sm">5 Members are currently assigned to this role.</p>
                    <COS_Button variant="secondary" size="sm" className="mt-4">Manage Assignments</COS_Button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* --- Create Role Modal --- */}
      <COS_Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Role Identity">
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Shield size={32} />
            </div>
            <p className="text-sm text-slate-500">Define a new operational boundary for the ecosystem.</p>
          </div>
          <div className="space-y-4">
            <COS_Input label="Identity Name" placeholder="e.g. Content Sentinel" value={newRoleForm.name} onChange={e => setNewRoleForm({ ...newRoleForm, name: e.target.value })} icon={Shield} />
            <COS_Input label="Core Description" placeholder="Operational boundaries..." value={newRoleForm.description} onChange={e => setNewRoleForm({ ...newRoleForm, description: e.target.value })} />
          </div>
          <COS_Button isFullWidth onClick={handleCreateRole}>Finalize Role</COS_Button>
        </div>
      </COS_Modal>

    </div>
  );
};

export default RoleManagement;
