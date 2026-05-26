'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Sparkles } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';

interface AIAvatarProps {
  text: string;
  lang: 'en' | 'es';
  isActive: boolean;
  onEnd?: () => void;
}

export default function AIAvatar({ text, lang, isActive, onEnd }: AIAvatarProps) {
  const { isReady, isSpeaking, speak, stop } = useSpeech();

  // Escuchar cambios en el texto y el estado activo
  React.useEffect(() => {
    if (isActive && text && isReady) {
      speak(text, lang, onEnd);
    } else {
      stop();
    }
  }, [isActive, text, lang, isReady, speak, stop, onEnd]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* EFECTO DE NÚCLEO DE IA PROFESIONAL */}
        <AnimatePresence>
          {isSpeaking && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.8, 2.5], 
                    opacity: [0.4, 0.1, 0] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.75,
                    ease: "linear"
                  }}
                  className="absolute inset-0 rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* NÚCLEO CENTRAL */}
        <motion.div
          animate={isSpeaking ? {
            scale: [1, 1.05, 1],
            rotate: 360,
          } : { scale: 1, rotate: 0 }}
          transition={isSpeaking ? { 
            scale: { duration: 0.5, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          } : { duration: 1 }}
          className="relative z-10 w-48 h-48 rounded-[60px] bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-700 flex items-center justify-center shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-white/30"
        >
          {/* EL "OJO" DE LA IA */}
          <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
             <motion.div 
               animate={isSpeaking ? {
                 height: [10, 40, 10, 60, 10],
                 width: [40, 10, 40, 10, 40],
                 borderRadius: ["50%", "20%", "50%", "20%", "50%"]
               } : { height: 4, width: 40 }}
               transition={{ duration: 0.8, repeat: Infinity }}
               className="bg-cyan-400 shadow-[0_0_20px_#22d3ee] blur-[1px]"
             />
          </div>

          {/* PARTÍCULAS ORBITALES */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
          </motion.div>
        </motion.div>

        {/* INDICADORES DE ESTADO */}
        <div className="absolute -bottom-6 flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full shadow-2xl">
           {!isReady ? (
             <span className="text-[8px] font-black text-yellow-500 uppercase animate-pulse">Iniciando Voz...</span>
           ) : isSpeaking ? (
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Transmitiendo {lang === 'en' ? 'Inglés' : 'Español'}</span>
             </div>
           ) : (
             <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Sistema Listo</span>
           )}
        </div>
      </div>
    </div>
  );
}
