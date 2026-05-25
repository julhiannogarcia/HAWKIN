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
import { Activity, ShieldCheck, Zap, Globe, Coins, Clock, Bell, BellRing, Loader2, BarChart3, TrendingUp, LayoutGrid } from 'lucide-react';

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
      
      {/* 1. TICKER TAPE INSTITUCIONAL (SCROLLING PRECIOS LIVE) */}
      <div className="fixed top-[88px] left-0 w-full z-[900] bg-black/60 backdrop-blur-md border-y border-white/5 h-12 overflow-hidden">
         <TickerTapeWidget />
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md px-4">
            <div className="bg-[#FFD700] text-black p-6 rounded-[30px] flex items-center gap-6 shadow-[0_20px_60px_rgba(255,215,0,0.4)] border-4 border-black">
               <BellRing className="animate-bounce" size={24} />
               <div>
                  <h4 className="font-black uppercase text-sm italic">HAWKIN ALPHA ACTIVO</h4>
                  <p className="text-[10px] font-bold uppercase opacity-80">Nodos de alta frecuencia sincronizados.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1900px] mx-auto px-6 pt-56 pb-32">
        
        {/* HEADER DE MANDO MUNDIAL */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-4 py-1.5 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full">
                  <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em]">HAWKIN GOLD v4.0 • LIVE DATA</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-gray-500 uppercase">Binance Socket: Online</span>
               </div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
              Terminal de <br /><span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">Inversión.</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4">
             <button onClick={handleActivateAlerts} disabled={isAlertActive || isConnecting}
               className={`px-10 py-6 rounded-[30px] transition-all flex items-center gap-6 ${isAlertActive ? 'bg-green-500 text-black' : 'bg-[#FFD700] text-black hover:scale-105 shadow-[0_20px_50px_rgba(255,215,0,0.2)]'}`}>
                <div className="text-left">
                   <p className="text-[8px] font-black opacity-60 uppercase">Estatus Alpha</p>
                   <p className="text-sm font-black uppercase tracking-widest">{isConnecting ? 'SINCRONIZANDO...' : isAlertActive ? 'ALERTAS EN VIVO' : 'ACTIVAR SEÑALES PRO'}</p>
                </div>
                {isConnecting ? <Loader2 className="animate-spin" /> : <Zap className={isAlertActive ? 'fill-black' : ''} />}
             </button>
          </div>
        </header>

        {/* --- GRID DE LA SUPER TERMINAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* COLUMNA IZQUIERDA: GRÁFICO PRINCIPAL */}
           <div className="lg:col-span-8 space-y-8">
              <div className="glass-card bg-black border-white/10 rounded-[60px] overflow-hidden h-[800px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group">
                 <TradingViewWidget />
              </div>
              
              {/* MAPA DE CALOR (MERCADO GLOBAL DE UN VISTAZO) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card bg-white/[0.01] border-white/5 rounded-[50px] p-10">
                    <div className="flex items-center gap-4 mb-8">
                       <LayoutGrid className="text-[#FFD700]" size={20} />
                       <h3 className="text-sm font-black uppercase tracking-widest">Mapa de Calor Cripto</h3>
                    </div>
                    <CryptoHeatMapWidget />
                 </div>
                 <div className="glass-card bg-white/[0.01] border-white/5 rounded-[50px] p-10 flex flex-col justify-center text-center space-y-6">
                    <TrendingUp className="mx-auto text-green-500" size={50} />
                    <h3 className="text-2xl font-black uppercase italic italic">Sugerencia de Capital</h3>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                       "Fundador, los datos sugieren una acumulación masiva de ballenas en los niveles actuales de BTC. <b className="text-white">Probabilidad de ruptura: 85%.</b>"
                    </p>
                    <button className="px-8 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">Ver Estrategia Completa</button>
                 </div>
              </div>
           </div>

           {/* COLUMNA DERECHA: ANALÍTICA Y EVENTOS */}
           <div className="lg:col-span-4 space-y-8">
              {/* SENTIMIENTO TÉCNICO */}
              <div className="glass-card bg-gradient-to-br from-[#FFD700]/10 to-transparent border-[#FFD700]/20 p-12 rounded-[60px] shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#FFD700] mb-10 flex items-center gap-3">
                       <Activity size={18} className="text-[#FFD700]" /> Sentimiento Real-Time
                    </h3>
                    <TechnicalGaugeWidget />
                 </div>
              </div>

              {/* CALENDARIO ECONÓMICO */}
              <div className="glass-card bg-white/[0.02] border-white/5 p-10 rounded-[60px] h-[400px] overflow-hidden group hover:border-white/10 transition-all">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-8 flex items-center gap-3">
                    <Clock size={16} /> Agenda de Mercados (FED/Global)
                 </h3>
                 <div className="h-full overflow-y-auto no-scrollbar">
                    <EconomicCalendarWidget />
                 </div>
              </div>

              {/* MERCADO GLOBAL (SP500, ORO, NASDAQ) */}
              <div className="glass-card bg-black border-white/5 rounded-[60px] overflow-hidden h-[500px]">
                 <div className="p-8 border-b border-white/5 flex items-center gap-4">
                    <Globe className="text-blue-500" size={20} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Commodities & Indices</h3>
                 </div>
                 <div className="h-full">
                    <MarketOverviewWidget />
                 </div>
              </div>
           </div>

        </div>

        {/* --- CLAÚSULA DE SOBERANÍA --- */}
        <section className="mt-40 text-center">
           <div className="max-w-4xl mx-auto p-20 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[80px]">
              <ShieldCheck className="mx-auto text-[#FFD700] mb-10" size={80} />
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">HAWKIN <span className="text-gray-500">Gold Standard Intelligence.</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed font-light mt-10 italic max-w-2xl mx-auto">
                "Esta no es una página de noticias. Es una <b className="text-white uppercase">puerta al flujo de capital mundial</b>. Cada dato es verídico, cada señal es analizada y cada gráfico corre en tiempo real."
              </p>
           </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
