import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Plus, Search, Filter, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Send, Paperclip, X,
  MoreVertical, User, Shield, Image as ImageIcon, FileText,
  RefreshCcw, ArrowLeft, MoreHorizontal, History, Zap, Check,
  AlertTriangle, CheckCircle, BarChart3, HelpCircle,
  Layout, Sidebar, Settings, Command, Flashlight, Star, Eye
} from 'lucide-react';
import { useAuth } from '../store';
import { MockApiService } from '../MockApiService';
import { COS_Spinner } from '../components/COS_Library';

// --- Types ---
interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
  attachments?: { name: string; type: 'image' | 'file' }[];
}

interface Ticket {
  id: string;
  subject: string;
  category: 'Technical' | 'Billing' | 'License' | 'General';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  lastUpdated: string;
  messages: Message[];
  department?: string;
  assignedAgent?: string;
}

// --- Visual Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'open': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    'resolved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    'closed': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border ${styles[status] || styles.closed}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'in-progress' ? 'bg-amber-500 animate-pulse' : 'bg-current'}`} />
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const icons: Record<string, any> = {
    high: AlertCircle,
    medium: Clock,
    low: Check
  };
  const Icon = icons[priority] || Check;
  const colors: Record<string, string> = {
    high: 'text-rose-500', medium: 'text-orange-500', low: 'text-slate-500'
  };

  return (
    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${colors[priority]}`}>
      <Icon size={12} /> {priority}
    </div>
  );
}

// --- Macros (Canned Responses) ---
const MACROS = [
  { id: 'm1', label: 'Ask for Logs', text: "Could you please provide the server logs from the time of the incident? This will help us diagnose the issue faster." },
  { id: 'm2', label: 'Refund Policy', text: "Per our refund policy, requests made within 14 days are eligible. I've initiated the process for you." },
  { id: 'm3', label: 'Escalate', text: "I'm escalating this ticket to our Senior Engineering team. They will review your case within 24 hours." },
  { id: 'm4', label: 'Reset Credentials', text: "I've sent a password reset link to your registered email address. Please check your spam folder as well." }
];

// --- Create Ticket Modal ---
interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: Partial<Ticket> & { initialMessage: string }) => Promise<void>;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'General',
    priority: 'medium',
    initialMessage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData as any);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/30">
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
            <Plus size={18} className="text-primary-500" /> Open New Ticket
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</label>
            <input required className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder="Brief summary of the issue..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
              <select className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none"
                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option>General</option><option>Technical</option><option>Billing</option><option>License</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</label>
              <select className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold dark:text-white outline-none"
                value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
            <textarea required rows={4} className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              value={formData.initialMessage} onChange={e => setFormData({ ...formData, initialMessage: e.target.value })} placeholder="Describe your issue in detail..." />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2">
              {isSubmitting && <RefreshCcw size={12} className="animate-spin" />} Submit Ticket
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const SupportTickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'open' | 'closed'>('all');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [ticketsData, analyticsData] = await Promise.all([
        MockApiService.getTickets(),
        MockApiService.getTicketAnalytics()
      ]);
      setTickets(ticketsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Ticket sync failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    setIsSending(true);
    const msg: Message = {
      id: Date.now().toString(),
      sender: user?.role === 'admin' ? 'support' : 'user',
      text: newMessage,
      timestamp: 'Just now'
    };

    try {
      const updatedTicket = await MockApiService.addTicketMessage(selectedTicket.id, msg);
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      setSelectedTicket(updatedTicket);
      setNewMessage('');

      // Simulation for non-admin users
      if (user?.role !== 'admin') {
        setTimeout(async () => {
          const reply: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'support',
            text: "Engineer assigned. We are reviewing your logs.",
            timestamp: 'Just now'
          };
          const autoRepliedTicket = await MockApiService.addTicketMessage(selectedTicket.id, reply);
          setTickets(prev => prev.map(t => t.id === selectedTicket.id ? autoRepliedTicket : t));
          if (selectedTicket.id === autoRepliedTicket.id) setSelectedTicket(autoRepliedTicket);
        }, 1500);
      }

    } catch (err) {
      console.error("Message transmission failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateTicket = async (data: Partial<Ticket> & { initialMessage: string }) => {
    try {
      const newTicket = {
        subject: data.subject,
        category: data.category,
        priority: data.priority,
        messages: [
          {
            id: 'msg-init',
            sender: 'user',
            text: data.initialMessage,
            timestamp: 'Just now'
          }
        ]
      };
      await MockApiService.createTicket(newTicket);
      await refreshData();
    } catch (err) {
      console.error("Create ticket failed:", err);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket) return;
    try {
      const updated = await MockApiService.updateTicket(selectedTicket.id, { status });
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updated : t));
      setSelectedTicket(updated);
    } catch (err) { console.error(err); }
  };

  const insertMacro = (text: string) => {
    setNewMessage(text);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterType === 'all'
        ? true
        : filterType === 'open'
          ? (t.status === 'open' || t.status === 'in-progress')
          : (t.status === 'resolved' || t.status === 'closed');
      return matchesSearch && matchesFilter;
    });
  }, [tickets, search, filterType]);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-6 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- Stats Header --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Open Issues', value: analytics?.activeTickets || '0', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Avg Time', value: analytics?.avgResolutionTime || '--', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Satisfaction', value: (analytics?.satisfactionRate || 0) + '%', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Volume', value: tickets.length.toString(), icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-xl font-black dark:text-white tracking-tight">{stat.value}</div>
            </div>
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex gap-6 min-h-0">

        {/* --- 1. LIST COLUMN (30%) --- */}
        <div className={`flex flex-col w-full lg:w-[30%] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] shadow-sm overflow-hidden ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest dark:text-white flex items-center gap-2">
                Inbox <span className="bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded text-[9px]">{filteredTickets.length}</span>
              </h2>
              <button onClick={() => setIsCreateModalOpen(true)} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={14} />
                <input
                  type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold dark:text-white outline-none focus:border-primary-500/50 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                {['all', 'open', 'closed'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${filterType === type ? 'bg-white dark:bg-zinc-800 shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 hide-scrollbar bg-slate-50/30 dark:bg-black/20">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 opacity-40">
                <COS_Spinner size={24} />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center p-8 opacity-40">
                <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-zinc-900 mb-2">
                  <MessageSquare size={20} className="text-slate-300 dark:text-zinc-700" />
                </div>
                <p className="text-xs font-bold text-slate-500">No signals found</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredTickets.map((ticket) => (
                  <motion.div
                    key={ticket.id}
                    layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${selectedTicket?.id === ticket.id
                      ? 'bg-white dark:bg-zinc-900 border-primary-500 shadow-lg ring-1 ring-primary-500/20'
                      : 'bg-white dark:bg-[#0c0c0c] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-slate-400">#{ticket.id}</span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> {ticket.lastUpdated}</span>
                    </div>
                    <h3 className={`text-xs font-bold mb-1.5 line-clamp-1 ${selectedTicket?.id === ticket.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'}`}>{ticket.subject}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* --- 2. CHAT CANVAS (45%) --- */}
        <div className={`flex flex-col w-full lg:w-[45%] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] shadow-sm overflow-hidden relative ${selectedTicket ? 'flex' : 'hidden lg:flex'}`}>
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#0c0c0c] z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedTicket(null)} className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500"><ArrowLeft size={16} /></button>
                  <div>
                    <h2 className="text-sm font-black dark:text-white line-clamp-1">{selectedTicket.subject}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${selectedTicket.status === 'open' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                      <span className="text-[10px] font-medium text-slate-500 capitalize">{selectedTicket.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-slate-50/50 dark:bg-black/50">
                <div className="flex justify-center mb-4"><span className="text-[10px] bg-slate-200 dark:bg-zinc-800 px-3 py-1 rounded-full text-slate-500 font-medium">Session Started</span></div>

                {selectedTicket.messages.map((msg, i) => {
                  const isMe = msg.sender === (user?.role === 'admin' ? 'support' : 'user');
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm border border-slate-100 dark:border-zinc-800 ${!isMe ? 'bg-white text-blue-500' : 'bg-slate-900 dark:bg-white text-white dark:text-black'}`}>
                          {msg.sender === 'support' ? <Shield size={14} /> : <User size={14} />}
                        </div>
                        <div className="space-y-1">
                          <div className={`px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm border ${isMe
                              ? 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-tr-none'
                              : 'bg-indigo-600 text-white border-transparent rounded-tl-none'
                            }`}>
                            {msg.text}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-white/20 grid grid-cols-1 gap-2">
                                {msg.attachments.map((file, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-[10px] opacity-90 p-1.5 bg-black/10 rounded">
                                    <Paperclip size={10} /> {file.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className={`text-[9px] text-slate-400 block ${isMe ? 'text-right mr-1' : 'text-left ml-1'}`}>{msg.timestamp}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-[#0c0c0c] border-t border-slate-100 dark:border-zinc-800 z-10">
                {/* Canned Responses */}
                {user?.role === 'admin' && (
                  <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar pb-1">
                    {MACROS.map(m => (
                      <button key={m.id} onClick={() => insertMacro(m.text)} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-primary-500 text-[10px] font-bold text-slate-500 hover:text-primary-600 transition-colors">
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="relative">
                  <div className="flex items-end gap-2 p-1.5 bg-slate-100 dark:bg-zinc-900 rounded-[1.5rem] border border-transparent focus-within:border-primary-500/50 focus-within:bg-white dark:focus-within:bg-black transition-all">
                    <button type="button" className="p-2.5 text-slate-400 hover:text-primary-500 rounded-full transition-all"><Paperclip size={16} /></button>
                    <textarea
                      rows={1}
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                      className="flex-1 bg-transparent py-2.5 max-h-32 text-xs font-bold outline-none dark:text-white placeholder:text-slate-400 resize-none"
                    />
                    <button type="submit" disabled={!newMessage.trim() || isSending} className="p-2.5 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-500 transition-all disabled:opacity-50 disabled:shadow-none">
                      {isSending ? <RefreshCcw size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
              <Command size={48} className="mb-4 text-slate-300 dark:text-zinc-700" />
              <h3 className="text-lg font-bold dark:text-white">Support Console</h3>
              <p className="text-xs text-slate-500 max-w-[200px]">Select a ticket to begin resolution protocol.</p>
            </div>
          )}
        </div>

        {/* --- 3. CONTEXT COLUMN (25%) --- */}
        <div className={`hidden lg:flex lg:w-[25%] flex-col gap-6`}>
          {selectedTicket ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Ticket Details */}
              <div className="p-5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Settings size={12} /> Protocol Config
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50">
                    <span className="text-xs font-medium text-slate-500">Status</span>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="bg-transparent text-xs font-bold text-right outline-none cursor-pointer hover:text-primary-500 transition-colors"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50">
                    <span className="text-xs font-medium text-slate-500">Priority</span>
                    <span className="text-xs font-bold capitalize">{selectedTicket.priority}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50">
                    <span className="text-xs font-medium text-slate-500">Category</span>
                    <span className="text-xs font-bold">{selectedTicket.category}</span>
                  </div>
                </div>
              </div>

              {/* User Profile */}
              <div className="p-5 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto mb-3 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTicket.id}`} alt="User" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-black dark:text-white">Alex Mercer</h3>
                <p className="text-[10px] text-slate-400 mb-4">Enterprise Plan • Member since 2023</p>

                <div className="flex justify-center gap-2">
                  <button className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 hover:text-primary-600 transition-colors" title="View Profile">
                    <User size={14} />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 hover:text-primary-600 transition-colors" title="View Logs">
                    <FileText size={14} />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 hover:text-primary-600 transition-colors" title="Banish">
                    <Layout size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full rounded-[1.5rem] border border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center p-6 opacity-40">
              <Sidebar size={32} className="mb-2 text-slate-300" />
              <p className="text-[10px] font-bold text-slate-400">Contextual data will appear here</p>
            </div>
          )}
        </div>

      </div>

      <AnimatePresence>
        {isCreateModalOpen && <CreateTicketModal isOpen={true} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateTicket} />}
      </AnimatePresence>
    </div>
  );
};

export default SupportTickets;