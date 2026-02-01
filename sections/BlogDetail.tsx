
import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Zap, ArrowRight, ArrowUpRight, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface BlogDetailProps {
  blog: any;
  onBack: () => void;
}

const MOCK_COMMENTS = [
  { id: 1, author: "David Chem", role: "Frontend Lead", date: "2 hours ago", content: "Great deep dive! I've been experimenting with server components lately and the performance gains are real.", avatar: "david", likes: 12, isLiked: false },
  { id: 2, author: "Sarah L.", role: "UX Designer", date: "5 hours ago", content: "The point about predictive interfaces really resonated with me. We are trying to implement something similar.", avatar: "sarah", likes: 8, isLiked: true },
  { id: 3, author: "Michael Chen", role: "Architect", date: "1 day ago", content: "Interesting perspective on AI-driven code gen. I think the challenge will be maintaining code quality.", avatar: "michael", likes: 24, isLiked: false },
  { id: 4, author: "Jessica Wu", role: "Product Owner", date: "1 day ago", content: "This aligns perfectly with our Q4 roadmap. Thanks for sharing the insights!", avatar: "jessica", likes: 5, isLiked: false }
];

const BlogDetail: React.FC<BlogDetailProps> = ({ blog, onBack }) => {
  const { scrollYProgress } = useScroll();
  const [comments, setComments] = React.useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const formRef = useRef<HTMLTextAreaElement>(null);

  const handleLike = (id: number) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked };
      }
      return c;
    }));
  };

  const handleReply = (author: string) => {
    setReplyingTo(author);
    formRef.current?.focus();
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([...comments, {
      id: comments.length + 1,
      author: "You",
      role: "Guest",
      date: "Just now",
      content: replyingTo ? `@${replyingTo} ${newComment}` : newComment,
      avatar: "guest",
      likes: 0,
      isLiked: false
    }]);
    setNewComment('');
    setReplyingTo(null);
  };
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-600 origin-left z-50"
        style={{ scaleX }}
      />

      <button onClick={onBack} className="flex items-center gap-2 text-primary-500 font-bold mb-12 hover:-translate-x-2 transition-transform">
        <ArrowLeft size={20} /> Back to Blog
      </button>

      <div className="mb-12">
        <div className="flex items-center gap-2 text-primary-500 text-sm font-bold uppercase tracking-widest mb-4">
          <span className="px-3 py-1 bg-primary-500/10 rounded-lg">{blog.category}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-8 leading-tight">{blog.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-500/20 overflow-hidden" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{blog.author}</div>
              <div className="text-sm text-slate-500">Core Contributor</div>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-2"><Calendar size={18} /> {blog.date}</span>
            <span className="flex items-center gap-2"><Clock size={18} /> {blog.readTime}</span>
          </div>
        </div>
      </div>

      <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl mb-12 border border-slate-200 dark:border-slate-800">
        <img src={blog.image} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
        {/* Sidebar (Sticky Share) */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-32 flex flex-col gap-4">
            <button className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-white hover:shadow-lg transition-all">
              <Share2 size={20} />
            </button>
            <div className="h-px bg-slate-200 dark:bg-zinc-800 my-2" />
            <div className="text-[10px] font-bold text-slate-400 rotate-180 text-center" style={{ writingMode: 'vertical-rl' }}>
              SHARE THIS ARTICLE
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <article className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            <p className="text-xl md:text-2xl font-serif text-slate-800 dark:text-zinc-200 leading-relaxed mb-10 italic border-l-4 border-primary-500 pl-6">
              "{blog.excerpt} This is often the hook that draws readers in, setting the stage for the technical deep dive that follows."
            </p>

            <p>
              In the rapidly evolving landscape of web development, staying ahead of the curve is not just an advantage—it's a necessity.
              As we look towards 2025, several key paradigms are shifting.
              <span className="bg-primary-100 dark:bg-primary-900/30 px-1 rounded mx-1 text-primary-700 dark:text-primary-300 font-medium">Server Components</span>
              are becoming the default, and AI-driven code generation is seamlessly integrated into our IDEs.
            </p>

            <h2 className="text-3xl font-display font-bold mt-16 mb-6 text-slate-900 dark:text-white">The Rise of Intelligent Interfaces</h2>
            <p>
              Gone are the days of static dashboards. Users now demand interfaces that predict their needs.
              Adaptive layouts that shift based on user behavior metrics are becoming standard.
            </p>

            <div className="my-12 p-8 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-white/5">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-500 fill-current" /> Key Takeaway
              </h4>
              <p className="text-sm font-medium m-0">
                Always design with the assumption that your user is distracted. Clear visual hierarchy and predictive actions reduce cognitive load significantly.
              </p>
            </div>

            <p>
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra,
              est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
            </p>
          </article>

          {/* Share Section */}
          <div className="p-12 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 mb-32 mt-20">
            <div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white">Spread the Knowledge</h3>
              <p className="text-slate-500">Share this insight with your network.</p>
            </div>
            <div className="flex gap-4">
              <button className="p-4 bg-white dark:bg-black rounded-2xl shadow-sm hover:text-primary-500 transition-colors"><Share2 size={24} /></button>
              <button className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-500 transition-all shadow-lg hover:shadow-primary-600/20">Join Discussion</button>
            </div>
          </div>

          {/* Discussion Section */}
          <div id="comments" className="mt-24 border-t border-slate-200 dark:border-zinc-800 pt-16">
            <h3 className="text-3xl font-display font-bold dark:text-white mb-10 flex items-center gap-3">
              <MessageSquare className="text-primary-600" />
              Discussion <span className="text-slate-400 text-lg font-normal">({comments.length})</span>
            </h3>

            {/* Comment List */}
            <div className="mb-12">
              <div className="max-h-[500px] overflow-y-auto pr-4 space-y-6 custom-scrollbar scroll-smooth">
                <AnimatePresence initial={false}>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-4 md:gap-6 p-1 rounded-3xl transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/30"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden flex-shrink-0 shadow-sm mt-1">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.avatar}`} className="w-full h-full" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{comment.author}</span>
                          <span className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">{comment.role}</span>
                          <span className="text-xs text-slate-400 font-medium ml-auto">{comment.date}</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 rounded-2xl rounded-tl-none shadow-sm relative group">
                          {comment.content}
                          <div className="absolute -left-2 top-0 w-3 h-3 bg-slate-50 dark:bg-zinc-900 border-l border-t border-slate-100 dark:border-zinc-800 transform -rotate-45"></div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 pl-2">
                          <button
                            onClick={() => handleLike(comment.id)}
                            className={`text-xs font-bold flex items-center gap-1.5 transition-all group ${comment.isLiked ? 'text-primary-600' : 'text-slate-400 hover:text-primary-600'}`}
                          >
                            <ThumbsUp size={14} className={`transition-transform ${comment.isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                            {comment.likes} Helpful
                          </button>
                          <button
                            onClick={() => handleReply(comment.author)}
                            className="text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Leave a Reply Form */}
            <div className="bg-slate-50 dark:bg-zinc-900/30 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-zinc-800 transition-all focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold dark:text-white">Leave a contribution</h4>
                {replyingTo && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold animate-in fade-in slide-in-from-right-5">
                    <span>Replying to @{replyingTo}</span>
                    <button onClick={() => setReplyingTo(null)} className="hover:text-primary-900 dark:hover:text-white"><ArrowUpRight size={12} className="rotate-45" /></button>
                  </div>
                )}
              </div>
              <form onSubmit={handlePostComment} className="relative group">
                <textarea
                  ref={formRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyingTo ? `Write a reply to ${replyingTo}...` : "Share your thoughts on this topic..."}
                  className="w-full h-40 p-6 rounded-3xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 resize-none focus:outline-none focus:ring-0 transition-all text-slate-700 dark:text-slate-200"
                ></textarea>
                <div className="absolute bottom-4 right-4">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-500 transition-all shadow-lg hover:shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    {replyingTo ? 'Post Reply' : 'Post Comment'} <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white mb-2">{blog.author}</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mb-4 max-w-md">Senior Architect at Resources Pen. passionate about building scalable UI systems and accessible web applications.</p>
              <button className="text-primary-600 font-bold text-sm tracking-wide uppercase hover:underline">Follow on Twitter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Read Next Section */}
      <div className="border-t border-slate-200 dark:border-zinc-800 pt-24 mt-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display font-bold dark:text-white">Read Next</h2>
          <button className="flex items-center gap-2 text-primary-600 font-bold hover:gap-4 transition-all">
            View all articles <ArrowRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="group cursor-pointer flex gap-6 items-center">
              <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-zinc-900 overflow-hidden flex-shrink-0">
                <img src={`https://picsum.photos/200/200?random=${i + 10}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">Design Systems</div>
                <h3 className="text-xl font-bold dark:text-white mb-2 leading-tight group-hover:underline decoration-slate-300 underline-offset-4">Building Accessible Color Palettes for Enterprise Apps</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                  <span>Oct 12, 2024</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
