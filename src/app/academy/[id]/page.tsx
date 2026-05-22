'use client';

import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { PlayCircle, CheckCircle2, Lock, ArrowRight, Award, BookOpen } from 'lucide-react';

const COURSES_DATA: Record<string, any> = {
  'ia-master': {
    title: 'Maestría en IA y Prompt Engineering',
    category: 'Inteligencia Artificial',
    modules: [
      { 
        title: 'Fundamentos de Modelos LLM', 
        lessons: [
          { id: '1', title: '¿Qué es GPT-5?', duration: '12 min', isCompleted: true },
          { id: '2', title: 'Ingeniería de Prompts Nivel Pro', duration: '18 min', isCurrent: true },
          { id: '3', title: 'Prueba de Módulo', type: 'QUIZ' }
        ] 
      },
      { 
        title: 'Automatización Avanzada', 
        lessons: [
          { id: '4', title: 'APIs y Conexión de Datos', duration: '25 min', isLocked: true }
        ] 
      }
    ]
  },
  'inclusion-autismo': {
    title: 'HAWKIN Inclusion: Estimulación Profesional',
    category: 'Inclusión Social',
    modules: [
      { 
        title: 'Fase 1: Conexión Sensorial', 
        lessons: [
          { id: '1', title: 'Introducción a la Estimulación', duration: '10 min', isCurrent: true },
          { id: '2', title: 'Colores y Movimientos Suaves', duration: '15 min', isLocked: false }
        ] 
      }
    ]
  }
};

export default function CourseLMS({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const course = COURSES_DATA[id] || COURSES_DATA['ia-master'];

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <div className="flex flex-col lg:flex-row pt-24 min-h-screen">
        
        {/* Barra Lateral de Lecciones */}
        <aside className="w-full lg:w-96 border-r border-white/5 bg-black/40 backdrop-blur-xl overflow-y-auto max-h-[400px] lg:max-h-screen sticky top-24">
          <div className="p-8 border-b border-white/5">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">{course.category}</span>
            <h2 className="text-xl font-black tracking-tight">{course.title}</h2>
            <div className="mt-6 space-y-2">
               <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase">
                  <span>Tu Progreso</span>
                  <span>35%</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[35%] h-full bg-cyan-400 shadow-[0_0_10px_cyan]" />
               </div>
            </div>
          </div>

          <div className="p-4">
            {course.modules.map((module: any, idx: number) => (
              <div key={idx} className="mb-8">
                <h3 className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookOpen size={12} /> {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson: any) => (
                    <div 
                      key={lesson.id} 
                      className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all border border-transparent ${lesson.isCurrent ? 'bg-cyan-400/5 border-cyan-400/20 text-white' : 'text-gray-500 hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        {lesson.isCompleted ? <CheckCircle2 size={16} className="text-cyan-400" /> : lesson.isLocked ? <Lock size={16} /> : <PlayCircle size={16} />}
                        <div>
                          <p className="text-xs font-bold leading-none mb-1">{lesson.title}</p>
                          <span className="text-[9px] uppercase tracking-tighter opacity-50">{lesson.type || lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Área de Visualización (Player) */}
        <div className="flex-1 p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Reproductor de Video */}
            <div className="relative w-full aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-gray-900 group">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-110 transition-all cursor-pointer">
                  <PlayCircle size={40} />
                </div>
              </div>
              <div className="absolute bottom-10 left-10 flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">Streaming de Alta Definición Activo</span>
              </div>
            </div>

            {/* Contenido de la Lección */}
            <div className="space-y-8">
              <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Lección 02: Ingeniería de Prompts Avanzada</h1>
                  <p className="text-gray-500 mt-4 text-sm font-light">En esta sesión aprenderás a estructurar comandos complejos para modelos de razonamiento lógico.</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">
                  Siguiente Lección <ArrowRight size={14} />
                </button>
              </header>

              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 italic text-gray-400 text-lg leading-relaxed">
                "La clave de un prompt maestro no es el qué, sino el cómo. Definir el rol, el contexto y los límites de salida es la diferencia entre un resultado mediocre y uno de élite."
              </div>
            </div>

            {/* Sistema de Certificación (Al final) */}
            <div className="p-12 rounded-[50px] border border-dashed border-cyan-500/20 bg-cyan-400/5 text-center flex flex-col items-center gap-6">
               <Award size={48} className="text-cyan-400 shadow-[0_0_20px_cyan]" />
               <h3 className="text-2xl font-black uppercase tracking-widest">Certificación HAWKIN Academy</h3>
               <p className="text-sm text-gray-500 max-w-sm">Completa todas las lecciones y aprueba el examen final para obtener tu certificado firmado por <b>Julhianno Garcia</b>.</p>
            </div>

          </div>
        </div>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
