'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Zap, TrendingUp, ChartBar, 
  Target, Activity, Globe, Clock, ShieldCheck,
  Landmark, Cpu, Search, Info
} from 'lucide-react';

export default function GlobalAIPulse() {
  const [pulse, setPulse] = useState(92);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-[#050505] py-20 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-[0.2em] rounded shadow-[0_0_15px_rgba(34,211,238,0.3)]">Real-Time Pulse</div>
                 <div className="h-px w-20 bg-cyan-500/30" />
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Sincronizando con Red Global de Sensores...</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
                 Global AI <span className="text-cyan-400">Pulse.</span>
              </h2>
           </div>

           {/* TEMPERATURE GAUGE */}
           <div className="flex items-center gap-10 bg-white/[0.02] border border-white/10 p-8 rounded-[40px] shadow-2xl">
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                    <motion.circle 
                       cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" 
                       strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * 87) / 100}
                       className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                       initial={{ strokeDashoffset: 364.4 }}
                       animate={{ strokeDashoffset: 364.4 - (364.4 * 87) / 100 }}
                       transition={{ duration: 2, ease: "easeOut" }}
                    />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black italic text-white leading-none">87</span>
                    <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-1">Caliente</span>
                 </div>
              </div>
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">Market Temp</span>
                 <div className="flex items-center gap-2">
                    <Flame size={18} className="text-orange-500 animate-pulse" />
                    <span className="text-lg font-black uppercase text-white italic tracking-tighter">Explosivo</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
           
           {/* MAIN PULSE METER */}
           <div className="lg:col-span-5 relative group">
              <div className="p-12 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[60px] space-y-8 shadow-3xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Activity size={180} className="text-cyan-500" />
                 </div>

                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Current Activity</span>
                    <div className="flex items-baseline gap-4">
                       <h3 className="text-9xl font-black italic text-white leading-none tracking-tighter">{pulse}</h3>
                       <span className="text-2xl font-black text-cyan-500 italic">/ 100</span>
                    </div>
                 </div>

                 <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl inline-flex items-center gap-4">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Actividad Extrema Detectada</span>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pt-6">
                    <div className="space-y-1">
                       <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Sincronización</span>
                       <p className="text-[10px] font-black text-white uppercase italic">{new Date().toLocaleTimeString()} UTC-5</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Estado</span>
                       <p className="text-[10px] font-black text-green-500 uppercase italic underline decoration-dotted">OPERACIONAL</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* STRATEGIC INDICATORS */}
           <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { label: 'Capital Flow', val: 'Fuerte', trend: 'up', icon: <Landmark size={14} /> },
                   { label: 'Innovation', val: 'Muy Alta', trend: 'up', icon: <Zap size={14} /> },
                   { label: 'AI Hiring', val: 'Creciendo', trend: 'up', icon: <Users size={14} /> },
                   { label: 'Risk Factor', val: 'Medio', trend: 'stable', icon: <ShieldCheck size={14} /> },
                   { label: 'Momentum', val: 'Muy Alto', trend: 'up', icon: <TrendingUp size={14} /> },
                   { label: 'Product Launches', val: 'Agresivo', trend: 'up', icon: <Target size={14} /> }
                 ].map((ind, i) => (
                   <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/[0.04] transition-all cursor-crosshair">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-500 border border-white/10">{ind.icon}</div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{ind.label}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-[11px] font-black uppercase text-white italic">{ind.val}</span>
                         <div className="flex items-center justify-end gap-1 text-[8px] font-bold text-cyan-400 mt-1">
                            {ind.trend === 'up' && <TrendingUp size={10} />}
                            {ind.trend === 'up' ? 'ALTA' : 'ESTABLE'}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-[35px] flex items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    <Info size={24} />
                 </div>
                 <p className="text-xs text-gray-500 font-light leading-relaxed italic">
                    "El Global AI Pulse integra flujos de inversión, actividad de repositorios en GitHub, contrataciones en Silicon Valley y lanzamientos de modelos fundacionales en tiempo real."
                 </p>
              </div>
           </div>

        </div>

      </div>
    </section>
  );
}
