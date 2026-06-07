'use client';

import { motion } from 'framer-motion';
import { Building2, Film, Image as ImageIcon, LoaderCircle } from 'lucide-react';
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
  const [retryWithProxy, setRetryWithProxy] = useState(false);

  useEffect(() => {
    if (isPremium) return;

    const fetchPromo = async () => {
      try {
        const zone = TYPE_MAP[type] || "TOP_BANNER";
        const res = await fetch(`/api/promotions?placement=${zone}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const selected = data[Math.floor(Math.random() * data.length)];
          setPromo(selected);
        } else {
          setPromo({
            id: "fallback-internal",
            companyName: "HAWKIN ACADEMY",
            bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
            targetUrl: "/academy"
          });
        }
      } catch (e) {
        setPromo({
          id: "error-fallback",
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

  if (isPremium) return null;
  if (loading) return <div className="w-full h-40 bg-white/[0.01] animate-pulse rounded-[40px] border border-white/5" />;
  if (!promo) return null;

  // Normalización de URL
  const getCleanUrl = (url: string) => {
    if (!url) return '';
    // Si es una ruta local sin slash, añadirlo
    if (!url.startsWith('http') && !url.startsWith('/')) return `/${url}`;
    return url;
  };

  const cleanBannerUrl = getCleanUrl(promo.bannerUrl);
  const isVideo = cleanBannerUrl?.match(/\.(mp4|webm|ogg)$/i) || cleanBannerUrl?.includes('vimeo') || cleanBannerUrl?.includes('youtube');

  const getProxiedUrl = (url: string) => {
    if (!url || url.startsWith('/') || url.includes('weserv.nl')) return url;
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1200&fit=cover`;
  };

  const renderMedia = () => {
    if (mediaError && !retryWithProxy && !isVideo) {
      setRetryWithProxy(true);
      setMediaError(false);
      return null;
    }

    if (mediaError && (retryWithProxy || isVideo)) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#080808] border border-white/5">
           <div className="text-center opacity-30">
              <Building2 size={60} className="mx-auto mb-4 text-cyan-500" />
              <p className="text-[10px] font-black uppercase tracking-widest">Señal de Media Caída</p>
              <p className="text-[8px] mt-2 italic text-gray-500">{cleanBannerUrl.substring(0, 30)}...</p>
           </div>
        </div>
      );
    }

    if (isVideo) {
      if (cleanBannerUrl.includes('vimeo.com')) {
        const id = cleanBannerUrl.split('/').pop()?.split('?')[0];
        return (
          <iframe 
            src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`}
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        );
      }
      if (cleanBannerUrl.includes('youtube.com') || cleanBannerUrl.includes('youtu.be')) {
        let id = '';
        if (cleanBannerUrl.includes('v=')) id = cleanBannerUrl.split('v=')[1].split('&')[0];
        else id = cleanBannerUrl.split('/').pop() || '';
        return (
          <iframe 
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
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
          <source src={cleanBannerUrl} type="video/mp4" />
        </video>
      );
    }

    return (
      <img 
        src={retryWithProxy ? getProxiedUrl(cleanBannerUrl) : cleanBannerUrl} 
        className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-all duration-[10s] group-hover:scale-105" 
        alt={promo.companyName}
        onError={() => setMediaError(true)}
      />
    );
  };

  return (
    <div 
      onClick={() => promo.targetUrl && window.open(promo.targetUrl, '_blank')}
      className={`relative w-full ${type === 'inline' ? 'h-96' : 'min-h-[300px] md:min-h-[450px]'} rounded-[50px] overflow-hidden group cursor-pointer shadow-3xl border border-white/5 bg-[#020202] transition-all hover:border-cyan-500/30`}
    >
      {renderMedia()}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6"
         >
            <h4 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
               {promo.companyName}
            </h4>
            <div className="flex items-center gap-5">
               <div className="px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Socio Patrocinador</p>
               </div>
               <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_25px_#06b6d4]" />
            </div>
         </motion.div>
      </div>

      <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="w-16 h-16 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-3xl transform group-hover:rotate-12 transition-transform">
            <ExternalLink size={28} />
         </div>
      </div>
    </div>
  );
}

function ExternalLink({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="4"/>
    </svg>
  );
}
