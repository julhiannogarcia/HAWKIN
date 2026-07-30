'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { ChevronRight } from 'lucide-react';

const SponsorSpace = dynamic(() => import('@/components/SponsorSpace'), { ssr: false });
const HISRanking = dynamic(() => import('@/components/intelligence/HISRanking'), { ssr: false });
const CEORadar = dynamic(() => import('@/components/intelligence/CEORadar'), { ssr: false });
const AIWarRoom = dynamic(() => import('@/components/intelligence/AIWarRoom'), { ssr: false });
const ExecutiveBrief = dynamic(() => import('@/components/intelligence/ExecutiveBrief'), { ssr: false });
const MarketTalentTerminal = dynamic(() => import('@/components/intelligence/MarketTalentTerminal'), { ssr: false });
const ArenaRanking = dynamic(() => import('@/components/arena/ArenaRanking'), { ssr: false });
const LiveStatusBar = dynamic(() => import('@/components/intelligence/LiveStatusBar'), { ssr: false });

export default function Page() {
  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <LiveStatusBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-cyan-400 mb-3">
              Intelligence Hub
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs max-w-xl">
              Centro de análisis estratégico HAWKIN — ranking HIS completo, radar CEO y terminal de mercados
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 mt-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-cyan-400 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
          <div className="lg:col-span-4">
            <SponsorSpace isPremium={false} type="sidebar" />
          </div>
        </div>

        <HISRanking />

        <ArenaRanking limit={5} compact showViewAllLink />

        <div className="mt-4 space-y-0">
          <CEORadar />
          <AIWarRoom />
          <ExecutiveBrief />
          <MarketTalentTerminal />
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">
          <ChevronRight size={12} className="text-cyan-500/50" />
          Datos en vivo · actualización cada 120s
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
