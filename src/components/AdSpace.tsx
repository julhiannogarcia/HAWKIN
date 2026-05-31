'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Zap, Building2, Volume2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdSpaceProps {
  isPremium: boolean;
  type?: 'banner' | 'inline' | 'sidebar' | 'video-hero';
}

const TYPE_MAP: Record<string, string> = {
  'banner': 'TOP_BANNER',
  'inline': 'NEWS_FEED',
  'sidebar': 'SIDEBAR',
  'video-hero': 'TOP_BANNER'
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
    // Detección mejorada de video: MP4 directo o enlaces de servicios que el navegador puede renderizar
    return url.toLowerCase().match(/\.(mp4|webm|ogg)$/) || url.includes('video') || url.includes('vimeo') || url.includes('googlevideo');
  };

  if (isPremium) return null;

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

  // FORMATO 1: PLUS STREAMING (LIMPIO DE BRANDING HAWKIN)
  if (type === 'banner' || type === 'video-hero') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={handleAdClick}
        className="relative w-full min-h-[500px] md:min-h-[600px] rounded-[60px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5"
      >
        {/* Fondo Publicitario Directo */}
        {isVideo(ad.bannerUrl) ? (
          <div className="absolute inset-0 bg-black">
             <video 
               autoPlay loop muted playsInline 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
               onCanPlay={(e) => console.log("Video listo")}
               onError={(e) => console.error("Error al cargar video publicitario:", ad.bannerUrl)}
             >
               <source src={ad.bannerUrl} type="video/mp4" />
               Tu navegador no soporta el video.
             </video>
          </div>
        ) : (
          <img src={ad.bannerUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" alt="Ad Banner" />
        )}
        
        {/* Overlay invisible para permitir clics pero proteger diseño */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:bg-black/10 transition-colors" />

        {/* Solo mostramos el nombre de la empresa de forma muy discreta si no hay imagen descriptiva */}
        <div className="absolute bottom-12 left-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
           <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">
             {ad.companyName}
           </h4>
        </div>
      </motion.div>
    );
  }

  // FORMATO 2: NATIVE (LIMPIO)
  if (type === 'inline') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={handleAdClick}
        className="w-full h-96 rounded-[50px] overflow-hidden border-2 border-white/5 hover:border-blue-500/40 transition-all cursor-pointer relative group shadow-2xl my-16"
      >
        {isVideo(ad.bannerUrl) ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover"><source src={ad.bannerUrl} /></video>
        ) : (
          <img src={ad.bannerUrl} alt="Ad" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">{ad.companyName}</h4>
           <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Socio Patrocinador</p>
        </div>
      </motion.div>
    );
  }

  // FORMATO 3: SIDEBAR (LIMPIO)
  return (
    <div 
      onClick={handleAdClick}
      className="w-full aspect-square bg-black border border-white/5 rounded-3xl overflow-hidden group hover:border-blue-500/40 transition-all cursor-pointer relative shadow-xl"
    >
      {isVideo(ad.bannerUrl) ? (
         <video autoPlay loop muted playsInline className="w-full h-full object-cover"><source src={ad.bannerUrl} /></video>
      ) : (
         <img src={ad.bannerUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Sidebar Ad" />
      )}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
    </div>
  );
}
