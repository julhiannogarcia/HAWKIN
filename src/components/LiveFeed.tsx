'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';

export default function LiveFeed() {
  const [data, setData] = useState<{news: any[], shield: any[]}>({news: [], shield: []});
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
    <div className="space-y-24">
      {/* Sección IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.news.map((item) => (
          <NewsCard key={item.id} {...item} />
        ))}
      </div>

      {/* Sección SHIELD (Ciberseguridad en vivo) */}
      <div>
        <div className="flex items-center gap-3 mb-12">
           <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
           <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Radar Shield: Ciberseguridad en vivo</h2>
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
