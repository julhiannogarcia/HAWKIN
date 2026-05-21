'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Lock, PlayCircle } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  isLocked: boolean;
  image?: string;
  date: string;
  author: string;
  hasVideo?: boolean;
}

export default function NewsCard({ id, title, excerpt, category, isLocked, image, date, author, hasVideo }: NewsCardProps) {
  return (
    <Link href={`/news/${id}`}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="glass-card group cursor-pointer relative overflow-hidden h-full flex flex-col p-0 border-white/5 hover:border-cyan-500/40 transition-all duration-500"
      >
        {/* Imagen de Cabecera con Badge de Video */}
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="text-white/80 group-hover:text-cyan-400 transition-colors" size={48} />
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-white bg-cyan-600 px-2 py-1 rounded shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              {category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">
            <Clock size={10} className="text-cyan-500" /> {date} • {author}
          </div>
          
          <h3 className="text-lg font-bold mb-3 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className={`text-gray-400 text-xs leading-relaxed line-clamp-3 ${isLocked ? 'blur-[1px] select-none opacity-50' : ''}`}>
            {excerpt}
          </p>

          <div className="mt-auto pt-6 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-[0.2em]">
              {isLocked ? 'Desbloquear' : 'Leer más'} <span className="text-cyan-400">→</span>
            </div>
            {isLocked && (
              <Lock size={14} className="text-gray-600" />
            )}
          </div>
        </div>

        {isLocked && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </motion.div>
    </Link>
  );
}
