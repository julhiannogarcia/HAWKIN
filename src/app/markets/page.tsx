'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import TradingIntelligence from '@/components/intelligence/TradingIntelligence';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-8">
        <div className="mb-8 border-l-4 border-green-500 pl-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Markets <span className="text-green-500">Live</span>
          </h1>
          <p className="text-gray-500 mt-3 text-[10px] font-black uppercase tracking-[0.4em]">
            Terminal global • Precios en tiempo real
          </p>
        </div>
        <Link
          href="/gold"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FFD700] hover:underline mb-12"
        >
          Abrir terminal Gold completo <ArrowRight size={14} />
        </Link>
      </div>
      <TradingIntelligence />
      <Footer />
      <GlobalTicker />
    </main>
  );
}
