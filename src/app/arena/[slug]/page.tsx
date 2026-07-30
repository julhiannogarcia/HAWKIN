'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ExternalLink, LoaderCircle, Swords, Trophy } from 'lucide-react';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const GlobalTicker = dynamic(() => import('@/components/Ticker'), { ssr: false });

type ArenaModel = {
  slug: string;
  name: string;
  company: string;
  region: string;
  license: string;
  founder: string;
  country: string;
  logo: string;
  score: number;
  change24h: number;
  change7d: number;
  scoreLabel: string;
  whatsNew: string;
  benefits: string[];
  debate: string;
  sourceUrl?: string;
  rank: number;
};

export default function ArenaModelPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [model, setModel] = useState<ArenaModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch('/api/intelligence/arena', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const found = (data.models || []).find((m: ArenaModel) => m.slug === slug);
        if (found) setModel(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoaderCircle className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-16">
        <Link href="/arena" className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-amber-400 mb-8 inline-block">
          ← Volver al Arena
        </Link>

        {notFound || !model ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl">
            <p className="text-gray-500 uppercase tracking-widest text-sm">Modelo no encontrado</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-8">
              <img src={model.logo} alt="" className="w-16 h-16 object-contain" />
              <div>
                <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">#{model.rank} · {model.scoreLabel}</p>
                <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter">{model.name}</h1>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                  {model.company} · {model.region} · {model.license}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-[8px] text-gray-600 uppercase font-black">Score</p>
                <p className="text-2xl font-black tabular-nums text-amber-400">{model.score}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-[8px] text-gray-600 uppercase font-black">24h</p>
                <p className={`text-2xl font-black tabular-nums ${model.change24h >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                  {model.change24h >= 0 ? '+' : ''}{model.change24h}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <p className="text-[8px] text-gray-600 uppercase font-black">7d</p>
                <p className={`text-2xl font-black tabular-nums ${model.change7d >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                  {model.change7d >= 0 ? '+' : ''}{model.change7d}%
                </p>
              </div>
            </div>

            <section className="space-y-6 text-left">
              <div>
                <h2 className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Trophy size={12} /> Qué trajo de nuevo
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{model.whatsNew}</p>
              </div>

              <div>
                <h2 className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-2">Beneficios</h2>
                <ul className="space-y-2">
                  {model.benefits.map((b, i) => (
                    <li key={i} className="text-sm text-gray-400 flex gap-2">
                      <span className="text-amber-400">•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <h2 className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Swords size={12} /> Debate HAWKIN
                </h2>
                <p className="text-sm text-gray-300 italic leading-relaxed">{model.debate}</p>
              </div>

              <div className="text-[10px] text-gray-600 uppercase tracking-widest space-y-1">
                <p>Fundador: <span className="text-gray-400">{model.founder}</span></p>
                <p>País: <span className="text-gray-400">{model.country}</span></p>
              </div>

              {model.sourceUrl && model.sourceUrl !== '#' && (
                <a
                  href={model.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300"
                >
                  Ver noticia fuente <ExternalLink size={12} />
                </a>
              )}
            </section>
          </>
        )}
      </div>
      <Footer />
      <GlobalTicker />
    </main>
  );
}
