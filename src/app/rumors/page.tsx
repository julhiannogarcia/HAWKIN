'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import NewsCard from '@/components/NewsCard';
import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle, AlertTriangle } from 'lucide-react';

const SponsorSpace = dynamic(() => import('@/components/SponsorSpace'), { ssr: false });

type RegionFilter = 'ALL' | 'USA' | 'CN' | 'CEO';

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
  ceoName?: string | null;
  ceoRegion?: 'USA' | 'CN' | null;
  badge?: string;
  disclaimer?: string;
};

export default function RumorsPage() {
  const [news, setNews] = useState<RumorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [filter, setFilter] = useState<RegionFilter>('ALL');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === 'CEO') params.set('ceo', '1');
      if (filter === 'USA' || filter === 'CN') {
        params.set('ceo', '1');
        params.set('region', filter);
      }
      const res = await fetch(`/api/news/rumors?${params}`, { cache: 'no-store' });
      const data = await res.json();
      setNews(data.news || []);
      setStatus(data.status || '');
    } catch {
      setNews([]);
      setStatus('Sin datos nuevos');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
    const t = setInterval(() => load(true), 120_000);
    return () => clearInterval(t);
  }, [load]);

  const ceoUsa = news.filter((n) => n.isCeoRumor && n.ceoRegion === 'USA');
  const ceoCn = news.filter((n) => n.isCeoRumor && n.ceoRegion === 'CN');
  const other = news.filter((n) => !n.isCeoRumor);

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="mb-10 border-l-4 border-amber-500 pl-8">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Rumor Desk · No confirmado</span>
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-amber-400 mb-4">
            Rumores & Señales
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs max-w-2xl">
            Leaks y rumores de CEOs (USA + China) e IA. Todo marcado como no verificado.
          </p>
        </div>

        <div className="mb-6 px-4 py-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Badge RUMOR = no confirmado · RUMOR · CEO · USA/CN = menciona CEO grande
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {(
            [
              { id: 'ALL', label: 'Todos' },
              { id: 'CEO', label: 'Solo CEOs' },
              { id: 'USA', label: '🇺🇸 CEOs USA' },
              { id: 'CN', label: '🇨🇳 CEOs China' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors ${
                filter === f.id
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'border-white/10 text-gray-500 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
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
            {ceoUsa.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-amber-500 text-black px-3 py-1 rounded">
                    <AlertTriangle size={12} /> RUMOR · CEO · USA
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ceoUsa.map((item) => (
                    <NewsCard key={item.id} {...item} category="RUMOR" />
                  ))}
                </div>
              </section>
            )}

            {ceoCn.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-red-500 text-white px-3 py-1 rounded">
                    <AlertTriangle size={12} /> RUMOR · CEO · CN
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ceoCn.map((item) => (
                    <NewsCard key={item.id} {...item} category="RUMOR" />
                  ))}
                </div>
              </section>
            )}

            {other.length > 0 && filter === 'ALL' && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-amber-500/80 text-black px-3 py-1 rounded">
                    <AlertTriangle size={12} /> RUMOR
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {other.map((item) => (
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
