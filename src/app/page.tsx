'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// CARGA DINÁMICA CON SSR: FALSE PARA BLINDAR LA ESTABILIDAD
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Intro = dynamic(() => import('@/components/Intro'), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const GlobalTicker = dynamic(() => import('@/components/Ticker'), { ssr: false });
const FounderZone = dynamic(() => import('@/components/FounderZone'), { ssr: false });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: false });
const LiveFeed = dynamic(() => import('@/components/LiveFeed'), { ssr: false });
const VisionSection = dynamic(() => import('@/components/VisionSection'), { ssr: false });
const AdSpace = dynamic(() => import('@/components/AdSpace'), { ssr: false });

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
      {/* DEBUG BANNER - ELIMINAR DESPUÉS DE VERIFICAR DESPLIEGUE */}
      <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest text-center py-2 z-[9999] relative">
        Sincronización Radar Alpha Activa v2.0
      </div>
      <Header />

      <div className="flex flex-col">
        <Intro />
        
        {/* Espacio Publicitario Premium - FORMATO GIGANTE */}
        <div className="w-full">
          <AdSpace isPremium={false} type="banner" />
        </div>

        <Hero />

        {/* Feed de Noticias / Live Engine - MOVIDO HACIA ARRIBA PARA ENFOQUE TOTAL EN NOTICIAS */}
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
        <GlobalTicker />
      </div>
    </main>
  );
}
