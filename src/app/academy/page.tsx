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
