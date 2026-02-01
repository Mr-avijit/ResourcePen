
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Zap, User, Shield, Loader2, Minus, Maximize2, Trash2, ShieldCheck } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Identity verified. I am the Resources Pen Support Core. How can I assist your architectural workflow today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<any[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the Resources Pen AI Assistant, an elite technical support core for an enterprise digital asset marketplace. 
          Your tone is professional, architectural, and highly efficient. 
          Use metaphors related to blueprints, nodes, infrastructure, and scalability. 
          Help users with marketplace navigation, technical specs of products like "Horizon Dashboard", and account queries.
          Be concise. Never mention you are an AI model unless directly asked.`,
        },
        history: historyRef.current,
      });

      const response: GenerateContentResponse = await chat.sendMessage({ message: input });
      const modelText = response.text || "Protocol timeout. Failed to retrieve response.";

      historyRef.current = [
        ...historyRef.current,
        { role: 'user', parts: [{ text: input }] },
        { role: 'model', parts: [{ text: modelText }] }
      ];

      setMessages(prev => [...prev, {
        role: 'model',
        text: modelText,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Neural connection error. Please verify your network protocol.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'model',
      text: 'Chat history purged. System ready for new input.',
      timestamp: new Date()
    }]);
    historyRef.current = [];
  };

  return (
    <div className="fixed bottom-32 right-6 lg:bottom-12 lg:right-12 z-[1000] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 'auto' : 'min(600px, 65vh)'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.15 } }}
            className="w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-zinc-800 overflow-hidden flex flex-col mb-4 origin-bottom-right"
          >
            {/* Header - Compact height */}
            <header className="px-5 h-14 flex items-center justify-between border-b dark:border-zinc-800 bg-primary-600/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-lg">
                  <Zap size={14} className="fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold dark:text-white leading-none tracking-tight">Enterprise Support</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400">
                  {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-400 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </header>

            {!isMinimized && (
              <>
                {/* Messages - Responsive scroll area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${msg.role === 'user' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-primary-600'
                          }`}>
                          {msg.role === 'user' ? <User size={14} /> : <Zap size={14} className="fill-current" />}
                        </div>
                        <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${msg.role === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 rounded-tl-none'
                          }`}>
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-2.5 items-center opacity-50">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                          <Loader2 size={12} className="animate-spin text-primary-500" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Synthesizing...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Input - Fixed at bottom */}
                <footer className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-black/50 backdrop-blur-md shrink-0 group">
                  <form onSubmit={handleSend} className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your question..."
                      className="w-full bg-white dark:bg-zinc-900 rounded-xl pl-4 pr-12 py-3.5 text-xs font-medium border border-slate-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center aspect-square"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                  <div className="flex justify-between items-center mt-3 px-1">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      <span>Encrypted End-to-End</span>
                    </div>
                    <button onClick={clearChat} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
                      <Trash2 size={12} /> Clear History
                    </button>
                  </div>
                </footer>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen ? {
          y: [0, -6, 0],
        } : {}}
        transition={!isOpen ? {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary-600 text-white shadow-[0_8px_30px_rgba(2,132,199,0.3)] hover:shadow-[0_8px_30px_rgba(2,132,199,0.5)] flex items-center justify-center relative border border-white/10 active:scale-90 transition-all"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="open" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="closed" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={24} className="fill-current" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -inset-1.5 rounded-2xl border-2 border-primary-500/30"
          />
        )}
      </motion.button>
    </div>
  );
};

export default SupportChat;
