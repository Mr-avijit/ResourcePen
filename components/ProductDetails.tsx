import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingCart, Star, CheckCircle2, ShieldCheck, Zap,
  Cpu, Target, Sparkles, CreditCard, Share2,
  Maximize2, ShoppingBag, ChevronDown, ChevronUp,
  QrCode, Twitter, Linkedin, MessageCircle, Info, Clock,
  Check as CheckIcon, ArrowRight, Activity, Heart,
  Globe, Download, Box, Layers, Play, FileText,
  ThumbsUp, MessageSquare, AlertCircle, Code2,
  ExternalLink, Trophy, Shield, Edit3, Layout,
  Smartphone, Plus, Minus, Hash, BoxSelect,
  Package, CheckCircle, GraduationCap, Copy,
  ChevronLeft, ChevronRight, Bookmark, Lock,
  Calendar, RotateCcw, Terminal, Database, HelpCircle,
  DollarSign, Filter
} from 'lucide-react';
import { Product, Feedback } from '../types';
import { COS_Button, COS_Badge, COS_Modal, COS_Spinner } from './COS_Library';
import { useAuth, useCart } from '../store';
import { MockApiService } from '../MockApiService';

const SectionHeading: React.FC<{ children: React.ReactNode; icon: any }> = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-4 mb-10 border-l-4 border-primary-500 pl-6">
    <div className="p-3.5 rounded-2xl bg-primary-500/10 text-primary-500 border border-primary-500/20 shadow-sm">
      <Icon size={22} />
    </div>
    <h3 className="text-xl font-display font-black dark:text-white tracking-[0.2em] uppercase italic">{children}</h3>
  </div>
);

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  // Added onSelectProduct for related items navigation
  onSelectProduct?: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose, onAddToCart, onSelectProduct }) => {
  const { cart, addToCart, setIsCartOpen } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State for related products
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoadingRelated(true);
      try {
        const all = await MockApiService.getProjects();
        // Simple related logic: same category or random
        const related = all.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

        // If not enough same category, fill with others
        if (related.length < 4) {
          const others = all.filter(p => p.id !== product.id && p.category !== product.category).slice(0, 4 - related.length);
          setRelatedProducts([...related, ...others]);
        } else {
          setRelatedProducts(related);
        }
      } catch (e) {
        console.error("Failed to load related products", e);
      } finally {
        setIsLoadingRelated(false);
      }
    };
    fetchRelated();
  }, [product]);


  const galleryItems = useMemo(() => {
    const items = [{ src: product.image }];
    if (product.gallery) {
      product.gallery.forEach(img => items.push({ src: img }));
    }
    return items;
  }, [product]);

  // Auto-Scroll Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % galleryItems.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [galleryItems.length]);

  const isSectionEnabled = (key: string) => product.sections?.[key]?.isEnabled ?? true;

  const [isWritingReview, setIsWritingReview] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] font-sans pt-20 animate-in fade-in duration-500">

      {/* --- Breadcrumbs Header (Integrated into page flow) --- */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
          <span className="cursor-pointer hover:text-primary-600">Home</span> /
          <span className="cursor-pointer hover:text-primary-600">Marketplace</span> /
          <span className="text-slate-900 dark:text-white font-bold">{product.name}</span>
        </div>
        {/* REMOVED BACK TO GALLERY BUTTON as requested */}
      </div>

      {/* --- Main Product View --- */}
      <main className="bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* LEFT: Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 group cursor-crosshair"
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                e.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                e.currentTarget.style.setProperty('--zoom-y', `${y}%`);
              }}
              style={{ '--zoom-x': '50%', '--zoom-y': '50%' } as React.CSSProperties}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={galleryItems[activeImage]?.src}
                  className="w-full h-full object-cover group-hover:opacity-0 transition-opacity" // Hide on hover to show zoomed bg
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              </AnimatePresence>

              {/* Magnified Layer */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-no-repeat pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundImage: `url(${galleryItems[activeImage]?.src})`,
                  backgroundPosition: 'var(--zoom-x) var(--zoom-y)',
                  backgroundSize: '200%' // Zoom level
                }}
              />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 text-[10px] font-bold uppercase tracking-widest rounded-md">{product.category}</span>
              </div>

              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-lg text-slate-800 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <Maximize2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {galleryItems.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary-600' : 'border-transparent'}`}>
                  <img src={img.src} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-500 text-sm">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'} />)}
                </div>
                <span className="text-sm font-medium text-slate-500">({product.reviewCount} Reviews)</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{product.name}</h1>
              <div className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                ₹{product.price}
                {product.originalPrice && <span className="text-lg text-slate-400 font-medium line-through">₹{product.originalPrice}</span>}
                {product.originalPrice && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">SAVE {(100 - (product.price / product.originalPrice) * 100).toFixed(0)}%</span>}
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert">
              <p>{product.description}</p>
            </div>

            {/* Key Features List */}
            <div className="py-6 border-y border-slate-100 dark:border-zinc-800 space-y-3">
              <div className="font-bold text-sm text-slate-900 dark:text-white">Key Highlights:</div>
              <ul className="space-y-2">
                {product.features_list?.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-zinc-400">
                    <CheckCircle2 size={16} className="text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => { onAddToCart(product); setIsCartOpen(true); }}
                className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} /> Buy Now
              </button>
              <div className="flex gap-4">
                <button onClick={() => setIsFavorited(!isFavorited)} className={`p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${isFavorited ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:border-primary-500'}`}>
                  <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
                </button>
                <button className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-400 hover:border-primary-500">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2"><CreditCard size={14} /> Secure Payment</div>
              <div className="flex items-center gap-2"><Download size={14} /> Instant Access</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14} /> License Included</div>
              <div className="flex items-center gap-2"><HelpCircle size={14} /> 24/7 Support</div>
            </div>

            {/* --- CUSTOMER REVIEWS (SEO Optimized) --- */}
            <div id="customer-reviews" className="pt-12 border-t border-slate-100 dark:border-zinc-800 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-black dark:text-white flex items-center gap-3">
                  <MessageSquare size={24} className="text-primary-600" /> Customer Insights
                </h3>
                <div className="text-sm font-bold text-slate-500">{product.reviews?.length || 0} Reviews</div>
              </div>

              {/* Rating Breakdown */}
              <div className="flex items-center gap-8 p-8 bg-slate-50 dark:bg-zinc-950 rounded-[2.5rem]">
                <div className="text-center">
                  <div className="text-5xl font-black text-slate-900 dark:text-white">{product.rating}</div>
                  <div className="flex text-yellow-500 my-2 justify-center">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300 dark:text-zinc-800'} />)}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Score</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = product.reviews?.filter(r => Math.floor(r.rating) === star).length || 0;
                    const total = product.reviews?.length || 1;
                    const percent = (count / total) * 100;
                    return (
                      <div key={star} className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <span className="w-3">{star}</span>
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {(product.reviews || []).slice(0, 3).map((review, i) => (
                  <div key={i} className="group p-6 rounded-3xl bg-slate-50 dark:bg-[#0c0c0c] border border-slate-100 dark:border-zinc-900" itemProp="review" itemScope itemType="https://schema.org/Review">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-xs text-slate-500 shadow-sm">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold dark:text-white" itemProp="author">{review.userName}</div>
                          <div className="text-[10px] text-slate-400 font-medium" itemProp="datePublished">{review.createdAt.split('T')[0]}</div>
                        </div>
                      </div>
                      <div className="flex text-yellow-500" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                        <meta itemProp="ratingValue" content={review.rating.toString()} />
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-zinc-800'} />)}
                      </div>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-2" itemProp="name">{review.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed" itemProp="reviewBody">"{review.content}"</p>
                    {review.isVerifiedPurchase && (
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        <ShieldCheck size={12} /> Verified Purchase
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Write Review CTA & Form */}
              <AnimatePresence>
                {isWritingReview ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-slate-50 dark:bg-zinc-950 p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-900">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold dark:text-white">Write your review</h4>
                      <button onClick={() => setIsWritingReview(false)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} className="text-slate-300 hover:text-yellow-500 transition-colors"><Star size={24} /></button>
                        ))}
                      </div>
                      <input type="text" placeholder="Title of your review" className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white" />
                      <textarea rows={4} placeholder="Share your experience with this asset..." className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white" />
                      <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20">Submit Verification</button>
                    </div>
                  </motion.div>
                ) : (
                  <button onClick={() => setIsWritingReview(true)} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-400 font-bold hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2">
                    <Edit3 size={18} /> Write a Review
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        <section className="bg-slate-50 dark:bg-zinc-950 py-16 border-t border-slate-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-xl font-display font-black dark:text-white mb-10 uppercase tracking-widest flex items-center gap-3">
              <Layers size={22} className="text-primary-600" /> Related Assets
            </h3>

            {/* Real Data Integration */}
            {isLoadingRelated ? (
              <div className="flex justify-center p-12 opacity-50"><COS_Spinner size={32} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {relatedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white dark:bg-[#0c0c0c] rounded-3xl p-4 border border-slate-100 dark:border-zinc-900 hover:shadow-xl transition-all cursor-pointer flex flex-col"
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-zinc-900 mb-4 overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div className="px-2 flex-1 flex flex-col">
                      <div className="text-[10px] font-black uppercase text-primary-500 mb-1">{item.category}</div>
                      <h4 className="text-sm font-bold dark:text-white truncate mb-1">{item.name}</h4>
                      <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold mb-auto">
                        <Star size={10} className="fill-current" /> {item.rating}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-black dark:text-white">₹{item.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                            setIsCartOpen(true);
                          }}
                          className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-white hover:bg-primary-600 transition-colors"
                        >
                          <ShoppingBag size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-10">
            <button onClick={() => setIsFullscreen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white"><X size={32} /></button>
            <img src={galleryItems[activeImage]?.src} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default ProductDetails;
