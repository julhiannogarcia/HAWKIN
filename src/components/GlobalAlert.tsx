'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, X } from 'lucide-react';

export default function GlobalAlert() {
  const [alert, setAlert] = useState<{name: string, message: string} | null>(null);

  const triggerCelebration = (name: string, message: string) => {
    setAlert({ name, message });
    
    // Configuración de Fuegos Artificiales
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    setTimeout(() => setAlert(null), 8000);
  };

  // Simulación de una donación real para que Julhianno la vea
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerCelebration("Julhianno Garcia", "¡Creyendo en el futuro de HAWKIN! 🚀💎");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -100 }}
          className="fixed top-12 left-1/2 -translate-x-1/2 z-[99999] w-[90%] max-w-lg"
        >
          <div className="glass-card bg-gradient-to-r from-cyan-500/20 via-purple-600/20 to-cyan-500/20 border-cyan-500/40 p-1 shadow-[0_0_50px_rgba(0,242,255,0.3)] rounded-[30px]">
            <div className="bg-black/80 rounded-[28px] p-6 flex items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.5)]">
                <Heart className="text-black fill-black" size={32} />
              </div>
              
              <div className="flex-1">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-1">Nueva Colaboración de Élite</p>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{alert.name}</h3>
                <p className="text-gray-400 text-sm italic font-light mt-1">"{alert.message}"</p>
              </div>

              <button onClick={() => setAlert(null)} className="text-gray-600 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
