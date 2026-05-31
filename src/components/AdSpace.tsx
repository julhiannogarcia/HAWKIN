'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Zap, Building2, Volume2, Loader2, Play } from 'lucide-react';
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

  const getUrlType = (url: string) => {
    if (!url) return 'none';
    const u = url.toLowerCase();
    if (u.match(/\.(mp4|webm|ogg)$/)) return 'direct-video';
    if (u.includes('youtube.com/watch') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('vimeo.com')) return 'vimeo';
    if (u.match(/\.(jpg|jpeg|png|webp|gif|svg)$/) || u.includes('images.unsplash')) return 'image';
    return 'unknown';
  };

  const getYouTubeEmbed = (url: string) => {
    let id = '';
    if (url.includes('v=')) id = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1`;
  };

  const getVimeoEmbed = (url: string) => {
    const id = url.split('vimeo.com/')[1].split('?')[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`;
  };

  if (isPremium) return null;

  if (!ad && !loading) {
    return (
      <div className={`w-full ${type === 'inline' ? 'my-12 p-8 h-40' : 'h-24'} bg-white/[0.01] border border-dashed border-white/5 rounded-[30px] flex items-center justify-center group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden`}>
         <a href="/b2b" className="flex items-center gap-4 text-gray-700 group-hover:text-blue-500 transition-colors">
            <Building2 size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Reserva este espacio de alto impacto</span>
            <ExternalLink size={12} />
         </a>
      </div>
    );
  }

  if (loading) return null;

  const urlType = getUrlType(ad.bannerUrl);

  const renderBackground = () => {
    switch (urlType) {
      case 'direct-video':
        return (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]">
            <source src={ad.bannerUrl} type="video/mp4" />
          </video>
        );
      case 'youtube':
        return (
          <iframe 
            src={getYouTubeEmbed(ad.bannerUrl)}
            className="absolute inset-0 w-full h-[150%] -top-[25%] pointer-events-none group-hover:scale-105 transition-transform duration-[10s]"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        );
      case 'vimeo':
        return (
          <iframe 
            src={getVimeoEmbed(ad.bannerUrl)}
            className="absolute inset-0 w-full h-full pointer-events-none group-hover:scale-105 transition-transform duration-[10s]"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        );
      case 'image':
      default:
        return <img src={ad.bannerUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" alt="Ad Banner" />;
    }
  };

  // FORMATO 1: PLUS STREAMING
  if (type === 'banner' || type === 'video-hero') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={handleAdClick}
        className="relative w-full min-h-[500px] md:min-h-[600px] rounded-[60px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-black"
      >
        {renderBackground()}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:bg-black/10 transition-colors" />

        <div className="absolute bottom-12 left-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
           <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">
             {ad.companyName}
           </h4>
        </div>

        {/* Indicador de Video en Vivo si aplica */}
        {(urlType === 'direct-video' || urlType === 'youtube' || urlType === 'vimeo') && (
          <div className="absolute top-8 right-8 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-xl">
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
             <span className="text-[8px] font-black text-white uppercase tracking-widest">LIVE STREAM</span>
          </div>
        )}
      </motion.div>
    );
  }

  // FORMATO 2: NATIVE
  if (type === 'inline') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={handleAdClick}
        className="w-full h-96 rounded-[50px] overflow-hidden border-2 border-white/5 hover:border-blue-500/40 transition-all cursor-pointer relative group shadow-2xl my-16 bg-black"
      >
        {renderBackground()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">{ad.companyName}</h4>
           <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Socio Patrocinador</p>
        </div>
      </motion.div>
    );
  }

  // FORMATO 3: SIDEBAR
  return (
    <div 
      onClick={handleAdClick}
      className="w-full aspect-square bg-black border border-white/5 rounded-3xl overflow-hidden group hover:border-blue-500/40 transition-all cursor-pointer relative shadow-xl"
    >
      {renderBackground()}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
    </div>
  );
}
