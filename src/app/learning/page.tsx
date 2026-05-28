'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from '@/components/course/AIAvatar';
import VoiceRecorder from '@/components/course/VoiceRecorder';
import { COURSE_CURRICULUM, Day, Module, Lesson, LessonStep } from '@/lib/courseData';
import { 
  ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, 
  Brain, MessageSquare, Headphones, PenTool, Flame, 
  Play, BookOpen, Layers, BarChart, Settings, LogOut,
  Target, Zap, Star
} from 'lucide-react';

export default function LearningPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeDay, setActiveDay] = useState<Day>(COURSE_CURRICULUM[0]);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [xp, setXp] = useState(1250); // Simulación de progreso real

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeModule && currentStep) {
      setIsSpeaking(true);
      setShowFeedback(null);
      setWritingInput('');
    }
  }, [currentStepIndex, activeModule]);

  if (!isMounted) return null;

  const currentLesson = activeModule?.lessons[0];
  const currentStep = currentLesson?.steps[currentStepIndex];

  const handleModuleSelect = (mod: Module) => {
    setActiveModule(mod);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (!currentLesson) return;
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setActiveModule(null);
      setXp(prev => prev + 100);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* SIDEBAR DE NAVEGACIÓN PROFESIONAL */}
      <aside className="w-80 border-r border-white/5 bg-[#050505] flex flex-col">
        <div className="p-6 space-y-8 flex-1 overflow-y-auto scrollbar-hide">
           <div>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Tu Hoja de Ruta</p>
              <div className="space-y-2">
                 {COURSE_CURRICULUM.map((day) => (
                    <button 
                      key={day.dayNumber}
                      onClick={() => { setActiveDay(day); setActiveModule(null); }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${activeDay.dayNumber === day.dayNumber ? 'bg-white/5 border border-white/10' : 'hover:bg-white/[0.02] border border-transparent opacity-60 hover:opacity-100'}`}
                    >
                       <div className="flex items-center gap-3">
                          <span className={`text-xs font-black ${activeDay.dayNumber === day.dayNumber ? 'text-cyan-400' : 'text-gray-500'}`}>D{day.dayNumber}</span>
                          <span className="text-xs font-bold uppercase truncate max-w-[120px]">{day.title}</span>
                       </div>
                       {day.dayNumber < 2 && <CheckCircle2 size={14} className="text-green-500" />}
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Habilidades</p>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase">
                 <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                    <Brain size={12} className="text-purple-500" /> Gramática
                 </div>
                 <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                    <MessageSquare size={12} className="text-cyan-500" /> Diálogo
                 </div>
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <Flame size={14} className="text-orange-500" />
                 <span className="text-xs font-black">7 DÍAS</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                 <Star size={14} />
                 <span className="text-xs font-black">{xp} XP</span>
              </div>
           </div>
           <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
              <Settings size={14} /> Configuración
           </button>
        </div>
      </aside>

      {/* CONTENIDO CENTRAL */}
      <main className="flex-1 bg-black relative flex flex-col">
        {!activeModule ? (
          /* VISTA DEL DÍA (DASHBOARD) */
          <div className="p-12 lg:p-24 overflow-y-auto flex-1">
             <header className="mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                   <Target size={12} className="text-cyan-400" />
                   <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest text-white">Objetivo del Día</span>
                </div>
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                  {activeDay.title}
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl font-light">
                   Inmersión profunda en {activeDay.title}. Completa los 5 módulos para alcanzar la maestría diaria (5 horas de contenido de élite).
                </p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDay.modules.map((mod) => (
                   <button 
                    key={mod.id}
                    onClick={() => handleModuleSelect(mod)}
                    className="group relative p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-cyan-400/40 transition-all text-left flex flex-col justify-between h-80"
                   >
                      <div className="flex justify-between items-start">
                         <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl group-hover:bg-cyan-500 group-hover:text-black transition-all">
                            {mod.icon}
                         </div>
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <Zap size={10} className="text-yellow-500" />
                            <span className="text-[8px] font-black uppercase">PRO</span>
                         </div>
                      </div>
                      
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">{mod.type}</span>
                            <div className="w-1 h-1 bg-gray-700 rounded-full" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase">{mod.estimatedTime}</span>
                         </div>
                         <h3 className="text-2xl font-bold uppercase tracking-tighter leading-tight group-hover:text-white transition-colors">
                           {mod.title}
                         </h3>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase group-hover:text-cyan-400 transition-colors">
                         Iniciar Inmersión <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                   </button>
                ))}
             </div>
          </div>
        ) : (
          /* CONSOLA DE ESTUDIO ACTIVA */
          <div className="flex-1 flex flex-col">
             {/* BARRA DE PROGRESO DE LECCIÓN */}
             <div className="h-1 bg-white/5 w-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStepIndex + 1) / (currentLesson?.steps.length || 1)) * 100}%` }}
                  className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                />
             </div>

             <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                <section className="bg-[#050505] border-r border-white/5 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)]" />
                   
                   <AIAvatar 
                      text={currentStep?.avatarText || ''} 
                      lang={currentStep?.avatarLang || 'es'} 
                      isActive={isSpeaking}
                      onEnd={() => setIsSpeaking(false)}
                   />

                   <motion.div 
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 w-full max-w-md p-8 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center"
                   >
                      <p className="text-gray-400 text-sm font-light italic leading-relaxed">
                        "{currentStep?.avatarText}"
                      </p>
                      <div className="mt-6 flex items-center justify-center gap-2">
                         <button onClick={() => setIsSpeaking(true)} className="p-3 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-full transition-all">
                            <Play size={16} />
                         </button>
                         <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Escuchar de nuevo</span>
                      </div>
                   </motion.div>
                </section>

                <section className="p-12 lg:p-24 flex flex-col justify-center max-w-2xl mx-auto w-full">
                   <AnimatePresence mode="wait">
                      {!showFeedback || showFeedback === 'wrong' ? (
                        <motion.div key="step-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                           <div className="space-y-4 text-center sm:text-left">
                              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{currentStep?.uiContent?.title}</h2>
                              <p className="text-gray-500 text-lg font-light leading-relaxed">{currentStep?.uiContent?.description}</p>
                           </div>

                           <div className="space-y-8">
                              {currentStep?.uiContent?.longText && (
                                <div className="p-8 bg-white/5 border border-white/5 rounded-[35px] text-sm text-gray-400 font-sans leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto scrollbar-hide border-l-cyan-500/50 border-l-2 shadow-2xl">
                                   {currentStep.uiContent.longText}
                                </div>
                              )}

                              {currentStep?.type === 'writing' && (
                                <div className="space-y-4">
                                   <input 
                                    type="text"
                                    autoFocus
                                    value={writingInput}
                                    onChange={(e) => setWritingInput(e.target.value)}
                                    placeholder={currentStep.uiContent?.placeholder || 'Tu respuesta aquí...'}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[35px] p-10 text-2xl font-black outline-none focus:border-cyan-400 transition-all text-center shadow-inner"
                                   />
                                   <button 
                                    onClick={() => setShowFeedback(writingInput.toLowerCase().trim() === currentStep.uiContent?.targetPhrase?.toLowerCase().trim() ? 'correct' : 'wrong')}
                                    className="w-full py-6 bg-cyan-500 hover:bg-cyan-400 text-black rounded-[25px] font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_40px_rgba(34,211,238,0.2)] transition-all"
                                   >
                                      Validar Respuesta
                                   </button>
                                </div>
                              )}

                              {currentStep?.type === 'quiz' && (
                                <div className="grid grid-cols-1 gap-4">
                                   {currentStep.uiContent?.options?.map((opt, i) => (
                                      <button 
                                        key={i} 
                                        onClick={() => setShowFeedback(i === currentStep.uiContent?.correctOption ? 'correct' : 'wrong')}
                                        className="p-8 rounded-[35px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-center font-bold text-gray-400 hover:text-white"
                                      >
                                         {opt}
                                      </button>
                                   ))}
                                </div>
                              )}

                              {currentStep?.type !== 'writing' && currentStep?.type !== 'quiz' && (
                                <button onClick={handleNext} className="w-full py-8 bg-white text-black rounded-[35px] font-black uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4 hover:bg-cyan-400 transition-all shadow-2xl">
                                   Siguiente Etapa <ChevronRight size={20} />
                                </button>
                              )}
                           </div>
                           
                           {showFeedback === 'wrong' && (
                             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 text-red-500 font-black text-[9px] uppercase tracking-widest">
                                <AlertCircle size={14} /> La estructura no es correcta. Inténtalo de nuevo.
                             </motion.div>
                           )}
                        </motion.div>
                      ) : (
                        /* VISTA DE ÉXITO (Paso completado) */
                        <motion.div key="success-content" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-12">
                           <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                              <CheckCircle2 className="text-white" size={60} />
                           </div>
                           <div className="space-y-4">
                              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-white">¡Etapa Superada!</h2>
                              <p className="text-gray-500 text-xl font-light">Excelente precisión. Tu red neuronal se está fortaleciendo.</p>
                           </div>
                           <button onClick={handleNext} className="w-full py-8 bg-white text-black rounded-[35px] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-cyan-400 transition-all shadow-2xl">
                              Continuar al siguiente paso
                           </button>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </section>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
