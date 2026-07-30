'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Target, Zap, LoaderCircle, RefreshCw, ExternalLink } from 'lucide-react';

type NewsItem = {
  id: string;
  title: string;
  category?: string;
  excerpt?: string;
  source?: string;
  url?: string;
  isBreaking?: boolean;
  isFallback?: boolean;
};

export default function CommandCenterTop10() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news/live', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!Array.isArray(data.news) || data.news.length === 0) {
        setError(true);
        return;
      }
      setItems(data.news.slice(0, 10));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 120_000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <section className="w-full bg-[#050505] py-16 border-y border-white/5 relative text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 border-l-4 border-yellow-500 pl-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Target size={16} className="text-yellow-500" />
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Desde RSS verificado</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none text-white">
              Command <span className="text-yellow-500">Center Top 10.</span>
            </h2>
            <p className="text-gray-500 mt-3 text-[10px] font-black uppercase tracking-[0.4em]">
              Titulares reales · sin scores inventados
            </p>
          </div>
          {!loading && (
            <button onClick={fetchNews} className="flex items-center gap-1 text-[9px] font-black uppercase text-gray-600 hover:text-yellow-400">
              <RefreshCw size={12} /> Actualizar
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-12 gap-3 text-gray-600">
            <LoaderCircle className="animate-spin text-yellow-500" size={22} />
            <span className="text-xs uppercase tracking-widest">Cargando titulares…</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center border border-white/5 rounded-2xl">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sin datos nuevos</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {items.map((item, index) => (
              <a
                key={item.id}
                href={item.url || '#'}
                target={item.url ? '_blank' : undefined}
                rel={item.url ? 'noopener noreferrer' : undefined}
                className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all flex flex-col justify-between group min-h-[140px]"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-black text-gray-700 italic group-hover:text-yellow-500/50">#{index + 1}</span>
                    {item.isBreaking && (
                      <span className="text-[7px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 uppercase">Breaking</span>
                    )}
                  </div>
                  <h3 className="text-sm font-black uppercase italic text-white leading-snug line-clamp-3">{item.title}</h3>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                  <span className="text-[8px] font-black text-gray-600 uppercase truncate max-w-[70%]">{item.source || 'RSS'}</span>
                  {item.url && <ExternalLink size={10} className="text-gray-600 shrink-0" />}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
