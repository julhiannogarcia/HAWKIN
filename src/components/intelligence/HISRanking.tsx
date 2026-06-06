'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, ShieldCheck, CircleGauge, 
  Info, ChevronRight, Zap, Target, Building2
} from 'lucide-react';

const COMPANIES = [
  { 
    id: 'openai', name: 'OpenAI', logo: 'https://unavatar.io/twitter/OpenAI', 
    his: 98.4, confidence: 94, change: +3.5, 
    why: 'Lanzamiento inminente de GPT-5. Dominio absoluto en percepción AGI.', 
    ceo: 'Sam Altman', 
    prediction: 'Liderazgo absoluto en Q4 con modelos de razonamiento.',
    history: { d24: 94.9, d7: 97.2, d30: 95.8 }, 
    color: '#10a37f',
    weights: { innovation: 30, talent: 20, capital: 15, execution: 15, impact: 10, adoption: 5, future: 5 }
  },
  { 
    id: 'nvidia', name: 'NVIDIA', logo: 'https://unavatar.io/twitter/nvidia', 
    his: 97.8, confidence: 98, change: +2.9, 
    why: 'Monopolio de hardware de inferencia y anuncio de Vera Rubin.', 
    ceo: 'Jensen Huang', 
    history: { d24: 94.9, d7: 96.5, d30: 94.2 }, 
    color: '#76b900',
    weights: { innovation: 25, talent: 15, capital: 20, execution: 20, impact: 15, adoption: 3, future: 2 }
  },
  { 
    id: 'google', name: 'DeepMind', logo: 'https://unavatar.io/twitter/GoogleDeepMind', 
    his: 94.5, confidence: 92, change: +1.8, 
    why: 'Integración masiva de Gemini en ecosistema global de Android.', 
    ceo: 'Demis Hassabis', 
    history: { d24: 92.7, d7: 93.1, d30: 90.5 }, 
    color: '#4285F4',
    weights: { innovation: 20, talent: 25, capital: 15, execution: 15, impact: 10, adoption: 10, future: 5 }
  },
  { 
    id: 'anthropic', name: 'Anthropic', logo: 'https://unavatar.io/twitter/AnthropicAI', 
    his: 92.1, confidence: 89, change: +4.2, 
    why: 'Claude 3.5 Sonnet liderando benchmarks de razonamiento.', 
    ceo: 'Dario Amodei', 
    history: { d24: 87.9, d7: 89.4, d30: 85.2 }, 
    color: '#d97757',
    weights: { innovation: 35, talent: 20, capital: 10, execution: 10, impact: 10, adoption: 10, future: 5 }
  },
  { 
    id: 'microsoft', name: 'Microsoft', logo: 'https://unavatar.io/twitter/Microsoft', 
    his: 91.5, confidence: 95, change: +0.8, 
    why: 'Adopción empresarial de Copilot y mega-clústeres Azure.', 
    ceo: 'Satya Nadella', 
    history: { d24: 90.7, d7: 91.0, d30: 89.8 }, 
    color: '#00a4ef',
    weights: { innovation: 15, talent: 15, capital: 25, execution: 20, impact: 15, adoption: 5, future: 5 }
  },
  { 
    id: 'meta', name: 'Meta AI', logo: 'https://unavatar.io/twitter/Meta', 
    his: 89.2, confidence: 91, change: +2.4, 
    why: 'Llama 3 establece el estándar open-source. Adopción global.', 
    ceo: 'Mark Zuckerberg', 
    history: { d24: 86.8, d7: 87.5, d30: 84.1 }, 
    color: '#0668E1',
    weights: { innovation: 20, talent: 15, capital: 15, execution: 20, impact: 20, adoption: 5, future: 5 }
  },
  { 
    id: 'xai', name: 'xAI', logo: 'https://unavatar.io/twitter/xai', 
    his: 88.7, confidence: 85, change: +6.1, 
    why: 'Integración con SpaceX y X. Mega-clúster en construcción.', 
    ceo: 'Elon Musk', 
    history: { d24: 82.6, d7: 84.2, d30: 80.5 }, 
    color: '#ffffff',
    weights: { innovation: 25, talent: 15, capital: 15, execution: 25, impact: 10, adoption: 5, future: 5 }
  },
  { 
    id: 'amazon', name: 'Amazon AI', logo: 'https://unavatar.io/twitter/amazon', 
    his: 86.4, confidence: 90, change: -1.2, 
    why: 'Retrasos en modelos propios, dependencia estratégica de Anthropic.', 
    ceo: 'Andy Jassy', 
    history: { d24: 87.6, d7: 88.0, d30: 89.2 }, 
    color: '#FF9900',
    weights: { innovation: 15, talent: 15, capital: 25, execution: 15, impact: 15, adoption: 10, future: 5 }
  },
  { 
    id: 'apple', name: 'Apple', logo: 'https://unavatar.io/twitter/Apple', 
    his: 85.9, confidence: 88, change: +3.0, 
    why: 'Apple Intelligence lleva IA local a millones de usuarios.', 
    ceo: 'Tim Cook', 
    history: { d24: 82.9, d7: 83.5, d30: 80.1 }, 
    color: '#A2AAAD',
    weights: { innovation: 15, talent: 15, capital: 20, execution: 15, impact: 15, adoption: 15, future: 5 }
  },
  { 
    id: 'mistral', name: 'Mistral', logo: 'https://unavatar.io/twitter/MistralAI', 
    his: 83.2, confidence: 82, change: +1.5, 
    why: 'Alternativa europea eficiente. Fuertes alianzas en la UE.', 
    ceo: 'Arthur Mensch', 
    history: { d24: 81.7, d7: 82.0, d30: 80.5 }, 
    color: '#FF6600',
    weights: { innovation: 30, talent: 15, capital: 10, execution: 15, impact: 10, adoption: 15, future: 5 }
  },
  { 
    id: 'figure', name: 'Figure AI', logo: 'https://unavatar.io/twitter/figure_ai', 
    his: 81.5, confidence: 78, change: +5.4, 
    why: 'Despliegue de humanoides en líneas de producción reales.', 
    ceo: 'Brett Adcock', 
    history: { d24: 76.1, d7: 77.8, d30: 72.4 }, 
    color: '#000000',
    weights: { innovation: 35, talent: 20, capital: 15, execution: 10, impact: 10, adoption: 5, future: 5 }
  },
  { 
    id: 'scale', name: 'Scale AI', logo: 'https://unavatar.io/twitter/scale_AI', 
    his: 80.1, confidence: 85, change: +4.8, 
    why: 'Monopolio silencioso en anotación de datos para la AGI.', 
    ceo: 'Alexandr Wang', 
    history: { d24: 75.3, d7: 76.2, d30: 70.8 }, 
    color: '#aa00ff',
    weights: { innovation: 20, talent: 30, capital: 20, execution: 15, impact: 10, adoption: 3, future: 2 }
  }
];

function CompanyLogo({ src, alt }: { src: string, alt: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-[25px] md:rounded-[30px] flex items-center justify-center p-4 md:p-6 border border-white/5 group-hover:bg-white/10 transition-all shadow-xl relative overflow-hidden shrink-0">
       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
       {error ? (
         <Building2 size={32} className="text-gray-700 relative z-10" />
       ) : (
         <img 
           src={src} 
           alt={alt} 
           className="w-full h-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-10" 
           onError={() => setError(true)}
         />
       )}
    </div>
  );
}

export default function HISRanking() {
  const [showFormula, setShowFormula] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#020202] py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-cyan-500 pl-8 text-left">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-2 py-0.5 bg-cyan-500 text-black text-[8px] font-black uppercase rounded">Proprietary Metric</div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global AI Index v6.1</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                 HAWKIN Intelligence <span className="text-cyan-400">Score (HIS).</span>
              </h2>
              <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">El Estado Mundial del Dominio Corporativo en IA</p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           {COMPANIES.map((company, index) => (
             <motion.div 
               key={company.id}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 rounded-[50px] p-8 md:p-10 transition-all duration-500 group relative text-left"
             >
                <div className="flex flex-col lg:flex-row justify-between gap-12 items-center lg:items-stretch">
                   
                   <div className="flex items-center gap-6 md:gap-8 lg:w-1/3">
                      <div className="text-2xl md:text-3xl font-black text-gray-800 italic w-6 md:w-10">#{index + 1}</div>
                      <CompanyLogo src={company.logo} alt={company.name} />
                      <div>
                         <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">{company.name}</h3>
                         <p className="text-[8px] md:text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                            CEO: <span className="text-white italic">{company.ceo}</span>
                         </p>
                         <button 
                           onClick={() => setShowFormula(showFormula === company.id ? null : company.id)}
                           className="mt-2 text-[7px] font-black uppercase tracking-widest text-cyan-500/50 hover:text-cyan-400 transition-colors underline decoration-dotted"
                         >
                            Fórmula HIS
                         </button>
                      </div>
                   </div>

                   <div className="flex flex-col justify-center items-center lg:items-end gap-1 lg:w-1/3">
                      <div className="text-[8px] md:text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] text-center lg:text-right w-full">HIS Score</div>
                      <div className="flex items-baseline gap-3">
                         <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-white leading-none">{company.his}</span>
                         <div className={`flex items-center gap-1 text-[10px] md:text-xs font-black ${company.change > 0 ? 'text-cyan-400' : 'text-red-500'}`}>
                            {company.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {company.change}%
                         </div>
                      </div>
                      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full mt-2">
                         <ShieldCheck size={10} className="text-green-500" />
                         <span className="text-[8px] font-black uppercase text-green-500">Confidence: {company.confidence}%</span>
                      </div>
                   </div>

                   <div className="w-full lg:w-1/3 bg-black/40 p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/5 flex flex-col justify-center space-y-3">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Zap size={10} className="text-cyan-500" /> Why It Matters</span>
                      <p className="text-xs md:text-sm text-gray-300 font-light italic leading-relaxed">"{company.why}"</p>
                   </div>

                </div>

                <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-4 gap-4 md:gap-8">
                   {[
                     { label: '24h', val: company.history.d24 },
                     { label: '7 Días', val: company.history.d7 },
                     { label: '30 Días', val: company.history.d30 },
                     { label: 'Ahora', val: company.his }
                   ].map((h, i) => (
                     <div key={i} className="flex flex-col items-center md:items-start">
                        <span className="text-[6px] md:text-[7px] font-black text-gray-700 uppercase tracking-widest">{h.label}</span>
                        <span className={`text-sm md:text-lg font-black italic tabular-nums ${i === 3 ? 'text-cyan-400' : 'text-white'}`}>{h.val}</span>
                     </div>
                   ))}
                </div>

                <AnimatePresence>
                   {showFormula === company.id && (
                     <motion.div 
                       key="his-formula-details"
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
