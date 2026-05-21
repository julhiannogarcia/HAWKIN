'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Intro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);
    return () => clearTimeout(timer);
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
            {/* Slide 1: Efeméride (Ejemplo Perú) */}
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
              <div className="mb-6 w-full h-64 rounded-2xl border border-red-500/30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Proclamaci%C3%B3n_de_la_Independencia_del_Per%C3%BA.jpg/1200px-Proclamaci%C3%B3n_de_la_Independencia_del_Per%C3%BA.jpg')] bg-cover bg-center shadow-[0_0_50px_rgba(217,16,35,0.2)]" />
              <h2 className="text-4xl md:text-6xl font-black tracking-[0.2em] text-white uppercase mb-2">
                ¡Felices Fiestas Patrias!
              </h2>
              <p className="text-red-500 tracking-[0.4em] uppercase font-light">Perú • 28 de Julio</p>
            </motion.div>

            {/* Slide 2: HAWKIN Reveal */}
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
              <div className="mt-12 text-gray-500 text-sm tracking-[0.3em] uppercase">Julhianno Garcia • Fundador</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
