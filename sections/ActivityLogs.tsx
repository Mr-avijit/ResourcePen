
// --- ActivityLogs.tsx (Forensic Edition) ---
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Search, Download, RefreshCcw, Clock, ShieldAlert,
  Terminal, Globe, Lock, Cpu, Database, ChevronRight, FileText,
  AlertTriangle, CheckCircle, XCircle, Filter, Server, Eye
} from 'lucide-react';
import { MockApiService } from '../MockApiService';
import { COS_Spinner } from '../components/COS_Library';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'auth' | 'system' | 'security' | 'api' | 'database';
  action: string;
  description: string;
  userName: string;
  userAvatar: string;
  status: 'Success' | 'Warning' | 'Failure';
  ipAddress: string;
}

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await MockApiService.getLogs();
      setLogs(data || []);
    } catch (err) {
      console.error("Forensic log failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = `${l.userName} ${l.action} ${l.description} ${l.id}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || l.type === filterType || l.status.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'Warning': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'Failure': return <XCircle size={14} className="text-rose-500" />;
      default: return <Activity size={14} className="text-slate-500" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'auth': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'security': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'system': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'api': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Forensic Ledger
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mt-2 max-w-xl">
            Immutable system audit trail. Monitoring authentication, API latency, and security protocols in real-time.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-5 py-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Events</div>
            <div className="text-xl font-black dark:text-white">{logs.length}</div>
          </div>
          <div className="px-5 py-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Anomalies</div>
            <div className="text-xl font-black text-rose-500">{logs.filter(l => l.status === 'Failure' || l.status === 'Warning').length}</div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 sticky top-0 z-30 bg-slate-50/80 dark:bg-[#080808]/80 backdrop-blur-md py-2 -mx-2 px-2">
        <div className="flex items-center bg-white dark:bg-[#0c0c0c] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto hide-scrollbar max-w-full md:w-auto">
          {['all', 'auth', 'system', 'security', 'failure'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === t ? 'bg-slate-100 dark:bg-zinc-800 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by IP, User, ID or Event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold dark:text-white outline-none focus:border-primary-500/50 transition-all font-mono placeholder:text-slate-400"
          />
        </div>

        <button onClick={fetchLogs} className={`p-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 text-slate-500 rounded-xl hover:text-primary-500 transition-all shadow-sm ${isLoading ? 'animate-spin' : ''}`}>
          <RefreshCcw size={18} />
        </button>
        <button className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-all">
          <Download size={18} />
        </button>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center opacity-40">
          <COS_Spinner size={48} />
          <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Decrypting Ledger...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
          <ShieldAlert size={48} className="mx-auto mb-4 text-slate-300 dark:text-zinc-600" />
          <h3 className="text-lg font-bold dark:text-white">No Traces Found</h3>
          <p className="text-sm text-slate-500">Security protocols are quiet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-900/30 border-b border-slate-100 dark:border-zinc-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Event ID</th>
                <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actor</th>
                <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredLogs.map(log => (
                <tr key={log.id} onClick={() => setSelectedLog(log)} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer">
                  <td className="px-8 py-4">
                    <div className="font-mono text-[10px] font-bold text-slate-500 group-hover:text-primary-500 transition-colors bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded w-fit">#{log.id.split('-')[1]}</div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getTypeStyle(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 border dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-slate-500">
                        {log.userName === 'System' ? <Server size={14} /> : log.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold dark:text-white">{log.userName}</div>
                        <div className="text-[9px] font-mono text-slate-400">{log.ipAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-xs font-bold dark:text-zinc-200">{log.action}</div>
                    <div className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-sm">{log.description}</div>
                  </td>
                  <td className="py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : log.status === 'Failure' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {getStatusIcon(log.status)} {log.status}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="font-mono text-[10px] font-medium text-slate-500">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-[9px] text-slate-400 opacity-60">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Detail Drawer --- */}
      <AnimatePresence>
        {selectedLog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLog(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }}
              className="fixed top-2 bottom-2 right-2 w-full max-w-lg bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl z-[1010] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#0c0c0c] flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-display font-black dark:text-white uppercase tracking-tight">Event Inspector</h3>
                  <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-1">ID: {selectedLog.id}</p>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-full hover:bg-slate-100 transition-colors"><ChevronRight size={20} className="text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">

                {/* Status Card */}
                <div className={`p-6 rounded-[2rem] border ${selectedLog.status === 'Success' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' : 'bg-rose-50/50 border-rose-100 text-rose-900'} text-center`}>
                  <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${selectedLog.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {selectedLog.status === 'Success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div className="text-lg font-black uppercase tracking-tight">{selectedLog.status}</div>
                  <div className="text-xs font-bold opacity-70">{selectedLog.action}</div>
                </div>

                {/* Identity */}
                <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-black shadow-sm flex items-center justify-center font-black text-primary-500 text-lg">
                      {selectedLog.userName === 'System' ? <Server size={20} /> : selectedLog.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-black dark:text-white">{selectedLog.userName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{selectedLog.ipAddress}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-black mb-1">Protocol</div>
                      <div className="text-xs font-bold capitalize">{selectedLog.type}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-black mb-1">Timestamp</div>
                      <div className="text-xs font-bold">{new Date(selectedLog.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-2">
                  <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-2">Raw Payload</div>
                  <div className="p-6 rounded-[2rem] bg-slate-900 text-emerald-400 font-mono text-[10px] leading-relaxed shadow-inner border border-slate-800">
                    <div className="mb-2 text-slate-500">// Event Description</div>
                    <div className="mb-4 text-white">&gt; {selectedLog.description}</div>

                    <div className="mb-2 text-slate-500 text-xs">// JSON Dump</div>
                    <pre className="opacity-70">
                      {JSON.stringify({
                        id: selectedLog.id,
                        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
                        geo_location: 'Unknown',
                        session_id: 'sess_' + Math.floor(Math.random() * 100000),
                        latency_ms: Math.floor(Math.random() * 200) + 'ms'
                      }, null, 2)}
                    </pre>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/30">
                <button className="w-full py-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm text-slate-600 dark:text-slate-300">
                  View Full Trace in Console
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityLogs;
