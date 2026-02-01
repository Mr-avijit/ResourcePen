
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Globe, Palette, Layout, Bell, Shield,
  Zap, Code2, Save, RefreshCcw, CheckCircle2,
  Monitor, Smartphone, Moon, Sun, Layers,
  Database, Lock, Key, Cpu, ExternalLink,
  ChevronRight, X, Info, AlertCircle, Camera,
  MoreVertical, Search, MousePointer2, Plus,
  Trash2, Mail, Terminal, Share2, Wallet, MessageSquare,
  Hash, Server, Cloud, Code, GitBranch, FileText
} from 'lucide-react';
import { MockApiService } from '../MockApiService';

// -- Interfaces --

interface SystemConfiguration {
  siteName: string;
  description: string;
  maintenanceMode: boolean;
  publicRegistration: boolean;
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  glassOpacity: number;
  layoutDensity: 'compact' | 'comfortable';
  security: {
    mfaEnforced: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  integrations: Array<{
    id: string;
    name: string;
    connected: boolean;
    icon: any;
  }>;
}

// -- Components --

const ConfigToggle: React.FC<{ label: string; description?: string; active: boolean; onToggle: () => void }> = ({ label, description, active, onToggle }) => (
  <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-primary-500/30 transition-all cursor-pointer" onClick={onToggle}>
    <div className="space-y-1">
      <div className="text-sm font-bold dark:text-white uppercase tracking-tight">{label}</div>
      {description && <div className="text-[10px] text-slate-500 font-medium leading-tight max-w-[200px]">{description}</div>}
    </div>
    <div className={`w-12 h-7 rounded-full relative transition-colors ${active ? 'bg-primary-500' : 'bg-slate-300 dark:bg-zinc-700'}`}>
      <motion.div animate={{ x: active ? 22 : 4 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </div>
  </div>
);

const ConfigInput: React.FC<{ label: string; value: string; onChange: (val: string) => void; icon?: any; placeholder?: string }> = ({ label, value, onChange, icon: Icon, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder:text-slate-400`}
      />
    </div>
  </div>
);

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [config, setConfig] = useState<SystemConfiguration>({
    siteName: 'Nexus Enterprise',
    description: 'Advanced automated orchestration platform.',
    maintenanceMode: false,
    publicRegistration: true,
    theme: 'dark',
    primaryColor: '#0ea5e9',
    glassOpacity: 90,
    layoutDensity: 'comfortable',
    security: {
      mfaEnforced: true,
      sessionTimeout: 30,
      ipWhitelist: ['192.168.1.1', '10.0.0.0/8']
    },
    integrations: [
      { id: 'stripe', name: 'Stripe Payments', connected: true, icon: Wallet },
      { id: 'aws', name: 'AWS Cloud', connected: false, icon: Cloud },
      { id: 'slack', name: 'Slack Alerts', connected: true, icon: Hash },
    ]
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const tabs = [
    { id: 'general', label: 'Core Identity', icon: Server },
    { id: 'visual', label: 'Visual Matrix', icon: Palette },
    { id: 'security', label: 'Security Grid', icon: Shield },
    { id: 'integrations', label: 'Neural Link', icon: Zap },
    { id: 'api', label: 'API Gateway', icon: Code },
  ];

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            System Configuration
            <div className="p-1.5 rounded-lg bg-orange-600 text-white shadow-lg shadow-orange-500/20">
              <Settings size={18} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mt-2 max-w-xl">
            Master control verification. Modify global variables, security protocols, and integration webhooks.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-xs font-mono text-emerald-500 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={12} /> Synced {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
            {isSaving ? 'Directing...' : 'Flash to Eprom'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-2 sticky top-24 self-start">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group relative overflow-hidden ${activeTab === tab.id
                ? 'bg-white dark:bg-[#0c0c0c] text-primary-600 shadow-md border border-primary-500/20 ring-1 ring-primary-500/10'
                : 'hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-500'}`}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full" />
              )}

              <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-500/10' : 'bg-slate-100 dark:bg-zinc-800'}`}>
                <tab.icon size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}

          <div className="mt-8 p-6 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-black text-slate-400 uppercase tracking-widest">
              <Database size={12} /> System Status
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">CPU Load</span>
                <span className="font-mono font-bold dark:text-white">12%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Memory</span>
                <span className="font-mono font-bold dark:text-white">3.2 / 8 GB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Uptime</span>
                <span className="font-mono font-bold text-emerald-500">99.99%</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONFIGURATION PANEL */}
        <div className="lg:col-span-9">
          <div className="glass p-8 md:p-10 rounded-[3rem] border border-slate-200 dark:border-zinc-900 shadow-sm min-h-[600px] relative overflow-hidden bg-white/50 dark:bg-[#0c0c0c]/80 backdrop-blur-xl">

            <AnimatePresence mode="wait">
              {/* -- GENERAL TAB -- */}
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-12 max-w-3xl"
                >
                  <div>
                    <h3 className="text-xl font-display font-black dark:text-white mb-6 flex items-center gap-2">Protocol Header <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800 ml-4 rounded-full" /></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ConfigInput
                        label="Platform Name"
                        value={config.siteName}
                        onChange={v => setConfig({ ...config, siteName: v })}
                        icon={Globe}
                      />
                      <ConfigInput
                        label="System Description"
                        value={config.description}
                        onChange={v => setConfig({ ...config, description: v })}
                        icon={FileText}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-black dark:text-white mb-6 flex items-center gap-2">Operational State <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800 ml-4 rounded-full" /></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ConfigToggle
                        label="Maintenance Mode"
                        description="Suspend public frontend access. Admin routes remain active."
                        active={config.maintenanceMode}
                        onToggle={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                      />
                      <ConfigToggle
                        label="Public Registration"
                        description="Allow new users to generate keys automatically."
                        active={config.publicRegistration}
                        onToggle={() => setConfig({ ...config, publicRegistration: !config.publicRegistration })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* -- VISUAL TAB -- */}
              {activeTab === 'visual' && (
                <motion.div
                  key="visual"
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-12 max-w-3xl"
                >
                  <div>
                    <h3 className="text-xl font-display font-black dark:text-white mb-6 flex items-center gap-2">Rendering Mode <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800 ml-4 rounded-full" /></h3>
                    <div className="grid grid-cols-3 gap-6">
                      {['light', 'dark', 'system'].map((t: any) => (
                        <button
                          key={t}
                          onClick={() => setConfig({ ...config, theme: t })}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${config.theme === t ? 'border-primary-500 bg-primary-500/5 text-primary-500' : 'border-slate-100 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-400'}`}
                        >
                          {t === 'light' ? <Sun size={32} /> : t === 'dark' ? <Moon size={32} /> : <Monitor size={32} />}
                          <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-black dark:text-white mb-6 flex items-center gap-2">Accent Matrix <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800 ml-4 rounded-full" /></h3>
                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 flex flex-wrap gap-4">
                      {['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'].map(c => (
                        <button
                          key={c}
                          onClick={() => setConfig({ ...config, primaryColor: c })}
                          className={`w-12 h-12 rounded-2xl transition-all shadow-sm flex items-center justify-center ${config.primaryColor === c ? 'scale-110 ring-4 ring-offset-2 dark:ring-offset-black ring-slate-200 dark:ring-zinc-700' : 'hover:scale-105'}`}
                          style={{ backgroundColor: c }}
                        >
                          {config.primaryColor === c && <CheckCircle2 className="text-white mix-blend-plus-lighter" size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Glassmorphism Intensity</label>
                      <span className="font-mono font-bold text-xs dark:text-white">{config.glassOpacity}%</span>
                    </div>
                    <input
                      type="range" min="50" max="100"
                      value={config.glassOpacity}
                      onChange={e => setConfig({ ...config, glassOpacity: Number(e.target.value) })}
                      className="w-full accent-primary-500 h-2 bg-slate-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </motion.div>
              )}

              {/* -- INTEGRATIONS TAB -- */}
              {activeTab === 'integrations' && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 max-w-3xl"
                >
                  <h3 className="text-xl font-display font-black dark:text-white mb-6 flex items-center gap-2">Active Nodes <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800 ml-4 rounded-full" /></h3>

                  {config.integrations.map(integration => (
                    <div key={integration.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-primary-500/30 transition-all gap-6">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-sm ${integration.connected ? 'bg-white dark:bg-black text-primary-500' : 'bg-slate-200 dark:bg-zinc-800 text-slate-400'}`}>
                          <integration.icon />
                        </div>
                        <div>
                          <h4 className="text-lg font-black dark:text-white">{integration.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${integration.connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{integration.connected ? 'Online' : 'Disconnected'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newIntegrations = config.integrations.map(i => i.id === integration.id ? { ...i, connected: !i.connected } : i);
                          setConfig({ ...config, integrations: newIntegrations });
                        }}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${integration.connected ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 hover:bg-rose-100' : 'bg-white dark:bg-black border dark:border-zinc-700 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                      >
                        {integration.connected ? 'Terminate Link' : 'Initialize'}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* -- SECURITY TAB -- */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-10 max-w-3xl"
                >
                  <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative z-10 flex items-start gap-6">
                      <Shield size={48} className="opacity-80" />
                      <div>
                        <h3 className="text-xl font-black mb-2">Fortress Protocol Active</h3>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-md">System intrusion detection and biometric verification layers are operating at 100% capacity. No anomalies detected in the last 24 cycles.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <ConfigToggle
                      label="Enforce Multi-Factor Authentication"
                      description="Require YubiKey or TOTP for all admin endpoints."
                      active={config.security.mfaEnforced}
                      onToggle={() => setConfig(prev => ({ ...prev, security: { ...prev.security, mfaEnforced: !prev.security.mfaEnforced } }))}
                    />

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Timeout (Minutes)</label>
                      <input
                        type="number"
                        value={config.security.sessionTimeout}
                        onChange={e => setConfig(prev => ({ ...prev, security: { ...prev.security, sessionTimeout: Number(e.target.value) } }))}
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Whitelisted IP Class Blocks</label>
                        <button className="text-[10px] font-black text-primary-500 uppercase flex items-center gap-1 hover:underline"><Plus size={12} /> Add Block</button>
                      </div>
                      <div className="p-2 space-y-2 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        {config.security.ipWhitelist.map((ip, i) => (
                          <div key={i} className="flex justify-between items-center p-3 pl-4 bg-white dark:bg-black rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">{ip}</span>
                            <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* -- API TAB -- */}
              {activeTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-8 max-w-3xl"
                >
                  <div className="p-6 rounded-[2rem] bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white"><Share2 size={14} /></button>
                    </div>
                    <div className="text-slate-500 mb-2">// Public Key</div>
                    <div className="break-all font-bold text-emerald-400">pk_live_51M0d8sL9q2jK8s019238...</div>
                    <div className="text-slate-500 mt-4 mb-2">// Secret Key (Hidden)</div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">sk_live_************************</span>
                      <button className="text-[10px] uppercase font-bold bg-slate-800 px-2 py-1 rounded text-slate-400 hover:text-white">Reveal</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-primary-500/50 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <GitBranch size={24} />
                      </div>
                      <h4 className="font-bold dark:text-white mb-2">Webhooks</h4>
                      <p className="text-xs text-slate-500">Configure event listeners for `order.created` and `user.signup`.</p>
                    </div>
                    <div className="p-6 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 hover:border-primary-500/50 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Code2 size={24} />
                      </div>
                      <h4 className="font-bold dark:text-white mb-2">GraphQL Playground</h4>
                      <p className="text-xs text-slate-500">Test queries against the live production schema.</p>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;