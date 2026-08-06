'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import NewsCard from '@/components/NewsCard';
import { useEffect, useState } from 'react';
import { LoaderCircle, AlertTriangle } from 'lucide-react';

const SponsorSpace = dynamic(() => import('@/components/SponsorSpace'), { ssr: false });

type RumorItem = {
  id: string;
  title: string;
  excerpt?: string;
  category?: string;
  image?: string | null;
  date?: string;
  source?: string;
  url?: string;
  isCeoRumor?: boolean;
  badge?: string;
  disclaimer?: string;
};

export default function RumorsPage() {
  const [news, setNews] = useState<RumorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/news/rumors', { cache: 'no-store' });
        const data = await res.json();
        setNews(data.news || []);
        setStatus(data.status || '');
      } catch {
        setNews([]);
        setStatus('Sin datos nuevos');
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 120_000);
    return () => clearInterval(t);
  }, []);

  const ceoRumors = news.filter((n) => n.isCeoRumor);
  const otherRumors = news.filter((n) => !n.isCeoRumor);

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="mb-12 border-l-4 border-amber-500 pl-8">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Rumor Desk · No confirmado</span>
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-amber-400 mb-4">
            Rumores & Señales
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs max-w-2xl">
            Filtrado en vivo de leaks y rumores de CEOs / IA. Todo marcado como no verificado. No es noticia confirmada.
          </p>
        </div>

        <div className="mb-8 px-4 py-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Badge RUMOR = no confirmado · Badge RUMOR · CEO = menciona a un CEO
          </p>
        </div>

        <div className="mb-12">
          <SponsorSpace isPremium={false} type="banner" />
        </div>

        {loading ? (
          <div className="py-32 flex justify-center">
            <LoaderCircle className="animate-spin text-amber-500" size={40} />
          </div>
        ) : news.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-amber-500/20 rounded-lg">
            <p className="text-sm font-semibold text-amber-500/70 uppercase tracking-widest">Sin datos nuevos</p>
            <p className="text-xs text-gray-700 mt-2">{status || 'No hay rumores con fuente y URL ahora.'}</p>
          </div>
        ) : (
          <div className="space-y-14">
            {ceoRumors.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-amber-500 text-black px-3 py-1 rounded">
                    <AlertTriangle size={12} /> RUMOR · CEO
                  </span>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">
                    Señales que mencionan CEOs — no confirmadas
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ceoRumors.map((item) => (
                    <NewsCard key={item.id} {...item} category="RUMOR" />
                  ))}
                </div>
              </section>
            )}

            {otherRumors.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-amber-500/80 text-black px-3 py-1 rounded">
                    <AlertTriangle size={12} /> RUMOR
                  </span>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Otras señales no verificadas</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherRumors.map((item) => (
                    <NewsCard key={item.id} {...item} category="RUMOR" />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
      <Footer />
      <GlobalTicker />
    </main>
  );
}
