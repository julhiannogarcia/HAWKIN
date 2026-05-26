'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Lock } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  isLocked: boolean;
  image?: string;
  date: string;
  author: string;
}

export default function NewsCard({ id, title, excerpt, category, isLocked, image, date, author }: NewsCardProps) {
  return (
    <Link href={`/news/${id}`}>
      <motion.div 
        whileHover={{ y: -8 }}
        className="glass-card group cursor-pointer relative overflow-hidden h-full flex flex-col p-0 border-white/5 hover:border-cyan-500/40 transition-all duration-500"
      >
        {/* Imagen de Cabecera Purificada (Sin iconos falsos) */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-900">
          <img 
            src={image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <span className={`text-[8px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full shadow-lg ${
              category === 'GOLD' ? 'bg-[#FFD700] text-black' : 'bg-cyan-600'
            }`}>
              {category}
            </span>
          </div>
        </div>

        <div className="p-7 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">
            <span className="text-cyan-400">✦</span> {date} • {author}
          </div>
          
          <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2 italic uppercase tracking-tighter">
            {title}
          </h3>
          
          <p className={`text-gray-400 text-xs leading-relaxed line-clamp-3 font-light ${isLocked ? 'blur-[0.5px] select-none opacity-40' : ''}`}>
            {excerpt}
          </p>

          <div className="mt-auto pt-8 flex justify-between items-center border-t border-white/5 mt-6">
            <div className="flex items-center gap-3 text-[9px] font-black text-white uppercase tracking-[0.3em]">
              {isLocked ? 'Acceso Socio' : 'Analizar'} <span className="text-cyan-400">→</span>
            </div>
            {isLocked && (
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 transition-all">
                <Lock size={12} className="text-gray-500 group-hover:text-cyan-400" />
              </div>
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
