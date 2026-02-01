import React from 'react';
import { motion } from 'framer-motion';
import { Timer, ArrowRight, CheckCircle2, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../store';

const FeaturedDeal: React.FC = () => {
    const { theme } = useTheme();
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - left,
            y: e.clientY - top
        });
    };

    return (
        <section className="py-24 relative bg-slate-50 dark:bg-black overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    onMouseMove={handleMouseMove}
                    className="relative overflow-hidden rounded-[3rem] bg-black dark:bg-zinc-900 border border-slate-800 dark:border-white/10 shadow-2xl group"
                >
                    {/* --- MOUSE SMOKE EFFECT --- */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99,102,241,0.15), transparent 40%)`
                        }}
                    />
                    <div
                        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                        style={{
                            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
                        }}
                    />

                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    {/* Animated Mesh Gradient */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center p-12 lg:p-24">

                        {/* LEFT: CONTENT */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 animate-pulse">
                                    <Timer size={12} /> Ends Soon
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                                    <Sparkles size={12} className="text-yellow-400" /> Premium Bundle
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-5xl lg:text-7xl font-display font-black text-white leading-[0.9] tracking-tighter">
                                    Horizon <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Pro Suite</span>
                                </h2>
                                <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed">
                                    Unlock the full enterprise potential. Get access to the complete SaaS architecture kit, including Auth, Database, and Payment nodes.
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
                                <div className="flex flex-col gap-4">
                                    {['Production-Ready Authentication', 'Advanced Payment Gateways', 'White-Label License'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                                <CheckCircle2 size={14} />
                                            </div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                                <button className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                    Claim 40% OFF <ArrowRight size={18} />
                                </button>

                                <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-white/5">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Offer Expires</div>
                                        <div className="flex gap-1 text-white font-mono font-bold">
                                            <span>04</span><span className="text-slate-600">:</span>
                                            <span>12</span><span className="text-slate-600">:</span>
                                            <span className="text-rose-500">45</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: VISUAL */}
                        <div className="relative perspective-1000 group">
                            {/* Main Card */}
                            <motion.div
                                initial={{ rotateY: -10, rotateX: 5 }}
                                whileInView={{ rotateY: 0, rotateX: 0 }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 group-hover:scale-[1.02] transition-transform duration-500"
                            >
                                <img
                                    src="https://picsum.photos/800/800?random=88"
                                    alt="Bundle Interface"
                                    className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                {/* Overlay UI Mockups */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                                            <Zap size={24} className="fill-current" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Enterprise Ready</h4>
                                            <p className="text-slate-400 text-xs">v4.2.0 Stable Release</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Elements */}
                            <div className="absolute -top-10 -right-10 bg-white text-black p-6 rounded-[2rem] shadow-xl transform rotate-6 border-4 border-black group-hover:rotate-12 transition-transform duration-500 z-20">
                                <span className="block text-xs font-black uppercase tracking-widest text-slate-500 text-center">Save</span>
                                <span className="block text-4xl font-black tracking-tighter">$249</span>
                            </div>

                            <div className="absolute -bottom-10 -left-6 bg-zinc-800/90 backdrop-blur-md text-white p-4 pr-8 rounded-2xl shadow-xl transform -rotate-3 border border-white/10 z-20 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Audit Status</div>
                                    <div className="font-bold text-emerald-400">100% Secure</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedDeal;
