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
        const res = await fetch(`/api/promotions?placement=${zone}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Seleccionamos uno aleatorio
          setPromo(data[Math.floor(Math.random() * data.length)]);
        } else {
          // Fallback institucional si no hay datos
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

  // Normalización y Blindaje de URL
  const getSecureMediaUrl = (url: string) => {
    if (!url) return '';
    
    // 1. Si es video MP4 o embebido, pasar directo
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('vimeo') || url.includes('youtube');
    if (isVideo) return url;

    // 2. Si es una ruta local, pasar directo
    if (url.startsWith('/') || url.startsWith('logos/')) {
        return url.startsWith('/') ? url : `/${url}`;
    }

    // 3. PROXY MAESTRO (weserv.nl): Rompe cualquier bloqueo de hotlinking
    // Esto es lo que soluciona el fondo negro de Pepsi
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1920&fit=cover&error=https://images.unsplash.com/photo-1451187580459-43490279c0fa`;
  };

  const cleanUrl = getSecureMediaUrl(promo.bannerUrl);
  const isVideo = cleanUrl.match(/\.(mp4|webm|ogg)$/i) || cleanUrl.includes('vimeo') || cleanUrl.includes('youtube');

  const renderMedia = () => {
    if (mediaError) {
      return (
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-30" 
          alt="System Fallback" 
        />
      );
    }

    if (isVideo) {
      if (cleanUrl.includes('vimeo.com')) {
        const id = cleanUrl.split('/').pop()?.split('?')[0];
        return (
          <iframe 
            src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        );
      }
      if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
        let id = '';
        if (cleanUrl.includes('v=')) id = cleanUrl.split('v=')[1].split('&')[0];
        else id = cleanUrl.split('/').pop() || '';
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        );
      }
      return (
        <video 
          autoPlay loop muted playsInline 
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setMediaError(true)}
        >
          <source src={cleanUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <img 
        src={cleanUrl} 
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
        alt={promo.companyName} 
        onError={() => setMediaError(true)}
      />
    );
  };

  return (
    <div 
      onClick={() => promo.targetUrl && window.open(promo.targetUrl, '_blank')}
      className={`relative w-full ${type === 'inline' ? 'h-96' : 'min-h-[300px] md:min-h-[450px]'} rounded-[50px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-black transition-all hover:border-cyan-500/20`}
    >
      {renderMedia()}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
         <h4 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">
           {promo.companyName}
         </h4>
         <div className="flex items-center gap-3 mt-4">
            <div className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full">
               <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Socio Patrocinador</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_15px_#06b6d4]" />
         </div>
      </div>
    </div>
  );
}
