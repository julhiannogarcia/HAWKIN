'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Shield, Gauge, 
  Info, ChevronRight, Zap, Target
} from 'lucide-react';

const COMPANIES = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', 
    his: 98.4, 
    confidence: 94,
    change: +3.5, 
    why: 'Incremento en adopción empresarial y despliegue inminente de GPT-5 "Iris".',
    ceo: 'Sam Altman',
    prediction: 'Liderazgo absoluto en Q4 con modelos de razonamiento.',
    history: { d7: 97.2, d30: 95.8, d90: 92.1, y1: 85.4 },
    weights: { innovation: 30, talent: 20, capital: 15, execution: 15, impact: 10, adoption: 5, future: 5 }
  },
  { 
    id: 'nvidia', 
    name: 'NVIDIA', 
    logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg', 
    his: 97.2, 
    confidence: 98,
    change: +2.9, 
    why: 'Dominio absoluto de la cadena de suministro Blackwell RTX y anuncio de Rubin.',
    ceo: 'Jensen Huang',
    prediction: 'Consolidación como la infraestructura base de la economía IA.',
    history: { d7: 96.5, d30: 94.2, d90: 88.7, y1: 72.3 },
    weights: { innovation: 25, talent: 15, capital: 20, execution: 20, impact: 15, adoption: 3, future: 2 }
  }
];

export default function HISRanking() {
  const [showFormula, setShowFormula] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#020202] py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-cyan-500 pl-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-2 py-0.5 bg-cyan-500 text-black text-[8px] font-black uppercase rounded">Proprietary Metric</div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Power Rankings</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                 HAWKIN Intelligence <span className="text-cyan-400">Score (HIS).</span>
              </h2>
              <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">La Métrica Definitiva de Dominio Corporativo</p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           {COMPANIES.map((company, index) => (
             <motion.div 
               key={company.id}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 rounded-[50px] p-10 transition-all duration-500 group relative"
             >
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                   
                   {/* SECCIÓN 1: IDENTIDAD DOMINANTE */}
                   <div className="flex items-center gap-12 min-w-[350px]">
                      <div className="text-4xl font-black text-gray-800 italic w-12">#{index + 1}</div>
                      <div className="w-32 h-32 bg-white/5 rounded-[40px] flex items-center justify-center p-8 border border-white/5 group-hover:bg-white/10 transition-all shadow-3xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         <img src={company.logo} alt={company.name} className="w-full h-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-10" />
                      </div>
                      <div>
                         <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">{company.name}</h3>
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2 flex items-center gap-2">
                            CEO: <span className="text-white italic">{company.ceo}</span>
                         </p>
                         <button 
                           onClick={() => setShowFormula(showFormula === company.id ? null : company.id)}
                           className="mt-4 text-[8px] font-black uppercase tracking-widest text-cyan-500 hover:text-white flex items-center gap-2 underline decoration-dotted"
                         >
                            <Info size={10} /> ¿Cómo se calcula?
                         </button>
                      </div>
                   </div>

                   {/* SECCIÓN 2: MÉTRICA HIS & TENDENCIA */}
                   <div className="flex flex-col justify-center items-center lg:items-end gap-4 min-w-[200px]">
                      <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-1 text-right w-full">HIS Score</div>
                      <div className="flex items-baseline gap-4">
                         <span className="text-8xl font-black italic tracking-tighter text-white leading-none">{company.his}</span>
                         <div className={`flex items-center gap-1 text-sm font-black ${company.change > 0 ? 'text-cyan-400' : 'text-red-500'}`}>
                            {company.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {company.change}%
                         </div>
                      </div>
                      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full mt-2">
                         <Shield size={10} className="text-green-500" />
                         <span className="text-[8px] font-black uppercase text-green-500">Confidence: {company.confidence}%</span>
                      </div>
                   </div>

                   {/* SECCIÓN 3: INTELIGENCIA ESTRATÉGICA */}
                   <div className="flex-1 space-y-8 bg-black/40 p-8 rounded-[40px] border border-white/5">
                      <div className="space-y-3">
                         <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Zap size={10} className="text-cyan-500" /> Why It Matters</span>
                         <p className="text-sm text-gray-300 font-light italic leading-relaxed">"{company.why}"</p>
                      </div>
                      <div className="space-y-3">
                         <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Target size={10} className="text-purple-500" /> Predicción Alpha</span>
                         <p className="text-sm text-gray-400 font-light leading-relaxed">"{company.prediction}"</p>
                      </div>
                   </div>

                </div>

                {/* HISTORIAL TÁCTICO */}
                <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                   {[
                     { label: 'Hoy', val: company.his },
                     { label: '7 Días', val: company.history.d7 },
                     { label: '30 Días', val: company.history.d30 },
                     { label: '1 Año', val: company.history.y1 }
                   ].map((h, i) => (
                     <div key={i} className="flex flex-col items-center md:items-start">
                        <span className="text-[7px] font-black text-gray-700 uppercase tracking-widest">{h.label}</span>
                        <span className="text-lg font-black text-white italic tabular-nums">{h.val}</span>
                     </div>
                   ))}
                </div>

                {/* DESGLOSE DE FÓRMULA (CONDICIONAL) */}
                <AnimatePresence>
                   {showFormula === company.id && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden mt-8 pt-8 border-t border-cyan-500/20"
                     >
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                           {Object.entries(company.weights).map(([key, weight], i) => (
                             <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                                <span className="text-[6px] font-black text-gray-600 uppercase block mb-1">{key}</span>
                                <span className="text-xs font-black text-cyan-500">{weight}%</span>
                             </div>
                           ))}
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
           ))}
        </div>

      </div>
    </section>
  );
}
