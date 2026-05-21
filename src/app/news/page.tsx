'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import NewsCard from '@/components/NewsCard';

export default function NewsPage() {
  const allNews = [
    { id: "gpt-5-leak", title: "OpenAI GPT-5: Filtraciones sobre la nueva arquitectura", excerpt: "Análisis profundo sobre el razonamiento System 2...", category: "BIG TECH", isLocked: true },
    { id: "sam-altman-ubr", title: "La visión de Sam Altman sobre la RBU", excerpt: "Cómo la IA financiará el futuro...", category: "CEO RADAR", isLocked: true },
    { id: "nvidia-record", title: "NVIDIA alcanza valoración récord", excerpt: "El motor del mundo IA no tiene freno...", category: "MERCADO", isLocked: false },
    { id: "linux-trend", title: "Linux y la IA: Modelos locales en tendencia", excerpt: "Guía para correr LLMs en hardware libre...", category: "DEVELOPER", isLocked: false },
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="max-w-6xl mx-auto px-4 pt-40 pb-32">
        <h1 className="text-5xl font-black tracking-tighter text-white mb-12 uppercase italic">Radar HAWKIN</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNews.map((news, i) => (
            <NewsCard key={i} {...news} />
          ))}
        </div>
      </div>
      <Footer />
      <Ticker />
    </main>
  );
}
