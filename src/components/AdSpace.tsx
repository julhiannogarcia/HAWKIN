'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Zap, Building2, Volume2, LoaderCircle, Play } from 'lucide-react';
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
      setLoading(true);
      try {
        const placement = TYPE_MAP[type] || "TOP_BANNER";
        
        // 1. Intentar obtener anuncios desde la API con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const res = await fetch(`/api/ads?placement=${placement}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAd(data[Math.floor(Math.random() * data.length)]);
            setLoading(false);
            return;
          }
        }
        
        // 2. FALLBACK ULTRA-ESTABLE (IMAGEN NATIVA UNPLASH)
        setAd({
          id: "hawkin-academy-default",
          companyName: "HAWKIN ACADEMY",
          bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
          targetUrl: "/academy",
          placement: placement
        });

      } catch (e) {
        // FALLBACK DE EMERGENCIA TOTAL
        setAd({
          id: "hawkin-emergency",
          companyName: "HAWKIN INTELLIGENCE",
          bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
          targetUrl: "/",
          placement: "TOP_BANNER"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [isPremium, type]);

  const handleAdClick = () => {
    if (!ad?.id) return;
    if (ad.targetUrl) window.open(ad.targetUrl, '_blank');
  };

  if (isPremium) return null;

  if (loading) {
    return <div className="w-full h-40 bg-white/[0.01] animate-pulse rounded-[30px]" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={handleAdClick}
      className={`relative w-full ${type === 'inline' ? 'h-96' : 'min-h-[250px] md:min-h-[400px]'} rounded-[40px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-[#050505]`}
    >
      <img 
        src={ad.bannerUrl} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s] opacity-60 group-hover:opacity-100" 
        alt="Ad" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-10">
         <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{ad.companyName}</h4>
         <p className="text-cyan-400 text-[8px] font-black uppercase tracking-[0.4em] mt-2">Socio Patrocinador</p>
      </div>
    </motion.div>
  );
}
