'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import AdSpace from '@/components/AdSpace';
import { Globe, Coins, ShieldAlert, Laptop, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function LiveFeed() {
  const { user } = useAlpha();
  const [activeTab, setActiveTab] = useState<'radar' | 'gold'>('radar');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const endpoint = activeTab === 'radar' ? '/api/news/live' : '/api/news/gold';
        const res = await fetch(endpoint);
        const data = await res.json();
        setNews(Array.isArray(data) ? data : (data.news || []));
      } catch (e) {
        console.error("Feed Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeTab]);

  const loadMore = () => setVisibleCount(prev => prev + 3);

  const currentItems = news;

  return (
    <div className="space-y-12">
      {/* TABS TÁCTICOS */}
      <div className="flex bg-white/5 p-2 rounded-[30px] w-fit mx-auto md:mx-0 border border-white/5">
        <button 
          onClick={() => { setActiveTab('radar'); setLoading(true); }}
          className={`px-8 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'radar' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'text-gray-500 hover:text-white'}`}
        >
          <Globe size={14} /> Radar Global
        </button>
        <button 
          onClick={() => { setActiveTab('gold'); setLoading(true); }}
          className={`px-8 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'gold' ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'text-gray-500 hover:text-white'}`}
        >
          <Coins size={14} /> Gold Intel
        </button>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-6">
           <Loader2 className="animate-spin text-cyan-500" size={40} />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 animate-pulse">Interceptando flujos de datos...</p>
        </div>
      ) : (
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
      )}

      {currentItems.length > visibleCount && !loading && (
        <div className="flex justify-center pt-12">
          <button 
            onClick={loadMore}
            className="group flex flex-col items-center gap-4 text-gray-600 hover:text-cyan-400 transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cargar más reportes</span>
            <ChevronDown className="animate-bounce group-hover:text-cyan-400" />
          </button>
        </div>
      )}

      {/* ESTADO DE CONEXIÓN */}
      <div className="pt-20 border-t border-white/5">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Servidor: Operativo</span>
               </div>
               <div className="flex items-center gap-2 text-blue-500">
                  <Laptop size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Nodo: Lima-Alpha-1</span>
               </div>
            </div>
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
              Sincronizado con el flujo de capital real • {activeTab === 'radar' ? 'Radar Activo' : 'Gold Intelligence Activa'}
            </p>
         </div>
      </div>
    </div>
  );
}
