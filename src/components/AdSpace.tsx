'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Laptop, Shirt, ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  isPremium: boolean;
  type?: 'banner' | 'inline' | 'sidebar';
}

export default function AdSpace({ isPremium, type = 'banner' }: AdSpaceProps) {
  // REGLA DE ORO: Si es premium, no hay anuncios.
  if (isPremium) return null;

  const ads = [
    { 
      title: 'Nueva Colección Elite Style', 
      desc: 'Tienda de Ropa HAWKIN. 20% OFF Socios.', 
      icon: <Shirt className="text-purple-400" />,
      color: 'from-purple-500/10'
    },
    { 
      title: 'MacBook M5 Pro en Oferta', 
      desc: 'Laptops de última generación. Envío gratis.', 
      icon: <Laptop className="text-cyan-400" />,
      color: 'from-cyan-500/10'
    },
    { 
      title: 'Smartphones IA 2026', 
      desc: 'Lo nuevo de Samsung y Apple está aquí.', 
      icon: <ShoppingBag className="text-green-500" />,
      color: 'from-green-500/10'
    }
  ];

  const ad = ads[Math.floor(Math.random() * ads.length)];

  if (type === 'inline') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className={`my-12 p-8 rounded-[40px] border border-white/5 bg-gradient-to-br ${ad.color} to-transparent flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer hover:border-white/10 transition-all`}
      >
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center shadow-xl">
            {ad.icon}
          </div>
          <div>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2 block">Anuncio Patrocinado</span>
            <h4 className="text-xl font-black text-white uppercase italic">{ad.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{ad.desc}</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">
          Ver Tienda <ExternalLink size={14} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-24 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden group hover:border-cyan-500/30 transition-all cursor-pointer">
      <span className="absolute top-2 right-4 text-[7px] uppercase tracking-[0.3em] text-gray-700 font-black">HAWKIN Ads Network</span>
      <div className="text-gray-600 font-black tracking-tighter text-lg group-hover:text-cyan-400 transition-colors uppercase italic flex items-center gap-4">
        {ad.icon} {ad.title}
      </div>
    </div>
  );
}
