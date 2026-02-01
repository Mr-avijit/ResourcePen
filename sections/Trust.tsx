import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap, Box, Server, Users, Activity } from 'lucide-react';

const CLIENTS = [
  { name: "Quantum Dynamics", logo: "QD" },
  { name: "Stellar Systems", logo: "SS" },
  { name: "Aether Flux", logo: "AF" },
  { name: "Nexus Core", logo: "NC" },
  { name: "Vertex Solutions", logo: "VS" },
  { name: "Horizon Labs", logo: "HL" },
  { name: "Cloud Matrix", logo: "CM" },
  { name: "Cyber Node", logo: "CN" }
];

const METRICS = [
  { label: "Active Nodes", value: "8,400+", icon: Server },
  { label: "Enterprise Teams", value: "240+", icon: Users },
  { label: "Daily Requests", value: "1.2M", icon: Activity },
  { label: "Global Regions", value: "42", icon: Globe },
];

const Trust: React.FC = () => {
  return (
    <section id="trust" className="py-32 bg-slate-50 dark:bg-black overflow-hidden relative border-t border-slate-200 dark:border-white/5">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 shadow-sm"
          >
            Market Leaders
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-black dark:text-white tracking-tight text-slate-900"
          >
            Trusted by Industry Titans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-zinc-500 text-lg font-medium mt-4 max-w-2xl mx-auto"
          >
            Powering global infrastructure across the digital frontier.
            Reliability at scale for mission-critical applications.
          </motion.p>
        </div>

        {/* Infinite Marquee */}
        <div className="relative flex overflow-x-hidden mb-24 mask-gradient-x">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 dark:from-black to-transparent z-10"></div>

          <div className="flex animate-marquee whitespace-nowrap gap-12 py-4">
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
              <div key={i} className="flex flex-col items-center gap-4 px-8 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                <span className="text-2xl font-black text-slate-400 dark:text-zinc-600 font-display tracking-tighter">
                  {client.name.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden">
          {METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-black p-10 flex flex-col items-center text-center group hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors mb-4">
                <metric.icon size={20} />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{metric.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `}} />
      </div>
    </section>
  );
};

export default Trust;
