'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Play, Shield, Zap, Globe, Volume2, VolumeX } from 'lucide-react';

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 1. MOTOR DE VIDEO CON CONTROL DE AUDIO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-50 scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-cyber-security-specialist-working-on-a-laptop-42358-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
            
            {/* BOTÓN DE AUDIO INTERACTIVO */}
            <button 
              onClick={toggleMute}
              className="px-12 py-6 bg-white text-black rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-4 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
            >
               {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
               {isMuted ? 'ACTIVAR SONIDO' : 'SILENCIAR'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Control Flotante de Audio en la esquina */}
      <div className="absolute bottom-12 right-12 z-20 hidden md:block">
         <button 
           onClick={toggleMute}
           className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white hover:border-cyan-400 transition-all group"
         >
            {isMuted ? <VolumeX size={20} className="text-gray-500 group-hover:text-white" /> : <Volume2 size={20} className="text-cyan-400" />}
         </button>
      </div>

      {/* Status del Fundador */}
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
    </section>
  );
}
