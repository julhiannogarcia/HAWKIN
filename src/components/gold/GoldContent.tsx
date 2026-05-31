'use client';

// HAWKIN GOLD v4.8 - REPARACIÓN DE ESTABILIDAD Y FECHAS
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import TickerTapeWidget from '@/components/TickerTapeWidget';
import TradingViewWidget from '@/components/TradingViewWidget';
import TechnicalGaugeWidget from '@/components/TechnicalGaugeWidget';
import MarketOverviewWidget from '@/components/MarketOverviewWidget';
import EconomicCalendarWidget from '@/components/EconomicCalendarWidget';
import CryptoHeatMapWidget from '@/components/CryptoHeatMapWidget';
import { Activity, ShieldCheck, Zap, Globe, Clock, Bell, BellRing, Loader2, ChartNoAxesColumn, TrendingUp, LayoutGrid, Radio, ExternalLink, Info } from 'lucide-react';

export default function GoldPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadGoldData = async () => {
      try {
        const res = await fetch('/api/news/gold');
        const data = await res.json();
        setNews(data.news || []);
        setInsights(data.insights || []);
      } catch (e) {
        console.error("Error loading Gold news", e);
      } finally {
        setLoading(false);
      }
    };
    loadGoldData();
  }, []);

  if (!isMounted) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-[#FFD700]" size={40} />
    </div>
  );

  const handleActivateAlerts = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsAlertActive(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 2000);
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "Recién lanzado" : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "En vivo";
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black overflow-x-hidden">
      <Header />
      
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
                  <h4 className="font-black uppercase text-sm italic tracking-tighter">ALPHA SINCRONIZADO</h4>
                  <p className="text-[10px] font-bold uppercase opacity-80">Manual de inversión activo.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1900px] mx-auto px-6 pt-56 pb-32">
        
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-12 border-l-4 border-[#FFD700] pl-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-3">
                  <Radio className="text-red-500 animate-pulse" size={14} />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Transmisión GOLD Live</span>
               </div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
              Donde <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">Invertir.</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl font-light italic">
              "En HAWKIN GOLD no solo ves el precio, ves la estrategia. Los datos son el nuevo petróleo de la élite."
            </p>
          </div>
          
          <button onClick={handleActivateAlerts} disabled={isAlertActive || isConnecting}
            className={`px-12 py-8 rounded-[40px] transition-all flex items-center gap-8 ${isAlertActive ? 'bg-green-500 text-black shadow-[0_0_50px_rgba(34,197,94,0.4)]' : 'bg-[#FFD700] text-black hover:scale-105 shadow-[0_20px_50px_rgba(255,215,0,0.2)]'}`}>
             <div className="text-left">
                <p className="text-[8px] font-black opacity-60 uppercase mb-1">Estatus del Terminal</p>
                <p className="text-lg font-black uppercase tracking-widest">{isConnecting ? 'CONECTANDO...' : isAlertActive ? 'ESTRATEGIA ACTIVA' : 'ACTIVAR SEÑALES PRO'}</p>
             </div>
             {isConnecting ? <Loader2 className="animate-spin" size={32} /> : <Zap className={isAlertActive ? 'fill-black' : ''} size={32} />}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
           <div className="lg:col-span-8 glass-card bg-black border-white/10 rounded-[60px] overflow-hidden h-[850px] shadow-[0_60px_120px_rgba(0,0,0,1)] relative">
              <TradingViewWidget />
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="glass-card bg-white/[0.02] border-[#FFD700]/20 p-10 rounded-[60px] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <TrendingUp size={150} />
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#FFD700] mb-8 flex items-center gap-3">
                       <ShieldCheck size={18} className="fill-[#FFD700]" /> IA ALPHA INSIGHTS
                    </h3>
                    
                    <div className="space-y-6">
                       {insights.map((ins, i) => (
                         <div key={i} className="p-5 bg-black/40 border border-white/5 rounded-3xl group hover:border-[#FFD700]/40 transition-all">
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-xs font-black text-white">{ins.asset}</span>
                               <span className={`text-[9px] font-black px-3 py-1 rounded-full ${ins.advice === 'ACUMULAR' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{ins.advice}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 italic leading-relaxed">{ins.reason}</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 <button className="mt-8 w-full py-5 border border-[#FFD700]/30 text-[#FFD700] font-black uppercase tracking-widest text-[9px] rounded-2xl hover:bg-[#FFD700] hover:text-black transition-all">Ver Manual Completo</button>
              </div>

              <div className="glass-card bg-gradient-to-br from-[#FFD700]/5 to-transparent border-white/5 p-10 rounded-[60px] h-[375px] overflow-hidden">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 flex items-center gap-3">
                    <Clock size={16} /> Próximos Eventos Críticos
                 </h3>
                 <div className="h-full overflow-y-auto no-scrollbar pb-10">
                    <EconomicCalendarWidget />
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8 mb-20">
           <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#FFD700] rounded-full" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Último Minuto: <span className="text-gray-500">Mundo Cripto y Financiero</span></h2>
           </div>

           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[50px] animate-pulse" />)}
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item, i) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} key={i} 
                    className="p-10 glass-card border-white/5 bg-white/[0.01] rounded-[50px] hover:border-[#FFD700]/30 transition-all group flex flex-col justify-between"
                  >
                    <div>
                       <div className="flex justify-between items-start mb-8">
                          <span className="text-[9px] font-black text-[#FFD700] border border-[#FFD700]/30 px-4 py-1.5 rounded-full uppercase tracking-widest">{item.source}</span>
                          <span className="text-[9px] font-bold text-gray-600 uppercase italic">{formatTime(item.date)}</span>
                       </div>
                       <h3 className="text-xl font-black leading-tight group-hover:text-[#FFD700] transition-colors mb-6">{item.title}</h3>
                       <p className="text-gray-500 text-xs leading-relaxed mb-10 line-clamp-3">{item.excerpt || item.content}</p>
                    </div>
                    <a href={item.link} target="_blank" className="p-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase text-gray-400 hover:bg-[#FFD700] hover:text-black transition-all flex items-center justify-center gap-3">
                       Analizar Datos <ExternalLink size={12} />
                    </a>
                  </motion.div>
                ))}
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-6 glass-card bg-black border-white/5 rounded-[60px] overflow-hidden h-[600px] shadow-2xl">
              <div className="p-10 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
                 <LayoutGrid className="text-[#FFD700]" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-[0.3em]">Concentración de Liquidez (Market Heatmap)</h3>
              </div>
              <div className="h-full p-4">
                 <CryptoHeatMapWidget />
              </div>
           </div>

           <div className="lg:col-span-6 glass-card bg-black border-white/5 rounded-[60px] overflow-hidden h-[600px] shadow-2xl">
              <div className="p-10 border-b border-white/5 flex items-center gap-4 bg-white/[0.01]">
                 <Globe className="text-blue-500" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-[0.3em]">Índices Globales y Metales</h3>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 border-b border-white/5 pb-4">Gold Sponsor</h4>
                 <AdSpace isPremium={false} type="sidebar" />
              </div>

              <div className="h-full p-4">
                 <MarketOverviewWidget />
              </div>
           </div>
        </div>

      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
