'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, Play, BookOpen, Star, 
  ChevronRight, LoaderCircle, Sparkles, GraduationCap, 
  Terminal, Activity, Globe, Zap 
} from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function LearningPage() {
  const { user, loading: authLoading } = useAlpha();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (e) {
        console.error("Courses Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <LoaderCircle className="animate-spin text-cyan-500" size={40} />
        <p className="text-cyan-500 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Iniciando Academia HAWKIN...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 space-y-24">
        
        {/* HERO ACADEMIA */}
        <section className="text-center space-y-8 relative overflow-hidden py-20 rounded-[80px] bg-white/[0.01] border border-white/5 shadow-2xl">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><GraduationCap size={300} /></div>
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
              <Sparkles className="text-cyan-400" size={14} />
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">HAWKIN ACADEMY v1.0</span>
           </div>
           <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
             Formación <span className="text-gray-600">Alpha.</span>
           </h1>
           <p className="text-gray-500 text-xl max-w-3xl mx-auto font-light leading-relaxed">
             Domina las herramientas que mueven el capital global. 
             De aprendiz a Operador de Élite en 12 módulos de inteligencia pura.
           </p>
        </section>

        {/* LISTA DE CURSOS DISPONIBLES */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {courses.map((course) => (
             <motion.div 
               key={course.id}
               whileHover={{ y: -10 }}
               className="glass-card p-10 rounded-[60px] border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between h-[500px] relative overflow-hidden group shadow-2xl"
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><BookOpen size={150} /></div>
                <div>
                   <div className="flex justify-between items-start mb-10">
                      <span className="text-[9px] font-black bg-cyan-500 text-black px-4 py-1.5 rounded-full uppercase tracking-widest">{course.level || 'ELITE'}</span>
                      <div className="flex items-center gap-2 text-yellow-500">
                         <Star size={12} fill="currentColor" />
                         <span className="text-xs font-black">4.9</span>
                      </div>
                   </div>
                   <h3 className="text-3xl font-black uppercase italic leading-none mb-6">{course.title}</h3>
                   <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-3">{course.description}</p>
                </div>

                <div className="space-y-8">
                   <div className="flex items-center justify-between border-y border-white/5 py-6">
                      <div className="flex items-center gap-3">
                         <Play size={14} className="text-cyan-500" />
                         <span className="text-[10px] font-black text-gray-400 uppercase">{course.modules?.length || 0} Módulos</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Zap size={14} className="text-purple-500" />
                         <span className="text-[10px] font-black text-gray-400 uppercase">+500 XP</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedCourse(course)}
                     className="w-full py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-4"
                   >
                      Iniciar Entrenamiento <ChevronRight size={16} />
                   </button>
                </div>
             </motion.div>
           ))}
        </section>

        {/* ESTADÍSTICAS DE SOCIO */}
        <section className="p-16 rounded-[80px] bg-[#050505] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex items-center gap-10">
              <div className="w-24 h-24 rounded-[35px] bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                 <Terminal size={40} className="text-cyan-400" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-2">Perfil de Operador</p>
                 <h4 className="text-4xl font-black uppercase italic tracking-tighter text-white">{user?.nickname || 'INICIANDO_SESIÓN'}</h4>
                 <div className="flex items-center gap-4 mt-3">
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">Rango: Aspirante Alpha</span>
                    <div className="w-1 h-1 bg-gray-800 rounded-full" />
                    <span className="text-[9px] font-black text-yellow-500 uppercase">{user?.xp || 0} PUNTOS XP</span>
                 </div>
              </div>
           </div>
           <div className="flex flex-wrap justify-center gap-6">
              {[
                { l: 'Completado', v: '0%', i: <ShieldCheck className="text-green-500" /> },
                { l: 'Tiempo', v: '0h', i: <Activity className="text-blue-500" /> },
                { l: 'Misión', v: 'Alpha', i: <Globe className="text-purple-500" /> }
              ].map((s, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center min-w-32">
                   <div className="flex justify-center mb-3 opacity-30">{s.i}</div>
                   <p className="text-[8px] font-black text-gray-700 uppercase mb-1">{s.l}</p>
                   <p className="text-lg font-black text-white">{s.v}</p>
                </div>
              ))}
           </div>
        </section>

      </div>
      <Footer /><GlobalTicker />
    </main>
  );
}
