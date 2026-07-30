'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import NewsCard from '@/components/NewsCard';
import { useEffect, useState } from 'react';
import { LoaderCircle, AlertTriangle } from 'lucide-react';

export default function RumorsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/news/rumors', { cache: 'no-store' });
        const data = await res.json();
        setNews(data.news || []);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 120_000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="mb-12 border-l-4 border-amber-500 pl-8">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Rumor Desk • No confirmado</span>
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-amber-400 mb-4">Rumores & Señales</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs max-w-2xl">
            Filtrado en vivo de leaks, rumores de CEOs, IA y tech. Marcado como inteligencia no verificada.
          </p>
        </div>

        {loading ? (
          <div className="py-32 flex justify-center">
            <LoaderCircle className="animate-spin text-amber-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} {...item} category="RUMOR" />
            ))}
          </div>
        )}
      </div>
      <Footer />
      <GlobalTicker />
    </main>
  );
}
