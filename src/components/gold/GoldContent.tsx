'use client';

// HAWKIN GOLD v4.9 - SISTEMA ALPHA ID
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import SponsorSpace from '@/components/SponsorSpace';
import { useAlpha } from '@/context/AlphaContext';
import { 
  Activity, ShieldCheck, Zap, Globe, Clock, Bell, BellRing, 
  LoaderCircle, ChartNoAxesColumn, TrendingUp, LayoutGrid, Radio, 
  ExternalLink, Info 
} from 'lucide-react';

// CARGA DINÁMICA DE WIDGETS
const TickerTapeWidget = dynamic(() => import('@/components/TickerTapeWidget'), { ssr: false });
const TradingViewWidget = dynamic(() => import('@/components/TradingViewWidget'), { ssr: false });
const TechnicalGaugeWidget = dynamic(() => import('@/components/TechnicalGaugeWidget'), { ssr: false });
const MarketOverviewWidget = dynamic(() => import('@/components/MarketOverviewWidget'), { ssr: false });
const EconomicCalendarWidget = dynamic(() => import('@/components/EconomicCalendarWidget'), { ssr: false });
const CryptoHeatMapWidget = dynamic(() => import('@/components/CryptoHeatMapWidget'), { ssr: false });

export default function GoldPage() {
  const { user } = useAlpha();
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
      <LoaderCircle className="animate-spin text-[#FFD700]" size={40} />
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
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black">
      <Header />
      
      <div className="fixed top-[88px] left-0 w-full z-[900] bg-black/80 backdrop-blur-xl border-y border-white/5 h-12 flex items-center overflow-hidden">
         <TickerTapeWidget />
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[1100] px-8 py-4 bg-green-500 text-black rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-[0_0_50px_rgba(34,197,94,0.4)]"
          >
            <ShieldCheck size={16} /> Conexión con Satélite Financiero Establecida
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1900px] mx-auto px-6 pt-56 pb-32">
        
        {/* PUBLICIDAD DE ALTO IMPACTO GOLD */}
        <div className="mb-16">
           <SponsorSpace isPremium={!!user} type="banner" />
        </div>

        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-12 border-l-4 border-[#FFD700] pl-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-pulse shadow-[0_0_15px_#FFD700]" />
                 <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.6em]">Terminal Alpha Gold v4.9</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">Intelligence <span className="text-gray-700">Hub.</span></h1>
           </div>
           
           <div className="flex flex-wrap gap-6">
              <button 
                onClick={handleActivateAlerts}
                disabled={isAlertActive || isConnecting}
                className={`px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center gap-4 border-2 ${isAlertActive ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-white text-black hover:bg-[#FFD700] hover:border-[#FFD700]'}`}
              >
                {isConnecting ? <LoaderCircle className="animate-spin" size={16} /> : <BellRing size={16} />}
                {isAlertActive ? 'Alertas Globales Activas' : 'Sincronizar Señales'}
              </button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
           {/* GRÁFICO MAESTRO */}
           <div className="lg:col-span-8 glass-card bg-[#050505] border-white/5 rounded-[60px] overflow-hidden min-h-[700px] shadow-2xl relative group">
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                 <div className="flex items-center gap-4">
                    <Activity className="text-cyan-500" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Monitor de Flujo de Capital (Nivel 10)</h3>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-[8px] font-bold uppercase tracking-widest border border-green-500/20">Live Stream</span>
                 </div>
              </div>
              <div className="h-[600px] w-full">
                 <TradingViewWidget />
              </div>
              <div className="absolute bottom-6 right-10 flex items-center gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
                 <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Sincronización Satelital: Activa</span>
              </div>
           </div>

           {/* INSIGHTS Y CALENDARIO */}
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-card bg-[#050505] border-white/5 rounded-[60px] p-10 h-[340px] shadow-xl hover:border-cyan-500/30 transition-all overflow-hidden relative group">
                 <div className="absolute -top-10 -right-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><TrendingUp size={200} /></div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-8 flex items-center gap-3">
                    <Zap size={14} /> Señales Alpha
                 </h3>
                 <div className="space-y-6">
                    {insights.map((insight, i) => (
                      <div key={i} className="flex gap-4 border-l-2 border-white/5 pl-6 py-1 hover:border-cyan-500 transition-all">
                         <div className="space-y-1">
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{insight.type}</p>
                            <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight">{insight.text}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-card bg-[#050505] border-white/5 rounded-[60px] p-4 h-[340px] shadow-xl relative overflow-hidden">
                 <div className="p-6 border-b border-white/5 mb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 flex items-center gap-3">
                       <Clock size={14} /> Calendario de Eventos
                    </h3>
                 </div>
                 <EconomicCalendarWidget />
              </div>
           </div>
        </div>

        {/* FEED DE NOTICIAS GOLD */}
        <div className="mb-24 space-y-12">
           <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-[#FFD700]" />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Últimos Movimientos Estratégicos</h2>
           </div>

           {loading ? (
             <div className="py-20 text-center">
                <LoaderCircle className="animate-spin text-[#FFD700] mx-auto" size={32} />
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

           {/* PUBLICIDAD DE IMPACTO GOLD */}
           <div className="pt-10">
              <SponsorSpace isPremium={!!user} type="inline" />
           </div>
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
