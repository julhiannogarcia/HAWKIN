'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, X, MessageSquare, Zap, ShieldCheck, GraduationCap } from 'lucide-react';

export default function HawkinAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hola, Socio. Soy el Agente de Inteligencia de HAWKIN. ¿En qué puedo asistirte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulador de Inteligencia HAWKIN
    setTimeout(() => {
      let aiResponse = "";
      const input = userMsg.text.toLowerCase();

      if (input.includes('noticia') || input.includes('radar')) {
        aiResponse = "Analizando el Radar de Millonarios... Sam Altman y NVIDIA están liderando las tendencias de hoy con nuevos avances en razonamiento System 2. ¿Deseas un análisis profundo?";
      } else if (input.includes('curso') || input.includes('academia')) {
        aiResponse = "En la Academia HAWKIN tenemos activos los programas de IA, Inglés y Excel. El curso de Inclusión para Autismo también está disponible. ¿En cuál deseas inscribirte?";
      } else if (input.includes('shield') || input.includes('seguridad') || input.includes('hacker')) {
        aiResponse = "HAWKIN Shield está en modo vigilancia activa. Hemos detectado nuevas vulnerabilidades en sistemas Windows. Te recomiendo revisar el último manual de defensa.";
      } else {
        aiResponse = "Entendido, Socio. Mi cerebro está procesando esa información desde el ecosistema global de Julhianno Garcia. ¿Hay algo específico que quieras que investigue en el Radar?";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <>
      {/* 1. ORBE FLOTANTE */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full flex items-center justify-center cursor-pointer z-[9998] shadow-[0_0_30px_rgba(0,242,255,0.4)]"
      >
        <Sparkles className="text-white" size={24} />
        <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
      </motion.div>

      {/* 2. VENTANA DE CHAT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[380px] h-[550px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[35px] z-[9999] flex flex-col overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_cyan]" />
                <div>
                  <h3 className="text-sm font-black tracking-widest text-white">HAWKIN <span className="text-cyan-400">AI</span></h3>
                  <p className="text-[8px] text-gray-500 uppercase font-black">Cerebro Nativo Activo</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'ai' 
                      ? 'bg-white/5 border border-white/5 text-gray-300' 
                      : 'bg-cyan-400 text-black font-bold'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Acciones Rápidas */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
               <button onClick={() => setInputValue('Últimas noticias')} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-black text-gray-400 hover:text-cyan-400 transition-colors uppercase">
                 <Zap size={10} className="inline mr-1" /> Noticias
               </button>
               <button onClick={() => setInputValue('Cursos')} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-black text-gray-400 hover:text-cyan-400 transition-colors uppercase">
                 <GraduationCap size={10} className="inline mr-1" /> Academia
               </button>
               <button onClick={() => setInputValue('Seguridad')} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-black text-gray-400 hover:text-cyan-400 transition-colors uppercase">
                 <ShieldCheck size={10} className="inline mr-1" /> Shield
               </button>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/50 border-t border-white/5 flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunta a la IA de HAWKIN..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400 transition-all"
              />
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center text-black hover:bg-white transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
