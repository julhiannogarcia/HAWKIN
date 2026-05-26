'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Brain, Sparkles, ChevronRight, LayoutGrid, Palette, ArrowLeft, CheckCircle2, Trophy, Lightbulb } from 'lucide-react';
import AIAvatar from '@/components/course/AIAvatar';
import { INCLUSION_CURRICULUM, InclusionModule, InclusionStep } from '@/lib/inclusionData';

export default function InclusionPage() {
  const [view, setView] = useState<'welcome' | 'dashboard' | 'activity'>('welcome');
  const [activeModule, setActiveModule] = useState<InclusionModule | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentStep = activeModule?.steps[currentStepIndex];

  const handleStartModule = (mod: InclusionModule) => {
    setActiveModule(mod);
    setCurrentStepIndex(0);
    setView('activity');
    setIsSuccess(false);
  };

  const handleNext = () => {
    if (!activeModule) return;
    if (currentStepIndex < activeModule.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsSuccess(true);
    }
  };

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    if (index === currentStep?.content.correctOption) {
      // Pequeño delay para celebrar antes de pasar
      setTimeout(() => {
        handleNext();
      }, 1000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <AnimatePresence mode="wait">
        
        {/* VISTA 1: BIENVENIDA */}
        {view === 'welcome' && (
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
                <p className="text-[#7F8C8D] text-lg leading-relaxed font-medium">
                   Bienvenido a un espacio diseñado solo para ti. Aquí el silencio y la calma nos ayudan a crear cosas increíbles.
                </p>
             </div>

             <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setView('dashboard')}
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
        )}

        {/* VISTA 2: DASHBOARD (MUNDOS) */}
        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-12"
          >
             <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                   <h2 className="text-4xl font-bold text-[#2C3E50]">Tu Centro de Descubrimientos</h2>
                   <p className="text-[#95A5A6] font-medium text-lg">Selecciona un mundo para comenzar tu sesión.</p>
                </div>
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                     className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-3 ${isAudioEnabled ? 'border-[#5DADE2] text-[#2E86C1] bg-[#EBF5FB]' : 'border-gray-200 text-gray-400'}`}
                   >
                      {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                      <span className="text-xs font-bold uppercase">Sonidos: {isAudioEnabled ? 'ON' : 'OFF'}</span>
                   </button>
                   <button onClick={() => setView('welcome')} className="p-4 rounded-3xl border-2 border-[#D5DBDB] text-[#7F8C8D] hover:bg-[#F4F6F7] transition-all">
                      <ArrowLeft size={24} />
                   </button>
                </div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {INCLUSION_CURRICULUM.map((mod) => (
                   <button 
                    key={mod.id}
                    onClick={() => handleStartModule(mod)}
                    className={`group p-10 rounded-[50px] ${mod.color} border-2 border-white hover:border-[#D5DBDB] transition-all text-left flex flex-col justify-between min-h-[400px] shadow-sm hover:shadow-2xl`}
                   >
                      <div className="space-y-8">
                         <div className="w-24 h-24 bg-white rounded-[35px] flex items-center justify-center text-5xl shadow-sm group-hover:scale-110 transition-transform">
                            {mod.icon}
                         </div>
                         <div className="space-y-3">
                            <h3 className="text-3xl font-bold text-[#2E86C1] leading-tight">{mod.title}</h3>
                            <p className="text-[#7F8C8D] leading-relaxed font-medium">{mod.description}</p>
                         </div>
                      </div>

                      <div className="pt-8 border-t border-white/40 flex items-center justify-between">
                         <div className="bg-white/60 px-4 py-2 rounded-2xl text-xs font-bold text-[#7F8C8D]">
                            {mod.steps.length} Actividades
                         </div>
                         <div className="w-10 h-10 rounded-full bg-[#5DADE2] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={20} />
                         </div>
                      </div>
                   </button>
                ))}
                
                {/* Módulos de Relleno para Sensación de Profundidad */}
                <div className="p-10 rounded-[50px] bg-[#F4F6F7] border-2 border-dashed border-[#D5DBDB] opacity-40 flex flex-col items-center justify-center text-center space-y-4">
                   <Palette size={48} className="text-[#BDC3C7]" />
                   <h3 className="text-xl font-bold text-[#7F8C8D]">Próximamente: <br />Laboratorio de Color</h3>
                </div>
             </div>
          </motion.div>
        )}

        {/* VISTA 3: ACTIVIDAD INTERACTIVA */}
        {view === 'activity' && (
          <motion.div 
            key="activity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-5xl mx-auto space-y-12"
          >
             {!isSuccess ? (
               <>
                 <header className="flex items-center justify-between">
                    <button 
                      onClick={() => setView('dashboard')}
                      className="flex items-center gap-2 text-[#7F8C8D] font-bold uppercase text-xs hover:text-[#2E86C1] transition-colors"
                    >
                       <ArrowLeft size={16} /> Abandonar Mundo
                    </button>
                    <div className="flex gap-2">
                       {activeModule?.steps.map((_, i) => (
                          <div key={i} className={`h-2 w-12 rounded-full transition-all ${i <= currentStepIndex ? 'bg-[#5DADE2]' : 'bg-[#D5DBDB]'}`} />
                       ))}
                    </div>
                 </header>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <section className="bg-white rounded-[60px] p-12 shadow-sm border border-[#F2F4F4] text-center space-y-8 min-h-[500px] flex flex-col justify-center">
                       <AIAvatar 
                         text={currentStep?.avatarText || ''} 
                         lang="es" 
                         isActive={isAudioEnabled} 
                       />
                       <div className="p-8 bg-[#FDFCF8] rounded-[40px] border border-[#EAECEE]">
                          <p className="text-[#34495E] text-lg font-medium italic">"{currentStep?.avatarText}"</p>
                       </div>
                    </section>

                    <section className="space-y-8 flex flex-col justify-center min-h-[500px]">
                       <div className="space-y-3">
                          <h2 className="text-4xl font-bold text-[#2C3E50] tracking-tight">{currentStep?.title}</h2>
                          <p className="text-[#7F8C8D] text-lg font-medium">{currentStep?.description}</p>
                       </div>

                       <div className="bg-white rounded-[50px] p-10 border border-[#EAECEE] shadow-sm flex-1 flex flex-col justify-center items-center gap-12">
                          
                          {/* MODO: PATRONES */}
                          {currentStep?.type === 'pattern' && (
                            <div className="space-y-12 w-full text-center">
                               <div className="flex justify-center gap-6">
                                  {currentStep.content.pattern?.map((p, i) => (
                                     <div key={i} className="text-6xl bg-[#F4F6F7] w-24 h-24 rounded-3xl flex items-center justify-center shadow-inner">{p}</div>
                                  ))}
                                  <div className="text-6xl bg-[#5DADE2]/10 w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-dashed border-[#5DADE2] text-[#5DADE2] animate-pulse">?</div>
                               </div>

                               <div className="flex justify-center gap-4 pt-8">
                                  {currentStep.content.options?.map((opt, i) => (
                                     <button 
                                      key={i}
                                      onClick={() => handleOptionClick(i)}
                                      className={`text-5xl w-24 h-24 rounded-3xl border-4 transition-all ${selectedOption === i ? (i === currentStep.content.correctOption ? 'border-[#27AE60] bg-[#E9F7EF]' : 'border-[#E74C3C] bg-[#FDEDEC]') : 'border-[#D5DBDB] bg-white hover:border-[#5DADE2]'}`}
                                     >
                                        {opt}
                                     </button>
                                  ))}
                               </div>
                            </div>
                          )}

                          {/* MODO: LÓGICA / DATO */}
                          {currentStep?.type === 'logic' && (
                            <div className="space-y-8 text-center max-w-sm">
                               <div className="w-24 h-24 bg-[#FEF9E7] rounded-full flex items-center justify-center mx-auto">
                                  <Lightbulb className="text-[#F1C40F]" size={48} />
                               </div>
                               <p className="text-[#34495E] font-medium leading-relaxed">{currentStep.content.fact}</p>
                               <button 
                                onClick={handleNext}
                                className="px-12 py-5 bg-[#5DADE2] text-white rounded-[25px] font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-lg"
                               >
                                  Entendido, Continuar
                               </button>
                            </div>
                          )}

                          {currentStep?.type === 'intro' && (
                            <div className="text-center space-y-8">
                               <div className="text-6xl animate-bounce">🎈</div>
                               <button 
                                onClick={handleNext}
                                className="px-12 py-5 bg-[#5DADE2] text-white rounded-[25px] font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-lg"
                               >
                                  Empezar Reto
                               </button>
                            </div>
                          )}
                       </div>
                    </section>
                 </div>
               </>
             ) : (
               /* PANTALLA DE ÉXITO FINAL */
               <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full mx-auto bg-white rounded-[60px] p-20 text-center shadow-xl border border-[#F2F4F4] space-y-10"
               >
                  <div className="w-40 h-40 bg-[#D5F5E3] rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                     <div className="absolute inset-0 bg-[#27AE60] opacity-10 rounded-full animate-ping" />
                     <Trophy className="text-[#27AE60]" size={80} />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-5xl font-bold text-[#2C3E50]">¡Increíble Trabajo!</h2>
                     <p className="text-[#7F8C8D] text-xl font-medium">Has completado el mundo de {activeModule?.title}. Tu cerebro es una supercomputadora.</p>
                  </div>
                  <button 
                    onClick={() => setView('dashboard')}
                    className="w-full py-8 bg-[#27AE60] hover:bg-[#2ECC71] text-white rounded-[35px] font-bold text-xl transition-all shadow-lg"
                  >
                     Volver a mis Descubrimientos
                  </button>
               </motion.div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
