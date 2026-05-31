'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink, Zap, Building2, Play, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdSpaceProps {
  isPremium: boolean;
  type?: 'banner' | 'inline' | 'sidebar' | 'video-hero';
}

const TYPE_MAP: Record<string, string> = {
  'banner': 'TOP_BANNER',
  'inline': 'NEWS_FEED',
  'sidebar': 'SIDEBAR',
  'video-hero': 'TOP_BANNER' // El plan más top usa el mismo slot pero con UI diferente
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
          setAd(data[Math.floor(Math.random() * data.length)]);
        } else {
          // Fallback global si no hay en esa ubicación
          const resGlobal = await fetch(`/api/ads`);
          const dataGlobal = await resGlobal.json();
          if (Array.isArray(dataGlobal) && dataGlobal.length > 0) {
            setAd(dataGlobal[Math.floor(Math.random() * dataGlobal.length)]);
          }
        }
      } catch (e) {
        console.error("[HAWKIN ADS] Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [isPremium, type]);

  const handleAdClick = async () => {
    if (!ad?.id) return;
    if (ad.targetUrl) window.open(ad.targetUrl, '_blank');
    fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ad.id })
    }).catch(console.error);
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    return url.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url.includes('video');
  };

  if (isPremium) return null;

  // PLACEHOLDER PARA RESERVA (SÓLO SI NO HAY AD)
  if (!ad && !loading) {
    return (
      <div className={`w-full ${type === 'inline' ? 'my-12 p-8 h-40' : 'h-24'} bg-white/[0.01] border border-dashed border-white/5 rounded-[30px] flex items-center justify-center group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden`}>
         <a href="/b2b" className="flex items-center gap-4 text-gray-800 group-hover:text-blue-500 transition-colors">
            <Building2 size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Reserva este espacio de alto impacto</span>
            <ExternalLink size={12} />
         </a>
      </div>
    );
  }

  if (loading) return null;

  // FORMATO 1: PLUS STREAMING & HERO (EL MÁS GRANDE Y CARO)
  if (type === 'banner' || type === 'video-hero') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={handleAdClick}
        className="relative w-full min-h-[400px] md:min-h-[500px] rounded-[60px] overflow-hidden border border-white/10 group cursor-pointer shadow-[0_0_100px_rgba(37,99,235,0.1)]"
      >
        {/* Fondo: Video o Imagen */}
        {isVideo(ad.bannerUrl) ? (
          <video 
            autoPlay loop muted playsInline 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
          >
            <source src={ad.bannerUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={ad.bannerUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" alt="" />
        )}
        
        {/* Overlay Táctico */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        {/* Contenido de Impacto */}
        <div className="relative z-10 h-full p-12 md:p-20 flex flex-col justify-end items-start space-y-6">
           <div className="flex items-center gap-3 px-5 py-2 bg-blue-600 text-white rounded-full font-black text-[9px] uppercase tracking-[0.4em] shadow-2xl">
              <Zap size={14} fill="currentColor" /> HAWKIN Plus Partner
           </div>
           
           <div className="max-w-2xl space-y-4">
              <h4 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
                {ad.companyName}
              </h4>
              <p className="text-gray-300 text-lg md:text-xl font-light italic opacity-80 border-l-2 border-blue-500 pl-6">
                Descubre el futuro de la industria de la mano de un líder global.
              </p>
           </div>

           <div className="flex flex-wrap gap-6 pt-8">
              <button className="px-12 py-5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-4">
                 ACCESO PRIORITARIO <ArrowUpRight size={18} />
              </button>
              {isVideo(ad.bannerUrl) && (
                <div className="flex items-center gap-3 text-white/40 text-[9px] font-black uppercase tracking-widest">
                   <Volume2 size={16} /> 4K HQ STREAMING
                </div>
              )}
           </div>
        </div>

        {/* UI HUD */}
        <div className="absolute top-8 right-10 flex flex-col items-end gap-2 opacity-40">
           <div className="w-12 h-1 bg-blue-500 rounded-full" />
           <div className="w-8 h-1 bg-white/20 rounded-full" />
        </div>
      </motion.div>
    );
  }

  // FORMATO 2: NATIVE RADAR (ENTRE NOTICIAS)
  if (type === 'inline') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={handleAdClick}
        className="w-full p-12 rounded-[50px] bg-[#050505] border-2 border-white/5 hover:border-blue-500/40 transition-all cursor-pointer relative overflow-hidden group shadow-2xl my-16"
      >
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform"><Building2 size={180} className="text-blue-500" /></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="w-32 h-32 md:w-44 md:h-44 bg-black rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
            {isVideo(ad.bannerUrl) ? (
              <video autoPlay loop muted playsInline className="w-full h-full object-cover"><source src={ad.bannerUrl} /></video>
            ) : (
              <img src={ad.bannerUrl} alt="Ad" className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-4">
               <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">Patrocinador Alpha</span>
               <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Inversión B2B</span>
            </div>
            <h4 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">{ad.companyName}</h4>
            <p className="text-gray-500 text-base font-light italic max-w-xl">Esta marca está impulsando la infraestructura del ecosistema HAWKIN. Explora su propuesta de valor.</p>
            
            <button className="flex items-center gap-4 px-12 py-4 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl mx-auto md:mx-0">
              EXPLORAR SITIO <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // FORMATO 3: SIDEBAR (PEQUEÑO PERO TÁCTICO)
  return (
    <div 
      onClick={handleAdClick}
      className="w-full p-6 bg-[#080808] border border-white/5 rounded-3xl overflow-hidden group hover:border-blue-500/40 transition-all cursor-pointer relative shadow-xl space-y-4"
    >
      <div className="h-32 w-full rounded-2xl bg-black border border-white/5 overflow-hidden">
         {isVideo(ad.bannerUrl) ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover"><source src={ad.bannerUrl} /></video>
         ) : (
            <img src={ad.bannerUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
         )}
      </div>
      <div className="space-y-1">
         <span className="text-[7px] uppercase tracking-[0.3em] text-gray-700 font-black">B2B Highlight</span>
         <h5 className="text-sm font-black text-white uppercase italic">{ad.companyName}</h5>
         <button className="text-[8px] font-black text-blue-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-2">Ver Propuesta <ArrowUpRight size={10} /></button>
      </div>
    </div>
  );
}

function ArrowUpRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 7h10v10" /><path d="M7 17 17 7" />
    </svg>
  );
}
