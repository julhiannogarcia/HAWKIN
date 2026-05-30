'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, TrendingUp, TriangleAlert, Users, Target, 
  Cpu, Rocket, Loader2, Sparkles, Swords, Info, 
  ArrowUpRight, Globe, ShieldCheck, Flame
} from 'lucide-react';

export default function MasterIntel() {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchIntel();
  }, []);

  if (loading) {
    return (
      <div className="p-20 bg-[#050505] border border-white/5 rounded-[60px] text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-30" />
        <Loader2 className="animate-spin text-cyan-500 mx-auto" size={50} />
        <div className="space-y-2">
           <p className="text-[11px] font-black uppercase tracking-[0.6em] text-cyan-400 animate-pulse">Sincronizando Núcleo de Inteligencia Alpha</p>
           <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Analizando satélites y cables de fibra óptica...</p>
        </div>
      </div>
    );
  }

  if (!intel || intel.error) {
    return intel?.error ? (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-xs font-black uppercase text-center backdrop-blur-xl">
        {intel.error}
      </div>
    ) : null;
  }

  return (
    <div className="space-y-24">
      {/* SECCIÓN 1: TOP NOTICIAS - ESTILO CYBER CARD */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                 <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Inyección de Datos Real-Time</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
                Top 10 <span className="text-gray-500">Noticias.</span>
              </h2>
           </div>
           <div className="hidden md:flex gap-4">
              <div className="px-5 py-2 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400">
                 Status: Operativo
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {intel.topNews?.slice(0, 10).map((news: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative"
            >
              {/* Contenedor del Link para que toda la card sea clickable */}
              <Link href={`/news/${news.id}`} className="block">
                <div className="p-10 rounded-[50px] bg-[#080808] border border-white/5 hover:border-cyan-500/40 transition-all duration-500 group-hover:shadow-[0_20px_80px_rgba(34,211,238,0.1)] relative overflow-hidden h-full">
                  
                  {/* Efecto de fondo al hacer hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex gap-3">
                       <span className={`text-[8px] font-black px-4 py-1.5 rounded-full ${news.importance === 'CRITICO' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'}`}>
                        {news.importance || 'ALTO'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                       <span className="text-[10px] font-black text-yellow-500 italic tracking-widest">IMPACTO {news.impact}/10</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black uppercase italic leading-[1.1] text-white group-hover:text-cyan-400 transition-colors mb-6 tracking-tighter">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm font-light mb-8 leading-relaxed line-clamp-3">
                    {news.summary}
                  </p>

                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                     <div className="flex flex-wrap gap-2">
                        {Array.isArray(news.companies) && news.companies.slice(0, 3).map((c: string, idx: number) => (
                          <span key={idx} className="text-[7px] bg-white/[0.03] px-3 py-1 rounded-md text-gray-500 font-black uppercase border border-white/5">{c}</span>
                        ))}
                     </div>
                     <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-cyan-500 group-hover:translate-x-2 transition-transform">
                        Analizar Reporte <ArrowUpRight size={14} />
                     </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: RUMORES Y CONFLICTOS - ESTILO DARK TACTICAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         {/* Rumores */}
         <section className="space-y-10">
            <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-6">
               <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                  <TriangleAlert size={24} />
               </div>
               <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                 Dark <span className="text-purple-400">Rumors.</span>
               </h3>
            </div>
            <div className="space-y-6">
               {intel.rumors?.map((r: any, i: number) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className="p-8 bg-[#0A0A0A] rounded-[40px] border border-white/5 shadow-xl relative group overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform"><Flame size={40} className="text-purple-500" /></div>
                    <p className="text-base text-gray-300 font-medium mb-6 italic leading-relaxed relative z-10">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] relative z-10">
                       <span className="text-purple-500 flex items-center gap-2"><Globe size={10} /> Fuente: {r.source}</span>
                       <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">Probabilidad: {r.probability}</span>
                    </div>
                 </motion.div>
               ))}
            </div>
         </section>

         {/* Batallas */}
         <section className="space-y-10">
            <div className="flex items-center gap-4 border-l-4 border-red-500 pl-6">
               <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
                  <Swords size={24} />
               </div>
               <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                 War <span className="text-red-400">Zone.</span>
               </h3>
            </div>
            <div className="space-y-6">
               {intel.battles?.map((b: any, i: number) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className="p-8 bg-[#0A0A0A] rounded-[40px] border border-white/5 shadow-xl relative overflow-hidden group"
                 >
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-8 h-[2px] bg-red-500/50" />
                       <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{b.competitors}</h4>
                    </div>
                    <p className="text-sm text-gray-500 font-light mb-8 leading-relaxed">{b.motive}</p>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                       <div>
                          <p className="text-[7px] font-black text-gray-700 uppercase tracking-widest mb-1">Estatus Actual</p>
                          <p className="text-[10px] font-bold text-red-400 uppercase italic">{b.status}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[7px] font-black text-gray-700 uppercase tracking-widest mb-1">Líder del Campo</p>
                          <p className="text-[10px] font-bold text-green-500 uppercase italic">{b.winners}</p>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </section>
      </div>

      {/* SECCIÓN 3: CEOs Y TECNOLOGÍA - ESTILO DATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <section className="p-10 rounded-[50px] bg-[#050505] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-10 flex items-center gap-3">
               <Users size={16} /> CEOs Watch
            </h4>
            <div className="space-y-6 relative z-10">
               {intel.trendingCEOs?.map((ceo: any, i: number) => (
                 <div key={i} className="flex justify-between items-center gap-4 pb-4 border-b border-white/[0.03] last:border-0 group/ceo">
                    <div>
                       <p className="text-sm font-black text-white uppercase group-hover/ceo:text-cyan-400 transition-colors">{ceo.name}</p>
                       <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{ceo.company}</p>
                    </div>
                    <span className="text-[7px] bg-cyan-500/5 px-2 py-1 rounded text-cyan-500 font-black border border-cyan-500/10">{ceo.reason}</span>
                 </div>
               ))}
            </div>
         </section>

         <section className="p-10 rounded-[50px] bg-[#050505] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-10 flex items-center gap-3">
               <Cpu size={16} /> Alpha Tech
            </h4>
            <div className="flex flex-wrap gap-3 relative z-10">
               {intel.emergingTech?.map((t: string, i: number) => (
                 <span key={i} className="px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-[9px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-all cursor-crosshair">
                    {t}
                 </span>
               ))}
            </div>
         </section>

         <section className="p-10 rounded-[50px] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:scale-110 transition-transform duration-[3s]"><Rocket size={200} /></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white mb-10 flex items-center gap-3">
               <Info size={16} className="text-cyan-400" /> Prediction
            </h4>
            <div className="space-y-6 relative z-10">
               <div className="space-y-1">
                  <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Dominancia de Mercado</p>
                  <p className="text-sm text-white font-bold italic">{intel.prediction?.dominance || 'En análisis'}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Poder en Ascenso</p>
                  <p className="text-sm text-white font-bold italic">{intel.prediction?.ceo || 'Calculando...'}</p>
               </div>
               <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <p className="text-[7px] font-black text-red-500 uppercase tracking-widest mb-1">Riesgo Sistémico</p>
                  <p className="text-[10px] text-red-400 font-bold uppercase">{intel.prediction?.risk || 'Bajo'}</p>
               </div>
            </div>
         </section>
      </div>

      <div className="pt-10 text-center border-t border-white/5 opacity-30">
         <p className="text-[8px] font-black text-gray-500 uppercase tracking-[1em]">HAWKIN COMMAND CENTER • DECRYPTING THE FUTURE • REAL-TIME FEED</p>
      </div>
    </div>
  );
}
