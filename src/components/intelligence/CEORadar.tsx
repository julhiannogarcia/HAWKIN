'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Users, Globe, Zap, Activity, User, 
  X, ShieldAlert, BarChart3, Clock, TrendingUp,
  Brain, Rocket, ShieldCheck
} from 'lucide-react';

const CEOS = [
  { 
    id: 1, name: "Sam Altman", role: "CEO @ OPENAI", company: "OpenAI",
    influence: 98, momentum: "+4.2", confidence: 95,
    photo: "/sam-altman.jpg",
    logo: "/logos/openAI.png",
    lastMove: 'Alianza global con Apple Intelligence. Despliegue de GPT-4o.', color: '#10a37f',
    dossier: {
      vision: 95, execution: 90, risk_tolerance: 99,
      market_status: "+5.4% ▲",
      timeline: [
        "2024-06: Alianza global con Apple Intelligence.",
        "2024-05: Despliegue de GPT-4o multimodal.",
        "2023-11: Crisis interna y retorno victorioso."
      ]
    }
  },
  { 
    id: 2, name: "Jensen Huang", role: "CEO @ NVIDIA", company: "NVIDIA",
    influence: 99, momentum: "+5.5", confidence: 98,
    photo: "https://unavatar.io/twitter/nvidia",
    logo: "/logos/NVIDIA.jpeg",
    lastMove: 'Anuncio de arquitectura Vera Rubin. Dominio absoluto de mercado.', color: '#76b900',
    dossier: {
      vision: 98, execution: 99, risk_tolerance: 85,
      market_status: "+12.1% ▲",
      timeline: [
        "2024-06: Anuncio de arquitectura Vera Rubin.",
        "2024-05: Supera récord histórico en capitalización.",
        "2024-03: Presentación de chips Blackwell."
      ]
    }
  },
  { 
    id: 3, name: "Elon Musk", role: "FOUNDER @ xAI", company: "xAI",
    influence: 96, momentum: "+6.1", confidence: 90,
    photo: "https://unavatar.io/twitter/elonmusk",
    logo: "/logos/XAI.webp",
    lastMove: 'Fusión de capacidades xAI con Starlink. Mega-clúster en Memphis.', color: '#ffffff',
    dossier: {
      vision: 99, execution: 88, risk_tolerance: 100,
      market_status: "+2.8% ▲",
      timeline: [
        "2024-05: Levantamiento de $6B para xAI.",
        "2024-04: Fusión de capacidades con Starlink.",
        "2023-11: Lanzamiento del modelo Grok."
      ]
    }
  },
  { 
    id: 4, name: "Demis Hassabis", role: "CEO @ Google DeepMind", company: "DeepMind",
    influence: 95, momentum: "+3.8", confidence: 92,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Demis_Hassabis_Royal_Society.jpg",
    logo: "/logos/DEEPMIND.jpeg",
    lastMove: 'Avances en biología computacional (AlphaFold 3).', color: '#4285F4',
    dossier: {
      vision: 94, execution: 92, risk_tolerance: 80,
      market_status: "+1.2% ▲",
      timeline: [
        "2024-05: Lanzamiento de AlphaFold 3.",
        "2024-02: Integración Gemini 1.5 Pro.",
        "2023-12: Unificación Google Brain + DeepMind."
      ]
    }
  },
  { 
    id: 5, name: "Dario Amodei", role: "CEO @ Anthropic", company: "Anthropic",
    influence: 93, momentum: "+4.5", confidence: 89,
    photo: "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg/960px-Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg&w=400&h=400&fit=cover",
    logo: "/logos/ANTHROPI.webp",
    lastMove: 'Lanzamiento de Claude 3.5 Sonnet superando benchmarks.', color: '#d97757',
    dossier: {
      vision: 92, execution: 94, risk_tolerance: 75,
      market_status: "+8.5% ▲",
      timeline: [
        "2024-06: Claude 3.5 Sonnet establece nuevo estándar.",
        "2024-03: Lanzamiento familia Claude 3.",
        "2023-09: Inversión de $4B por Amazon."
      ]
    }
  },
  { 
    id: 6, name: "Satya Nadella", role: "CEO @ Microsoft", company: "Microsoft",
    influence: 97, momentum: "+2.1", confidence: 96,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/MS-Exec-Nadella-Satya-2017-08-31-22_(cropped).jpg",
    logo: "/logos/MICROSOFT.png",
    lastMove: 'Integración agresiva de Copilot en todo el ecosistema Windows.', color: '#00a4ef',
    dossier: {
      vision: 96, execution: 97, risk_tolerance: 88,
      market_status: "+4.1% ▲",
      timeline: [
        "2024-05: Copilot+ PCs revolucionan hardware.",
        "2024-01: Microsoft supera a Apple en valor.",
        "2023-11: Consolidación de alianza con OpenAI."
      ]
    }
  },
  { 
    id: 7, name: "Mark Zuckerberg", role: "CEO @ Meta", company: "Meta",
    influence: 94, momentum: "+5.0", confidence: 93,
    photo: "https://unavatar.io/twitter/finkd",
    logo: "/logos/META-AI.png",
    lastMove: 'Llama 3 Open Source disrumpiendo el modelo de negocio cerrado.', color: '#0668E1',
    dossier: {
      vision: 93, execution: 95, risk_tolerance: 92,
      market_status: "+15.6% ▲",
      timeline: [
        "2024-04: Llama 3 domina el ecosistema open-source.",
        "2024-02: GPU Cluster de 350k H100 anunciado.",
        "2023-07: Lanzamiento disruptivo de Llama 2."
      ]
    }
  },
  { 
    id: 8, name: "Sundar Pichai", role: "CEO @ Alphabet", company: "Alphabet",
    influence: 95, momentum: "+1.5", confidence: 91,
    photo: "https://unavatar.io/twitter/sundarpichai",
    logo: "/logos/DEEPMIND.jpeg",
    lastMove: 'Reestructuración interna para acelerar Gemini.', color: '#4285F4',
    dossier: {
      vision: 90, execution: 85, risk_tolerance: 82,
      market_status: "+3.9% ▲",
      timeline: [
        "2024-05: AI Overviews en Google Search.",
        "2024-02: Lanzamiento de Gemini 1.5 Pro.",
        "2023-12: Unificación total de divisiones IA."
      ]
    }
  },
  { 
    id: 9, name: "Ilya Sutskever", role: "FOUNDER @ SSI", company: "SSI",
    influence: 92, momentum: "+8.0", confidence: 85,
    photo: "https://unavatar.io/twitter/ilyasut",
    logo: "/logos/openAI.png",
    lastMove: 'Fundación de Safe Superintelligence Inc. tras salida de OpenAI.', color: '#888888',
    dossier: {
      vision: 100, execution: 85, risk_tolerance: 95,
      market_status: "STEALTH",
      timeline: [
        "2024-06: Fundación de Safe Superintelligence Inc.",
        "2024-05: Salida oficial de OpenAI.",
        "2023-11: Protagonista de crisis de gobernanza."
      ]
    }
  },
  { 
    id: 10, name: "Alexandr Wang", role: "CEO @ Scale AI", company: "Scale AI",
    influence: 90, momentum: "+4.0", confidence: 88,
    photo: "https://unavatar.io/twitter/alexandr_wang",
    logo: "/logos/SCALE-AI.png",
    lastMove: 'Levantamiento de $1B en Series F para dominio de datos.', color: '#aa00ff',
    dossier: {
      vision: 91, execution: 96, risk_tolerance: 90,
      market_status: "+60% VAL",
      timeline: [
        "2024-05: Ronda Series F de $1B.",
        "2024-03: Contrato masivo con Pentágono.",
        "2023-10: Lanzamiento de Scale Donovan."
      ]
    }
  }
];

function DossierPanel({ ceo, isOpen, onClose }: { ceo: any, isOpen: boolean, onClose: () => void }) {
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
  const [selectedCEO, setSelectedCEO] = useState<any>(null);

  return (
    <section className="w-full bg-[#020202] border-y border-white/5 py-24 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-cyan-500 pl-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <Users size={16} className="text-cyan-500" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Influence & Momentum</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                 CEO <span className="text-cyan-400">Radar.</span>
              </h2>
              <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Líderes que controlan el futuro tecnológico</p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {CEOS.map((ceo, index) => (
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
      </div>

      <DossierPanel 
        ceo={selectedCEO} 
        isOpen={!!selectedCEO} 
        onClose={() => setSelectedCEO(null)} 
      />
    </section>
  );
}
