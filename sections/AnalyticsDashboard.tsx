
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Download, DollarSign, Activity, ShieldCheck,
  TrendingUp, TrendingDown, RefreshCcw, Cpu, Globe,
  Server, Zap, Eye, AlertTriangle, Layers, Filter
} from 'lucide-react';
import { MockApiService } from '../MockApiService';

// --- Types & Helpers ---
type TimeRange = '1h' | '24h' | '7d' | '30d';
type MetricType = 'traffic' | 'revenue' | 'performance' | 'errors';

const generateMockData = (points: number, type: MetricType) => {
  return Array.from({ length: points }).map((_, i) => {
    const base = type === 'revenue' ? 5000 : type === 'traffic' ? 800 : type === 'performance' ? 95 : 2;
    const variance = type === 'revenue' ? 2000 : type === 'traffic' ? 300 : type === 'performance' ? 5 : 5;
    return Math.max(0, base + Math.random() * variance - (variance / 2));
  });
};

const CustomAreaChart = ({ data, color, height = 200 }: { data: number[], color: string, height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = 100 / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * stepX;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M 0,100 ${points} L 100,100 Z`;
  const linePath = `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')}`;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`var(--color-${color}-500)`} stopOpacity="0.2" />
            <stop offset="100%" stopColor={`var(--color-${color}-500)`} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid Lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />

        <motion.path
          d={areaPath}
          fill={`url(#grad-${color})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={`var(--color-${color}-500)`}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

const MetricCard = ({ label, value, trend, isActive, onClick, icon: Icon, color }: any) => (
  <button
    onClick={onClick}
    className={`relative p-6 rounded-2xl border transition-all text-left w-full h-full group overflow-hidden ${isActive
      ? 'bg-zinc-900 border-primary-500/50 shadow-2xl shadow-primary-500/10'
      : 'bg-white dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
      }`}
  >
    <div className={`absolute top-0 right-0 p-20 rounded-full blur-3xl transition-opacity duration-500 ${isActive ? `bg-${color}-500/10 opacity-100` : 'opacity-0 bg-zinc-500/5'}`} />

    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg transition-colors ${isActive ? `bg-${color}-500 text-white` : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md ${isActive ? 'bg-white/10 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
          {trend}
          <TrendingUp size={12} />
        </div>
      </div>
      <div>
        <div className={`text-2xl font-display font-black tracking-tighter mb-1 ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          {value}
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-slate-400 dark:text-zinc-500'}`}>
          {label}
        </div>
      </div>
    </div>
  </button>
);

const AnalyticsDashboard: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('traffic');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [chartData, setChartData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data fetch
  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setChartData(generateMockData(24, activeMetric));
      setIsLoading(false);
    }, 400);
  }, [activeMetric, timeRange]);

  const metricConfig = {
    traffic: { color: 'blue', label: 'Global Traffic', value: '842.5K', icon: Globe },
    revenue: { color: 'emerald', label: 'Net Revenue', value: '$124.2K', icon: DollarSign },
    performance: { color: 'violet', label: 'Sys. Health', value: '99.9%', icon: Cpu },
    errors: { color: 'rose', label: 'Error Rate', value: '0.04%', icon: AlertTriangle },
  };

  const currentConfig = metricConfig[activeMetric];

  return (
    <div className="space-y-8 pb-32 max-w-[1920px] mx-auto text-slate-900 dark:text-slate-100">

      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Activity size={12} className="animate-pulse" />
            Live Telemetry
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight dark:text-white">
            Data Observatory
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mt-2 max-w-lg">
            Real-time visualization of system performance, financial throughput, and global traffic nodes.
          </p>
        </div>
        <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
          {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range
                ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* --- METRIC SELECTORS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(metricConfig) as MetricType[]).map((key) => (
          <MetricCard
            key={key}
            {...metricConfig[key]}
            trend="+12%"
            isActive={activeMetric === key}
            onClick={() => setActiveMetric(key)}
          />
        ))}
      </div>

      {/* --- MAIN CHART DECK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: VISUALIZATION */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-3">
                <currentConfig.icon className={`text-${currentConfig.color}-500`} size={20} />
                {currentConfig.label} Analysis
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                DATA SOURCE: SHARD-04 // LATENCY: 12ms
              </p>
            </div>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Download size={20} />
            </button>
          </div>

          <div className="flex-1 w-full relative group">
            <AnimatePresence mode="wait">
              {!isLoading && (
                <motion.div
                  key={activeMetric + timeRange}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <CustomAreaChart
                    data={chartData}
                    //@ts-ignore - dynamic abstract colors
                    color={currentConfig.color}
                    height={350}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover Crosshair Simulation */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 dark:bg-zinc-700 border-l border-dashed border-slate-400" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 dark:bg-zinc-700 border-t border-dashed border-slate-400" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded">
                LIVE DATA
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800/50">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">00:00</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">06:00</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">12:00</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">18:00</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">NOW</div>
          </div>
        </div>

        {/* RIGHT: BREAKDOWN & LOGS */}
        <div className="space-y-6">

          {/* Status Breakdown - Top Consumers */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Top Performers</h3>
            <div className="space-y-4">
              {[
                { label: 'Enterprise Dashboard', val: '42%', color: 'bg-emerald-500' },
                { label: 'SaaS Starter Kit', val: '28%', color: 'bg-blue-500' },
                { label: 'E-Commerce UI', val: '15%', color: 'bg-violet-500' },
                { label: 'Portfolio Net', val: '9%', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-700 dark:text-zinc-300">{item.label}</span>
                    <span className="text-slate-900 dark:text-white">{item.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: item.val }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Signal Feed */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Signal Feed</h3>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            </div>

            <div className="space-y-4 relative z-10">
              {[
                { msg: "Spike detected in US-East", type: "warn", time: "2s" },
                { msg: "Backup routine visualized", type: "info", time: "45s" },
                { msg: "New API Key generated", type: "info", time: "2m" },
                { msg: "Latency normalized", type: "success", time: "5m" },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-xs font-mono border-l border-zinc-800 pl-3">
                  <span className="text-zinc-500">{log.time}</span>
                  <span className={log.type === 'warn' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2 border border-zinc-800 hover:border-zinc-600 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              View Raw Logs
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
