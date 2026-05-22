'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, Zap, ShieldCheck, GraduationCap, Loader2 } from 'lucide-react';

export default function HawkinAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hola, Socio. Soy HAWKIN AI, el cerebro nativo de este ecosistema. ¿En qué desafío tecnológico o de aprendizaje te puedo asistir hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Socio, mis núcleos de comunicación han tenido un pequeño desfase. Por favor, intenta de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickAction = (text: string) => {
    setInputValue(text);
    // Un pequeño delay para que se vea el texto antes de enviar
    setTimeout(handleSend, 100);
  };

  return (
    <>
      {/* 1. ORBE FLOTANTE */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full flex items-center justify-center cursor-pointer z-[9998] shadow-[0_0_40px_rgba(0,242,255,0.4)] border border-white/20"
      >
        <Sparkles className="text-white" size={24} />
        <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
      </motion.div>

      {/* 2. VENTANA DE CHAT INTELIGENTE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[380px] h-[600px] bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[40px] z-[9999] flex flex-col overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
          >
            {/* Header Profesional */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.03] to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_cyan]" />
                <div>
                  <h3 className="text-sm font-black tracking-widest text-white">HAWKIN <span className="text-cyan-400">AI</span></h3>
                  <p className="text-[8px] text-gray-500 uppercase font-black">Cerebro Autónomo v2.0</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-gray-500 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Conversación Fluida */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[90%] p-4 rounded-3xl text-sm leading-relaxed ${
                    msg.role === 'ai' 
                      ? 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none' 
                      : 'bg-cyan-500 text-black font-black shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-br-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-bl-none flex items-center gap-2">
                      <Loader2 className="animate-spin text-cyan-400" size={16} />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">IA Procesando...</span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Acciones Rápidas Inteligentes */}
            <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-black/40">
               <button onClick={() => quickAction('Ayúdame con mi inglés')} className="whitespace-nowrap px-4 py-2 rounded-full border border-white/10 text-[9px] font-black text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all uppercase">
                 <Zap size={10} className="inline mr-1" /> Inglés
               </button>
               <button onClick={() => quickAction('Tengo un problema de tecnología')} className="whitespace-nowrap px-4 py-2 rounded-full border border-white/10 text-[9px] font-black text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all uppercase">
                 <Monitor size={10} className="inline mr-1" /> Tech Help
               </button>
               <button onClick={() => quickAction('Instalar programas')} className="whitespace-nowrap px-4 py-2 rounded-full border border-white/10 text-[9px] font-black text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all uppercase">
                 <GraduationCap size={10} className="inline mr-1" /> Manuales
               </button>
            </div>

            {/* Entrada de Comandos */}
            <div className="p-6 bg-black border-t border-white/5 flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu comando o consulta..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-cyan-400 transition-all placeholder:text-gray-700"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="w-14 h-14 bg-cyan-400 rounded-2xl flex items-center justify-center text-black hover:bg-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Icono extra para tech help
function Monitor({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}
