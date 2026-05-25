'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import TradingViewWidget from '@/components/TradingViewWidget';
import TechnicalGaugeWidget from '@/components/TechnicalGaugeWidget';
import MarketOverviewWidget from '@/components/MarketOverviewWidget';
import EconomicCalendarWidget from '@/components/EconomicCalendarWidget';
import { TrendingUp, Activity, ExternalLink, ShieldCheck, Zap, Globe, Coins, ArrowUpRight, BarChart3, Clock } from 'lucide-react';

export default function GoldPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoldData = async () => {
      try {
        const res = await fetch('/api/news/gold');
        const data = await res.json();
        setNews(data.news || []);
        setLoading(false);
      } catch (e) {
        console.error("Error loading Gold news", e);
      }
    };
    loadGoldData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black">
      <Header />
      
      <div className="max-w-[1800px] mx-auto px-6 pt-40 pb-32">
        
        {/* HEADER TIPO BLOOMBERG */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-l-4 border-[#FFD700] pl-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-ping" />
               <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.5em]">Terminal Financiera HAWKIN GOLD v3.0</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
              Soberanía <span className="italic text-gray-500">Financiera.</span>
            </h1>
          </div>
          <div className="flex gap-4">
             <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Status Global</p>
                <p className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                   <Activity size={12} /> Mercados Abiertos
                </p>
             </div>
             <div className="p-4 bg-[#FFD700] text-black rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                <p className="text-[8px] font-black opacity-60 uppercase mb-1">Inversión Alpha</p>
                <p className="text-xs font-black uppercase tracking-widest">Activar Señales</p>
             </div>
          </div>
        </header>

        {/* --- GRID MAESTRO DE LA TERMINAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
           
           {/* 1. GRÁFICO PRINCIPAL (BTC/USDT) - EL CENTRO DE MANDO */}
           <div className="lg:col-span-8 glass-card bg-black border-white/5 rounded-[40px] overflow-hidden h-[700px] shadow-2xl relative">
              <div className="absolute top-6 left-8 z-10 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                 <Coins className="text-[#FFD700]" size={16} />
                 <span className="text-xs font-black uppercase tracking-widest">BTC / USDT • Binance Live</span>
              </div>
              <TradingViewWidget />
           </div>

           {/* 2. ANÁLISIS TÉCNICO (EL SENTIMIENTO) */}
           <div className="lg:col-span-4 space-y-6">
              <div className="glass-card bg-[#FFD700]/5 border-[#FFD700]/20 p-8 rounded-[40px] h-[400px] flex flex-col justify-between overflow-hidden relative">
                 <div className="relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FFD700] mb-6 flex items-center gap-2">
                       <Zap size={16} /> Sentimiento del Mercado
                    </h3>
                    <TechnicalGaugeWidget />
                 </div>
              </div>

              {/* 3. CALENDARIO ECONÓMICO (DATOS FED / INFLACIÓN) */}
              <div className="glass-card bg-white/[0.02] border-white/5 p-8 rounded-[40px] h-[275px] overflow-y-auto no-scrollbar">
                 <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                    <Clock size={16} /> Eventos Económicos Hoy
                 </h3>
                 <EconomicCalendarWidget />
              </div>
           </div>
        </div>

        {/* --- SEGUNDO NIVEL DE DATOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* 4. VISIÓN DEL MERCADO GLOBAL (ORO, SP500, NASDAQ) */}
           <div className="lg:col-span-6 glass-card bg-black border-white/5 rounded-[40px] overflow-hidden h-[600px]">
              <div className="p-8 border-b border-white/5 flex items-center gap-4">
                 <Globe className="text-blue-500" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-widest">Índices Globales y Commodities</h3>
              </div>
              <MarketOverviewWidget />
           </div>

           {/* 5. FEED DE NOTICIAS DE ALTA FIDELIDAD */}
           <div className="lg:col-span-6 space-y-6 overflow-y-auto h-[600px] no-scrollbar pr-2">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
                 <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 italic">Gold News Intel</h3>
              </div>

              {loading ? (
                <div className="space-y-4">
                   {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)}
                </div>
              ) : (
                news.map((item, i) => (
                  <div key={i} className="p-6 glass-card bg-white/[0.01] border-white/5 rounded-[30px] hover:border-[#FFD700]/30 transition-all group">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[8px] font-black text-[#FFD700] uppercase border border-[#FFD700]/20 px-3 py-1 rounded-full">{item.source}</span>
                        <span className="text-[8px] font-bold text-gray-600 uppercase italic">{new Date(item.date).toLocaleTimeString()}</span>
                     </div>
                     <h4 className="text-lg font-black leading-tight group-hover:text-[#FFD700] transition-colors">{item.title}</h4>
                     <div className="mt-4 flex justify-end">
                        <a href={item.link} target="_blank" className="text-[9px] font-black text-gray-500 hover:text-white flex items-center gap-2 uppercase tracking-widest">
                           Analizar Datos <ExternalLink size={10} />
                        </a>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* --- NOTA DE SINCERIDAD TÉCNICA --- */}
        <section className="mt-40 text-center space-y-12">
           <div className="max-w-3xl mx-auto p-12 bg-white/[0.02] border border-dashed border-white/10 rounded-[60px]">
              <ShieldCheck className="mx-auto text-[#FFD700] mb-8" size={50} />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Honestidad HAWKIN <span className="text-gray-500">Intelligence.</span></h2>
              <p className="text-gray-400 text-sm leading-relaxed font-light mt-6 italic">
                "Fundador, para ser los más profesionales del mundo, esta terminal entrega datos directos de los nodos de intercambio globales. <b className="text-white">Lo que ves es la realidad del capital en milisegundos.</b> El siguiente paso es la integración de carteras de inversión directas."
              </p>
           </div>
        </section>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
