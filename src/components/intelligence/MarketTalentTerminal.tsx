'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Users, Briefcase, ChartBar, 
  TrendingUp, Globe, Rocket, Landmark
} from 'lucide-react';

const CAPITAL_FLOWS = [
  { company: 'Figure AI', amount: '$675M', series: 'SERIES B', lead: 'NVIDIA, Jeff Bezos', sector: 'Robótica' },
  { company: 'Mistral AI', amount: '$640M', series: 'SERIES C', lead: 'General Catalyst', sector: 'Modelos LLM' },
  { company: 'Scale AI', amount: '$1.0B', series: 'SERIES F', lead: 'Accel', sector: 'Datos IA' }
];

const TALENT_MOVES = [
  { name: 'Andrej Karpathy', from: 'OpenAI', to: 'Eureka Labs', role: 'Founder', impact: 'CRITICAL' },
  { name: 'Ilya Sutskever', from: 'OpenAI', to: 'SSI', role: 'Co-Founder', impact: 'CRITICAL' },
  { name: 'Talent Drain', from: 'Google', to: 'Anthropic', role: 'Staff Engs', impact: 'HIGH' }
];

export default function MarketTalentTerminal() {
  return (
    <section className="w-full bg-[#050505] py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* AI CAPITAL TRACKER */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-l-4 border-cyan-500 pl-6">
               <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                  <Landmark size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-black uppercase italic italic text-white tracking-tighter">AI Capital Tracker</h3>
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Inyecciones de Liquidez Global</p>
               </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                     <tr>
                        <th className="px-8 py-4">Empresa</th>
                        <th className="px-8 py-4">Monto</th>
                        <th className="px-8 py-4">Líder</th>
                        <th className="px-8 py-4 text-right">Impacto</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {CAPITAL_FLOWS.map((flow, i) => (
                       <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-white uppercase italic">{flow.company}</span>
                                <span className="text-[7px] font-bold text-gray-600 uppercase">{flow.sector}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-black text-cyan-500 tabular-nums">{flow.amount}</td>
                          <td className="px-8 py-6 text-[9px] font-medium text-gray-400 uppercase">{flow.lead}</td>
                          <td className="px-8 py-6 text-right">
                             <div className="inline-flex items-center gap-1 text-[8px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                                <TrendingUp size={10} /> HIGH
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                     <span className="text-[7px] font-black text-gray-700 uppercase">Capital Detectado (30D)</span>
                     <span className="text-sm font-black text-white italic">$42.8B USD</span>
                  </div>
                  <button className="text-[8px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-colors">Ver Mapa de Calor de Inversión →</button>
               </div>
            </div>
          </div>

          {/* AI TALENT RADAR */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-l-4 border-purple-600 pl-6">
               <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                  <Users size={20} />
               </div>
               <div>
                  <h3 className="text-lg font-black uppercase italic italic text-white tracking-tighter">AI Talent Radar</h3>
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Movimiento Estratégico de Mentes</p>
               </div>
            </div>

            <div className="space-y-4">
               {TALENT_MOVES.map((move, i) => (
                 <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[30px] flex items-center justify-between group hover:border-purple-500/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent border border-white/5 flex items-center justify-center text-purple-400 font-black italic">
                          {move.name[0]}
                       </div>
                       <div>
                          <h4 className="text-sm font-black uppercase text-white">{move.name}</h4>
                          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                             {move.from} <ArrowRightLeft size={8} className="inline mx-1" /> {move.to}
                          </p>
                       </div>
                    </div>
                    <div className="text-right space-y-2">
                       <div className={`text-[7px] font-black px-2 py-0.5 rounded ${move.impact === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-purple-600/20 text-purple-400'} uppercase tracking-widest`}>
                          {move.impact}
                       </div>
                       <p className="text-[9px] font-black text-gray-400 uppercase italic">{move.role}</p>
                    </div>
                 </div>
               ))}
               <div className="p-8 bg-purple-600/5 border border-purple-500/20 rounded-[40px] flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-purple-400">Hiring Velocity</p>
                    <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">NVIDIA & xAI Liderando Reclutamiento</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xl font-black italic text-white">9.4/10</span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ArrowRightLeft({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
    </svg>
  );
}
