'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { REGIONAL_EVENTS } from '@/lib/events';

export default function Intro() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  useEffect(() => {
    // 1. Verificamos si el usuario ya vio la intro en esta sesión para no molestarlo
    const hasSeenIntro = sessionStorage.getItem('hawkin_intro_seen');
    if (hasSeenIntro) return;

    // 2. Iniciamos el proceso de detección inteligente
    const initIntro = async () => {
      try {
        // Detectar país vía nuestra API de Geo (Detección real de IP)
        const res = await fetch('/api/geo');
        const { countryCode } = await res.json();

        // Lógica de fecha actual
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateKey = `${month}-${day}`;

        const event = REGIONAL_EVENTS[dateKey];

        // SOBERANÍA NACIONAL: Solo mostramos efemérides si el país coincide
        // O si es un evento GLOBAL (Año Nuevo, Navidad)
        if (event && (event.countryCode === countryCode || event.isGlobal)) {
          setCurrentEvent(event);
        }

        setIsVisible(true);
        sessionStorage.setItem('hawkin_intro_seen', 'true');
        
        // La intro dura 7 segundos
        setTimeout(() => setIsVisible(false), 7000);
      } catch (e) {
        console.error("Geo error", e);
      }
    };

    initIntro();
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden"
        >
          <div className="relative w-full max-w-4xl text-center px-4">
            
            {/* Si hay un evento regional HOY que coincida con el país del usuario */}
            {currentEvent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.95, 1, 1, 1.05],
                  filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']
                }}
                transition={{ duration: 4, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div 
                  className="mb-6 w-full h-64 rounded-2xl border border-white/10 bg-cover bg-center shadow-[0_0_50px_rgba(255,255,255,0.1)]" 
                  style={{ backgroundImage: `url(${currentEvent.image})` }}
                />
                <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-white uppercase mb-2">
                  {currentEvent.title}
                </h2>
                <p className="text-cyan-400 tracking-[0.4em] uppercase font-light text-xs">
                  {currentEvent.country} • {currentEvent.date}
                </p>
              </motion.div>
            ) : (
              /* Intro Estándar HAWKIN si no es fecha especial en SU país */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.1] }}
                transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <h2 className="text-4xl md:text-6xl font-black tracking-[0.5em] text-white uppercase opacity-20">HAWKIN</h2>
                <p className="mt-4 text-cyan-400 tracking-[1em] uppercase font-light text-sm">INTELIGENCIA GLOBAL</p>
              </motion.div>
            )}

            {/* Slide Final: HAWKIN Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.95, 1, 1, 1.05],
                filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']
              }}
              transition={{ delay: 3.5, duration: 3.5, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <h1 className="text-7xl md:text-9xl font-black tracking-[0.1em] bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,242,255,0.5)]">
                HAWKIN
              </h1>
              <p className="mt-4 text-cyan-400 tracking-[0.5em] uppercase font-light">La Libertad del Futuro</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
