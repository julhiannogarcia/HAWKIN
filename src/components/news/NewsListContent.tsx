'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import LiveFeed from '@/components/LiveFeed';
import NewsCard from '@/components/NewsCard';
import MasterIntel from '@/components/news/MasterIntel';
import AdSpace from '@/components/AdSpace';
import { Loader2, Radio } from 'lucide-react';

export default function NewsPage() {
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
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 pt-40 pb-32">
        {/* CABECERA DEL COMANDO CENTRAL */}
        <section className="mb-32 text-center md:text-left space-y-6">
           <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-3">
                 <Radio className="text-red-500 animate-pulse" size={14} />
                 <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Global Intel Live</span>
              </div>
           </div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
              Command <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">Center.</span>
           </h1>
           <p className="text-gray-500 text-lg max-w-2xl font-light italic border-l-2 border-cyan-500 pl-6 mx-auto md:mx-0 text-left">
              Reportes de inteligencia procesados en tiempo real por el núcleo HAWKIN. 
              Análisis, rumores y predicciones del ecosistema global de IA.
           </p>
        </section>

        {/* MOTOR DE INTELIGENCIA MAESTRO */}
        <MasterIntel />

        {/* FEED DE NOTICIAS CON SIDEBAR TÁCTICO */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8 space-y-16">
              <div className="flex items-center gap-4">
                 <div className="w-4 h-4 bg-cyan-500 rounded-full" />
                 <h2 className="text-4xl font-black uppercase italic tracking-tighter">Archivo de <span className="text-gray-600">Inteligencia</span></h2>
              </div>
              <LiveFeed />
           </div>

           {/* SIDEBAR PUBLICITARIO Y TÁCTICO */}
           <aside className="lg:col-span-4 space-y-12">
              <div className="sticky top-40 space-y-12">
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-4">Patrocinador Alpha</h3>
                    <AdSpace isPremium={false} type="sidebar" />
                 </div>

                 <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400">Canal Seguro</h3>
                    <p className="text-gray-500 text-xs font-light leading-relaxed italic">
                       Estás conectado al nodo de inteligencia HAWKIN. Todas las transmisiones están encriptadas bajo protocolo SHIELD Nivel 10.
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">Conexión Estable</span>
                    </div>
                 </div>
              </div>
           </aside>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
