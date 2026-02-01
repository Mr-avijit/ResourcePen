
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const BLOGS = [
  { id: '1', title: 'The Future of Web Development in 2025', excerpt: 'Explore upcoming trends in React and AI.', category: 'Trends', author: 'Marcus Wong', date: 'Oct 12, 2024', readTime: '5 min', image: 'https://picsum.photos/600/400?random=50' },
  { id: '2', title: 'How to Scale Your SaaS Dashboard', excerpt: 'Optimizing performance in large-scale apps.', category: 'Performance', author: 'Elena Petrova', date: 'Oct 08, 2024', readTime: '8 min', image: 'https://picsum.photos/600/400?random=51' },
  { id: '3', title: 'Designing for Dark Mode: Best Practices', excerpt: 'Color contrast and accessibility in UI.', category: 'Design', author: 'Sarah Jenkins', date: 'Oct 05, 2024', readTime: '6 min', image: 'https://picsum.photos/600/400?random=52' }
];

interface BlogProps {
  onViewAll: () => void;
  onSelectBlog: (blog: any) => void;
}

const Blog: React.FC<BlogProps> = ({ onViewAll, onSelectBlog }) => {
  return (
    <section id="blog" className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-display font-extrabold mb-4">Latest Insights</h2>
            <p className="text-slate-600 dark:text-slate-400">Discover tips, trends, and success stories.</p>
          </div>
          <button onClick={onViewAll} className="px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">View All Posts <ArrowRight size={18} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOGS.map((blog, i) => (
            <motion.article 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => onSelectBlog(blog)}
              className="group cursor-pointer"
            >
              <div className="relative rounded-[2rem] overflow-hidden mb-6 aspect-video shadow-lg border border-slate-100 dark:border-slate-800">
                <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4"><span className="px-3 py-1 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-primary-600">{blog.category}</span></div>
              </div>
              <div className="flex gap-4 text-xs text-slate-500 mb-4 font-medium"><span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span><span className="flex items-center gap-1"><Clock size={14} /> {blog.readTime}</span></div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary-500 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">{blog.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
