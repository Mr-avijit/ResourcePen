
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star, Quote, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import * as THREE from 'three';
import { useTheme } from '../store';

const HERO_TESTIMONIALS = [
  { name: "Sarah Johnson", role: "CEO at TechStream", content: "The Horizon Dashboard transformed our reporting. Saved us thousands in development.", avatar: "https://picsum.photos/100/100?random=20" },
  { name: "Michael Chen", role: "Lead Developer", content: "ProjectHub templates save us weeks of time. High quality code with great docs.", avatar: "https://picsum.photos/100/100?random=21" },
  { name: "Emily Davis", role: "Freelance Designer", content: "The support team is incredible. Resolved my issue in 10 minutes. Exceptional service!", avatar: "https://picsum.photos/100/100?random=22" }
];

interface HeroProps {
  openAuth?: (mode: 'login' | 'signup') => void;
  content?: {
    headline: string;
    subheadline: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    badgeText: string;
  };
}

const AbstractParticleField: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const isDark = theme === 'dark';

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x000000 : 0xffffff, 0.002);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 60);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- PARTICLE WAVE SYSTEM ---
    const PARTICLE_COUNT = 4000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    // Initial Distribution (Cylinder/Vortex shape)
    const originalPositions = [];

    const colorInside = new THREE.Color(isDark ? 0x3b82f6 : 0x0ea5e9); // Blue
    const colorOutside = new THREE.Color(isDark ? 0xa855f7 : 0x6366f1); // Purple

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spiral / Vortex distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 40;
      const y = (Math.random() - 0.5) * 60;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions.push({ x, y, z, angle, radius, speed: 0.02 + Math.random() * 0.05 });
      sizes[i] = Math.random() * 2;

      // Color mix based on radius
      const mix = (radius - 10) / 40;
      const color = colorInside.clone().lerp(colorOutside, mix);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom Shader Material for better point rendering
    // But standard PointsMaterial is safer for React/TS environments to avoid GLSL string issues
    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.8 : 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse Interaction
    const mouse = new THREE.Vector2();
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetX = mouse.x * 20;
      targetY = mouse.y * 20;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.005;

      // Gentle Camera Movement
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Update Particles
      const positions = particles.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const data = originalPositions[i];

        // Orbit Logic
        // Interactive Wave: Modify 'y' based on sine of x/z + time
        const waveY = Math.sin(data.x * 0.1 + time) * Math.cos(data.z * 0.1 + time * 0.5) * 5;

        // Rotate around center
        const currentAngle = data.angle + time * data.speed;
        const x = Math.cos(currentAngle) * data.radius;
        const z = Math.sin(currentAngle) * data.radius;

        // Apply new positions
        positions[i * 3] = x;
        positions[i * 3 + 1] = data.y + waveY; // Add wave to Y
        positions[i * 3 + 2] = z;
      }

      particles.geometry.attributes.position.needsUpdate = true;

      // Global Rotation
      particles.rotation.z = time * 0.05;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);

  // Gradient overlay to fade particles at edges
  return (
    <>
      <div ref={mountRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-white via-transparent to-white/50 dark:from-black dark:via-transparent dark:to-black/50 pointer-events-none" />
    </>
  );
};


const Hero: React.FC<HeroProps> = ({ openAuth, content }) => {
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();

  const data = content || {
    headline: 'Build, Buy & Scale Digital Products With Confidence.',
    subheadline: 'Acquire enterprise-grade architectural foundations and premium components.',
    primaryCtaText: 'Explore Marketplace',
    secondaryCtaText: 'Start Earning',
    badgeText: 'Trusted Digital Marketplace'
  };

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % HERO_TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + HERO_TESTIMONIALS.length) % HERO_TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-white dark:bg-black">
      {/* Abstract Particle Animation */}
      <AbstractParticleField theme={theme} />

      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">

        {/* LEFT SECTION: CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-10"
        >
          {/* Glassy Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
            <ShieldCheck size={14} />
            {data.badgeText}
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-display font-black leading-[1.05] dark:text-white tracking-tighter drop-shadow-sm">
              {data.headline.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-3">{word}</span>
              ))}
            </h1>

            <p className="text-lg text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
              {data.subheadline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/30 transition-all active:scale-95 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">{data.primaryCtaText} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            </button>

            <button
              onClick={() => openAuth?.('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-zinc-900/80 backend-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-bold hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap size={18} className="text-yellow-500 fill-current" />
              {data.secondaryCtaText}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 border-t border-slate-100 dark:border-white/5 w-full">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trusted by engineering teams at</p>
            <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos (abstract CSS shapes or svgs) */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-slate-400"></div>
                <div className="w-16 h-3 bg-slate-400 rounded-sm"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-sm bg-slate-400"></div>
                <div className="w-12 h-3 bg-slate-400 rounded-sm"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-tr-lg bg-slate-400"></div>
                <div className="w-14 h-3 bg-slate-400 rounded-sm"></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION: TESTIMONIALS */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 relative"
        >
          {/* Decorative blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

          <div className="relative group perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateY: -10, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 10, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-2xl relative overflow-hidden ring-1 ring-white/20"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Quote size={80} className="text-primary-500 fill-current" />
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={HERO_TESTIMONIALS[index].avatar}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-500 shadow-md"
                      alt={HERO_TESTIMONIALS[index].name}
                    />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest dark:text-white">
                        {HERO_TESTIMONIALS[index].name}
                      </h4>
                      <p className="text-xs font-bold text-primary-500">
                        {HERO_TESTIMONIALS[index].role}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-yellow-400 gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-current" />)}
                  </div>

                  <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                    "{HERO_TESTIMONIALS[index].content}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* External Navigation Controls */}
            <div className="flex items-center justify-between mt-6 px-4">
              <div className="flex gap-2">
                {HERO_TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-primary-500' : 'w-2 bg-slate-300 dark:bg-zinc-700'}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={prev} className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-primary-600 hover:border-primary-500 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next} className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-primary-600 hover:border-primary-500 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
