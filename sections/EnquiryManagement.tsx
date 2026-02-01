import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, List, LayoutGrid, User, Mail, Calendar, Clock,
  CheckCircle2, Archive, Trash2, Star, Send, ExternalLink,
  Download, ChevronRight, X, MessageSquare, UserPlus,
  ShieldCheck, Activity, Zap, Check, SlidersHorizontal,
  RefreshCcw, MoreVertical, Briefcase, Tag, Lock, Filter,
  Phone, Globe, Target, AlertTriangle, Paperclip, Reply,
  Fingerprint, Inbox, ArrowUpRight, Copy, MapPin, ArrowLeft,
  MoreHorizontal, Eye
} from 'lucide-react';
import { Enquiry, EnquiryStatus, EnquiryPriority, EnquiryAnalytics, EnquiryMessage, EnquiryType } from '../types';
import { COS_Badge, COS_Button, COS_Spinner, COS_Input } from '../components/COS_Library';
import { MockApiService } from '../MockApiService';

const EnquiryManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | EnquiryStatus>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [analytics, setAnalytics] = useState<EnquiryAnalytics | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  useEffect(() => {
    if (selectedEnquiry && threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedEnquiry?.thread]);

  const loadEnquiries = async () => {
    setIsSyncing(true);
    try {
      const [data, stats] = await Promise.all([
        MockApiService.getEnquiries(),
        MockApiService.getEnquiryAnalytics()
      ]);
      setEnquiries(data);
      setAnalytics(stats);
    } catch (err) {
      console.error("Data sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => {
      const matchesSearch = (e.userName + e.subject + e.email).toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterStatus === 'all' || e.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [search, filterStatus, enquiries]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedEnquiry) return;
    setIsSending(true);
    try {
      await MockApiService.addEnquiryReply(selectedEnquiry.id, {
        sender: 'admin',
        senderName: 'Admin Team',
        text: replyText
      });
      setReplyText('');
      await loadEnquiries();
      // Optimistic update
      const updated = await MockApiService.getEnquiries();
      setSelectedEnquiry(updated.find(e => e.id === selectedEnquiry.id) || null);
    } catch (err) { console.error(err); }
    finally { setIsSending(false); }
  };

  const handleUpdateStatus = async (id: string, status: EnquiryStatus) => {
    await MockApiService.updateEnquiry(id, { status });
    await loadEnquiries();
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="min-h-screen pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Signal Processor
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2 max-w-xl">
            Inbound communication intelligence and lead orchestration.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex gap-4">
          {[
            { label: 'Unread', val: analytics?.newEnquiries || 0, color: 'text-blue-500' },
            { label: 'Urgent', val: analytics?.urgentTickets || 0, color: 'text-rose-500' },
            { label: 'Conversion', val: (analytics?.conversionRate || 0) + '%', color: 'text-emerald-500' }
          ].map((s, i) => (
            <div key={i} className="px-5 py-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm text-center min-w-[100px]">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</div>
              <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center bg-white dark:bg-[#0c0c0c] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm w-full md:w-auto overflow-x-auto hide-scrollbar">
          {(['all', 'new', 'open', 'in-progress', 'replied'] as EnquiryStatus[] | 'all'[]).map((tab: any) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === tab ? 'bg-slate-100 dark:bg-zinc-800 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search signals..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold dark:text-white outline-none focus:border-primary-500/50 transition-all font-mono"
          />
        </div>

        <div className="flex bg-white dark:bg-[#0c0c0c] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-zinc-800 text-primary-600' : 'text-slate-400'}`}><List size={16} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-zinc-800 text-primary-600' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
        </div>
      </div>

      {/* CONTENT GRID/LIST */}
      {isSyncing ? (
        <div className="flex justify-center items-center h-64 opacity-50"><COS_Spinner size={32} /></div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="text-center py-20 opacity-40 bg-slate-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
          <Inbox size={48} className="mx-auto mb-4 text-slate-300 dark:text-zinc-600" />
          <h3 className="text-lg font-bold dark:text-white">No Signals Found</h3>
          <p className="text-sm text-slate-500">Adjust filters or await new transmissions.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-zinc-900/30 border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Timestamp</th>
                <th className="px-6 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredEnquiries.map(enq => (
                <motion.tr
                  key={enq.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setSelectedEnquiry(enq)}
                  className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300">
                        {enq.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold dark:text-white group-hover:text-primary-600 transition-colors">{enq.userName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{enq.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium dark:text-slate-200 line-clamp-1 max-w-md">{enq.subject}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase tracking-wide">{enq.enquiry_type}</span>
                      {enq.priority === 'urgent' && <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1"><AlertTriangle size={8} /> Urgent</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${enq.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        enq.status === 'open' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                          enq.status === 'closed' ? 'bg-slate-50 text-slate-500 border-slate-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${enq.status === 'new' ? 'bg-blue-500 animate-pulse' : 'bg-current'}`} />
                      {enq.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-xs font-mono font-medium text-slate-500">{new Date(enq.created_at).toLocaleDateString()}</div>
                    <div className="text-[9px] text-slate-400 opacity-60">{new Date(enq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 rounded-lg text-slate-300 group-hover:text-primary-500 transition-colors"><ChevronRight size={16} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnquiries.map(enq => (
            <motion.div
              key={enq.id}
              layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedEnquiry(enq)}
              className="group bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-lg font-black text-slate-900 dark:text-white">
                  {enq.userName.charAt(0)}
                </div>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${enq.status === 'new' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                  {enq.status}
                </div>
              </div>

              <h3 className="text-lg font-display font-bold dark:text-white mb-2 leading-tight group-hover:text-primary-600 transition-colors">{enq.subject}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-100 dark:border-white/5 font-medium">
                "{enq.message}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <User size={14} /> {enq.userName}
                </div>
                <span className="text-[10px] font-mono text-slate-400">{new Date(enq.created_at).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* DRAWER SLIDER */}
      <AnimatePresence>
        {selectedEnquiry && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEnquiry(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-2 bottom-2 right-2 w-full max-w-4xl bg-white dark:bg-[#0c0c0c] rounded-[2rem] shadow-2xl z-[60] flex flex-col overflow-hidden border border-slate-200 dark:border-white/10"
            >
              {/* Drawer Header */}
              <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-[#0c0c0c] shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedEnquiry(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-400 transition-colors"><X size={20} /></button>
                  <div>
                    <h2 className="text-xl font-display font-black dark:text-white line-clamp-1">{selectedEnquiry.subject}</h2>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="font-mono">#{selectedEnquiry.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>Via {selectedEnquiry.source}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['new', 'open', 'closed'].map(s => (
                    <button key={s} onClick={() => handleUpdateStatus(selectedEnquiry.id, s as EnquiryStatus)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedEnquiry.status === s ? 'bg-slate-900 dark:bg-white text-white dark:text-black' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* LEFT: Conversation */}
                <div className="flex-1 flex flex-col border-r border-slate-100 dark:border-white/5">
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50 dark:bg-black/20 hide-scrollbar">
                    {/* Original Inquiry Card */}
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">{selectedEnquiry.userName.charAt(0)}</div>
                          <div>
                            <div className="text-sm font-bold dark:text-white">{selectedEnquiry.userName}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{selectedEnquiry.email}</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{new Date(selectedEnquiry.created_at).toLocaleString()}</div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                        "{selectedEnquiry.message}"
                      </p>
                    </div>

                    {/* Replies */}
                    {selectedEnquiry.thread.map(msg => (
                      <div key={msg.id} className={`flex gap-4 ${msg.sender === 'admin' ? 'justify-end' : ''}`}>
                        <div className={`max-w-[80%] p-5 rounded-[2rem] ${msg.sender === 'admin'
                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-black rounded-tr-none'
                            : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-tl-none'
                          }`}>
                          <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{msg.senderName}</div>
                          <p className="text-sm font-medium">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={threadEndRef} />
                  </div>

                  {/* Reply Input */}
                  <div className="p-6 bg-white dark:bg-[#0c0c0c] border-t border-slate-100 dark:border-zinc-800">
                    <div className="flex gap-2 p-2 bg-slate-50 dark:bg-zinc-900 rounded-[1.5rem] border border-slate-200 dark:border-zinc-800 focus-within:border-primary-500/50 transition-all shadow-inner">
                      <button className="p-3 text-slate-400 hover:text-primary-500 transition-colors"><Paperclip size={20} /></button>
                      <textarea
                        rows={1}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your response..."
                        className="flex-1 bg-transparent py-3 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none"
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSending}
                        className="p-3 bg-primary-600 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none"
                      >
                        {isSending ? <RefreshCcw size={20} className="animate-spin" /> : <Send size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Meta Panel */}
                <div className="w-80 bg-slate-50 dark:bg-[#0a0a0a] p-8 hidden lg:block overflow-y-auto border-l border-slate-100 dark:border-white/5 text-center">
                  <div className="w-20 h-20 mx-auto bg-white dark:bg-zinc-900 rounded-full border-4 border-slate-100 dark:border-zinc-800 shadow-xl mb-4 flex items-center justify-center text-2xl font-black text-slate-800 dark:text-white">
                    {selectedEnquiry.userName.charAt(0)}
                  </div>
                  <h3 className="text-lg font-black dark:text-white">{selectedEnquiry.userName}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1 mb-8">
                    <span className="text-xs text-slate-500">{selectedEnquiry.email}</span>
                    <button className="text-slate-400 hover:text-primary-500"><Copy size={12} /></button>
                  </div>

                  <div className="space-y-6 text-left">
                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Phone</span>
                        <span className="font-bold dark:text-slate-200">{selectedEnquiry.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Source</span>
                        <span className="font-bold dark:text-slate-200 flex items-center gap-1"><Globe size={10} /> {selectedEnquiry.source}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">SLA Due</span>
                        <span className="font-bold text-rose-500">{selectedEnquiry.sla_deadline}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block pl-1">Internal Notes</label>
                      <textarea
                        className="w-full h-32 p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 resize-none outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                        placeholder="Add notes..."
                        defaultValue={selectedEnquiry.internal_notes}
                        onBlur={(e) => MockApiService.updateEnquiry(selectedEnquiry.id, { internal_notes: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <button className="w-full py-3 rounded-xl bg-primary-600 text-white text-xs font-bold shadow-lg shadow-primary-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                        <UserPlus size={14} /> Convert to User
                      </button>
                      <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                        Archive Signal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EnquiryManagement;
