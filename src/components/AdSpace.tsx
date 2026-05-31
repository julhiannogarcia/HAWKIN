'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Laptop, Shirt, ExternalLink, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdSpaceProps {
  isPremium: boolean;
  type?: 'banner' | 'inline' | 'sidebar';
}

const TYPE_MAP: Record<string, string> = {
  'banner': 'TOP_BANNER',
  'inline': 'NEWS_FEED',
  'sidebar': 'SIDEBAR'
};

export default function AdSpace({ isPremium, type = 'banner' }: AdSpaceProps) {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPremium) return;

    const fetchAd = async () => {
      try {
        const placement = TYPE_MAP[type];
        const res = await fetch(`/api/ads?placement=${placement}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Seleccionar uno al azar si hay varios
          setAd(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (e) {
        console.error("Ad fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [isPremium, type]);

  const handleAdClick = async () => {
    if (!ad?.id) return;
    
    // Abrir URL en nueva pestaña
    if (ad.targetUrl) window.open(ad.targetUrl, '_blank');

    // Registrar clic en DB (sin esperar para no bloquear)
    fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ad.id })
    }).catch(console.error);
  };

  // REGLA DE ORO: Si es premium o no hay ad, no mostramos nada
  if (isPremium || !ad) return null;

  if (type === 'inline') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        onClick={handleAdClick}
        className="my-12 p-8 rounded-[40px] border border-white/5 bg-[#050505] flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform"><Zap size={100} className="text-blue-500" /></div>
        
        <div className="flex items-center gap-8 text-center md:text-left relative z-10">
          <div className="w-24 h-24 bg-black rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center shrink-0">
            {ad.bannerUrl ? (
              <img src={ad.bannerUrl} alt="Ad" className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag className="text-blue-500" size={32} />
            )}
          </div>
          <div>
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2 block">Socio Alpha Patrocinador</span>
            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{ad.companyName}</h4>
            <p className="text-gray-500 text-xs mt-2 uppercase font-bold tracking-widest">Publicidad de Impacto HAWKIN</p>
          </div>
        </div>
        
        <button className="flex items-center gap-4 px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl relative z-10">
          ACCEDER AHORA <ExternalLink size={14} />
        </button>
      </motion.div>
    );
  }

  // Estilo Banner o Sidebar simplificado
  return (
    <div 
      onClick={handleAdClick}
      className="w-full h-24 bg-[#080808] border border-white/5 rounded-2xl flex items-center justify-between px-8 overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer relative shadow-xl"
    >
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
            {ad.bannerUrl ? <img src={ad.bannerUrl} className="w-full h-full object-cover" /> : <Zap className="text-blue-500" size={16} />}
         </div>
         <div className="flex flex-col">
            <span className="text-[7px] uppercase tracking-[0.3em] text-gray-700 font-black">Partner B2B</span>
            <span className="text-sm font-black text-gray-400 group-hover:text-blue-400 transition-colors uppercase italic">{ad.companyName}</span>
         </div>
      </div>
      <div className="hidden sm:block">
         <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase text-gray-500 group-hover:bg-white group-hover:text-black transition-all">Ver Más</button>
      </div>
    </div>
  );
}
