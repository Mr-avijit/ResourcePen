
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Linkedin, ChevronLeft, ChevronRight, Users, Github, Cpu, Globe, Code2, ScanLine } from 'lucide-react';
import { COS_Spinner } from '../components/COS_Library';
import { MockApiService } from '../MockApiService';
import { TeamMember } from '../types';

interface TeamProps {
  onNavigate?: (view: any, params?: any) => void;
}

const Team: React.FC<TeamProps> = ({ onNavigate }) => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Responsive Handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else if (window.innerWidth < 1280) setItemsPerView(3);
      else setItemsPerView(4);
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        const users = await MockApiService.getUsers();
        // Enrich mock data with "Architect" persona details
        const specialties = ['Distributed Systems', 'Neural Networks', 'UI Architecture', 'Cryptography', 'Cloud Native'];

        const teamMembers = [...users, ...users, ...users].slice(0, 8).map((u, idx) => ({
          id: `member-${idx}`,
          name: `${u.firstName} ${u.lastName}`,
          role: u.role === 'admin' ? 'Principal Architect' : 'Strategic Lead',
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}${idx}&backgroundColor=b6e3f4`,
          specialty: [specialties[idx % specialties.length], specialties[(idx + 1) % specialties.length]],
          bio: "Architecting scalable digital foundations for the enterprise ecosystem."
        }));
        setTeam(teamMembers);
        // Start in the middle or 0? 0 is fine.
      } catch (err) {
        console.error("Team manifest retrieval failure.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Clones for Infinite Loop: Append items matching itemsPerView
  const extendedTeam = team.length
    ? [...team, ...team.slice(0, itemsPerView).map(m => ({ ...m, id: `${m.id}-clone` }))]
    : [];

  // Auto-play logic
  useEffect(() => {
    if (team.length === 0 || isLoading || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000); // Auto-play every 3 seconds

    return () => clearInterval(interval);
  }, [team.length, isPaused, isLoading]);

  // Handle loop reset when animation completes
  const handleAnimationComplete = () => {
    // If we have slid past the last real item into clones
    if (currentIndex >= team.length) {
      setIsResetting(true);
      setCurrentIndex(currentIndex % team.length);
      // Wait for render to apply duration:0, then re-enable animation
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const nextIndex = prev + newDirection;
      // Loop backwards
      if (nextIndex < 0) return team.length - 1;
      // Forward allows going into clones (max index = team.length)
      if (nextIndex > team.length) return 0;
      return nextIndex;
    });
  }, [team.length]);

  if (isLoading) return <div className="py-24 flex justify-center"><COS_Spinner size={40} /></div>;

  return (
    <section id="team" className="py-32 bg-slate-50 dark:bg-black overflow-hidden relative border-t border-slate-200 dark:border-white/5">
      {/* Neo-Industrial Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 shadow-sm"
            >
              <Cpu size={14} className="text-primary-600" />
              Human Intelligence
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-display font-black dark:text-white tracking-tighter leading-[0.9] mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-zinc-500">Masterminds.</span>
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">
              Engineers, designers, and strategists building the backbone of the decentralized web.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => paginate(-1)}
              className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all shadow-sm group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white border border-slate-900 dark:border-white text-white dark:text-black flex items-center justify-center hover:opacity-90 transition-all shadow-xl group"
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div
          className="relative overflow-hidden -mx-4 px-4 py-4"
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-5"
            animate={{ x: `calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * 1.25}rem)` }}
            transition={isResetting ? { duration: 0 } : { duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={handleAnimationComplete}
          >
            {extendedTeam.map((member) => (
              <div
                key={member.id}
                className="min-w-full sm:min-w-[calc(50%-0.625rem)] lg:min-w-[calc(33.333%-0.85rem)] xl:min-w-[calc(25%-0.95rem)] shrink-0"
                onClick={() => onNavigate?.('team-detail', member)}
              >
                <div className="group relative h-[400px] w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-[1.5rem] overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer">

                  {/* Image Layer */}
                  <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-800">
                    <img
                      src={member.image}
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      alt={member.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>

                  {/* Tech Overlay Lines */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity duration-500">
                    <div className="absolute top-8 right-8 w-16 h-[1px] bg-white" />
                    <div className="absolute top-8 right-8 w-[1px] h-16 bg-white" />
                    <div className="absolute bottom-8 left-8 w-16 h-[1px] bg-white" />
                    <div className="absolute bottom-8 left-8 w-[1px] h-16 bg-white" />
                  </div>

                  {/* Status Dot */}
                  <div className="absolute top-5 left-5 px-2.5 py-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] uppercase font-bold text-white tracking-widest">Active</span>
                  </div>

                  {/* Content Layer */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">

                    {/* Hidden Tags revealing on hover */}
                    <div className="flex flex-wrap gap-1.5 mb-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {member.specialty.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{member.role}</p>
                      <h3 className="text-2xl font-display font-black text-white leading-tight">{member.name}</h3>
                    </div>

                    {/* Social Actions */}
                    <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-500 flex items-center gap-3 mt-0 group-hover:mt-4 opacity-0 group-hover:opacity-100">
                      <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                        <Linkedin size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                        <Twitter size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                        <Github size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 w-full h-[1px] bg-slate-200 dark:bg-zinc-800 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary-600"
            animate={{
              width: `${team.length ? ((currentIndex % team.length + itemsPerView) / team.length) * 100 : 0}%`
            }}
            transition={isResetting ? { duration: 0 } : { duration: 0.8, ease: "easeInOut" }}
          />
        </div>

      </div>
    </section>
  );
};

export default Team;
