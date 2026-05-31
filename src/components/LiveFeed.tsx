'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import AdSpace from '@/components/AdSpace';
import { Globe, Coins, ShieldAlert, Laptop, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function LiveFeed() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'radar' | 'gold'>('radar');
  const [data, setData] = useState<{news: any[], shield: any[], hardware: any[]}>({news: [], shield: [], hardware: []});
  const [goldNews, setGoldNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); 

  const fetchAllData = async () => {
    try {
      // 1. Noticias Generales (Radar, Shield, Hardware)
      const resLive = await fetch('/api/news/live');
      const jsonLive = await resLive.json();
      setData(jsonLive);

      // 2. Noticias GOLD
      const resGold = await fetch('/api/news/gold');
      const jsonGold = await resGold.json();
      setGoldNews(jsonGold.news || []);
    } catch (e) {
      console.error("Error fetching unified news", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 120000); 
    return () => clearInterval(interval);
  }, []);

  // Blindaje contra datos nulos o indefinidos
  const radarItems = [
    ...(data?.news || []),
    ...(data?.hardware || []),
    ...(data?.shield || [])
  ].sort((a: any, b: any) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));

  const currentItems = activeTab === 'radar' ? radarItems : goldNews;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando Radar Inteligente...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button 
          onClick={() => { setActiveTab('radar'); setVisibleCount(6); }}
          className={`flex items-center gap-3 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
            activeTab === 'radar' 
              ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
              : 'bg-white/5 text-gray-500 hover:bg-white/10'
          }`}
        >
          <Globe size={14} /> Radar Global
        </button>
        <button 
          onClick={() => { setActiveTab('gold'); setVisibleCount(6); }}
          className={`flex items-center gap-3 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
            activeTab === 'gold' 
              ? 'bg-[#FFD700] text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' 
              : 'bg-white/5 text-gray-500 hover:bg-white/10'
          }`}
        >
          <Coins size={14} /> HAWKIN Gold
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {currentItems.slice(0, visibleCount).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <NewsCard {...item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {currentItems.length > visibleCount && (
        <div className="flex justify-center pt-12">
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="group flex flex-col items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-gray-600 hover:text-white transition-all"
          >
            <span>Descubrir más inteligencia</span>
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
               <ChevronDown size={20} className="group-hover:animate-bounce" />
            </div>
          </button>
        </div>
      )}

      <div className="pt-20 text-center">
         <div className="inline-flex items-center gap-3 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
            <Sparkles className="text-cyan-400" size={16} />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Sincronizado con el flujo de capital real • {activeTab === 'radar' ? 'Radar Activo' : 'Gold Intelligence Activa'}
            </p>
         </div>
      </div>
    </div>
  );
}
