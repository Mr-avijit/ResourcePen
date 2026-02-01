import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit, Search, Database, Gauge, Layers,
    Sparkles, Network, Terminal, Share2,
    ArrowUpRight, Microscope, FlaskConical,
    Fingerprint, Hash, Zap, BarChart3,
    GitMerge, Bot, Key, ScanSearch, LineChart
} from 'lucide-react';
import { COS_Badge, COS_Button, COS_Input } from '../components/COS_Library';

// Types for the Lab
interface TokenMetric {
    id: string;
    token: string;
    relevance: number; // 0-100
    volume: string;
    difficulty: number; // 0-100
    semantic_cluster: 'Transactional' | 'Informational' | 'Navigational' | 'Commercial';
    trend: 'up' | 'down' | 'stable';
}

interface SimulationResult {
    engine: 'Google' | 'Bing' | 'AI_Overview';
    predicted_rank: number;
    click_through_rate: number;
    visibility_score: number;
}

const SEOTokenLab: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'discovery' | 'vector' | 'gap' | 'simulation'>('discovery');
    const [searchQuery, setSearchQuery] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [tokens, setTokens] = useState<TokenMetric[]>([
        { id: 't1', token: 'enterprise ui architecture', relevance: 98, volume: '12.4k', difficulty: 65, semantic_cluster: 'Transactional', trend: 'up' },
        { id: 't2', token: 'react dashboard properties', relevance: 84, volume: '5.2k', difficulty: 42, semantic_cluster: 'Informational', trend: 'stable' },
        { id: 't3', token: 'frontend design systems', relevance: 91, volume: '22k', difficulty: 88, semantic_cluster: 'Commercial', trend: 'up' },
        { id: 't4', token: 'nextjs admin template', relevance: 76, volume: '8.9k', difficulty: 55, semantic_cluster: 'Transactional', trend: 'down' },
        { id: 't5', token: 'web component library', relevance: 62, volume: '45k', difficulty: 94, semantic_cluster: 'Informational', trend: 'stable' },
    ]);

    const [simResult, setSimResult] = useState<SimulationResult>({
        engine: 'Google', predicted_rank: 4, click_through_rate: 12.5, visibility_score: 84
    });

    const handleAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => setAnalyzing(false), 2000);
    };

    const modules = [
        { id: 'discovery', label: 'Token Discovery', icon: Microscope, desc: 'Extract semantic entities' },
        { id: 'vector', label: 'Vector Weights', icon: Network, desc: 'Adjust semantic gravity' },
        { id: 'gap', label: 'Competitor Gap', icon: GitMerge, desc: 'Identify missing nodes' },
        { id: 'simulation', label: 'SERP Simulation', icon: FlaskConical, desc: 'Predictive ranking model' },
    ];

    return (
        <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- Page Header --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20 rounded-lg w-fit mb-4">
                        <BrainCircuit size={12} /> Neural Lab Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black dark:text-white tracking-tight leading-none">
                        SEO Token Lab
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-3 max-w-2xl">
                        Advanced experimentation environment for semantic search entities, vector weight modulation, and predictive ranking simulations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <COS_Button variant="secondary" icon={Share2}>Share Report</COS_Button>
                    <COS_Button variant="primary" icon={Sparkles} onClick={handleAnalysis}>Run Global Analysis</COS_Button>
                </div>
            </div>

            {/* --- Lab Stats --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Token Density', value: 'High', sub: '94% Optimization', icon: Layers, color: 'text-primary-500' },
                    { label: 'Semantic Reach', value: '4.2M', sub: 'Global Entities', icon: GlobeIcon, color: 'text-cyan-500' },
                    { label: 'Predictive Accuracy', value: '98.2%', sub: 'AI Confidence', icon: Gauge, color: 'text-emerald-500' },
                    { label: 'Crawl Budget', value: 'Optimal', sub: '0.4s Latency', icon: Zap, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <stat.icon size={18} className={stat.color} />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                            <div className="text-2xl font-black dark:text-white">{stat.value}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1">{stat.sub}</div>
                        </div>
                        <stat.icon size={80} className={`absolute -bottom-4 -right-4 opacity-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* --- Sidebar --- */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="p-2 bg-white dark:bg-[#0c0c0c] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                        {modules.map(mod => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveModule(mod.id as any)}
                                className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all mb-1 ${activeModule === mod.id
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900'
                                    }`}
                            >
                                <div className={`p-2 rounded-xl ${activeModule === mod.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-800'}`}>
                                    <mod.icon size={18} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-black uppercase tracking-widest">{mod.label}</div>
                                    <div className="text-[9px] font-medium opacity-70 line-clamp-1">{mod.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-900 text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <Bot size={32} />
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest opacity-70">AI Assistant</div>
                                <h4 className="text-xl font-bold mt-1">Neural Advice</h4>
                            </div>
                            <p className="text-xs opacity-80 leading-relaxed font-medium">
                                "Consider increasing vector weight on 'enterprise' tokens to capture high-value commercial intent."
                            </p>
                        </div>
                        <BrainCircuit size={150} className="absolute -bottom-10 -right-10 opacity-10" />
                    </div>
                </div>

                {/* --- Main Workspace --- */}
                <div className="lg:col-span-9">
                    <div className="min-h-[600px] p-8 rounded-[3.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
                        <AnimatePresence mode="wait">

                            {/* === Discovery Module === */}
                            {activeModule === 'discovery' && (
                                <motion.div key="discovery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                                            <Microscope className="text-cyan-500" /> Token Extraction
                                        </h3>
                                        <COS_Badge sentiment="success">Live Indexing</COS_Badge>
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Enter seed keyword or URL to extract tokens..."
                                            className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-bold dark:text-white"
                                        />
                                        {analyzing && <div className="absolute right-6 top-1/2 -translate-y-1/2"><div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between px-4">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extracted Tokens</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5 Results Found</div>
                                        </div>
                                        {tokens.map(t => (
                                            <div key={t.id} className="group p-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/50 hover:border-cyan-500 transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-400 font-bold border border-slate-100 dark:border-zinc-800">
                                                        <Hash size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold dark:text-white text-lg">{t.token}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${t.semantic_cluster === 'Transactional' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                    t.semantic_cluster === 'Commercial' ? 'bg-amber-500/10 text-amber-500' :
                                                                        'bg-blue-500/10 text-blue-500'
                                                                }`}>
                                                                {t.semantic_cluster}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 font-mono">{t.volume} Vol</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8 text-right">
                                                    <div className="space-y-1">
                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Relevance</div>
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <div className="w-20 h-1.5 bg-slate-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                                                                <div className="h-full bg-cyan-500" style={{ width: `${t.relevance}%` }} />
                                                            </div>
                                                            <span className="text-xs font-bold dark:text-white">{t.relevance}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diff</div>
                                                        <div className="text-xs font-bold dark:text-white flex items-center gap-1 justify-end">
                                                            {t.difficulty}
                                                            {t.trend === 'up' ? <ArrowUpRight size={12} className="text-emerald-500" /> : <div className="w-3 h-0.5 bg-slate-400" />}
                                                        </div>
                                                    </div>
                                                    <button className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-400 hover:text-cyan-500 transition-colors">
                                                        <Fingerprint size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* === Vector Module === */}
                            {activeModule === 'vector' && (
                                <motion.div key="vector" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                                            <Network className="text-primary-500" /> Semantic Vector Control
                                        </h3>
                                        <COS_Button variant="secondary" icon={RefreshCcwIcon}>Recalibrate</COS_Button>
                                    </div>

                                    <div className="p-8 rounded-[3rem] bg-slate-900 relative overflow-hidden h-[400px] flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900" />

                                        {/* Network Visualization Mock */}
                                        <div className="relative z-10 w-full h-full">
                                            {tokens.map((t, i) => (
                                                <motion.div
                                                    key={t.id}
                                                    className="absolute p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white cursor-pointer hover:bg-primary-500/80 transition-colors"
                                                    style={{
                                                        top: `${20 + (i * 15)}%`,
                                                        left: `${10 + (i * 18)}%`,
                                                        transform: `scale(${t.relevance / 80})`
                                                    }}
                                                    drag
                                                    dragConstraints={{ left: 0, right: 600, top: 0, bottom: 300 }}
                                                >
                                                    <div className="text-xs font-bold">{t.token}</div>
                                                    <div className="text-[9px] opacity-60 font-mono">w: {t.relevance / 100}</div>
                                                </motion.div>
                                            ))}

                                            {/* Central Node */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary-600 flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.5)] z-0">
                                                <div className="text-center">
                                                    <div className="text-xs uppercase tracking-widest font-black text-white/60">Core Topic</div>
                                                    <div className="text-lg font-black text-white">SaaS</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vector Cluster Density</div>
                                            <div className="flex gap-2 items-end">
                                                <div className="bg-primary-500 w-8 h-20 rounded-t-lg" />
                                                <div className="bg-cyan-500 w-8 h-12 rounded-t-lg opacity-50" />
                                                <div className="bg-indigo-500 w-8 h-16 rounded-t-lg opacity-80" />
                                                <div className="bg-emerald-500 w-8 h-24 rounded-t-lg" />
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 flex items-center gap-6">
                                            <div className="p-4 rounded-full bg-primary-500/10 text-primary-500">
                                                <Database size={24} />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-black dark:text-white">8.4TB</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Data Refs</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* === Competitor Gap === */}
                            {activeModule === 'gap' && (
                                <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6">
                                    <div className="p-8 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-300 dark:text-zinc-700">
                                        <GitMerge size={64} />
                                    </div>
                                    <h3 className="text-2xl font-display font-black dark:text-white">Competitor Differential Analysis</h3>
                                    <p className="text-slate-500 max-w-md">Compare your semantic profile against top ranking domains to identify high-value missing tokens.</p>
                                    <COS_Button variant="primary" icon={ScanSearch}>Scan Competitors</COS_Button>
                                </div>
                            )}

                            {/* === Simulation === */}
                            {activeModule === 'simulation' && (
                                <motion.div key="simulation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                                            <FlaskConical className="text-emerald-500" /> SERP Prediction Lab
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900 relative shadow-sm">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-4 dark:border-zinc-800 flex justify-between">
                                                    <span>Google Desktop Preview (2026 Core Update)</span>
                                                    <span className="text-emerald-500">92% Confidence</span>
                                                </div>

                                                {/* Search Result Mock */}
                                                <div className="space-y-1 max-w-2xl">
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800" />
                                                        <span>Resources Pen</span>
                                                        <span className="text-slate-400">›</span>
                                                        <span>products</span>
                                                        <span className="text-slate-400">›</span>
                                                        <span>enterprise-ui</span>
                                                    </div>
                                                    <h4 className="text-xl text-blue-600 hover:underline cursor-pointer font-medium">Enterprise UI Architecture - The Next Gen Design System</h4>
                                                    <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                                                        <span className="font-bold text-slate-800 dark:text-zinc-200">Nov 14, 2025</span> — Accelerate development with the world's most advanced UI kit. Built for <span className="font-bold">React</span>, <span className="font-bold">Next.js</span>, and <span className="font-bold">Tailwind CSS</span>.
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        <div className="px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-800 text-[10px] font-bold text-slate-500">Component Library</div>
                                                        <div className="px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-800 text-[10px] font-bold text-slate-500">SaaS</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 dark:bg-emerald-500/10">
                                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Predicted Rank</div>
                                                <div className="text-5xl font-black text-emerald-600">#{simResult.predicted_rank}</div>
                                                <p className="text-[10px] text-emerald-700/60 mt-2 font-medium">Top 5 position highly probable based on current velocity.</p>
                                            </div>
                                            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Est. CTR</div>
                                                <div className="text-3xl font-black dark:text-white">{simResult.click_through_rate}%</div>
                                            </div>
                                            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visibility Score</div>
                                                <div className="text-3xl font-black dark:text-white">{simResult.visibility_score}</div>
                                            </div>
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

// Icons helper
const GlobeIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);

const RefreshCcwIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
);

export default SEOTokenLab;
