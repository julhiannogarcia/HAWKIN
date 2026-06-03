'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Zap, Shield, Cpu, 
  Activity, Users, Rocket, Globe, Clock, 
  BarChart3, Target, ChevronRight, AlertCircle,
  ShieldCheck, ArrowUpRight, ArrowDownRight, Info,
  Search, Eye, Gauge, Compass
} from 'lucide-react';

// --- DATA ENGINE V4.5 ---
const COMPANIES = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', 
    score: 98.4, 
    confidence: 94,
    change: +3.5, 
    why: 'Incremento en adopción empresarial y despliegue inminente de GPT-5 "Iris".',
    history: { d7: '#1', d30: '#1', d90: '#2' },
    color: '#10a37f' 
  },
  { 
    id: 'nvidia', 
    name: 'NVIDIA', 
    logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg', 
    score: 97.2, 
    confidence: 98,
    change: +2.9, 
    why: 'Dominio absoluto de la cadena de suministro Blackwell RTX y anuncio de Rubin.',
    history: { d7: '#2', d30: '#3', d90: '#5' },
    color: '#76b900' 
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png', 
    score: 91.8, 
    confidence: 89,
    change: +4.2, 
    why: 'Claude 4.8 supera benchmarks de razonamiento lógico y flujos agénticos.',
    history: { d7: '#4', d30: '#5', d90: '#8' },
    color: '#d97757' 
  },
  { 
    id: 'google', 
    name: 'DeepMind', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_\"G\"_Logo.svg', 
    score: 90.5, 
    confidence: 92,
    change: +1.8, 
    why: 'Integración masiva de Gemini en el ecosistema Android y Workspace.',
    history: { d7: '#3', d30: '#2', d90: '#1' },
    color: '#4285F4' 
  },
  { 
    id: 'xai', 
    name: 'xAI', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/X_logo_2023.svg', 
    score: 88.7, 
    confidence: 85,
    change: +5.2, 
    why: 'Fusión estratégica con SpaceX para procesamiento de IA en órbita.',
    history: { d7: '#6', d30: '#8', d90: '#12' },
    color: '#ffffff' 
  }
];

const CEOS = [
  { name: 'Sam Altman', company: 'OpenAI', photo: 'https://media.gettyimages.com/id/1491295254/es/foto/sam-altman-ceo-of-openai-poses-for-a-portrait-on-may-16-2023-in-san-francisco-california.jpg?s=612x612&w=0&k=20&c=vW_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 98, momentum: +4, motive: 'Nuevas alianzas con Apple e Intel.', color: '#10a37f' },
  { name: 'Jensen Huang', company: 'NVIDIA', photo: 'https://media.gettyimages.com/id/1239922241/es/foto/jensen-huang-ceo-of-nvidia-speaks-during-the-gpu-technology-conference-on-march-22-2022-in-san.jpg?s=612x612&w=0&k=20&c=R_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 97, momentum: +2, motive: 'Control total del hardware AGI mundial.', color: '#76b900' },
  { name: 'Elon Musk', company: 'xAI', photo: 'https://media.gettyimages.com/id/1154562024/es/foto/elon-musk-ceo-of-tesla-and-spacex-speaks-during-the-world-artificial-intelligence-conference-in.jpg?s=612x612&w=0&k=20&c=Q_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 96, momentum: +5, motive: 'Expansión de Grok a la red Starlink.', color: '#ffffff' }
];

const SIGNALS = [
  { type: 'CRITICAL', company: 'NVIDIA', impact: 'MUY ALTO', confidence: 98, horizon: '30 DÍAS', desc: 'Despliegue masivo de clústeres Blackwell en Azure.' },
  { type: 'HIGH', company: 'OpenAI', impact: 'ALTO', confidence: 92, horizon: '15 DÍAS', desc: 'Apertura controlada de API de razonamiento Iris.' },
  { type: 'MEDIUM', company: 'Figure AI', impact: 'MEDIO', confidence: 85, horizon: '60 DÍAS', desc: 'Pruebas de campo de humanoides Gen-3 en plantas de BMW.' }
];

const EMERGING = [
  { name: 'Figure AI', momentum: 94, growth: 88, potential: 96, logo: '🤖' },
  { name: 'Mistral', momentum: 89, growth: 82, potential: 91, logo: '🌬️' }
];

export default function GlobalAIIndex() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-[#020202] border-y border-white/5 py-24 relative overflow-hidden font-sans">
      {/* TERMINAL BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="grid grid-cols-12 h-full w-full border-l border-white/20">
          {Array.from({length: 12}).map((_, i) => <div key={i} className="border-r border-white/20" />)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* TOP STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between mb-12 py-4 border-b border-white/5 gap-6">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">Terminal de Inteligencia HAWKIN v4.5</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-gray-500">
                 <Clock size={12} />
                 <span className="text-[9px] font-black uppercase tracking-widest">{time.toLocaleTimeString()} UTC-5</span>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                 <span className="text-[7px] font-black text-gray-700 uppercase tracking-widest">Última Sincronización</span>
                 <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Hace 14 segundos</span>
              </div>
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                 <ShieldCheck size={12} className="text-green-500" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Protocolo Alpha-Safe Activo</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* MAIN RANKING COLUMN (JERARQUÍA VISUAL DOMINANTE) */}
           <div className="lg:col-span-8 space-y-10">
              <div className="flex items-end justify-between border-l-4 border-cyan-500 pl-8 mb-10">
                 <div>
                    <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
                       Global AI <br /> <span className="text-cyan-400">Index.</span>
                    </h2>
                    <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">La Medición del Dominio Tecnológico Mundial</p>
                 </div>
                 <div className="hidden md:flex gap-10 text-right">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-gray-600 uppercase">Empresas</span>
                       <span className="text-xl font-black italic">142</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-gray-600 uppercase">Señales/24h</span>
                       <span className="text-xl font-black italic text-cyan-500">2,419</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 {COMPANIES.map((company, index) => (
                   <motion.div 
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-cyan-500/40 p-8 rounded-[40px] transition-all duration-500 relative overflow-hidden"
                   >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                         {/* LOGO & NAME (ELEMENTO DOMINANTE) */}
                         <div className="flex items-center gap-10">
                            <div className="text-3xl font-black text-gray-800 italic group-hover:text-cyan-500/20 transition-colors">#{index + 1}</div>
                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center p-5 group-hover:bg-white/10 transition-all border border-white/5 shadow-2xl">
                               <img src={company.logo} alt={company.name} className="w-full h-full object-contain brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                            </div>
                            <div>
                               <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">{company.name}</h3>
                               <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-1 text-[9px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">
                                     <Gauge size={10} />
                                     POWER: {company.score}
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                                     <Shield size={10} />
                                     CONFIDENCE: {company.confidence}%
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* ANALYSIS & TRENDS */}
                         <div className="flex flex-col items-end gap-4 min-w-[200px]">
                            <div className={`flex items-center gap-2 text-2xl font-black italic ${company.change > 0 ? 'text-cyan-400' : 'text-red-500'}`}>
                               {company.change > 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                               {company.change > 0 ? '+' : ''}{company.change}%
                            </div>
                            {/* MINI HISTORY CHIP */}
                            <div className="flex gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                               <div className="flex flex-col items-center px-2">
                                  <span className="text-[6px] font-black text-gray-600 uppercase">7D</span>
                                  <span className="text-[9px] font-black text-white">{company.history.d7}</span>
                               </div>
                               <div className="w-px h-full bg-white/10" />
                               <div className="flex flex-col items-center px-2">
                                  <span className="text-[6px] font-black text-gray-600 uppercase">30D</span>
                                  <span className="text-[9px] font-black text-white">{company.history.d30}</span>
                               </div>
                               <div className="w-px h-full bg-white/10" />
                               <div className="flex flex-col items-center px-2">
                                  <span className="text-[6px] font-black text-gray-600 uppercase">90D</span>
                                  <span className="text-[9px] font-black text-white">{company.history.d90}</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* WHY IT MATTERS (NUEVA CAPA DE INTELIGENCIA) */}
                      <div className="mt-8 pt-6 border-t border-white/5 flex gap-6">
                         <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 h-fit"><Info size={14} /></div>
                         <div>
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Why It Matters</p>
                            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-2xl italic">"{company.why}"</p>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* SIDEBAR: STRATEGIC SIGNALS & CEO MOMENTUM */}
           <div className="lg:col-span-4 space-y-10">
              
              {/* STRATEGIC SIGNALS */}
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                       <Activity size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em]">Strategic Signals</h3>
                 </div>
                 <div className="space-y-3">
                    {SIGNALS.map((sig, i) => (
                      <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:border-white/10 transition-all">
                         <div className="flex justify-between items-center">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded ${sig.type === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-orange-500/20 text-orange-500'} uppercase tracking-widest`}>
                               {sig.type}
                            </span>
                            <span className="text-[7px] font-black text-gray-600 uppercase italic">Horizonte: {sig.horizon}</span>
                         </div>
                         <h4 className="text-lg font-black uppercase italic leading-none text-white">{sig.company}</h4>
                         <p className="text-[10px] text-gray-500 font-light leading-snug">{sig.desc}</p>
                         <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex flex-col">
                               <span className="text-[6px] font-black text-gray-700 uppercase">Impacto</span>
                               <span className="text-[9px] font-black text-cyan-400">{sig.impact}</span>
                            </div>
                            <div className="flex flex-col text-right">
                               <span className="text-[6px] font-black text-gray-700 uppercase">Confianza</span>
                               <span className="text-[9px] font-black text-white">{sig.confidence}%</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* CEO MOMENTUM ENGINE */}
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                       <Compass size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em]">CEO Momentum</h3>
                 </div>
                 <div className="space-y-4">
                    {CEOS.map((ceo, index) => (
                      <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-start gap-6 group hover:bg-white/[0.04] transition-all">
                         <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-500/40 transition-all shadow-2xl">
                               <img src={ceo.photo} alt={ceo.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black border border-white/10 rounded-full flex items-center justify-center p-2.5 shadow-xl">
                               <img src={COMPANIES.find(c => c.name.includes(ceo.company))?.logo || ''} className="w-full h-full object-contain brightness-0 invert" alt="" />
                            </div>
                         </div>
                         <div className="flex-1 space-y-3">
                            <div>
                               <h4 className="text-lg font-black uppercase italic leading-none text-white">{ceo.name}</h4>
                               <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest mt-1">CEO @ {ceo.company}</p>
                            </div>
                            <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5">
                               <div className="flex flex-col">
                                  <span className="text-[6px] font-black text-gray-700 uppercase">Influencia</span>
                                  <span className="text-xs font-black text-white tabular-nums">{ceo.influence}</span>
                               </div>
                               <div className="flex flex-col text-right">
                                  <span className="text-[6px] font-black text-gray-700 uppercase">Momentum</span>
                                  <span className="text-xs font-black text-cyan-500 tabular-nums">+{ceo.momentum}</span>
                               </div>
                            </div>
                            <div>
                               <span className="text-[6px] font-black text-gray-700 uppercase tracking-widest block mb-1">Motivo Estratégico</span>
                               <p className="text-[10px] text-gray-400 font-light italic leading-tight">"{ceo.motive}"</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* EMERGING GIANTS */}
              <div className="p-10 bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 rounded-[50px] space-y-8">
                 <div className="flex items-center gap-4">
                    <Rocket className="text-purple-500" size={24} />
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-purple-400">Emerging Giants</h3>
                 </div>
                 <div className="space-y-6">
                    {EMERGING.map((start, i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="text-2xl">{start.logo}</div>
                            <div>
                               <h4 className="text-sm font-black uppercase text-white">{start.name}</h4>
                               <span className="text-[8px] font-black text-purple-500/60 uppercase">Potencial: {start.potential}%</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs font-black text-white tabular-nums">{start.momentum}%</div>
                            <span className="text-[6px] font-black text-gray-600 uppercase">Momentum</span>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-4 bg-purple-600/10 border border-purple-500/30 rounded-full text-[8px] font-black uppercase tracking-widest text-purple-400 hover:bg-purple-600 hover:text-white transition-all">Ver Pipeline de Inversión</button>
              </div>

           </div>
        </div>

        {/* MARKET INTELLIGENCE FOOTER */}
        <div className="mt-20 pt-10 border-t border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-600 uppercase">Bitcoin (BTC)</span>
                    <span className="text-xs font-black text-green-500 tabular-nums">↑ +4.2%</span>
                 </div>
                 <p className="text-[9px] text-gray-500 font-light italic leading-snug">Significado: Mayor apetito por riesgo tecnológico. Impacto positivo en startups de IA.</p>
              </div>
              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-600 uppercase">Nasdaq 100</span>
                    <span className="text-xs font-black text-cyan-500 tabular-nums">↑ +1.8%</span>
                 </div>
                 <p className="text-[9px] text-gray-500 font-light italic leading-snug">Consolidación del sector semiconductores liderada por NVIDIA.</p>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
