'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAvatar from '@/components/course/AIAvatar';
import VoiceRecorder from '@/components/course/VoiceRecorder';
import { COURSE_CURRICULUM, Lesson, LessonStep, AgeGroup, LessonLevel } from '@/lib/courseData';
import GlobalTicker from '@/components/Ticker';
import { 
  ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, 
  BookOpen, Trophy, Mic, Star, Calendar, User, Laptop, Rocket 
} from 'lucide-react';
import Link from 'next/link';

export default function CoursePrototypePage() {
  const [view, setView] = useState<'onboarding' | 'map' | 'lesson'>('onboarding');
  const [userProfile, setUserProfile] = useState<{ age: AgeGroup; level: LessonLevel }>({ age: 'Professional', level: 'Básico' });
  const [currentDay, setCurrentDay] = useState(1);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [voiceAccuracy, setVoiceAccuracy] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  // Cargar progreso del socio (Persistencia Local por ahora)
  useEffect(() => {
    const saved = localStorage.getItem('hawkin_english_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setUserProfile(data.profile);
      setStreak(data.streak || 0);
      setCurrentDay(data.currentDay || 1);
    }
  }, []);

  const saveProgress = useCallback((day: number, isFinished: boolean) => {
    const data = { profile: userProfile, currentDay: isFinished ? day + 1 : day, streak: streak + (isFinished ? 1 : 0) };
    localStorage.setItem('hawkin_english_progress', JSON.stringify(data));
    setStreak(data.streak);
    if (isFinished) setCurrentDay(data.currentDay);
  }, [userProfile, streak]);

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

  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
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
      saveProgress(currentDay, true);
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
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full glass-card p-12 text-center space-y-10 border-cyan-500/20">
           <div className="w-20 h-20 bg-cyan-500 rounded-[30px] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,211,238,0.3)]">
              <Rocket className="text-black" size={32} />
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter">Bienvenido a la Inmersión 30 Días</h1>
           <div className="space-y-6">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">¿Quién aprenderá hoy?</p>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setUserProfile({...userProfile, age: 'Junior'})} className={`p-6 rounded-3xl border transition-all ${userProfile.age === 'Junior' ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/5 text-gray-500 hover:border-white/20'}`}>
                    <Star size={24} className="mx-auto mb-2" />
                    <span className="text-[10px] font-black uppercase">Junior (Niños/Jóvenes)</span>
                 </button>
                 <button onClick={() => setUserProfile({...userProfile, age: 'Professional'})} className={`p-6 rounded-3xl border transition-all ${userProfile.age === 'Professional' ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/5 text-gray-500 hover:border-white/20'}`}>
                    <Laptop size={24} className="mx-auto mb-2" />
                    <span className="text-[10px] font-black uppercase">Professional (Adultos)</span>
                 </button>
              </div>
           </div>
           <button onClick={() => setView('map')} className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-cyan-400 transition-all">
              Sincronizar Mi Perfil
           </button>
        </motion.div>
      </main>
    );
  }

  if (view === 'map') {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto space-y-16 py-12">
          <header className="flex justify-between items-end">
             <div>
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4">Racha de Élite: {streak} días</p>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">Mapa de <span className="text-gray-500">Inmersión.</span></h1>
             </div>
             <button onClick={() => setView('onboarding')} className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-all flex items-center gap-2">
                <User size={14} /> Cambiar Perfil
             </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {COURSE_CURRICULUM.map((day) => {
                const lesson = day.lessons.find(l => l.ageGroup === userProfile.age && l.level === userProfile.level) || day.lessons[0];
                const isLocked = day.dayNumber > currentDay;
                
                return (
                  <button 
                    key={day.dayNumber}
                    disabled={isLocked}
                    onClick={() => handleStartLesson(lesson)}
                    className={`p-8 rounded-[40px] border flex flex-col justify-between h-64 transition-all text-left relative overflow-hidden group ${
                      isLocked ? 'border-white/5 opacity-40 bg-white/[0.01] cursor-not-allowed' : 'border-white/10 hover:border-cyan-400 bg-white/[0.03] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                       <span className="text-3xl font-black text-white/10 group-hover:text-cyan-400/20">{day.dayNumber}</span>
                       {day.dayNumber < currentDay && <CheckCircle2 className="text-green-500" size={18} />}
                    </div>
                    <div className="space-y-2 relative z-10">
                       <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{day.title}</p>
                       <h3 className="text-sm font-bold uppercase italic">{lesson.title}</h3>
                    </div>
                    {isLocked && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]"><Star className="text-gray-700" size={24} /></div>}
                  </button>
                );
             })}
             {[...Array(28)].map((_, i) => (
                <div key={i} className="h-64 rounded-[40px] border border-white/5 bg-white/[0.01] flex items-center justify-center text-white/5 font-black text-3xl italic">
                   {i + 3}
                </div>
             ))}
          </div>
        </div>
        <GlobalTicker />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER DE LECCIÓN */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('map')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Día {currentDay} • {userProfile.age} Visionary</p>
            <h1 className="text-sm font-bold uppercase tracking-tighter">{currentLesson?.title}</h1>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black">
          {currentLesson && Math.round(((currentStepIndex + 1) / currentLesson.steps.length) * 100)}%
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <section className="bg-[#050505] border-r border-white/5 flex items-center justify-center p-8 relative overflow-hidden">
           {currentStep && (
             <AIAvatar 
              text={currentStep.avatarText} 
              lang={currentStep.avatarLang} 
              isSpeaking={isSpeaking}
              onEnd={() => setIsSpeaking(false)}
             />
           )}
           <div className="absolute bottom-12 inset-x-12 text-center italic text-gray-500 font-light text-sm px-10">
              "{currentStep?.avatarText}"
           </div>
        </section>

        <section className="p-12 flex flex-col justify-center max-w-xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {!isCompleted && currentStep ? (
              <motion.div key={currentStep.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">{currentStep.uiContent?.title}</h2>
                  <p className="text-gray-500 font-light">{currentStep.uiContent?.description}</p>
                </div>

                <div className="pt-8">
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
                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-xl font-bold outline-none focus:border-cyan-400 transition-all text-center"
                       />
                       <button onClick={handleWritingCheck} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                          Verificar Escritura
                       </button>
                    </div>
                  )}

                  {currentStep.type === 'quiz' && (
                    <div className="grid grid-cols-1 gap-4">
                      {currentStep.uiContent?.options?.map((opt, i) => (
                        <button key={i} onClick={() => { setSelectedOption(i); setShowFeedback(i === currentStep.uiContent?.correctOption ? 'correct' : 'wrong'); }} className={`p-6 rounded-[25px] border text-left transition-all ${selectedOption === i ? (i === currentStep.uiContent?.correctOption ? 'bg-cyan-500/10 border-cyan-400' : 'bg-red-500/10 border-red-500') : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                           <span className="font-bold text-sm">{opt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-12">
                   {showFeedback === 'wrong' && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mb-6 text-center animate-bounce">¡Inténtalo de nuevo!</p>}
                   <button 
                    disabled={['quiz', 'speaking', 'writing'].includes(currentStep.type) && showFeedback !== 'correct'} 
                    onClick={handleNext} 
                    className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-cyan-400 transition-all disabled:opacity-20"
                   >
                      CONTINUAR <ChevronRight size={18} />
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12">
                 <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,211,238,0.4)]"><Trophy className="text-black" size={40} /></div>
                 <h2 className="text-4xl font-black uppercase italic tracking-tighter">¡Día {currentDay} Completado!</h2>
                 <p className="text-gray-500 font-light text-lg">Has fortalecido tu red neuronal de inglés. La constancia es el camino del líder.</p>
                 <button onClick={() => setView('map')} className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-cyan-400 transition-all">
                    VOLVER AL MAPA DE 30 DÍAS
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
