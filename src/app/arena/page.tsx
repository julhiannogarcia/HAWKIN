'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LoaderCircle, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const GlobalTicker = dynamic(() => import('@/components/Ticker'), { ssr: false });
const LiveStatusBar = dynamic(() => import('@/components/intelligence/LiveStatusBar'), { ssr: false });
const ArenaRanking = dynamic(() => import('@/components/arena/ArenaRanking'), { ssr: false });

export default function ArenaPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoaderCircle className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <LiveStatusBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-l-4 border-amber-500 pl-4 sm:pl-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-amber-400" size={18} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-400">Global AI Arena</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white">
              HAWKIN <span className="text-amber-400">Arena</span>
            </h1>
            <p className="text-gray-500 mt-2 text-[10px] sm:text-xs uppercase tracking-widest max-w-2xl">
              Ranking editorial frontier julio 2026 · HAWKIN Index editorial (estimado)
            </p>
            <p className="text-amber-500/80 mt-1 text-[9px] font-black uppercase tracking-widest">
              NO es Elo LMSYS / Arena.ai oficial
            </p>
          </div>
          <Link
            href="/intelligence"
            className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-cyan-400 self-start"
          >
            ← Intelligence Hub
          </Link>
        </div>

        <ArenaRanking showHeader={false} />
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
