
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   X, Check, ChevronRight, ChevronLeft, Save, Sparkles,
   Plus, Trash2, ImageIcon, Package, Zap,
   Terminal, Globe, Database, Cpu, Layout, Eye,
   ShieldCheck, DollarSign, List, Smartphone, Monitor,
   Tablet, Code2, Tag, Info, Target, Share2,
   Box, Layers, FileText, Star, Search, GripVertical,
   Activity, ShoppingCart, MessageCircle, MessageSquare,
   HelpCircle, RefreshCcw, Paperclip, Send, MousePointer2,
   Clock, ShieldAlert, Laptop, Award, Landmark, ExternalLink,
   Shield, CheckCircle2, ListTodo, Route, Blocks, FileCode,
   Lock, Settings, BarChart3, Fingerprint, FileType, HandCoins,
   LogOut, ArrowRight, Rocket, Boxes, Users, Newspaper, LayoutGrid,
   BookOpen, TrendingUp, LayoutList, Edit3, Ban, Upload
} from 'lucide-react';
import { Product, TechModule, WorkflowStep, FAQItem, ModuleInfo, ProductDoc, ProductStatus } from '../types';
import { COS_Input, COS_Badge, COS_Button, COS_Spinner } from '../components/COS_Library';
import { MockApiService } from '../MockApiService';

interface OnboardingWizardProps {
   initialData?: Product;
   onClose: () => void;
   onComplete: () => void;
}

const STEPS_META = [
   "Identity Genesis", "Categorization", "Gallery (10 Nodes)", "Price Matrix",
   "Purchase Logic", "Access Protocol", "Product Abstract", "Core Attributes",
   "Objectives", "Future Scope", "Tech Stack", "Architecture", "Workflow",
   "System Modules", "Asset Vault", "Reputation Logic", "Knowledge Nodes", "Related Assets",
   "Neural Intelligence", "Layout Switchboard", "SEO Discovery", "Registry Launch"
];

const STEP_TIPS = [
   "Choose a name that resonates with enterprise authority. 'Nexus', 'Core', 'Prime' are trending suffixes.",
   "Precise taxonomy aids in autodiscovery. Select the most specific vertical for your asset.",
   "High-res isometric screenshots perform 40% better. Use transparent PNGs for the main manifest.",
   "Tiered pricing with a 'Pro' anchor tends to maximize conversion. Consider a discount for early adopters.",
   "Define clear acquisition paths. 'Grant License' is properly suited for enterprise deals.",
   "Set access protocols carefully. 'Instant' is preferred for SaaS, 'Vetted' for high-value core systems.",
   "Your abstract should be concise. Focus on the 'Why' before the 'What'.",
   "Attributes defined here feed into the comparison engine. Be specific with key-value pairs.",
   "Outline clear objectives. What problem does this solve? Align with business KPIs.",
   "Investors look for longevity. Define a clear roadmap or future version trajectory.",
   "List all dependencies. This allows the system to auto-generate compatibility matrices.",
   "Upload a schematic to visualize data flow. Essential for technical due diligence.",
   "Map the user journey. Logic steps help users understand the operational flow.",
   "Breakdown the system into functional modules. This highlights modularity and clean architecture.",
   "Include all documentation. API References and Setup Guides are critical for adoption.",
   "Enable reputation layers to build trust. Auto-moderation is recommended for scaling.",
   "Pre-empt user questions. A robust FAQ reduces support tickets by 60%.",
   "Link to other ecosystem assets. Cross-selling starts here.",
   "Activate neural engines for smart recommendations. This increases discoverability.",
   "Design your landing page topology. Order matters—place 'Hero' and 'Features' first.",
   "Optimize for discovery. Use high-volume keywords for the internal search graph.",
   "Final review. Ensure all nodes are calibrated before committing to the immutable registry."
];

const ProductForgeWizard: React.FC<OnboardingWizardProps> = ({ initialData, onClose, onComplete }) => {
   const [currentStep, setCurrentStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const scrollRef = useRef<HTMLDivElement>(null);
   const isEditMode = !!initialData?.id;

   const [formData, setFormData] = useState<Partial<Product>>(() => {
      if (initialData) return initialData;

      const saved = localStorage.getItem('productforge_draft');
      return saved ? JSON.parse(saved) : {
         id: `p-${Date.now()}`,
         sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
         name: '',
         subtitle: '',
         slug: '',
         intro: '',
         description: '',
         longDescription: '',
         type: 'Software',
         visibility: 'public',
         status: 'draft',
         price: 0,
         originalPrice: 0,
         currency: 'INR',
         image: '',
         gallery: [],
         tags: [],
         keywords: [],
         techStack: [],
         workflow: [],
         systemModules: [],
         docs: [],
         faqs: [],
         features_list: [],
         objectives: { technical: [], business: [], learning: [] },
         scope: { industry: [], academic: [], future: '' },
         enableReviews: true,
         moderationMode: 'Auto',
         enableAddToCart: true,
         enableProcureNow: true,
         enableWishlist: true,
         enableShare: true,
         purchaseLimit: 1,
         accessType: 'Instant',
         sections: {
            hero: { isEnabled: true, order: 0, priority: 0 },
            media: { isEnabled: true, order: 1, priority: 1 },
            about: { isEnabled: true, order: 2, priority: 2 },
            features: { isEnabled: true, order: 3, priority: 3 },
            tech: { isEnabled: true, order: 4, priority: 4 },
            workflow: { isEnabled: true, order: 5, priority: 5 },
            faq: { isEnabled: true, order: 6, priority: 6 },
            trust: { isEnabled: true, order: 7, priority: 7 },
            services: { isEnabled: true, order: 8, priority: 8 },
            testimonials: { isEnabled: true, order: 9, priority: 9 },
            team: { isEnabled: false, order: 10, priority: 10 },
            contact: { isEnabled: false, order: 11, priority: 11 },
            blog: { isEnabled: false, order: 12, priority: 12 }
         },
         seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', indexingRules: 'index, follow', ogTags: {} },
         architectureSummary: '',
         relatedProductIds: [],
         aiRecommendationEnabled: true
      };
   });

   useEffect(() => {
      if (!isEditMode) {
         localStorage.setItem('productforge_draft', JSON.stringify(formData));
      }
      scrollRef.current?.scrollTo(0, 0);
   }, [formData, currentStep, isEditMode]);

   const updateField = (path: string, value: any) => {
      setFormData(prev => {
         const next = { ...prev };
         const keys = path.split('.');
         let current: any = next;
         for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = current[keys[i]] ? { ...current[keys[i]] } : {};
            current = current[keys[i]];
         }
         current[keys[keys.length - 1]] = value;
         if (path === 'name' && !prev.slug && !isEditMode) {
            next.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
         }
         return next;
      });
   };

   const addArrayItem = (path: string, defaultValue: any) => {
      const keys = path.split('.');
      let current: any = formData;
      for (const key of keys) current = current?.[key];
      const newList = [...(current || []), defaultValue];
      updateField(path, newList);
   };

   const removeArrayItem = (path: string, index: number) => {
      const keys = path.split('.');
      let current: any = formData;
      for (const key of keys) current = current?.[key];
      const newList = (current || []).filter((_: any, i: number) => i !== index);
      updateField(path, newList);
   };

   // Basic validation to ensure data integrity before proceeding
   const isStepValid = (step: number) => {
      switch (step) {
         case 1: return (formData.name?.length || 0) > 2; // Name is mandatory
         default: return true;
      }
   };

   const handleFinish = async () => {
      setIsSubmitting(true);
      try {
         if (isEditMode && initialData?.id) {
            await MockApiService.updateProject(initialData.id, formData);
         } else {
            await MockApiService.createProject(formData as Product);
            localStorage.removeItem('productforge_draft');
         }
         onComplete();
      } catch (err) {
         console.error('Registry operation failed:', err);
      } finally {
         setIsSubmitting(false);
      }
   };

   const renderStep = () => {
      const StepWrapper = ({ children }: { children: React.ReactNode }) => (
         <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-7xl mx-auto"
         >
            {children}
         </motion.div>
      );

      switch (currentStep) {
         case 1: return (
            <StepWrapper>
               <div className="grid grid-cols-12 gap-8 h-full">
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                     {/* Primary Identity Card */}
                     <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-purple-500/5 to-transparent border border-indigo-500/20">
                        <div className="bg-white dark:bg-[#0c0c0c] rounded-[2.2rem] p-8 md:p-10 space-y-8 relative overflow-hidden">

                           {/* Decorative Header */}
                           <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-500/20">
                                 <Terminal size={20} />
                              </div>
                              <div>
                                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">System Identity</h4>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Core Protocol Definition</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 gap-8">
                              <div className="space-y-2">
                                 <div className="flex justify-between">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Name</label>
                                    <span className="text-[9px] font-bold text-indigo-500">{formData.name?.length || 0} / 60</span>
                                 </div>
                                 <COS_Input
                                    value={formData.name}
                                    onChange={e => updateField('name', e.target.value)}
                                    placeholder="e.g. Horizon Pro"
                                    className="text-lg py-4 font-bold"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtitle / Tagline</label>
                                 <COS_Input
                                    value={formData.subtitle}
                                    onChange={e => updateField('subtitle', e.target.value)}
                                    placeholder="e.g. The Ultimate Industrial SaaS Foundation"
                                 />
                              </div>
                           </div>

                           <div className="pt-8 mt-4 border-t border-dashed border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System SKU</label>
                                 <COS_Input value={formData.sku} onChange={e => updateField('sku', e.target.value)} className="font-mono text-xs tracking-wider" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Class</label>
                                 <div className="relative">
                                    <select
                                       value={formData.type}
                                       onChange={e => updateField('type', e.target.value)}
                                       className="w-full px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:border-indigo-500 transition-all appearance-none"
                                    >
                                       <option>Digital Asset</option>
                                       <option>SaaS Platform</option>
                                       <option>Design System</option>
                                       <option>Service Protocol</option>
                                    </select>
                                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                                 </div>
                              </div>
                           </div>

                           {/* Background Decor */}
                           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
                        </div>
                     </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4 space-y-6">
                     <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                           <Database size={16} className="text-slate-400" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Metadata Registry</h4>
                        </div>

                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Slug Endpoint</label>
                              <div className="relative">
                                 <span className="absolute left-4 top-3.5 text-slate-500 text-xs font-mono">/</span>
                                 <input
                                    value={formData.slug}
                                    onChange={e => updateField('slug', e.target.value)}
                                    className="w-full pl-7 pr-4 py-3 rounded-xl bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all"
                                 />
                              </div>
                           </div>
                           <COS_Input label="Version Tag" value={formData.version} onChange={e => updateField('version', e.target.value)} placeholder="v1.0.0" className="font-mono" />
                           <COS_Input label="Owner Hash" value={formData.owner} onChange={e => updateField('owner', e.target.value)} placeholder="Core Team" />
                        </div>
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );

         case 2: return (
            <StepWrapper>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">

                  {/* Primary Taxonomy */}
                  <div className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 overflow-hidden transition-all hover:border-cyan-500/30">
                     <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-4 group-hover:scale-110 transition-transform duration-500">
                           <Layout size={24} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Primary Taxonomy</h4>
                           <p className="text-[10px] text-slate-500 font-medium">Define the core classification vertical.</p>
                        </div>

                        <div className="pt-4 space-y-4">
                           <COS_Input label="Main Category" value={formData.category} onChange={e => updateField('category', e.target.value)} placeholder="e.g. Finance" />
                           <COS_Input label="Subcategory" value={formData.subcategory} onChange={e => updateField('subcategory', e.target.value)} placeholder="e.g. Dashboard" />
                        </div>
                     </div>

                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-[50px] group-hover:bg-cyan-500/20 transition-all duration-700" />
                  </div>

                  {/* Vertical Context */}
                  <div className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 overflow-hidden transition-all hover:border-emerald-500/30">
                     <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-500">
                           <Target size={24} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Vertical Context</h4>
                           <p className="text-[10px] text-slate-500 font-medium">Specify the operational domain.</p>
                        </div>

                        <div className="pt-4 space-y-4">
                           <COS_Input label="Industry Vertical" value={formData.industryCategory} onChange={e => updateField('industryCategory', e.target.value)} placeholder="e.g. Fintech" />
                           <COS_Input label="Domain Niche" value={formData.domainCategory} onChange={e => updateField('domainCategory', e.target.value)} placeholder="e.g. Banking" />
                        </div>
                     </div>

                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-all duration-700" />
                  </div>
               </div>
            </StepWrapper>
         );

         case 3: return (
            <StepWrapper>
               <div className="space-y-8">
                  {/* Main Visual Token */}
                  <div className="group relative w-full h-64 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center">
                     {formData.image ? (
                        <>
                           <img src={formData.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Main" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-4 py-2 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                 <Edit3 size={12} /> Replace Visual
                              </span>
                           </div>
                        </>
                     ) : (
                        <div className="space-y-4 p-8">
                           <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-500">
                              <ImageIcon size={32} />
                           </div>
                           <div>
                              <h4 className="text-sm font-black dark:text-white uppercase tracking-wider">Visual Token</h4>
                              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Upload the primary 16:9 manifest visual.</p>
                           </div>
                        </div>
                     )}
                     <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                        Primary Asset
                     </div>
                  </div>

                  {/* Gallery Grid */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Layers size={12} /> Auxiliary Gallery Nodes
                        </label>
                        <span className="text-[9px] font-bold text-slate-500">{(formData.gallery?.length || 0)} / 10 Active</span>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {formData.gallery?.map((img, i) => (
                           <motion.div
                              layout
                              key={i}
                              className="aspect-square rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 overflow-hidden relative group"
                           >
                              <img src={img} className="w-full h-full object-cover" alt={`node-${i}`} />
                              <div className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => removeArrayItem('gallery', i)}>
                                 <Trash2 size={20} className="text-white" />
                              </div>
                           </motion.div>
                        ))}
                        {[...Array(Math.max(0, 10 - (formData.gallery?.length || 0)))].map((_, i) => (
                           <div key={`empty-${i}`} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500/5 cursor-pointer transition-all">
                              <Plus size={20} />
                              <span className="text-[9px] font-bold uppercase">Add</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );

         case 4: return (
            <StepWrapper>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                  <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                           <DollarSign size={20} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Valuation Matrix</h4>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Define Asset Value</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 space-y-2">
                           <label className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Base Valuation (Price)</label>
                           <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500">$</span>
                              <input
                                 type="number"
                                 value={formData.price}
                                 onChange={e => updateField('price', Number(e.target.value))}
                                 className="flex-1 bg-transparent text-4xl font-black text-emerald-700 dark:text-emerald-400 outline-none placeholder:text-emerald-500/30"
                                 placeholder="0.00"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <COS_Input
                              label="Reference (Original)"
                              value={formData.originalPrice}
                              type="number"
                              onChange={e => updateField('originalPrice', Number(e.target.value))}
                              className="font-mono text-slate-500"
                           />
                           <COS_Input
                              label="Incentive %"
                              value={formData.discountPercentage}
                              type="number"
                              onChange={e => updateField('discountPercentage', Number(e.target.value))}
                              className="text-emerald-500 font-bold"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="flex-1 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 flex flex-col justify-center">
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-zinc-800 shadow-sm">
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 text-indigo-500">
                                 <Zap size={16} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Scarcity Protocol</span>
                              </div>
                              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">Activate limited-time incentive mechanics to drive urgency.</p>
                           </div>
                           <button onClick={() => updateField('isLimitedDeal', !formData.isLimitedDeal)} className={`w-14 h-8 rounded-full relative transition-all duration-300 ${formData.isLimitedDeal ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-slate-200 dark:bg-zinc-800'}`}>
                              <motion.div animate={{ x: formData.isLimitedDeal ? 26 : 3 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );

         case 5: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                        { label: 'Cart Integration', field: 'enableAddToCart', icon: ShoppingCart, desc: 'Allow direct cart acquisition.' },
                        { label: 'Procurement Protocol', field: 'enableProcureNow', icon: Zap, desc: 'Instant 1-click access workflow.' },
                        { label: 'Watchlist Node', field: 'enableWishlist', icon: Star, desc: 'User interest tracking enabled.' },
                        { label: 'Network Share', field: 'enableShare', icon: Share2, desc: 'Viral distribution mechanics.' }
                     ].map(item => (
                        <div
                           key={item.field}
                           onClick={() => updateField(item.field, !(formData as any)[item.field])}
                           className={`cursor-pointer group p-6 rounded-[2rem] border transition-all duration-300 flex items-start justify-between ${(formData as any)[item.field]
                              ? 'bg-white dark:bg-[#0c0c0c] border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                              : 'bg-slate-50 dark:bg-zinc-900/30 border-slate-200 dark:border-white/5 opacity-70 hover:opacity-100 hover:bg-white dark:hover:bg-zinc-900'
                              }`}
                        >
                           <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-2xl transition-colors ${(formData as any)[item.field] ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-200 dark:bg-zinc-800 text-slate-400'
                                 }`}>
                                 <item.icon size={20} />
                              </div>
                              <div>
                                 <h5 className={`text-xs font-black uppercase tracking-widest transition-colors ${(formData as any)[item.field] ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                                    }`}>{item.label}</h5>
                                 <p className="text-[10px] text-slate-400 font-mono mt-1">{item.desc}</p>
                              </div>
                           </div>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${(formData as any)[item.field]
                              ? 'bg-indigo-500 border-indigo-500 scale-110'
                              : 'border-slate-300 dark:border-zinc-700'
                              }`}>
                              {(formData as any)[item.field] && <Check size={12} className="text-white" />}
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/5 mt-6 flex items-center gap-6">
                     <div className="p-3 bg-slate-200 dark:bg-zinc-800 rounded-xl text-slate-500">
                        <Ban size={20} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between mb-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Max Acquisition Limit (Per Entity)</label>
                           <span className="text-[10px] font-bold text-indigo-500">{formData.purchaseLimit || 0} Units</span>
                        </div>
                        <input
                           type="range"
                           min="0" max="100"
                           value={formData.purchaseLimit || 0}
                           onChange={e => updateField('purchaseLimit', Number(e.target.value))}
                           className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                     </div>
                     <COS_Input
                        value={formData.purchaseLimit}
                        type="number"
                        onChange={e => updateField('purchaseLimit', Number(e.target.value))}
                        className="w-20 text-center font-bold"
                     />
                  </div>
               </div>
            </StepWrapper>
         );
         case 6: return (
            <StepWrapper>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                  <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-8">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                              <Lock size={20} />
                           </div>
                           <div>
                              <label className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Access Protocol</label>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Define Availability Logic</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                           {['Instant', 'Delayed'].map((type) => (
                              <button
                                 key={type}
                                 onClick={() => updateField('accessType', type)}
                                 className={`group relative px-6 py-5 rounded-3xl border text-left flex items-center justify-between transition-all duration-300 ${formData.accessType === type
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/25 scale-[1.02]'
                                    : 'bg-slate-50 dark:bg-zinc-900/50 border-transparent dark:text-slate-400 hover:bg-white dark:hover:bg-zinc-900 hover:border-indigo-500/30'
                                    }`}
                              >
                                 <div>
                                    <span className="text-xs font-black uppercase tracking-wider block mb-1">{type === 'Instant' ? 'Instant Allocation' : 'Delayed Verification'}</span>
                                    <span className={`text-[10px] font-medium ${formData.accessType === type ? 'text-indigo-200' : 'text-slate-500'}`}>
                                       {type === 'Instant' ? 'Direct delivery upon acquisition.' : 'Manual approval required.'}
                                    </span>
                                 </div>
                                 {formData.accessType === type && (
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                       <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                 )}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/5 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Distribution Rights</h4>
                        <COS_Input
                           label="Licensing Node"
                           value={formData.license}
                           onChange={e => updateField('license', e.target.value)}
                           placeholder="e.g. MIT / Commercial / Proprietary"
                        />
                        <COS_Input
                           label="Supported Formats (Array)"
                           value={formData.fileFormats?.join(', ')}
                           onChange={e => updateField('fileFormats', e.target.value.split(',').map(s => s.trim()))}
                           placeholder="PDF, SQL, TSX..."
                           icon={FileType}
                        />
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );
         case 7: return (
            <StepWrapper>
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                     <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-500/10">
                        <div className="bg-white dark:bg-[#0c0c0c] rounded-[2.3rem] p-8 space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                              <Info size={12} /> Executive Summary
                           </label>
                           <textarea
                              value={formData.intro}
                              onChange={e => updateField('intro', e.target.value)}
                              className="w-full bg-transparent text-lg font-medium dark:text-white outline-none resize-none leading-relaxed placeholder:text-slate-300"
                              rows={4}
                              placeholder="Brief high-level overview of the system capabilities..."
                           />
                        </div>
                     </div>
                     <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/5 space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Technical Abstract (Deep Detail)</label>
                        <textarea
                           value={formData.description}
                           onChange={e => updateField('description', e.target.value)}
                           className="w-full bg-transparent text-sm font-mono text-slate-600 dark:text-slate-400 outline-none resize-none leading-relaxed"
                           rows={10}
                           placeholder="Comprehensive technical specifications and implementation details..."
                        />
                     </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                     <div className="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10">
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-2">Writing Guide</h4>
                        <p className="text-[10px] text-indigo-400/80 leading-relaxed mb-4">
                           Use clear, concise technical language. Focus on value proposition and architectural integrity.
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {['Scalability', 'Security', 'Performance', 'Modularity'].map(tag => (
                              <span key={tag} className="px-2 py-1 rounded-md bg-white dark:bg-indigo-500/20 text-[9px] font-bold text-indigo-500 uppercase">{tag}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );
         case 8: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                           <List size={20} />
                        </div>
                        <div>
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Attribute Nodes</span>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Key Feature List</p>
                        </div>
                     </div>
                     <button onClick={() => addArrayItem('features_list', '')} className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all">
                        <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Append Node
                     </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     {(formData.features_list || []).map((feat, i) => (
                        <motion.div
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           key={i}
                           className="group flex items-center gap-4 p-2 pl-4 rounded-2xl bg-white dark:bg-[#0c0c0c] border border-slate-100 dark:border-white/5 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all"
                        >
                           <div className="w-2 h-2 rounded-full bg-purple-500/50 group-hover:bg-purple-500 transition-colors" />
                           <input
                              value={feat}
                              onChange={e => {
                                 const newList = [...(formData.features_list || [])];
                                 newList[i] = e.target.value;
                                 updateField('features_list', newList);
                              }}
                              className="flex-1 bg-transparent py-4 text-xs font-bold dark:text-white outline-none font-mono placeholder:text-slate-300"
                              placeholder="Define attribute..."
                              autoFocus={!feat}
                           />
                           <button onClick={() => removeArrayItem('features_list', i)} className="p-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 size={16} />
                           </button>
                        </motion.div>
                     ))}
                     {(formData.features_list || []).length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 gap-4">
                           <LayoutList size={32} className="opacity-20" />
                           <p className="text-xs font-mono">No attributes defined. Initialize sequence.</p>
                           <button onClick={() => addArrayItem('features_list', '')} className="text-purple-500 font-bold text-xs hover:underline">Start Adding</button>
                        </div>
                     )}
                  </div>
               </div>
            </StepWrapper>
         );

         case 9: return (
            <StepWrapper>
               <div className="space-y-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 px-2 shrink-0">
                     <Target size={20} className="text-orange-500" />
                     <h4 className="text-sm font-black uppercase tracking-widest dark:text-white">Core Objectives</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                     {['technical', 'business', 'learning'].map((type) => (
                        <div key={type} className="flex flex-col rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 hover:border-orange-500/20 transition-all overflow-hidden h-[500px]">
                           <div className={`p-6 border-b border-slate-100 dark:border-white/5 ${type === 'technical' ? 'bg-cyan-500/5' : type === 'business' ? 'bg-emerald-500/5' : 'bg-orange-500/5'}`}>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${type === 'technical' ? 'bg-cyan-500' : type === 'business' ? 'bg-emerald-500' : 'bg-orange-500'} shadow-[0_0_10px_currentColor]`} />
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest font-mono">{type}</span>
                                 </div>
                                 <span className="text-[9px] font-bold text-slate-400">{(formData.objectives?.[type as keyof typeof formData.objectives] || []).length}</span>
                              </div>
                           </div>

                           <div className="flex-1 overflow-y-auto space-y-0 custom-scrollbar">
                              {(formData.objectives?.[type as keyof typeof formData.objectives] || []).map((obj: string, i: number) => (
                                 <div key={i} className="group relative p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <p className="text-[10px] font-medium dark:text-zinc-300 leading-relaxed pr-6">{obj}</p>
                                    <button
                                       onClick={() => {
                                          const newObjState = { ...formData.objectives };
                                          const key = type as keyof typeof newObjState;
                                          const list = newObjState[key] || [];
                                          newObjState[key] = list.filter((_, idx) => idx !== i);
                                          updateField('objectives', newObjState);
                                       }}
                                       className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                                    >
                                       <X size={12} />
                                    </button>
                                 </div>
                              ))}
                           </div>

                           <div className="p-4 bg-slate-50 dark:bg-zinc-900/30">
                              <div className="flex items-center gap-2 bg-white dark:bg-black px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus-within:border-orange-500 transition-colors">
                                 <Plus size={12} className="text-slate-400" />
                                 <input
                                    className="flex-1 bg-transparent text-[10px] font-bold dark:text-white outline-none placeholder:text-slate-400 uppercase font-mono"
                                    placeholder="ADD TARGET"
                                    onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                          const val = e.currentTarget.value.trim();
                                          if (val) {
                                             const newObjState = { ...formData.objectives };
                                             if (!newObjState[type as keyof typeof newObjState]) newObjState[type as keyof typeof newObjState] = [];
                                             (newObjState[type as keyof typeof newObjState] as string[]).push(val);
                                             updateField('objectives', newObjState);
                                             e.currentTarget.value = '';
                                          }
                                       }
                                    }}
                                 />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </StepWrapper>
         );

         case 10: return (
            <StepWrapper>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                           <Globe size={16} className="text-cyan-500" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Industry Scope</span>
                        </div>
                        <button onClick={() => {
                           const newScope = { ...formData.scope };
                           if (!newScope.industry) newScope.industry = [];
                           newScope.industry.push('');
                           updateField('scope', newScope);
                        }} className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center hover:bg-cyan-500 hover:text-white hover:scale-110 transition-all shadow-lg shadow-cyan-500/20"><Plus size={14} /></button>
                     </div>
                     <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {(formData.scope?.industry || []).map((item, i) => (
                           <div key={i} className="flex gap-3 animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                              <div className="flex-1 p-[1px] rounded-xl bg-gradient-to-r from-cyan-500/30 to-transparent">
                                 <input
                                    value={item}
                                    onChange={(e) => {
                                       const newScope = { ...formData.scope };
                                       newScope.industry[i] = e.target.value;
                                       updateField('scope', newScope);
                                    }}
                                    className="w-full px-5 py-4 rounded-[10px] bg-white dark:bg-[#0c0c0c] text-xs font-bold dark:text-white outline-none focus:bg-cyan-50 dark:focus:bg-cyan-900/10 transition-colors"
                                    placeholder="Sector Name"
                                    autoFocus={!item}
                                 />
                              </div>
                              <button onClick={() => {
                                 const newScope = { ...formData.scope };
                                 newScope.industry = newScope.industry.filter((_, idx) => idx !== i);
                                 updateField('scope', newScope);
                              }} className="px-3 text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                           <BookOpen size={16} className="text-orange-500" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Academic Context</span>
                        </div>
                        <button onClick={() => {
                           const newScope = { ...formData.scope };
                           if (!newScope.academic) newScope.academic = [];
                           newScope.academic.push('');
                           updateField('scope', newScope);
                        }} className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:scale-110 transition-all shadow-lg shadow-orange-500/20"><Plus size={14} /></button>
                     </div>
                     <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {(formData.scope?.academic || []).map((item, i) => (
                           <div key={i} className="flex gap-3 animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                              <div className="flex-1 p-[1px] rounded-xl bg-gradient-to-r from-orange-500/30 to-transparent">
                                 <input
                                    value={item}
                                    onChange={(e) => {
                                       const newScope = { ...formData.scope };
                                       newScope.academic[i] = e.target.value;
                                       updateField('scope', newScope);
                                    }}
                                    className="w-full px-5 py-4 rounded-[10px] bg-white dark:bg-[#0c0c0c] text-xs font-bold dark:text-white outline-none focus:bg-orange-50 dark:focus:bg-orange-900/10 transition-colors"
                                    placeholder="Field of Study"
                                    autoFocus={!item}
                                 />
                              </div>
                              <button onClick={() => {
                                 const newScope = { ...formData.scope };
                                 newScope.academic = newScope.academic.filter((_, idx) => idx !== i);
                                 updateField('scope', newScope);
                              }} className="px-3 text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                           </div>
                        ))}
                     </div>

                     <div className="pt-6 border-t border-dashed border-slate-200 dark:border-white/10 mt-6">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono mb-4 block flex items-center gap-2">
                           <TrendingUp size={12} /> Future Trajectory
                        </label>
                        <textarea
                           value={formData.scope?.future}
                           onChange={e => {
                              const newScope = { ...formData.scope };
                              newScope.future = e.target.value;
                              updateField('scope', newScope);
                           }}
                           className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 focus:border-indigo-500 text-sm font-medium dark:text-white outline-none resize-none leading-relaxed"
                           rows={4}
                           placeholder="Describe the long-term evolution path and strategic roadmap..."
                        />
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );
         case 11: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                           <Layers size={20} />
                        </div>
                        <div>
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Infrastructural Layers</span>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tech Stack Definition</p>
                        </div>
                     </div>
                     <button onClick={() => addArrayItem('techStack', { name: '', layer: 'Frontend', reason: '' })} className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                        <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Append Layer
                     </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     {(formData.techStack || []).map((tech, i) => (
                        <div key={i} className="group p-1 rounded-[2rem] bg-gradient-to-br from-slate-100 to-white dark:from-zinc-900 dark:to-black border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/5">
                           <div className="p-5 flex flex-col gap-4">
                              <div className="flex items-center gap-4">
                                 <div className={`w-1.5 h-12 rounded-full shadow-[0_0_10px_currentColor] transition-colors ${tech.layer === 'Frontend' ? 'bg-blue-500 shadow-blue-500/50' :
                                    tech.layer === 'Backend' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                       tech.layer === 'Database' ? 'bg-orange-500 shadow-orange-500/50' :
                                          tech.layer === 'DevOps' ? 'bg-purple-500 shadow-purple-500/50' : 'bg-slate-500 shadow-slate-500/50'
                                    }`} />
                                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                       <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">Layer Type</label>
                                       <div className="relative">
                                          <select
                                             value={tech.layer}
                                             onChange={e => {
                                                const newList = [...(formData.techStack || [])];
                                                newList[i].layer = e.target.value;
                                                updateField('techStack', newList);
                                             }}
                                             className="w-full pl-4 pr-8 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase dark:text-white outline-none focus:border-indigo-500 transition-colors appearance-none"
                                          >
                                             <option>Frontend</option><option>Backend</option><option>Database</option><option>Infrastructure</option><option>DevOps</option>
                                          </select>
                                          <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                                       </div>
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">Tech Node</label>
                                       <input
                                          value={tech.name}
                                          onChange={e => {
                                             const newList = [...(formData.techStack || [])];
                                             newList[i].name = e.target.value;
                                             updateField('techStack', newList);
                                          }}
                                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-white/5 text-xs font-bold dark:text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-300"
                                          placeholder="Library / Language"
                                       />
                                    </div>
                                 </div>
                                 <button onClick={() => removeArrayItem('techStack', i)} className="p-3 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={18} />
                                 </button>
                              </div>
                              <div className="pl-6 pr-4 pb-2">
                                 <input
                                    value={tech.reason}
                                    onChange={e => {
                                       const newList = [...(formData.techStack || [])];
                                       newList[i].reason = e.target.value;
                                       updateField('techStack', newList);
                                    }}
                                    className="w-full bg-transparent border-b border-dashed border-slate-200 dark:border-white/10 py-2 text-xs font-medium dark:text-zinc-500 outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-300/50"
                                    placeholder="Justification for technology selection..."
                                 />
                              </div>
                           </div>
                        </div>
                     ))}
                     {(formData.techStack || []).length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 gap-4">
                           <Layers size={32} className="opacity-20" />
                           <p className="text-xs font-mono">No layers defined. Initialize stack.</p>
                           <button onClick={() => addArrayItem('techStack', { name: '', layer: 'Frontend', reason: '' })} className="text-indigo-500 font-bold text-xs hover:underline">Add Layer</button>
                        </div>
                     )}
                  </div>
               </div>
            </StepWrapper>
         );

         case 12: return (
            <StepWrapper>
               <div className="space-y-8">
                  <div className="group relative p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer">
                     <div className="absolute inset-0 bg-slate-100/50 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-20 rounded-[2.5rem]">
                        <span className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transform scale-90 group-hover:scale-100 transition-transform flex items-center gap-2">
                           <Upload size={14} /> Initialize Upload
                        </span>
                     </div>

                     <div className="bg-slate-50 dark:bg-[#0c0c0c] rounded-[2.4rem] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        {/* Grid Background */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/5 flex items-center justify-center text-indigo-500 mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                           <Layout size={48} strokeWidth={1.5} />
                        </div>

                        <div className="relative z-10 space-y-2">
                           <h4 className="text-lg font-black dark:text-white uppercase tracking-widest font-mono">Architecture Schematic</h4>
                           <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                              Upload system boundaries diagram. Supports Mermaid.js, Draw.io exports, or high-res PNG/SVG blueprints.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <FileText size={12} /> Abstract Pattern Definition
                     </label>
                     <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent rounded-l-2xl" />
                        <textarea
                           value={formData.architectureSummary}
                           onChange={e => updateField('architectureSummary', e.target.value)}
                           className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/5 text-sm font-mono dark:text-zinc-300 focus:border-indigo-500 outline-none resize-none leading-relaxed shadow-inner"
                           rows={6}
                           placeholder="// Define system boundaries, data flow constraints, and architectural patterns..."
                        />
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );

         case 13: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                           <Route size={20} />
                        </div>
                        <div>
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Operational Logic</span>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Workflow Definitions</p>
                        </div>
                     </div>
                     <button onClick={() => addArrayItem('workflow', { step: '', desc: '' })} className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all">
                        <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Append Step
                     </button>
                  </div>

                  <div className="relative pl-8 space-y-8 before:absolute before:left-[1.15rem] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-white/5">
                     {(formData.workflow || []).map((wf, i) => (
                        <motion.div
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           key={i}
                           className="relative"
                        >
                           <div className="absolute -left-[2.65rem] top-6 w-6 h-6 rounded-full bg-slate-50 dark:bg-[#0c0c0c] border-4 border-cyan-500 z-10 shadow-lg shadow-cyan-500/20" />

                           <div className="p-6 rounded-[2rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-4 shadow-sm hover:shadow-lg hover:shadow-cyan-500/5 hover:border-cyan-500/30 transition-all group">
                              <div className="flex justify-between items-center border-b border-dashed border-slate-100 dark:border-white/5 pb-4">
                                 <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1 rounded-lg">Node 0{i + 1}</span>
                                 <button onClick={() => removeArrayItem('workflow', i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                              </div>
                              <div className="space-y-3">
                                 <input
                                    value={wf.step}
                                    onChange={e => {
                                       const newList = [...(formData.workflow || [])];
                                       newList[i].step = e.target.value;
                                       updateField('workflow', newList);
                                    }}
                                    className="w-full px-0 py-1 bg-transparent border-none text-lg font-black dark:text-white outline-none placeholder:text-slate-300"
                                    placeholder="Step Title"
                                 />
                                 <textarea
                                    value={wf.desc}
                                    onChange={e => {
                                       const newList = [...(formData.workflow || [])];
                                       newList[i].desc = e.target.value;
                                       updateField('workflow', newList);
                                    }}
                                    className="w-full bg-transparent text-xs font-medium dark:text-zinc-400 outline-none resize-none leading-relaxed placeholder:text-slate-300/50"
                                    placeholder="Describe the logic flow and constraints..."
                                    rows={2}
                                 />
                              </div>
                           </div>
                        </motion.div>
                     ))}
                     {(formData.workflow || []).length === 0 && (
                        <div className="ml-[-2rem]">
                           <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 gap-4">
                              <Route size={32} className="opacity-20" />
                              <p className="text-xs font-mono">No workflow steps. Initialize logic.</p>
                              <button onClick={() => addArrayItem('workflow', { step: '', desc: '' })} className="text-cyan-500 font-bold text-xs hover:underline">Start Flow</button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </StepWrapper>
         );

         case 14: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                           <Box size={20} />
                        </div>
                        <div>
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">System Modules</span>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Functional Components</p>
                        </div>
                     </div>
                     <button
                        onClick={() => addArrayItem('systemModules', { name: '', description: '', features: [] })}
                        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all"
                     >
                        <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Append Module
                     </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                     {(formData.systemModules || []).map((mod, i) => (
                        <div key={i} className="group p-1 rounded-[2.2rem] bg-gradient-to-br from-slate-100 to-white dark:from-zinc-900/50 dark:to-black border border-slate-200 dark:border-white/5 hover:border-orange-500/30 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
                           <div className="bg-slate-50 dark:bg-[#0c0c0c] rounded-[2rem] p-6 space-y-6">
                              <div className="flex justify-between items-start gap-4">
                                 <div className="flex-1 space-y-4">
                                    <div className="flex flex-col gap-2">
                                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Module Identity</label>
                                       <input
                                          value={mod.name}
                                          onChange={e => {
                                             const newList = [...(formData.systemModules || [])];
                                             newList[i].name = e.target.value;
                                             updateField('systemModules', newList);
                                          }}
                                          className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 text-sm font-black dark:text-white outline-none focus:border-orange-500 transition-colors"
                                          placeholder="Module Name (e.g. Auth System)"
                                       />
                                    </div>
                                    <div className="pl-2 border-l-2 border-orange-500/20">
                                       <input
                                          value={mod.description}
                                          onChange={e => {
                                             const newList = [...(formData.systemModules || [])];
                                             newList[i].description = e.target.value;
                                             updateField('systemModules', newList);
                                          }}
                                          className="w-full bg-transparent text-xs font-medium dark:text-zinc-400 outline-none placeholder:text-slate-300"
                                          placeholder="Brief functional description..."
                                       />
                                    </div>
                                 </div>
                                 <button onClick={() => removeArrayItem('systemModules', i)} className="p-3 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={18} />
                                 </button>
                              </div>

                              <div className="bg-white dark:bg-black/40 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-white/5">
                                 <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <Sparkles size={10} /> Feature Set
                                 </label>
                                 <div className="flex flex-wrap gap-2">
                                    {mod.features.map((feat, fIdx) => (
                                       <span key={fIdx} className="pl-3 pr-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold dark:text-zinc-300 flex items-center gap-2 group/tag hover:border-orange-500/30 transition-colors">
                                          {feat}
                                          <button
                                             onClick={() => {
                                                const newList = [...(formData.systemModules || [])];
                                                newList[i].features = newList[i].features.filter((_, fi) => fi !== fIdx);
                                                updateField('systemModules', newList);
                                             }}
                                             className="text-slate-400 hover:text-red-500 transition-colors"
                                          ><X size={10} /></button>
                                       </span>
                                    ))}
                                    <input
                                       className="px-3 py-1.5 rounded-lg bg-transparent border border-dashed border-slate-300 dark:border-white/10 text-[10px] font-bold dark:text-zinc-500 outline-none w-24 focus:w-48 focus:border-orange-500 focus:text-orange-500 transition-all placeholder:text-slate-300/50"
                                       placeholder="+ ADD FEATURE"
                                       onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                             const val = e.currentTarget.value.trim();
                                             if (val) {
                                                const newList = [...(formData.systemModules || [])];
                                                newList[i].features.push(val);
                                                updateField('systemModules', newList);
                                                e.currentTarget.value = '';
                                             }
                                          }
                                       }}
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                     {(formData.systemModules || []).length === 0 && (
                        <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 gap-4">
                           <Box size={32} className="opacity-20" />
                           <p className="text-xs font-mono">No modules defined.</p>
                           <button onClick={() => addArrayItem('systemModules', { name: '', description: '', features: [] })} className="text-orange-500 font-bold text-xs hover:underline">Initialize Module</button>
                        </div>
                     )}
                  </div>
               </div>
            </StepWrapper>
         );
         case 15: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                           <FileCode size={20} />
                        </div>
                        <div>
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Digital Manifest</span>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Asset Deliverables</p>
                        </div>
                     </div>
                     <button onClick={() => addArrayItem('docs', { label: '', type: 'PDF', isIncluded: true, version: '1.0.0' })} className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all">
                        <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Append Asset
                     </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     {(formData.docs || []).map((doc, i) => (
                        <div key={i} className="group p-1 rounded-[2rem] bg-gradient-to-br from-slate-100 to-white dark:from-zinc-900 dark:to-black border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-500/5">
                           <div className="bg-slate-50 dark:bg-[#0c0c0c] rounded-[1.8rem] p-4 flex flex-col md:flex-row items-center gap-4">
                              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                 <div className="md:col-span-2">
                                    <div className="relative">
                                       <select
                                          value={doc.type}
                                          onChange={e => {
                                             const newList = [...(formData.docs || [])];
                                             newList[i].type = e.target.value;
                                             updateField('docs', newList);
                                          }}
                                          className="w-full pl-3 pr-8 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase dark:text-white outline-none focus:border-indigo-500 appearance-none transition-colors"
                                       >
                                          <option>PDF</option><option>SQL</option><option>ZIP</option><option>DOCX</option><option>PPT</option>
                                       </select>
                                       <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                                    </div>
                                 </div>
                                 <div className="md:col-span-7">
                                    <input
                                       value={doc.label}
                                       onChange={e => {
                                          const newList = [...(formData.docs || [])];
                                          newList[i].label = e.target.value;
                                          updateField('docs', newList);
                                       }}
                                       className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-xs font-bold dark:text-white outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
                                       placeholder="Asset Label (e.g. System Documentation)"
                                    />
                                 </div>
                                 <div className="md:col-span-3">
                                    <input
                                       value={doc.version}
                                       onChange={e => {
                                          const newList = [...(formData.docs || [])];
                                          newList[i].version = e.target.value;
                                          updateField('docs', newList);
                                       }}
                                       className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-xs font-mono dark:text-zinc-400 outline-none focus:border-indigo-500 transition-colors text-center"
                                       placeholder="v1.0.0"
                                    />
                                 </div>
                              </div>
                              <button onClick={() => removeArrayItem('docs', i)} className="p-3 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                     ))}
                     {(formData.docs || []).length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 gap-4">
                           <FileCode size={32} className="opacity-20" />
                           <p className="text-xs font-mono">No assets linked.</p>
                           <button onClick={() => addArrayItem('docs', { label: '', type: 'PDF', isIncluded: true, version: '1.0.0' })} className="text-indigo-500 font-bold text-xs hover:underline">Add Asset</button>
                        </div>
                     )}
                  </div>
               </div>
            </StepWrapper>
         );
         case 16: return (
            <div className="space-y-6">
               <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <MessageSquare size={32} />
                     </div>
                     <div>
                        <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">Public Sentiments</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Activate product reputation layer.</p>
                     </div>
                  </div>
                  <button onClick={() => updateField('enableReviews', !formData.enableReviews)} className={`w-14 h-8 rounded-full relative transition-all duration-300 ${formData.enableReviews ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-200 dark:bg-zinc-800'}`}>
                     <motion.div animate={{ x: formData.enableReviews ? 26 : 4 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" />
                  </button>
               </div>

               <AnimatePresence>
                  {formData.enableReviews && (
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                     >
                        <div className="space-y-3">
                           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Moderation Protocol</label>
                           <div className="relative">
                              <select
                                 value={formData.moderationMode}
                                 onChange={e => updateField('moderationMode', e.target.value)}
                                 className="w-full pl-5 pr-10 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-xs font-bold dark:text-white outline-none focus:border-emerald-500 transition-colors appearance-none"
                              >
                                 <option value="Auto">Neural Auto-Clean</option>
                                 <option value="Manual">Manual Human Triage</option>
                              </select>
                              <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                           </div>
                        </div>
                        <div className="p-1 rounded-2xl bg-gradient-to-br from-slate-100 to-white dark:from-zinc-900 dark:to-black border border-slate-200 dark:border-zinc-800">
                           <div className="bg-slate-50 dark:bg-[#0c0c0c] rounded-xl p-4 h-full flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                                 <Award size={14} className="text-emerald-500" /> Verified Badges Only
                              </span>
                              <div className="w-10 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 relative cursor-pointer">
                                 <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         );
         case 17: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                           <HelpCircle size={20} />
                        </div>
                        <div>
                           <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Knowledge Nodes</span>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">FAQ Management</p>
                        </div>
                     </div>
                     <button onClick={() => addArrayItem('faqs', { question: '', answer: '' })} className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all">
                        <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Append Node
                     </button>
                  </div>

                  <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                     {(formData.faqs || []).map((faq, i) => (
                        <div key={i} className="group p-6 rounded-[2.5rem] bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 space-y-4 hover:border-cyan-500/30 transition-all shadow-sm">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-black text-xs">Q{i + 1}</div>
                                 <div className="h-px w-12 bg-slate-100 dark:bg-zinc-800" />
                              </div>
                              <button onClick={() => removeArrayItem('faqs', i)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                           </div>
                           <input
                              value={faq.question}
                              onChange={e => {
                                 const newList = [...(formData.faqs || [])];
                                 newList[i].question = e.target.value;
                                 updateField('faqs', newList);
                              }}
                              className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-white/5 text-xs font-bold dark:text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-400"
                              placeholder="Enter architectural question..."
                           />
                           <textarea
                              value={faq.answer}
                              onChange={e => {
                                 const newList = [...(formData.faqs || [])];
                                 newList[i].answer = e.target.value;
                                 updateField('faqs', newList);
                              }}
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/30 border border-slate-100 dark:border-white/5 text-xs font-medium dark:text-zinc-400 outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-300/50 leading-relaxed"
                              placeholder="Provide precise node resolution..."
                              rows={3}
                           />
                        </div>
                     ))}
                     {(formData.faqs || []).length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 gap-4">
                           <HelpCircle size={32} className="opacity-20" />
                           <p className="text-xs font-mono">No Knowledge Nodes.</p>
                        </div>
                     )}
                  </div>
               </div>
            </StepWrapper>
         );
         case 18: return (
            <StepWrapper>
               <div className="space-y-6">
                  <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                     <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full scale-50" />
                     <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] relative z-10">
                        <Share2 size={32} />
                     </div>
                     <div className="relative z-10">
                        <h4 className="text-sm font-black dark:text-white uppercase tracking-tight font-mono">Ecosystem Integration</h4>
                        <p className="text-[10px] text-slate-500 font-medium font-mono mt-1">Link this node to other architectural assets.</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 font-mono flex items-center gap-2">
                        <Search size={10} /> Related Asset IDs
                     </label>
                     <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-white dark:bg-[#0c0c0c] rounded-2xl">
                           <Search className="absolute left-5 top-4 text-slate-400" size={16} />
                           <input
                              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-xs font-bold dark:text-white outline-none font-mono focus:border-indigo-500 transition-all placeholder:text-slate-400"
                              placeholder="Search registry or enter ID..."
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                    const val = e.currentTarget.value.trim();
                                    if (val) {
                                       addArrayItem('relatedProductIds', val);
                                       e.currentTarget.value = '';
                                    }
                                 }
                              }}
                           />
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-2 pt-2 min-h-[100px] content-start">
                        {(formData.relatedProductIds || []).map((id, i) => (
                           <div key={i} className="pl-3 pr-2 py-1.5 rounded-xl bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 flex items-center gap-2 shadow-sm group hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all">
                              <span className="text-[10px] font-mono font-black dark:text-zinc-400 group-hover:text-indigo-500">{id}</span>
                              <button onClick={() => removeArrayItem('relatedProductIds', i)} className="p-1 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors">
                                 <X size={12} />
                              </button>
                           </div>
                        ))}
                        {(formData.relatedProductIds || []).length === 0 && (
                           <div className="w-full py-8 text-center text-[10px] text-slate-400 italic">No ecosystem links established.</div>
                        )}
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );
         case 19: return (
            <StepWrapper>
               <div className="space-y-8">
                  <div className="p-1 rounded-[3rem] bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 animate-in fade-in duration-700">
                     <div className="p-8 rounded-[2.9rem] bg-[#0c0c0c] flex items-center justify-between overflow-hidden relative group">
                        {/* Animated Background */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-[#0c0c0c] to-[#0c0c0c]" />

                        <div className="flex items-center gap-6 relative z-10 transition-transform duration-500 group-hover:translate-x-2">
                           <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20 box-border shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm">
                              <Sparkles size={40} className="animate-pulse" strokeWidth={1.5} />
                           </div>
                           <div>
                              <h4 className="text-2xl font-display font-black dark:text-white uppercase tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">Neural Core</h4>
                              <p className="text-xs text-cyan-500 font-bold mt-1 font-mono tracking-wide">AI-DRIVEN INFERENCE ENGINE</p>
                           </div>
                        </div>
                        <div className="relative z-10 pr-4">
                           <button onClick={() => updateField('aiRecommendationEnabled', !formData.aiRecommendationEnabled)} className={`w-16 h-9 rounded-full relative transition-all duration-500 border border-white/10 ${formData.aiRecommendationEnabled ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-zinc-800'}`}>
                              <motion.div animate={{ x: formData.aiRecommendationEnabled ? 28 : 4 }} className="absolute top-1 w-7 h-7 bg-white rounded-full shadow-lg" />
                           </button>
                        </div>
                     </div>
                  </div>

                  <AnimatePresence>
                     {formData.aiRecommendationEnabled && (
                        <motion.div
                           initial={{ opacity: 0, height: 0, scale: 0.95 }}
                           animate={{ opacity: 1, height: 'auto', scale: 1 }}
                           exit={{ opacity: 0, height: 0, scale: 0.95 }}
                           className="grid grid-cols-2 gap-4 overflow-hidden"
                        >
                           {[
                              { label: 'Inference Model', val: 'GPT-4o (Genesis)', icon: <Cpu size={14} /> },
                              { label: 'Search Vector', val: 'Cosine Similarity', icon: <Search size={14} /> },
                              { label: 'Token Limit', val: '8,192 Context', icon: <Database size={14} /> },
                              { label: 'Update Frequency', val: 'Real-time', icon: <Zap size={14} /> }
                           ].map((item, i) => (
                              <div key={i} className="p-5 rounded-[2rem] bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-white/5 hover:border-cyan-500/30 transition-all flex flex-col gap-2 group">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 group-hover:text-cyan-500 transition-colors">
                                    {item.icon} {item.label}
                                 </span>
                                 <span className="text-sm font-bold dark:text-white font-mono tracking-tight">{item.val}</span>
                              </div>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </StepWrapper>
         );
         case 20: {
            const getSectionMeta = (key: string) => {
               const map: Record<string, { label: string; desc: string; icon: React.ReactNode }> = {
                  hero: { label: 'Hero Origin', desc: 'Primary visual hook & entry point.', icon: <Layout size={18} /> },
                  media: { label: 'Visual Gallery', desc: 'Product imagery validation.', icon: <ImageIcon size={18} /> },
                  about: { label: 'Narrative Core', desc: 'Mission & value proposition.', icon: <Info size={18} /> },
                  features: { label: 'Feature Matrix', desc: 'Functional capabilities list.', icon: <Star size={18} /> },
                  tech: { label: 'Tech Stack', desc: 'Underlying infrastructure.', icon: <Cpu size={18} /> },
                  workflow: { label: 'Logic Flow', desc: 'Operational sequence.', icon: <Route size={18} /> },
                  faq: { label: 'Knowledge Nodes', desc: 'User inquiry resolution.', icon: <HelpCircle size={18} /> },
                  trust: { label: 'Trust Signals', desc: 'Social proof logos (Clients).', icon: <ShieldCheck size={18} /> },
                  services: { label: 'Service Units', desc: 'Core offering breakdown.', icon: <Zap size={18} /> },
                  testimonials: { label: 'Success Stories', desc: 'User reputation feedback.', icon: <MessageSquare size={18} /> },
                  team: { label: 'Squadron', desc: 'Active contributors.', icon: <Users size={18} /> },
                  contact: { label: 'Comms Uplink', desc: 'Lead generation form.', icon: <Send size={18} /> },
                  blog: { label: 'Intel Feed', desc: 'Latest articles & news.', icon: <Newspaper size={18} /> }
               };
               return map[key] || { label: key, desc: 'Generic content block', icon: <Box size={18} /> };
            };

            const moveSection = (key: string, direction: 'up' | 'down') => {
               const sortedKeys = Object.keys(formData.sections || {}).sort((a, b) => (formData.sections?.[a]?.order || 0) - (formData.sections?.[b]?.order || 0));
               const currentIndex = sortedKeys.indexOf(key);
               if (currentIndex === -1) return;

               const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
               if (swapIndex < 0 || swapIndex >= sortedKeys.length) return;

               const swapKey = sortedKeys[swapIndex];
               const currentOrder = formData.sections?.[key]?.order ?? 0;
               const swapOrder = formData.sections?.[swapKey]?.order ?? 0;

               const newSections = { ...formData.sections };
               if (newSections[key]) newSections[key]!.order = swapOrder;
               if (newSections[swapKey]) newSections[swapKey]!.order = currentOrder;

               updateField('sections', newSections);
            };

            return (
               <StepWrapper>
                  <div className="space-y-6 h-full flex flex-col">
                     <div className="bg-slate-50 dark:bg-[#0c0c0c] rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 space-y-6 flex-1 flex flex-col relative overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between shrink-0 relative z-10">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                                    <LayoutGrid size={20} />
                                 </div>
                                 <h4 className="text-2xl font-display font-black uppercase tracking-tighter dark:text-white italic">CMS Engine</h4>
                              </div>
                              <p className="text-xs text-slate-500 font-medium font-mono max-w-md">Activate and orchestrate the layout topology. Toggle modules to assemble the final product interface.</p>
                           </div>
                           <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase text-indigo-500 tracking-widest hidden md:block">
                              Topology Active
                           </div>
                        </div>

                        {/* Grid Content */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2 pt-2 relative z-10">
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                              {Object.keys(formData.sections || {}).sort((a, b) => (formData.sections?.[a]?.order || 0) - (formData.sections?.[b]?.order || 0)).map((key, index, arr) => {
                                 const config = formData.sections?.[key];
                                 const meta = getSectionMeta(key);
                                 if (!config) return null;

                                 return (
                                    <motion.div
                                       layoutId={key}
                                       key={key}
                                       initial={{ opacity: 0, scale: 0.9 }}
                                       animate={{ opacity: 1, scale: 1 }}
                                       className={`relative group p-5 rounded-3xl border-2 transition-all duration-300 ${config.isEnabled
                                          ? 'bg-white dark:bg-zinc-900/60 border-indigo-500/10 shadow-lg shadow-indigo-500/5'
                                          : 'bg-slate-50 dark:bg-black border-transparent opacity-60 grayscale'
                                          } hover:border-indigo-500/30 flex flex-col justify-between`}
                                    >
                                       {/* Card Header & Reorder Controls */}
                                       <div className="flex justify-between items-start mb-4">
                                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${config.isEnabled
                                             ? 'bg-gradient-to-br from-indigo-500/10 to-transparent text-indigo-500 shadow-inner'
                                             : 'bg-slate-200 dark:bg-zinc-800 text-slate-400'
                                             }`}>
                                             {meta.icon}
                                          </div>
                                          <div className="flex items-center gap-2">
                                             <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                   onClick={(e) => { e.stopPropagation(); moveSection(key, 'up'); }}
                                                   disabled={index === 0}
                                                   className="p-0.5 hover:text-indigo-500 text-slate-400 disabled:opacity-20"
                                                >
                                                   <ChevronLeft size={10} className="rotate-90" />
                                                </button>
                                                <button
                                                   onClick={(e) => { e.stopPropagation(); moveSection(key, 'down'); }}
                                                   disabled={index === arr.length - 1}
                                                   className="p-0.5 hover:text-indigo-500 text-slate-400 disabled:opacity-20"
                                                >
                                                   <ChevronLeft size={10} className="-rotate-90" />
                                                </button>
                                             </div>
                                             <button
                                                onClick={() => updateField(`sections.${key}.isEnabled`, !config.isEnabled)}
                                                className={`h-6 rounded-full px-1 flex items-center transition-all duration-300 ${config.isEnabled ? 'bg-indigo-500 w-10' : 'bg-slate-200 dark:bg-zinc-800 w-10'}`}
                                             >
                                                <motion.div
                                                   animate={{ x: config.isEnabled ? 20 : 2 }}
                                                   className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"
                                                />
                                             </button>
                                          </div>
                                       </div>

                                       {/* Card Info */}
                                       <div>
                                          <div className="flex items-center justify-between">
                                             <h5 className="text-xs font-black uppercase dark:text-white tracking-widest">{meta.label}</h5>
                                             {config.isEnabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                                          </div>
                                          <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-500 font-mono mt-1 leading-snug">{meta.desc}</p>
                                       </div>

                                       {/* Card Footer controls */}
                                       {config.isEnabled && (
                                          <div className="mt-4 pt-3 border-t border-dashed border-slate-100 dark:border-zinc-800 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                             <span className="text-[9px] font-black text-slate-300 uppercase">POS: {String(config.order).padStart(2, '0')}</span>
                                             <button
                                                onClick={(e) => {
                                                   e.stopPropagation();
                                                   const stepMap: Record<string, number> = { media: 3, about: 7, tech: 11, workflow: 13, faq: 17, testimonials: 16, services: 14 };
                                                   if (stepMap[key]) setCurrentStep(stepMap[key]);
                                                }}
                                                className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${['media', 'about', 'tech', 'workflow', 'faq', 'testimonials', 'services'].includes(key) ? 'text-indigo-400 hover:text-indigo-300 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`}
                                             >
                                                Configure <ChevronRight size={10} />
                                             </button>
                                          </div>
                                       )}
                                    </motion.div>
                                 )
                              })}
                           </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
                     </div>
                  </div>
               </StepWrapper>
            );
         }
         case 21: return (
            <StepWrapper>
               <div className="flex h-full flex-col space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between shrink-0">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                           <Search size={20} />
                        </div>
                        <div>
                           <h4 className="text-xl font-display font-black uppercase tracking-tighter dark:text-white italic">SEO Token Lab</h4>
                           <p className="text-xs text-slate-500 font-medium font-mono mt-1">Search Engine Resonance & Discovery Configuration.</p>
                        </div>
                     </div>
                     <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase text-purple-500 tracking-widest hidden md:block">
                        Crawler Protocol: {formData.seo?.indexingRules || 'Active'}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                     {/* LEFT COL: CONTENT SIGNALS */}
                     <div className="md:col-span-12 lg:col-span-7 space-y-6">
                        {/* Meta Title */}
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono flex items-center justify-between">
                              <span>Meta ID (Title)</span>
                              <span className={(formData.seo?.metaTitle?.length || 0) > 60 ? "text-red-500" : "text-emerald-500"}>{(formData.seo?.metaTitle?.length || 0)}/60</span>
                           </label>
                           <input
                              value={formData.seo?.metaTitle}
                              onChange={e => updateField('seo.metaTitle', e.target.value)}
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 text-sm font-bold dark:text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                              placeholder="Construct unique page verification title..."
                           />
                        </div>

                        {/* Meta Description */}
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono flex items-center justify-between">
                              <span>Abstract (Description)</span>
                              <span className={(formData.seo?.metaDescription?.length || 0) > 160 ? "text-red-500" : "text-emerald-500"}>{(formData.seo?.metaDescription?.length || 0)}/160</span>
                           </label>
                           <textarea
                              value={formData.seo?.metaDescription}
                              onChange={e => updateField('seo.metaDescription', e.target.value)}
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 text-xs font-medium dark:text-zinc-300 min-h-[140px] outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono leading-relaxed resize-none"
                              placeholder="Summarize architectural intent for crawler bots..."
                           />
                        </div>

                        {/* Canonical */}
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Canonical Source</label>
                           <div className="relative">
                              <ExternalLink size={14} className="absolute left-4 top-4 text-slate-500" />
                              <input
                                 value={formData.seo?.canonicalUrl}
                                 onChange={e => updateField('seo.canonicalUrl', e.target.value)}
                                 className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border dark:border-zinc-800 text-xs font-mono font-medium dark:text-zinc-400 outline-none focus:ring-1 focus:ring-purple-500"
                                 placeholder="https://..."
                              />
                           </div>
                        </div>
                     </div>

                     {/* RIGHT COL: TOKENS & PROTOCOLS */}
                     <div className="md:col-span-12 lg:col-span-5 space-y-6">
                        {/* Indexing Rules */}
                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-zinc-900/50 border dark:border-zinc-800 space-y-4">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Robot Directives</label>
                           <div className="flex flex-wrap gap-2">
                              {['index, follow', 'noindex, nofollow', 'index, nofollow'].map(rule => (
                                 <button
                                    key={rule}
                                    onClick={() => updateField('seo.indexingRules', rule)}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${formData.seo?.indexingRules === rule ? 'bg-purple-500 text-white border-purple-500' : 'bg-white dark:bg-black text-slate-500 border-slate-200 dark:border-zinc-700 hover:border-purple-500/50'}`}
                                 >
                                    {rule}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Keywords (Tokens) */}
                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-zinc-900/50 border dark:border-zinc-800 space-y-4">
                           <div className="flex justify-between items-center">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Signal Tokens (Keywords)</label>
                              <span className="text-[9px] font-bold text-slate-500">{formData.keywords?.length || 0} Active</span>
                           </div>
                           <div className="relative">
                              <Plus size={14} className="absolute left-4 top-3.5 text-slate-400" />
                              <input
                                 className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-black border dark:border-zinc-800 text-xs font-bold dark:text-white outline-none focus:border-purple-500 transition-all placeholder:text-slate-600"
                                 placeholder="Add keyword & hit Enter..."
                                 onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                       const val = e.currentTarget.value.trim();
                                       if (val) {
                                          const newKeywords = [...(formData.keywords || [])];
                                          if (!newKeywords.includes(val)) {
                                             newKeywords.push(val);
                                             updateField('keywords', newKeywords);
                                          }
                                          e.currentTarget.value = '';
                                       }
                                    }
                                 }}
                              />
                           </div>
                           <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                              {(formData.keywords || []).map((kw, i) => (
                                 <span key={i} className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold flex items-center gap-1.5 group cursor-default">
                                    {kw}
                                    <button onClick={() => {
                                       const newKeywords = formData.keywords?.filter((_, idx) => idx !== i);
                                       updateField('keywords', newKeywords);
                                    }} className="hover:text-red-500 transition-colors"><X size={10} /></button>
                                 </span>
                              ))}
                              {(formData.keywords || []).length === 0 && (
                                 <div className="w-full text-center text-[10px] text-slate-500 italic py-4">No signal tokens active.</div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </StepWrapper>
         );
         case 22: return (
            <StepWrapper>
               <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in zoom-in-95 duration-700">
                  <div className="relative">
                     <div className="w-32 h-32 rounded-[3.5rem] bg-gradient-to-br from-cyan-600/20 to-primary-600/5 flex items-center justify-center text-cyan-500 border border-cyan-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)] relative z-10 backdrop-blur-sm">
                        <ShieldCheck size={64} className="animate-pulse" />
                     </div>
                     <motion.div
                        animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 rounded-[4rem] border border-dashed border-cyan-500/20 -z-0"
                     />
                  </div>
                  <div className="space-y-4 max-w-sm">
                     <h3 className="text-3xl font-display font-black dark:text-white tracking-tighter uppercase italic">{isEditMode ? 'Mutation Ready' : 'Genesis Complete'}</h3>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium font-mono">Architectural manifest for current node is fully synthesized and ready for global registry launch.</p>
                  </div>
                  <div className="pt-4">
                     <button
                        onClick={handleFinish}
                        disabled={isSubmitting}
                        className="group relative px-8 py-4 bg-white dark:bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <span className="relative z-10 flex items-center gap-3">
                           {isEditMode ? 'Commit Mutation' : 'Commit to Registry'}
                           {isSubmitting ? <span className="animate-spin">⟳</span> : <Save size={16} />}
                        </span>
                        <div className="absolute inset-0 bg-white/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                     </button>
                  </div>
               </div>
            </StepWrapper>
         );
         default: return (
            <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center space-y-4">
               <Terminal size={48} className="text-primary-500" />
               <h3 className="text-lg font-black uppercase tracking-widest dark:text-white">Node {currentStep} Ready</h3>
               <p className="text-[10px] font-medium italic dark:text-zinc-400">Construction phase is awaiting manual calibration.</p>
            </div>
         );
      }
   };

   return (
      <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl animate-in fade-in duration-500">

         {/* Ambient Background Effects */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

         <div className="w-full h-full max-w-[1920px] flex flex-col relative overflow-hidden bg-white/5 dark:bg-[#0a0a0a] shadow-2xl border-x border-white/5">

            {/* --- TOP HEADER: COMMAND BRIDGE --- */}
            <header className="h-16 shrink-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 lg:px-12 z-50">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 group cursor-pointer" onClick={onClose}>
                     <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <Layers size={18} />
                     </div>
                     <div>
                        <h1 className="font-display font-black text-lg tracking-tight dark:text-white leading-none">Forge_UI</h1>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-500">Asset Creator v2.4</span>
                     </div>
                  </div>

                  <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden md:block" />

                  {/* Phase Tracker */}
                  <div className="hidden md:flex items-center gap-1">
                     {[
                        { id: 'genesis', label: '01 GENESIS', range: [1, 6] },
                        { id: 'abstraction', label: '02 ABSTRACTION', range: [7, 12] },
                        { id: 'system', label: '03 SYSTEMS', range: [13, 18] },
                        { id: 'launch', label: '04 LAUNCH', range: [19, 22] }
                     ].map((phase) => {
                        const isActive = (currentStep >= phase.range[0] && currentStep <= phase.range[1]);
                        const isPast = currentStep > phase.range[1];
                        return (
                           <div key={phase.id} className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${isActive
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                              : isPast
                                 ? 'text-emerald-500 bg-emerald-500/10'
                                 : 'text-slate-500 dark:text-zinc-600'
                              }`}>
                              {phase.label}
                           </div>
                        )
                     })}
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                     <span className="text-[10px] font-black uppercase text-slate-400">Step {currentStep}/22</span>
                     <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${(currentStep / 22) * 100}%` }}
                           className="h-full bg-indigo-500 rounded-full"
                        />
                     </div>
                  </div>
                  <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all">
                     <X size={18} />
                  </button>
               </div>
            </header>

            {/* --- MAIN CONTENT: THE WORKBENCH --- */}
            <main className="flex-1 flex overflow-hidden relative">

               {/* Left Panel: Navigation/Context (Timeline) */}
               <div className="hidden xl:flex w-72 flex-col border-r border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0c0c0c]/50 backdrop-blur-sm overflow-y-auto custom-scrollbar py-8 px-6 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[2.25rem] top-10 bottom-10 w-px bg-slate-200 dark:bg-zinc-800" />

                  <div className="space-y-4 relative z-10">
                     {STEPS_META.map((stepName, i) => {
                        const stepNum = i + 1;
                        const active = stepNum === currentStep;
                        const past = stepNum < currentStep;
                        return (
                           <button
                              key={i}
                              onClick={() => setCurrentStep(stepNum)}
                              className={`group w-full text-left flex items-center gap-4 transition-all ${active ? 'opacity-100 scale-105 origin-left' : 'opacity-60 hover:opacity-90'}`}
                           >
                              <div className={`shrink-0 w-3 h-3 rounded-full border-2 transition-colors ${active ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                                    past ? 'bg-emerald-500 border-emerald-500' :
                                       'bg-slate-100 dark:bg-black border-slate-300 dark:border-zinc-700'
                                 }`} />
                              <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-zinc-500'}`}>
                                 {stepNum.toString().padStart(2, '0')} {stepName}
                              </span>
                           </button>
                        )
                     })}
                  </div>
               </div>

               {/* Center Panel: The Form Canvas */}
               <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth relative bg-white/50 dark:bg-[#050505] p-6 md:p-12 lg:p-16">

                  {/* Step Header */}
                  <div className="max-w-4xl mx-auto mb-12">
                     <motion.div
                        key={`h-${currentStep}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                     >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-500/20">
                           <LayoutGrid size={12} />
                           {currentStep <= 6 ? 'Phase 01: Genesis' : currentStep <= 12 ? 'Phase 02: Abstraction' : currentStep <= 18 ? 'Phase 03: Systems' : 'Phase 04: Launch'}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-4">
                           {STEPS_META[currentStep - 1]}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
                           Configure the requisite parameters to define this architectural node.
                        </p>
                     </motion.div>
                  </div>

                  {/* Step Content */}
                  <div className="max-w-5xl mx-auto min-h-[400px] pb-32">
                     <AnimatePresence mode="wait">
                        <motion.div
                           key={currentStep}
                           initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                           animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                           exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                           transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                           {/* Step Content Render */}
                           {renderStep()}
                        </motion.div>
                     </AnimatePresence>
                  </div>
               </div>

               {/* Right Panel: Preview/AI (Collapsible?) - For now kept simple as a decorative element or quick stats */}
               <div className="hidden 2xl:block w-80 border-l border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0c0c0c]/50 backdrop-blur-sm p-6">
                  <div className="sticky top-6 space-y-6">
                     <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-1000" />

                        <div className="flex items-start justify-between mb-4 relative z-10">
                           <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                              <Sparkles size={18} className="text-white" />
                           </div>
                           <span className="px-2 py-1 rounded-lg bg-black/20 text-[9px] font-black tracking-widest backdrop-blur-md border border-white/10">NEURAL ASSIST</span>
                        </div>
                        <div className="relative z-10 space-y-2">
                           <h4 className="font-bold text-sm tracking-tight text-indigo-100">Genesis Tip #{currentStep}</h4>
                           <p className="text-xs font-medium text-white/90 leading-relaxed">
                              {STEP_TIPS[currentStep - 1] || "Configure parameters to optimize node efficiency."}
                           </p>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Session Status</label>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-xs font-bold dark:text-zinc-300">Live Sync Active</span>
                        </div>
                     </div>
                  </div>
               </div>

            </main>

            {/* --- BOTTOM BAR: NAVIGATION --- */}
            <div className="absolute bottom-6 left-0 right-0 z-50 px-6 pointer-events-none">
               <div className="max-w-3xl mx-auto pointer-events-auto">
                  <div className="flex items-center justify-between p-2 pl-6 pr-2 rounded-2xl bg-white/90 dark:bg-[#151515]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-black/20">

                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Progress</span>
                        <span className="text-xs font-bold dark:text-white">{Math.round((currentStep / 22) * 100)}% Complete</span>
                     </div>

                     <div className="flex items-center gap-3">
                        <button
                           onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                           disabled={currentStep === 1}
                           className="px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                           <ChevronLeft size={20} />
                        </button>

                        {!isEditMode && (
                           <button onClick={onClose} className="px-5 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all hidden sm:block">
                              Save Draft
                           </button>
                        )}

                        {currentStep < 22 ? (
                           <button
                              onClick={() => {
                                 if (isStepValid(currentStep)) {
                                    setCurrentStep(currentStep + 1);
                                 }
                              }}
                              disabled={!isStepValid(currentStep)}
                              className="group px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-black/10 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                           >
                              Next Step <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        ) : (
                           <button
                              onClick={handleFinish}
                              disabled={isSubmitting}
                              className="group px-8 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70 disabled:grayscale"
                           >
                              {isSubmitting ? <COS_Spinner size={14} color="white" /> : <Rocket size={14} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                              {isSubmitting ? 'Deploying...' : 'Launch Asset'}
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default ProductForgeWizard;