'use client';

import React from 'react';
import { Zap, Target, ArrowUpRight, ArrowDownRight, Share2, Eye, CircleCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// Componente placeholder para la página dinámica
export default function CEODetailPage({ params }: { params: { slug: string } }) {
  // En producción real esto leería de PostgreSQL según el slug (ej. 'sam-altman')
  const ceoName = params.slug.replace('-', ' ').toUpperCase();
  
  return (
    <main className="min-h-screen bg-[#020202] text-white pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">CEO Timeline Tracker // V9</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-10">
          {ceoName} <span className="text-gray-700">Dossier.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-4 space-y-8">
              <div className="w-full aspect-square bg-white/5 border border-white/10 rounded-[50px] flex items-center justify-center grayscale opacity-50 shadow-2xl">
                 <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Imagen Corporativa</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6">
                 <div>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-1">Influence Score</span>
                    <span className="text-4xl font-black italic text-white">98<span className="text-cyan-500 text-lg">/100</span></span>
                 </div>
                 <div className="h-px bg-white/5" />
                 <div>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-1">Momentum 30D</span>
                    <span className="text-2xl font-black italic text-cyan-400 flex items-center gap-2"><ArrowUpRight size={20} /> +4.2</span>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-8 space-y-10">
              <div className="p-10 bg-black/40 border border-white/5 rounded-[50px]">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 flex items-center gap-2 mb-6"><Target size={14} /> Análisis de Posición Global</h3>
                 <p className="text-lg font-light text-gray-300 leading-relaxed italic">
                    "Liderando la iniciativa de consolidación de infraestructura de supercomputación. Movimientos estratégicos recientes sugieren una alianza inminente para asegurar el suministro de energía global para los próximos clústeres AGI."
                 </p>
                 <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Confianza del Análisis: <span className="text-green-500">95%</span></span>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Última Sincronización: Hoy</span>
                 </div>
              </div>

              <div>
                 <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Últimos Movimientos Confirmados</h3>
                 <div className="space-y-4">
                    {[
                      { date: 'Hace 2 horas', event: 'Reunión a puerta cerrada con inversores en Medio Oriente.', type: 'CAPITAL' },
                      { date: 'Ayer', event: 'Publicación de investigación sobre modelos de razonamiento eficiente.', type: 'INNOVATION' },
                      { date: 'Hace 3 días', event: 'Contratación del ex-jefe de infraestructura de Google.', type: 'TALENT' }
                    ].map((m, i) => (
                      <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                         <div>
                            <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest mb-2 block">{m.type}</span>
                            <p className="text-sm font-medium text-white">{m.event}</p>
                         </div>
                         <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{m.date}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </main>
  );
}
