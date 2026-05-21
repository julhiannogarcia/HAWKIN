'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  isLocked: boolean;
}

export default function NewsCard({ id, title, excerpt, category, isLocked }: NewsCardProps) {
  return (
    <Link href={`/news/${id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass-card group cursor-pointer relative overflow-hidden h-full flex flex-col"
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

        <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {isLocked ? 'Desbloquear Análisis' : 'Leer análisis completo'} <span>→</span>
        </div>

        {isLocked && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        )}
      </motion.div>
    </Link>
  );
}
