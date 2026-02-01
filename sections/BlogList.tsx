
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Calendar, Clock } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ALL_BLOGS = [
  { id: '1', title: 'The Future of Web Development in 2025', excerpt: 'Explore upcoming trends in React and AI.', category: 'Trends', author: 'Marcus Wong', date: 'Oct 12, 2024', readTime: '5 min', image: 'https://picsum.photos/600/400?random=50', content: 'Long form content here...' },
  { id: '2', title: 'How to Scale Your SaaS Dashboard', excerpt: 'Optimizing performance in large-scale apps.', category: 'Performance', author: 'Elena Petrova', date: 'Oct 08, 2024', readTime: '8 min', image: 'https://picsum.photos/600/400?random=51', content: 'Long form content here...' },
  { id: '3', title: 'Designing for Dark Mode: Best Practices', excerpt: 'Color contrast and accessibility in UI.', category: 'Design', author: 'Sarah Jenkins', date: 'Oct 05, 2024', readTime: '6 min', image: 'https://picsum.photos/600/400?random=52', content: 'Long form content here...' },
  { id: '4', title: 'Advanced TypeScript Patterns', excerpt: 'Unlock power with utility types.', category: 'Engineering', author: 'Alex Rivera', date: 'Sep 28, 2024', readTime: '10 min', image: 'https://picsum.photos/600/400?random=53', content: 'Long form content here...' },
];

interface BlogListProps {
  onSelectBlog: (blog: any) => void;
  onBack: () => void;
}

const BlogList: React.FC<BlogListProps> = ({ onSelectBlog, onBack }) => {
  const [search, setSearch] = useState('');
  const filtered = ALL_BLOGS.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-primary-500 font-bold mb-12 hover:-translate-x-2 transition-transform">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="mb-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest text-primary-600 uppercase bg-primary-50 dark:bg-primary-900/10 rounded-full">
            Editorial
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight dark:text-white">Insights & <span className="text-primary-600">Ideas</span></h1>
          <p className="text-lg text-slate-500 dark:text-zinc-400">Deep dives into architecture, design, and the future of digital products.</p>
        </div>

        {/* Featured Post Hero */}
        <div onClick={() => onSelectBlog(ALL_BLOGS[0])} className="group relative aspect-[21/9] rounded-[2.5rem] overflow-hidden cursor-pointer">
          <img src={ALL_BLOGS[0].image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 md:p-12 flex flex-col justify-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4 text-white/80 text-sm font-bold uppercase tracking-wider">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-lg">{ALL_BLOGS[0].category}</span>
                <span>{ALL_BLOGS[0].date}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:underline decoration-primary-500 underline-offset-8 transition-all">{ALL_BLOGS[0].title}</h2>
              <p className="text-lg text-white/80 line-clamp-2 md:w-2/3">{ALL_BLOGS[0].excerpt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-20 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl py-4 mb-12 border-y border-slate-100 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {['All', 'Trends', 'Performance', 'Design', 'Engineering'].map((cat) => (
              <button key={cat} className="px-5 py-2.5 rounded-full text-sm font-bold bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap">
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-medium dark:text-white"
            />
          </div>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
      >
        {filtered.map((blog) => (
          <motion.div
            variants={item}
            key={blog.id}
            whileHover={{ y: -5 }}
            onClick={() => onSelectBlog(blog)}
            className="group cursor-pointer flex flex-col h-full"
          >
            <div className="aspect-[3/2] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-zinc-900 mb-6 border border-slate-200 dark:border-white/5 relative">
              <img src={blog.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary-600 shadow-sm">
                {blog.category}
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span>{blog.date}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                <span>{blog.readTime} read</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">{blog.title}</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">{blog.excerpt}</p>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} className="w-full h-full" />
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{blog.author}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Newsletter Section */}
      <div className="rounded-[3rem] bg-slate-900 dark:bg-zinc-900 text-white p-12 md:p-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Stay ahead of the curve.</h2>
          <p className="text-slate-400 text-lg mb-10">Weekly curation of the best design resources, tutorials, and architecture patterns. No spam, ever.</p>
          <div className="flex flex-col md:flex-row gap-4">
            <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-primary-500 text-white placeholder:text-slate-500" />
            <button className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-primary-600/25">
              Subscribe Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
