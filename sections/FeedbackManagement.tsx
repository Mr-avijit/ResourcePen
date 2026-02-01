import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MessageSquare, CheckCircle2, XCircle, Clock, Search, Filter,
  ThumbsUp, ThumbsDown, ShieldCheck, Flag, Trash2, Tag, Calendar,
  ChevronRight, Pin, Share2, Reply, Check, X, Sparkles,
  BarChart3, TrendingUp, AlertCircle, Info, ExternalLink,
  Download, SlidersHorizontal, Activity, Shield, RefreshCcw,
  Target, Zap, MousePointer2, Briefcase, Globe, Lock,
  Layout, User, Eye, ArrowUp, ArrowDown, Copy
} from 'lucide-react';
import { Feedback, FeedbackStatus, SentimentType, FeedbackAnalytics } from '../types';
import { COS_Badge, COS_Button, COS_Spinner, COS_Input } from '../components/COS_Library';
import { MockApiService } from '../MockApiService';

const FeedbackManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FeedbackStatus>('all');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | SentimentType>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fbData, analyticsData] = await Promise.all([
        MockApiService.getGlobalFeedbacks(),
        MockApiService.getFeedbackAnalytics()
      ]);
      setFeedbacks(fbData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("TFMS synchronization failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => {
      const matchesSearch = (f.userName + f.content + f.title).toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchesSentiment = sentimentFilter === 'all' || f.sentiment === sentimentFilter;
      return matchesSearch && matchesStatus && matchesSentiment;
    });
  }, [search, statusFilter, sentimentFilter, feedbacks]);

  const handleAction = async (id: string, updates: Partial<Feedback>) => {
    // Optimistic Update
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    if (selectedFeedback?.id === id) {
      setSelectedFeedback(prev => prev ? { ...prev, ...updates } : null);
    }

    try {
      await MockApiService.moderateFeedback(id, updates);
    } catch (err) {
      // Revert on failure
      console.error("Failed to update feedback", err);
      await loadData();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFeedbacks.length && filteredFeedbacks.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFeedbacks.map(f => f.id));
    }
  };

  const getSentimentColor = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'negative': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  const getStatusStyle = (status: FeedbackStatus) => {
    switch (status) {
      case 'featured': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/30';
      case 'approved': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
      case 'rejected': return 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-500/30';
      case 'flagged': return 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-500/30';
      default: return 'bg-slate-100 dark:bg-zinc-800 text-slate-500 border-slate-200 dark:border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black dark:text-white tracking-tight leading-tight">
            Reputation Engine
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mt-2 max-w-xl leading-relaxed">
            Centralized sentiment analysis and moderation console. Review, approve, and amplify user feedback.
          </p>
        </div>

        <div className="flex gap-4">
          {[
            { label: 'Trust Score', value: analytics?.avgRating || '0.0', icon: Star, color: 'text-amber-500' },
            { label: 'Net Sentiment', value: (analytics?.sentimentScore || 0) + '%', icon: TrendingUp, color: 'text-emerald-500' },
            { label: 'Pending', value: feedbacks.filter(f => f.status === 'pending').length, icon: Clock, color: 'text-blue-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 p-4 rounded-2xl min-w-[140px] shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                <stat.icon size={12} /> {stat.label}
              </div>
              <div className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Control Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 sticky top-0 z-30 bg-slate-50/80 dark:bg-[#080808]/80 backdrop-blur-md py-2 -mx-2 px-2">

        {/* Filters */}
        <div className="flex items-center bg-white dark:bg-[#0c0c0c] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto hide-scrollbar max-w-full md:w-auto">
          <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>All</button>
          <div className="w-px h-4 bg-slate-100 dark:bg-zinc-800 mx-1" />
          {['pending', 'approved', 'featured', 'flagged', 'rejected'].map(status => (
            <button key={status} onClick={() => setStatusFilter(status as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === status ? 'bg-slate-100 dark:bg-zinc-800 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {status}
            </button>
          ))}
        </div>

        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Deep search reviews..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold dark:text-white outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex bg-white dark:bg-[#0c0c0c] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-zinc-800 text-primary-600' : 'text-slate-400'}`}><Layout size={16} /></button>
          <button onClick={() => setViewMode('table')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-slate-100 dark:bg-zinc-800 text-primary-600' : 'text-slate-400'}`}><Briefcase size={16} /></button>
        </div>
      </div>

      {/* 3. Content Area */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><COS_Spinner size={32} /></div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
          <MessageSquare size={48} className="mx-auto mb-4 text-slate-300 dark:text-zinc-600" />
          <h3 className="text-lg font-bold dark:text-white">No Feedback Found</h3>
          <p className="text-sm text-slate-500">Adjust filters to see results.</p>
        </div>
      ) : (
        /* Grid View */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredFeedbacks.map(fb => (
                <motion.div
                  key={fb.id}
                  layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedFeedback(fb)}
                  className="group relative bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${getSentimentColor(fb.sentiment)} bg-transparent border`}>
                        {fb.sentiment === 'positive' ? <ThumbsUp size={12} /> : fb.sentiment === 'negative' ? <ThumbsDown size={12} /> : <Activity size={12} />}
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(fb.status)}`}>
                        {fb.status}
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < fb.rating ? 'fill-current' : 'text-slate-200 dark:text-zinc-800'} />)}
                    </div>
                  </div>

                  <h3 className="text-base font-bold dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{fb.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-3 mb-6 font-medium leading-relaxed bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/50">
                    "{fb.content}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black">{fb.userName.charAt(0)}</div>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{fb.userName}</span>
                      {fb.isVerifiedPurchase && <ShieldCheck size={12} className="text-emerald-500" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Table View */
          <div className="bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-zinc-900/30 border-b border-slate-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Feedback</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sentiment</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredFeedbacks.map(fb => (
                  <tr key={fb.id} onClick={() => setSelectedFeedback(fb)} className="group hover:bg-slate-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black">{fb.userName.charAt(0)}</div>
                        <div>
                          <div className="text-xs font-bold dark:text-white flex items-center gap-1">
                            {fb.userName}
                            {fb.isVerifiedPurchase && <ShieldCheck size={10} className="text-emerald-500" />}
                          </div>
                          <div className="text-[10px] text-slate-400">{new Date(fb.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < fb.rating ? 'fill-current' : 'text-slate-200 dark:text-zinc-800'} />)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold dark:text-white truncate max-w-[200px]">{fb.title}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{fb.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${fb.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-600' : fb.sentiment === 'negative' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                        {fb.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(fb.status)}`}>
                        {fb.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* 4. Inspection Drawer */}
      <AnimatePresence>
        {selectedFeedback && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedFeedback(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="fixed top-2 bottom-2 right-2 w-full max-w-2xl bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl z-[60] flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-[#0c0c0c] shrink-0">
                <div>
                  <h2 className="text-xl font-display font-black dark:text-white">Moderation Details</h2>
                  <p className="text-xs text-slate-500 font-mono">ID: {selectedFeedback.id}</p>
                </div>
                <button onClick={() => setSelectedFeedback(null)} className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-full hover:bg-slate-100 transition-colors"><X size={20} className="text-slate-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">

                {/* User Card */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-black flex items-center justify-center text-xl font-black shadow-sm">
                    {selectedFeedback.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                      {selectedFeedback.userName}
                      {selectedFeedback.isVerifiedPurchase && <ShieldCheck size={16} className="text-emerald-500" />}
                    </h3>
                    <div className="flex gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Globe size={10} /> {selectedFeedback.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {new Date(selectedFeedback.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < selectedFeedback.rating ? 'fill-current' : 'text-slate-200 dark:text-zinc-700'} />)}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">"{selectedFeedback.title}"</span>
                  </div>
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed p-6 bg-slate-50/50 dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-800 italic">
                    "{selectedFeedback.content}"
                  </p>
                </div>

                {/* Analysis */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-black text-center">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Sentiment</div>
                    <div className={`text-lg font-black uppercase ${selectedFeedback.sentiment === 'positive' ? 'text-emerald-500' : selectedFeedback.sentiment === 'negative' ? 'text-rose-500' : 'text-amber-500'}`}>
                      {selectedFeedback.sentiment}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-black text-center">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-1">User Status</div>
                    <div className="text-lg font-black uppercase text-slate-700 dark:text-white">
                      {selectedFeedback.isVerifiedUser ? 'Verified' : 'Guest'}
                    </div>
                  </div>
                </div>

                {/* Admin Reply */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Public Response</label>
                  <textarea
                    className="w-full p-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white resize-none"
                    rows={4}
                    placeholder="Write a response to display publicly..."
                    defaultValue={selectedFeedback.adminReply}
                    onBlur={(e) => handleAction(selectedFeedback.id, { adminReply: e.target.value })}
                  />
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex gap-3">
                <button
                  onClick={() => handleAction(selectedFeedback.id, { status: 'approved' })}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  <CheckCircle2 size={16} /> Approve
                </button>
                <button
                  onClick={() => handleAction(selectedFeedback.id, { status: 'rejected' })}
                  className="flex-1 py-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  <XCircle size={16} /> Reject
                </button>
                {selectedFeedback.status !== 'featured' && (
                  <button onClick={() => handleAction(selectedFeedback.id, { status: 'featured' })} className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 transition-colors">
                    <Zap size={20} className="fill-current" />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FeedbackManagement;
