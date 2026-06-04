'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, TrendingUp, TrendingDown, Zap, 
  Target, User, ArrowUpRight, ChartBar, Clock
} from 'lucide-react';

const SIGNALS = [
  { text: 'Filtración GPT-5.6 confirma arquitectura System 2.', type: 'CRITICAL' },
  { text: 'NVIDIA asegura suministro de HBM4 para 2027.', type: 'HIGH' },
  { text: 'OpenAI vs Anthropic: Guerra por ingenieros de Google.', type: 'HIGH' },
  { text: 'xAI expande clúster de supercomputación en Memphis.', type: 'MEDIUM' },
  { text: 'Regulación UE impone auditoría a modelos de >100T params.', type: 'CRITICAL' }
];

export default function ExecutiveBrief() {
  return (
    <section className="w-full bg-[#050505] border-b border-white/5 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
           <div className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded">V5 // Executive Brief</div>
           <div className="h-px flex-1 bg-white/5" />
           <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Lectura: 2 MIN</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="space-y-6 text-left">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
              <ShieldAlert size={14} className="text-red-500" /> 5 Señales Críticas
            </h3>
            <div className="space-y-3">
              {SIGNALS.map((s, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-4 items-start group hover:border-white/10 transition-all">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.type === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-500'}`} />
                  <p className="text-xs text-gray-400 font-light leading-relaxed group-hover:text-white transition-colors">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 text-left">
            <div className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
                 <ChartBar size={14} className="text-cyan-500" /> Empresas & CEOs
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl space-y-3">
                    <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">En Ascenso</span>
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-black uppercase text-white">NVIDIA</span>
                       <span className="text-xs font-black uppercase text-white">Anthropic</span>
                       <span className="text-xs font-black uppercase text-white">Figure AI</span>
                    </div>
                  </div>
                  <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-3">
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">En Riesgo</span>
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-black uppercase text-white">Stability AI</span>
                       <span className="text-xs font-black uppercase text-white">Minor LLMs</span>
                       <span className="text-xs font-black uppercase text-white">Old SaaS</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
               <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                 <User size={10} /> CEO Momentum
               </span>
               <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                     <span className="text-xs font-black text-white uppercase italic">Sam Altman</span>
                     <span className="text-[9px] font-bold text-cyan-500">+4.2 pts</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-xs font-black text-white uppercase italic">Jensen Huang</span>
                     <span className="text-[9px] font-bold text-cyan-500">+2.8 pts</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600/10 to-transparent border border-cyan-500/20 rounded-[40px] p-8 space-y-8 relative overflow-hidden text-left">
             <div className="absolute -top-10 -right-10 opacity-5">
                <Target size={200} />
             </div>
             
             <div className="flex items-center gap-3">
                <Zap size={18} className="text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Predicción Alpha</h3>
             </div>

             <div className="space-y-6">
                <h4 className="text-2xl font-black uppercase italic leading-tight text-white">"La moneda de reserva global en 2027 no será el dólar, será el petaflop de cómputo."</h4>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                   Detectamos una acumulación masiva de infraestructura por parte de fondos soberanos. La soberanía nacional ahora se mide en capacidad de inferencia.
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-600 uppercase">Confianza</span>
                      <span className="text-xs font-black text-green-500">91%</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[8px] font-black text-gray-600 uppercase">Horizonte</span>
                      <span className="text-xs font-black text-white italic">12 MESES</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
