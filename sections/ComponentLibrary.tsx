import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Layers, Box, Layout, Type, Palette, 
  Sparkles, ShieldCheck, MessageSquare, Bell, 
  Code2, Monitor, Smartphone, Terminal, 
  Plus, Search, Mail, User, Trash2, Edit3, 
  ChevronRight, ArrowRight, Save, RefreshCcw,
  Activity, Info, AlertCircle, ShoppingCart,
  Play, Video, FormInput, Database, FileText,
  CreditCard, Wallet, Star, ChevronDown,
  ExternalLink, Globe, Target, Trophy, Key,
  Shield, Lock, Copy,
  // Added MousePointer2 to fix "Cannot find name" error on line 154
  MousePointer2
} from 'lucide-react';
import { 
  COS_Button, 
  COS_Badge, 
  COS_StatCard, 
  COS_DataGrid, 
  COS_Input,
  COS_OTPInput,
  COS_ProductCard,
  COS_Modal,
  COS_Spinner
} from '../components/COS_Library';

const ComponentLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'atoms' | 'molecules' | 'organisms' | 'smart' | 'ai'>('tokens');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const tabs = [
    { id: 'tokens', label: 'Design Tokens', icon: Palette },
    { id: 'atoms', label: 'UI Atoms', icon: Box },
    { id: 'molecules', label: 'UI Molecules', icon: Layers },
    { id: 'organisms', label: 'UI Organisms', icon: Layout },
    { id: 'smart', label: 'Logic Layers', icon: Zap },
    { id: 'ai', label: 'AI Synthesis', icon: Sparkles, badge: 'PRO' },
  ];

  const handleSimulateLoad = () => {
    setIsDataLoading(true);
    setTimeout(() => setIsDataLoading(false), 2000);
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Component System (COS)
            <div className="p-2 rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
              <Zap size={20} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-2 max-w-2xl">
            The foundational Design System and Component Library for the Resources Pen ecosystem. Standardized for scale.
          </p>
        </div>
        <div className="flex gap-3">
          <COS_Button variant="secondary" icon={FileText}>Documentation</COS_Button>
          <COS_Button icon={Terminal}>CLI Tools</COS_Button>
        </div>
      </div>

      {/* --- Main Tab Navigation --- */}
      <div className="flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-1.5 shadow-sm overflow-x-auto hide-scrollbar w-full xl:w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.badge && (
              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black ${activeTab === tab.id ? 'bg-white text-primary-600' : 'bg-primary-500/10 text-primary-500'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* --- Design Tokens Section --- */}
        {activeTab === 'tokens' && (
          <motion.div key="tokens" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <Palette size={24} className="text-primary-500" />
                 <h3 className="text-2xl font-display font-black dark:text-white">Color Architecture</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  { label: 'Primary 600', val: '#0284c7', bg: 'bg-primary-600' },
                  { label: 'Emerald 500', val: '#10b981', bg: 'bg-emerald-500' },
                  { label: 'Rose 500', val: '#f43f5e', bg: 'bg-rose-500' },
                  { label: 'Amber 500', val: '#f59e0b', bg: 'bg-amber-500' },
                  { label: 'Indigo 600', val: '#4f46e5', bg: 'bg-indigo-600' },
                  { label: 'Zinc 950', val: '#09090b', bg: 'bg-zinc-950' },
                ].map(c => (
                  <div key={c.label} className="p-4 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-4 group cursor-default">
                    <div className={`aspect-square rounded-2xl ${c.bg} shadow-inner group-hover:scale-105 transition-transform`} />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest dark:text-white">{c.label}</div>
                      <div className="text-[9px] font-mono text-slate-400 font-bold uppercase">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <Type size={24} className="text-primary-500" />
                 <h3 className="text-2xl font-display font-black dark:text-white">Typographic Hierarchy</h3>
              </div>
              <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-12">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Genesis Layer (Black)</div>
                    <div className="lg:col-span-8 text-6xl font-display font-black dark:text-white tracking-tighter leading-none">The Future of Software Commerce</div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">System Header (ExtraBold)</div>
                    <div className="lg:col-span-8 text-4xl font-display font-extrabold dark:text-white tracking-tight">Architectural Excellence in Every Pixel</div>
                 </div>
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Body Standard (Medium)</div>
                    <div className="lg:col-span-8 text-sm font-medium text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                      Resources Pen defines the standard for professional digital assets. Our typography is balanced for high readability in dense data-driven environments and high-impact marketing layouts.
                    </div>
                 </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* --- UI Atoms Section --- */}
        {activeTab === 'atoms' && (
          <motion.div key="atoms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
             <section className="space-y-6">
                <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                  <Box size={24} className="text-primary-500" /> Primitive Primitives
                </h3>
                <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-12">
                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MousePointer2 size={12} /> Standard Buttons
                      </div>
                      <div className="flex flex-wrap gap-4">
                         <COS_Button>Primary Solid</COS_Button>
                         <COS_Button variant="secondary">Secondary Layer</COS_Button>
                         <COS_Button variant="ghost">Ghost Protocol</COS_Button>
                         <COS_Button variant="danger" icon={Trash2}>Delete Node</COS_Button>
                         <COS_Button variant="success" icon={ShieldCheck}>Secure</COS_Button>
                         <COS_Button variant="info" icon={Mail}>Transmit</COS_Button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Terminal size={12} /> Data Collectors
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <COS_Input label="Architect Name" placeholder="Alex Wong" />
                         <COS_Input label="Identity Secret" placeholder="••••••••" type="password" />
                         <COS_Input label="Endpoint Search" icon={Search} placeholder="Filter catalog..." />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Semantic Badges</div>
                      <div className="flex flex-wrap gap-4">
                         <COS_Badge sentiment="primary">Elite Layer</COS_Badge>
                         <COS_Badge sentiment="success">Validated</COS_Badge>
                         <COS_Badge sentiment="warning">Triage Required</COS_Badge>
                         <COS_Badge sentiment="danger">System Failure</COS_Badge>
                         <COS_Badge sentiment="info">Enterprise</COS_Badge>
                         <COS_Badge sentiment="neutral">Draft Node</COS_Badge>
                      </div>
                   </div>
                </div>
             </section>
          </motion.div>
        )}

        {/* --- UI Molecules Section --- */}
        {activeTab === 'molecules' && (
          <motion.div key="molecules" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
             <section className="space-y-6">
                <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                  <Layers size={24} className="text-primary-500" /> Molecular Indicators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <COS_StatCard label="Platform Yield" value="$12.4M" trend="+24.1%" isPositive icon={Wallet} />
                   <COS_StatCard label="Growth Velocity" value="84.2%" trend="+4.1%" isPositive icon={Sparkles} color="emerald" />
                   <COS_StatCard label="Latency Factor" value="12ms" trend="-2.0%" isPositive={false} icon={Activity} color="rose" />
                   <COS_StatCard label="Active Licenses" value="4,281" trend="+8.4%" isPositive icon={ShieldCheck} color="indigo" />
                </div>
             </section>

             <section className="space-y-6">
                <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                   <Target size={24} className="text-primary-500" /> Verification Matrix
                </h3>
                <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 flex flex-col items-center gap-8">
                   <div className="text-center max-w-sm">
                      <h4 className="text-lg font-bold dark:text-white mb-2">Architectural OTP</h4>
                      <p className="text-xs text-slate-500">Enter the security protocol delivered to your registered terminal.</p>
                   </div>
                   <COS_OTPInput onComplete={(code) => console.log('Protocol Validated:', code)} />
                   <COS_Button variant="ghost" size="sm">Request New Sequence</COS_Button>
                </div>
             </section>
          </motion.div>
        )}

        {/* --- UI Organisms Section --- */}
        {activeTab === 'organisms' && (
          <motion.div key="organisms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
             <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-display font-black dark:text-white">Data Intelligence Ledger</h3>
                  <COS_Button size="sm" variant="secondary" icon={RefreshCcw} onClick={handleSimulateLoad}>Synchronize</COS_Button>
                </div>
                <COS_DataGrid 
                  headers={['Protocol ID', 'identity layer', 'settlement', 'integrity', 'actions']}
                  isLoading={isDataLoading}
                >
                  {[
                    { id: 'TRX-001', name: 'Alex Rivera', email: 'alex@ark.io', val: '$1,500.00', status: 'success' },
                    { id: 'TRX-002', name: 'Elena Petrova', email: 'e.pet@design.cc', val: '$4,200.00', status: 'primary' },
                    { id: 'TRX-003', name: 'Marcus Wong', email: 'm.wong@dev.net', val: '$840.00', status: 'warning' },
                  ].map(row => (
                    <tr key={row.id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/20 transition-all">
                      <td className="px-8 py-5 font-mono text-xs font-black dark:text-zinc-500">{row.id}</td>
                      <td className="px-8 py-5">
                         <div className="text-sm font-bold dark:text-white">{row.name}</div>
                         <div className="text-[10px] text-slate-400 font-medium">{row.email}</div>
                      </td>
                      <td className="px-8 py-5 text-sm font-black dark:text-white">{row.val}</td>
                      <td className="px-8 py-5"><COS_Badge sentiment={row.status as any}>{row.status}</COS_Badge></td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-primary-500 transition-colors"><Edit3 size={16} /></button>
                            <button className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </COS_DataGrid>
             </section>

             <section className="space-y-6">
                <h3 className="text-2xl font-display font-black dark:text-white">Project Presentation Layer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                   <COS_ProductCard 
                     product={{ id: '1', name: 'Horizon Dashboard Pro', price: 149, category: 'SaaS', image: 'https://picsum.photos/600/400?random=201', techStack: ['React', 'Next.js', 'PostgreSQL'] }}
                     onSelect={(p) => setIsModalOpen(true)}
                     onAction={(p) => console.log('Cart Interaction')}
                   />
                   <COS_ProductCard 
                     product={{ id: '2', name: 'Nexus Portfolio Kit', price: 59, category: 'Design', image: 'https://picsum.photos/600/400?random=202', techStack: ['Framer', 'Three.js', 'GSAP'] }}
                     onSelect={(p) => setIsModalOpen(true)}
                     onAction={(p) => console.log('Cart Interaction')}
                   />
                </div>
             </section>
          </motion.div>
        )}

        {/* --- Logic Layers (Smart Components) --- */}
        {activeTab === 'smart' && (
          <motion.div key="smart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
             <section className="space-y-6">
                <h3 className="text-2xl font-display font-black dark:text-white">Intelligent Interaction Shells</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500"><Terminal size={20} /></div>
                        <h4 className="text-lg font-bold dark:text-white uppercase tracking-tight">Smart Overlay Logic</h4>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">Trigger systemic modals that handle their own internal navigation and state management.</p>
                      <COS_Button onClick={() => setIsModalOpen(true)} isFullWidth>Initialize Protocol</COS_Button>
                   </div>
                   
                   <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Zap size={20} /></div>
                        <h4 className="text-lg font-bold dark:text-white uppercase tracking-tight">Dynamic Loading States</h4>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">Auto-responsive components that adapt visual state during data transmission.</p>
                      <COS_Button variant="secondary" onClick={handleSimulateLoad} isFullWidth isLoading={isDataLoading}>
                         {isDataLoading ? 'Processing Sequence' : 'Simulate Nexus Sync'}
                      </COS_Button>
                   </div>
                </div>
             </section>
          </motion.div>
        )}

        {/* --- AI Section --- */}
        {activeTab === 'ai' && (
          <motion.div key="ai" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-10">
            <div className="relative">
              <div className="w-32 h-32 bg-primary-600/10 rounded-[3rem] flex items-center justify-center text-primary-500 border-2 border-primary-500/20 shadow-2xl">
                <Sparkles size={64} className="animate-pulse" />
              </div>
              <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl">Synthesized</div>
            </div>
            <div className="space-y-4 max-w-xl">
              <h3 className="text-4xl font-display font-black dark:text-white tracking-tighter">AI Component Synthesis</h3>
              <p className="text-lg text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">
                Our Neural Engine is generating adaptive UI structures based on real-time platform telemetry. Pro members gain early access to synthesized dashboard layouts.
              </p>
            </div>
            <div className="flex gap-4">
               <COS_Button variant="primary" size="lg" icon={Zap}>Activate Synthesis</COS_Button>
               <COS_Button variant="secondary" size="lg" icon={Globe}>Explore Repository</COS_Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Global Modal Implementation Example --- */}
      <COS_Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Protocol Configuration"
        footer={(
          <>
            <COS_Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>Abort</COS_Button>
            <COS_Button className="flex-1" onClick={() => setIsModalOpen(false)}>Execute protocol</COS_Button>
          </>
        )}
      >
        <div className="space-y-6">
           <p className="text-sm text-slate-500 font-medium leading-relaxed">Defining a new architectural boundary for the current session. This action will manifest as a global event in the forensics ledger.</p>
           <div className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 space-y-4">
              <COS_Input label="Session Identity" placeholder="Gen-X-42" />
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                 <span>Security Factor</span>
                 <span className="text-emerald-500">Maximum</span>
              </div>
           </div>
        </div>
      </COS_Modal>
    </div>
  );
};

export default ComponentLibrary;