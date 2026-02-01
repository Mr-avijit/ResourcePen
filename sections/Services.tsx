
import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Layout,
  Smartphone,
  Globe2,
  CloudLightning,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';

const SERVICES = [
  {
    icon: Code2,
    title: 'Clean Architecture',
    description: 'Enterprise-grade codebases built with scalability as the core priority, ensuring long-term maintainability.',
    features: ['TypeScript Native', 'Modular Design', 'SOLID Principles'],
    color: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/20'
  },
  {
    icon: Layout,
    title: 'Advanced UI/UX',
    description: 'Bespoke design systems that balance aesthetic perfection with conversion-optimized user flows.',
    features: ['Framer Motion', 'Adaptive Layouts', 'A11y Compliant'],
    color: 'from-purple-500 to-pink-600',
    glow: 'shadow-purple-500/20'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Ecosystem',
    description: 'Cross-platform compatibility ensuring your product looks and feels native on every possible screen.',
    features: ['Touch Optimized', 'PWA Ready', 'Responsive Grids'],
    color: 'from-orange-500 to-red-600',
    glow: 'shadow-orange-500/20'
  },
  {
    icon: Globe2,
    title: 'Global Compliance',
    description: 'Infrastructure designed for international markets with built-in support for localization and data privacy.',
    features: ['GDPR Ready', 'i18n Support', 'Multi-region SEO'],
    color: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20'
  },
  {
    icon: CloudLightning,
    title: 'Cloud Optimization',
    description: 'High-performance deployment strategies utilizing the latest in serverless and edge computing technology.',
    features: ['Edge Functions', 'CI/CD Ready', 'Zero-Downtime'],
    color: 'from-cyan-500 to-blue-600',
    glow: 'shadow-cyan-500/20'
  },
  {
    icon: BarChart3,
    title: 'Data Intelligence',
    description: 'Advanced telemetry and reporting tools pre-integrated to provide actionable business insights from day one.',
    features: ['Custom Events', 'Funnel Tracking', 'Real-time Stats'],
    color: 'from-indigo-500 to-purple-600',
    glow: 'shadow-indigo-500/20'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 bg-slate-50/50 dark:bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-400 mb-8 shadow-sm"
          >
            <ShieldCheck size={14} className="text-primary-500" />
            Elite Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-black mb-6 dark:text-white tracking-tighter"
          >
            Engineering for the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">Digital Vanguard</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            We deploy advanced SaaS-grade solutions that redefine performance boundaries and set new industry standards.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="group relative h-full p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all duration-500 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 flex flex-col overflow-hidden"
            >
              {/* Gradient Shine Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon Container */}
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-8 shadow-lg ${service.glow} group-hover:scale-110 transition-transform duration-500`}>
                <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[0.9rem] flex items-center justify-center">
                  <service.icon size={24} className="text-slate-900 dark:text-white" />
                </div>
              </div>

              {/* Header */}
              <h3 className="text-2xl font-bold mb-4 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {service.title}
              </h3>

              <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium mb-8">
                {service.description}
              </p>

              {/* Feature List */}
              <div className="mt-auto space-y-3">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {feat}
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
