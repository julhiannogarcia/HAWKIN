'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { getSecureImageUrl, getVimeoEmbedId, getYoutubeEmbedId, getYoutubeStartSeconds, buildYoutubeEmbedUrl, isVideoUrl, isSocialMediaUrl } from '@/lib/adMediaUtils';

interface SponsorSpaceProps {
  isPremium: boolean;
  type?: 'banner' | 'inline' | 'sidebar' | 'video-hero';
}

const TYPE_MAP: Record<string, string> = {
  banner: 'TOP_BANNER',
  inline: 'NEWS_FEED',
  sidebar: 'SIDEBAR',
  'video-hero': 'TOP_BANNER',
};

async function trackAdMetric(id: string, type: 'view' | 'click') {
  if (!id || id.startsWith('fallback') || id.startsWith('err-') || id.includes('default')) return;
  try {
    await fetch('/api/v1/internal/content/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
    });
  } catch {
    // Silencioso: no bloquear la experiencia del usuario
  }
}

export default function SponsorSpace({ isPremium, type = 'banner' }: SponsorSpaceProps) {
  const [promo, setPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const viewTracked = useRef(false);

  useEffect(() => {
    if (isPremium) return;

    const fetchPromo = async () => {
      try {
        const zone = TYPE_MAP[type] || 'TOP_BANNER';
        const res = await fetch(`/api/v1/internal/content?placement=${zone}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setPromo(data[Math.floor(Math.random() * data.length)]);
        } else {
          setPromo({
            id: 'fallback',
            companyName: 'HAWKIN ACADEMY',
            bannerUrl:
              'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000',
            targetUrl: '/academy',
          });
        }
      } catch {
        setPromo({
          id: 'error',
          companyName: 'HAWKIN INTELLIGENCE',
          bannerUrl:
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000',
          targetUrl: '/',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, [isPremium, type]);

  useEffect(() => {
    if (!promo?.id || viewTracked.current) return;
    viewTracked.current = true;
    trackAdMetric(promo.id, 'view');
  }, [promo?.id]);

  if (isPremium || loading || !promo) return null;

  const finalUrl = isVideoUrl(promo.bannerUrl) || isSocialMediaUrl(promo.bannerUrl)
    ? promo.bannerUrl
    : getSecureImageUrl(promo.bannerUrl);
  const isVideo = isVideoUrl(promo.bannerUrl);
  const isSocial = isSocialMediaUrl(promo.bannerUrl);

  const renderMedia = () => {
    if (mediaError) {
      return <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />;
    }

    if (isSocial) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-black to-cyan-900/40 flex items-center justify-center">
          <div className="text-center space-y-4 px-8">
            <p className="text-6xl">📱</p>
            <p className="text-xl font-black text-white uppercase italic">Ver en redes sociales</p>
            <p className="text-[10px] text-cyan-400 uppercase tracking-widest">Toca para abrir el enlace</p>
          </div>
        </div>
      );
    }

    if (isVideo) {
      const youtubeId = getYoutubeEmbedId(promo.bannerUrl);
      if (youtubeId) {
        const start = getYoutubeStartSeconds(promo.bannerUrl);
        return (
          <iframe
            src={buildYoutubeEmbedUrl(youtubeId, { start })}
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
            allow="autoplay; encrypted-media; fullscreen"
            title={promo.companyName}
          />
        );
      }

      const vimeoId = getVimeoEmbedId(promo.bannerUrl);
      if (vimeoId) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`}
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
            allow="autoplay; fullscreen"
            title={promo.companyName}
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

  const handleClick = () => {
    trackAdMetric(promo.id, 'click');
    const dest = isSocial ? promo.bannerUrl : promo.targetUrl;
    if (dest) window.open(dest, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-full ${type === 'inline' ? 'h-[450px]' : 'min-h-[300px] md:min-h-[500px]'} rounded-[50px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-[#050505] transition-all hover:border-cyan-500/30`}
    >
      {renderMedia()}

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
