import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Type, Maximize2, Share2, Download, 
  Search, ShieldCheck, Zap, Layers, Box,
  Monitor, Smartphone, Tablet, Terminal,
  Copy, Check, SlidersHorizontal, Info, Sparkles,
  Layout, Eye, MousePointer2, Move, Fingerprint
} from 'lucide-react';
import { DesignTokens } from '../DesignTokens';
import { COS_Button, COS_Badge } from '../components/COS_Library';

const TokenExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'color' | 'typography' | 'spacing' | 'elevation' | 'motion' | 'future'>('color');
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'pure'>('dark');
  const [search, setSearch] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const tabs = [
    { id: 'color', label: 'Color Atoms', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'spacing', label: 'Layout & Space', icon: Box },
    { id: 'elevation', label: 'Elevation', icon: Layers },
    { id: 'motion', label: 'Kinematics', icon: Zap },
    { id: 'future', label: 'Future Ready', icon: Sparkles },
  ];

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedToken(val);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- System Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-widest border border-primary-500/20 rounded-lg w-fit mb-4">
            <Fingerprint size={12} /> System Identity v1.0
          </div>
          <h1 className="text-5xl font-display font-black dark:text-white tracking-tight leading-none">
            Architectural Tokens
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-3 max-w-2xl">
            The low-level configuration of the Resources Pen ecosystem. Shared primitives driving consistency across all architectural layers.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-[#0c0c0c] p-1.5 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
          {(['light', 'dark', 'pure'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTheme(t)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTheme === t ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-1.5 shadow-sm overflow-x-auto hide-scrollbar w-full">
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
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* --- Colors Tab --- */}
        {activeTab === 'color' && (
          <motion.div key="color" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
            <section className="space-y-8">
               <div className="flex items-center gap-3">
                  <Palette size={24} className="text-primary-500" />
                  <h3 className="text-2xl font-display font-black dark:text-white">Base Palette (Global)</h3>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {Object.entries(DesignTokens.global.color.zinc).map(([level, hex]) => (
                    <motion.div 
                      key={level} 
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-4 group cursor-pointer"
                      onClick={() => handleCopy(hex)}
                    >
                      <div className="aspect-square rounded-2xl shadow-inner group-hover:shadow-2xl transition-all" style={{ backgroundColor: hex }} />
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest dark:text-white">Zinc-{level}</div>
                          <div className="text-[9px] font-mono text-slate-400 font-bold uppercase">{hex}</div>
                        </div>
                        {copiedToken === hex && <Check size={12} className="text-emerald-500 mb-1" />}
                      </div>
                    </motion.div>
                  ))}
               </div>
            </section>

            <section className="space-y-8">
               <div className="flex items-center gap-3">
                  <Layers size={24} className="text-primary-500" />
                  <h3 className="text-2xl font-display font-black dark:text-white">Semantic Assignments ({activeTheme})</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.entries(DesignTokens.themes[activeTheme].surface).map(([role, val]) => (
                    <div key={role} className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 flex items-center gap-6 group">
                       <div className="w-16 h-16 rounded-2xl shadow-inner border border-slate-100 dark:border-zinc-800" style={{ backgroundColor: val }} />
                       <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">surface.{role}</div>
                          <div className="text-lg font-display font-black dark:text-white uppercase">{val}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </motion.div>
        )}

        {/* --- Typography Tab --- */}
        {activeTab === 'typography' && (
          <motion.div key="typography" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
             <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-12">
                <section className="space-y-6">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type Foundations</div>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-4">
                         <h4 className="text-sm font-black dark:text-white uppercase tracking-widest">Display: Plus Jakarta Sans</h4>
                         <p className="text-6xl font-display font-black dark:text-white tracking-tighter leading-tight">Elite Software Commerce</p>
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-sm font-black dark:text-white uppercase tracking-widest">Sans: Inter</h4>
                         <p className="text-lg font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
                            Resources Pen architecture uses Inter for high-density information display and tactical UI clarity across all system modules.
                         </p>
                      </div>
                   </div>
                </section>

                <section className="pt-12 border-t dark:border-zinc-900 space-y-6">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scale Mapping</div>
                   <div className="space-y-4">
                      {['6xl', '4xl', '2xl', 'xl', 'base', 'xs'].map(size => (
                        <div key={size} className="flex items-center justify-between group py-2 border-b border-slate-50 dark:border-zinc-900/50">
                           <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-primary-500 transition-colors uppercase">Size-{size}</span>
                           <span className="font-bold dark:text-white" style={{ fontSize: DesignTokens.global.typography.size[size as keyof typeof DesignTokens.global.typography.size] }}>
                              The Future Architect
                           </span>
                           <span className="text-[10px] font-mono text-slate-400">{DesignTokens.global.typography.size[size as keyof typeof DesignTokens.global.typography.size]}</span>
                        </div>
                      ))}
                   </div>
                </section>
             </div>
          </motion.div>
        )}

        {/* --- Spacing Tab --- */}
        {activeTab === 'spacing' && (
          <motion.div key="spacing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
             <div className="p-10 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                   <div className="space-y-8">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spacing Grid (8px Base)</div>
                      <div className="space-y-6">
                         {Object.entries(DesignTokens.global.space).map(([name, val]) => (
                           <div key={name} className="flex items-center gap-8">
                              <div className="w-12 text-[10px] font-mono font-black text-slate-400 uppercase">{name}</div>
                              <motion.div 
                                initial={{ width: 0 }} animate={{ width: val }}
                                className="h-4 bg-primary-600 rounded-full shadow-lg shadow-primary-500/20" 
                              />
                              <div className="text-[10px] font-mono text-slate-400">{val}</div>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-8">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Radius Matrix</div>
                      <div className="grid grid-cols-3 gap-6">
                         {Object.entries(DesignTokens.global.radius).map(([name, val]) => (
                           <div key={name} className="space-y-3">
                              <div className="aspect-square bg-slate-100 dark:bg-zinc-900 border dark:border-zinc-800" style={{ borderRadius: val }} />
                              <div className="text-center">
                                 <div className="text-[9px] font-black uppercase dark:text-white">{name}</div>
                                 <div className="text-[8px] font-mono text-slate-400">{val}</div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* --- Future Tab (XR/AR/AI) --- */}
        {activeTab === 'future' && (
          <motion.div key="future" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-10">
            <div className="relative">
              <div className="w-32 h-32 bg-primary-600/10 rounded-[3.5rem] flex items-center justify-center text-primary-500 border-2 border-primary-500/20 shadow-2xl overflow-hidden group">
                 <motion.div 
                  animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" 
                 />
                 <Sparkles size={64} className="animate-pulse relative z-10" />
              </div>
              <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase rounded-full shadow-xl">Immersive Ready</div>
            </div>
            <div className="space-y-4 max-w-xl">
              <h3 className="text-4xl font-display font-black dark:text-white tracking-tighter leading-none">Spatial Computing Primitives</h3>
              <p className="text-lg text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">
                Our token architecture includes a "Depth Layer" designed for AR/VR environments. These tokens define glass refraction, spatial Z-offsets, and volumetric shadows.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
               <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Refraction index</div>
                  <div className="text-3xl font-display font-black dark:text-white">1.45</div>
               </div>
               <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Spatial z-step</div>
                  <div className="text-3xl font-display font-black dark:text-white">4mm</div>
               </div>
               <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Neural Glow</div>
                  <div className="text-3xl font-display font-black text-primary-500">Active</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Governance Section --- */}
      <section className="pt-24 border-t dark:border-zinc-900">
         <div className="p-12 rounded-[4rem] bg-zinc-900 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <h4 className="text-3xl font-display font-black tracking-tight leading-none">System Governance</h4>
                  <p className="text-zinc-400 leading-relaxed font-medium">
                    Our tokens are versioned and strictly linted. Design-to-code sync is automated via our proprietary CI/CD pipeline, ensuring a single source of truth from Figma to Production.
                  </p>
                  <div className="flex gap-4">
                     <COS_Button variant="primary" icon={Terminal}>Sync Engine</COS_Button>
                     <COS_Button variant="secondary" icon={Download}>Export JSON</COS_Button>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">Sync Status</div>
                     <div className="text-lg font-bold flex items-center gap-2">
                        <Check size={18} className="text-emerald-500" /> Fully Synchronized
                     </div>
                  </div>
                  <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
                     <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">Build Integrity</div>
                     <div className="text-lg font-bold flex items-center gap-2">
                        <ShieldCheck size={18} className="text-primary-500" /> Passed (v1.0.42)
                     </div>
                  </div>
               </div>
            </div>
            <div className="absolute -bottom-20 -right-20 p-20 opacity-5 pointer-events-none">
               <Terminal size={400} />
            </div>
         </div>
      </section>
    </div>
  );
};

export default TokenExplorer;
