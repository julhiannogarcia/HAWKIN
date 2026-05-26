'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import { Globe, Coins, ShieldAlert, Laptop, ChevronDown, Sparkles } from 'lucide-react';

export default function LiveFeed() {
  const [activeTab, setActiveTab] = useState<'radar' | 'gold'>('radar');
  const [data, setData] = useState<{news: any[], shield: any[], hardware: any[]}>({news: [], shield: [], hardware: []});
  const [goldNews, setGoldNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Límite inicial de noticias

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

      setLoading(false);
    } catch (e) {
      console.error("Error fetching unified news", e);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 120000); // Actualizar cada 2 min
    return () => clearInterval(interval);
  }, []);

  // Unificamos las noticias del radar general para la pestaña Radar
  const radarItems = [...data.news, ...data.hardware, ...data.shield].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const currentItems = activeTab === 'radar' ? radarItems : goldNews;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-20">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-80 bg-white/5 rounded-[40px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* NAVEGACIÓN POR PESTAÑAS (TABS) */}
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

      {/* GRID DINÁMICO DE NOTICIAS */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {currentItems.slice(0, visibleCount).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <NewsCard {...item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* BOTÓN VER MÁS / CARGAR MÁS */}
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

      {/* NOTA DE PIE DE RADAR */}
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
