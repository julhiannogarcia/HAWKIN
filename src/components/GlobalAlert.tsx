'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ExternalLink, Star } from 'lucide-react';

export type AlertType = 'LIVE' | 'GRATITUDE' | 'ANNOUNCEMENT';

interface GlobalAlertProps {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  url?: string;
  onClose: (id: string) => void;
}

export default function GlobalAlert({ id, type, title, message, url, onClose }: GlobalAlertProps) {
  const [showFireworks, setShowFireworks] = useState(type === 'GRATITUDE');

  useEffect(() => {
    if (type === 'GRATITUDE') {
      const timer = setTimeout(() => setShowFireworks(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  const colors = {
    LIVE: 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    GRATITUDE: 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]',
    ANNOUNCEMENT: 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-24 right-6 w-[350px] bg-black/90 backdrop-blur-xl border-2 rounded-3xl p-6 z-[9999] ${colors[type]}`}
    >
      {/* Simulación de fuegos artificiales para Gratitud */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ scale: 0, x: '50%', y: '50%' }}
              animate={{ 
                scale: [0, 1.5, 0], 
                x: [`${50}%`, `${Math.random() * 100}%`], 
                y: [`${50}%`, `${Math.random() * 100}%`] 
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${type === 'LIVE' ? 'bg-red-600 animate-pulse' : type === 'GRATITUDE' ? 'bg-yellow-600' : 'bg-cyan-600'}`}>
          {type === 'LIVE' ? 'En Vivo Ahora' : type === 'GRATITUDE' ? 'Impacto Social' : 'Aviso Global'}
        </div>
        <button onClick={() => onClose(id)} className="text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black text-white leading-tight flex items-center gap-2">
          {type === 'GRATITUDE' && <Star size={16} className="text-yellow-400" />}
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed italic">
          "{message}"
        </p>
      </div>

      {url && (
        <a 
          href={url} 
          target="_blank" 
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors"
        >
          Unirse <ExternalLink size={14} />
        </a>
      )}

      <div className="mt-6 pt-4 border-t border-white/5 text-center">
        <p className="text-[8px] text-gray-600 uppercase tracking-widest">Ecosistema HAWKIN Global</p>
      </div>
    </motion.div>
  );
}
