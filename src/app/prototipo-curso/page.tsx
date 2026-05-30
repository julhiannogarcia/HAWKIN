'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from '@/components/course/AIAvatar';
import VoiceRecorder from '@/components/course/VoiceRecorder';
import { COURSE_CURRICULUM, Day, Module, Lesson, LessonStep, AgeGroup, LessonLevel } from '@/lib/courseData';
import GlobalTicker from '@/components/Ticker';
import { 
  ChevronRight, ArrowLeft, CircleCheckBig, CircleAlert, 
  BookOpen, Trophy, Mic, Star, Calendar, User, Laptop, Rocket,
  Clock, Brain, MessageSquare, Headphones, PenTool, Flame
} from 'lucide-react';
import Link from 'next/link';

export default function CoursePrototypePage() {
  const [view, setView] = useState<'onboarding' | 'map' | 'modules' | 'lesson'>('onboarding');
  const [userProfile, setUserProfile] = useState<{ age: AgeGroup; level: LessonLevel }>({ age: 'Professional', level: 'Básico' });
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [voiceAccuracy, setVoiceAccuracy] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  // Cargar progreso del socio
  useEffect(() => {
    const saved = localStorage.getItem('hawkin_deep_english_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setUserProfile(data.profile);
      setStreak(data.streak || 0);
      setXp(data.xp || 0);
    }
  }, []);

  const saveProgress = useCallback((moduleFinished: boolean) => {
    const data = { profile: userProfile, streak, xp: xp + (moduleFinished ? 100 : 0) };
    localStorage.setItem('hawkin_deep_english_progress', JSON.stringify(data));
    setXp(data.xp);
  }, [userProfile, streak, xp]);

  const currentStep = currentLesson?.steps[currentStepIndex];

  useEffect(() => {
    if (view === 'lesson' && currentStep) {
      setIsSpeaking(true);
      setSelectedOption(null);
      setShowFeedback(null);
      setVoiceAccuracy(null);
      setWritingInput('');
    }
  }, [currentStepIndex, view, currentStep]);

  const handleDaySelect = (day: Day) => {
    setSelectedDay(day);
    setView('modules');
  };

  const handleModuleSelect = (mod: Module) => {
    setSelectedModule(mod);
    setCurrentLesson(mod.lessons[0]);
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setView('lesson');
  };

  const handleNext = () => {
    if (!currentLesson) return;
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      saveProgress(true);
    }
  };

  const handleWritingCheck = () => {
    if (!currentStep?.uiContent?.targetPhrase) return;
    const cleanInput = writingInput.toLowerCase().trim();
    const cleanTarget = currentStep.uiContent.targetPhrase.toLowerCase().trim();
    
    if (cleanInput === cleanTarget) {
      setShowFeedback('correct');
    } else {
      setShowFeedback('wrong');
    }
  };

  if (view === 'onboarding') {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-black to-purple-950/20" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full glass-card p-12 text-center space-y-12 border-white/5 relative z-10">
           <div className="w-24 h-24 bg-white text-black rounded-[40px] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              <Rocket size={40} />
           </div>
           <div className="space-y-4">
              <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">HAWKIN <br /><span className="text-cyan-400">Deep Learning.</span></h1>
              <p className="text-gray-500 text-sm uppercase tracking-[0.4em] font-bold">Inmersión de Alta Densidad</p>
           </div>
           
           <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Configura tu Avatar de Aprendizaje</p>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setUserProfile({...userProfile, age: 'Junior'})} className={`p-8 rounded-[35px] border flex flex-col items-center gap-4 transition-all ${userProfile.age === 'Junior' ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/5 bg-white/[0.02] opacity-40 hover:opacity-100'}`}>
                       <Star className={userProfile.age === 'Junior' ? 'text-cyan-400' : 'text-gray-600'} size={32} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Junior</span>
                    </button>
                    <button onClick={() => setUserProfile({...userProfile, age: 'Professional'})} className={`p-8 rounded-[35px] border flex flex-col items-center gap-4 transition-all ${userProfile.age === 'Professional' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/[0.02] opacity-40 hover:opacity-100'}`}>
                       <Laptop className={userProfile.age === 'Professional' ? 'text-purple-500' : 'text-gray-600'} size={32} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Pro Elite</span>
                    </button>
                 </div>
              </div>
           </div>

           <button onClick={() => setView('map')} className="w-full py-8 bg-white text-black rounded-[30px] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-cyan-400 hover:scale-105 transition-all shadow-2xl">
              Iniciar Inmersión Total
           </button>
        </motion.div>
      </main>
    );
  }

  if (view === 'map') {
    return (
      <main className="min-h-screen bg-black text-white p-8 lg:p-20">
        <div className="max-w-6xl mx-auto space-y-16">
          <header className="flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="text-center md:text-left">
                <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                   <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                      <Flame className="text-orange-500" size={14} />
                      <span className="text-[10px] font-black text-orange-500 uppercase">{streak} DÍAS</span>
                   </div>
                   <div className="bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{xp} XP</span>
                   </div>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">The 30-Day <br /><span className="text-gray-600">Blueprint.</span></h1>
             </div>
             <button onClick={() => setView('onboarding')} className="p-6 rounded-[30px] border border-white/5 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="text-right">
                   <p className="text-[9px] font-black text-gray-500 uppercase">Perfil Activo</p>
                   <p className="text-xs font-bold text-white">{userProfile.age === 'Junior' ? 'Junior Visionary' : 'Professional Elite'}</p>
                </div>
                <User className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
             </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {COURSE_CURRICULUM.map((day) => (
                <button 
                  key={day.dayNumber}
                  onClick={() => handleDaySelect(day)}
                  className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 hover:border-cyan-400/40 hover:bg-white/[0.04] transition-all text-left space-y-6 group relative overflow-hidden"
                >
                   <div className="flex justify-between items-center relative z-10">
                      <span className="text-5xl font-black text-white/5 group-hover:text-cyan-400/20 italic">0{day.dayNumber}</span>
                      <ChevronRight className="text-gray-700 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all" />
                   </div>
                   <div className="space-y-2 relative z-10">
                      <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Capítulo {day.dayNumber}</p>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-tight">{day.title}</h3>
                   </div>
                   <div className="pt-6 flex gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center"><Brain size={14} /></div>
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center"><Headphones size={14} /></div>
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center"><PenTool size={14} /></div>
                   </div>
                </button>
             ))}
             {[...Array(29)].map((_, i) => (
                <div key={i} className="h-64 rounded-[50px] border border-dashed border-white/5 bg-transparent flex items-center justify-center opacity-20">
                   <span className="text-xl font-black text-gray-800 italic uppercase">Día {i + 2} Locked</span>
                </div>
             ))}
          </div>
        </div>
        <GlobalTicker />
      </main>
    );
  }

  if (view === 'modules') {
    return (
      <main className="min-h-screen bg-black text-white p-8 lg:p-20">
        <div className="max-w-5xl mx-auto space-y-12">
           <button onClick={() => setView('map')} className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
              <ArrowLeft size={16} /> Volver al Mapa Global
           </button>
           
           <header className="space-y-4">
              <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Inmersión Día {selectedDay?.dayNumber}: <br /><span className="text-cyan-400">{selectedDay?.title}</span></h1>
              <p className="text-gray-500 text-sm max-w-2xl font-light">Este ecosistema contiene 5 módulos de alto rendimiento. Puedes completarlos todos (5 horas) o avanzar a tu ritmo.</p>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedDay?.modules.map((mod) => (
                <button 
                  key={mod.id}
                  onClick={() => handleModuleSelect(mod)}
                  className="p-10 rounded-[40px] glass-card border-white/5 hover:border-cyan-400/40 text-left transition-all group flex gap-8 items-center"
                >
                   <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-4xl group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-xl">
                      {mod.icon}
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                         <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em]">{mod.type}</span>
                         <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={12} />
                            <span className="text-[9px] font-bold uppercase">{mod.estimatedTime}</span>
                         </div>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-tighter leading-tight group-hover:text-white transition-colors">{mod.title}</h3>
                   </div>
                </button>
              ))}
           </div>
        </div>
        <GlobalTicker />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('modules')} className="p-3 hover:bg-white/5 rounded-2xl transition-colors border border-white/5">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{selectedModule?.type} • Nivel {userProfile.level}</p>
            <h1 className="text-sm font-black uppercase tracking-tighter">{selectedModule?.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:block text-right">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Intensidad HAWKIN</p>
              <div className="h-1 w-32 bg-white/10 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-cyan-400" style={{ width: `${((currentStepIndex + 1) / (currentLesson?.steps.length || 1)) * 100}%` }} />
              </div>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-[10px] shadow-lg">
             {currentLesson && Math.round(((currentStepIndex + 1) / currentLesson.steps.length) * 100)}%
           </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <section className="bg-[#050505] border-r border-white/5 flex items-center justify-center p-8 lg:p-20 relative overflow-hidden">
           {/* Visuales dinámicos de fondo */}
           <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 blur-[150px] rounded-full animate-pulse" />
           </div>

           <div className="relative z-10 w-full max-w-md text-center">
              {currentStep && (
                <AIAvatar 
                  text={currentStep.avatarText} 
                  lang={currentStep.avatarLang} 
                  isSpeaking={isSpeaking}
                  onEnd={() => setIsSpeaking(false)}
                />
              )}
              <motion.div key={currentStepIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 p-8 bg-black/40 border border-white/10 rounded-[35px] backdrop-blur-xl">
                 <p className="text-gray-300 text-sm font-light italic leading-relaxed">
                   "{currentStep?.avatarText}"
                 </p>
              </motion.div>
           </div>
        </section>

        <section className="p-12 lg:p-24 flex flex-col justify-center max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!isCompleted && currentStep ? (
              <motion.div key={currentStep.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee]" />
                     <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{currentStep.uiContent?.title}</h2>
                  </div>
                  <p className="text-gray-500 text-lg font-light leading-relaxed">{currentStep.uiContent?.description}</p>
                </div>

                <div className="pt-4 overflow-y-auto max-h-[50vh] pr-4 scrollbar-hide">
                  {currentStep.uiContent?.longText && (
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[35px] mb-8">
                       <pre className="whitespace-pre-wrap font-sans text-gray-400 leading-relaxed text-sm">
                          {currentStep.uiContent.longText}
                       </pre>
                    </div>
                  )}

                  {currentStep.type === 'speaking' && (
                    <VoiceRecorder 
                      targetPhrase={currentStep.uiContent?.targetPhrase || ''}
                      onResult={(acc) => { setVoiceAccuracy(acc); setShowFeedback(acc > 70 ? 'correct' : 'wrong'); }}
                    />
                  )}

                  {currentStep.type === 'writing' && (
                    <div className="space-y-6">
                       <input 
                        type="text"
                        value={writingInput}
                        onChange={(e) => setWritingInput(e.target.value)}
                        placeholder={currentStep.uiContent?.placeholder || 'Escribe aquí...'}
                        className="w-full bg-white/5 border border-white/10 rounded-[30px] p-10 text-2xl font-black outline-none focus:border-cyan-400 transition-all text-center placeholder:text-gray-800"
                       />
                       <button onClick={handleWritingCheck} className="w-full py-6 bg-white/5 border border-white/10 rounded-[25px] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
                          Verificar Escritura
                       </button>
                    </div>
                  )}

                  {currentStep.type === 'quiz' && (
                    <div className="grid grid-cols-1 gap-4">
                      {currentStep.uiContent?.options?.map((opt, i) => (
                        <button key={i} onClick={() => { setSelectedOption(i); setShowFeedback(i === currentStep.uiContent?.correctOption ? 'correct' : 'wrong'); }} className={`p-8 rounded-[30px] border text-left transition-all flex justify-between items-center group ${selectedOption === i ? (i === currentStep.uiContent?.correctOption ? 'bg-cyan-500/10 border-cyan-400' : 'bg-red-500/10 border-red-500') : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                           <span className={`font-bold text-base ${selectedOption === i ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>{opt}</span>
                           {selectedOption === i && (i === currentStep.uiContent?.correctOption ? <CircleCheckBig className="text-cyan-400" /> : <CircleAlert className="text-red-500" />)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-8">
                   <AnimatePresence>
                     {showFeedback === 'wrong' && (
                       <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-6 text-center">
                          ¡Analiza de nuevo, socio! Revisa la estructura anterior.
                       </motion.p>
                     )}
                   </AnimatePresence>
                   
                   <button 
                    disabled={['quiz', 'speaking', 'writing'].includes(currentStep.type) && showFeedback !== 'correct'} 
                    onClick={handleNext} 
                    className={`w-full py-8 rounded-[35px] font-black uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4 transition-all shadow-2xl ${showFeedback === 'correct' || !['quiz', 'speaking', 'writing'].includes(currentStep.type) ? 'bg-white text-black hover:bg-cyan-400' : 'bg-white/5 text-gray-800 border border-white/5 cursor-not-allowed'}`}
                   >
                      Siguiente Etapa <ChevronRight size={20} />
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
                 <div className="relative inline-block">
                    <div className="absolute -inset-8 bg-cyan-400 blur-3xl opacity-20 animate-pulse" />
                    <div className="w-32 h-32 bg-cyan-500 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-[0_0_60px_rgba(34,211,238,0.5)]">
                       <Trophy className="text-black" size={56} />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Módulo <br />Dominado.</h2>
                    <p className="text-gray-500 font-light text-xl">Tu red neuronal de inglés ha sido actualizada con éxito.</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px]">
                       <p className="text-[10px] font-black text-gray-600 uppercase mb-2">Recompensa</p>
                       <p className="text-3xl font-black text-cyan-400">+100 XP</p>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px]">
                       <p className="text-[10px] font-black text-gray-600 uppercase mb-2">Insignia</p>
                       <div className="flex justify-center text-purple-500"><Star size={32} fill="currentColor" /></div>
                    </div>
                 </div>
                 <button onClick={() => setView('modules')} className="w-full py-8 bg-white text-black rounded-[35px] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-cyan-400 transition-all shadow-2xl">
                    Volver al Centro de Mando
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
