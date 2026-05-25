'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { TrendingUp, TrendingDown, Landmark, Coins, PieChart, Activity, ExternalLink } from 'lucide-react';

export default function GoldPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<any>({ btc: "0", eth: "0", sol: "0" });

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

    // Simulación de precios en tiempo real para 2026
    const interval = setInterval(() => {
      setPrices({
        btc: (95000 + Math.random() * 500).toLocaleString(),
        eth: (4800 + Math.random() * 50).toLocaleString(),
        sol: (185 + Math.random() * 5).toLocaleString()
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      {/* SECCIÓN HERO GOLD */}
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <header className="text-center space-y-8 mb-24">
          <span className="text-[#FFD700] font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">HAWKIN GOLD INTELLIGENCE</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
            El Radar <br />
            <span className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent italic shadow-[0_0_30px_rgba(255,215,0,0.2)]">Financiero.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">
            Monitoreo en tiempo real de criptomonedas, ballenas de Bitcoin y mercados globales. Solo para inversionistas de élite.
          </p>
        </header>

        {/* TICKER DE PRECIOS CRIPTO (ORO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
           <div className="glass-card border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/5 to-transparent p-8 rounded-[40px] flex items-center justify-between group hover:border-[#FFD700]/50 transition-all">
              <div>
                 <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest mb-2">Bitcoin (BTC)</p>
                 <h4 className="text-4xl font-black italic">${prices.btc}</h4>
              </div>
              <TrendingUp className="text-green-500" size={40} />
           </div>
           <div className="glass-card border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/5 to-transparent p-8 rounded-[40px] flex items-center justify-between group hover:border-[#FFD700]/50 transition-all">
              <div>
                 <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest mb-2">Ethereum (ETH)</p>
                 <h4 className="text-4xl font-black italic">${prices.eth}</h4>
              </div>
              <TrendingUp className="text-green-400" size={40} />
           </div>
           <div className="glass-card border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/5 to-transparent p-8 rounded-[40px] flex items-center justify-between group hover:border-[#FFD700]/50 transition-all">
              <div>
                 <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest mb-2">Solana (SOL)</p>
                 <h4 className="text-4xl font-black italic">${prices.sol}</h4>
              </div>
              <TrendingDown className="text-red-500" size={40} />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* FEED DE NOTICIAS CRIPTO LIVE */}
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center gap-4">
               <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-ping" />
               <h2 className="text-3xl font-black uppercase italic tracking-widest">Live <span className="text-[#FFD700]">Gold Feed</span></h2>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-8">
                {news.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="p-8 glass-card border-white/5 bg-white/[0.01] rounded-[35px] hover:border-[#FFD700]/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[9px] font-black text-[#FFD700] border border-[#FFD700]/30 px-3 py-1 rounded-full uppercase tracking-tighter">{item.source}</span>
                       <span className="text-[9px] font-bold text-gray-600 uppercase italic">{new Date(item.date).toLocaleTimeString()}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black mb-4 group-hover:text-[#FFD700] transition-colors leading-tight">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.content}</p>
                    <a href={item.link} target="_blank" className="text-[10px] font-black uppercase text-white border-b border-white/20 pb-1 hover:border-[#FFD700] hover:text-[#FFD700] transition-all flex items-center gap-2 w-fit">
                       Leer Análisis Completo <ExternalLink size={12} />
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR ANALÍTICO */}
          <div className="space-y-12">
             <div className="p-10 bg-gradient-to-br from-[#FFD700]/20 to-transparent border border-[#FFD700]/10 rounded-[50px] space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Landmark size={120} className="text-[#FFD700]" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-[#FFD700]">Manual del <br />Inversionista</h3>
                <p className="text-xs text-gray-400 leading-relaxed uppercase font-bold tracking-widest">Acceso exclusivo a estrategias de arbitraje y señales de mercado de alta frecuencia.</p>
                <button className="w-full py-5 bg-[#FFD700] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all shadow-[0_10px_40px_rgba(255,215,0,0.3)]">Desbloquear Alpha</button>
             </div>

             <div className="p-8 glass-card border-white/5 bg-white/[0.02] rounded-[40px] space-y-6">
                <h4 className="text-sm font-black uppercase tracking-widest border-b border-white/5 pb-4 italic flex items-center gap-3">
                   <Activity size={16} className="text-blue-500" /> Mercados Mundiales
                </h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">NASDAQ</span>
                      <span className="text-xs font-black text-green-400">+1.24%</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">S&P 500</span>
                      <span className="text-xs font-black text-green-400">+0.85%</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">DXY (Dólar)</span>
                      <span className="text-xs font-black text-red-400">-0.12%</span>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-[40px] text-center">
                <Coins className="mx-auto text-[#FFD700] mb-4" />
                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Próximo Halving</h5>
                <p className="text-2xl font-black mt-2 italic text-white">342 Días</p>
             </div>
          </div>

        </div>
      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
