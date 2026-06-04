'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, TriangleAlert, Users, Target, 
  Cpu, Rocket, LoaderCircle, Sparkles, Swords, Info, 
  ArrowUpRight, Globe, Clock, Activity, Terminal, Flame
} from 'lucide-react';

export default function MasterIntel() {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('es-PE'));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-PE'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const logMessages = [
      "Inyectando datos de satélite...",
      "Escaneando rumores Alpha...",
      "Analizando movimientos en NVIDIA...",
      "Sincronizando núcleo HAWKIN...",
      "Filtro de inteligencia activo."
    ];
    const interval = setInterval(() => {
      const msg = `[${new Date().toLocaleTimeString('es-PE')}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}`;
      setLogs(prev => [msg, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchIntel = async () => {
    try {
      const res = await fetch('/api/news/master-intel');
      const data = await res.json();
      setIntel(data);
    } catch (e) {
      console.error("Master Intel Error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
    const interval = setInterval(fetchIntel, 60000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-32 bg-[#020202] border border-cyan-500/20 rounded-[80px] text-center space-y-12 shadow-[0_0_100px_rgba(34,211,238,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="relative z-10 space-y-8">
           <LoaderCircle className="animate-spin text-cyan-500 mx-auto" size={80} />
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-[0.8em] text-cyan-400 animate-pulse">SINCRO NÚCLEO ALPHA</h2>
              <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">Cargando flujos de inteligencia en tiempo real...</p>
           </div>
        </div>
      </div>
    );
  }

  // Sanitización de datos para evitar crashes
  const topNews = intel?.topNews || [];
  const rumors = intel?.rumors || [];
  const battles = intel?.battles || [];
  const trendingCEOs = intel?.trendingCEOs || [];
  const prediction = intel?.prediction || { dominance: "Análisis...", ceo: "Calculando...", risk: "Bajo" };

  return (
    <div className="space-y-32">
      
      {/* BARRA DE ESTADO */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-3xl sticky top-24 z-[1000]">
         <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-white/5">
            <Clock size={16} className="text-cyan-400" />
            <div className="flex flex-col text-left">
               <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Sincronización</span>
               <span className="text-xs font-black text-white">{currentTime}</span>
            </div>
         </div>
         <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-white/5 text-left">
            <Activity size={16} className="text-green-500" />
            <div className="flex flex-col">
               <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Estado Nodo</span>
               <span className="text-xs font-black text-green-500 uppercase">Operativo 100%</span>
            </div>
         </div>
         <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-white/5 md:col-span-2 text-left">
            <Terminal size={16} className="text-blue-500" />
            <div className="flex-1 overflow-hidden">
               <AnimatePresence mode="wait">
                  <motion.p key={logs[0]} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[9px] font-mono text-blue-400 uppercase truncate">
                    {logs[0] || "Interceptando señales..."}
                  </motion.p>
               </AnimatePresence>
            </div>
         </div>
      </section>

      {topNews.length === 0 ? (
        <div className="p-20 bg-red-500/5 border-2 border-dashed border-red-500/20 rounded-[60px] text-center space-y-6">
           <TriangleAlert className="text-red-500 mx-auto" size={48} />
           <h3 className="text-xl font-black uppercase text-white tracking-tighter">Fallo de Satélite</h3>
           <button onClick={fetchIntel} className="px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all">Reintentar Sincro</button>
        </div>
      ) : (
        <>
          {/* TOP 10 NOTICIAS */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/10 pb-10 text-left">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_#dc2626]" />
                     <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Intel Alpha: {topNews.length} Reportes</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none">
                    Top 10 <span className="bg-gradient-to-r from-gray-200 to-gray-600 bg-clip-text text-transparent">Noticias.</span>
                  </h2>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic">Live Feed Active</p>
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{intel.lastUpdate}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {topNews.map((news: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative text-left">
                  <Link href={`/news/${news.id}`} className="block h-full">
                    <div className="p-0 rounded-[60px] bg-[#080808] border border-white/[0.03] hover:border-cyan-500/40 transition-all duration-700 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col h-full">
                      
                      {news.image && (
                        <div className="h-48 w-full overflow-hidden relative">
                           <img src={news.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                        </div>
                      )}

                      <div className={`absolute top-0 left-0 w-1.5 h-full ${news.importance === 'CRITICO' ? 'bg-red-600' : 'bg-cyan-500'}`} />
                      
                      <div className="p-12 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                          <span className={`text-[9px] font-black px-5 py-2 rounded-full tracking-widest ${news.importance === 'CRITICO' ? 'bg-red-600 text-white' : 'bg-cyan-500 text-black'}`}>
                            {news.importance || 'ALTO'}
                          </span>
                          <span className="text-xs font-black text-white italic">IMPACTO {news.impact}/10</span>
                        </div>

                        <h3 className="text-3xl font-black uppercase italic leading-[0.95] text-white group-hover:text-cyan-400 transition-colors mb-8 tracking-tighter">
                          {news.title}
                        </h3>
                        
                        <p className="text-gray-400 text-base font-light mb-10 leading-relaxed line-clamp-3">
                          {news.summary}
                        </p>

                        <div className="mt-auto space-y-8">
                           <div className="grid grid-cols-2 gap-6 border-y border-white/5 py-8">
                              {news.companies?.length > 0 && (
                                <div>
                                   <p className="text-[8px] font-black text-gray-600 uppercase mb-2">Empresas</p>
                                   <div className="flex flex-wrap gap-2">
                                      {news.companies.map((c: string, idx: number) => (
                                        <span key={idx} className="text-[8px] bg-white/5 px-3 py-1 rounded text-white font-bold">{c}</span>
                                      ))}
                                   </div>
                                </div>
                              )}
                              {news.people?.length > 0 && (
                                <div>
                                   <p className="text-[8px] font-black text-gray-600 uppercase mb-2">Líderes</p>
                                   <div className="flex flex-wrap gap-2">
                                      {news.people.map((p: string, idx: number) => (
                                        <span key={idx} className="text-[8px] bg-cyan-500/10 px-3 py-1 rounded text-cyan-400 font-bold">{p}</span>
                                      ))}
                                   </div>
                                </div>
                              )}
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase">
                              <Clock size={12} className="text-cyan-500" /> {news.date || 'Sincronizado'}
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 2: RUMORES Y CONFLICTOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 text-left">
             <section className="space-y-12">
                <div className="flex items-center justify-between border-b-2 border-purple-600 pb-6">
                   <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Dark <span className="text-purple-500">Rumors.</span></h3>
                   <TriangleAlert size={32} className="text-purple-600 animate-pulse" />
                </div>
                <div className="space-y-8">
                   {rumors.map((r: any, i: number) => (
                     <motion.div key={i} whileHover={{ x: 10 }} className="p-10 bg-[#0A0A0A] rounded-[50px] border border-white/5 relative group overflow-hidden">
                        <p className="text-xl text-gray-200 font-medium italic leading-relaxed relative z-10">"{r.text}"</p>
                        <div className="flex justify-between items-center mt-8 relative z-10">
                           <span className="text-[10px] font-black uppercase text-gray-500">{r.source}</span>
                           <span className="bg-purple-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase shadow-lg shadow-purple-600/20">{r.probability} Prob.</span>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </section>

             <section className="space-y-12 text-left">
                <div className="flex items-center justify-between border-b-2 border-red-600 pb-6">
                   <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">War <span className="text-red-500">Zone.</span></h3>
                   <Swords size={32} className="text-red-600 animate-bounce" />
                </div>
                <div className="space-y-8">
                   {battles.map((b: any, i: number) => (
                     <motion.div key={i} whileHover={{ x: -10 }} className="p-10 bg-[#0A0A0A] rounded-[50px] border border-white/5 relative overflow-hidden">
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{b.competitors}</h4>
                        <p className="text-base text-gray-500 font-light leading-relaxed mb-8">{b.motive}</p>
                        <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                           <span className="text-sm font-black text-red-500 uppercase">{b.status}</span>
                           <span className="text-sm font-black text-green-500 uppercase">🏆 {b.winners}</span>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </section>
          </div>

          {/* SECCIÓN 3: CEOs WATCH & ALPHA PREDICTION */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
             <div className="lg:col-span-2 p-16 rounded-[70px] bg-[#050505] border border-white/5 relative overflow-hidden shadow-2xl">
                <h4 className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500 mb-12 flex items-center gap-4"><Users size={20} /> CEOs Watch Ranking</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                   {trendingCEOs.map((ceo: any, i: number) => (
                     <div key={i} className="flex justify-between items-center gap-6 pb-6 border-b border-white/5 group/ceo">
                        <div>
                           <p className="text-lg font-black text-white uppercase tracking-tighter group-hover/ceo:text-cyan-400 transition-colors">{ceo.name}</p>
                           <p className="text-[9px] text-gray-600 font-bold uppercase">{ceo.company}</p>
                        </div>
                        <span className="text-[8px] bg-cyan-500 text-black px-3 py-1.5 rounded-full font-black uppercase">{ceo.reason}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-16 rounded-[70px] bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-transparent border-2 border-cyan-500/30 relative overflow-hidden shadow-2xl">
                <h4 className="text-xs font-black uppercase tracking-[0.5em] text-white mb-12 flex items-center gap-4"><Target size={20} className="text-cyan-400" /> Alpha Prediction</h4>
                <div className="space-y-10">
                   <div>
                      <p className="text-[9px] font-black text-gray-700 uppercase mb-2">Dominancia Global</p>
                      <p className="text-2xl font-black text-white italic">{prediction.dominance}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-700 uppercase mb-2">Líder en Ascenso</p>
                      <p className="text-2xl font-black text-white italic">{prediction.ceo}</p>
                   </div>
                   <div className="p-8 bg-red-600/10 border border-red-600/30 rounded-[40px]">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em] mb-3">Protocolo de Riesgo</p>
                      <p className="text-lg font-black text-red-500 uppercase italic">{prediction.risk || 'Bajo'}</p>
                   </div>
                </div>
             </div>
          </section>
        </>
      )}

      <div className="pt-20 text-center border-t border-white/5 opacity-30">
         <p className="text-[9px] font-black text-gray-500 uppercase tracking-[1.5em] animate-pulse">HAWKIN COMMAND CENTER • DECRYPTING THE FUTURE • GLOBAL INTEL FEED ACTIVE</p>
      </div>
    </div>
  );
}
