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

  const isVideo = promo.bannerUrl?.match(/\.(mp4|webm|ogg)$/i) || promo.bannerUrl?.includes('vimeo') || promo.bannerUrl?.includes('youtube');

  const renderMedia = () => {
    if (isVideo) {
      if (promo.bannerUrl.includes('vimeo.com')) {
        const id = promo.bannerUrl.split('/').pop()?.split('?')[0];
        return (
          <iframe 
            src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        );
      }
      if (promo.bannerUrl.includes('youtube.com') || promo.bannerUrl.includes('youtu.be')) {
        let id = '';
        if (promo.bannerUrl.includes('v=')) id = promo.bannerUrl.split('v=')[1].split('&')[0];
        else id = promo.bannerUrl.split('/').pop() || '';
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
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={promo.bannerUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <img 
        src={promo.bannerUrl} 
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
        alt={promo.companyName} 
      />
    );
  };

  return (
    <div 
      onClick={() => promo.targetUrl && window.open(promo.targetUrl, '_blank')}
      className={`relative w-full ${type === 'inline' ? 'h-96' : 'min-h-[300px] md:min-h-[450px]'} rounded-[50px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-black`}
    >
      {renderMedia()}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
         <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">{promo.companyName}</h4>
         <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Socio Patrocinador</p>
      </div>
    </div>
  );
}
