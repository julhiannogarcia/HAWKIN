'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Shield, Zap, Send, Loader2, Info, Lock, Globe, X } from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function HawkinAI() {
  const { user } = useAlpha();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: 'Iniciando conexión con el núcleo HAWKIN v1.0. ¿En qué puedo asistirte, Socio Alpha?' }
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
      {/* BOTÓN FLOTANTE ALPHA */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 z-[5000] w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center shadow-[0_20px_80px_rgba(255,255,255,0.2)] hover:scale-110 transition-all border-4 border-cyan-500/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles size={32} className="relative z-10 group-hover:text-white transition-colors" />
      </button>

      {/* TERMINAL DE IA */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed bottom-32 right-10 z-[5001] w-full max-w-lg h-[600px] glass-card bg-black/90 backdrop-blur-2xl border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden rounded-[50px]"
          >
            {/* CABECERA TÁCTICA */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                     <Terminal size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest italic">HAWKIN AI Core</p>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Enlace Seguro Activado</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-red-500 transition-all"><X size={16} /></button>
            </div>

            {/* CHAT LOG */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8" ref={scrollRef}>
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[30px] text-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-500 text-black font-black' : 'bg-white/5 text-gray-300 border border-white/5'}`}>
                       {m.content}
                    </div>
                 </div>
               ))}
               {loading && (
                 <div className="flex justify-start">
                    <div className="bg-white/5 p-6 rounded-[30px] border border-white/5 flex items-center gap-4">
                       <Loader2 className="animate-spin text-cyan-500" size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 animate-pulse">Procesando...</span>
                    </div>
                 </div>
               )}
            </div>

            {/* INPUT ALPHA */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5">
               <div className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Envía un comando al núcleo..."
                    className="w-full bg-black border border-white/10 rounded-full py-5 px-10 text-xs font-bold text-white outline-none focus:border-cyan-500 transition-all pr-20"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cyan-500 transition-all"
                  >
                    <Send size={16} />
                  </button>
               </div>
               <div className="mt-6 flex items-center justify-between text-[7px] font-black text-gray-700 uppercase tracking-widest px-4">
                  <div className="flex items-center gap-2"><Lock size={10} /> Cifrado 256-bit</div>
                  <div className="flex items-center gap-2"><Globe size={10} /> Nodo: Alpha-1</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
