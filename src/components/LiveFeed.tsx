'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';

export default function LiveFeed() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveNews = async () => {
    try {
      const res = await fetch('/api/news/live');
      const data = await res.json();
      setNews(data);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching live news", e);
    }
  };

  useEffect(() => {
    fetchLiveNews();
    // AUTO-ACTUALIZACIÓN CADA 60 SEGUNDOS
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item) => (
        <NewsCard key={item.id} {...item} />
      ))}
    </div>
  );
}
