'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Users, Globe, Zap, ShieldCheck, Activity, User } from 'lucide-react';

const CEOS = [
  { 
    name: 'Sam Altman', company: 'OpenAI', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sam_Altman_2024.jpg', 
    influence: 98, momentum: '+4.2', confidence: 95, 
    lastMove: 'Alianza global con Apple Intelligence. Despliegue de GPT-4o.', color: '#10a37f' 
  },
  { 
    name: 'Jensen Huang', company: 'NVIDIA', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Jensen_Huang_at_Computex_2023.jpg', 
    influence: 99, momentum: '+5.5', confidence: 98, 
    lastMove: 'Anuncio de arquitectura Vera Rubin. Dominio absoluto de mercado.', color: '#76b900' 
  },
  { 
    name: 'Elon Musk', company: 'xAI', role: 'Founder', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/X_logo_2023.svg',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Elon_Musk_Royal_Society_%28cropped%29.jpg', 
    influence: 96, momentum: '+6.1', confidence: 90, 
    lastMove: 'Fusión de capacidades xAI con Starlink. Mega-clúster en Memphis.', color: '#ffffff' 
  },
  { 
    name: 'Demis Hassabis', company: 'Google DeepMind', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Demis_Hassabis_%282024%29.jpg', 
    influence: 95, momentum: '+3.8', confidence: 92, 
    lastMove: 'Avances en biología computacional (AlphaFold 3).', color: '#4285F4' 
  },
  { 
    name: 'Dario Amodei', company: 'Anthropic', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png',
    photo: 'https://images.crunchbase.com/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7/u6y1v6f7z7l6m8m4h8u0', 
    influence: 93, momentum: '+4.5', confidence: 89, 
    lastMove: 'Lanzamiento de Claude 3.5 Sonnet superando benchmarks.', color: '#d97757' 
  },
  { 
    name: 'Satya Nadella', company: 'Microsoft', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/MS-CEO-Satya-Nadella.jpg', 
    influence: 97, momentum: '+2.1', confidence: 96, 
    lastMove: 'Integración agresiva de Copilot en todo el ecosistema Windows.', color: '#00a4ef' 
  },
  { 
    name: 'Mark Zuckerberg', company: 'Meta', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg', 
    influence: 94, momentum: '+5.0', confidence: 93, 
    lastMove: 'Llama 3 Open Source disrumpiendo el modelo de negocio cerrado.', color: '#0668E1' 
  },
  { 
    name: 'Sundar Pichai', company: 'Alphabet', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Sundar_Pichai_%282023%29.jpg', 
    influence: 95, momentum: '+1.5', confidence: 91, 
    lastMove: 'Reestructuración interna para acelerar Gemini.', color: '#4285F4' 
  },
  { 
    name: 'Ilya Sutskever', company: 'SSI', role: 'Founder', 
    logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=100',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Ilya_Sutskever_%282023%29.jpg', 
    influence: 92, momentum: '+8.0', confidence: 85, 
    lastMove: 'Fundación de Safe Superintelligence Inc. tras salida de OpenAI.', color: '#888888' 
  },
  { 
    name: 'Alexandr Wang', company: 'Scale AI', role: 'CEO', 
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=100',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Alexandr_Wang_at_the_2023_World_Economic_Forum.jpg/640px-Alexandr_Wang_at_the_2023_World_Economic_Forum.jpg', 
    influence: 90, momentum: '+4.0', confidence: 88, 
    lastMove: 'Levantamiento de $1B en Series F para dominio de datos.', color: '#aa00ff' 
  }
];

function CEOImage({ src, alt, logo }: { src: string, alt: string, logo?: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
       <div className="w-full h-full rounded-[40px] overflow-hidden border-2 border-white/10 group-hover:border-cyan-500/50 transition-all shadow-2xl bg-gray-900 flex items-center justify-center">
          {error ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
               {logo ? (
                 <img src={logo} className="w-full h-full object-contain brightness-0 invert opacity-20" alt="logo fallback" />
               ) : (
                 <User size={60} className="text-gray-800" />
               )}
            </div>
          ) : (
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" 
              onError={() => setError(true)}
            />
          )}
       </div>
       {logo && !error && (
         <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center p-3 shadow-xl z-20">
            <img src={logo} className="w-full h-full object-contain brightness-0 invert" alt="" />
         </div>
       )}
    </div>
  );
}

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
              
              <CEOImage src={ceo.photo} alt={ceo.name} logo={ceo.logo} />

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
