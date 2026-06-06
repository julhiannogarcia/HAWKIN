'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Users, Globe, Zap, ShieldCheck, Activity, User } from 'lucide-react';

const CEOS = [
  { 
    name: 'Sam Altman', company: 'OpenAI', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    photo: 'https://images.openai.com/blob/6130513a-0792-4980-9731-15e2695bf58b/sam-altman.jpg', 
    influence: 98, momentum: '+4.2', confidence: 95, 
    lastMove: 'Alianza global con Apple Intelligence. Despliegue de GPT-4o.', color: '#10a37f' 
  },
  { 
    name: 'Jensen Huang', company: 'NVIDIA', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg',
    photo: 'https://cdn.statically.io/img/upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jensen_Huang_at_Computex_2023.jpg/800px-Jensen_Huang_at_Computex_2023.jpg', 
    influence: 99, momentum: '+5.5', confidence: 98, 
    lastMove: 'Anuncio de arquitectura Vera Rubin. Dominio absoluto de mercado.', color: '#76b900' 
  },
  { 
    name: 'Elon Musk', company: 'xAI', role: 'Founder', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/X_logo_2023.svg',
    photo: 'https://www.tesla.com/sites/default/files/about/executives/elon-musk.jpg', 
    influence: 96, momentum: '+6.1', confidence: 90, 
    lastMove: 'Fusión de capacidades xAI con Starlink. Mega-clúster en Memphis.', color: '#ffffff' 
  },
  { 
    name: 'Demis Hassabis', company: 'Google DeepMind', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg',
    photo: 'https://cdn.statically.io/img/upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Demis_Hassabis_%282024%29.jpg/800px-Demis_Hassabis_%282024%29.jpg', 
    influence: 95, momentum: '+3.8', confidence: 92, 
    lastMove: 'Avances en biología computacional (AlphaFold 3).', color: '#4285F4' 
  },
  { 
    name: 'Dario Amodei', company: 'Anthropic', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png',
    photo: 'https://cdn.statically.io/img/upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg/800px-Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg', 
    influence: 93, momentum: '+4.5', confidence: 89, 
    lastMove: 'Lanzamiento de Claude 3.5 Sonnet superando benchmarks.', color: '#d97757' 
  },
  { 
    name: 'Satya Nadella', company: 'Microsoft', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    photo: 'https://news.microsoft.com/wp-content/uploads/prod/sites/45/2014/01/Satya-Nadella-Portrait.jpg', 
    influence: 97, momentum: '+2.1', confidence: 96, 
    lastMove: 'Integración agresiva de Copilot en todo el ecosistema Windows.', color: '#00a4ef' 
  },
  { 
    name: 'Mark Zuckerberg', company: 'Meta', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    photo: 'https://cdn.statically.io/img/upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/800px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg', 
    influence: 94, momentum: '+5.0', confidence: 93, 
    lastMove: 'Llama 3 Open Source disrumpiendo el modelo de negocio cerrado.', color: '#0668E1' 
  },
  { 
    name: 'Sundar Pichai', company: 'Alphabet', role: 'CEO', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg',
    photo: 'https://cdn.statically.io/img/upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Sundar_Pichai_%282023%29.jpg/800px-Sundar_Pichai_%282023%29.jpg', 
    influence: 95, momentum: '+1.5', confidence: 91, 
    lastMove: 'Reestructuración interna para acelerar Gemini.', color: '#4285F4' 
  },
  { 
    name: 'Ilya Sutskever', company: 'SSI', role: 'Founder', 
    logo: 'https://images.crunchbase.com/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7/v1500000000/i6v6v6h8o8z8l8u8p8u0.jpg',
    photo: 'https://cdn.statically.io/img/upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ilya_Sutskever_%282023%29.jpg/800px-Ilya_Sutskever_%282023%29.jpg', 
    influence: 92, momentum: '+8.0', confidence: 85, 
    lastMove: 'Fundación de Safe Superintelligence Inc. tras salida de OpenAI.', color: '#888888' 
  },
  { 
    name: 'Alexandr Wang', company: 'Scale AI', role: 'CEO', 
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=100',
    photo: 'https://cdn.statically.io/img/upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Alexandr_Wang_at_the_2023_World_Economic_Forum.jpg/800px-Alexandr_Wang_at_the_2023_World_Economic_Forum.jpg', 
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
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black">
               {logo ? (
                 <img src={logo} className="w-full h-full object-contain brightness-0 invert opacity-60" alt="logo fallback" />
               ) : (
                 <User size={60} className="text-gray-800" />
               )}
            </div>
          ) : (
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-full object-cover opacity-100 transition-all duration-700" 
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
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                 CEO <span className="text-cyan-400">Radar.</span>
              </h2>
              <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Líderes que controlan el futuro tecnológico</p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {CEOS.map((ceo, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/[0.015] border border-white/5 rounded-[35px] p-4 md:p-6 hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all duration-500 group relative flex flex-col"
            >
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] font-black text-cyan-500">
                #{index + 1}
              </div>
              
              <CEOImage src={ceo.photo} alt={ceo.name} logo={ceo.logo} />

              <div className="text-center mb-4 md:mb-6">
                 <h3 className="text-base md:text-lg font-black uppercase italic tracking-tighter text-white">{ceo.name}</h3>
                 <p className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest mt-0.5">{ceo.role} @ {ceo.company}</p>
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

              <div className="mt-auto pt-3 border-t border-white/5 text-left">
                 <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                    <Activity size={8} /> Último Movimiento
                 </span>
                 <p className="text-[9px] text-gray-400 font-light leading-snug italic line-clamp-2 group-hover:line-clamp-none transition-all">"{ceo.lastMove}"</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
