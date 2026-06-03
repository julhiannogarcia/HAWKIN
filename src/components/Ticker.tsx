'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Ticker() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const items = data.news || [];
        setNews(items.slice(0, 10).map((n: any) => ({
          label: n.category || 'INTEL',
          text: n.title,
          url: n.url || `/news/${n.id}`
        })));
      } catch (e) {
        console.error("Ticker Error:", e);
      }
    };
    fetchNews();
  }, []);

  const displayNews = news.length > 0 ? news : [
    { label: 'HAWKIN', text: 'Sincronizando flujos de inteligencia global...', url: '/news' },
    { label: 'ALERTA', text: 'Radar Global operativo y analizando datos...', url: '/news' }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-cyan-500/30 py-3 z-[2000] overflow-hidden flex">
      <div className="bg-cyan-500 text-black px-6 font-black uppercase text-xs flex items-center z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
        Live Radar
      </div>
      <div className="flex whitespace-nowrap animate-ticker-scroll">
        {[...displayNews, ...displayNews, ...displayNews].map((item, index) => (
          <a key={index} href={item.url} target={item.url.startsWith('http') ? "_blank" : "_self"} className="px-12 text-sm text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
            <span className="text-cyan-400 font-bold mr-2">{item.label}:</span>
            {item.text}
          </a>
        ))}
      </div>
      
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker-scroll {
          animation: ticker-scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
