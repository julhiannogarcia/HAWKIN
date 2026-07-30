'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import { Globe, Coins, ShieldAlert, Laptop, ChevronDown, LoaderCircle, Radio } from 'lucide-react';

const REFRESH_MS = 120_000;

export default function LiveFeed() {
  const [activeTab, setActiveTab] = useState<'radar' | 'gold'>('radar');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [lastSync, setLastSync] = useState<string>('—');

  useEffect(() => {
    let mounted = true;

    const fetchNews = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const endpoint = activeTab === 'radar' ? '/api/news/live' : '/api/news/gold';
        const res = await fetch(endpoint, { cache: 'no-store' });
        const data = await res.json();
        if (!mounted) return;
        setNews(Array.isArray(data) ? data : (data.news || []));
        setLastSync(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.error('Feed Error:', e);
      } finally {
        if (mounted && !silent) setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(() => fetchNews(true), REFRESH_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeTab]);

  const loadMore = () => setVisibleCount((prev) => prev + 3);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex bg-white/5 p-2 rounded-[30px] w-fit border border-white/5">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-8 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'radar' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'text-gray-500 hover:text-white'}`}
          >
            <Globe size={14} /> Radar Global
          </button>
          <button
            onClick={() => setActiveTab('gold')}
            className={`px-8 py-4 rounded-[25px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'gold' ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'text-gray-500 hover:text-white'}`}
          >
            <Coins size={14} /> Gold Intel
          </button>
        </div>
        <div className="flex items-center gap-2 text-cyan-500/80">
          <Radio size={12} className="animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest">En vivo • Sync {lastSync}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-6">
          <LoaderCircle className="animate-spin text-cyan-500" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 animate-pulse">Interceptando flujos de datos...</p>
        </div>
      ) : news.length === 0 ? (
        <div className="py-40 text-center space-y-6 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[60px]">
          <ShieldAlert className="mx-auto text-gray-800" size={48} />
          <p className="text-sm font-black text-gray-600 uppercase tracking-widest">No se detectan señales en este cuadrante.</p>
          <button onClick={() => window.location.reload()} className="text-[10px] underline font-black uppercase text-cyan-500">Forzar Escaneo</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {news.slice(0, visibleCount).map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <NewsCard {...item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {news.length > visibleCount && !loading && (
        <div className="flex justify-center pt-12">
          <button onClick={loadMore} className="group flex flex-col items-center gap-4 text-gray-600 hover:text-cyan-400 transition-colors">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cargar más reportes</span>
            <ChevronDown className="animate-bounce group-hover:text-cyan-400" />
          </button>
        </div>
      )}

      <div className="pt-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Radar en vivo</span>
            </div>
            <div className="flex items-center gap-2 text-blue-500">
              <Laptop size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Refresh cada 2 min</span>
            </div>
          </div>
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
            CEOs • IA • Millonarios • Global • {activeTab === 'radar' ? 'Radar Activo' : 'Gold Intelligence'}
          </p>
        </div>
      </div>
    </div>
  );
}
