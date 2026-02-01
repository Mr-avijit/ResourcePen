
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, HelpCircle, Star, ShieldCheck, Zap, Mail, Phone, MapPin, Globe, RefreshCcw, CheckCircle2, Copy } from 'lucide-react';
import { MockApiService } from '../MockApiService';
import { EnquiryType } from '../types';

const Contact: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'enquiry' | 'feedback'>('enquiry');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general' as EnquiryType
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeTab === 'enquiry') {
        await MockApiService.createEnquiry({
          userName: formData.name,
          email: formData.email,
          subject: formData.subject || 'Direct Transmission',
          message: formData.message,
          enquiry_type: formData.type,
          source: 'contact'
        });
      } else {
        await MockApiService.submitFeedback({
          userName: formData.name,
          rating: rating,
          title: formData.subject || 'Platform Feedback',
          content: formData.message,
          source: 'dashboard'
        });
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
        setRating(0);
      }, 5000);

    } catch (err) {
      console.error("Transmission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-slate-50 dark:bg-black relative overflow-hidden border-t border-slate-200 dark:border-white/5">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* LEFT COLUMN: INFO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-cyan-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 shadow-sm">
                <Mail size={12} /> Contact Channel
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-black mb-6 text-slate-900 dark:text-white tracking-tight leading-[0.9]">
                Let's start a <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Conversation.</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium leading-relaxed max-w-md">
                Have a question about our enterprise solutions? Our architecture team is ready to deploy.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email Support", value: "hello@resourcespen.com", sub: "Response time: < 2 hours" },
                { icon: Globe, label: "Global HQ", value: "San Francisco, CA", sub: "100 Market St, Suite 500" }
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-6 p-6 rounded-3xl bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 hover:border-primary-500/30 transition-all shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-primary-600 shadow-inner group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.value}</div>
                    <div className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                      <Zap size={10} className="fill-current" /> {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Preview */}
            <div className="relative rounded-3xl overflow-hidden aspect-[2/1] bg-slate-900 group border border-slate-200 dark:border-white/5 shadow-2xl">
              <img src="https://picsum.photos/seed/mapstats/600/300" className="w-full h-full object-cover opacity-40 mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Operations</span>
                </div>
                <div className="text-white font-bold text-lg">Global Network Active</div>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: FORM */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl md:p-10 p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/10 relative overflow-hidden">

              {/* Form Header */}
              <div className="mb-10 text-center">
                <div className="inline-flex p-1 bg-slate-100 dark:bg-black rounded-xl">
                  <button
                    onClick={() => setActiveTab('enquiry')}
                    className={`px-8 py-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'enquiry' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    General Enquiry
                  </button>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className={`px-8 py-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'feedback' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab + (isSuccess ? '-success' : '-form')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isSuccess ? (
                      <div className="py-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
                          <CheckCircle2 size={48} className="animate-in zoom-in duration-500" />
                        </div>
                        <h3 className="text-3xl font-display font-black text-slate-900 dark:text-white">Received.</h3>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto font-medium">Your transmission has been logged in our secure vault. Expect a response shortly.</p>
                      </div>
                    ) : (
                      <>
                        {activeTab === 'feedback' && (
                          <div className="mb-10 text-center bg-slate-50 dark:bg-black/40 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Satisfaction Score</label>
                            <div className="flex justify-center gap-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="focus:outline-none transition-all p-1"
                                >
                                  <Star
                                    size={36}
                                    className={`transition-all duration-300 ${(hoverRating || rating) >= star
                                      ? 'text-yellow-400 fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                                      : 'text-slate-200 dark:text-zinc-800'
                                      }`}
                                  />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 group">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Identity</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 backdrop-blur-sm" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2 group">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Contact</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 backdrop-blur-sm" placeholder="john@example.com" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div className="space-y-2 group">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Subject</label>
                            <input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400" placeholder="Topic" />
                          </div>
                          <div className="space-y-2 group">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Department</label>
                            <div className="relative">
                              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer">
                                <option value="general">General Inquiry</option>
                                <option value="sales">Sales & Commercial</option>
                                <option value="support">Technical Support</option>
                                <option value="partnership">Partnerships</option>
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <RefreshCcw size={14} className="rotate-45" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mt-6">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Message</label>
                          <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none text-sm font-medium text-slate-900 dark:text-white leading-relaxed resize-none placeholder-slate-400" placeholder={activeTab === 'enquiry' ? "How can we help you today?" : "Tell us about your experience..."}></textarea>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {!isSuccess && (
                  <motion.button
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-slate-900 dark:bg-cyan-500 text-white dark:text-black rounded-2xl font-black text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-3 uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <RefreshCcw className="animate-spin" size={18} />
                    ) : (
                      <>
                        {activeTab === 'enquiry' ? 'Initialize Request' : 'Submit Feedback'}
                        <Send size={16} />
                      </>
                    )}
                  </motion.button>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
