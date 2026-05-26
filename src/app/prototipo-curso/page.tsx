'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from '@/components/course/AIAvatar';
import { ENGLISH_COURSE_DATA, LessonStep } from '@/lib/courseData';
import GlobalTicker from '@/components/Ticker';
import { ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function CoursePrototypePage() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentLesson = ENGLISH_COURSE_DATA[currentLessonIndex];
  const currentStep = currentLesson.steps[currentStepIndex];

  // Iniciar la voz automáticamente cuando cambia el paso
  useEffect(() => {
    setIsSpeaking(true);
    setSelectedOption(null);
    setShowFeedback(null);
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    if (index === currentStep.uiContent?.correctOption) {
      setShowFeedback('correct');
      // Esperar un momento antes de permitir avanzar si es correcto
    } else {
      setShowFeedback('wrong');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black flex flex-col">
      {/* HEADER DEL CURSO */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/academy" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Módulo 1: Fundamentos de Élite</p>
            <h1 className="text-sm font-bold uppercase tracking-tighter">{currentLesson.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Progreso de Lección</p>
            <div className="flex gap-1 mt-1">
              {currentLesson.steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-8 rounded-full transition-all duration-500 ${i <= currentStepIndex ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-white/10'}`} 
                />
              ))}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black">
            {Math.round(((currentStepIndex + 1) / currentLesson.steps.length) * 100)}%
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        
        {/* LADO IZQUIERDO: EL AVATAR Y VISUALES */}
        <section className="relative flex items-center justify-center bg-[#050505] border-r border-white/5 p-8 lg:p-20 overflow-hidden">
           {/* Fondo dinámico */}
           <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full" />
           </div>

           <div className="relative z-10 w-full max-w-md">
              <AIAvatar 
                text={currentStep.avatarText} 
                lang={currentStep.avatarLang} 
                isSpeaking={isSpeaking}
                onEnd={() => setIsSpeaking(false)}
              />
              
              {/* SUBTÍTULOS DINÁMICOS */}
              <motion.div 
                key={currentStep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-center"
              >
                 <p className="text-gray-400 text-sm font-light italic leading-relaxed px-12">
                   "{currentStep.avatarText}"
                 </p>
              </motion.div>
           </div>
        </section>

        {/* LADO DERECHO: INTERACCIÓN Y CONTENIDO */}
        <section className="p-8 lg:p-20 flex flex-col justify-center bg-black relative">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12 max-w-xl mx-auto w-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-cyan-500 rounded-full" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                      {currentStep.uiContent?.title}
                    </h2>
                  </div>
                  <p className="text-gray-500 text-lg font-light leading-relaxed">
                    {currentStep.uiContent?.description}
                  </p>
                </div>

                {/* CONTENIDO ESPECÍFICO DEL PASO */}
                <div className="pt-8">
                  {currentStep.type === 'quiz' && (
                    <div className="grid grid-cols-1 gap-4">
                      {currentStep.uiContent?.options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(index)}
                          className={`p-6 rounded-[25px] border text-left transition-all flex items-center justify-between group ${
                            selectedOption === index 
                              ? (index === currentStep.uiContent?.correctOption ? 'bg-cyan-500/10 border-cyan-400' : 'bg-red-500/10 border-red-500')
                              : 'bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className={`font-bold ${selectedOption === index ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                            {option}
                          </span>
                          {selectedOption === index && (
                            index === currentStep.uiContent?.correctOption 
                              ? <CheckCircle2 className="text-cyan-400" size={20} />
                              : <AlertCircle className="text-red-500" size={20} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentStep.type === 'practice' && (
                    <div className="p-10 bg-cyan-500/5 border border-cyan-500/20 rounded-[40px] text-center space-y-6">
                       <BookOpen className="text-cyan-400 mx-auto" size={40} />
                       <h4 className="text-xl font-bold italic uppercase">Laboratorio de Pronunciación</h4>
                       <p className="text-gray-400 text-sm">Escucha la voz de la IA y trata de imitar la cadencia y el acento.</p>
                       <button 
                        onClick={() => setIsSpeaking(true)}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                       >
                         Volver a Escuchar
                       </button>
                    </div>
                  )}
                </div>

                {/* FEEDBACK Y NAVEGACIÓN */}
                <div className="pt-12">
                   {showFeedback === 'wrong' && (
                     <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                       <AlertCircle size={14} /> Inténtalo de nuevo, socio. Revisa la lección anterior.
                     </p>
                   )}
                   
                   <button
                     disabled={currentStep.type === 'quiz' && showFeedback !== 'correct'}
                     onClick={handleNext}
                     className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 transition-all shadow-2xl disabled:opacity-30 ${
                        showFeedback === 'correct' || currentStep.type !== 'quiz'
                          ? 'bg-white text-black hover:bg-cyan-400'
                          : 'bg-white/5 text-gray-700 border border-white/5'
                     }`}
                   >
                     {currentStepIndex === currentLesson.steps.length - 1 ? 'FINALIZAR LECCIÓN' : 'SIGUIENTE PASO'}
                     <ChevronRight size={18} />
                   </button>
                </div>
              </motion.div>
            ) : (
              /* PANTALLA DE ÉXITO FINAL */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-12 max-w-md mx-auto"
              >
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-cyan-400 blur-2xl opacity-20 rounded-full animate-pulse" />
                  <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                    <Trophy className="text-black" size={48} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">¡Lección Dominada!</h2>
                  <p className="text-gray-500 font-light text-lg">
                    Has completado con éxito el primer bloque de tu entrenamiento en inglés de élite.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black text-gray-600 uppercase mb-2">XP Ganada</p>
                    <p className="text-2xl font-black text-cyan-400">+500</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black text-gray-600 uppercase mb-2">Fluidez</p>
                    <p className="text-2xl font-black text-purple-400">100%</p>
                  </div>
                </div>

                <Link 
                  href="/academy"
                  className="block w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-cyan-400 transition-all"
                >
                  VOLVER A LA ACADEMIA
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
      
      <GlobalTicker />
    </main>
  );
}
