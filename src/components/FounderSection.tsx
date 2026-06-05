'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Zap, Globe } from 'lucide-react';

export default function FounderSection() {
  const founders = [
    {
      name: 'Julhianno Garcia',
      role: 'Fundador & Director de Inteligencia',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', // Foto profesional placeholder
      bio: 'Visionario tecnológico y estratega de IA. Liderando la frontera de la inteligencia global desde el núcleo HAWKIN.'
    }
  ];

  return (
    <section className="w-full bg-[#050505] py-32 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        
        <div className="flex flex-col lg:flex-row gap-20 items-center">
           
           {/* BRANDING LADO IZQUIERDO */}
           <div className="lg:w-1/2 space-y-12">
              <div className="flex items-center gap-6 group">
                 <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-[30px] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                    <Shield className="text-white fill-white" size={40} />
                 </div>
                 <div>
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                       HAWKIN <br /> <span className="text-cyan-400">Intelligence.</span>
                    </h2>
                 </div>
              </div>

              <div className="space-y-6">
                 <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl">
                    "Nuestra misión es descifrar la carrera por la Inteligencia Artificial, proporcionando transparencia y datos de élite a la comunidad global."
                 </p>
                 <div className="flex flex-wrap gap-8 pt-6">
                    <div className="flex items-center gap-3">
                       <Award size={24} className="text-cyan-500" />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Tecnología de Vanguardia</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Globe size={24} className="text-purple-500" />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Red Global de Sensores</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* FOUNDER LADO DERECHO */}
           <div className="lg:w-1/2">
              {founders.map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-12 bg-white/[0.02] border border-white/10 rounded-[60px] flex flex-col md:flex-row items-center gap-10 shadow-3xl relative group"
                >
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Zap size={100} className="text-cyan-500" />
                   </div>
                   
                   <div className="w-48 h-48 rounded-[40px] overflow-hidden border-4 border-white/5 shadow-2xl shrink-0">
                      <img src={f.photo} alt={f.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   </div>
                   
                   <div className="space-y-4">
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Liderazgo HAWKIN</span>
                      <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">{f.name}</h3>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{f.role}</p>
                      <p className="text-gray-400 font-light italic leading-relaxed text-sm">"{f.bio}"</p>
                   </div>
                </motion.div>
              ))}
           </div>

        </div>

      </div>
    </section>
  );
}
