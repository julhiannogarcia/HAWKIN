'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import TradingViewWidget from '@/components/TradingViewWidget';
import TechnicalGaugeWidget from '@/components/TechnicalGaugeWidget';
import MarketOverviewWidget from '@/components/MarketOverviewWidget';
import EconomicCalendarWidget from '@/components/EconomicCalendarWidget';
import { TrendingUp, Activity, ExternalLink, ShieldCheck, Zap, Globe, Coins, ArrowUpRight, BarChart3, Clock, Bell, BellRing, Loader2, Info } from 'lucide-react';

export default function GoldPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [showNotification, setShowSuccess] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

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
    <main className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black">
      <Header />
      
      {/* NOTIFICACIÓN DE ÉXITO ALPHA */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-md px-4"
          >
            <div className="bg-[#FFD700] text-black p-6 rounded-[30px] flex items-center gap-6 shadow-[0_20px_60px_rgba(255,215,0,0.4)] border-4 border-black">
               <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <BellRing className="text-[#FFD700] animate-bounce" size={24} />
               </div>
               <div>
                  <h4 className="font-black uppercase text-sm tracking-tighter italic">HAWKIN ALPHA ACTIVO</h4>
                  <p className="text-[10px] font-bold uppercase opacity-80">Recibirás señales de alta frecuencia en vivo.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1800px] mx-auto px-6 pt-40 pb-32">
        
        {/* BARRA DE ESTADO INSTITUCIONAL */}
        <div className="flex flex-wrap items-center gap-8 mb-12 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Servidor HAWKIN 01: ONLINE</span>
           </div>
           <div className="flex items-center gap-3 border-l border-white/10 pl-8">
              <Activity className="text-cyan-400" size={14} />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sincronización: MILISEGUNDOS</span>
           </div>
           <div className="flex items-center gap-3 border-l border-white/10 pl-8">
              <Globe className="text-purple-500" size={14} />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Nodos: TOKYO / NEW YORK / PERU</span>
           </div>
        </div>
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-l-4 border-[#FFD700] pl-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.5em]">Terminal Financiera HAWKIN GOLD</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
              Soberanía <span className="italic text-gray-500 text-6xl md:text-7xl">Financiera.</span>
            </h1>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={handleActivateAlerts}
               disabled={isAlertActive || isConnecting}
               className={`px-8 py-5 rounded-3xl transition-all flex items-center gap-4 ${isAlertActive ? 'bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-[#FFD700] text-black shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:scale-105'}`}
             >
                <div className="text-left">
                   <p className="text-[7px] font-black opacity-60 uppercase mb-1">Inversión Alpha</p>
                   <p className="text-xs font-black uppercase tracking-widest">
                      {isConnecting ? 'CONECTANDO...' : isAlertActive ? 'ALERTAS ACTIVAS' : 'ACTIVAR ALERTAS PRO'}
                   </p>
                </div>
                {isConnecting ? <Loader2 className="animate-spin" size={20} /> : isAlertActive ? <BellRing size={20} /> : <Bell size={20} />}
             </button>
          </div>
        </header>

        {/* --- GRID MAESTRO DE LA TERMINAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
           
           {/* 1. GRÁFICO PRINCIPAL CON MARCA BLANCA */}
           <div className="lg:col-span-8 glass-card bg-black border-white/10 rounded-[50px] overflow-hidden h-[750px] shadow-[0_40px_100px_rgba(0,0,0,1)] relative">
              <TradingViewWidget />
           </div>

           {/* 2. ANALÍTICA DE SENTIMIENTO */}
           <div className="lg:col-span-4 space-y-6">
              <div className="glass-card bg-gradient-to-br from-[#FFD700]/10 to-transparent border-[#FFD700]/20 p-10 rounded-[50px] h-[450px] flex flex-col justify-between overflow-hidden relative group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={150} />
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#FFD700] mb-8 flex items-center gap-3">
                       <Zap size={18} className="fill-[#FFD700]" /> Sentimiento del Mercado
                    </h3>
                    <TechnicalGaugeWidget />
                 </div>
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-6 italic">* Análisis técnico basado en 20+ indicadores técnicos en tiempo real.</p>
              </div>

              {/* 3. CALENDARIO DE ALTO IMPACTO */}
              <div className="glass-card bg-white/[0.01] border-white/5 p-8 rounded-[50px] h-[275px] overflow-hidden group hover:border-white/10 transition-all">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6 flex items-center gap-3">
                    <Clock size={16} /> Próximos Eventos Críticos
                 </h3>
                 <div className="h-full overflow-y-auto no-scrollbar">
                    <EconomicCalendarWidget />
                 </div>
              </div>
           </div>
        </div>

        {/* --- SEGUNDO NIVEL DE DATOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* 4. VISIÓN DEL MERCADO GLOBAL */}
           <div className="lg:col-span-7 glass-card bg-black border-white/10 rounded-[50px] overflow-hidden h-[650px] shadow-2xl">
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Globe className="text-blue-500" size={24} />
                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Índices y Commodities Mundiales</h3>
                 </div>
                 <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Sincronización Directa</span>
              </div>
              <div className="h-full p-4">
                 <MarketOverviewWidget />
              </div>
           </div>

           {/* 5. SEÑALES DE ORO (TRADUCIDO A ACCIÓN) */}
           <div className="lg:col-span-5 space-y-6">
              <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[50px] space-y-10">
                 <h3 className="text-xl font-black uppercase italic tracking-widest flex items-center gap-4">
                    <BarChart3 className="text-[#FFD700]" /> HAWKIN <span className="text-[#FFD700]">Alpha</span>
                 </h3>
                 <div className="space-y-6">
                    <div className="p-6 bg-black/40 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-green-500/30 transition-all">
                       <div>
                          <p className="text-[9px] font-black text-green-400 uppercase mb-2">Señal Sugerida</p>
                          <h4 className="text-lg font-black uppercase">Bitcoin (BTC)</h4>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-white">LONG</p>
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Entrada: $92,500</p>
                       </div>
                    </div>
                    <div className="p-6 bg-black/40 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-purple-500/30 transition-all">
                       <div>
                          <p className="text-[9px] font-black text-purple-400 uppercase mb-2">Oportunidad DeFi</p>
                          <h4 className="text-lg font-black uppercase">Solana (SOL)</h4>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-white">MANTENER</p>
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Target: $210.00</p>
                       </div>
                    </div>
                 </div>
                 <button className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-[#FFD700] transition-colors shadow-2xl">
                    Ver Portafolio de Julhianno
                 </button>
              </div>

              {/* FEED DE NOTICIAS ORO */}
              <div className="space-y-4 pr-2">
                 <div className="flex items-center gap-4 px-4">
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Gold Intel Feed</h3>
                 </div>
                 {news.slice(0, 3).map((item, i) => (
                    <div key={i} className="p-6 glass-card bg-white/[0.01] border-white/5 rounded-[30px] hover:border-[#FFD700]/30 transition-all group">
                       <h4 className="text-sm font-bold leading-tight group-hover:text-[#FFD700] transition-colors">{item.title}</h4>
                       <div className="mt-3 flex justify-between items-center">
                          <span className="text-[8px] font-black text-[#FFD700] uppercase">{item.source}</span>
                          <ExternalLink size={10} className="text-gray-600" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* --- CLAÚSULA DE PROFESIONALISMO --- */}
        <section className="mt-40 text-center space-y-12">
           <div className="max-w-4xl mx-auto p-16 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[60px] relative overflow-hidden">
              <ShieldCheck className="mx-auto text-[#FFD700] mb-8 animate-pulse" size={60} />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Protocolo HAWKIN <span className="text-gray-500">Gold Standard.</span></h2>
              <p className="text-gray-400 text-base leading-relaxed font-light mt-8 italic max-w-2xl mx-auto">
                "Esta terminal no utiliza datos retrasados. <b className="text-white uppercase">Cada vela y cada decimal</b> que ves proviene directamente de los servidores de intercambio de nivel institucional. Estás viendo la realidad financiera antes que el resto del mundo."
              </p>
              <div className="mt-12 flex justify-center gap-8 opacity-40 grayscale">
                 <span className="text-[10px] font-black uppercase tracking-widest">Nodos: Tokyo</span>
                 <span className="text-[10px] font-black uppercase tracking-widest">Nodos: New York</span>
                 <span className="text-[10px] font-black uppercase tracking-widest">Nodos: London</span>
              </div>
           </div>
        </section>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
