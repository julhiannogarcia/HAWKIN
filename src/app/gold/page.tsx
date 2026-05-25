'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TickerTapeWidget from '@/components/TickerTapeWidget';
import TradingViewWidget from '@/components/TradingViewWidget';
import TechnicalGaugeWidget from '@/components/TechnicalGaugeWidget';
import MarketOverviewWidget from '@/components/MarketOverviewWidget';
import EconomicCalendarWidget from '@/components/EconomicCalendarWidget';
import CryptoHeatMapWidget from '@/components/CryptoHeatMapWidget';
import { Activity, ShieldCheck, Zap, Globe, Clock, Bell, BellRing, Loader2, BarChart3, TrendingUp, LayoutGrid, Radio } from 'lucide-react';

export default function GoldPage() {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [showNotification, setShowSuccess] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleActivateAlerts = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsAlertActive(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black overflow-x-hidden">
      <Header />
      
      {/* 1. TICKER TAPE LIVE (FIJO SUPERIOR) */}
      <div className="fixed top-[88px] left-0 w-full z-[900] bg-black/80 backdrop-blur-xl border-y border-white/5 h-12 flex items-center overflow-hidden">
         <TickerTapeWidget />
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md px-4">
            <div className="bg-[#FFD700] text-black p-6 rounded-[30px] flex items-center gap-6 shadow-[0_20px_60px_rgba(255,215,0,0.4)] border-4 border-black">
               <BellRing className="animate-bounce" size={24} />
               <div>
                  <h4 className="font-black uppercase text-sm italic tracking-tighter">SISTEMA ALPHA SINCRONIZADO</h4>
                  <p className="text-[10px] font-bold uppercase opacity-80">Recibiendo datos de alta frecuencia.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1900px] mx-auto px-6 pt-56 pb-32">
        
        {/* CABECERA DE MANDO INSTITUCIONAL */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-3">
                  <Radio className="text-red-500 animate-pulse" size={14} />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Transmisión en Vivo</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-ping" />
                  <span className="text-[9px] font-black text-gray-500 uppercase">HAWKIN GOLD v4.1</span>
               </div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
              Soberanía <br /><span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">Financiera.</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl font-light italic">
              "En el mundo del capital, la información lenta es pérdida. Bienvenida a la terminal de latencia cero."
            </p>
          </div>
          
          <button onClick={handleActivateAlerts} disabled={isAlertActive || isConnecting}
            className={`px-12 py-8 rounded-[40px] transition-all flex items-center gap-8 ${isAlertActive ? 'bg-green-500 text-black shadow-[0_0_50px_rgba(34,197,94,0.4)]' : 'bg-[#FFD700] text-black hover:scale-105 shadow-[0_20px_50px_rgba(255,215,0,0.2)]'}`}>
             <div className="text-left">
                <p className="text-[8px] font-black opacity-60 uppercase mb-1">Estatus del Terminal</p>
                <p className="text-lg font-black uppercase tracking-widest">{isConnecting ? 'CONECTANDO...' : isAlertActive ? 'ALPHA LIVE' : 'ACTIVAR SEÑALES PRO'}</p>
             </div>
             {isConnecting ? <Loader2 className="animate-spin" size={32} /> : <Zap className={isAlertActive ? 'fill-black' : ''} size={32} />}
          </button>
        </header>

        {/* --- GRID DE LA SUPER TERMINAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
           
           {/* CENTRO DE MANDO: GRÁFICO PRINCIPAL */}
           <div className="lg:col-span-8 glass-card bg-black border-white/10 rounded-[60px] overflow-hidden h-[850px] shadow-[0_60px_120px_rgba(0,0,0,1)] relative">
              <TradingViewWidget />
           </div>

           {/* LATERAL DERECHO: ANALÍTICA Y EVENTOS */}
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-card bg-gradient-to-br from-[#FFD700]/5 to-transparent border-[#FFD700]/20 p-12 rounded-[60px] shadow-2xl relative h-[450px] flex flex-col justify-between overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#FFD700] mb-10 flex items-center gap-3">
                       <BarChart3 size={18} /> Sentimiento Técnico
                    </h3>
                    <TechnicalGaugeWidget />
                 </div>
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-6">Sincronización: 100% Real Time</p>
              </div>

              <div className="glass-card bg-white/[0.01] border-white/5 p-10 rounded-[60px] h-[375px] overflow-hidden group hover:border-white/10 transition-all">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-8 flex items-center gap-3">
                    <Clock size={16} /> Calendario Económico (FED/ECB)
                 </h3>
                 <div className="h-full overflow-y-auto no-scrollbar">
                    <EconomicCalendarWidget />
                 </div>
              </div>
           </div>
        </div>

        {/* --- SEGUNDA FILA: MAPA Y MERCADOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* MAPA DE CALOR CRIPTO */}
           <div className="lg:col-span-6 glass-card bg-black border-white/5 rounded-[60px] overflow-hidden h-[600px] shadow-2xl">
              <div className="p-10 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
                 <LayoutGrid className="text-[#FFD700]" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-[0.3em]">Mapa de Calor Cripto (Top 50)</h3>
              </div>
              <div className="h-full p-4">
                 <CryptoHeatMapWidget />
              </div>
           </div>

           {/* MERCADO GLOBAL (INDICES Y COMMODITIES) */}
           <div className="lg:col-span-6 glass-card bg-black border-white/5 rounded-[60px] overflow-hidden h-[600px] shadow-2xl">
              <div className="p-10 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
                 <Globe className="text-blue-500" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-[0.3em]">Índices Globales y Metales</h3>
              </div>
              <div className="h-full p-4">
                 <MarketOverviewWidget />
              </div>
           </div>
        </div>

        {/* --- CLAÚSULA DE PROFESIONALISMO --- */}
        <section className="mt-40 text-center">
           <div className="max-w-4xl mx-auto p-20 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[80px] shadow-3xl">
              <ShieldCheck className="mx-auto text-[#FFD700] mb-10" size={80} />
              <h2 className="text-5xl font-black uppercase italic tracking-tighter">HAWKIN <span className="text-gray-500">Gold Standard Intel.</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed font-light mt-10 italic max-w-2xl mx-auto">
                "Esta terminal no utiliza datos retrasados. <b className="text-white uppercase tracking-widest font-black">Cada segundo es real</b>. Estás viendo el flujo del capital mundial en transmisión directa."
              </p>
           </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
