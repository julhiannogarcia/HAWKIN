'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, Loader2, Keyboard, Smartphone, Laptop, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function HawkinAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hola, Socio. Mi red visual v27.0 está activa. ¿Qué dispositivo o sistema deseas configurar hoy?' }
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
      setMessages(prev => [...prev, { role: 'ai', text: 'Socio, error en el manual gráfico. Reintenta.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // MOTOR VISUAL DE HAWKIN: Procesa colores, botones e IMÁGENES
  const formatAiMessage = (text: string) => {
    return text.split('\n').map((line, index) => {
      let content: any = line;
      let className = "text-gray-300";

      // 1. Detección de Imágenes Técnicas
      if (line.includes('[IMAGE: keyboard]')) {
        return (
          <div key={index} className="my-6 p-6 bg-white/5 border border-cyan-400/20 rounded-[30px] text-center space-y-4">
             <Keyboard className="mx-auto text-cyan-400 animate-pulse" size={48} />
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Diagrama de Teclado Activo</p>
          </div>
        );
      }
      if (line.includes('[IMAGE: smartphone]')) {
        return (
          <div key={index} className="my-6 p-6 bg-white/5 border border-purple-400/20 rounded-[30px] text-center space-y-4">
             <Smartphone className="mx-auto text-purple-400 animate-bounce" size={48} />
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Interfaz Móvil Detectada</p>
          </div>
        );
      }

      // 2. Detección de Botones de Teclado
      if (line.includes('[ ') && line.includes(' ]')) {
        className = "flex flex-wrap gap-2 my-4";
        content = line.split('+').map((part, i) => (
          <span key={i} className="px-4 py-2 bg-gradient-to-b from-white/10 to-transparent border border-white/20 rounded-xl font-black text-white text-[11px] shadow-xl flex items-center gap-2">
            {part.includes('[') ? part.replace('[', '').replace(']', '').trim() : part.trim()}
          </span>
        ));
      }

      // 3. Colores Neón Inteligentes
      if (line.includes('[CYAN]')) {
        className = "text-cyan-400 font-bold border-l-2 border-cyan-400 pl-3 my-2 bg-cyan-400/5 py-2 rounded-r-xl";
        content = line.replace('[CYAN]', '✦ ');
      } else if (line.includes('[RED]')) {
        className = "text-red-400 bg-red-400/5 p-4 rounded-2xl border border-red-400/20 flex items-center gap-3";
        content = <><ShieldAlert size={16} /> <span>{line.replace('[RED]', '')}</span></>;
      } else if (line.includes('[GREEN]')) {
        className = "text-green-400 font-bold flex items-center gap-3 bg-green-400/5 p-3 rounded-xl";
        content = <><CheckCircle2 size={16} /> <span>{line.replace('[GREEN]', '')}</span></>;
      }

      return (
        <div key={index} className={`${className} mb-3 leading-relaxed`}>
          {content}
        </div>
      );
    });
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full flex items-center justify-center cursor-pointer z-[9998] shadow-[0_0_40px_rgba(0,242,255,0.4)] border border-white/20"
      >
        <Sparkles className="text-white" size={24} />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[420px] h-[700px] bg-black/98 backdrop-blur-3xl border border-white/10 rounded-[50px] z-[9999] flex flex-col overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,1)]"
          >
            {/* Header Pro */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.04] to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_cyan]" />
                <div>
                  <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">HAWKIN <span className="text-cyan-400">Manual</span></h3>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Visual Engine v27.0</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-gray-500 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Conversación Visual */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {messages.map((msg, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[95%] p-7 rounded-[40px] text-sm shadow-2xl ${
                    msg.role === 'ai' 
                      ? 'bg-white/[0.02] border border-white/10 text-gray-200 rounded-bl-none' 
                      : 'bg-gradient-to-br from-cyan-400 to-purple-600 text-black font-black rounded-br-none shadow-[0_10px_30px_rgba(0,242,255,0.2)]'
                  }`}>
                    {msg.role === 'ai' ? formatAiMessage(msg.text) : msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center gap-3">
                      <Loader2 className="animate-spin text-cyan-400" size={18} />
                      <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Dibujando Manual...</span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Tech */}
            <div className="p-8 bg-black border-t border-white/5 flex gap-4">
              <input
                type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Configurar mi dispositivo..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white outline-none focus:border-cyan-400 transition-all"
              />
              <button onClick={handleSend} disabled={isTyping} className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center text-black hover:bg-white transition-all shadow-2xl disabled:opacity-50">
                <Send size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
