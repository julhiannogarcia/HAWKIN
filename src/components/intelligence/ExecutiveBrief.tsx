'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, TrendingUp, TrendingDown, Zap, 
  Target, ShieldCheck, Clock
} from 'lucide-react';

const WINNERS = [
  { company: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg', score: 99, motive: 'Liderazgo inalcanzable en infraestructura IA y demanda explosiva de GPUs.', trend: '+5.2', risk: 'Bajo' },
  { company: 'Anthropic', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png', score: 94, motive: 'Claude 3.5 Sonnet atrae al sector corporativo por menor alucinación.', trend: '+4.8', risk: 'Medio' },
  { company: 'Scale AI', logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=100', score: 92, motive: 'Monopolio en anotación de datos complejos para la AGI.', trend: '+6.1', risk: 'Bajo' }
];

const LOSERS = [
  { company: 'Minor LLMs', logo: 'https://images.unsplash.com/photo-1633265486232-442b85c74e5f?auto=format&fit=crop&q=80&w=100', score: 45, motive: 'Incapacidad de competir en costo de inferencia contra gigantes open-source.', trend: '-12.4', risk: 'Crítico' },
  { company: 'Old SaaS', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100', score: 52, motive: 'Modelos de negocio obsoletos reemplazados por agentes IA autónomos.', trend: '-8.5', risk: 'Alto' }
];

const SIGNALS = [
  { text: 'Integración masiva de agentes en Apple iOS 19.', type: 'CRITICAL', prob: 92, horizon: '30 Días' },
  { text: 'X.com adopta Grok 3 para moderación 100% autónoma.', type: 'HIGH', prob: 88, horizon: '15 Días' },
  { text: 'Primer laboratorio AGI totalmente automatizado (SSI).', type: 'HIGH', prob: 85, horizon: '90 Días' },
  { text: 'Demanda del NYT fuerza reestructuración de data sets en OpenAI.', type: 'MEDIUM', prob: 75, horizon: '180 Días' }
];

export default function ExecutiveBrief() {
  return (
    <section className="w-full bg-[#050505] border-y border-white/5 py-24 text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-purple-600 pl-8 text-left">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <Target size={16} className="text-purple-500" />
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Executive Terminal</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                 Winners & <span className="text-purple-500">Losers.</span>
              </h2>
              <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Análisis Competitivo y Señales Estratégicas</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* WINNERS & LOSERS */}
          <div className="lg:col-span-8 space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* GANADORES */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-cyan-400 border-b border-white/5 pb-4">
                      <TrendingUp size={20} />
                      <h3 className="text-lg font-black uppercase tracking-widest">Ganadores</h3>
                   </div>
                   <div className="space-y-4">
                      {WINNERS.map((w, i) => (
                        <div key={i} className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-[30px] space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center p-2"><img src={w.logo} alt={w.company} className="w-full h-full object-contain brightness-0 invert" /></div>
                                 <span className="text-sm font-black uppercase text-white">{w.company}</span>
                              </div>
                              <span className="text-sm font-black text-cyan-400">{w.trend}%</span>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Motivo Estratégico</p>
                              <p className="text-xs text-gray-300 font-light leading-relaxed">"{w.motive}"</p>
                           </div>
                           <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[8px] font-black uppercase tracking-widest text-green-500">
                              <ShieldCheck size={10} /> Riesgo: {w.risk}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* PERDEDORES */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-red-500 border-b border-white/5 pb-4">
                      <TrendingDown size={20} />
                      <h3 className="text-lg font-black uppercase tracking-widest">En Riesgo</h3>
                   </div>
                   <div className="space-y-4">
                      {LOSERS.map((l, i) => (
                        <div key={i} className="p-6 bg-red-500/5 border border-red-500/10 rounded-[30px] space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center p-2"><img src={l.logo} alt={l.company} className="w-full h-full object-contain brightness-0 invert opacity-50" /></div>
                                 <span className="text-sm font-black uppercase text-white">{l.company}</span>
                              </div>
                              <span className="text-sm font-black text-red-500">{l.trend}%</span>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Consecuencia</p>
                              <p className="text-xs text-gray-300 font-light leading-relaxed">"{l.motive}"</p>
                           </div>
                           <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[8px] font-black uppercase tracking-widest text-red-500">
                              <ShieldAlert size={10} /> Riesgo: {l.risk}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

             </div>
          </div>

          {/* STRATEGIC SIGNALS */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3 border-b border-white/5 pb-4">
              <Zap size={16} className="text-orange-500" /> Strategic Signals
            </h3>
            <div className="space-y-4">
              {SIGNALS.map((s, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col gap-4 group hover:border-white/10 transition-all">
                  <div className="flex justify-between items-center">
                     <span className={`text-[7px] font-black px-2 py-0.5 rounded ${s.type === 'CRITICAL' ? 'bg-red-500 text-white' : s.type === 'HIGH' ? 'bg-orange-500 text-black' : 'bg-yellow-500/20 text-yellow-500'} uppercase tracking-widest`}>
                       {s.type} SIGNAL
                     </span>
                     <span className="text-[8px] font-black text-cyan-500 uppercase flex items-center gap-1"><Clock size={10} /> {s.horizon}</span>
                  </div>
                  <p className="text-sm text-white font-light leading-relaxed italic">"{s.text}"</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                     <span>Probabilidad</span>
                     <span className="text-white">{s.prob}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
