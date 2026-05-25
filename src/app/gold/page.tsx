'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import TradingViewWidget from '@/components/TradingViewWidget';
import { TrendingUp, Activity, ExternalLink, ShieldCheck, Zap, Globe, Coins, ArrowUpRight } from 'lucide-react';

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

  const signals = [
    { pair: 'BTC/USDT', action: 'COMPRA FUERTE', price: '$94,200', confidence: '98%', color: 'text-green-400' },
    { pair: 'ETH/USDT', action: 'MANTENER', price: '$4,850', confidence: '85%', color: 'text-yellow-400' },
    { pair: 'SOL/USDT', action: 'VENTA SUGERIDA', price: '$189.2', confidence: '72%', color: 'text-red-400' },
  ];

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <div className="max-w-[1600px] mx-auto px-6 pt-40 pb-32">
        <header className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full">
             <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-ping" />
             <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em]">Terminal Financiera Live</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">
            HAWKIN <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">GOLD.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
            Gráficos institucionales con latencia cero y señales de inversión de alta frecuencia.
          </p>
        </header>

        {/* 1. SECCIÓN DE TRADING PROFESIONAL (EL CORAZÓN) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-20">
           
           {/* Gráfico Institucional (Ocupa 3 columnas) */}
           <div className="xl:col-span-3 glass-card border-[#FFD700]/10 bg-black rounded-[40px] overflow-hidden shadow-2xl h-[650px]">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-4">
                    <Activity className="text-[#FFD700]" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Gráfico de Alta Precisión • Real Time</span>
                 </div>
                 <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">Directo desde Binance</span>
              </div>
              <TradingViewWidget />
           </div>

           {/* Alpha Signals (Señales de Inversión) */}
           <div className="space-y-8">
              <div className="p-8 glass-card border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-[40px] shadow-2xl relative overflow-hidden h-full">
                 <div className="relative z-10 flex flex-col h-full">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-[#FFD700] mb-8">ALPHA <br />SIGNALS</h3>
                    
                    <div className="space-y-6 flex-1">
                       {signals.map((sig, i) => (
                         <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl hover:border-[#FFD700]/30 transition-all group">
                            <div className="flex justify-between items-center mb-3">
                               <span className="text-xs font-black text-white">{sig.pair}</span>
                               <ArrowUpRight className="text-[#FFD700] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
                            </div>
                            <div className="flex justify-between items-end">
                               <div>
                                  <p className={`text-[10px] font-black uppercase mb-1 ${sig.color}`}>{sig.action}</p>
                                  <p className="text-lg font-black">{sig.price}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[8px] font-bold text-gray-500 uppercase">Confianza</p>
                                   <p className="text-xs font-black text-[#FFD700]">{sig.confidence}</p>
                                </div>
                            </div>
                         </div>
                       ))}
                    </div>

                    <button className="mt-8 w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#FFD700] transition-colors shadow-2xl">Activar Alertas Pro</button>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. NOTICIAS Y ANÁLISIS GLOBAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center gap-4">
               <Globe className="text-[#FFD700]" size={24} />
               <h2 className="text-3xl font-black uppercase italic tracking-widest">Global <span className="text-[#FFD700]">Finance Feed</span></h2>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {news.map((item, i) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} key={i} 
                    className="p-8 glass-card border-white/5 bg-white/[0.01] rounded-[35px] hover:border-[#FFD700]/30 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                         <span className="text-[9px] font-black text-[#FFD700] border border-[#FFD700]/30 px-3 py-1 rounded-full uppercase">{item.source}</span>
                         <div className="flex items-center gap-2 text-green-500">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold uppercase">Urgente</span>
                         </div>
                      </div>
                      <h3 className="text-lg font-black mb-4 group-hover:text-[#FFD700] transition-colors leading-tight">{item.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-8">{item.content}</p>
                    </div>
                    <a href={item.link} target="_blank" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#FFD700] transition-all flex items-center gap-2">
                       Ver Datos del Mercado <ExternalLink size={12} />
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* EDUCACIÓN Y ESTRATEGIA */}
          <div className="space-y-12">
             <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[50px] space-y-8">
                <div className="flex items-center gap-4 text-cyan-400">
                   <ShieldCheck size={32} />
                   <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">Inversión <br />Segura</h4>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-light italic">
                  "El mercado no paga por adivinar, paga por esperar. En HAWKIN GOLD filtramos el ruido para darte solo los datos que mueven el capital."
                </p>
                <div className="pt-6 border-t border-white/5 space-y-4">
                   <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      <Zap size={12} className="text-[#FFD700]" /> Estrategia: Swing Trading
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      <Zap size={12} className="text-[#FFD700]" /> Riesgo: Moderado-Alto
                   </div>
                </div>
             </div>

             <div className="p-10 bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/20 rounded-[50px] text-center space-y-6">
                <Coins className="mx-auto text-purple-400" size={40} />
                <h5 className="text-sm font-black uppercase tracking-widest">Ecosistema DeFi</h5>
                <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold tracking-widest">Explora protocolos de staking y liquidez avanzada con la guía de Julhianno.</p>
                <button className="w-full py-4 bg-purple-600 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl hover:bg-white hover:text-black transition-all">Ver Academia GOLD</button>
             </div>
          </div>
        </div>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
