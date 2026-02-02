
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Filter, LayoutGrid, List, Plus,
  MoreHorizontal, Eye, Edit3, Trash2, Star,
  CheckCircle2, Clock, Archive, ArrowUpDown,
  ChevronRight, ChevronLeft, X, FilterX,
  Settings2, Download, ExternalLink, ShieldCheck,
  Zap, Code2, Layers, DollarSign, Tag, Info,
  Check, AlertCircle, RefreshCcw, MoreVertical,
  MousePointer2, SlidersHorizontal, Share2,
  Laptop, Smartphone, Globe, Cloud, Database,
  Copy, Power, Server, HardDrive, ShoppingBag,
  History, BarChart3, TrendingUp, Users, Activity
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import OnboardingWizard from './OnboardingWizard';
import { MockApiService } from '../MockApiService';
import { COS_ToastContainer, COS_Button, COS_Badge } from '../components/COS_Library';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Product | undefined>(undefined);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<any[]>([]);

  // Mock Analytics Data
  const stats = useMemo(() => ({
    totalValue: projects.reduce((acc, p) => acc + (p.price || 0), 0),
    activeItems: projects.filter(p => p.status === 'published').length,
    draftItems: projects.filter(p => p.status === 'draft').length,
    featuredItems: projects.filter(p => p.isFeatured).length
  }), [projects]);

  const addToast = (type: string, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    const items = await MockApiService.getProjects();
    setProjects(items);
    setIsLoading(false);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = (p.name + p.description).toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter.toLowerCase();
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, search, categoryFilter, statusFilter]);

  const toggleFeatured = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    await MockApiService.updateProject(id, { isFeatured: !project.isFeatured });
    loadProjects();
    addToast('success', 'Status Updated', project.isFeatured ? 'Removed from Featured' : 'Promoted to Featured');
  };

  const handleClone = async (id: string) => {
    await MockApiService.cloneProject(id);
    loadProjects();
    addToast('success', 'Asset Cloned', 'Duplicate created successfully.');
  };

  const handleEdit = (project: Product) => {
    setEditingProject(project);
    setIsWizardOpen(true);
  };

  const updateStatus = async (id: string, status: ProductStatus) => {
    await MockApiService.updateProject(id, { status });
    loadProjects();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this asset?")) return;
    setIsDeleting(id);
    setTimeout(async () => {
      setProjects(prev => prev.filter(p => p.id !== id));
      setIsDeleting(null);
      addToast('info', 'Asset Deleted', 'Item removed from registry.');
    }, 800);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map(p => p.id));
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
      active: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20',
      draft: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      archived: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
      review: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      disabled: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return (
      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-32 max-w-[1920px] mx-auto text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <COS_ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- HEADER: COMPONENT VAULT --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative">
        <div className="absolute top-0 right-0 p-32 bg-primary-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Database size={12} />
            Asset Registry // Node-01
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight dark:text-white flex items-center gap-4">
            Asset Inventory
            <span className="text-lg text-zinc-400 font-medium hidden sm:inline">({projects.length} Total)</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium mt-2 max-w-lg border-l-2 border-primary-500/30 pl-4">
            Authorized personnel only. Manage architectural blueprints, digital assets, and draft protocols.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* Stats Miniature */}
          <div className="hidden xl:flex gap-4 mr-6 pr-6 border-r border-slate-200 dark:border-zinc-800">
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</div>
              <div className="font-mono text-sm font-bold dark:text-white">${stats.totalValue.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</div>
              <div className="font-mono text-sm font-bold text-emerald-500">{stats.activeItems}</div>
            </div>
          </div>

          <div className="flex items-center bg-white dark:bg-zinc-900 rounded-lg p-1 border border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-zinc-800 text-primary-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-100 dark:bg-zinc-800 text-primary-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'}`}
            >
              <List size={18} />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingProject(undefined);
              setIsWizardOpen(true);
            }}
            className="group relative px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-black uppercase tracking-widest overflow-hidden flex items-center gap-3 shadow-xl shadow-zinc-500/10"
          >
            <div className="absolute inset-0 bg-primary-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Plus size={16} />
            Forge Asset
          </motion.button>
        </div>
      </div>

      {/* --- CONTROL BAR --- */}
      <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-2 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-40 backdrop-blur-xl shadow-xl shadow-black/5">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search via SKU, Name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-xl focus:bg-slate-50 dark:focus:bg-zinc-800 outline-none text-sm transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-2 hidden md:block" />

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
            {['All', 'SaaS', 'Commerce', 'Web3', 'Design'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat === 'All' ? 'All' : cat === 'SaaS' ? 'SaaS Dashboard' : cat === 'Web3' ? 'Web3 Interface' : cat)} // Mapping simple logic for demo
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${(categoryFilter === 'All' && cat === 'All') || (categoryFilter.includes(cat) && cat !== 'All')
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFilterPanelOpen(true)}
            className={`p-2.5 ml-auto rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center gap-2 text-xs font-bold transition-all hover:border-primary-500 hover:text-primary-500 ${isFilterPanelOpen ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-slate-500'}`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-zinc-800 rounded-xl"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 mr-2">{selectedIds.length} ACTIVE</span>
            <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700 mx-1" />
            <button className="p-1.5 hover:text-red-500 transition-colors" onClick={() => {
              if (confirm(`Delete ${selectedIds.length} items?`)) {
                selectedIds.forEach(id => deleteProject(id));
                setSelectedIds([]);
              }
            }}><Trash2 size={14} /></button>
            <button className="p-1.5 hover:text-primary-500 transition-colors"><Archive size={14} /></button>
            <button className="p-1.5 hover:text-emerald-500 transition-colors"><CheckCircle2 size={14} /></button>
          </motion.div>
        )}
      </div>

      {/* --- VAULT GRID --- */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-30">
                <RefreshCcw className="animate-spin mb-4 text-primary-500" size={48} />
                <p className="font-black uppercase tracking-widest text-[10px] text-primary-500">Decrypting Vault...</p>
              </div>
            ) : (
              filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative bg-white dark:bg-zinc-900 rounded-2xl border transition-all duration-300 overflow-hidden ${selectedIds.includes(project.id) ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/20'}`}
                >
                  {/* Selection Overlay */}
                  <div className={`absolute inset-0 bg-primary-500/5 pointer-events-none transition-opacity duration-300 ${selectedIds.includes(project.id) ? 'opacity-100' : 'opacity-0'}`} />

                  {/* Top Bar */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                    <div className={`transition-all duration-300 ${selectedIds.includes(project.id) || 'group-hover:opacity-100 opacity-0'}`}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.id)}
                        onChange={() => toggleSelect(project.id)}
                        className="w-5 h-5 rounded border-2 border-slate-300 dark:border-zinc-600 checked:bg-primary-500 checked:border-primary-500 cursor-pointer"
                      />
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  {/* Image Area */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-zinc-100 dark:bg-black">
                    <img src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />

                    {/* Holographic Action Layer */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(project)} className="p-3 bg-white text-black rounded-lg hover:bg-primary-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleClone(project.id)} className="p-3 bg-white text-black rounded-lg hover:bg-primary-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100 shadow-lg">
                          <Copy size={18} />
                        </button>
                        <button onClick={() => deleteProject(project.id)} className="p-3 bg-white text-black rounded-lg hover:bg-red-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150 shadow-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Block */}
                  <div className="p-5 border-t border-slate-100 dark:border-zinc-800 relative bg-white dark:bg-zinc-900">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white truncate pr-4">{project.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {project.slug.substring(0, 12)}...</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-300">
                        ${project.price}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.techStack.slice(0, 2).map((tech, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 border border-slate-200 dark:border-zinc-700 rounded text-[9px] font-bold text-slate-500 dark:text-zinc-500 uppercase">
                          {tech.name}
                        </span>
                      ))}
                      {project.techStack.length > 2 && (
                        <span className="px-1.5 py-0.5 border border-slate-200 dark:border-zinc-700 rounded text-[9px] font-bold text-slate-500 dark:text-zinc-500">
                          +{project.techStack.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                      <button
                        onClick={() => toggleFeatured(project.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${project.isFeatured ? 'text-yellow-500' : 'text-slate-400 hover:text-primary-500'}`}
                      >
                        <Star size={12} className={project.isFeatured ? 'fill-current' : ''} />
                        {project.isFeatured ? 'Featured' : 'Promote'}
                      </button>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">2d ago</span>
                      </div>
                    </div>
                  </div>

                  {isDeleting === project.id && (
                    <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm z-30 flex items-center justify-center">
                      <RefreshCcw className="animate-spin text-red-500" size={32} />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* LIST VIEW REIMPLEMENTED */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          {filteredProjects.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-40">
              <Search size={40} className="mb-4 text-slate-400" />
              <p className="font-bold text-slate-500">No assets found matching filters.</p>
            </div>
          ) : (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={selectedIds.length === filteredProjects.length && filteredProjects.length > 0}
                      className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-2">Asset Identity</th>
                  <th className="py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-center">Value</th>
                  <th className="py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-center">Status</th>
                  <th className="py-4 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-right px-6">Functions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                {filteredProjects.map((project, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    key={project.id}
                    className={`group hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors ${selectedIds.includes(project.id) ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(project.id)}
                        onChange={() => toggleSelect(project.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 cursor-pointer"
                      />
                    </td>
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-black border border-slate-200 dark:border-zinc-800">
                          <img src={project.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {project.name}
                            {project.isFeatured && <Star size={12} className="text-yellow-500 fill-current" />}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">SKU: {project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center font-mono text-sm font-medium text-slate-600 dark:text-zinc-400">${project.price}</td>
                    <td className="py-4 text-center">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="py-4 text-right px-6">
                      <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(project)} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-slate-400 hover:text-primary-500 transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => handleClone(project.id)} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"><Copy size={14} /></button>
                        <button onClick={() => deleteProject(project.id)} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- FILTER DRAWER --- */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterPanelOpen(false)} className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[1000]" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed top-2 bottom-2 right-2 w-full max-w-sm bg-white dark:bg-zinc-950 z-[1010] shadow-2xl rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-black dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <Filter size={18} className="text-primary-500" /> Query Filters
                </h3>
                <button onClick={() => setIsFilterPanelOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"><X size={18} /></button>
              </div>

              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Lifecycle</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['All Status', 'Published', 'Draft', 'Archived', 'Review', 'Disabled'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-2.5 rounded-lg border text-xs font-bold transition-all text-left ${statusFilter === status ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-400'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Point</label>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>$0</span>
                      <span>$500+</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-primary-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-zinc-900/50">
                <button
                  onClick={() => { setStatusFilter('All Status'); setCategoryFilter('All'); }}
                  className="py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Reset Logic
                </button>
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWizardOpen && (
          <OnboardingWizard
            initialData={editingProject}
            onClose={() => {
              setIsWizardOpen(false);
              setEditingProject(undefined);
            }}
            onComplete={() => {
              setIsWizardOpen(false);
              setEditingProject(undefined);
              loadProjects();
              addToast('success', 'Registry Updated', 'Manifest changes committed.');
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProjectManagement;
