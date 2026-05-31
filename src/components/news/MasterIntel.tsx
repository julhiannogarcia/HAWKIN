'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, TriangleAlert, Users, Target, 
  Cpu, Rocket, Loader2, Sparkles, Swords, Info, 
  ArrowUpRight, Globe, Clock, Activity, Terminal, Flame
} from 'lucide-react';

export default function MasterIntel() {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('es-PE'));

  // Sincronización del reloj al segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-PE'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulación de Log de Inteligencia Táctica
  useEffect(() => {
    const logMessages = [
      "Inyectando datos de satélite...",
      "Escaneando rumores en Silicon Valley...",
      "Analizando movimientos en la SEC...",
      "Detectando fluctuaciones en NVIDIA...",
      "Sincronizando con el núcleo HAWKIN...",
      "Interceptando comunicaciones en San Francisco...",
      "Filtro de inteligencia Alpha activo."
    ];
    
    const interval = setInterval(() => {
      const msg = `[${new Date().toLocaleTimeString('es-PE')}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}`;
      setLogs(prev => [msg, ...prev].slice(0, 5));
    }, 3000);
    
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
           <Loader2 className="animate-spin text-cyan-500 mx-auto" size={80} />
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-[0.8em] text-cyan-400 animate-pulse">WAR ROOM INICIALIZANDO</h2>
              <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">Cargando protocolos de seguridad y canales de inteligencia...</p>
           </div>
        </div>
      </div>
    );
  }

  // UI TÁCTICA MAESTRA
  return (
    <div className="space-y-32">
      
      {/* BARRA DE ESTADO TÁCTICA */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-3xl sticky top-24 z-[1000]">
         <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-white/5">
            <Clock size={16} className="text-cyan-400" />
            <div className="flex flex-col">
               <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Sincronización Alpha</span>
               <span className="text-xs font-black text-white">{currentTime}</span>
            </div>
         </div>
         <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-white/5">
            <Activity size={16} className="text-green-500" />
            <div className="flex flex-col">
               <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Status del Nodo</span>
               <span className="text-xs font-black text-green-500">OPERATIVO 100%</span>
            </div>
         </div>
         <div className="flex items-center gap-4 px-6 py-4 bg-black/40 rounded-2xl border border-white/5 md:col-span-2">
            <Terminal size={16} className="text-blue-500" />
            <div className="flex-1 overflow-hidden">
               <AnimatePresence mode="wait">
                  <motion.p 
                    key={logs[0]}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-[9px] font-mono text-blue-400 uppercase truncate"
                  >
                    {logs[0] || "Esperando flujo de datos..."}
                  </motion.p>
               </AnimatePresence>
            </div>
         </div>
      </section>

      {(!intel || intel.error) ? (
        <div className="p-20 bg-red-500/5 border-2 border-dashed border-red-500/20 rounded-[60px] text-center space-y-6">
           <TriangleAlert className="text-red-500 mx-auto" size={48} />
           <div className="space-y-2">
              <h3 className="text-xl font-black uppercase text-white tracking-tighter">Interferencia Detectada</h3>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{intel?.error || "Fallo en la conexión con el satélite de IA."}</p>
           </div>
           <button onClick={fetchIntel} className="px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Reintentar Sincronización</button>
        </div>
      ) : (
        <>
          {/* SECCIÓN 1: TOP 10 NOTICIAS - EL MENÚ QUE LE GUSTABA AL USUARIO */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/10 pb-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_#dc2626]" />
                     <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Noticias Prioritarias (Top 10)</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none">
                    Top 10 <span className="bg-gradient-to-r from-gray-200 to-gray-600 bg-clip-text text-transparent">Noticias.</span>
                  </h2>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic">Actualización en Vivo</p>
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{intel.lastUpdate}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {intel.topNews?.map((news: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <Link href={`/news/${news.id}`} className="block h-full">
                    <div className="p-0 rounded-[60px] bg-[#050505] border border-white/[0.03] hover:border-cyan-500/40 transition-all duration-700 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col h-full">
                      
                      {/* Imagen de Impacto */}
                      {news.image && (
                        <div className="h-48 w-full overflow-hidden relative">
                           <img src={news.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="Intel" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                        </div>
                      )}

                      {/* Neón lateral dinámico por importancia */}
                      <div className={`absolute top-0 left-0 w-1 h-full ${news.importance === 'CRITICO' ? 'bg-red-600 shadow-[5px_0_20px_rgba(220,38,38,0.5)]' : 'bg-cyan-500 shadow-[5px_0_20px_rgba(34,211,238,0.5)]'}`} />
                      
                      <div className="p-10 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-10 relative z-10">
                          <span className={`text-[9px] font-black px-5 py-2 rounded-full tracking-widest ${news.importance === 'CRITICO' ? 'bg-red-600 text-white' : 'bg-cyan-500 text-black'}`}>
                            {news.importance || 'ALTO'}
                          </span>
                          <div className="flex items-center gap-3">
                             <span className="text-xs font-black text-white italic">IMPACTO {news.impact}/10</span>
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-cyan-400 group-hover:rotate-45 transition-all">
                                <ArrowUpRight size={20} />
                             </div>
                          </div>
                        </div>

                        <h3 className="text-3xl font-black uppercase italic leading-[0.95] text-white group-hover:text-cyan-400 transition-colors mb-8 tracking-tighter">
                          {news.title}
                        </h3>
                        
                        <p className="text-gray-400 text-base font-light mb-10 leading-relaxed line-clamp-3">
                          {news.summary}
                        </p>

                        <div className="mt-auto space-y-8 relative z-10">
                           <div className="grid grid-cols-2 gap-6 border-y border-white/5 py-8">
                              <div>
                                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">Empresas Foco</p>
                                 <div className="flex flex-wrap gap-2">
                                    {news.companies?.map((c: string, idx: number) => (
                                      <span key={idx} className="text-[8px] bg-white/5 px-3 py-1 rounded text-white font-bold">{c}</span>
                                    ))}
                                 </div>
                              </div>
                              <div>
                                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">Líderes Activos</p>
                                 <div className="flex flex-wrap gap-2">
                                    {news.people?.map((p: string, idx: number) => (
                                      <span key={idx} className="text-[8px] bg-cyan-500/10 px-3 py-1 rounded text-cyan-400 font-bold">{p}</span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <div className="p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10">
                              <p className="text-[10px] text-purple-400 font-black uppercase italic leading-tight">
                                 <Sparkles className="inline mr-3" size={14} /> Consecuencia: {news.consequence}
                              </p>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase">
                              <Clock size={12} className="text-cyan-500" /> Inyectado: {new Date(news.timestamp).toLocaleTimeString('es-PE', {hour: '2-digit', minute:'2-digit'})}
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 2: RUMORES Y CONFLICTOS - TACTICAL DARK */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
             <section className="space-y-12">
                <div className="flex items-center justify-between border-b-2 border-purple-600 pb-6">
                   <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                     Dark <span className="text-purple-500">Rumors.</span>
                   </h3>
                   <TriangleAlert size={32} className="text-purple-600 animate-pulse" />
                </div>
                <div className="space-y-8">
                   {intel.rumors?.map((r: any, i: number) => (
                     <motion.div 
                        key={i} 
                        whileHover={{ x: 10 }}
                        className="p-10 bg-[#0A0A0A] rounded-[50px] border border-white/5 shadow-2xl relative group overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform"><Flame size={100} className="text-purple-500" /></div>
                        <p className="text-xl text-gray-200 font-medium mb-8 italic leading-relaxed relative z-10">"{r.text}"</p>
                        <div className="flex justify-between items-center relative z-10">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><Globe size={14} className="text-purple-400" /></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{r.source}</span>
                           </div>
                           <span className="bg-purple-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.3)]">Probabilidad: {r.probability}</span>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </section>

             <section className="space-y-12">
                <div className="flex items-center justify-between border-b-2 border-red-600 pb-6">
                   <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                     War <span className="text-red-500">Zone.</span>
                   </h3>
                   <Swords size={32} className="text-red-600 animate-bounce" />
                </div>
                <div className="space-y-8">
                   {intel.battles?.map((b: any, i: number) => (
                     <motion.div 
                        key={i} 
                        whileHover={{ x: -10 }}
                        className="p-10 bg-[#0A0A0A] rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden"
                     >
                        <div className="flex items-center gap-6 mb-8">
                           <div className="w-12 h-[2px] bg-red-600" />
                           <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{b.competitors}</h4>
                        </div>
                        <p className="text-base text-gray-500 font-light mb-10 leading-relaxed">{b.motive}</p>
                        <div className="grid grid-cols-2 gap-10 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                           <div>
                              <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">Estado de Guerra</p>
                              <p className="text-sm font-black text-red-500 uppercase italic">{b.status}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">Líder del Campo</p>
                              <p className="text-sm font-black text-green-500 uppercase italic">{b.winners}</p>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </section>
          </div>

          {/* SECCIÓN 3: CEOs WATCH & ALPHA PREDICTION */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 p-16 rounded-[70px] bg-[#050505] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full" />
                <h4 className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500 mb-12 flex items-center gap-4">
                   <Users size={20} /> CEOs Watch Ranking
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 relative z-10">
                   {intel.trendingCEOs?.map((ceo: any, i: number) => (
                     <div key={i} className="flex justify-between items-center gap-6 pb-6 border-b border-white/5 group/ceo">
                        <div>
                           <p className="text-lg font-black text-white uppercase tracking-tighter group-hover/ceo:text-cyan-400 transition-colors">{ceo.name}</p>
                           <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{ceo.company}</p>
                        </div>
                        <span className="text-[8px] bg-cyan-500 text-black px-3 py-1.5 rounded-full font-black uppercase shadow-lg shadow-cyan-500/20">{ceo.reason}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-16 rounded-[70px] bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-transparent border-2 border-cyan-500/30 relative overflow-hidden shadow-2xl group">
                <div className="absolute -top-20 -right-20 p-4 opacity-5 group-hover:rotate-12 group-hover:scale-125 transition-all duration-[5s]"><Rocket size={400} /></div>
                <h4 className="text-xs font-black uppercase tracking-[0.5em] text-white mb-12 flex items-center gap-4">
                   <Target size={20} className="text-cyan-400" /> Alpha Prediction
                </h4>
                <div className="space-y-10 relative z-10">
                   <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Dominancia Global 2026</p>
                      <p className="text-2xl font-black text-white italic leading-none">{intel.prediction?.dominance || 'En análisis'}</p>
                   </div>
                   <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Líder en Ascenso</p>
                      <p className="text-2xl font-black text-white italic leading-none">{intel.prediction?.ceo || 'Calculando...'}</p>
                   </div>
                   <div className="p-8 bg-red-600/10 border border-red-600/30 rounded-[40px] shadow-[0_0_40px_rgba(220,38,38,0.1)]">
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em] mb-3">Protocolo de Riesgo Sistémico</p>
                      <p className="text-lg font-black text-red-500 uppercase italic leading-tight">{intel.prediction?.risk || 'Bajo'}</p>
                   </div>
                </div>
             </div>
          </section>
        </>
      )}

      {/* FOOTER DE INTELIGENCIA */}
      <div className="pt-20 text-center border-t border-white/5 opacity-30">
         <p className="text-[9px] font-black text-gray-500 uppercase tracking-[1.5em] animate-pulse">HAWKIN COMMAND CENTER • DECRYPTING THE FUTURE • GLOBAL INTEL FEED ACTIVE</p>
      </div>
    </div>
  );
}

function ArrowUpRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 7h10v10" /><path d="M7 17 17 7" />
    </svg>
  );
}
