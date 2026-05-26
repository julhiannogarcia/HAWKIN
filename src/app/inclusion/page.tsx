'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, BookOpen, Brain, Sparkles, ChevronRight, LayoutGrid, Palette } from 'lucide-react';
import AIAvatar from '@/components/course/AIAvatar'; // Reusamos el motor pero cambiaremos el tono

const modules = [
  {
    id: 'patterns',
    title: 'Mundo de Patrones',
    icon: <LayoutGrid className="text-[#3498DB]" size={32} />,
    color: 'bg-[#EBF5FB]',
    description: 'Descubre la belleza del orden y las secuencias lógicas.',
    activities: [
      { id: 'p1', title: 'Secuencias de Colores', xp: 50 },
      { id: 'p2', title: 'Arquitectura de Bloques', xp: 100 }
    ]
  },
  {
    id: 'creative',
    title: 'Laboratorio de Color',
    icon: <Palette className="text-[#9B59B6]" size={32} />,
    color: 'bg-[#F5EEF8]',
    description: 'Expresa tus ideas a través de artes digitales calmantes.',
    activities: [
      { id: 'c1', title: 'Pintura por Capas', xp: 75 }
    ]
  },
  {
    id: 'logic',
    title: 'Pequeños Ingenieros',
    icon: <Brain className="text-[#27AE60]" size={32} />,
    color: 'bg-[#E9F7EF]',
    description: 'Resuelve retos complejos de ingeniería espacial.',
    activities: [
      { id: 'l1', title: 'Misión Marte', xp: 150 }
    ]
  }
];

export default function InclusionPage() {
  const [activeView, setActiveDay] = useState<'welcome' | 'dashboard'>('welcome');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  return (
    <div className="flex-1 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {activeView === 'welcome' ? (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl w-full bg-white rounded-[60px] p-12 md:p-20 text-center shadow-xl border border-[#F2F4F4] space-y-10"
          >
             <div className="w-32 h-32 bg-[#D4E6F1] rounded-full flex items-center justify-center mx-auto">
                <span className="text-6xl animate-pulse">👋</span>
             </div>
             
             <div className="space-y-4">
                <h1 className="text-4xl font-bold text-[#2E86C1] tracking-tight">¡Hola, Genio!</h1>
                <p className="text-[#7F8C8D] text-lg leading-relaxed">
                   Bienvenido a un espacio diseñado solo para ti. Aquí el silencio y la calma nos ayudan a crear cosas increíbles.
                </p>
             </div>

             <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setActiveDay('dashboard')}
                  className="w-full py-8 bg-[#5DADE2] hover:bg-[#3498DB] text-white rounded-[35px] font-bold text-xl transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-4"
                >
                   Empezar a Explorar <ChevronRight size={24} />
                </button>
                <div className="flex items-center justify-center gap-2 text-[#BDC3C7]">
                   <Heart size={14} fill="currentColor" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[#95A5A6]">Entorno Seguro de Alta Capacidad</span>
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-12"
          >
             <header className="flex justify-between items-end">
                <div className="space-y-2">
                   <h2 className="text-3xl font-bold text-[#2C3E50]">Tu Centro de Descubrimientos</h2>
                   <p className="text-[#95A5A6]">Selecciona un mundo para comenzar tu sesión.</p>
                </div>
                <button 
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-3 ${isAudioEnabled ? 'border-[#5DADE2] text-[#2E86C1] bg-[#EBF5FB]' : 'border-gray-200 text-gray-400'}`}
                >
                   {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                   <span className="text-xs font-bold uppercase">Sonidos: {isAudioEnabled ? 'ON' : 'OFF'}</span>
                </button>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((mod) => (
                   <button 
                    key={mod.id}
                    className={`group p-10 rounded-[50px] ${mod.color} border-2 border-white hover:border-[#D5DBDB] transition-all text-left flex flex-col justify-between h-[360px] shadow-sm hover:shadow-xl`}
                   >
                      <div className="space-y-6">
                         <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            {mod.icon}
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-[#2E86C1]">{mod.title}</h3>
                            <p className="text-sm text-[#7F8C8D] leading-relaxed font-medium">{mod.description}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-2">
                         {mod.activities.map((act) => (
                            <div key={act.id} className="bg-white/60 px-3 py-1.5 rounded-2xl text-[10px] font-bold text-[#7F8C8D]">
                               ✦ {act.xp} XP
                            </div>
                         ))}
                      </div>
                   </button>
                ))}
             </div>

             {/* NOTA PARA PADRES/TUTORES */}
             <div className="mt-20 p-8 bg-white border border-[#EAECEE] rounded-[40px] flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="w-16 h-16 bg-[#F9EBEA] rounded-2xl flex items-center justify-center text-3xl">🧩</div>
                <div className="flex-1 space-y-1">
                   <p className="text-xs font-bold text-[#E74C3C] uppercase tracking-widest">Guía para Tutores</p>
                   <p className="text-sm text-[#7F8C8D]">Este entorno utiliza la metodología **HAWKIN Focus**. Si nota signos de cansancio visual, active el Modo Calma Extrema en los ajustes.</p>
                </div>
                <button className="px-8 py-3 border-2 border-[#D5DBDB] rounded-2xl text-[10px] font-bold uppercase hover:bg-[#F4F6F7] transition-all">Ver Reporte de Progreso</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
