'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Zap, Shield, Cpu, 
  Activity, Users, Rocket, Globe, Clock, 
  BarChart3, Target, ChevronRight, AlertCircle
} from 'lucide-react';

// --- DATOS MAESTROS DE INTELIGENCIA (V4) ---
const COMPANIES = [
  { id: 'openai', name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', score: 98.4, change: +3.5, color: '#10a37f' },
  { id: 'nvidia', name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg', score: 96.2, change: +2.9, color: '#76b900' },
  { id: 'google', name: 'DeepMind', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_\"G\"_Logo.svg', score: 92.8, change: +1.8, color: '#4285F4' },
  { id: 'anthropic', name: 'Anthropic', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png', score: 89.5, change: +1.4, color: '#d97757' },
  { id: 'microsoft', name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', score: 88.1, change: +0.5, color: '#00a4ef' },
  { id: 'meta', name: 'Meta AI', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', score: 85.7, change: -0.7, color: '#0668E1' },
  { id: 'xai', name: 'xAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/X_logo_2023.svg', score: 82.4, change: +5.2, color: '#ffffff' }
];

const CEOS = [
  { name: 'Sam Altman', company: 'OpenAI', photo: 'https://media.gettyimages.com/id/1491295254/es/foto/sam-altman-ceo-of-openai-poses-for-a-portrait-on-may-16-2023-in-san-francisco-california.jpg?s=612x612&w=0&k=20&c=vW_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 98, momentum: 'ESTABLE', color: '#10a37f' },
  { name: 'Jensen Huang', company: 'NVIDIA', photo: 'https://media.gettyimages.com/id/1239922241/es/foto/jensen-huang-ceo-of-nvidia-speaks-during-the-gpu-technology-conference-on-march-22-2022-in-san.jpg?s=612x612&w=0&k=20&c=R_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 97, momentum: 'ALTA', color: '#76b900' },
  { name: 'Elon Musk', company: 'xAI', photo: 'https://media.gettyimages.com/id/1154562024/es/foto/elon-musk-ceo-of-tesla-and-spacex-speaks-during-the-world-artificial-intelligence-conference-in.jpg?s=612x612&w=0&k=20&c=Q_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 95, momentum: 'EXTREMA', color: '#ffffff' }
];

export default function GlobalAIIndex() {
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('ranking');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-[#020202] border-y border-white/5 py-24 relative overflow-hidden">
      {/* FONDO DE DATOS (Bloomberg Style) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <div className="grid grid-cols-10 h-full w-full">
           {Array.from({length: 100}).map((_, i) => (
             <div key={i} className="border-r border-b border-white h-20 flex items-center justify-center text-[6px] font-black uppercase">
                SIGNAL_{i}
             </div>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* CABECERA DE TERMINAL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-[0.2em] rounded">Terminal Activa</div>
                 <div className="h-px w-20 bg-cyan-500/30" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Sincronizando flujos globales...</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                 Global AI <span className="text-cyan-400">Index.</span>
              </h2>
           </div>

           <div className="bg-white/[0.02] border border-white/10 p-6 rounded-3xl flex items-center gap-10">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Hora del Sistema</span>
                 <span className="text-xl font-black text-white tabular-nums italic">{time.toLocaleTimeString()}</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col text-right">
                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Señales Procesadas</span>
                 <span className="text-xl font-black text-cyan-500 italic">{(142500).toLocaleString()}+</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* RANKING EMPRESARIAL PRINCIPAL */}
           <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 gap-4">
                 {COMPANIES.map((company, index) => (
                   <motion.div 
                    key={company.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/[0.015] hover:bg-white/[0.04] border border-white/5 hover:border-cyan-500/30 p-6 rounded-[30px] flex items-center justify-between transition-all cursor-pointer"
                   >
                      <div className="flex items-center gap-8">
                         <div className="text-2xl font-black text-gray-800 group-hover:text-cyan-500/20 transition-colors w-8 italic">#{index + 1}</div>
                         <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-3 group-hover:scale-110 transition-transform">
                            <img src={company.logo} alt={company.name} className="w-full h-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:brightness-100 transition-all" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">{company.name}</h3>
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">Nivel de Dominio Global</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-12">
                         <div className="hidden md:block h-12 w-48 bg-white/5 rounded-lg overflow-hidden relative">
                            {/* Simulación de gráfico de tendencia */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
                               <path 
                                d={`M0 30 Q 25 ${20 + Math.random()*10} 50 ${15 + Math.random()*5} T 100 ${10 + Math.random()*15}`} 
                                fill="none" 
                                stroke={company.change > 0 ? "#22d3ee" : "#ef4444"} 
                                strokeWidth="2" 
                                className="animate-[dash_3s_ease-in-out_infinite]"
                               />
                            </svg>
                         </div>
                         <div className="text-right">
                            <div className="text-3xl font-black italic tracking-tighter text-white">{company.score.toFixed(1)}</div>
                            <div className={`flex items-center justify-end gap-1 text-[10px] font-black ${company.change > 0 ? 'text-cyan-400' : 'text-red-500'}`}>
                               {company.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                               {company.change > 0 ? '+' : ''}{company.change}%
                            </div>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* COLUMNA DERECHA: CEO RADAR & WINNERS/LOSERS */}
           <div className="lg:col-span-4 space-y-12">
              
              {/* CEO INTELLIGENCE RADAR */}
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <Users className="text-cyan-500" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-[0.4em]">CEO Radar</h3>
                 </div>
                 <div className="space-y-4">
                    {CEOS.map((ceo, index) => (
                      <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-[35px] flex items-center gap-6 group hover:border-cyan-500/20 transition-all">
                         <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-500/40 transition-all">
                               <img src={ceo.photo} alt={ceo.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-full flex items-center justify-center p-1.5 shadow-xl">
                               <img src={COMPANIES.find(c => c.name.includes(ceo.company))?.logo || ''} className="w-full h-full object-contain brightness-0 invert" alt="" />
                            </div>
                         </div>
                         <div className="flex-1">
                            <h4 className="text-lg font-black uppercase italic leading-none mb-2">{ceo.name}</h4>
                            <div className="flex items-center justify-between">
                               <div className="flex flex-col">
                                  <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Influencia</span>
                                  <span className="text-xs font-black text-white">{ceo.influence}%</span>
                               </div>
                               <div className="flex flex-col text-right">
                                  <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Momentum</span>
                                  <span className={`text-[9px] font-black ${ceo.momentum === 'EXTREMA' ? 'text-red-500' : 'text-cyan-400'}`}>{ceo.momentum}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* WINNERS VS LOSERS */}
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <Target className="text-cyan-500" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-[0.4em]">Battlefield</h3>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    <div className="p-8 bg-cyan-500/5 border border-cyan-500/20 rounded-[40px] space-y-4">
                       <div className="flex items-center gap-2 text-cyan-400">
                          <TrendingUp size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Empresa Ganadora</span>
                       </div>
                       <h4 className="text-2xl font-black uppercase italic italic leading-none text-white">NVIDIA Corp.</h4>
                       <p className="text-xs text-gray-500 font-light leading-relaxed">Dominio total del suministro de Blackwell garantiza ingresos récord en Q3.</p>
                    </div>
                    <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[40px] space-y-4 opacity-70">
                       <div className="flex items-center gap-2 text-red-500">
                          <TrendingDown size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">En Riesgo</span>
                       </div>
                       <h4 className="text-2xl font-black uppercase italic italic leading-none text-white">Minor LLMs</h4>
                       <p className="text-xs text-gray-500 font-light leading-relaxed">Pérdida de tracción frente a modelos de frontera y falta de acceso a cómputo.</p>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </section>
  );
}
