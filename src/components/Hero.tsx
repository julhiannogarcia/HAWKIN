'use client';

import { motion } from 'framer-motion';
import { Play, Shield, Zap, Globe, MessageCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 1. MOTOR DE VIDEO INSTITUCIONAL (REPRODUCCIÓN INFINITA) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Usamos un video de stock de tecnología hasta que Julhianno me pase el suyo real de redes */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-40 scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-cyber-security-specialist-working-on-a-laptop-42358-large.mp4" type="video/mp4" />
        </video>
        {/* Capa de Glassmorphism sobre el video */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
             <Zap className="text-cyan-400" size={14} />
             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Ecosistema Global de IA</span>
          </div>

          <h1 className="text-7xl md:text-[120px] font-black tracking-tighter leading-[0.8] uppercase italic">
            Descubre la IA que <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">otros no ven.</span>
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            El primer centro de inteligencia liderado por <b className="text-white">Julhianno Garcia</b>. 
            Rumores de CEOs, Academia de Élite y Blindaje SHIELD en un solo lugar.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
            <button className="btn-glow text-[11px] py-6 px-12 group flex items-center gap-4">
               INICIAR EXPERIENCIA <Shield size={18} className="group-hover:rotate-12 transition-transform" />
            </button>
            <button className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-4">
               <Play size={18} fill="currentColor" /> Ver Presentación
            </button>
          </div>
        </motion.div>
      </div>

      {/* Indicador de Status del Fundador (En vivo) */}
      <div className="absolute bottom-12 left-12 flex items-center gap-4 p-4 bg-black/60 backdrop-blur-xl border border-white/5 rounded-3xl hidden md:flex">
         <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200" 
              className="w-12 h-12 rounded-2xl object-cover border border-cyan-500/50" 
              alt="Julhianno"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
         </div>
         <div className="text-left">
            <p className="text-[10px] font-black text-white uppercase tracking-tighter">Julhianno Garcia</p>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Fundador • En Línea</p>
         </div>
      </div>

      {/* Floating Badge Social */}
      <div className="absolute bottom-12 right-12 hidden lg:block">
         <div className="flex flex-col items-end gap-3 text-right">
            <div className="flex items-center gap-4 text-cyan-400">
               <Globe size={16} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Conectado a la Red Global</span>
            </div>
         </div>
      </div>
    </section>
  );
}
