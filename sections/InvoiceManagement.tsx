import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Search, Filter, Plus,
  MoreVertical, Printer, Mail, Share2,
  CheckCircle2, Clock, AlertCircle, Eye,
  Settings2, Palette, Type, Image as ImageIcon,
  ChevronRight, X, ArrowUpRight, DollarSign,
  Briefcase, Calendar, ShieldCheck, DownloadCloud,
  Layers, FilterX, Archive, Trash2, Send,
  CreditCard, Loader2, Sparkles, Receipt
} from 'lucide-react';
import { COS_Button, COS_Badge, COS_Input, COS_Modal, COS_ToastContainer, COS_Spinner } from '../components/COS_Library';

// --- Types ---
type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  currency: string;
}

// --- Mock Data ---
const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    projectName: 'Horizon SaaS Implementation',
    amount: 2450.00,
    status: 'paid',
    issueDate: '2024-10-01',
    dueDate: '2024-10-15',
    currency: 'USD',
    items: [
      { id: '1', description: 'Horizon Dashboard License', quantity: 1, rate: 1500, amount: 1500 },
      { id: '2', description: 'Extended Technical Support', quantity: 10, rate: 95, amount: 950 }
    ]
  },
  {
    id: 'INV-2024-002',
    clientName: 'Global Tech',
    clientEmail: 'finance@globaltech.io',
    projectName: 'CryptoNext Enterprise Kit',
    amount: 5800.00,
    status: 'pending',
    issueDate: '2024-10-12',
    dueDate: '2024-10-26',
    currency: 'USD',
    items: [
      { id: '1', description: 'CryptoNext Extended License', quantity: 1, rate: 4500, amount: 4500 },
      { id: '2', description: 'Deployment Consultation', quantity: 1, rate: 1300, amount: 1300 }
    ]
  },
  {
    id: 'INV-2024-003',
    clientName: 'Stellar Apps',
    clientEmail: 'accounts@stellar.apps',
    projectName: 'EcoShop Mobile Frontend',
    amount: 1200.00,
    status: 'overdue',
    issueDate: '2024-09-20',
    dueDate: '2024-10-04',
    currency: 'EUR',
    items: [
      { id: '1', description: 'EcoShop License', quantity: 1, rate: 1200, amount: 1200 }
    ]
  },
  {
    id: 'INV-2024-004',
    clientName: 'Design Flux',
    clientEmail: 'hello@designflux.co',
    projectName: 'Nexus Portfolio Theme',
    amount: 450.00,
    status: 'draft',
    issueDate: '2024-10-24',
    dueDate: '2024-11-07',
    currency: 'USD',
    items: [
      { id: '1', description: 'Nexus License', quantity: 1, rate: 450, amount: 450 }
    ]
  },
];

const InvoiceManagement: React.FC = () => {
  // State
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [brandingColor, setBrandingColor] = useState('#0ea5e9');
  const [toasts, setToasts] = useState<any[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // New Invoice State
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    projectName: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    status: 'draft'
  });

  // --- Logic ---
  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = (inv.clientName + inv.id + inv.projectName).toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.reduce((acc, curr) => acc + curr.amount, 0);
    const overdue = invoices.filter(i => i.status === 'overdue').length;
    const unpaid = invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const draft = invoices.filter(i => i.status === 'draft').length;
    return { total, overdue, unpaid, draft };
  }, [invoices]);

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'neutral';
    }
  };

  const calculateNewInvoiceTotal = () => {
    return (newInvoice.items || []).reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.clientName || !newInvoice.projectName) {
      addToast('danger', 'Validation Error', 'Client name and project are required.');
      return;
    }

    const total = calculateNewInvoiceTotal();
    const invoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: newInvoice.clientName!,
      clientEmail: newInvoice.clientEmail || '',
      projectName: newInvoice.projectName!,
      amount: total,
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'USD',
      items: newInvoice.items as InvoiceItem[]
    };

    setInvoices(prev => [invoice, ...prev]);
    setIsCreateModalOpen(false);
    addToast('success', 'Invoice Created', `Invoice ${invoice.id} generated successfully.`);
    setNewInvoice({
      clientName: '', clientEmail: '', projectName: '',
      items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
      status: 'draft'
    });
  };

  const handleSendInvoice = (id: string) => {
    setSendingId(id);
    setTimeout(() => {
      setSendingId(null);
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'pending' } : inv));
      addToast('success', 'Transmission Complete', `Invoice ${id} has been dispatched to client.`);
    }, 1500);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    setSelectedInvoice(null);
    addToast('info', 'Record Deleted', `Invoice ${id} removed from ledger.`);
  };

  const handleMarkPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' as InvoiceStatus } : inv));
    addToast('success', 'Payment Settled', `Invoice ${id} marked as PAID.`);
    if (selectedInvoice?.id === id) {
      setSelectedInvoice(prev => prev ? { ...prev, status: 'paid' } : null);
    }
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <COS_ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* --- Header --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black dark:text-white tracking-tight flex items-center gap-3">
            Financial Ledger
            <div className="p-2 rounded-2xl bg-primary-600/10 text-primary-500 shadow-sm border border-primary-500/20">
              <Receipt size={24} />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-3 max-w-2xl">
            Centralized billing command center. Manage operational revenue, client settlements, and fiscal compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-1.5 shadow-sm">
            <div className="px-6 py-2 flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Revenue</span>
              <span className="text-lg font-display font-black dark:text-white">${stats.unpaid.toLocaleString()}</span>
            </div>
            <div className="w-px h-10 self-center bg-slate-100 dark:bg-zinc-800" />
            <div className="px-6 py-2 flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Overdue</span>
              <span className="text-lg font-display font-black text-red-500">{stats.overdue}</span>
            </div>
          </div>
          <COS_Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-xl shadow-primary-500/20"
          >
            New Invoice
          </COS_Button>
        </div>
      </div>

      {/* --- Controls --- */}
      <div className="glass p-4 rounded-[2.5rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search invoice ID, client, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-black rounded-[2rem] border border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary-500/50 outline-none text-sm font-bold transition-all dark:text-white shadow-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
          <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-[2rem] p-1.5 border dark:border-white/5">
            {['all', 'paid', 'pending', 'overdue', 'draft'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === st ? 'bg-white dark:bg-zinc-800 text-primary-500 shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300'}`}
              >
                {st}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="p-4 rounded-[2rem] bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all"
            title="Configure Branding"
          >
            <Palette size={20} />
          </button>
        </div>
      </div>

      {/* --- Invoice Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredInvoices.map((inv, i) => (
            <motion.div
              key={inv.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedInvoice(inv)}
              className="group relative p-8 rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 overflow-hidden cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-colors border dark:border-zinc-800">
                  <FileText size={24} />
                </div>
                <COS_Badge sentiment={getStatusColor(inv.status)}>{inv.status}</COS_Badge>
              </div>

              <div className="space-y-2 mb-8">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.id}</div>
                <h3 className="text-xl font-bold dark:text-white truncate pr-4">{inv.clientName}</h3>
                <p className="text-xs text-slate-500 font-medium truncate">{inv.projectName}</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</div>
                  <div className="text-2xl font-display font-black dark:text-white tracking-tight">
                    ${inv.amount.toLocaleString()}
                  </div>
                </div>
                {sendingId === inv.id ? (
                  <div className="p-3 bg-primary-500/10 rounded-full animate-pulse"><Loader2 size={16} className="animate-spin text-primary-500" /></div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </div>
                )}
              </div>

              {/* Card Footer Stripe */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${inv.status === 'paid' ? 'bg-emerald-500' : inv.status === 'overdue' ? 'bg-red-500' : 'bg-slate-200 dark:bg-zinc-800'
                }`} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredInvoices.length === 0 && (
          <div className="col-span-full py-32 text-center">
            <div className="flex flex-col items-center opacity-30">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
                <Layers size={40} />
              </div>
              <p className="text-xl font-bold dark:text-white uppercase tracking-widest">No matching records found</p>
              <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- Invoice Detail Modal / Drawer --- */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-[1000] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#0c0c0c] h-full shadow-2xl flex flex-col z-[1010]"
            >
              {/* Drawer Header */}
              <div className="px-10 py-8 flex items-center justify-between border-b dark:border-zinc-900 bg-white/50 dark:bg-black/50 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-primary-500/10 text-primary-500 flex items-center justify-center shadow-inner">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black dark:text-white">Invoice Details</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-mono font-bold text-slate-400">{selectedInvoice.id}</span>
                      <COS_Badge sentiment={getStatusColor(selectedInvoice.status)}>{selectedInvoice.status}</COS_Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {selectedInvoice.status !== 'paid' && (
                    <COS_Button
                      size="sm" variant="success" icon={CheckCircle2}
                      onClick={() => handleMarkPaid(selectedInvoice.id)}
                    >
                      Mark Paid
                    </COS_Button>
                  )}
                  <button onClick={() => setSelectedInvoice(null)} className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 dark:bg-[#050505] flex justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full max-w-3xl bg-white dark:bg-black rounded-[1.5rem] shadow-xl overflow-hidden border dark:border-zinc-800 min-h-[800px] flex flex-col"
                >
                  {/* Branding Strip */}
                  <div className="h-3 w-full" style={{ backgroundColor: brandingColor }} />

                  <div className="p-16 flex-1 flex flex-col">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-16">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg" style={{ backgroundColor: brandingColor }}>
                            <Sparkles size={20} className="fill-current" />
                          </div>
                          <span className="text-xl font-display font-black dark:text-white tracking-tight">RESOURCES PEN</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium space-y-1">
                          <p>123 Innovation Dr, Suite 400</p>
                          <p>San Francisco, CA 94103</p>
                          <p>billing@resourcespen.com</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <h1 className="text-5xl font-display font-black dark:text-white tracking-tighter mb-2 opacity-10">INVOICE</h1>
                        <div className="text-lg font-black dark:text-white" style={{ color: brandingColor }}>#{selectedInvoice.id}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">Issued: {selectedInvoice.issueDate}</div>
                      </div>
                    </div>

                    {/* Bill To / Terms */}
                    <div className="flex justify-between gap-12 mb-16 p-8 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl border dark:border-zinc-900/50">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</div>
                        <div className="text-lg font-bold dark:text-white mb-1">{selectedInvoice.clientName}</div>
                        <div className="text-xs text-slate-500">{selectedInvoice.clientEmail}</div>
                        <div className="text-xs text-slate-500 mt-1">{selectedInvoice.projectName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Terms</div>
                        <div className="text-2xl font-black dark:text-white mb-1">Net 30</div>
                        <div className="text-xs text-red-500 font-bold">Due: {selectedInvoice.dueDate}</div>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="flex-1">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b-2 border-slate-100 dark:border-zinc-800">
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Description</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Rate</th>
                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-4">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                          {selectedInvoice.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-6 pl-4 text-sm font-bold dark:text-zinc-200">{item.description}</td>
                              <td className="py-6 text-center text-sm font-medium text-slate-500">{item.quantity}</td>
                              <td className="py-6 text-right text-sm font-medium text-slate-500">${item.rate.toLocaleString()}</td>
                              <td className="py-6 pr-4 text-right text-sm font-black dark:text-white">${(item.quantity * item.rate).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mt-12 pt-8 border-t dark:border-zinc-900">
                      <div className="w-72 space-y-4">
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-slate-500">Subtotal</span>
                          <span className="dark:text-white">${selectedInvoice.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span className="text-slate-500">Tax (0%)</span>
                          <span className="dark:text-white">$0.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t dark:border-zinc-800">
                          <span className="text-lg font-black uppercase tracking-widest" style={{ color: brandingColor }}>Total Due</span>
                          <span className="text-3xl font-display font-black dark:text-white tracking-tighter">${selectedInvoice.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Bar Code */}
                  <div className="bg-slate-100 dark:bg-zinc-900 p-6 flex justify-between items-center opacity-50">
                    <div className="h-8 w-48 bg-slate-300 dark:bg-zinc-700 rounded-sm" /> {/* Mock barcode */}
                    <span className="font-mono text-[10px] text-slate-400">{selectedInvoice.id}-SECURE-HASH</span>
                  </div>
                </motion.div>
              </div>

              {/* Drawer Actions */}
              <div className="p-8 border-t dark:border-zinc-900 bg-white/50 dark:bg-black/50 backdrop-blur-md flex gap-4 shrink-0">
                <COS_Button
                  variant="primary" size="lg" isFullWidth icon={Send}
                  onClick={() => handleSendInvoice(selectedInvoice.id)}
                  isLoading={sendingId === selectedInvoice.id}
                >
                  {sendingId === selectedInvoice.id ? 'Transmiting...' : 'Send Invoice'}
                </COS_Button>
                <button className="p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-slate-500 rounded-2xl hover:text-primary-500 transition-colors" title="Download PDF">
                  <Download size={22} />
                </button>
                <button className="p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-slate-500 rounded-2xl hover:text-primary-500 transition-colors" title="Print">
                  <Printer size={22} />
                </button>
                <button
                  onClick={() => handleDeleteInvoice(selectedInvoice.id)}
                  className="p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Create Invoice Modal --- */}
      <COS_Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Invoice">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <COS_Input label="Client Name" placeholder="e.g. Acme Corp" value={newInvoice.clientName} onChange={e => setNewInvoice({ ...newInvoice, clientName: e.target.value })} icon={Briefcase} />
            <COS_Input label="Client Email" placeholder="billing@client.com" value={newInvoice.clientEmail} onChange={e => setNewInvoice({ ...newInvoice, clientEmail: e.target.value })} icon={Mail} />
          </div>
          <COS_Input label="Project Reference" placeholder="e.g. Q3 Software Audit" value={newInvoice.projectName} onChange={e => setNewInvoice({ ...newInvoice, projectName: e.target.value })} icon={Layers} />

          <div className="space-y-4 pt-4 border-t dark:border-zinc-900">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Items</label>
              <button className="text-xs font-bold text-primary-500 hover:underline">+ Add Item</button>
            </div>
            {newInvoice.items?.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <input className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none outline-none text-sm font-bold" placeholder="Description" value={item.description} onChange={e => {
                    const newItems = [...(newInvoice.items || [])];
                    newItems[idx].description = e.target.value;
                    setNewInvoice({ ...newInvoice, items: newItems });
                  }} />
                </div>
                <div className="w-20 space-y-2">
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none outline-none text-sm font-bold text-center" placeholder="Qty" value={item.quantity} onChange={e => {
                    const newItems = [...(newInvoice.items || [])];
                    newItems[idx].quantity = parseInt(e.target.value) || 0;
                    newItems[idx].amount = newItems[idx].quantity * newItems[idx].rate;
                    setNewInvoice({ ...newInvoice, items: newItems });
                  }} />
                </div>
                <div className="w-32 space-y-2">
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border-none outline-none text-sm font-bold text-right" placeholder="Rate" value={item.rate} onChange={e => {
                    const newItems = [...(newInvoice.items || [])];
                    newItems[idx].rate = parseFloat(e.target.value) || 0;
                    newItems[idx].amount = newItems[idx].quantity * newItems[idx].rate;
                    setNewInvoice({ ...newInvoice, items: newItems });
                  }} />
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <div className="text-xl font-bold dark:text-white">Total: <span className="text-primary-500">${calculateNewInvoiceTotal().toLocaleString()}</span></div>
            </div>
          </div>

          <COS_Button isFullWidth onClick={handleCreateInvoice} size="lg">Generate Invoice</COS_Button>
        </div>
      </COS_Modal>

      {/* --- Branding Editor Sidebar --- */}
      <AnimatePresence>
        {isEditorOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditorOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#0c0c0c] z-[1110] shadow-2xl p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Palette size={20} />
                  </div>
                  <h3 className="text-xl font-display font-black dark:text-white">Identity Studio</h3>
                </div>
                <button onClick={() => setIsEditorOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-red-500 transition-colors"><X size={20} /></button>
              </div>

              <div className="flex-1 space-y-10 overflow-y-auto hide-scrollbar">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Architectural Palette</label>
                  <div className="grid grid-cols-5 gap-3">
                    {['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                      <button
                        key={color}
                        onClick={() => setBrandingColor(color)}
                        className={`aspect-square rounded-xl transition-all border-4 ${brandingColor === color ? 'border-primary-500/30 scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black mx-auto flex items-center justify-center shadow-sm" style={{ backgroundColor: brandingColor }}>
                      <span className="text-white font-black text-xl">L</span>
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">Current Logo</h4>
                      <p className="text-xs text-slate-400">PNG / SVG supported</p>
                    </div>
                    <COS_Button variant="secondary" size="sm" isFullWidth icon={ImageIcon}>Upload New</COS_Button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t dark:border-zinc-900 mt-auto">
                <COS_Button isFullWidth onClick={() => { setIsEditorOpen(false); addToast('success', 'Branding Updated', 'Global invoice styles saved.') }}>Save Identity</COS_Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceManagement;