'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LoaderCircle, ChevronRight } from 'lucide-react';

// CARGA DINÁMICA CON SSR: FALSE PARA BLINDAR LA ESTABILIDAD
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Intro = dynamic(() => import('@/components/Intro'), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const GlobalTicker = dynamic(() => import('@/components/Ticker'), { ssr: false });
const FounderZone = dynamic(() => import('@/components/FounderZone'), { ssr: false });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: false });
const LiveFeed = dynamic(() => import('@/components/LiveFeed'), { ssr: false });
const AdSpace = dynamic(() => import('@/components/AdSpace'), { ssr: false });
const ExecutiveBrief = dynamic(() => import('@/components/intelligence/ExecutiveBrief'), { ssr: false });
const AIWarRoom = dynamic(() => import('@/components/intelligence/AIWarRoom'), { ssr: false });
const MarketTalentTerminal = dynamic(() => import('@/components/intelligence/MarketTalentTerminal'), { ssr: false });
const LiveStatusBar = dynamic(() => import('@/components/intelligence/LiveStatusBar'), { ssr: false });
const GlobalAIPulse = dynamic(() => import('@/components/intelligence/GlobalAIPulse'), { ssr: false });
const HISRanking = dynamic(() => import('@/components/intelligence/HISRanking'), { ssr: false });

export default function Home() {
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
      {/* VERCEL DEPLOY TRIGGER - SESSION SYNC v5.6.1 */}
      <LiveStatusBar />
      <Header />

      <div className="flex flex-col">
        <Intro />
        
        {/* Espacio Publicitario Premium */}
        <div className="w-full mt-10">
          <AdSpace isPremium={false} type="banner" />
        </div>

        <Hero />

        {/* --- GLOBAL AI PULSE (INDICADOR MAESTRO 1) --- */}
        <GlobalAIPulse />

        {/* --- EXECUTIVE SUMMARY --- */}
        <ExecutiveBrief />
        
        {/* --- HAWKIN INTELLIGENCE SCORE (INDICADOR MAESTRO 2) --- */}
        <HISRanking />

        {/* --- WAR ROOM & MARKET TERMINAL --- */}
        <AIWarRoom />

        <MarketTalentTerminal />

        {/* Feed de Noticias (EVIDENCIA SECUNDARIA) */}
        <section id="news" className="max-w-6xl mx-auto px-4 py-20 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 border-l-4 border-cyan-500 pl-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Radar en Vivo</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">Radar <span className="text-cyan-400">Global.</span></h2>
              <p className="text-gray-500 mt-4 text-xs font-black uppercase tracking-[0.4em]">Últimas filtraciones y noticias de IA a nivel mundial</p>
            </div>
            
            {/* BOTÓN DE ACCESO AL TOP 10 / ARCHIVO */}
            <div className="pb-2">
              <a href="/news" className="group flex items-center gap-3 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 px-6 py-3 rounded-full transition-all duration-500">
                <span className="text-[10px] font-black tracking-widest text-gray-400 group-hover:text-cyan-400 uppercase">Ver Top 10 e Histórico</span>
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                  <ChevronRight size={14} className="text-cyan-400 group-hover:text-black" />
                </div>
              </a>
            </div>
          </div>

          <LiveFeed />
        </section>

        {/* Espacio Publicitario entre noticias */}
        <div className="max-w-6xl mx-auto w-full px-4 py-10">
           <AdSpace isPremium={false} type="inline" />
        </div>

        {/* Secciones informativas reducidas/eliminadas por petición del usuario */}
        {/* <VisionSection /> */}

        {/* <FounderZone /> */}
        
        <Pricing />
        <Footer />
        <div className="text-center pb-10 opacity-20">
           <span className="text-[7px] font-black uppercase tracking-[0.8em] text-gray-500">TITAN AI SYSTEM v3.0 // OPERATIONAL</span>
        </div>
        <GlobalTicker />
      </div>
    </main>
  );
}
