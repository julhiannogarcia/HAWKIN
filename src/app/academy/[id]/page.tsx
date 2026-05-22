'use client';

import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { PlayCircle, CheckCircle2, Lock, ArrowRight, Award, BookOpen, Volume2, ShieldAlert } from 'lucide-react';

// FUENTES DE ÉLITE VERIFICADAS (PERMITEN INSERTAR/EMBED)
const COURSES_DATA: Record<string, any> = {
  'ia-master': {
    title: 'IA & Prompt Engineering Master',
    category: 'Generative AI 2026',
    videoUrl: 'https://www.youtube.com/embed/fU7hZ3Uj4L0', // Curso Avanzado Verificado
    modules: [
      { 
        title: 'Fundamentos de IA Generativa', 
        lessons: [
          { id: '1', title: 'Arquitectura de Modelos 2026', duration: '12 min', isCompleted: true },
          { id: '2', title: 'Ingeniería de Prompts Nivel Pro', duration: '18 min', isCurrent: true },
        ] 
      }
    ]
  },
  'excel-elite': {
    title: 'Excel & Automatización con IA',
    category: 'Data Intelligence',
    videoUrl: 'https://www.youtube.com/embed/Vl0hpfZ9C5E', // Microsoft Data Analysis
    modules: [
      { 
        title: 'Automatización de Tareas', 
        lessons: [
          { id: '1', title: 'Dashboards Inteligentes', duration: '45 min', isCurrent: true }
        ] 
      }
    ]
  },
  'inclusion-autismo': {
    title: 'HAWKIN Inclusion',
    category: 'Estimulación Sensorial Profesional',
    videoUrl: 'https://www.youtube.com/embed/pS3S68fK_oU', // Terapia Visual Calma
    modules: [
      { 
        title: 'Fase 1: Estimulación Temprana', 
        lessons: [
          { id: '1', title: 'Formas y Movimiento Suaves', duration: '15 min', isCurrent: true }
        ] 
      }
    ]
  },
  'english-future': {
    title: 'Inglés para el Futuro Tech',
    category: 'Idiomas',
    videoUrl: 'https://www.youtube.com/embed/5U7f0m36-2E', // Business English
    modules: [
      { 
        title: 'Inmersión Lingüística', 
        lessons: [
          { id: '1', title: 'Comunicación en Silicon Valley', duration: '20 min', isCurrent: true }
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
        <aside className="w-full lg:w-96 border-r border-white/5 bg-black/60 backdrop-blur-xl overflow-y-auto max-h-[400px] lg:max-h-screen sticky top-24">
          <div className="p-8 border-b border-white/5">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">{course.category}</span>
            <h2 className="text-xl font-black tracking-tight">{course.title}</h2>
            <div className="mt-6">
               <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase mb-2">
                  <span>Tu Avance</span>
                  <span>15%</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[15%] h-full bg-cyan-400 shadow-[0_0_10px_cyan]" />
               </div>
            </div>
          </div>

          <div className="p-4">
            {course.modules.map((module: any, idx: number) => (
              <div key={idx} className="mb-8">
                <h3 className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">
                   {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson: any) => (
                    <div key={lesson.id} className={`p-4 rounded-xl flex items-center justify-between ${lesson.isCurrent ? 'bg-white/5 border border-white/10' : 'text-gray-500'}`}>
                      <div className="flex items-center gap-3">
                        <PlayCircle size={16} className={lesson.isCurrent ? 'text-cyan-400' : ''} />
                        <span className="text-xs font-bold">{lesson.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Área de Visualización (Player) */}
        <div className="flex-1 p-8 lg:p-16">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* REPRODUCTOR DE CONOCIMIENTO REAL REPARADO */}
            <div className="relative w-full aspect-video rounded-[50px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-black">
              <iframe 
                className="w-full h-full opacity-90"
                src={`${course.videoUrl}?autoplay=0&rel=0&modestbranding=1`} 
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-4 text-cyan-400">
                  <ShieldAlert size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Módulo Certificado HAWKIN Academy</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Entrenamiento Premium</h1>
               <p className="text-gray-400 text-xl font-light leading-relaxed">
                  Estás visualizando una lección seleccionada por su alto valor técnico. Este material ha sido curado por el equipo de <b>Julhianno Garcia</b> para asegurar tu formación de élite.
               </p>
            </div>

            <div className="p-12 rounded-[50px] border border-dashed border-cyan-500/20 bg-cyan-400/5 text-center flex flex-col items-center gap-6">
               <Award size={48} className="text-yellow-500 mb-4" />
               <h3 className="text-2xl font-black uppercase tracking-widest">Estado de Certificación</h3>
               <p className="text-sm text-gray-600 max-w-sm">Completa el programa para desbloquear tu diploma oficial del ecosistema global HAWKIN.</p>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
