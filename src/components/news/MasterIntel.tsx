'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, TrendingUp, AlertTriangle, Users, Target, 
  Cpu, Rocket, Loader2, Sparkles, Sword, Info
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
      <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[50px] text-center space-y-6">
        <Loader2 className="animate-spin text-cyan-500 mx-auto" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 animate-pulse">Sincronizando Centro de Mando Mundial...</p>
      </div>
    );
  }

  if (!intel || intel.error) return null;

  return (
    <div className="space-y-16">
      {/* SECCIÓN 1: TOP NOTICIAS */}
      <section>
        <div className="flex items-center gap-4 mb-10">
           <Zap className="text-yellow-500 fill-yellow-500" size={24} />
           <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Top 10 Noticias del Día</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intel.topNews?.slice(0, 10).map((news: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[8px] font-black px-3 py-1 rounded-full ${news.importance === 'CRITICO' ? 'bg-red-500 text-white' : 'bg-cyan-500 text-black'}`}>
                  {news.importance}
                </span>
                <span className="text-xs font-black text-cyan-400 italic">Impacto: {news.impact}/10</span>
              </div>
              <h3 className="text-xl font-bold uppercase italic leading-tight text-white group-hover:text-cyan-400 transition-colors mb-4">{news.title}</h3>
              <p className="text-gray-500 text-sm font-light mb-6 leading-relaxed">{news.summary}</p>
              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {news.companies?.map((c: string, idx: number) => (
                      <span key={idx} className="text-[8px] bg-white/5 px-2 py-1 rounded-md text-gray-400 font-bold uppercase">{c}</span>
                    ))}
                 </div>
                 <p className="text-[10px] text-purple-400 font-bold italic uppercase leading-none">
                    <Sparkles className="inline mr-2" size={10} /> Consecuencia: {news.consequence}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: RUMORES Y CONFLICTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Rumores */}
         <section className="p-10 rounded-[60px] bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-purple-400 mb-10 flex items-center gap-3">
               <AlertTriangle size={20} /> Rumores más Fuertes
            </h3>
            <div className="space-y-6">
               {intel.rumors?.map((r: any, i: number) => (
                 <div key={i} className="p-6 bg-black/40 rounded-3xl border border-white/5">
                    <p className="text-sm text-white font-medium mb-3 italic leading-relaxed">"{r.text}"</p>
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                       <span className="text-purple-400">Fuente: {r.source}</span>
                       <span className="text-gray-500">Probabilidad: {r.probability}</span>
                    </div>
                 </div>
               ))}
            </div>
         </section>

         {/* Batallas */}
         <section className="p-10 rounded-[60px] bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-red-500 mb-10 flex items-center gap-3">
               <Sword size={20} /> Batallas y Conflictos
            </h3>
            <div className="space-y-6">
               {intel.battles?.map((b: any, i: number) => (
                 <div key={i} className="p-6 bg-black/40 rounded-3xl border border-white/5">
                    <h4 className="text-sm font-black text-white uppercase italic mb-2">{b.competitors}</h4>
                    <p className="text-xs text-gray-500 font-light mb-4">{b.motive}</p>
                    <div className="flex justify-between items-center text-[8px] font-black uppercase">
                       <span className="text-red-400">Situación: {b.status}</span>
                       <span className="text-green-500">Líder: {b.winners}</span>
                    </div>
                 </div>
               ))}
            </div>
         </section>
      </div>

      {/* SECCIÓN 3: CEOs Y TECNOLOGÍA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <section className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-8 flex items-center gap-2">
               <Users size={16} /> CEOs del Día
            </h4>
            <div className="space-y-4">
               {intel.trendingCEOs?.map((ceo: any, i: number) => (
                 <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="text-left">
                       <p className="text-xs font-black text-white uppercase">{ceo.name}</p>
                       <p className="text-[8px] text-gray-500 font-bold uppercase">{ceo.company}</p>
                    </div>
                    <span className="text-[7px] bg-white/5 px-2 py-1 rounded text-cyan-500 font-black">{ceo.reason}</span>
                 </div>
               ))}
            </div>
         </section>

         <section className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-8 flex items-center gap-2">
               <Cpu size={16} /> Tech Emergente
            </h4>
            <div className="flex flex-wrap gap-3">
               {intel.emergingTech?.map((t: string, i: number) => (
                 <span key={i} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                    {t}
                 </span>
               ))}
            </div>
         </section>

         <section className="p-8 rounded-[40px] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Rocket size={100} /></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-8 flex items-center gap-2">
               <Info size={16} className="text-cyan-400" /> Predicción Alpha
            </h4>
            <div className="space-y-4 relative z-10">
               <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  Dominancia: <span className="text-white font-bold">{intel.prediction?.dominance}</span>
               </p>
               <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  Influencia: <span className="text-white font-bold">{intel.prediction?.ceo}</span>
               </p>
               <p className="text-[10px] text-red-400 leading-relaxed font-black uppercase tracking-widest">
                  Riesgo: {intel.prediction?.risk}
               </p>
            </div>
         </section>
      </div>

      <div className="pt-10 text-center">
         <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.8em]">HAWKIN COMMAND CENTER • LIVE INTELLIGENCE FEED</p>
      </div>
    </div>
  );
}
