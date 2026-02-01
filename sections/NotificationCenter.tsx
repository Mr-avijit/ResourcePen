import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Mail, Smartphone, Globe, Send, Plus, Search, 
  Filter, MoreVertical, Trash2, Edit3, Eye, Copy, 
  CheckCircle2, Clock, AlertCircle, Calendar, Users,
  Zap, Sparkles, Layout, MousePointer2, ChevronRight,
  Monitor, Smartphone as MobileIcon, Terminal, X,
  RefreshCcw, ArrowRight, ShieldCheck, BarChart3,
  Layers, Settings, Share2, Info
} from 'lucide-react';

// --- Types ---
type ChannelType = 'Email' | 'Push' | 'System' | 'SMS';
type NotifyStatus = 'Delivered' | 'Scheduled' | 'Draft' | 'Failed';
type AudienceSegment = 'All Architects' | 'Pro Members' | 'Enterprise Only' | 'New Users';

interface NotificationDispatch {
  id: string;
  title: string;
  channel: ChannelType;
  audience: AudienceSegment;
  status: NotifyStatus;
  sentAt: string;
  reach: number;
  openRate: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: ChannelType;
  lastEdited: string;
  previewColor: string;
}

// --- Mock Data ---
const MOCK_DISPATCHES: NotificationDispatch[] = [
  { id: 'TX-401', title: 'Horizon Dashboard v2.5 Update', channel: 'System', audience: 'All Architects', status: 'Delivered', sentAt: '2h ago', reach: 12480, openRate: '84%' },
  { id: 'TX-402', title: 'Exclusive: Enterprise UI Kit Early Access', channel: 'Email', audience: 'Enterprise Only', status: 'Scheduled', sentAt: 'Tomorrow, 09:00', reach: 840, openRate: '-' },
  { id: 'TX-403', title: 'New Web3 Interface Components Live', channel: 'Push', audience: 'Pro Members', status: 'Delivered', sentAt: '1d ago', reach: 5200, openRate: '12%' },
  { id: 'TX-404', title: 'System Maintenance Window', channel: 'System', audience: 'All Architects', status: 'Delivered', sentAt: '3d ago', reach: 12480, openRate: '98%' },
];

const MOCK_TEMPLATES: Template[] = [
  { id: 'TMP-01', name: 'Product Release Blast', description: 'High-impact layout for new asset drops.', type: 'Email', lastEdited: 'Oct 20', previewColor: 'primary' },
  { id: 'TMP-02', name: 'Security Alert Protocol', description: 'Critical warning for account anomalies.', type: 'System', lastEdited: 'Oct 12', previewColor: 'rose' },
  { id: 'TMP-03', name: 'Discount Reward Incentive', description: 'Marketing focused coupon delivery.', type: 'Push', lastEdited: 'Oct 15', previewColor: 'emerald' },
  { id: 'TMP-04', name: 'Waitlist Activation', description: 'Onboarding funnel for new architects.', type: 'Email', lastEdited: 'Sep 28', previewColor: 'amber' },
];

const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dispatches' | 'templates' | 'studio'>('dispatches');
  const [search, setSearch] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Broadcast Studio State
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    message: '',
    segment: 'All Architects',
    channel: 'System' as ChannelType,
    isScheduled: false,
    sendDate: ''
  });

  const filteredDispatches = useMemo(() => {
    return MOCK_DISPATCHES.filter(d => 
      d.title.toLowerCase().includes(search.toLowerCase()) || 
      d.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case 'Email': return <Mail size={16} />;
      case 'Push': return <Smartphone size={16} />;
      case 'System': return <Monitor size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const getStatusColor = (status: NotifyStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Scheduled': return 'bg-primary-500/10 text-primary-500 border-primary-500/20';
      case 'Draft': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      default: return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Page Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Reach Orchestrator
            <div className="p-1.5 rounded-lg bg-primary-600 text-white shadow-lg shadow-primary-500/20">
              <Bell size={16} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mt-1">Manage global broadcasts, automated triggers, and semantic templates.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-2xl p-1 shadow-sm">
              <button 
                onClick={() => setActiveTab('dispatches')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'dispatches' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Dispatch Logs
              </button>
              <button 
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'templates' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Architecture
              </button>
           </div>
           <button 
             onClick={() => setIsBroadcastOpen(true)}
             className="px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all flex items-center gap-2 active:scale-95"
           >
             <Send size={16} /> Initiate Broadcast
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dispatches' && (
          <motion.div 
            key="dispatches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Control Strip */}
            <div className="glass p-4 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter transmissions by identity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all dark:text-white"
                />
              </div>
              <button className="px-6 py-3 bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 rounded-2xl text-xs font-bold flex items-center gap-2 border dark:border-white/5 hover:text-primary-500 transition-colors">
                <Filter size={16} /> Deep Analytics
              </button>
            </div>

            {/* List View */}
            <div className="glass rounded-[3rem] border border-slate-200 dark:border-zinc-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-zinc-900/30 border-b dark:border-zinc-900">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Protocol ID</th>
                      <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Transmission Title</th>
                      <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Channel</th>
                      <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest text-center">Reach</th>
                      <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest text-center">Status</th>
                      <th className="py-6 text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest text-right px-8">Dispatch Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-zinc-900/50">
                    {filteredDispatches.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/20 transition-all cursor-default">
                        <td className="px-8 py-5">
                          <div className="font-mono text-xs font-black dark:text-zinc-500 group-hover:text-primary-500 transition-colors">{tx.id}</div>
                        </td>
                        <td className="py-5">
                           <div className="text-sm font-bold dark:text-white line-clamp-1">{tx.title}</div>
                           <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{tx.audience}</div>
                        </td>
                        <td className="py-5">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
                             <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border dark:border-zinc-800">
                               {getChannelIcon(tx.channel)}
                             </div>
                             {tx.channel}
                           </div>
                        </td>
                        <td className="py-5 text-center">
                           <div className="text-xs font-black dark:text-white">{tx.reach.toLocaleString()}</div>
                           <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">{tx.openRate} Opened</div>
                        </td>
                        <td className="py-5 text-center">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(tx.status)}`}>
                             {tx.status}
                           </span>
                        </td>
                        <td className="py-5 text-right px-8">
                           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.sentAt}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div 
            key="templates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {MOCK_TEMPLATES.map((tmp, i) => (
              <motion.div
                key={tmp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 group relative overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-14 h-14 rounded-2xl bg-${tmp.previewColor}-500/10 text-${tmp.previewColor === 'primary' ? 'primary-600' : tmp.previewColor + '-500'} flex items-center justify-center border dark:border-zinc-800 group-hover:scale-110 transition-transform`}>
                    {getChannelIcon(tmp.type)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-primary-500"><Edit3 size={14} /></button>
                    <button className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-primary-500"><Copy size={14} /></button>
                  </div>
                </div>

                <div className="space-y-2 mb-10">
                  <h3 className="text-xl font-bold dark:text-white leading-tight">{tmp.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed font-medium line-clamp-2">{tmp.description}</p>
                </div>

                <div className="pt-6 border-t dark:border-zinc-900 flex items-center justify-between">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                     <Clock size={12} /> {tmp.lastEdited}
                   </div>
                   <div className="px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-zinc-900 text-[9px] font-black text-slate-400 uppercase border dark:border-zinc-800">
                     {tmp.type}
                   </div>
                </div>
              </motion.div>
            ))}
            
            <button className="p-8 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center group hover:border-primary-500 transition-all hover:bg-primary-500/5">
               <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-950 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all mb-4">
                 <Plus size={32} />
               </div>
               <div className="text-sm font-black dark:text-white uppercase tracking-widest">New Schema</div>
               <p className="text-xs text-slate-400 mt-1">Design a reusable dispatch blueprint</p>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Broadcast Studio Modal --- */}
      <AnimatePresence>
        {isBroadcastOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBroadcastOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-7xl bg-white dark:bg-[#080808] rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row h-full max-h-[90vh]"
            >
              {/* Left: Input Console */}
              <div className="flex-[1.2] flex flex-col border-r dark:border-zinc-900 overflow-hidden">
                <header className="p-8 md:p-12 pb-6 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-3xl font-display font-black dark:text-white tracking-tight">Transmission Studio</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Crafting global reach through unified architecture.</p>
                  </div>
                  <button onClick={() => setIsBroadcastOpen(false)} className="lg:hidden p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 text-slate-500"><X size={24} /></button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-4 hide-scrollbar space-y-10">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Segment</label>
                         <select 
                           value={broadcastData.segment}
                           onChange={(e) => setBroadcastData({...broadcastData, segment: e.target.value as any})}
                           className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all cursor-pointer"
                         >
                            <option>All Architects</option>
                            <option>Pro Members</option>
                            <option>Enterprise Only</option>
                            <option>Inactive (30d+)</option>
                         </select>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Distribution Path</label>
                         <div className="flex bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl">
                           {(['System', 'Push', 'Email'] as ChannelType[]).map(ch => (
                             <button 
                               key={ch}
                               onClick={() => setBroadcastData({...broadcastData, channel: ch})}
                               className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${broadcastData.channel === ch ? 'bg-white dark:bg-zinc-800 text-primary-600 shadow-sm' : 'text-slate-400'}`}
                             >
                               {ch}
                             </button>
                           ))}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dispatch Title</label>
                      <input 
                        type="text" 
                        value={broadcastData.title}
                        onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
                        placeholder="Define the primary subject of this transmission..."
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none dark:text-white"
                      />
                   </div>

                   <div className="space-y-4 relative">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload Intelligence (Message Body)</label>
                        <button className="text-[10px] font-black text-primary-500 uppercase flex items-center gap-1.5 hover:underline">
                          <Sparkles size={12} /> AI Refine
                        </button>
                      </div>
                      <textarea 
                        rows={6}
                        value={broadcastData.message}
                        onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                        placeholder="Draft the global payload message..."
                        className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-primary-500 transition-all outline-none dark:text-white leading-relaxed"
                      />
                   </div>

                   <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-500">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold dark:text-white">Temporal Scheduling</div>
                          <div className="text-[10px] text-slate-500 font-medium">Define exactly when this pulse activates.</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setBroadcastData({...broadcastData, isScheduled: !broadcastData.isScheduled})}
                        className={`w-12 h-6 rounded-full relative transition-colors ${broadcastData.isScheduled ? 'bg-primary-600' : 'bg-slate-300 dark:bg-zinc-800'}`}
                      >
                         <motion.div animate={{ x: broadcastData.isScheduled ? 26 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                   </div>
                </div>

                <footer className="p-8 md:p-12 border-t dark:border-zinc-900 bg-white/50 dark:bg-black/50 backdrop-blur-md flex items-center justify-between shrink-0">
                  <button className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                  <div className="flex gap-4">
                    <button className="px-8 py-4 text-xs font-black uppercase tracking-widest text-primary-600 hover:bg-primary-500/10 rounded-2xl transition-all">Save Blueprint</button>
                    <button className="px-10 py-4 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:bg-primary-500 transition-all active:scale-95 flex items-center gap-3">
                       <Send size={16} /> Deploy Pulse
                    </button>
                  </div>
                </footer>
              </div>

              {/* Right: Real-time Simulation Panel */}
              <div className="flex-1 bg-slate-50 dark:bg-[#0c0c0c] flex flex-col">
                <header className="p-8 border-b dark:border-zinc-900 flex items-center justify-between shrink-0">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Simulation</div>
                   <div className="flex bg-white dark:bg-black p-1 rounded-xl shadow-sm border dark:border-white/5">
                      <button 
                        onClick={() => setPreviewDevice('mobile')}
                        className={`p-2 rounded-lg transition-all ${previewDevice === 'mobile' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}
                      >
                        <MobileIcon size={16} />
                      </button>
                      <button 
                        onClick={() => setPreviewDevice('desktop')}
                        className={`p-2 rounded-lg transition-all ${previewDevice === 'desktop' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}
                      >
                        <Monitor size={16} />
                      </button>
                   </div>
                </header>

                <div className="flex-1 p-12 flex items-center justify-center overflow-hidden">
                   {previewDevice === 'mobile' ? (
                     <div className="w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-800 rounded-b-2xl" />
                        <div className="p-6 pt-12 space-y-4">
                           {broadcastData.channel === 'Push' ? (
                             <motion.div 
                               initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                               className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white"
                             >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-5 h-5 rounded-md bg-primary-600 flex items-center justify-center text-[10px] font-black">P</div>
                                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">RESOURCES PEN</span>
                                  <span className="text-[9px] opacity-40 ml-auto">Now</span>
                                </div>
                                <div className="text-xs font-black mb-1 line-clamp-1">{broadcastData.title || 'Notification Title'}</div>
                                <div className="text-[10px] font-medium leading-relaxed opacity-80 line-clamp-3">{broadcastData.message || 'Transmission payload message will manifest here...'}</div>
                             </motion.div>
                           ) : (
                             <div className="h-full flex items-center justify-center text-zinc-800 opacity-20">
                               <Terminal size={40} />
                             </div>
                           )}
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-zinc-800 rounded-full" />
                     </div>
                   ) : (
                     <div className="w-full h-full max-w-lg bg-white dark:bg-black rounded-[2rem] shadow-2xl border dark:border-white/5 overflow-hidden flex flex-col">
                        <div className="h-8 bg-slate-100 dark:bg-zinc-900 border-b dark:border-zinc-800 flex items-center px-4 gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <div className="flex-1 text-[8px] font-black text-slate-400 text-center uppercase tracking-widest">Global Protocol Simulation</div>
                        </div>
                        <div className="flex-1 p-8 space-y-6">
                           {broadcastData.channel === 'System' ? (
                             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 rounded-3xl bg-slate-50 dark:bg-zinc-950 border dark:border-zinc-900 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                  <Info size={16} className="text-primary-500 opacity-40" />
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                                     <Bell size={24} />
                                   </div>
                                   <div>
                                      <h4 className="text-lg font-bold dark:text-white line-clamp-1">{broadcastData.title || 'Dispatch Title'}</h4>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Platform Broadast • Now</p>
                                   </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium line-clamp-4">
                                  {broadcastData.message || 'System payload manifesting for visualization...'}
                                </p>
                                <div className="mt-8 pt-6 border-t dark:border-zinc-900">
                                   <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">Take Action</button>
                                </div>
                             </motion.div>
                           ) : (
                              <div className="h-full flex items-center justify-center text-zinc-100 dark:text-zinc-900 opacity-20">
                                <Monitor size={80} />
                              </div>
                           )}
                        </div>
                     </div>
                   )}
                </div>

                <div className="p-8 border-t dark:border-zinc-900 space-y-6 shrink-0">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <span>Reach Estimation</span>
                     <span className="text-emerald-500">98.2% Accurate</span>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-5 rounded-3xl bg-white dark:bg-black border dark:border-white/5 flex flex-col items-center">
                         <div className="text-2xl font-display font-black dark:text-white">~12,480</div>
                         <div className="text-[8px] font-black text-slate-400 uppercase">Est. Population</div>
                      </div>
                      <div className="p-5 rounded-3xl bg-white dark:bg-black border dark:border-white/5 flex flex-col items-center">
                         <div className="text-2xl font-display font-black text-primary-500">Instant</div>
                         <div className="text-[8px] font-black text-slate-400 uppercase">Velocity Rank</div>
                      </div>
                   </div>
                </div>
              </div>
              <button onClick={() => setIsBroadcastOpen(false)} className="absolute top-8 right-8 p-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all hidden lg:block">
                 <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;