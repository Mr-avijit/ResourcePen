import React, { useState, useMemo } from 'react';
// Fix: Added motion type workaround for React 19 compatibility
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
const motionCircle = m.circle as any;
import { 
  Search, Globe, Share2, Terminal, Sparkles, 
  CheckCircle2, Info, ChevronRight, Monitor, 
  Image as ImageIcon, Smartphone as MobileIcon,
  RefreshCcw, Bot, Link as LinkIcon, Code, Cpu,
  // Fix: Renamed History to HistoryIcon to avoid conflict with browser global class
  History as HistoryIcon
} from 'lucide-react';
import { COS_Badge, COS_Input } from '../components/COS_Library';

interface SeoData {
  title: string;
  description: string;
  slug: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: 'index, follow' | 'noindex, nofollow';
  isIndexable: boolean;
  priority: number;
}

const ProductSeoManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'technical' | 'ai'>('basic');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  
  const [data, setData] = useState<SeoData>({
    title: '',
    description: '',
    slug: '',
    keywords: '',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: 'https://picsum.photos/1200/630?random=seo',
    robots: 'index, follow',
    isIndexable: true,
    priority: 0.8
  });

  const score = useMemo(() => {
    let s = 0;
    if (data.title.length >= 30 && data.title.length <= 60) s += 30;
    if (data.description.length >= 100 && data.description.length <= 160) s += 30;
    if (data.slug.length > 5) s += 10;
    if (data.ogTitle) s += 10;
    if (data.ogDescription) s += 10;
    if (data.isIndexable) s += 10;
    return Math.min(s, 100);
  }, [data]);

  const updateField = (field: keyof SeoData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'basic', label: 'Semantic Core', icon: Search, desc: 'Google Search & Meta' },
    { id: 'social', label: 'Social Sync', icon: Share2, desc: 'OpenGraph & X Cards' },
    { id: 'technical', label: 'Technical Node', icon: Terminal, desc: 'Robots & Canonical' },
    { id: 'ai', label: 'Neural Lab', icon: Sparkles, badge: 'PRO', desc: 'AI Meta Generation' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* SEO Health Matrix */}
      <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center overflow-hidden relative shadow-sm">
        <div className="lg:col-span-4 flex items-center gap-8">
           <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                 <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-zinc-900" />
                 <motionCircle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={314.15} animate={{ strokeDashoffset: 314.15 - (314.15 * score) / 100 }} className={score > 80 ? 'text-emerald-500' : 'text-primary-500'} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black dark:text-white leading-none">{score}</span>
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Health</span>
              </div>
           </div>
           <div>
              <h3 className="text-2xl font-display font-black dark:text-white tracking-tight">Discovery Pulse</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Status: {score > 80 ? 'Optimized' : score > 40 ? 'Calibration Needed' : 'Critical Deficit'}</p>
              <div className="flex gap-1.5 mt-4">
                 {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= score/20 ? 'bg-primary-500' : 'bg-slate-100 dark:bg-zinc-800'}`} />)}
              </div>
           </div>
        </div>
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Title Node', status: data.title.length > 30 ? 'Valid' : 'Weak' },
             { label: 'Index Protocol', status: data.isIndexable ? 'Allowed' : 'Blocked' },
             { label: 'Social Integrity', status: data.ogTitle ? 'Synced' : 'Missing' },
             { label: 'Semantic Density', status: data.keywords.split(',').length > 3 ? 'High' : 'Low' },
           ].map(stat => (
             <div key={stat.label} className="p-5 rounded-3xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 hover:border-primary-500/30 transition-all">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</div>
                <div className={`text-xs font-black uppercase ${stat.status === 'Valid' || stat.status === 'Allowed' || stat.status === 'Synced' || stat.status === 'High' ? 'text-emerald-500' : 'text-amber-500'}`}>
                   {stat.status}
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-3">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-between p-5 rounded-[2rem] transition-all group ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' : 'bg-white dark:bg-[#0c0c0c] text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}>
              <div className="flex items-center gap-4">
                 <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-primary-500'} />
                 <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-widest">{tab.label}</div>
                    <div className="text-[9px] font-medium opacity-60">{tab.desc}</div>
                 </div>
              </div>
              {tab.badge && <span className="px-1.5 py-0.5 bg-primary-500/10 text-primary-500 text-[8px] font-black rounded">{tab.badge}</span>}
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3">
          <div className="p-10 rounded-[3.5rem] bg-white dark:bg-[#080808] border border-slate-200 dark:border-zinc-900 shadow-sm min-h-[600px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

             <AnimatePresence mode="wait">
                {activeTab === 'basic' && (
                  <motion.div key="basic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10 flex-1">
                     <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata Title Architecture</label>
                           <span className={`text-[9px] font-bold uppercase tracking-widest ${data.title.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{data.title.length} / 60 Units</span>
                        </div>
                        <input type="text" value={data.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. Nexus Pro - High Performance SaaS Component Library" className="w-full px-6 py-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none dark:text-white" />
                     </div>

                     <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Abstract (Description)</label>
                           <span className={`text-[9px] font-bold uppercase tracking-widest ${data.description.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{data.description.length} / 160 Units</span>
                        </div>
                        <textarea rows={4} value={data.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Provide core semantic summary of the asset..." className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-primary-500 transition-all outline-none dark:text-white" />
                     </div>

                     <div className="p-8 rounded-[2.5rem] bg-slate-100 dark:bg-zinc-950 border dark:border-zinc-900 space-y-6">
                        <div className="flex justify-between items-center">
                           <h5 className="text-[10px] font-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-2"><Globe size={14} className="text-primary-500" /> SERP Simulator</h5>
                           <div className="flex bg-white dark:bg-black p-1 rounded-xl shadow-sm border dark:border-white/5">
                              <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}><MobileIcon size={14} /></button>
                              <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}><Monitor size={14} /></button>
                           </div>
                        </div>
                        <div className={`bg-white dark:bg-black p-8 rounded-3xl border dark:border-zinc-800 shadow-sm ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'}`}>
                           <div className="text-[11px] text-emerald-600 font-medium mb-1 truncate">resourcespen.com > products > <span className="underline">{data.slug || 'identity-node'}</span></div>
                           <div className="text-xl text-primary-600 dark:text-primary-400 font-bold leading-tight mb-2 hover:underline cursor-pointer">{data.title || 'Project Identity Node'}</div>
                           <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{data.description || 'Deep semantic meta abstract will manifest here during global indexing sequences...'}</div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'social' && (
                  <motion.div key="social" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10 flex-1">
                     <h4 className="text-lg font-black uppercase tracking-tight dark:text-white flex items-center gap-3">
                        <Share2 size={24} className="text-primary-500" /> OpenGraph Social Sync
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <COS_Input label="OG Dispatch Title" value={data.ogTitle} onChange={(e) => updateField('ogTitle', e.target.value)} placeholder="Engaging social title..." />
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">OG Payload (Description)</label>
                              <textarea rows={4} value={data.ogDescription} onChange={(e) => updateField('ogDescription', e.target.value)} placeholder="Viral social abstract..." className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Graph Asset Preview (1200x630)</label>
                           <div className="aspect-[1.91/1] rounded-[2rem] bg-slate-50 dark:bg-zinc-900 border-2 border-dashed dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-primary-500 transition-all">
                              <div className="p-4 rounded-2xl bg-white dark:bg-black shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                 <ImageIcon size={32} className="text-slate-300 dark:text-zinc-700" />
                              </div>
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inject Visual Token</span>
                           </div>
                           <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex items-start gap-4">
                              <Info className="text-primary-500 shrink-0 mt-0.5" size={16} />
                              <p className="text-[10px] text-slate-500 font-medium">OpenGraph assets significantly increase click-through rates on LinkedIn, X, and Meta platforms.</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'technical' && (
                  <motion.div key="technical" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 flex-1">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 space-y-6">
                           <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500"><Bot size={18} /></div>
                              <h5 className="text-xs font-black dark:text-white uppercase tracking-widest">Crawl Directives</h5>
                           </div>
                           <select value={data.robots} onChange={(e) => updateField('robots', e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-black border dark:border-zinc-800 text-sm font-bold dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-primary-500">
                              <option>index, follow</option>
                              <option>noindex, nofollow</option>
                              <option>index, nofollow</option>
                              <option>noindex, follow</option>
                           </select>
                           <p className="text-[10px] text-slate-500 leading-relaxed italic">Defines how global bots interpret and interact with this node.</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 space-y-6">
                           <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500"><LinkIcon size={18} /></div>
                              <h5 className="text-xs font-black dark:text-white uppercase tracking-widest">Canonical Authority</h5>
                           </div>
                           <input type="text" value={data.canonical} onChange={(e) => updateField('canonical', e.target.value)} placeholder="https://resourcespen.com/..." className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-black border dark:border-zinc-800 text-xs font-mono font-bold dark:text-zinc-400 outline-none focus:ring-2 focus:ring-primary-500" />
                           <p className="text-[10px] text-slate-500 leading-relaxed italic">Prevents duplicate content penalty by establishing a single source of truth.</p>
                        </div>
                     </div>

                     <div className="p-10 rounded-[3rem] bg-zinc-900 text-white relative overflow-hidden shadow-2xl group">
                        <div className="relative z-10">
                           <div className="flex items-center gap-4 mb-6">
                              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"><Code size={24} /></div>
                              <h5 className="text-xl font-bold uppercase tracking-tight">Structured Data Payload (JSON-LD)</h5>
                           </div>
                           <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400 leading-relaxed group-hover:border-emerald-500/30 transition-all">
                              <pre className="whitespace-pre-wrap">
{`{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${data.title || 'Product Identity'}",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}`}
                              </pre>
                           </div>
                        </div>
                        <Cpu size={300} className="absolute -bottom-20 -right-20 opacity-5 group-hover:scale-110 transition-transform duration-[3s]" />
                     </div>
                  </motion.div>
                )}

                {activeTab === 'ai' && (
                  <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-24 text-center space-y-8 flex-1">
                     <div className="relative">
                        <motion.div 
                           animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" 
                        />
                        <div className="w-24 h-24 rounded-[2rem] bg-primary-600/10 border-2 border-primary-500/20 flex items-center justify-center text-primary-500 shadow-2xl relative z-10">
                           <Sparkles size={48} className="animate-pulse" />
                        </div>
                     </div>
                     <div className="space-y-4 max-w-sm">
                        <h4 className="text-2xl font-display font-black dark:text-white uppercase italic tracking-tighter">AI Meta Synthesis</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">Inject product description to synthesize highly optimized semantic metadata using our Neural SEO node.</p>
                     </div>
                     <button className="px-10 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:bg-primary-500 transition-all active:scale-95">Activate Synthesis</button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSeoManagement;