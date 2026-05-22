'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';

export default function LiveFeed() {
  const [data, setData] = useState<{news: any[], shield: any[], hardware: any[]}>({news: [], shield: [], hardware: []});
  const [loading, setLoading] = useState(true);

  const fetchLiveNews = async () => {
    try {
      const res = await fetch('/api/news/live');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching live news", e);
    }
  };

  useEffect(() => {
    fetchLiveNews();
    const interval = setInterval(fetchLiveNews, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-20">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-32">
      {/* SECCIÓN 1: ÉLITE CORPORATIVA & IA */}
      <div>
        <div className="flex items-center gap-3 mb-12">
           <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_cyan]" />
           <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white italic">Radar de la Élite: CEOs & Millonarios</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.news.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: TENDENCIAS HARDWARE */}
      <div>
        <div className="flex items-center gap-3 mb-12">
           <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_purple]" />
           <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white italic">Hardware del Futuro: Laptops & Chips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.hardware.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: SHIELD (Ciberseguridad) */}
      <div>
        <div className="flex items-center gap-3 mb-12">
           <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />
           <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white italic">HAWKIN Shield: Alertas Hacker Globales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.shield.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
