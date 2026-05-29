'use client';

import React, { useState, useEffect } from 'react';
import Intro from '@/components/Intro';
import Hero from '@/components/Hero';
import GlobalTicker from '@/components/Ticker';
import FounderZone from '@/components/FounderZone';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';
import LiveFeed from '@/components/LiveFeed';
import VisionSection from '@/components/VisionSection';
import AdSpace from '@/components/AdSpace';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <Header />

      <div className="flex flex-col">
        <Intro />
        
        {/* Espacio Publicitario Premium */}
        <div className="mt-40 max-w-5xl mx-auto w-full px-4">
          <AdSpace isPremium={false} type="banner" />
        </div>

        <Hero />

        {/* Feed de Noticias / Live Engine */}
        <section id="news" className="max-w-6xl mx-auto px-4 py-32 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Radar Global.</h2>
              <p className="text-gray-500 mt-4 text-xs font-black uppercase tracking-[0.4em]">Noticias de élite actualizándose cada minuto</p>
            </div>
            <a href="/news" className="text-[10px] font-black tracking-widest text-cyan-400 hover:text-white transition-colors uppercase border-b border-cyan-400/30 pb-1">Ver Archivo Histórico →</a>
          </div>

          <LiveFeed />
        </section>

        <VisionSection />
        <FounderZone />
        <Pricing />
        <Footer />
        <GlobalTicker />
      </div>
    </main>
  );
}
