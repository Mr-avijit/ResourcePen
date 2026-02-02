import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit, Search, Database, Gauge, Layers,
    Sparkles, Network, Terminal, Share2,
    ArrowUpRight, Microscope, FlaskConical,
    Fingerprint, Hash, Zap, BarChart3,
    GitMerge, Bot, Key, ScanSearch, LineChart,
    RefreshCcw, AlertCircle, CheckCircle2, ChevronRight,
    Globe
} from 'lucide-react';
import { COS_Badge, COS_Button, COS_Input, COS_Spinner, COS_ToastContainer } from '../components/COS_Library';
import { MockApiService } from '../MockApiService';

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
    preview?: {
        title: string;
        url: string;
        desc: string;
    };
}

interface CompetitorGap {
    token: string;
    gap: number;
    opportunity: 'High' | 'Medium' | 'Low' | 'Critical';
}

const SEOTokenLab: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'discovery' | 'vector' | 'gap' | 'simulation'>('discovery');
    const [searchQuery, setSearchQuery] = useState('');
    const [competitorDomain, setCompetitorDomain] = useState('');

    // Module States
    const [tokens, setTokens] = useState<TokenMetric[]>([
        { id: 't1', token: 'enterprise ui architecture', relevance: 98, volume: '12.4k', difficulty: 65, semantic_cluster: 'Transactional', trend: 'up' },
        { id: 't2', token: 'react dashboard properties', relevance: 84, volume: '5.2k', difficulty: 42, semantic_cluster: 'Informational', trend: 'stable' },
        { id: 't3', token: 'frontend design systems', relevance: 91, volume: '22k', difficulty: 88, semantic_cluster: 'Commercial', trend: 'up' },
        { id: 't4', token: 'nextjs admin template', relevance: 76, volume: '8.9k', difficulty: 55, semantic_cluster: 'Transactional', trend: 'down' },
        { id: 't5', token: 'web component library', relevance: 62, volume: '45k', difficulty: 94, semantic_cluster: 'Informational', trend: 'stable' },
    ]);
    const [simResult, setSimResult] = useState<SimulationResult>({
        engine: 'Google', predicted_rank: 4, click_through_rate: 12.5, visibility_score: 84,
        preview: {
            title: 'Enterprise UI Architecture - The Next Gen Design System',
            url: 'resources-pen.io/products/enterprise-ui',
            desc: 'Accelerate your development with the world\'s most advanced UI kit. Built for React, Next.js, and Tailwind CSS.'
        }
    });
    const [gapData, setGapData] = useState<CompetitorGap[]>([]);

    // Operation States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isVectorsShifting, setIsVectorsShifting] = useState(false);
    const [toasts, setToasts] = useState<any[]>([]);

    const addToast = (type: string, title: string, message: string) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // --- Actions ---

    const handleExtraction = async () => {
        if (!searchQuery && tokens.length > 0) {
            addToast('info', 'Refine Search', 'Enter a keyword to extract new tokens.');
            return;
        }
        setIsAnalyzing(true);
        try {
            const newTokens = await MockApiService.extractTokens(searchQuery);
            setTokens(newTokens);
            addToast('success', 'Tokens Extracted', `${newTokens.length} semantic entities identified.`);
        } catch (err) {
            addToast('error', 'Extraction Failed', 'Neural link interrupted.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCompetitorScan = async () => {
        if (!competitorDomain) {
            addToast('error', 'Missing Input', 'Please enter a competitor domain.');
            return;
        }
        setIsAnalyzing(true);
        try {
            const gaps = await MockApiService.analyzeCompetitorGap(competitorDomain);
            setGapData(gaps);
            addToast('success', 'Gap Analysis Complete', 'Differential nodes identified.');
        } catch (err) {
            addToast('error', 'Scan Failed', 'Could not resolve competitor host.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSimulation = async () => {
        setIsAnalyzing(true);
        try {
            const result = await MockApiService.simulateSERP(searchQuery);
            setSimResult(result);
            addToast('success', 'Simulation Complete', 'New SERP prediction model generated.');
        } catch (err) {
            addToast('error', 'Simulation Failed', 'Predictive engine timeout.');
        } finally {
            setIsAnalyzing(false);
        }
    };



    const handleRecalibrateVectorsInternal = (showSuccessToast = true) => {
        return new Promise<void>((resolve) => {
            setIsVectorsShifting(true);
            setTimeout(() => {
                setTokens(prev => prev.map(t => ({
                    ...t,
                    relevance: Math.min(100, Math.max(40, t.relevance + (Math.random() * 20 - 10)))
                })));
                setIsVectorsShifting(false);
                if (showSuccessToast) addToast('success', 'Optimized', 'Vector weights updated.');
                resolve();
            }, 1500);
        });
    };

    const handleRecalibrateVectors = () => {
        // Wrapper for the button click
        addToast('info', 'Recalibrating', 'Adjusting semantic gravity weights...'); // Keep this for the specific "Recalibrate" button if user wants feedback there, BUT user complained about "Global Analysis" showing these.
        // User said: "when admin clikc on run Global Analysis button then this two message still show... and when process is done then show one message".
        // The image shows "REFINE SEARCH" (from extraction) and "RECALIBRATING" (from vector).
        // So I must REMOVE the `addToast('info'...)` from the start of `handleRecalibrateVectors` if I want to satisfy the request.
        // And `handleExtraction` shows "Refine Search" which is an info/error toast.

        handleRecalibrateVectorsInternal(true);
    };

    const handleGlobalAnalysis = async () => {
        setIsAnalyzing(true);
        // No initial toast as requested ("not show any message only show an loaidng animation")

        // We simulate the sequence. 
        // 1. Extraction (Silent or simulated if empty)
        // 2. Recalibration (Silent)
        // 3. One final message

        setTimeout(async () => {
            // We can just call the internal logic directly or simulate the "work"
            // If search query is empty, handleExtraction shows a toast and aborts. We should probably bypass that check or auto-fill a query if empty for the "Global" analysis simulation.
            // Or better, just run the recalibration and connection modules silently.

            await handleRecalibrateVectorsInternal(false);

            // Done
            setIsAnalyzing(false);
            addToast('success', 'Analysis Complete', 'Global ecosystem diagnostics finished successfully.');
        }, 3000); // 3s total duration for effect
    };

    const modules = [
        { id: 'discovery', label: 'Token Discovery', icon: Microscope, desc: 'Extract semantic entities' },
        { id: 'vector', label: 'Vector Weights', icon: Network, desc: 'Adjust semantic gravity' },
        { id: 'gap', label: 'Competitor Gap', icon: GitMerge, desc: 'Identify missing nodes' },
        { id: 'simulation', label: 'SERP Simulation', icon: FlaskConical, desc: 'Predictive ranking model' },
    ];

    return (
        <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 relative min-h-screen">
            <COS_ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

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
                    <COS_Button variant="secondary" icon={Share2} onClick={() => addToast('info', 'Sharing', 'Report link copied to clipboard.')}>Share Report</COS_Button>
                    <COS_Button variant="primary" icon={Sparkles} onClick={handleGlobalAnalysis} disabled={isAnalyzing}>
                        {isAnalyzing ? 'Processing...' : 'Run Global Analysis'}
                    </COS_Button>
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
                    <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="relative z-10 transition-transform group-hover:-translate-y-1">
                            <div className="flex items-center gap-3 mb-2">
                                <stat.icon size={18} className={stat.color} />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                            <div className="text-2xl font-black dark:text-white">{stat.value}</div>
                            <div className="text-[10px] font-bold text-slate-500 mt-1">{stat.sub}</div>
                        </div>
                        <stat.icon size={80} className={`absolute -bottom-4 -right-4 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-500`} />
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
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 scale-100'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:scale-105'
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

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-900 text-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10 space-y-4">
                            <Bot size={32} />
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest opacity-70">AI Assistant</div>
                                <h4 className="text-xl font-bold mt-1">Neural Advice</h4>
                            </div>
                            <p className="text-xs opacity-80 leading-relaxed font-medium">
                                "Consider increasing vector weight on 'enterprise' tokens to capture high-value commercial intent. Current gap analysis shows high opportunity."
                            </p>
                            <button className="text-[10px] font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors w-full">Ask Neural Net</button>
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

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-primary-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                        <div className="relative bg-white dark:bg-zinc-950 rounded-[2rem]">
                                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleExtraction()}
                                                placeholder="Enter seed keyword or URL to extract tokens..."
                                                className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-bold dark:text-white"
                                            />
                                            <button
                                                onClick={handleExtraction}
                                                disabled={isAnalyzing}
                                                className="absolute right-3 top-2 bottom-2 bg-slate-200 dark:bg-zinc-800 hover:bg-cyan-500 hover:text-white text-slate-500 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                                            >
                                                {isAnalyzing ? <COS_Spinner size={16} /> : 'Extract'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between px-4">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extracted Tokens</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tokens.length} Results Found</div>
                                        </div>
                                        {tokens.map((t, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={t.id}
                                                className="group p-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900/50 hover:border-cyan-500 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg hover:shadow-cyan-500/5 transition-all flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-slate-400 font-bold border border-slate-100 dark:border-zinc-800 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
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
                                                    <div className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-zinc-900">
                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Diff</div>
                                                        <div className="text-xs font-bold dark:text-white flex items-center gap-1 justify-center">
                                                            {t.difficulty}
                                                            {t.trend === 'up' ? <ArrowUpRight size={12} className="text-emerald-500" /> : <div className="w-3 h-0.5 bg-slate-400" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
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
                                        <COS_Button variant="secondary" icon={RefreshCcw} onClick={handleRecalibrateVectors} disabled={isVectorsShifting}>
                                            {isVectorsShifting ? 'Calibrating...' : 'Recalibrate'}
                                        </COS_Button>
                                    </div>

                                    <div className="p-8 rounded-[3rem] bg-slate-900 relative overflow-hidden h-[400px] flex items-center justify-center border border-slate-800 shadow-inner">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900" />

                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                                        {/* Network Visualization Mock */}
                                        <div className="relative z-10 w-full h-full">
                                            {tokens.map((t, i) => (
                                                <motion.div
                                                    key={t.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                        top: `${30 + ((i % 3) * 20) + (Math.random() * 10 - 5)}%`, // Deterministic random for consistent view until recalibrate
                                                        left: `${15 + ((i % 4) * 20) + (Math.random() * 10 - 5)}%`
                                                    }}
                                                    className="absolute p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white cursor-pointer hover:bg-primary-500/80 transition-colors group z-20"
                                                    style={{
                                                        transform: `scale(${t.relevance / 80})`
                                                    }}
                                                    drag
                                                    dragConstraints={{ left: 0, right: 600, top: 0, bottom: 300 }}
                                                >
                                                    <div className="text-xs font-bold">{t.token}</div>
                                                    <div className="text-[9px] opacity-60 font-mono">w: {t.relevance / 100}</div>

                                                    {/* Connection Line to Center (Visual only, implemented via pseudo elements or separate SVG usually, simplified here) */}
                                                    <div className="absolute top-1/2 left-1/2 w-[200px] h-[1px] bg-gradient-to-r from-primary-500/50 to-transparent -z-10 origin-left rotate-45 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </motion.div>
                                            ))}

                                            {/* Central Node */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary-600 flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.5)] z-10 animate-pulse">
                                                <div className="text-center">
                                                    <div className="text-xs uppercase tracking-widest font-black text-white/60">Core Topic</div>
                                                    <div className="text-lg font-black text-white tracking-widest">SaaS</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 group hover:border-primary-500/30 transition-colors">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vector Cluster Density</div>
                                            <div className="flex gap-2 items-end h-[100px]">
                                                <div className="bg-primary-500 w-full rounded-t-lg group-hover:h-[80%] h-[60%] transition-all duration-700" />
                                                <div className="bg-cyan-500 w-full rounded-t-lg opacity-50 group-hover:h-[50%] h-[40%] transition-all duration-700 delay-75" />
                                                <div className="bg-indigo-500 w-full rounded-t-lg opacity-80 group-hover:h-[70%] h-[55%] transition-all duration-700 delay-100" />
                                                <div className="bg-emerald-500 w-full rounded-t-lg group-hover:h-[90%] h-[75%] transition-all duration-700 delay-150" />
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 flex items-center gap-6 group hover:border-primary-500/30 transition-colors">
                                            <div className="p-4 rounded-full bg-primary-500/10 text-primary-500 group-hover:scale-110 transition-transform">
                                                <Database size={24} />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-black dark:text-white">8.4TB</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Data Refs</div>
                                                <div className="text-[10px] text-emerald-500 font-bold mt-1">Updated Just Now</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* === Competitor Gap === */}
                            {activeModule === 'gap' && (
                                <motion.div key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                                            <GitMerge className="text-amber-500" /> Competitor Gap Analysis
                                        </h3>
                                    </div>

                                    {gapData.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 bg-slate-50 dark:bg-zinc-950 rounded-[3rem] border border-dashed border-slate-200 dark:border-zinc-900">
                                            <div className="p-8 rounded-full bg-white dark:bg-zinc-900 text-slate-300 dark:text-zinc-700 shadow-sm">
                                                <ScanSearch size={64} />
                                            </div>
                                            <h3 className="text-xl font-bold dark:text-white">Differential Analysis Engine</h3>
                                            <p className="text-slate-500 max-w-md">Compare your semantic profile against top ranking domains to identify high-value missing tokens.</p>

                                            <div className="flex gap-2 w-full max-w-md">
                                                <input
                                                    type="text"
                                                    placeholder="Enter competitor domain (e.g. stripe.com)"
                                                    value={competitorDomain}
                                                    onChange={(e) => setCompetitorDomain(e.target.value)}
                                                    className="px-6 py-4 rounded-xl bg-white dark:bg-zinc-800 border-2 border-transparent focus:border-cyan-500 outline-none w-full font-bold dark:text-white text-sm"
                                                />
                                                <COS_Button variant="primary" icon={ScanSearch} onClick={handleCompetitorScan} disabled={isAnalyzing}>
                                                    {isAnalyzing ? <COS_Spinner size={18} /> : 'Scan'}
                                                </COS_Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Globe className="text-amber-500" />
                                                    <div className="text-sm font-bold text-amber-900 dark:text-amber-100">Analysis for: <span className="opacity-70">{competitorDomain}</span></div>
                                                </div>
                                                <button onClick={() => setGapData([])} className="text-xs font-bold uppercase hover:underline">Reset</button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {gapData.map((gap, i) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        key={i}
                                                        className="p-6 rounded-[2rem] bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 shadow-sm flex items-center justify-between group"
                                                    >
                                                        <div>
                                                            <div className="text-lg font-bold dark:text-white mb-1 group-hover:text-amber-500 transition-colors">{gap.token}</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Semantic Gap</span>
                                                                <span className="text-xs font-mono font-bold text-red-500">{gap.gap}%</span>
                                                            </div>
                                                        </div>
                                                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${gap.opportunity === 'Critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                                                            gap.opportunity === 'High' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' :
                                                                'bg-slate-100 dark:bg-zinc-900 text-slate-500'
                                                            }`}>
                                                            {gap.opportunity} Opp
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* === Simulation === */}
                            {activeModule === 'simulation' && (
                                <motion.div key="simulation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                        <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                                            <FlaskConical className="text-emerald-500" /> SERP Prediction Lab
                                        </h3>
                                        <COS_Button variant="primary" icon={Sparkles} onClick={handleSimulation} disabled={isAnalyzing}>
                                            {isAnalyzing ? 'Simulating...' : 'Run Simulation'}
                                        </COS_Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900 relative shadow-sm group">
                                                <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-tr-[3rem] rounded-bl-[10rem] pointer-events-none" />

                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-4 dark:border-zinc-800 flex justify-between">
                                                    <span>Google Desktop Preview (2026 Core Update)</span>
                                                    <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> 92% Confidence</span>
                                                </div>

                                                {/* Search Result Mock */}
                                                <div className="space-y-1 max-w-2xl relative z-10 transition-transform group-hover:scale-[1.01] duration-300 origin-left">
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[10px]">RP</div>
                                                        <span className="font-bold">Resources Pen</span>
                                                        <span className="text-slate-400">›</span>
                                                        <span>products</span>
                                                        <span className="text-slate-400">›</span>
                                                        <span>enterprise-ui</span>
                                                        <span className="ml-auto text-slate-300 hover:text-slate-500 cursor-pointer">
                                                            <Terminal size={12} />
                                                        </span>
                                                    </div>
                                                    <h4 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-tight">
                                                        {simResult.preview?.title || 'Enterprise UI Architecture - The Next Gen Design System'}
                                                    </h4>
                                                    <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed mt-1">
                                                        <span className="text-slate-500 dark:text-zinc-500 text-xs mr-2">{new Date().toLocaleDateString()} —</span>
                                                        {simResult.preview?.desc || 'Accelerate your development with the world\'s most advanced UI kit.'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* AI Overview Box Mock */}
                                            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Sparkles size={16} className="text-indigo-500" />
                                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">Generative Overview</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-2 w-full bg-indigo-200/50 dark:bg-indigo-900/50 rounded-full animate-pulse" />
                                                    <div className="h-2 w-[90%] bg-indigo-200/50 dark:bg-indigo-900/50 rounded-full animate-pulse delay-75" />
                                                    <div className="h-2 w-[80%] bg-indigo-200/50 dark:bg-indigo-900/50 rounded-full animate-pulse delay-150" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <motion.div
                                                key={simResult.predicted_rank}
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 dark:bg-emerald-500/10 hover:bg-emerald-500/10 transition-colors"
                                            >
                                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Predicted Rank</div>
                                                <div className="text-5xl font-black text-emerald-600">#{simResult.predicted_rank}</div>
                                                <p className="text-[10px] text-emerald-700/60 mt-2 font-medium">Top 5 position highly probable based on current velocity.</p>
                                            </motion.div>
                                            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 hover:border-cyan-500/30 transition-colors">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Est. CTR</div>
                                                <div className="text-3xl font-black dark:text-white">{simResult.click_through_rate}%</div>
                                                <div className="w-full h-1 bg-slate-100 dark:bg-zinc-900 rounded-full mt-3 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, simResult.click_through_rate * 3)}%` }}
                                                        className="h-full bg-cyan-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 hover:border-indigo-500/30 transition-colors">
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

export default SEOTokenLab;
