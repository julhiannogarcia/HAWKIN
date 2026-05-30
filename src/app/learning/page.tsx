'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from '@/components/course/AIAvatar';
import VoiceRecorder from '@/components/course/VoiceRecorder';
import { COURSE_CURRICULUM, Day, Module, Lesson, LessonStep } from '@/lib/courseData';
import { useSession } from 'next-auth/react';
import { 
  ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, 
  Brain, MessageSquare, Flame, 
  Play, BookOpen, Zap, Star, Settings, Loader2
} from 'lucide-react';

export default function LearningPage() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [activeDay, setActiveDay] = useState<Day>(COURSE_CURRICULUM[0]);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // ESTADO REAL DE PROGRESO
  const [xp, setXp] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loadingProgress, setLoadingStats] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // 1. Sincronizar progreso real con la Base de Datos
    const fetchProgress = async () => {
      if (!session) {
        setLoadingStats(false);
        return;
      }
      try {
        const res = await fetch('/api/user/progress');
        const data = await res.json();
        if (data.xp !== undefined) {
          setXp(data.xp);
          setCompletedLessons(data.completedLessons || []);
        }
      } catch (e) {
        console.error("Error fetching progress", e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchProgress();
  }, [session]);

  useEffect(() => {
    if (activeModule && currentLesson) {
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

  const handleNext = async () => {
    if (!currentLesson) return;
    
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // 2. GUARDAR PROGRESO REAL AL TERMINAR LECCIÓN
      const earned = 100;
      setXp(prev => prev + earned);
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons(prev => [...prev, currentLesson.id]);
      }

      if (session) {
        try {
          await fetch('/api/user/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lessonId: currentLesson.id,
              courseId: 'english-pro',
              xpEarned: earned
            })
          });
        } catch (e) {
          console.error("Error saving progress to DB", e);
        }
      }

      setActiveModule(null);
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
                 {COURSE_CURRICULUM.map((day) => {
                    const allDayModulesCompleted = day.modules.every(m => 
                      m.lessons.every(l => completedLessons.includes(l.id))
                    );
                    
                    return (
                      <button 
                        key={day.dayNumber}
                        onClick={() => { setActiveDay(day); setActiveModule(null); }}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${activeDay.dayNumber === day.dayNumber ? 'bg-white/5 border border-white/10' : 'hover:bg-white/[0.02] border border-transparent opacity-60 hover:opacity-100'}`}
                      >
                         <div className="flex items-center gap-3">
                            <span className={`text-xs font-black ${activeDay.dayNumber === day.dayNumber ? 'text-cyan-400' : 'text-gray-500'}`}>D{day.dayNumber}</span>
                            <span className="text-xs font-bold uppercase truncate max-w-[120px]">{day.title}</span>
                         </div>
                         {allDayModulesCompleted && <CheckCircle2 size={14} className="text-green-500" />}
                      </button>
                    );
                 })}
              </div>
           </div>
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <Flame size={14} className="text-orange-500" />
                 <span className="text-xs font-black">RACHA: 0 DÍAS</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono">
                 {loadingProgress ? <Loader2 size={12} className="animate-spin" /> : <Star size={14} fill="currentColor" />}
                 <span className="text-xs font-black">{xp} XP</span>
              </div>
           </div>
           {!session && (
             <p className="text-[8px] text-red-400 text-center font-bold uppercase animate-pulse">Inicia sesión para no perder tus puntos</p>
           )}
           <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
              <Settings size={14} /> Perfil Socio
           </button>
        </div>
      </aside>

      {/* CONTENIDO CENTRAL */}
      <main className="flex-1 bg-black relative flex flex-col">
        {!activeModule ? (
          <div className="p-12 lg:p-24 overflow-y-auto flex-1">
             <header className="mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                   <Target size={12} className="text-cyan-400" />
                   <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Enfoque Diario</span>
                </div>
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                  {activeDay.title}
                </h1>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDay.modules.map((mod) => {
                   const isCompleted = mod.lessons.every(l => completedLessons.includes(l.id));
                   
                   return (
                      <button 
                        key={mod.id}
                        onClick={() => handleModuleSelect(mod)}
                        className={`group relative p-8 rounded-[40px] border-2 text-left flex flex-col justify-between h-80 transition-all ${isCompleted ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.02] border-white/5 hover:border-cyan-400/40'}`}
                      >
                         <div className="flex justify-between items-start">
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl transition-all ${isCompleted ? 'bg-green-500 text-black' : 'bg-white/5 group-hover:bg-cyan-500 group-hover:text-black'}`}>
                               {isCompleted ? <CheckCircle2 size={32} /> : mod.icon}
                            </div>
                            {isCompleted && <span className="text-[8px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-full">Completado</span>}
                         </div>
                         
                         <div className="space-y-2">
                            <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">{mod.type}</p>
                            <h3 className="text-2xl font-bold uppercase tracking-tighter leading-tight">{mod.title}</h3>
                         </div>

                         <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase group-hover:text-cyan-400 transition-colors">
                            {isCompleted ? 'Repasar Módulo' : 'Iniciar Inmersión'} <ChevronRight size={14} />
                         </div>
                      </button>
                   );
                })}
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
             <div className="h-1 bg-white/5 w-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStepIndex + 1) / (currentLesson?.steps.length || 1)) * 100}%` }}
                  className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                />
             </div>

             <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                <section className="bg-[#050505] border-r border-white/5 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                   <AIAvatar 
                      text={currentStep?.avatarText || ''} 
                      lang={currentStep?.avatarLang || 'es'} 
                      isActive={isSpeaking}
                      onEnd={() => setIsSpeaking(false)}
                   />
                   <div className="mt-16 w-full max-w-md p-8 rounded-[40px] bg-white/[0.02] border border-white/10 text-center">
                      <p className="text-gray-400 text-sm font-light italic">"{currentStep?.avatarText}"</p>
                      <button onClick={() => setIsSpeaking(true)} className="mt-6 p-4 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-full transition-all">
                         <Play size={20} />
                      </button>
                   </div>
                </section>

                <section className="p-12 lg:p-24 flex flex-col justify-center max-w-2xl mx-auto w-full">
                   <AnimatePresence mode="wait">
                      {!showFeedback || showFeedback === 'wrong' ? (
                        <motion.div key="step-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                           <div className="text-center sm:text-left space-y-4">
                              <h2 className="text-4xl font-black uppercase italic tracking-tighter">{currentStep?.uiContent?.title}</h2>
                              <p className="text-gray-500 text-lg font-light">{currentStep?.uiContent?.description}</p>
                           </div>

                           <div className="space-y-8">
                              {currentStep?.type === 'writing' && (
                                <div className="space-y-4">
                                   <input 
                                    type="text"
                                    value={writingInput}
                                    onChange={(e) => setWritingInput(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[35px] p-10 text-2xl font-black text-center"
                                   />
                                   <button 
                                    onClick={() => setShowFeedback(writingInput.toLowerCase().trim() === currentStep.uiContent?.targetPhrase?.toLowerCase().trim() ? 'correct' : 'wrong')}
                                    className="w-full py-6 bg-cyan-500 text-black rounded-[25px] font-black uppercase tracking-[0.4em] text-[11px]"
                                   >Validar Respuesta</button>
                                </div>
                              )}

                              {currentStep?.type === 'quiz' && (
                                <div className="grid grid-cols-1 gap-4">
                                   {currentStep.uiContent?.options?.map((opt, i) => (
                                      <button 
                                        key={i} 
                                        onClick={() => setShowFeedback(i === currentStep.uiContent?.correctOption ? 'correct' : 'wrong')}
                                        className="p-8 rounded-[35px] border border-white/5 bg-white/[0.02] hover:bg-cyan-500/10 font-bold"
                                      >{opt}</button>
                                   ))}
                                </div>
                              )}

                              {currentStep?.type !== 'writing' && currentStep?.type !== 'quiz' && (
                                <button onClick={handleNext} className="w-full py-8 bg-white text-black rounded-[35px] font-black uppercase tracking-[0.4em] text-[12px]">Continuar <ChevronRight size={20} className="inline ml-2" /></button>
                              )}
                           </div>
                        </motion.div>
                      ) : (
                        <motion.div key="success-content" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-12">
                           <CheckCircle2 className="text-green-500 mx-auto" size={100} />
                           <h2 className="text-5xl font-black uppercase italic italic">¡Excelente Precisión!</h2>
                           <button onClick={handleNext} className="w-full py-8 bg-white text-black rounded-[35px] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-cyan-400">Continuar</button>
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
