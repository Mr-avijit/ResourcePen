
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import {
    LayoutDashboard, BarChart3, Package, Layers, Globe,
    Receipt, Wallet, Scale, Gift, Award,
    Users, ShieldCheck, Lock, HelpCircle, Mail,
    MessageSquare, History, Settings, ArrowRight,
    Zap, ArrowUpRight
} from 'lucide-react';
import { useNavigation } from '../store';

const SystemGrid: React.FC = () => {
    const { navigate } = useNavigation();
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // --- Three.js Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // --- Particles ---
        const geometry = new THREE.BufferGeometry();
        const count = 400;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Create a sphere distribution
            const r = 20 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Gradient colors (Cyan to Purple)
            colors[i * 3] = 0.2 + Math.random() * 0.2; // R
            colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G (Blueish)
            colors[i * 3 + 2] = 1; // B
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Connecting Lines (Optional - simpler is often cleaner for background)
        // Let's add a second layer of larger, sparse particles for depth
        const sparseGeo = new THREE.BufferGeometry();
        const sparseCount = 50;
        const sparsePos = new Float32Array(sparseCount * 3);
        for (let i = 0; i < sparseCount; i++) {
            const r = 15 + Math.random() * 15;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            sparsePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            sparsePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            sparsePos[i * 3 + 2] = r * Math.cos(phi);
        }
        sparseGeo.setAttribute('position', new THREE.BufferAttribute(sparsePos, 3));
        const sparseMat = new THREE.PointsMaterial({ color: 0xa855f7, size: 0.4, transparent: true, opacity: 0.6 });
        const sparseParticles = new THREE.Points(sparseGeo, sparseMat);
        scene.add(sparseParticles);

        camera.position.z = 40;

        // --- Animation Loop ---
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // Rotate the entire system
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;
            sparseParticles.rotation.y -= 0.002;
            sparseParticles.rotation.x -= 0.001;

            // Gentle wobble
            const time = Date.now() * 0.0005;
            camera.position.x = Math.sin(time) * 2;
            camera.position.y = Math.cos(time) * 2;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // --- Resize Hander ---
        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            sparseGeo.dispose();
            sparseMat.dispose();
            renderer.dispose();
        };
    }, []);

    const sections = [
        {
            title: "Intelligence",
            description: "Telemetry & Oversight",
            color: "cyan",
            items: [
                { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'admin-analytics', label: 'Analytics', icon: BarChart3 },
            ]
        },
        {
            title: "Asset Management", // "Product & Infrastructure"
            description: "Assets & CMS",
            color: "emerald",
            items: [
                { id: 'admin-projects', label: 'Inventory', icon: Package },
                { id: 'admin-seo', label: 'SEO Token Lab', icon: Globe },
            ]
        },
        {
            title: "Fiscal Control", // "Financial Systems"
            description: "Treasury & Rewards",
            color: "amber",
            items: [
                { id: 'admin-orders', label: 'Invoices', icon: Receipt },
                { id: 'admin-payments', label: 'Treasury', icon: Wallet },
                { id: 'admin-tax', label: 'Fiscal Rules', icon: Scale },
                { id: 'admin-coupons', label: 'Reward Engine', icon: Gift },
                { id: 'admin-referrals', label: 'Growth Nodes', icon: Award },
            ]
        },
        {
            title: "Identity", // "Identity & Access"
            description: "Users & RBAC",
            color: "rose",
            items: [
                { id: 'admin-users', label: 'Global Users', icon: Users },
                { id: 'admin-team', label: 'Core Team', icon: ShieldCheck },
                { id: 'admin-roles', label: 'RBAC Matrix', icon: Lock },
            ]
        },
        {
            title: "Operations",
            description: "Support & Config",
            color: "indigo",
            items: [
                { id: 'admin-support', label: 'Help Desk', icon: HelpCircle },
                { id: 'admin-enquiries', label: 'Enquiry Mgmt', icon: Mail },
                { id: 'admin-feedback', label: 'Feedback', icon: MessageSquare },
                { id: 'admin-logs', label: 'Forensic Logs', icon: History },
                { id: 'admin-settings', label: 'Core Config', icon: Settings },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-black p-6 md:p-12 pb-32">

            {/* Header with Three.js Background */}
            <div className="relative rounded-[3rem] bg-black overflow-hidden mb-20 border border-zinc-800 shadow-2xl">
                <div ref={mountRef} className="absolute inset-0 z-0 opacity-60" /> {/* Three.js Canvas Container */}

                {/* Content Overlay */}
                <div className="relative z-10 px-10 py-24 md:px-20 md:py-32 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-6 max-w-4xl"
                    >
                        <div className="inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-cyan-400">
                            <Zap size={14} className="fill-current" />
                            System Mainframe
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]">
                            Command<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">Center</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                            Centralized neural interface for enterprise resource planning, telemetry analysis, and global asset orchestration.
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0" />
            </div>

            {/* Grid Layout */}
            <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] p-8 border border-slate-200 dark:border-zinc-900 hover:border-primary-500/30 transition-all duration-300 group shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 flex flex-col"
                    >
                        <div className="mb-8 border-b border-slate-100 dark:border-zinc-900 pb-6 flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-display font-black dark:text-white tracking-tight leading-none mb-2">{section.title}</h3>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">{section.description}</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${section.color === 'emerald' ? 'bg-emerald-500' : 'bg-primary-500'}`} />
                        </div>

                        <div className="space-y-3 flex-1">
                            {section.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.id as any)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 group/btn transition-all duration-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/50 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover/btn:text-primary-500 transition-colors shadow-sm">
                                            <item.icon size={18} />
                                        </div>
                                        <span className="font-bold text-sm text-slate-600 dark:text-zinc-300 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white transition-colors">{item.label}</span>
                                    </div>
                                    <ArrowUpRight size={16} className="text-slate-300 dark:text-zinc-700 group-hover/btn:text-primary-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SystemGrid;
