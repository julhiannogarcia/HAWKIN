'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Brain, Sparkles, ChevronRight, Palette, ArrowLeft, CheckCircle2, Trophy, Lightbulb, Settings } from 'lucide-react';
import AIAvatar from '@/components/course/AIAvatar';
import { INCLUSION_CURRICULUM, InclusionModule, InclusionAgeGroup, InclusionPhase } from '@/lib/inclusionData';

export default function InclusionContent() {
  const [view, setView] = useState<'onboarding' | 'dashboard' | 'activity'>('onboarding');
  const [ageGroup, setAgeGroup] = useState<InclusionAgeGroup>('8-12');
  const [phase, setPhase] = useState<InclusionPhase>('Descubrimiento');
  const [activeModule, setActiveModule] = useState<InclusionModule | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredModules = INCLUSION_CURRICULUM.filter(mod => mod.ageGroup === ageGroup && mod.phase === phase);
  const currentStep = activeModule?.steps?.[currentStepIndex];

  const handleStartModule = (mod: InclusionModule) => {
    setActiveModule(mod);
    setCurrentStepIndex(0);
    setView('activity');
    setIsSuccess(false);
  };

  const handleNext = () => {
    if (!activeModule || !activeModule.steps) return;
    
    // Si aún hay pasos pendientes en el módulo actual
    if (currentStepIndex < activeModule.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(null);
    } else {
      // Solo cuando se llega al final del último paso se muestra el éxito
      setIsSuccess(true);
    }
  };

  const handleOptionClick = (index: number) => {
    if (!currentStep?.content?.options) return;
    setSelectedOption(index);
    if (index === currentStep.content.correctOption) {
      // Feedback visual de éxito antes de pasar al siguiente paso
      setShowFeedback('correct');
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setShowFeedback('wrong');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <AnimatePresence mode="wait">
        
        {/* VISTA 1: ONBOARDING */}
        {view === 'onboarding' && (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl w-full bg-white rounded-[60px] p-12 md:p-20 shadow-xl border border-[#F2F4F4] space-y-12"
          >
             <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-[#EBF5FB] rounded-[40px] flex items-center justify-center mx-auto text-4xl shadow-sm">🧩</div>
                <h1 className="text-4xl font-bold text-[#2E86C1]">Configuración del Viaje</h1>
                <p className="text-[#7F8C8D] text-lg font-medium italic">Selecciona tu nivel de entrada para un estímulo perfecto.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <p className="text-[10px] font-black text-[#AAB7B8] uppercase tracking-[0.3em] text-center">Grupo de Edad</p>
                   <div className="space-y-3">
                      {[
                        { id: '4-7', label: 'Exploradores (4-7)', icon: '🌸' },
                        { id: '8-12', label: 'Creadores (8-12)', icon: '📐' },
                        { id: '13-17', label: 'Visionarios (13-17+)', icon: '🧠' }
                      ].map((group) => (
                        <button 
                          key={group.id}
                          onClick={() => setAgeGroup(group.id as InclusionAgeGroup)}
                          className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${ageGroup === group.id ? 'border-[#5DADE2] bg-[#EBF5FB] text-[#2E86C1]' : 'border-[#F2F4F4] text-[#7F8C8D] hover:border-[#D5DBDB]'}`}
                        >
                           <span className="text-2xl">{group.icon}</span>
                           <span className="font-bold">{group.label}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <p className="text-[10px] font-black text-[#AAB7B8] uppercase tracking-[0.3em] text-center">Fase de Aprendizaje</p>
                   <div className="space-y-3">
                      {[
                        { id: 'Descubrimiento', label: 'Descubrimiento', desc: 'Introducción suave', icon: '✨' },
                        { id: 'Maestría', label: 'Maestría', desc: 'Retos de alta capacidad', icon: '🏆' },
                        { id: 'Creación', label: 'Creación', desc: 'Proyectos libres', icon: '🎨' }
                      ].map((f) => (
                        <button 
                          key={f.id}
                          onClick={() => setPhase(f.id as InclusionPhase)}
                          className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${phase === f.id ? 'border-[#27AE60] bg-[#E9F7EF] text-[#27AE60]' : 'border-[#F2F4F4] text-[#7F8C8D] hover:border-[#D5DBDB]'}`}
                        >
                           <span className="text-2xl">{f.icon}</span>
                           <div className="text-left">
                              <p className="font-bold">{f.label}</p>
                              <p className="text-[10px] opacity-60 uppercase font-black">{f.desc}</p>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <button 
               onClick={() => setView('dashboard')}
               className="w-full py-8 bg-[#2E86C1] hover:bg-[#1B4F72] text-white rounded-[35px] font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-4"
             >
                Entrar al Centro de Mando <ChevronRight size={24} />
             </button>
          </motion.div>
        )}

        {/* VISTA 2: DASHBOARD */}
        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-12"
          >
             <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                   <div className="flex items-center gap-4 mb-2 justify-center md:justify-start">
                      <span className="bg-[#EBF5FB] text-[#2E86C1] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#5DADE2]/20">{ageGroup} Años</span>
                      <span className="bg-[#E9F7EF] text-[#27AE60] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#27AE60]/20">Fase {phase}</span>
                   </div>
                   <h2 className="text-4xl font-bold text-[#2C3E50]">Módulos Disponibles</h2>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className={`p-4 rounded-3xl border-2 transition-all ${isAudioEnabled ? 'border-[#5DADE2] text-[#2E86C1] bg-[#EBF5FB]' : 'border-gray-200 text-gray-400'}`}>
                      {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                   </button>
                   <button onClick={() => setView('onboarding')} className="p-4 rounded-3xl border-2 border-[#D5DBDB] text-[#7F8C8D] hover:bg-[#F4F6F7] transition-all flex items-center gap-3">
                      <Settings size={24} />
                      <span className="text-xs font-bold uppercase">Ajustes</span>
                   </button>
                </div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredModules.map((mod) => (
                  <button key={mod.id} onClick={() => handleStartModule(mod)} className={`group p-10 rounded-[50px] ${mod.color} border-2 border-white hover:border-[#D5DBDB] transition-all text-left flex flex-col justify-between min-h-[420px] shadow-sm hover:shadow-2xl`}>
                      <div className="space-y-8">
                        <div className="w-24 h-24 bg-white rounded-[35px] flex items-center justify-center text-5xl shadow-sm group-hover:scale-110 transition-transform">{mod.icon}</div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-bold text-[#2C3E50] leading-tight">{mod.title}</h3>
                            <p className="text-[#7F8C8D] leading-relaxed font-medium">{mod.description}</p>
                        </div>
                      </div>
                      <div className="pt-8 border-t border-black/5 flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-[#AAB7B8] tracking-widest">{mod.steps?.length || 0} Unidades</span>
                         <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2E86C1] shadow-sm group-hover:bg-[#5DADE2] group-hover:text-white transition-all"><ChevronRight size={24} /></div>
                      </div>
                  </button>
                ))}
             </div>
          </motion.div>
        )}

        {/* VISTA 3: ACTIVIDAD */}
        {view === 'activity' && (
          <motion.div 
            key="activity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-6xl mx-auto space-y-12"
          >
             {!isSuccess ? (
               <>
                 <header className="flex items-center justify-between">
                    <button onClick={() => setView('dashboard')} className="flex items-center gap-3 text-[#7F8C8D] font-bold uppercase text-xs hover:text-[#2E86C1] transition-colors bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#F2F4F4]">
                       <ArrowLeft size={16} /> Salir
                    </button>
                    <div className="flex gap-2">
                       {activeModule?.steps?.map((_, i) => (
                          <div key={i} className={`h-2.5 w-16 rounded-full transition-all duration-700 ${i <= currentStepIndex ? 'bg-[#5DADE2] shadow-[0_0_10px_rgba(93,173,226,0.5)]' : 'bg-[#D5DBDB]'}`} />
                       ))}
                    </div>
                    <div className="w-12 h-12 bg-[#EBF5FB] rounded-2xl flex items-center justify-center font-bold text-[#2E86C1]">
                       {Math.round(((currentStepIndex + 1) / (activeModule?.steps?.length || 1)) * 100)}%
                    </div>
                 </header>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <section className="bg-white rounded-[70px] p-16 shadow-xl border border-[#F2F4F4] text-center space-y-10 min-h-[600px] flex flex-col justify-center relative overflow-hidden">
                       <AIAvatar text={currentStep?.avatarText || ''} lang="es" isActive={isAudioEnabled} />
                       <motion.div key={currentStepIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-[#FDFCF8] rounded-[45px] border border-[#EAECEE] relative z-10">
                          <p className="text-[#34495E] text-xl font-medium leading-relaxed italic">"{currentStep?.avatarText || ''}"</p>
                       </motion.div>
                    </section>

                    <section className="space-y-10 flex flex-col justify-center min-h-[600px]">
                       <div className="space-y-4">
                          <h2 className="text-5xl font-black text-[#2C3E50] tracking-tighter leading-tight italic uppercase">{currentStep?.title || ''}</h2>
                          <p className="text-[#7F8C8D] text-xl font-medium">{currentStep?.description || ''}</p>
                       </div>

                       <div className="bg-white rounded-[60px] p-12 border border-[#EAECEE] shadow-xl flex-1 flex flex-col justify-center items-center gap-12 relative overflow-hidden">
                          {currentStep?.type === 'exercise' && (
                            <div className="space-y-10 text-center w-full">
                               <div className="p-8 bg-[#EBF5FB] border border-[#AED6F1] rounded-[40px] text-[#2E86C1] font-bold text-xl shadow-sm">
                                  {currentStep.content?.question || currentStep.description}
                               </div>
                               <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                                  {currentStep.content?.options?.map((opt, i) => (
                                     <button 
                                      key={i} 
                                      onClick={() => handleOptionClick(i)} 
                                      className={`p-6 rounded-[30px] border-4 font-bold text-lg transition-all ${selectedOption === i ? (i === currentStep.content.correctOption ? 'border-[#27AE60] bg-[#E9F7EF]' : 'border-[#E74C3C] bg-[#FDEDEC] animate-shake') : 'border-[#D5DBDB] bg-white hover:border-[#5DADE2] hover:scale-[1.02]'}`}
                                     >
                                        {opt}
                                     </button>
                                  ))}
                               </div>
                            </div>
                          )}

                          {currentStep?.type === 'pattern' && (
                            <div className="space-y-16 w-full text-center">
                               <div className="flex justify-center gap-8">
                                  {currentStep.content?.pattern?.map((p, i) => (
                                     <div key={i} className="text-7xl bg-[#F4F6F7] w-28 h-28 rounded-[35px] flex items-center justify-center shadow-inner hover:scale-105 transition-transform cursor-default">{p}</div>
                                  ))}
                                  <div className="text-7xl bg-[#5DADE2]/10 w-28 h-28 rounded-[35px] flex items-center justify-center border-4 border-dashed border-[#5DADE2] text-[#5DADE2] animate-pulse">?</div>
                               </div>
                               <div className="flex justify-center gap-6 pt-8">
                                  {currentStep.content?.options?.map((opt, i) => (
                                     <button key={i} onClick={() => handleOptionClick(i)} className={`text-6xl w-28 h-28 rounded-[35px] border-4 transition-all shadow-md ${selectedOption === i ? (i === currentStep.content?.correctOption ? 'border-[#27AE60] bg-[#E9F7EF] scale-110' : 'border-[#E74C3C] bg-[#FDEDEC] animate-shake') : 'border-[#D5DBDB] bg-white hover:border-[#5DADE2] hover:scale-105'}`}>
                                        {opt}
                                     </button>
                                  ))}
                               </div>
                            </div>
                          )}

                          {currentStep?.type === 'fact' && (
                            <div className="space-y-10 text-center max-w-md">
                               <div className="w-32 h-32 bg-[#FEF9E7] rounded-[40px] flex items-center justify-center mx-auto shadow-sm"><Lightbulb className="text-[#F1C40F]" size={64} /></div>
                               <p className="text-[#34495E] text-xl font-bold leading-relaxed">{currentStep.content?.fact || ''}</p>
                               <button onClick={handleNext} className="px-16 py-6 bg-[#5DADE2] text-white rounded-[30px] font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#3498DB] transition-all shadow-lg">Entendido</button>
                            </div>
                          )}

                          {currentStep?.type === 'logic' && (
                            <div className="space-y-10 text-center w-full">
                               <div className="p-10 bg-[#E8F8F5] border border-[#A3E4D7] rounded-[40px] text-[#16A085] font-sans leading-relaxed text-lg italic whitespace-pre-wrap">{currentStep.content?.longText || ''}</div>
                               <div className="grid grid-cols-1 gap-4 max-w-xs mx-auto">
                                  {currentStep.content?.options?.map((opt, i) => (
                                     <button key={i} onClick={() => handleOptionClick(i)} className={`p-6 rounded-3xl border-4 font-bold text-lg transition-all ${selectedOption === i ? (i === currentStep.content?.correctOption ? 'border-[#27AE60] bg-[#E9F7EF]' : 'border-[#E74C3C] bg-[#FDEDEC]') : 'border-[#D5DBDB] bg-white hover:border-[#5DADE2]'}`}>{opt}</button>
                                  ))}
                               </div>
                               {!currentStep.content?.options && <button onClick={handleNext} className="px-16 py-6 bg-[#27AE60] text-white rounded-[30px] font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-[#229954] transition-all">Siguiente Paso</button>}
                            </div>
                          )}

                          {currentStep?.type === 'intro' && (
                            <div className="text-center space-y-10">
                               <div className="text-8xl animate-bounce">✨</div>
                               <button onClick={handleNext} className="px-20 py-8 bg-[#5DADE2] text-white rounded-[35px] font-black uppercase tracking-[0.3em] text-lg hover:scale-105 transition-all shadow-[0_20px_50px_rgba(93,173,226,0.3)]">Comenzar Misión</button>
                            </div>
                          )}
                       </div>
                    </section>
                 </div>
               </>
             ) : (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full mx-auto bg-white rounded-[80px] p-20 text-center shadow-2xl border border-[#F2F4F4] space-y-12">
                  <div className="w-48 h-48 bg-[#D5F5E3] rounded-full flex items-center justify-center mx-auto shadow-inner relative"><Trophy className="text-[#27AE60]" size={100} /></div>
                  <div className="space-y-4">
                     <h2 className="text-6xl font-black text-[#2C3E50] tracking-tighter italic uppercase leading-none">Misión <br /><span className="text-[#27AE60]">Éxito.</span></h2>
                     <p className="text-[#7F8C8D] text-2xl font-medium">Has desbloqueado nuevos conocimientos para tu supercomputadora mental.</p>
                  </div>
                  <button onClick={() => setView('dashboard')} className="w-full py-8 bg-[#2C3E50] hover:bg-black text-white rounded-[40px] font-bold text-xl transition-all shadow-xl">Regresar al Mapa</button>
               </motion.div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
