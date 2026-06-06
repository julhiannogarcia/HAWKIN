'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Zap, Building2, LoaderCircle } from 'lucide-react';
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
      setLoading(true);
      try {
        const zone = TYPE_MAP[type] || "TOP_BANNER";
        
        // Usamos un endpoint neutral para evitar bloqueadores
        const res = await fetch(`/api/promotions?placement=${zone}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPromo(data[Math.floor(Math.random() * data.length)]);
            setLoading(false);
            return;
          }
        }
        
        // FALLBACK INSTITUCIONAL (Siempre visible)
        setPromo({
          id: "hawkin-academy-default",
          companyName: "HAWKIN ACADEMY",
          bannerUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
          targetUrl: "/academy"
        });

      } catch (e) {
        setPromo({
          id: "hawkin-emergency",
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

  if (loading) {
    return <div className="w-full h-40 bg-white/[0.01] animate-pulse rounded-[30px]" />;
  }

  const handleInteraction = () => {
    if (promo?.targetUrl) window.open(promo.targetUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={handleInteraction}
      className={`relative w-full ${type === 'inline' ? 'h-96' : 'min-h-[300px] md:min-h-[500px]'} rounded-[50px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-[#050505]`}
    >
      <img 
        src={promo.bannerUrl} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s] opacity-70 group-hover:opacity-100" 
        alt="Sponsor Content" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
         <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">{promo.companyName}</h4>
         <div className="flex items-center gap-3 mt-3">
            <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
               <p className="text-cyan-400 text-[8px] font-black uppercase tracking-[0.3em]">Socio Patrocinador</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
         </div>
      </div>
    </motion.div>
  );
}
