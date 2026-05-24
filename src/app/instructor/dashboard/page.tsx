'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { UploadCloud, DollarSign, Users, BookOpen, CheckCircle, Clock, BarChart3, PlusCircle } from 'lucide-react';

export default function InstructorDashboard() {
  const stats = [
    { label: 'Ventas Totales', value: '$2,450', icon: <DollarSign className="text-green-500" />, detail: 'Tu ganancia (60%)' },
    { label: 'Estudiantes', value: '128', icon: <Users className="text-cyan-400" />, detail: 'Inscritos este mes' },
    { label: 'Cursos Activos', value: '3', icon: <BookOpen className="text-purple-500" />, detail: 'En el Marketplace' },
    { label: 'Comisión HAWKIN', value: '$980', icon: <BarChart3 className="text-gray-500" />, detail: 'Plataforma (40%)' },
  ];

  const myCourses = [
    { id: '1', title: 'Python para IA Avanzada', sales: 45, status: 'PUBLICADO', price: '$49' },
    { id: '2', title: 'Seguridad en Redes Neuronales', sales: 12, status: 'REVISIÓN', price: '$89' },
  ];

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">Portal de Expertos</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 leading-none italic">Instructor <span className="text-gray-500">Dashboard</span></h1>
            <p className="text-gray-500 mt-6 text-sm uppercase tracking-widest font-bold">Gestiona tu conocimiento y tus ingresos en el ecosistema HAWKIN</p>
          </div>
          <button className="btn-glow flex items-center gap-3 text-[10px] py-5 px-10">
            <PlusCircle size={16} /> SUBIR NUEVO CURSO
          </button>
        </header>

        {/* MÉTRICAS FINANCIERAS 60/40 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card border-white/5 bg-white/[0.02] p-8 rounded-[35px] relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Live Sync</span>
              </div>
              <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
              <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="pt-4 border-t border-white/5 text-[9px] text-gray-500 font-bold uppercase">{stat.detail}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LISTA DE CURSOS PROPIOS */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-3">
              <CheckCircle size={16} className="text-cyan-400" /> Mis Programas en HAWKIN
            </h3>
            
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="glass-card border-white/5 bg-white/[0.01] p-8 rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-8 hover:border-white/10 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-gray-600">ID-{course.id}</div>
                      <div>
                        <h4 className="text-xl font-bold uppercase italic leading-tight">{course.title}</h4>
                        <div className="flex gap-4 mt-2">
                           <span className="text-[9px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded uppercase">{course.price}</span>
                           <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Ventas: {course.sales}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className={`text-[9px] font-black px-4 py-2 rounded-full border ${course.status === 'PUBLICADO' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>
                        {course.status}
                      </span>
                      <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors underline">Editar Lecciones</button>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* ZONA DE CARGA RÁPIDA */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-600">Área de Producción</h3>
            <div className="p-10 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/5 rounded-[45px] text-center space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-50" />
               <UploadCloud size={60} className="mx-auto text-gray-700 group-hover:text-cyan-400 transition-colors duration-500" />
               <div>
                  <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Subida Directa</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold tracking-widest">Arrastra tus videos o guías en formato PDF/MP4 para revisión técnica.</p>
               </div>
               <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all">Seleccionar Archivo</button>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[30px] space-y-4">
               <div className="flex items-center gap-3 text-cyan-400 mb-2">
                  <Clock size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Próximo Pago</span>
               </div>
               <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                 Tus fondos acumulados se liberarán el <b className="text-white">01 de Junio, 2026</b> vía transferencia automática.
               </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
