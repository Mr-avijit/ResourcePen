import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  { name: "Sarah Johnson", role: "CTO at TechStream", content: "The Horizon Dashboard transformed our internal reporting. The code is exceptionally clean and professional.", avatar: "https://picsum.photos/100/100?random=20", rating: 5 },
  { name: "Michael Chen", role: "Lead Developer", content: "ProjectHub templates save us weeks of development time. It's the best investment for our team this year.", avatar: "https://picsum.photos/100/100?random=21", rating: 5 },
  { name: "Emily Davis", role: "Product Designer", content: "The support team is incredible. Resolved my issue in 10 minutes. Exceptional service quality.", avatar: "https://picsum.photos/100/100?random=22", rating: 5 },
  { name: "David Wilson", role: "Founder at Nova", content: "I was skeptical at first, but the performance metrics don't lie. Our load times dropped by 40%.", avatar: "https://picsum.photos/100/100?random=23", rating: 5 },
  { name: "Amanda Lo", role: "SaaS Architect", content: "Finally, a UI kit that actually follows SOLID principles. A joy to extend and maintain.", avatar: "https://picsum.photos/100/100?random=24", rating: 5 },
  { name: "James Carter", role: "DevOps Engineer", content: "The deployment pipeline configurations included were a life saver. Production ready out of the box.", avatar: "https://picsum.photos/100/100?random=25", rating: 5 },
];

interface TestimonialsProps {
  content?: {
    title: string;
    subtitle: string;
  };
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const [width, setWidth] = useState(0);

  // Responsive items per view
  const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const maxIndex = Math.max(0, TESTIMONIALS.length - itemsPerView);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    setWidth(window.innerWidth);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideTo = (index: number) => {
    const target = Math.min(Math.max(0, index), maxIndex);
    setCurrentIndex(target);
  };

  useEffect(() => {
    // 100% card width + gap. Adjust percentages based on grid.
    // On desktop (3 items): 33.333% move. On mobile (1 item): 100% move.
    const percentage = width < 768 ? 100 : 33.333;
    controls.start({ x: `-${currentIndex * percentage}%` });
  }, [currentIndex, width, controls]);

  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-black overflow-hidden relative border-t border-slate-200 dark:border-white/5">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 shadow-sm">
            <Quote size={12} className="text-primary-500 fill-current" /> Client Validation
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-black mb-4 dark:text-white tracking-tight">
            Architect Success Stories
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-slate-500 dark:text-zinc-500 font-medium max-w-2xl mx-auto">
            Join over 10,000+ satisfied developers and entrepreneurs building the future.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Button */}
          <button
            onClick={() => slideTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-xl flex items-center justify-center text-slate-900 dark:text-white transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none border border-slate-100 dark:border-white/10`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Button */}
          <button
            onClick={() => slideTo(currentIndex + 1)}
            disabled={currentIndex === maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-xl flex items-center justify-center text-slate-900 dark:text-white transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none border border-slate-100 dark:border-white/10`}
          >
            <ChevronRight size={20} />
          </button>

          {/* Track Window */}
          <div className="overflow-hidden p-4 -m-4">
            <motion.div
              animate={controls}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex gap-0" // Gap is handled via padding inside items to ensure % percent slide calculation is precise
            >
              {TESTIMONIALS.map((testimonial, i) => (
                <div key={i} className="min-w-full md:min-w-[33.333%] px-4">
                  <div className="h-full p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary-500/30 transition-colors flex flex-col group/card">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} size={14} className={`fill-current ${s < testimonial.rating ? 'text-yellow-400' : 'text-slate-200 dark:text-zinc-800'}`} />
                      ))}
                    </div>

                    <blockquote className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-8 flex-1">
                      "{testimonial.content}"
                    </blockquote>

                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-sky-600 rounded-xl blur-sm opacity-0 group-hover/card:opacity-40 transition-opacity" />
                        <img src={testimonial.avatar} className="relative w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-zinc-800" alt={testimonial.name} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{testimonial.name}</h4>
                          <CheckCircle2 size={12} className="text-primary-500" />
                        </div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => slideTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? 'w-8 bg-primary-600' : 'w-2 bg-slate-300 dark:bg-zinc-700 hover:bg-primary-400'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;