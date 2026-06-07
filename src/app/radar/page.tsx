'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LoaderCircle, ChevronRight, Globe, Zap, Clock, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const GlobalTicker = dynamic(() => import('@/components/Ticker'), { ssr: false });
const LiveFeed = dynamic(() => import('@/components/LiveFeed'), { ssr: false });
const LiveStatusBar = dynamic(() => import('@/components/intelligence/LiveStatusBar'), { ssr: false });
const SponsorSpace = dynamic(() => import('@/components/SponsorSpace'), { ssr: false });

export default function RadarPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoaderCircle className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#020202]">
      <LiveStatusBar />
      <Header />

      <div className="flex flex-col pt-32 md:pt-40">
        
        <section className="max-w-7xl mx-auto px-6 w-full text-left">
          {/* HEADER PRINCIPAL */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-cyan-500 pl-8 text-left">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]" />
                <span className="text-[12px] font-black text-red-500 uppercase tracking-[0.5em]">Live Intelligence Feed</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                Radar <span className="text-cyan-400">Global.</span>
              </h1>
              <p className="text-gray-500 mt-6 text-xl font-light max-w-2xl leading-relaxed uppercase tracking-widest">
                Interceptando filtraciones, anuncios oficiales y movimientos estratégicos de IA en tiempo real.
              </p>
            </div>
            
            <div className="hidden lg:block pb-4">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[30px] flex items-center gap-6 shadow-2xl">
                  <div className="flex flex-col text-right">
                     <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Estado de Señal</span>
                     <span className="text-xs font-black text-green-500 uppercase italic">Alta Fidelidad</span>
                  </div>
                  <div className="h-10 w-px bg-white/5" />
                  <Globe className="text-cyan-500 animate-spin-slow" size={32} />
               </div>
            </div>
          </div>

          <div className="mb-20">
             <SponsorSpace isPremium={false} type="banner" />
          </div>

          <div className="grid grid-cols-1 gap-16">
            <div className="min-h-[800px] space-y-12">
               <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Últimos <span className="text-gray-600">Reportes</span></h2>
               </div>
               <LiveFeed />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-6 py-32">
           <SponsorSpace isPremium={false} type="inline" />
        </div>

        <Footer />
        <div className="text-center pb-10 opacity-20">
           <span className="text-[7px] font-black uppercase tracking-[0.8em] text-gray-500">TITAN AI SYSTEM v10.0 // RADAR NODE ACTIVE</span>
        </div>
        <GlobalTicker />
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </main>
  );
}
