
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, Users, Globe2, Rocket, ShieldCheck, Zap, BarChart3, Lock, ArrowRight, MessageCircle } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: ShieldCheck, title: 'Enterprise Reliability', desc: 'Architecture built to withstand high-traffic production environments.', color: 'text-emerald-500' },
  { icon: BarChart3, title: 'Infinite Scalability', desc: 'Modular systems designed to grow seamlessly with your business needs.', color: 'text-primary-500' },
  { icon: Lock, title: 'Hardened Security', desc: 'Strict compliance with security protocols and data protection standards.', color: 'text-purple-500' },
  { icon: Zap, title: 'Peak Performance', desc: 'Optimized codebases ensuring sub-second load times and high efficiency.', color: 'text-yellow-500' },
];

const StatCard = ({ icon: Icon, value, label, delay = 0 }: { icon: any, value: string, label: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="glass p-5 rounded-[2rem] border border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-3xl flex items-center gap-4 group hover:scale-105 transition-transform"
  >
    <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <div>
      <div className="text-xl font-display font-black dark:text-white">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{label}</div>
    </div>
  </motion.div>
);

const About: React.FC = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section id="about" ref={containerRef} className="py-24 bg-white dark:bg-black overflow-hidden border-y border-slate-100 dark:border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Enterprise Solutions
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-black mb-8 leading-[1.1] dark:text-white tracking-tighter">
              Trust the Standard in <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-500">
                Premium Architecture
              </span>
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
              RESOURCES PEN is not just a marketplace; it's a commitment to engineering excellence. Since 2021, we have been the silent engine behind some of the web's most successful digital infrastructures.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {HIGHLIGHTS.map((item, i) => (
                <div key={i} className="group">
                  <div className={`flex items-center gap-3 mb-2 font-bold dark:text-white text-sm ${item.color}`}>
                    <item.icon size={20} />
                    {item.title}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-500/30 group transition-all"
              >
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <button className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                <MessageCircle size={20} />
                Contact Sales
              </button>
            </div>
          </motion.div>

          {/* Right: Visual Section */}
          <div className="relative">
            <motion.div 
              style={{ y: y1 }}
              className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10 dark:border-zinc-800"
            >
              <img 
                src="https://picsum.photos/1000/1200?random=88" 
                alt="Architecture" 
                className="w-full h-full object-cover grayscale opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12">
                <div className="glass p-8 rounded-[2.5rem] border border-white/20 backdrop-blur-3xl">
                  <h4 className="text-white font-display font-black text-2xl mb-2">Built for Performance</h4>
                  <p className="text-slate-300 text-xs font-medium leading-relaxed">
                    Our foundations power over 5,000 active instances across the global SaaS ecosystem.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Stats Badges */}
            <motion.div style={{ y: y2 }} className="absolute -top-10 -right-10 z-20 hidden md:block">
              <StatCard icon={Users} value="10k+" label="Global Clients" delay={0.2} />
            </motion.div>
            
            <motion.div style={{ y: y2 }} className="absolute top-1/2 -left-20 z-20 hidden md:block">
              <StatCard icon={Rocket} value="500+" label="Live Projects" delay={0.4} />
            </motion.div>
            
            <motion.div style={{ y: y2 }} className="absolute -bottom-10 -right-4 z-20 hidden md:block">
              <StatCard icon={Trophy} value="99.9%" label="Success Rate" delay={0.6} />
            </motion.div>

            {/* Ambient Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
