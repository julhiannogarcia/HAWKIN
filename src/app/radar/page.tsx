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
const AdSpace = dynamic(() => import('@/components/AdSpace'), { ssr: false });

function Top10Sidebar() {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await fetch('/api/news/master-intel');
        const data = await res.json();
        setIntel(data);
      } catch (e) {
        console.error("Sidebar Intel Error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchIntel();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-2xl" />)}</div>;

  const topNews = intel?.topNews || [];

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">Top 10 Inteligencia</h3>
          <Zap size={14} className="text-cyan-500 animate-pulse" />
       </div>
       <div className="space-y-4">
          {topNews.slice(0, 10).map((n: any, i: number) => (
            <a key={i} href={`/news/${n.id}`} className="block p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all group">
               <div className="flex gap-4">
                  <span className="text-xl font-black text-gray-800 italic group-hover:text-cyan-500/50 transition-colors">#{i+1}</span>
                  <div className="space-y-2">
                     <h4 className="text-[11px] font-black uppercase italic leading-tight text-white group-hover:text-cyan-400 transition-colors">{n.title}</h4>
                     <div className="flex items-center gap-3 text-[7px] font-black text-gray-600 uppercase tracking-widest">
                        <span className="text-cyan-500">Impacto {n.impact}/10</span>
                        <span>•</span>
                        <span>{n.importance}</span>
                     </div>
                  </div>
               </div>
            </a>
          ))}
       </div>

       <div className="p-8 bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 rounded-[40px] space-y-4">
          <div className="flex items-center gap-3">
             <Terminal size={14} className="text-red-500" />
             <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Alerta de Rumor</span>
          </div>
          <p className="text-[10px] text-gray-400 font-light italic leading-relaxed">
             "{intel?.rumors?.[0]?.text || 'Escaneando señales de baja frecuencia...'}"
          </p>
       </div>
    </div>
  );
}

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
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-cyan-500 pl-8">
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
             <AdSpace isPremium={false} type="banner" />
          </div>

          {/* GRID TÁCTICO: NOTICIAS + SIDEBAR TOP 10 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* COLUMNA IZQUIERDA: FEED EN VIVO (8 COLUMNAS) */}
            <div className="lg:col-span-8 min-h-[800px] space-y-12">
               <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Últimos <span className="text-gray-600">Reportes</span></h2>
               </div>
               <LiveFeed />
            </div>

            {/* COLUMNA DERECHA: SIDEBAR INTEL (4 COLUMNAS) */}
            <aside className="lg:col-span-4 space-y-12">
               <div className="sticky top-40 space-y-12">
                  <Top10Sidebar />
                  
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-4">Patrocinador Alpha</h3>
                    <AdSpace isPremium={false} type="sidebar" />
                  </div>

                  <div className="p-10 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400">Canal Seguro</h3>
                    <p className="text-gray-500 text-[10px] font-light leading-relaxed italic">
                       Estás conectado al nodo de inteligencia HAWKIN. Todas las transmisiones están encriptadas bajo protocolo SHIELD Nivel 10.
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">Enlace Estable</span>
                    </div>
                  </div>
               </div>
            </aside>

          </div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-6 py-32">
           <AdSpace isPremium={false} type="inline" />
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
