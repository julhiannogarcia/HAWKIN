'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Users, Globe, Zap, Activity,
  X, ShieldAlert, BarChart3, Clock, TrendingUp,
  Brain, Rocket, ShieldCheck, LoaderCircle, RefreshCw,
} from 'lucide-react';

type CeoView = {
  id: string;
  name: string;
  role: string;
  company: string;
  influence: number;
  momentum: string;
  confidence: number;
  photo: string;
  logo: string;
  lastMove: string;
  color: string;
  dossier: {
    vision: number;
    execution: number;
    risk_tolerance: number;
    market_status: string;
    timeline: string[];
  };
};

function formatTimeHHMM(date: Date) {
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function DossierPanel({ ceo, isOpen, onClose }: { ceo: CeoView | null, isOpen: boolean, onClose: () => void }) {
  if (!ceo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#050505] border-l border-white/10 z-[101] shadow-2xl p-8 overflow-y-auto"
          >
             <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-3">
                   <ShieldAlert className="text-cyan-500" size={20} />
                   <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Clasificado: Nivel 10</span>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all">
                   <X size={20} className="text-gray-400" />
                </button>
             </div>

             <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-[30px] overflow-hidden border-2 border-cyan-500/30">
                   <img src={ceo.photo} alt={ceo.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">{ceo.name}</h2>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">{ceo.role}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-6 mb-12">
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                   <div className="flex items-center gap-3 mb-6">
                      <BarChart3 size={16} className="text-cyan-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Métricas de Inteligencia</h3>
                   </div>
                   <div className="space-y-6">
                      {[
                        { label: 'Visión Estratégica', val: ceo.dossier?.vision, icon: <Brain size={12} /> },
                        { label: 'Capacidad de Ejecución', val: ceo.dossier?.execution, icon: <Rocket size={12} /> },
                        { label: 'Tolerancia al Riesgo', val: ceo.dossier?.risk_tolerance, icon: <ShieldCheck size={12} /> },
                      ].map((m, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-500">
                              <span className="flex items-center gap-2">{m.icon} {m.label}</span>
                              <span className="text-white">{m.val}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} animate={{ width: `${m.val}%` }}
                                className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                   <div className="flex items-center gap-3 mb-6">
                      <Clock size={16} className="text-cyan-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Línea de Tiempo Táctica</h3>
                   </div>
                   <div className="space-y-4">
                      {ceo.dossier?.timeline.map((event: string, i: number) => (
                        <div key={i} className="flex gap-4 group">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 group-hover:scale-150 transition-all" />
                           <p className="text-[10px] text-gray-400 font-light italic leading-relaxed">{event}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-cyan-500 text-black">
                   <div className="flex justify-between items-center">
                      <div>
                         <p className="text-[8px] font-black uppercase tracking-widest">Market Impact Status</p>
                         <p className="text-2xl font-black italic tracking-tighter uppercase">{ceo.dossier?.market_status}</p>
                      </div>
                      <TrendingUp size={32} />
                   </div>
                </div>
             </div>

             <div className="text-center opacity-20 pt-8">
                <p className="text-[7px] font-black uppercase tracking-[0.6em]">HAWKIN INTELLIGENCE SYSTEM // SECURITY CLEARANCE REQUIRED</p>
             </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CEOImage({ src, alt, logo }: { src: string, alt: string, logo?: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
       <div className="w-full h-full rounded-[40px] overflow-hidden border-2 border-white/10 group-hover:border-cyan-500/50 transition-all shadow-2xl bg-gray-900 flex items-center justify-center">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700" 
            onError={() => setError(true)}
          />
       </div>
       {logo && (
         <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center p-3 shadow-xl z-20 overflow-hidden">
            <img src={logo} className="w-full h-full object-contain brightness-0 invert" alt="" />
         </div>
       )}
    </div>
  );
}

export default function CEORadar() {
  const [selectedCEO, setSelectedCEO] = useState<CeoView | null>(null);
  const [ceos, setCeos] = useState<CeoView[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCeos = useCallback(async () => {
    try {
      const res = await fetch('/api/intelligence/ceo-radar', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!Array.isArray(data.ceos) || data.ceos.length === 0) {
        setFetchError(true);
        return;
      }
      setCeos(data.ceos);
      setLastUpdated(data.updatedAt ? new Date(data.updatedAt) : new Date());
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCeos();
    const interval = setInterval(fetchCeos, 120_000);
    return () => clearInterval(interval);
  }, [fetchCeos]);

  return (
    <section className="w-full bg-[#020202] border-y border-white/5 py-16 sm:py-20 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-l-4 border-cyan-500 pl-6">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <Users size={16} className="text-cyan-500" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Influence & Momentum</span>
                {lastUpdated && !fetchError && (
                  <span className="text-[9px] font-bold text-gray-600 uppercase">Actualizado: {formatTimeHHMM(lastUpdated)}</span>
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                 CEO <span className="text-cyan-400">Radar.</span>
              </h2>
              <p className="text-gray-500 mt-3 text-[10px] font-black uppercase tracking-[0.5em]">Líderes desde titulares en vivo</p>
           </div>
           {!loading && (
             <button onClick={fetchCeos} className="flex items-center gap-1 text-[9px] font-black uppercase text-gray-600 hover:text-cyan-400">
               <RefreshCw size={12} /> Actualizar
             </button>
           )}
        </div>

        {loading && (
          <div className="flex justify-center py-16 gap-3 text-gray-600">
            <LoaderCircle className="animate-spin text-cyan-500" size={24} />
            <span className="text-xs uppercase tracking-widest">Cargando CEOs…</span>
          </div>
        )}

        {!loading && fetchError && (
          <div className="py-12 text-center border border-white/5 rounded-2xl">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sin datos nuevos</p>
          </div>
        )}

        {!loading && !fetchError && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {ceos.map((ceo, index) => (
            <motion.div 
              key={ceo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCEO(ceo)}
              className="bg-white/[0.015] border border-white/5 rounded-[35px] p-4 md:p-6 hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all duration-500 group relative flex flex-col cursor-pointer"
            >
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] font-black text-cyan-500">
                #{index + 1}
              </div>
              
              <CEOImage src={ceo.photo} alt={ceo.name} logo={ceo.logo} />

              <div className="text-center mb-4 md:mb-6">
                 <h3 className="text-base md:text-lg font-black uppercase italic tracking-tighter text-white">{ceo.name}</h3>
                 <p className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest mt-0.5">{ceo.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-4 md:mb-6">
                 <div className="bg-black/40 border border-white/5 rounded-xl p-2 md:p-3 text-center">
                    <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest block mb-0.5">Influence</span>
                    <span className="text-base md:text-lg font-black text-white">{ceo.influence}</span>
                 </div>
                 <div className="bg-black/40 border border-white/5 rounded-xl p-2 md:p-3 text-center">
                    <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest block mb-0.5">Momentum</span>
                    <span className="text-base md:text-lg font-black text-cyan-400">{ceo.momentum}</span>
                 </div>
              </div>

              <div className="mt-auto pt-3 border-t border-white/5 text-left flex justify-between items-center">
                 <div className="max-w-[70%]">
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                       <Activity size={8} /> Último Movimiento
                    </span>
                    <p className="text-[9px] text-gray-400 font-light leading-snug italic truncate">"{ceo.lastMove}"</p>
                 </div>
                 <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <Zap size={10} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

      <DossierPanel 
        ceo={selectedCEO} 
        isOpen={!!selectedCEO} 
        onClose={() => setSelectedCEO(null)} 
      />
    </section>
  );
}
