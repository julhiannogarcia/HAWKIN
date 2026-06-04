'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Users, Globe, Zap, ShieldCheck, Activity } from 'lucide-react';

const CEOS = [
  { name: 'Sam Altman', company: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', role: 'CEO', photo: 'https://media.gettyimages.com/id/1491295254/es/foto/sam-altman-ceo-of-openai-poses-for-a-portrait-on-may-16-2023-in-san-francisco-california.jpg?s=612x612&w=0&k=20&c=vW_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 98, momentum: '+4.2', confidence: 95, lastMove: 'Alianza global con Apple Intelligence. Despliegue de GPT-4o.', color: '#10a37f' },
  { name: 'Jensen Huang', company: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg', role: 'CEO', photo: 'https://media.gettyimages.com/id/1239922241/es/foto/jensen-huang-ceo-of-nvidia-speaks-during-the-gpu-technology-conference-on-march-22-2022-in-san.jpg?s=612x612&w=0&k=20&c=R_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 99, momentum: '+5.5', confidence: 98, lastMove: 'Anuncio de arquitectura Vera Rubin. Dominio absoluto de mercado.', color: '#76b900' },
  { name: 'Elon Musk', company: 'xAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/X_logo_2023.svg', role: 'Founder', photo: 'https://media.gettyimages.com/id/1154562024/es/foto/elon-musk-ceo-of-tesla-and-spacex-speaks-during-the-world-artificial-intelligence-conference-in.jpg?s=612x612&w=0&k=20&c=Q_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 96, momentum: '+6.1', confidence: 90, lastMove: 'Fusión de capacidades xAI con Starlink. Mega-clúster en Memphis.', color: '#ffffff' },
  { name: 'Demis Hassabis', company: 'Google DeepMind', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg', role: 'CEO', photo: 'https://media.gettyimages.com/id/510747440/es/foto/demis-hassabis-chief-executive-officer-of-deepmind-speaks-during-a-press-conference-following.jpg?s=612x612&w=0&k=20&c=A_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 95, momentum: '+3.8', confidence: 92, lastMove: 'Avances en biología computacional (AlphaFold 3).', color: '#4285F4' },
  { name: 'Dario Amodei', company: 'Anthropic', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png', role: 'CEO', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600', influence: 93, momentum: '+4.5', confidence: 89, lastMove: 'Lanzamiento de Claude 3.5 Sonnet superando benchmarks.', color: '#d97757' },
  { name: 'Satya Nadella', company: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', role: 'CEO', photo: 'https://media.gettyimages.com/id/1243956485/es/foto/satya-nadella-chief-executive-officer-of-microsoft-speaks-during-a-news-conference-at-the.jpg?s=612x612&w=0&k=20&c=B_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 97, momentum: '+2.1', confidence: 96, lastMove: 'Integración agresiva de Copilot en todo el ecosistema Windows.', color: '#00a4ef' },
  { name: 'Mark Zuckerberg', company: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', role: 'CEO', photo: 'https://media.gettyimages.com/id/1244036070/es/foto/mark-zuckerberg-chief-executive-officer-of-meta-speaks-during-a-senate-judiciary-committee.jpg?s=612x612&w=0&k=20&c=C_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 94, momentum: '+5.0', confidence: 93, lastMove: 'Llama 3 Open Source disrumpiendo el modelo de negocio cerrado.', color: '#0668E1' },
  { name: 'Sundar Pichai', company: 'Alphabet', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg', role: 'CEO', photo: 'https://media.gettyimages.com/id/1243956488/es/foto/sundar-pichai-chief-executive-officer-of-alphabet-speaks-during-a-news-conference-at-the.jpg?s=612x612&w=0&k=20&c=D_X8R0hYI0zQ6wJzD8_O6E_Y_Z7_U_B7_P_Y_R_A_=', influence: 95, momentum: '+1.5', confidence: 91, lastMove: 'Reestructuración interna para acelerar Gemini.', color: '#4285F4' },
  { name: 'Ilya Sutskever', company: 'SSI', logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=100', role: 'Founder', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', influence: 92, momentum: '+8.0', confidence: 85, lastMove: 'Fundación de Safe Superintelligence Inc. tras salida de OpenAI.', color: '#888888' },
  { name: 'Alexandr Wang', company: 'Scale AI', logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=100', role: 'CEO', photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600', influence: 90, momentum: '+4.0', confidence: 88, lastMove: 'Levantamiento de $1B en Series F para dominio de datos.', color: '#aa00ff' }
];

export default function CEORadar() {
  return (
    <section className="w-full bg-[#020202] border-y border-white/5 py-24 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-cyan-500 pl-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <Users size={16} className="text-cyan-500" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Influence & Momentum</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                 CEO <span className="text-cyan-400">Radar.</span>
              </h2>
              <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Líderes que controlan el futuro tecnológico</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {CEOS.map((ceo, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-500 group relative flex flex-col"
            >
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black text-cyan-400">
                #{index + 1}
              </div>
              
              <div className="relative w-24 h-24 mx-auto mb-6">
                 <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-500/50 transition-all shadow-2xl">
                    <img src={ceo.photo} alt={ceo.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black border border-white/10 rounded-full flex items-center justify-center p-2 shadow-xl">
                    <img src={ceo.logo} className="w-full h-full object-contain brightness-0 invert" alt="" />
                 </div>
              </div>

              <div className="text-center mb-6">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{ceo.name}</h3>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{ceo.role} @ {ceo.company}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                 <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest block mb-1">Influence</span>
                    <span className="text-lg font-black text-white">{ceo.influence}</span>
                 </div>
                 <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest block mb-1">Momentum</span>
                    <span className="text-lg font-black text-cyan-400">{ceo.momentum}</span>
                 </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 text-left">
                 <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <Activity size={10} /> Último Movimiento
                 </span>
                 <p className="text-[10px] text-gray-400 font-light leading-snug italic">"{ceo.lastMove}"</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
