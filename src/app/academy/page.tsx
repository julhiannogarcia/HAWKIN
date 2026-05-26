'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';

const courses = [
  {
    id: 'ia-master',
    title: 'Maestría en IA y Prompt Engineering',
    category: 'Inteligencia Artificial',
    price: '$49',
    duration: '4 semanas',
    image: '🤖',
    color: 'from-cyan-500/20'
  },
  {
    id: 'english-future',
    title: 'Inglés para el Futuro Digital',
    category: 'Idiomas',
    price: '$35',
    duration: '2 semanas min.',
    image: '🌍',
    color: 'from-purple-500/20'
  },
  {
    id: 'excel-elite',
    title: 'Excel de Élite y Análisis de Datos',
    category: 'Productividad',
    price: '$29',
    duration: '3 semanas',
    image: '📊',
    color: 'from-green-500/20'
  },
  {
    id: 'inclusion-autismo',
    title: 'HAWKIN Inclusion: Estimulación Profesional',
    category: 'Inclusión Social',
    price: '$0 (Acceso Socios)',
    duration: 'Basado en Fases',
    image: '🧩',
    color: 'from-blue-500/20'
  }
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      <div className="max-w-6xl mx-auto px-4 pt-40 pb-32">
        <section className="text-center space-y-6 mb-24">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">Evolución Constante</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
            Academia <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">HAWKIN</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Formación de élite diseñada para los líderes que construirán el mañana. 
            IA, Idiomas y Programas de Impacto Social.
          </p>
        </section>

        {/* Banner Prototipo Inglés IA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 p-8 md:p-12 rounded-[50px] bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-blue-600/20 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest">
              Lanzamiento Beta
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
              Inglés Conversacional <br /><span className="text-cyan-400">con HAWKIN AI</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md font-light">
              Habla directamente con nuestra IA, mejora tu pronunciación en tiempo real y escala niveles desde Básico hasta Experto.
            </p>
          </div>
          <Link href="/prototipo-curso" className="relative z-10 shrink-0">
            <button className="px-12 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              Probar Prototipo Gratuito
            </button>
          </Link>
        </motion.div>

        {/* Galería de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`glass-card bg-gradient-to-br ${course.color} to-transparent border-white/5 hover:border-white/20 transition-all p-10 flex flex-col justify-between group`}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="text-4xl">{course.image}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {course.category}
                  </span>
                </div>
                
                <h3 className="text-3xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>
                
                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <div className="flex items-center gap-2">⏱ {course.duration}</div>
                  <div className="flex items-center gap-2 text-white">💰 {course.price}</div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <Link href={`/academy/${course.id}`} className="flex-1">
                  <button className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-colors">
                    Inscribirme Ahora
                  </button>
                </Link>
                <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors">
                  Saber Más
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nota de Certificación */}
        <div className="mt-32 text-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Reconocimiento Global</p>
          <h2 className="text-2xl font-bold text-white mb-4">Certificación HAWKIN</h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
            Al completar con éxito cualquier programa, recibirás un certificado digital verificado por el ecosistema HAWKIN y firmado por Julhianno Garcia.
          </p>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
