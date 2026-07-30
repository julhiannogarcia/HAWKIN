'use client';

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

const TYPE_STYLES: Record<
  NonNullable<SponsorSpaceProps['type']>,
  { container: string; padding: string; title: string; label: string }
> = {
  banner: {
    container: 'min-h-[240px] md:min-h-[340px] rounded-[32px]',
    padding: 'px-4 pb-3 pt-2',
    title: 'text-lg md:text-xl',
    label: 'text-[8px]',
  },
  inline: {
    container: 'h-[360px] md:h-[400px] rounded-[32px]',
    padding: 'px-5 pb-3 pt-2',
    title: 'text-lg md:text-xl',
    label: 'text-[8px]',
  },
  sidebar: {
    container: 'h-[120px] md:h-[140px] rounded-2xl',
    padding: 'px-3 pb-2 pt-1',
    title: 'text-[9px]',
    label: 'text-[7px]',
  },
  'video-hero': {
    container: 'min-h-[240px] md:min-h-[340px] rounded-[32px]',
    padding: 'px-4 pb-3 pt-2',
    title: 'text-[11px] md:text-xs',
    label: 'text-[8px]',
  },
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
            className="absolute inset-0 w-full h-full pointer-events-none"
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
            className="absolute inset-0 w-full h-full pointer-events-none"
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

  const styles = TYPE_STYLES[type];

  return (
    <div
      onClick={handleClick}
      className={`relative w-full ${styles.container} overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-[#050505] transition-all hover:border-cyan-500/30`}
    >
      {renderMedia()}

      <div className="absolute bottom-0 left-0 right-0 h-[10%] min-h-[28px] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      <div className={`absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 ${styles.padding}`}>
        <p className={`${styles.title} font-bold text-white/90 uppercase tracking-wide truncate leading-tight`}>
          {promo.companyName}
        </p>
        <span className={`${styles.label} shrink-0 font-bold uppercase tracking-[0.2em] text-white/40`}>
          Patrocinador
        </span>
      </div>
    </div>
  );
}
