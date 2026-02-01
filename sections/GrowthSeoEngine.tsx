
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Search, Target, MousePointer2,
  BarChart3, ShieldCheck, Zap, Layers, Globe,
  Activity, ArrowUpRight, Filter, Download,
  Settings2, Sparkles, AlertCircle, CheckCircle2,
  PieChart, RefreshCcw, Layout, ShoppingCart,
  Terminal, Share2, Gauge, Cpu, Box, History,
  ShoppingBag, Star
} from 'lucide-react';
import { COS_Badge, COS_StatCard, COS_DataGrid, COS_Button, COS_Spinner } from '../components/COS_Library';
import { MockApiService } from '../MockApiService';
import { SEOKeyword, SEOAutomationRule, SEOPerformanceMetric } from '../types';

type EngineModule = 'intelligence' | 'intent' | 'cro' | 'ranking' | 'technical' | 'automation';

const GrowthSeoEngine: React.FC = () => {
  const [activeModule, setActiveModule] = useState<EngineModule>('intelligence');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Intelligence Data Store
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);
  const [performance, setPerformance] = useState<SEOPerformanceMetric[]>([]);
  const [rules, setRules] = useState<SEOAutomationRule[]>([]);

  useEffect(() => {
    loadEngineData();
  }, []);

  const loadEngineData = async () => {
    setIsLoading(true);
    const [kwData, ruleData, summary] = await Promise.all([
      MockApiService.getGlobalKeywords(),
      MockApiService.getSEOAutomationRules(),
      MockApiService.getGrowthSEOSummary('p-1')
    ]);
    setKeywords(kwData);
    setRules(ruleData);
    setPerformance(summary.performance);
    setIsLoading(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await loadEngineData();
    setIsSyncing(false);
  };

  const modules = [
    { id: 'intelligence', label: 'SEO Intelligence', icon: Sparkles, desc: 'Keyword clustering & semantic mapping' },
    { id: 'intent', label: 'Intent Engine', icon: Target, desc: 'Buyer journey & query alignment' },
    { id: 'cro', label: 'Conversion Ops', icon: MousePointer2, desc: 'Funnel & revenue optimization' },
    { id: 'ranking', label: 'Ranking Ledger', icon: TrendingUp, desc: 'Marketplace sales velocity' },
    { id: 'technical', label: 'Technical Pulse', icon: Terminal, desc: 'Indexing & vital telemetry' },
    { id: 'automation', label: 'Growth Auto', icon: Zap, desc: 'Smart rules & A/B testing' },
  ];

  if (isLoading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6 opacity-30">
      <COS_Spinner size={48} />
      <p className="font-black uppercase tracking-widest text-sm">Synchronizing Architecture...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-lg w-fit mb-4">
            <Activity size={12} /> Operational Engine Active
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black dark:text-white tracking-tight leading-none">
            GrowthSEO Engine<span className="text-primary-500">™</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-3 max-w-2xl">
            Enterprise command center for ranking optimization, intent capture, and marketplace conversion orchestration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            className={`p-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-slate-500 rounded-2xl hover:text-primary-500 transition-all ${isSyncing ? 'rotate-180 opacity-50' : ''}`}
          >
            <RefreshCcw size={20} />
          </button>
          <button className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-all flex items-center gap-3">
            <Download size={18} /> Global Analytics Export
          </button>
        </div>
      </div>

      {/* --- Core Metric Matrix --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <COS_StatCard label="Discoverability Index" value="84.2%" trend="+4.1%" isPositive icon={Globe} color="primary" />
        <COS_StatCard label="Conversion Velocity" value="3.8x" trend="+0.8x" isPositive icon={Zap} color="emerald" />
        <COS_StatCard label="Intent Alignment" value="92.4%" trend="+2.1%" isPositive icon={Target} color="indigo" />
        <COS_StatCard label="Organic Yield" value="$14.2k" trend="+18%" isPositive icon={BarChart3} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- Navigation Side Panel --- */}
        <div className="lg:col-span-3 space-y-2">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id as any)}
              className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all group ${activeModule === mod.id
                ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20 translate-x-2'
                : 'bg-white dark:bg-[#0c0c0c] text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900 border border-slate-200 dark:border-white/5'
                }`}
            >
              <div className={`p-3 rounded-2xl transition-colors ${activeModule === mod.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-900 group-hover:text-primary-500'}`}>
                <mod.icon size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-widest">{mod.label}</div>
                <div className={`text-[9px] font-medium opacity-60 line-clamp-1`}>{mod.desc}</div>
              </div>
            </button>
          ))}

          <div className="pt-10 space-y-4">
            <div className="p-6 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Gauge size={12} /> Sync Health
                </div>
                <div className="text-2xl font-black dark:text-white">99.8%</div>
                <p className="text-[9px] text-slate-400 mt-2 leading-relaxed">Crawl manifests and structured data nodes are perfectly synchronized with global indices.</p>
              </div>
              <Cpu size={120} className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </div>

        {/* --- Main Operational Canvas --- */}
        <div className="lg:col-span-9">
          <div className="glass p-10 rounded-[3.5rem] border border-slate-200 dark:border-zinc-900 shadow-sm min-h-[700px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeModule === 'intelligence' && (
                <motion.div key="intelligence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                        <Sparkles size={24} className="text-primary-500" /> Semantic Core
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Advanced keyword clustering and topical depth analysis from <b>seo_keywords</b>.</p>
                    </div>
                    <COS_Badge sentiment="success">AI Processing Live</COS_Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {keywords.map(kw => (
                      <div key={kw.keyword_id} className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 space-y-4">
                        <div className="text-xs font-bold dark:text-white line-clamp-1">{kw.keyword}</div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Vol.</div>
                            <div className="text-lg font-black dark:text-white">{kw.search_volume.toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] font-black text-primary-500 uppercase tracking-widest">{kw.intent_type}</div>
                            <COS_Badge sentiment={kw.difficulty > 70 ? 'danger' : kw.difficulty > 40 ? 'warning' : 'success'}>Diff: {kw.difficulty}</COS_Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6 pt-6">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Layers size={14} /> Product Discovery Ledger
                    </div>
                    <div className="glass rounded-[2rem] border dark:border-zinc-900 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-zinc-950/50 border-b dark:border-zinc-900">
                          <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Date Node</th>
                            <th className="py-5">Impressions</th>
                            <th className="py-5 text-center">Avg. Position</th>
                            <th className="px-8 py-5 text-right">Yield</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-zinc-900/50">
                          {performance.slice(0, 5).map(item => (
                            <tr key={item.metric_id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/20 transition-all cursor-default">
                              <td className="px-8 py-5 text-sm font-bold dark:text-zinc-200">{item.date}</td>
                              <td className="py-5 text-xs text-slate-500">{item.impressions.toLocaleString()}</td>
                              <td className="py-5 text-center">
                                <div className="inline-flex items-center gap-2 text-xs font-black dark:text-white">
                                  #{item.avg_position}
                                </div>
                              </td>
                              <td className="px-8 py-5 text-right font-black text-emerald-500">
                                ${item.revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeModule === 'automation' && (
                <motion.div key="automation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-primary-600/10 rounded-[2.5rem] flex items-center justify-center text-primary-500 border-2 border-primary-500/20 shadow-2xl">
                        <Zap size={48} className="animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2 max-w-xl">
                      <h3 className="text-3xl font-display font-black dark:text-white tracking-tighter">Active Decision Nodes</h3>
                      <p className="text-sm text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">
                        Monitoring <b>seo_automation_rules</b> collection. Logic triggers are live in production.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {rules.map(rule => (
                      <div key={rule.rule_id} className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 text-left group hover:border-primary-500 transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 w-fit group-hover:scale-110 transition-transform">
                            <Box size={24} className="text-primary-500" />
                          </div>
                          <COS_Badge sentiment={rule.status === 'active' ? 'success' : 'warning'}>{rule.status}</COS_Badge>
                        </div>
                        <div className="text-lg font-bold dark:text-white mb-2">{rule.rule_name}</div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 font-mono font-bold bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl">{rule.trigger_condition}</p>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span>Action: {rule.action_type}</span>
                          <span>Priority: {rule.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeModule === 'intent' && (
                <motion.div key="intent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                        <Target size={24} className="text-indigo-500" /> Buyer Journey Map
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Real-time analysis of user query intent and behavioral signals.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Informational', 'Transactional', 'Navigational'].map((type, i) => (
                      <div key={type} className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{type} Intent</div>
                          <div className="text-3xl font-display font-black dark:text-white mb-2">{[45, 32, 23][i]}%</div>
                          <div className="w-full bg-slate-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${[45, 32, 23][i]}%` }} />
                          </div>
                        </div>
                        <Target className="absolute -bottom-4 -right-4 text-slate-100 dark:text-zinc-900 w-24 h-24 group-hover:scale-110 transition-transform" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Query Stream</h4>
                    <div className="space-y-2">
                      {[
                        { q: "enterprise ui kit figma", intent: "Transactional", score: 98 },
                        { q: "react dashboard templates", intent: "Informational", score: 85 },
                        { q: "best admin panel 2025", intent: "Commercial", score: 92 },
                        { q: "documentation generator", intent: "Navigational", score: 76 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-900/50">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-xs font-bold">{item.score}</div>
                            <span className="text-sm font-bold dark:text-zinc-200">{item.q}</span>
                          </div>
                          <COS_Badge sentiment={item.intent === 'Transactional' ? 'success' : item.intent === 'Commercial' ? 'warning' : 'secondary'}>{item.intent}</COS_Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeModule === 'cro' && (
                <motion.div key="cro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                        <MousePointer2 size={24} className="text-pink-500" /> Conversion Ops
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Funnel optimization and A/B testing matrix.</p>
                    </div>
                    <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-pink-600 transition-colors">New Experiment</button>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-4 gap-8 text-center divide-x divide-white/10">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions</div>
                        <div className="text-2xl font-black">12.4k</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add to Cart</div>
                        <div className="text-2xl font-black text-blue-400">8.2%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checkout</div>
                        <div className="text-2xl font-black text-purple-400">4.1%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase</div>
                        <div className="text-2xl font-black text-emerald-400">2.8%</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Experiments</h4>
                      <div className="space-y-3">
                        {[
                          { name: "CTA Color Variant B", lift: "+12%", status: "Confidence 98%" },
                          { name: "Pricing Layout Grid", lift: "-2.4%", status: "Collecting Data" },
                          { name: "Hero Headline V3", lift: "+5.1%", status: "Confidence 80%" }
                        ].map((exp, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-zinc-950">
                            <div className="text-xs font-bold dark:text-zinc-300">{exp.name}</div>
                            <div className="text-right">
                              <div className={`text-xs font-black ${exp.lift.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{exp.lift}</div>
                              <div className="text-[9px] text-slate-400 font-medium">{exp.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900 flex items-center justify-center text-center">
                      <div className="space-y-4">
                        <PieChart size={48} className="text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-500 max-w-[200px]">Heatmap data is processing for the current period.</p>
                        <button className="text-primary-500 text-xs font-black uppercase tracking-widest hover:underline">View Heatmaps</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeModule === 'ranking' && (
                <motion.div key="ranking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                        <TrendingUp size={24} className="text-amber-500" /> SERP Ledger
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Global search position tracking across 14 data centers.</p>
                    </div>
                  </div>

                  <div className="glass rounded-[2rem] border dark:border-zinc-900 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 dark:bg-zinc-950/50 border-b dark:border-zinc-900">
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Keyword</th>
                          <th className="py-4 text-center">Rank</th>
                          <th className="py-4 text-center">Change</th>
                          <th className="px-6 py-4 text-right">Visibility</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-zinc-900/50">
                        {[
                          { kw: "enterprise ui kit", rank: 1, change: 0, vis: "100%" },
                          { kw: "react admin dashboard", rank: 3, change: 2, vis: "85%" },
                          { kw: "tailwind ui components", rank: 5, change: -1, vis: "62%" },
                          { kw: "design system figma", rank: 2, change: 1, vis: "94%" },
                          { kw: "nextjs starter kit", rank: 8, change: 4, vis: "41%" }
                        ].map((row, i) => (
                          <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/20 transition-all">
                            <td className="px-6 py-4 text-sm font-bold dark:text-zinc-200">{row.kw}</td>
                            <td className="py-4 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black ${row.rank <= 3 ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-zinc-900 dark:text-zinc-400'}`}>
                                {row.rank}
                              </span>
                            </td>
                            <td className="py-4 text-center text-xs font-bold">
                              {row.change > 0 ? <span className="text-emerald-500">+{row.change}</span> : row.change < 0 ? <span className="text-red-500">{row.change}</span> : <span className="text-slate-400">-</span>}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 h-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary-500" style={{ width: row.vis }} />
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">{row.vis}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeModule === 'technical' && (
                <motion.div key="technical" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-display font-black dark:text-white flex items-center gap-3">
                        <Terminal size={24} className="text-slate-500" /> Technical Pulse
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Core Web Vitals & indexing health metrics.</p>
                    </div>
                    <COS_Badge sentiment="success">Healthy</COS_Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "LCP", value: "0.8s", status: "Good", color: "text-emerald-500" },
                      { label: "FID", value: "12ms", status: "Good", color: "text-emerald-500" },
                      { label: "CLS", value: "0.02", status: "Good", color: "text-emerald-500" }
                    ].map(metric => (
                      <div key={metric.label} className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-900 text-center space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</div>
                        <div className={`text-3xl font-black ${metric.color}`}>{metric.value}</div>
                        <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} /> {metric.status}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-[2rem] bg-slate-900 text-white font-mono text-xs space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Terminal size={40} /></div>
                    <div className="text-emerald-400">root@growth-engine:~# check-health --verbose</div>
                    <div className="text-slate-400">&gt; Initiating spider crawl on node-01...</div>
                    <div className="text-slate-400">&gt; Checking canonical tags... <span className="text-emerald-400">OK</span></div>
                    <div className="text-slate-400">&gt; Validating sitemap.xml structure... <span className="text-emerald-400">OK</span></div>
                    <div className="text-slate-400">&gt; Analyzing render-blocking resources... <span className="text-amber-400">WARN (2)</span></div>
                    <div className="text-slate-400">&gt; Indexation status: 542/542 pages indexed.</div>
                    <div className="text-emerald-400 animate-pulse">_</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Performance Ledger Summary --- */}
      <section className="pt-24 border-t dark:border-zinc-900">
        <div className="p-12 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl group">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 space-y-6">
              <div className="p-3 bg-primary-600 rounded-2xl w-fit shadow-xl"><ShieldCheck size={32} /></div>
              <h4 className="text-4xl font-display font-black tracking-tighter leading-none">Search Performance Guard</h4>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">System is auditing <b>seo_performance_metrics</b> for temporal anomalies.</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Core Integrity', value: '100%', status: 'Optimal' },
                { label: 'Mapping Depth', value: 'Deep', status: 'Stable' },
                { label: 'Relational Sync', value: 'Instant', status: 'Active' },
              ].map(stat => (
                <div key={stat.label} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">{stat.label}</div>
                  <div className="text-2xl font-display font-black mb-1">{stat.value}</div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 size={10} /> {stat.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrowthSeoEngine;
