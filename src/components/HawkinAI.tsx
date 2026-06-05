'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Zap, Send, LoaderCircle, Lock, Globe, X } from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function HawkinAI() {
  const { user } = useAlpha();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: 'Protocolo Técnico Activo. ¿En qué puedo asistirte con hardware, software o inteligencia estratégica hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Fallo de enlace satelital. Reintenta.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN FLOTANTE - AJUSTADO A TAMAÑO NORMAL */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[5000] w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 transition-all border-2 border-cyan-500/10 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles size={24} className="relative z-10 group-hover:text-white transition-colors" />
      </button>

      {/* TERMINAL DE IA - MINIMALISTA */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            className="fixed bottom-24 right-6 z-[5001] w-[90%] max-w-[400px] h-[500px] glass-card bg-black/95 backdrop-blur-3xl border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-[30px]"
          >
            {/* CABECERA */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                     <Terminal size={16} />
                  </div>
                  <div className="text-left">
                     <p className="text-[9px] font-black text-white uppercase tracking-widest italic">HAWKIN Technical Support</p>
                     <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Enlace Estable</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all">
                 <X size={14} />
               </button>
            </div>

            {/* CHAT LOG */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-4 rounded-2xl text-[11px] leading-relaxed ${m.role === 'user' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-gray-300 border border-white/5'}`}>
                       {m.content}
                    </div>
                 </div>
               ))}
               {loading && (
                 <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                       <LoaderCircle className="animate-spin text-cyan-500" size={12} />
                       <span className="text-[8px] font-black uppercase text-gray-600 animate-pulse">Sincronizando...</span>
                    </div>
                 </div>
               )}
            </div>

            {/* INPUT */}
            <div className="p-5 bg-white/[0.01] border-t border-white/5">
               <div className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe el problema técnico..."
                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-6 text-[10px] font-medium text-white outline-none focus:border-cyan-500/50 transition-all pr-14"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-all"
                  >
                    <Send size={14} />
                  </button>
               </div>
               <div className="mt-4 flex items-center justify-between text-[6px] font-black text-gray-700 uppercase tracking-widest px-2">
                  <div className="flex items-center gap-1.5"><Lock size={8} /> Secure Socket Layer</div>
                  <div className="flex items-center gap-1.5"><Globe size={8} /> Node: Alpha-1</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
