import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Linkedin, Twitter, Github, Globe, Mail,
    Code2, Award, Briefcase, GraduationCap, MapPin,
    Calendar, ExternalLink, Cpu
} from 'lucide-react';
import { TeamMember } from '../types';

interface TeamDetailProps {
    member: TeamMember;
    onBack: () => void;
}

const TeamDetail: React.FC<TeamDetailProps> = ({ member, onBack }) => {
    // Safety check for refresh/direct access without params
    useEffect(() => {
        if (!member) {
            onBack();
        }
    }, [member, onBack]);

    if (!member) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Navigation */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 font-bold hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/30 transition-all mb-12 shadow-sm"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Team</span>
                </motion.button>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            variants={itemVariants}
                            className="relative bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2.5rem] p-3 border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/50"
                        >
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Cpu size={12} />
                                        {member.role === 'admin' ? 'Leadership' : 'Core Team'}
                                    </div>
                                    <h1 className="text-4xl font-display font-black text-white mb-2 leading-tight">{member.name}</h1>
                                    <p className="text-primary-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                                        {member.role}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex gap-3 justify-center">
                                    {[
                                        { icon: Linkedin, color: 'text-[#0077b5]', label: 'LinkedIn' },
                                        { icon: Twitter, color: 'text-[#1da1f2]', label: 'Twitter' },
                                        { icon: Github, color: 'text-slate-800 dark:text-white', label: 'GitHub' },
                                        { icon: Globe, color: 'text-emerald-500', label: 'Website' },
                                    ].map((Item, i) => (
                                        <button
                                            key={i}
                                            className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center hover:scale-110 transition-transform border border-slate-100 dark:border-white/5 shadow-sm group"
                                            title={Item.label}
                                        >
                                            <Item.icon size={20} className={`${Item.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                                    <div className="flex items-center gap-4 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                                            <MapPin size={14} />
                                        </div>
                                        Reading, United Kingdom
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                                            <Calendar size={14} />
                                        </div>
                                        Joined March 2024
                                    </div>
                                </div>

                                <button className="w-full mt-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-lg">
                                    <Mail size={18} />
                                    Get in Touch
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-8">
                        <div className="space-y-8">
                            {/* Bio Section */}
                            <motion.div variants={itemVariants} className="bg-slate-50 dark:bg-zinc-900/30 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center rotate-3">
                                        <Code2 className="text-indigo-500" size={24} />
                                    </div>
                                    <h2 className="text-3xl font-display font-black dark:text-white">Professional Profile</h2>
                                </div>
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <p className="text-slate-600 dark:text-zinc-400 text-xl leading-relaxed font-medium">
                                        {member.bio || "A visionary architect dedicated to building scalable, resilient, and high-performance digital ecosystems. With a deep passion for clean code and user-centric design, they consistently deliver solutions that push the boundaries of what's possible in the modern web."}
                                    </p>
                                    <p className="text-slate-600 dark:text-zinc-400 text-lg leading-relaxed font-medium mt-6">
                                        Specializing in {member.specialty.join(', ')}, they play a pivotal role in shaping the technical direction of our core products. Their approach to problem-solving combines rigorous analytical thinking with creative flair, resulting in robust architectures that drive business growth.
                                    </p>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Skills */}
                                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-none">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center -rotate-2">
                                            <Award className="text-emerald-500" size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold dark:text-white">Technical Arsenal</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {member.specialty.map((skill, i) => (
                                            <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-white/5 shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                        <span className="px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-white/5 shadow-sm">Distributed Systems</span>
                                        <span className="px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-white/5 shadow-sm">React Server Comp.</span>
                                        <span className="px-4 py-2 bg-slate-50 dark:bg-zinc-800 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-white/5 shadow-sm">Edge Computing</span>
                                    </div>
                                </motion.div>

                                {/* Education */}
                                <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-none">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center rotate-2">
                                            <GraduationCap className="text-amber-500" size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold dark:text-white">Education</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="relative pl-6 border-l-2 border-slate-100 dark:border-zinc-800">
                                            <div className="absolute top-1.5 left-[-5px] w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-zinc-900" />
                                            <h4 className="font-bold text-slate-900 dark:text-white">M.S. Computer Science</h4>
                                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-500 mt-1">Stanford University • 2018-2020</p>
                                        </div>
                                        <div className="relative pl-6 border-l-2 border-slate-100 dark:border-zinc-800">
                                            <div className="absolute top-1.5 left-[-5px] w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700 ring-4 ring-white dark:ring-zinc-900" />
                                            <h4 className="font-bold text-slate-900 dark:text-white">B.Tech Engineering</h4>
                                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-500 mt-1">MIT • 2014-2018</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Project Showcase */}
                            <motion.div variants={itemVariants} className="pt-8">
                                <h3 className="text-2xl font-display font-black dark:text-white mb-8 px-2">Featured Contributions</h3>
                                <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 dark:from-zinc-900 dark:to-black rounded-[2.5rem] p-10 md:p-14 overflow-hidden text-white shadow-2xl">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                                        <div className="flex-1 space-y-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-primary-300 text-xs font-bold uppercase tracking-widest border border-white/10">
                                                <ExternalLink size={12} /> Live Project
                                            </div>
                                            <h4 className="text-3xl font-display font-black leading-tight">Enterprise Neural Orchestrator</h4>
                                            <p className="text-slate-300 text-lg leading-relaxed font-medium">
                                                Architected the core state management engine that powers the entire enterprise dashboard suite, reducing bundle size by 45% while improving TTI by 60%.
                                            </p>
                                            <div className="flex gap-4 pt-4">
                                                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                                                    View Case Study
                                                </button>
                                                <button className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors backdrop-blur-md">
                                                    GitHub Repo
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/3 aspect-square bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center p-8 transform rotate-3 group-hover:rotate-6 transition-transform duration-700">
                                            <Cpu size={80} className="text-white/20" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TeamDetail;
