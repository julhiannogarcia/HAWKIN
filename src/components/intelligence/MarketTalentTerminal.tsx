'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Users, Briefcase, ChartBar, 
  TrendingUp, Globe, Rocket, Landmark, ArrowRight
} from 'lucide-react';

const CAPITAL_FLOWS = [
  { company: 'Figure AI', amount: '$675M', series: 'Series B', lead: 'NVIDIA, Bezos', sector: 'Humanoides', impact: 'Acelera despliegue físico.' },
  { company: 'Mistral AI', amount: '$640M', series: 'Series C', lead: 'General Catalyst', sector: 'LLMs', impact: 'Competencia directa a OpenAI en Europa.' },
  { company: 'Scale AI', amount: '$1.0B', series: 'Series F', lead: 'Accel', sector: 'Datos AGI', impact: 'Monopolio en datos de entrenamiento.' }
];

const TALENT_MOVES = [
  { name: 'Ilya Sutskever', from: 'OpenAI', to: 'SSI', role: 'Founder', impact: 'CRITICAL', desc: 'Creación de Safe Superintelligence. Drenaje de talento seguro.' },
  { name: 'Andrej Karpathy', from: 'OpenAI', to: 'Eureka Labs', role: 'Founder', impact: 'HIGH', desc: 'Pivote a educación nativa en IA.' },
  { name: 'Jan Leike', from: 'OpenAI', to: 'Anthropic', role: 'Superalignment', impact: 'CRITICAL', desc: 'Anthropic absorbe equipo de seguridad clave.' }
];

const EMERGING = [
  { name: 'Perplexity', momentum: 94, growth: 95, potential: 96, desc: 'Reemplazando a Google en búsquedas de élite.' },
  { name: 'Cohere', momentum: 89, growth: 85, potential: 90, desc: 'Dominio silencioso en soluciones empresariales B2B.' },
  { name: 'Runway', momentum: 91, growth: 92, potential: 94, desc: 'Liderazgo en generación de video Gen-3.' }
];

export default function MarketTalentTerminal() {
  return (
    <section className="w-full bg-[#050505] py-24 border-y border-white/5 relative text-left">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-16 border-l-4 border-green-500 pl-8">
           <div className="flex items-center gap-3 mb-2">
             <Landmark size={16} className="text-green-500" />
             <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Global Capital & Talent</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
              Resource <span className="text-green-500">Radar.</span>
           </h2>
           <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Dónde entra el dinero. Dónde van las mentes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 text-left">
          
          {/* AI CAPITAL TRACKER */}
          <div className="space-y-8">
            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-4">
              <DollarSign className="text-green-500" size={20} /> Capital Tracker
            </h3>

            <div className="space-y-4">
               {CAPITAL_FLOWS.map((flow, i) => (
                 <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[30px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.04] transition-all">
                    <div className="flex flex-col">
                       <span className="text-xl font-black text-white italic uppercase">{flow.company}</span>
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{flow.sector} | {flow.series}</span>
                    </div>
                    <div className="flex flex-col md:items-end">
                       <span className="text-2xl font-black text-green-500 tabular-nums">{flow.amount}</span>
                       <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Lead: {flow.lead}</span>
                    </div>
                 </div>
               ))}
               <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-[30px] mt-4">
                  <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Impacto de Mercado</p>
                  <p className="text-xs text-gray-400 font-light italic">Flujo masivo de $42.8B hacia infraestructura y robótica en los últimos 30 días, secando rondas seed de SaaS tradicional.</p>
               </div>
            </div>
          </div>

          {/* AI TALENT RADAR */}
          <div className="space-y-8">
            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-4">
              <Users className="text-cyan-500" size={20} /> Talent Radar
            </h3>

            <div className="space-y-4">
               {TALENT_MOVES.map((move, i) => (
                 <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[30px] space-y-4 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="text-lg font-black uppercase text-white italic">{move.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                             {move.from} <ArrowRight size={10} className="text-cyan-500" /> {move.to}
                          </div>
                       </div>
                       <span className={`text-[7px] font-black px-2 py-0.5 rounded ${move.impact === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-cyan-500/20 text-cyan-400'} uppercase tracking-widest`}>
                          {move.impact} SIGNAL
                       </span>
                    </div>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">"{move.desc}"</p>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* EMERGING GIANTS (STARTUP DISCOVERY) */}
        <div className="mt-20 pt-16 border-t border-white/5">
           <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 mb-8">
             <Rocket className="text-purple-500" size={20} /> Emerging Giants
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {EMERGING.map((start, i) => (
                <div key={i} className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-[40px] space-y-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                      <Rocket size={80} className="text-purple-500" />
                   </div>
                   <h4 className="text-3xl font-black uppercase italic text-white">{start.name}</h4>
                   <p className="text-sm text-gray-400 font-light leading-relaxed z-10 relative">"{start.desc}"</p>
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 z-10 relative">
                      <div className="flex flex-col">
                         <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Growth</span>
                         <span className="text-lg font-black text-white">{start.growth}/100</span>
                      </div>
                      <div className="flex flex-col text-right">
                         <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Potential</span>
                         <span className="text-lg font-black text-purple-400">{start.potential}%</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </section>
  );
}
