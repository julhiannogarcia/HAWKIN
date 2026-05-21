'use client';

import { motion } from 'framer-motion';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  isLocked: boolean;
}

export default function NewsCard({ title, excerpt, category, isLocked }: NewsCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card group cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
          {category}
        </span>
        {isLocked && (
          <span className="text-gray-500">🔒</span>
        )}
      </div>
      
      <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      
      <p className={`text-gray-400 text-sm leading-relaxed ${isLocked ? 'blur-sm select-none' : ''}`}>
        {excerpt}
      </p>

      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end justify-center pb-8 px-6 text-center">
          <div className="space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-tighter">Contenido Exclusivo</p>
            <button className="text-[10px] font-black text-cyan-400 border border-cyan-400/30 px-4 py-2 rounded-full hover:bg-cyan-400 hover:text-black transition-all">
              SUSCRÍBETE PARA LEER
            </button>
          </div>
        </div>
      )}

      {!isLocked && (
        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Leer análisis completo <span>→</span>
        </div>
      )}
    </motion.div>
  );
}
