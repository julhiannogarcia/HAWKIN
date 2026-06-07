'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SponsorSpaceProps {
  isPremium: boolean;
  type?: 'banner' | 'inline' | 'sidebar' | 'video-hero';
}

const TYPE_MAP: Record<string, string> = {
  'banner': 'TOP_BANNER',
  'inline': 'NEWS_FEED',
  'sidebar': 'SIDEBAR',
  'video-hero': 'TOP_BANNER'
};

export default function SponsorSpace({ isPremium, type = 'banner' }: SponsorSpaceProps) {
  const [promo, setPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    if (isPremium) return;

    const fetchPromo = async () => {
      try {
        const zone = TYPE_MAP[type] || "TOP_BANNER";
        // Nueva ruta indetectable para AdBlockers
        const res = await fetch(`/api/v1/internal/content?placement=${zone}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setPromo(data[Math.floor(Math.random() * data.length)]);
        } else {
          // Fallback institucional maestro (IMAGEN LOCAL O UNPLASH GARANTIZADA)
          setPromo({
            id: "fallback",
            companyName: "HAWKIN ACADEMY",
            bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
            targetUrl: "/academy"
          });
        }
      } catch (e) {
        setPromo({
          id: "error",
          companyName: "HAWKIN INTELLIGENCE",
          bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
          targetUrl: "/"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, [isPremium, type]);

  if (isPremium || !promo) return null;

  // PROXY DE IMAGEN PARA EVITAR BLOQUEOS DE HOTLINKING (FONDO NEGRO)
  const getSecureUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('vimeo.com') || url.match(/\.(mp4|webm|ogg)$/i)) return url;
    if (url.startsWith('/') || url.startsWith('logos/')) return url.startsWith('/') ? url : `/${url}`;
    
    // Forzamos el paso por proxy para cualquier link externo (como el de Pepsi)
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1920&fit=cover`;
  };

  const finalUrl = getSecureUrl(promo.bannerUrl);
  const isVideo = finalUrl.match(/\.(mp4|webm|ogg)$/i) || finalUrl.includes('vimeo') || finalUrl.includes('youtube');

  const renderMedia = () => {
    if (mediaError) {
      return <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />;
    }

    if (isVideo) {
      if (finalUrl.includes('vimeo.com')) {
        const id = finalUrl.split('/').pop()?.split('?')[0];
        return (
          <iframe 
            src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`}
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
            frameBorder="0" allow="autoplay; fullscreen"
          />
        );
      }
      if (finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be')) {
        let id = '';
        if (finalUrl.includes('v=')) id = finalUrl.split('v=')[1].split('&')[0];
        else id = finalUrl.split('/').pop() || '';
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
            frameBorder="0" allow="autoplay; fullscreen"
          />
        );
      }
      return (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={finalUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <img 
        src={finalUrl} 
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-[10s] group-hover:scale-105" 
        alt={promo.companyName} 
        onError={() => setMediaError(true)}
      />
    );
  };

  return (
    <div 
      onClick={() => promo.targetUrl && window.open(promo.targetUrl, '_blank')}
      className={`relative w-full ${type === 'inline' ? 'h-[450px]' : 'min-h-[300px] md:min-h-[500px]'} rounded-[50px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-[#050505] transition-all hover:border-cyan-500/30`}
    >
      {renderMedia()}
      
      {/* CAPA DE SOMBRA PARA VISIBILIDAD DE TEXTO */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-12 md:p-16">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h4 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">
               {promo.companyName}
            </h4>
            <div className="flex items-center gap-4">
               <div className="px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Socio Patrocinador</p>
               </div>
               <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_20px_#06b6d4]" />
            </div>
         </motion.div>
      </div>
    </div>
  );
}
