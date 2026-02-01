
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ShoppingCart, Package, DollarSign,
  TrendingUp, TrendingDown, Activity, ShieldCheck, ArrowUpRight,
  LayoutGrid, BarChart3, Globe, Database, CreditCard,
  FileText, Megaphone, HelpCircle, MessageSquare, Briefcase,
  Settings, Lock, Key, Server, Search, Bell, Cpu, Zap,
  Tags, Receipt, HeadphonesIcon, MousePointerClick,
  PieChart, GitMerge, Box, CloudDownload
} from 'lucide-react';
import { MockApiService } from '../MockApiService';
import { useAuth, useNavigation } from '../store';
import OnboardingWizard from './OnboardingWizard';
import { AppView } from '../types';

const CountUp = ({ value, prefix = "" }: { value: number, prefix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = Math.ceil(end / 40); // Faster duration
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{count.toLocaleString()}</span>;
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [stats, setStats] = useState<any>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await MockApiService.getStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return null;

  const KPIS = [
    { label: 'Net Revenue', value: stats.revenue, prefix: '$', growth: '+14.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Personnel', value: stats.userCount, growth: '+5.2%', trend: 'up', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Architectural Assets', value: stats.projectCount, growth: '+2.1%', trend: 'up', icon: Package, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Order Velocity', value: stats.orderCount, growth: '-4.3%', trend: 'down', icon: ShoppingCart, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  /* --- COMMAND MATRIX CONFIGURATION --- */
  const SYSTEM_MODULES = [
    {
      category: "Growth & Architecture",
      color: "from-blue-500/20 to-cyan-500/5",
      icon: Cpu,
      items: [
        { label: 'Asset Manager', desc: 'Product forge & catalogue', icon: Box, route: 'admin-projects' },
        { label: 'Growth Engine', desc: 'SEO & traffic intelligence', icon: Globe, route: 'admin-seo' },
        { label: 'Referral System', desc: 'Viral growth mechanics', icon: GitMerge, route: 'admin-referrals' },
      ]
    },
    {
      category: "Commerce & Operations",
      color: "from-emerald-500/20 to-teal-500/5",
      icon: Zap,
      items: [
        { label: 'Global Analytics', desc: 'Deep data observatory', icon: BarChart3, route: 'admin-analytics' },
        { label: 'Order Control', desc: 'Transaction pipeline', icon: Receipt, route: 'admin-orders' },
        { label: 'Revenue & Tax', desc: 'Financial health', icon: PieChart, route: 'admin-payments' },
        { label: 'Coupons / Offers', desc: 'Incentive logic', icon: Tags, route: 'admin-coupons' },
      ]
    },
    {
      category: "Nexus Support",
      color: "from-amber-500/20 to-orange-500/5",
      icon: HeadphonesIcon,
      items: [
        { label: 'Ticket Center', desc: 'Issue resolution', icon: HelpCircle, route: 'admin-support' },
        { label: 'Enquiry Hub', desc: 'Sales communication', icon: MessageSquare, route: 'admin-enquiries' },
        { label: 'User Feedback', desc: 'Sentiment analysis', icon: Megaphone, route: 'admin-feedback' },
      ]
    },
    {
      category: "System Core",
      color: "from-slate-500/20 to-zinc-500/5",
      icon: Server,
      items: [
        { label: 'Personnel', desc: 'User administration', icon: Users, route: 'admin-users' },
        { label: 'Team Roles', desc: 'Permission matrix', icon: Key, route: 'admin-roles' },
        { label: 'Audit Logs', desc: 'Forensic timeline', icon: Activity, route: 'admin-logs' },
        { label: 'Config Main', desc: 'System parameters', icon: Settings, route: 'admin-settings' },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-32 max-w-[1920px] mx-auto">

      {/* --- HEADER: COMMAND DECK --- */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 lg:p-12 mb-8">
        <div className="absolute top-0 right-0 p-32 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              System Operational
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
              System Intelligence
            </h1>
            <p className="text-zinc-400 max-w-xl text-sm leading-relaxed border-l-2 border-emerald-500/50 pl-4">
              Welcome back, <span className="text-white font-bold">{user?.name}</span>.
              The Nexus is currently operating at <span className="text-emerald-400 font-bold">98.4% efficiency</span>.
              Review the matrix below for deeper interrogation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="group relative px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-200 transition-all rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-3 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Zap size={16} className="text-zinc-950" />
              Initialize Asset
            </button>
          </div>
        </div>
      </section>

      {/* --- LIVE TELEMETRY (KPIs) --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 rounded-2xl hover:border-primary-500/30 transition-all overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-16 ${kpi.bg} blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon size={20} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700 ${kpi.color}`}>
                  {kpi.growth}
                  {kpi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                </div>
              </div>
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-1">
                <CountUp value={kpi.value} prefix={kpi.prefix} />
              </div>
              <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                {kpi.label}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- OPERATIONAL MATRIX (THE MAIN NAVIGATION GRID) --- */}
      <h2 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3 mt-12 mb-6">
        <LayoutGrid size={24} className="text-primary-500" />
        Operational Matrix
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {SYSTEM_MODULES.map((col, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="flex flex-col gap-3"
          >
            <div className={`p-4 rounded-xl bg-gradient-to-br ${col.color} border border-white/5 flex items-center gap-3`}>
              <col.icon size={18} className="text-white/80" />
              <span className="text-xs font-black uppercase tracking-widest text-white/90">{col.category}</span>
            </div>

            <div className="flex flex-col gap-2">
              {col.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={() => navigate(item.route as any)}
                  className="group relative flex items-center justify-between p-4 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/60 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-950 text-zinc-500 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-colors">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-zinc-200 group-hover:text-primary-500 transition-colors">{item.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">{item.desc}</div>
                    </div>
                  </div>
                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <ArrowUpRight size={14} className="text-primary-500" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- LIVE INTELLIGENCE FEED --- */}
      <h2 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3 mt-12 mb-6">
        <Activity size={24} className="text-emerald-500" />
        Live Intelligence
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forensic Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest dark:text-zinc-400">System Forensics</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-500 uppercase">Live Stream</span>
            </div>
          </div>

          <div className="space-y-0">
            {[
              { label: 'Admin Login', detail: 'Authorized from San Francisco, CA', time: '12s ago', type: 'security', icon: ShieldCheck, color: 'text-emerald-500' },
              { label: 'Role Modified', detail: 'Elevated Sarah Jenkins to Editor', time: '4m ago', type: 'personnel', icon: Users, color: 'text-blue-500' },
              { label: 'Asset Purge', detail: 'Deleted unused temporary manifests', time: '12m ago', type: 'system', icon: Database, color: 'text-amber-500' },
              { label: 'Backup Sync', detail: 'Global cloud replication successful', time: '45m ago', type: 'system', icon: CloudDownload, color: 'text-violet-500' },
              { label: 'Transaction', detail: 'New Enterprise License sold ($2,400)', time: '1h ago', type: 'commerce', icon: DollarSign, color: 'text-emerald-400' },
            ].map((act, i) => (
              <div key={i} className="group flex gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all border-b border-dashed border-slate-100 dark:border-zinc-800/50 last:border-0">
                <div className={`mt-1 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-800 ${act.color}`}>
                  {/* For simplicity we re-use ShieldCheck if icon generic, but mapped above */}
                  <act.icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 dark:text-zinc-200">{act.label}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Sentinel Status</h3>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Server size={18} /></div>
                <div>
                  <div className="text-xs font-bold text-zinc-300">Core Systems</div>
                  <div className="text-[10px] text-zinc-500">Uptime: 99.99%</div>
                </div>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Database size={18} /></div>
                <div>
                  <div className="text-xs font-bold text-zinc-300">Data Shards</div>
                  <div className="text-[10px] text-zinc-500">Latency: 12ms</div>
                </div>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="pt-4 border-t border-white/10">
              <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                Run System Diagnostics
              </button>
              <button className="w-full mt-3 py-3 bg-transparent border border-white/20 text-zinc-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-white hover:border-white transition-colors">
                View Incident Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isWizardOpen && (
          <OnboardingWizard
            onClose={() => setIsWizardOpen(false)}
            onComplete={() => {
              setIsWizardOpen(false);
              window.location.reload(); // Refresh stats
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
