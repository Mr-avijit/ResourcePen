import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Instagram, ArrowRight, ShieldCheck, Mail, MapPin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-black pt-32 pb-12 overflow-hidden relative border-t border-slate-200 dark:border-white/5">
      {/* Background Grid & Watermark */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Giant Brand Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[20vw] font-black leading-none text-slate-900/5 dark:text-white/[0.02] tracking-tighter whitespace-nowrap blur-sm">
          RESOURCES
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">

          {/* BRAND COLUMN */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-primary-500/20">R</div>
              <div>
                <span className="block text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-none">RESOURCES</span>
                <span className="block text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">Enterprise</span>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg max-w-sm font-medium">
              The premier marketplace for architectural patterns, mission-critical nodes, and high-performance UI kits.
            </p>

            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary-600 dark:hover:text-white hover:border-primary-500/30 transition-all shadow-sm"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white mb-8">Platform</h4>
            <ul className="space-y-4">
              {['Marketplace', 'Success Stories', 'Pricing', 'Enterprise', 'Changelog'].map(link => (
                <li key={link}>
                  <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900 dark:text-white mb-8">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'Status', 'Community', 'Help Center'].map(link => (
                <li key={link}>
                  <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER COLUMN */}
          <div className="lg:col-span-4 bg-slate-100 dark:bg-zinc-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/5">
            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Join the Vanguard</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Get early access to new nodes and exclusive architectural blueprints.
            </p>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 dark:text-white font-medium transition-all"
                />
              </div>
              <button className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Subscribe Now <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <ShieldCheck size={12} className="text-emerald-500" /> No spam. Secure.
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <p>© 2025 Resources Pen Inc.</p>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Normal
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Globe size={14} /> Global
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;