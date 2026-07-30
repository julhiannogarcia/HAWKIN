'use client';

import React, { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import { Globe, Coins, ChevronDown, LoaderCircle, RefreshCw } from 'lucide-react';

const REFRESH_MS = 120_000;

export default function LiveFeed() {
  const [activeTab, setActiveTab] = useState<'radar' | 'gold'>('radar');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [lastSync, setLastSync] = useState<string>('—');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const fetchNews = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const endpoint = activeTab === 'radar' ? '/api/news/live' : '/api/news/gold';
        const res = await fetch(endpoint, { cache: 'no-store' });
        const data = await res.json();
        if (!mounted) return;
        const items = Array.isArray(data) ? data : data.news || [];
        setNews(items);
        setStatus(data.status || '');
        setLastSync(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));
      } catch {
        if (mounted) {
          setNews([]);
          setStatus('Sin datos nuevos');
        }
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex bg-[#0a0a0a] p-1 rounded-lg w-fit border border-white/10">
          <button
            onClick={() => { setActiveTab('radar'); setVisibleCount(6); }}
            className={`px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-colors flex items-center gap-2 ${
              activeTab === 'radar' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Globe size={14} /> Radar Global
          </button>
          <button
            onClick={() => { setActiveTab('gold'); setVisibleCount(6); }}
            className={`px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wide transition-colors flex items-center gap-2 ${
              activeTab === 'gold' ? 'bg-[#FFD700] text-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            <Coins size={14} /> Gold Intel
          </button>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <RefreshCw size={12} />
          Actualizado {lastSync} · cada 2 min
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-gray-500" size={32} />
          <p className="text-sm text-gray-600">Cargando noticias verificadas…</p>
        </div>
      ) : news.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/10 rounded-lg">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Sin datos nuevos</p>
          <p className="text-xs text-gray-700 mt-2">{status || 'No hay titulares con fuente y URL en este momento.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.slice(0, visibleCount).map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      )}

      {news.length > visibleCount && !loading && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount((p) => p + 6)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-white"
          >
            Cargar más
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
