'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Crosshair, Sword, Shield, Cpu, 
  ChevronRight, ArrowRightLeft, TrendingUp, TrendingDown
} from 'lucide-react';

const BATTLES = [
  {
    id: 'openai-google',
    title: 'CARRERA AGI',
    sideA: { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', score: 96 },
    sideB: { name: 'DeepMind', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_\"G\"_Logo.svg', score: 92 },
    metrics: [
      { label: 'Innovation', a: 98, b: 89 },
      { label: 'Talent', a: 94, b: 96 },
      { label: 'Execution', a: 97, b: 85 }
    ],
    prediction: 'OpenAI dominará el mercado agéntico en Q4 con GPT-5.'
  },
  {
    id: 'nvidia-amd',
    title: 'GUERRA DE CHIPS',
    sideA: { name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg', score: 99 },
    sideB: { name: 'AMD', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', score: 78 },
    metrics: [
      { label: 'Market Share', a: 99, b: 12 },
      { label: 'R&D Speed', a: 98, b: 82 },
      { label: 'Ecosystem', a: 100, b: 65 }
    ],
    prediction: 'La arquitectura Vera Rubin de NVIDIA hará irrelevante la competencia en 2027.'
  }
];

export default function AIWarRoom() {
  return (
    <section className="w-full bg-[#020202] py-24 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-red-600 pl-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <Sword size={16} className="text-red-500" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Active Frontlines</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                 AI War <span className="text-red-600">Room.</span>
              </h2>
              <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Análisis de Conflictos Tecnológicos en Tiempo Real</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {BATTLES.map((battle) => (
            <motion.div 
              key={battle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.02] border border-white/5 rounded-[50px] p-10 space-y-10 relative group hover:border-red-600/20 transition-all duration-500"
            >
              <div className="flex justify-between items-center">
                 <span className="px-4 py-1.5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-full text-[8px] font-black uppercase tracking-widest">{battle.title}</span>
                 <div className="flex items-center gap-2 text-gray-600 text-[9px] font-bold">
                    <Crosshair size={12} /> ENFOQUE CRÍTICO
                 </div>
              </div>

              {/* BATTLE HEAD-TO-HEAD */}
              <div className="flex items-center justify-between gap-6 relative">
                 <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center p-4 border border-white/10 group-hover:border-cyan-500/30 transition-all">
                       <img src={battle.sideA.logo} alt={battle.sideA.name} className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <span className="text-xs font-black uppercase text-white">{battle.sideA.name}</span>
                 </div>

                 <div className="flex flex-col items-center">
                    <div className="text-2xl font-black italic text-red-600 animate-pulse">VS</div>
                    <div className="h-10 w-px bg-gradient-to-b from-red-600/50 to-transparent my-2" />
                 </div>

                 <div className="flex flex-col items-center gap-4 text-center text-gray-500">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center p-4 border border-white/10 grayscale">
                       <img src={battle.sideB.logo} alt={battle.sideB.name} className="w-full h-full object-contain brightness-0 invert opacity-40" />
                    </div>
                    <span className="text-xs font-black uppercase">{battle.sideB.name}</span>
                 </div>
              </div>

              {/* DYNAMIC BARS */}
              <div className="space-y-6">
                 {battle.metrics.map((m, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                         <span>{m.a}%</span>
                         <span>{m.label}</span>
                         <span>{m.b}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full flex overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${m.a}%` }}
                          className="h-full bg-cyan-500" 
                         />
                         <div className="flex-1" />
                         <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${m.b}%` }}
                          className="h-full bg-red-600/30" 
                         />
                      </div>
                   </div>
                 ))}
              </div>

              {/* PREDICCIÓN ESTRATÉGICA */}
              <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                 <div className="flex items-center gap-3 text-cyan-400">
                    <Zap size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Predicción Alpha</span>
                 </div>
                 <p className="text-xs text-gray-400 font-light italic leading-relaxed">"{battle.prediction}"</p>
                 <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[6px] font-black text-gray-700 uppercase">Horizonte</span>
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">90 DÍAS</span>
                    </div>
                    <div className="flex flex-col text-right">
                       <span className="text-[6px] font-black text-gray-700 uppercase">Confianza</span>
                       <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">88%</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
