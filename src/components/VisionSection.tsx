'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Globe, Shield, Cpu, Rocket } from 'lucide-react';

export default function VisionSection() {
  const milestones = [
    {
      title: "Expansión Satelital",
      desc: "Inyectar nuestra red de noticias en los principales hubs tecnológicos de Asia y Europa.",
      icon: <Globe size={24} className="text-blue-500" />,
      date: "Q3 2026"
    },
    {
      title: "IA Generativa Alpha",
      desc: "Lanzamiento de nuestro propio modelo LLM optimizado para análisis de mercados financieros.",
      icon: <Cpu size={24} className="text-cyan-400" />,
      date: "Q4 2026"
    },
    {
      title: "HAWKIN City",
      desc: "El primer centro físico de experimentación tecnológica y educación de élite.",
      icon: <Rocket size={24} className="text-purple-500" />,
      date: "2027"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-40 w-full relative overflow-hidden">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="text-center space-y-4 mb-24 relative z-10">
        <div className="flex items-center justify-center gap-3">
           <Target className="text-blue-500 animate-pulse" size={16} />
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Hoja de Ruta Élite</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
          Visión <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Sin Límites.</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
           HAWKIN no se detiene. Nuestra infraestructura evoluciona cada segundo para mantener la soberanía tecnológica de nuestros socios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {milestones.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 hover:border-blue-500/20 transition-all group"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
               {item.icon}
            </div>
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-4">{item.date}</span>
            <h4 className="text-2xl font-black text-white uppercase italic mb-4">{item.title}</h4>
            <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-12 rounded-[60px] bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 border border-white/5 text-center relative z-10">
         <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic mb-4">¿Preparado para el Futuro?</h3>
         <button 
           onClick={() => document.getElementById('planes')?.scrollIntoView({behavior: 'smooth'})}
           className="px-12 py-5 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
         >
           Asegurar mi lugar en la red
         </button>
      </div>
    </section>
  );
}
