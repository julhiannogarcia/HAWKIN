'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* HEADER DE LA PLATAFORMA (Independiente) */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-8 sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <span className="font-black text-black text-xl italic">H</span>
           </div>
           <div>
              <h2 className="text-sm font-black uppercase tracking-widest italic">HAWKIN <span className="text-cyan-400">LEARNING</span></h2>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.4em]">Soberanía Intelectual</p>
           </div>
        </div>

        <div className="flex items-center gap-8">
           {/* Perfil eliminado para anonimato */}
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
