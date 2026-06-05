'use client';

import React from 'react';
import { Target, CircleCheck, Zap } from 'lucide-react';

const TOP10 = [
  { rank: 1, title: 'NVIDIA (Dominio Absoluto)', category: 'EMPRESA LÍDER', impact: 'CRITICAL', confidence: 99 },
  { rank: 2, title: 'Jensen Huang', category: 'CEO LÍDER', impact: 'CRITICAL', confidence: 98 },
  { rank: 3, title: 'Figure AI', category: 'STARTUP EMERGENTE', impact: 'HIGH', confidence: 94 },
  { rank: 4, title: 'Scale AI ($1B Series F)', category: 'MAYOR INVERSIÓN', impact: 'HIGH', confidence: 99 },
  { rank: 5, title: 'SSI (Ilya Sutskever)', category: 'MAYOR CONTRATACIÓN', impact: 'HIGH', confidence: 95 },
  { rank: 6, title: 'Claude 3.5 Sonnet', category: 'MAYOR LANZAMIENTO', impact: 'CRITICAL', confidence: 98 },
  { rank: 7, title: 'Desfase de Costos en Modelos Menores', category: 'MAYOR AMENAZA', impact: 'HIGH', confidence: 91 },
  { rank: 8, title: 'Agentes Autónomos B2B', category: 'MAYOR OPORTUNIDAD', impact: 'CRITICAL', confidence: 96 },
  { rank: 9, title: 'Perplexity AI', category: 'MAYOR CRECIMIENTO', impact: 'HIGH', confidence: 93 },
  { rank: 10, title: 'Filtración de GPT-5.6', category: 'SEÑAL CRÍTICA', impact: 'CRITICAL', confidence: 85 }
];

export default function CommandCenterTop10() {
  return (
    <section className="w-full bg-[#050505] py-24 border-y border-white/5 relative text-left">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-16 border-l-4 border-yellow-500 pl-8">
           <div className="flex items-center gap-3 mb-2">
             <Target size={16} className="text-yellow-500" />
             <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Global Ranking System</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
              Command <span className="text-yellow-500">Center Top 10.</span>
           </h2>
           <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">La Elite Absoluta del Día (Actualizado 24/7)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {TOP10.map((item) => (
            <div key={item.rank} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all flex flex-col justify-between group">
               <div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-3xl font-black text-gray-800 italic group-hover:text-yellow-500/50 transition-colors">#{item.rank}</span>
                     <span className="text-[7px] font-black px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase tracking-widest">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-black uppercase italic text-white leading-tight mb-6">{item.title}</h3>
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${item.impact === 'CRITICAL' ? 'text-red-500' : 'text-cyan-400'}`}>
                     {item.impact} IMPACT
                  </span>
                  <span className="text-[8px] font-black text-green-500 uppercase flex items-center gap-1">
                     <Zap size={8} /> {item.confidence}% TRUST
                  </span>
               </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
