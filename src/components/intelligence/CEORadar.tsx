'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Users, Globe, Zap, ShieldCheck, Activity, User } from 'lucide-react';

const CEOS = [
  { 
    id: 1, name: "Sam Altman", role: "CEO @ OpenAI", company: "OpenAI",
    influence: 98, momentum: "+4.2", confidence: 95,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Sam_Altman_in_2023.jpg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
    lastMove: 'Alianza global con Apple Intelligence. Despliegue de GPT-4o.', color: '#10a37f' 
  },
  { 
    id: 2, name: "Jensen Huang", role: "CEO @ NVIDIA", company: "NVIDIA",
    influence: 99, momentum: "+5.5", confidence: 98,
    photo: "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/e/e6/Jen-Hsun_Huang_2025.jpg&w=400&h=400&fit=cover",
    logo: "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg",
    lastMove: 'Anuncio de arquitectura Vera Rubin. Dominio absoluto de mercado.', color: '#76b900' 
  },
  { 
    id: 3, name: "Elon Musk", role: "Founder @ xAI", company: "xAI",
    influence: 96, momentum: "+6.1", confidence: 90,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Elon_Musk_Royal_Society_(crop1).jpg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/X_logo_2023.svg",
    lastMove: 'Fusión de capacidades xAI con Starlink. Mega-clúster en Memphis.', color: '#ffffff' 
  },
  { 
    id: 4, name: "Demis Hassabis", role: "CEO @ Google DeepMind", company: "Google DeepMind",
    influence: 95, momentum: "+3.8", confidence: 92,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Demis_Hassabis_Royal_Society.jpg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg",
    lastMove: 'Avances en biología computacional (AlphaFold 3).', color: '#4285F4' 
  },
  { 
    id: 5, name: "Dario Amodei", role: "CEO @ Anthropic", company: "Anthropic",
    influence: 93, momentum: "+4.5", confidence: 89,
    photo: "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg/960px-Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg&w=400&h=400&fit=cover",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png",
    lastMove: 'Lanzamiento de Claude 3.5 Sonnet superando benchmarks.', color: '#d97757' 
  },
  { 
    id: 6, name: "Satya Nadella", role: "CEO @ Microsoft", company: "Microsoft",
    influence: 97, momentum: "+2.1", confidence: 96,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/MS-Exec-Nadella-Satya-2017-08-31-22_(cropped).jpg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    lastMove: 'Integración agresiva de Copilot en todo el ecosistema Windows.', color: '#00a4ef' 
  },
  { 
    id: 7, name: "Mark Zuckerberg", role: "CEO @ Meta", company: "Meta",
    influence: 94, momentum: "+5.0", confidence: 93,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Mark_Zuckerberg_F8_2019_Keynote_(32830578711)_(cropped).jpg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    lastMove: 'Llama 3 Open Source disrumpiendo el modelo de negocio cerrado.', color: '#0668E1' 
  },
  { 
    id: 8, name: "Sundar Pichai", role: "CEO @ Alphabet", company: "Alphabet",
    influence: 95, momentum: "+1.5", confidence: 91,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Sundar_Pichai_(2023)_hosted_by_Prezident.sk_(cropped).jpg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_G_Logo.svg",
    lastMove: 'Reestructuración interna para acelerar Gemini.', color: '#4285F4' 
  },
  { 
    id: 9, name: "Ilya Sutskever", role: "Founder @ SSI", company: "SSI",
    influence: 92, momentum: "+8.0", confidence: 85,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Ilya_Sutskever_2023.jpg",
    logo: "https://images.crunchbase.com/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7/v1500000000/i6v6v6h8o8z8l8u8p8u0.jpg",
    lastMove: 'Fundación de Safe Superintelligence Inc. tras salida de OpenAI.', color: '#888888' 
  },
  { 
    id: 10, name: "Alexandr Wang", role: "CEO @ Scale AI", company: "Scale AI",
    influence: 90, momentum: "+4.0", confidence: 88,
    photo: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexandr_Wang.jpg",
    logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=100",
    lastMove: 'Levantamiento de $1B en Series F para dominio de datos.', color: '#aa00ff' 
  }
];

function CEOImage({ src, alt, logo, ceoName }: { src: string, alt: string, logo?: string, ceoName: string }) {
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
              key={ceo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/[0.015] border border-white/5 rounded-[35px] p-4 md:p-6 hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all duration-500 group relative flex flex-col"
            >
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-[7px] font-black text-cyan-500">
                #{index + 1}
              </div>
              
              <CEOImage src={ceo.photo} alt={ceo.name} logo={ceo.logo} ceoName={ceo.name} />

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
