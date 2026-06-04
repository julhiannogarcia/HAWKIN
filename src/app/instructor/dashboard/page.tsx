'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { UploadCloud, DollarSign, Users, BookOpen, CheckCircle, Clock, ChartNoAxesColumn, CirclePlus, FileCheck, LoaderCircle } from 'lucide-react';

export default function InstructorDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Ventas Totales', value: '$2,450', icon: <DollarSign className="text-green-500" />, detail: 'Tu ganancia (60%)' },
    { label: 'Estudiantes', value: '128', icon: <Users className="text-cyan-400" />, detail: 'Inscritos este mes' },
    { label: 'Cursos Activos', value: '3', icon: <BookOpen className="text-purple-500" />, detail: 'En el Marketplace' },
    { label: 'Comisión HAWKIN', value: '$980', icon: <ChartNoAxesColumn className="text-gray-500" />, detail: 'Plataforma (40%)' },
  ];

  const myCourses = [
    { id: '1', title: 'Python para IA Avanzada', sales: 45, status: 'PUBLICADO', price: '$49' },
    { id: '2', title: 'Seguridad en Redes Neuronales', sales: 12, status: 'REVISIÓN', price: '$89' },
  ];

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulador de subida profesional
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      {/* Input de archivo oculto */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="video/*,.pdf"
      />

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">Portal de Expertos</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 leading-none italic">Instructor <span className="text-gray-500">Dashboard</span></h1>
          </div>
          <button onClick={handleFileSelect} className="btn-glow flex items-center gap-3 text-[10px] py-5 px-10">
            <CirclePlus size={16} /> SUBIR NUEVO CURSO
          </button>
        </header>

        {/* MÉTRICAS FINANCIERAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="glass-card border-white/5 bg-white/[0.02] p-8 rounded-[35px]">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-2xl">{stat.icon}</div>
              </div>
              <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-3">
              <CircleCheck size={16} className="text-cyan-400" /> Mis Programas en HAWKIN
            </h3>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="glass-card border-white/5 bg-white/[0.01] p-8 rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-gray-600">ID-{course.id}</div>
                      <h4 className="text-xl font-bold uppercase italic leading-tight">{course.title}</h4>
                   </div>
                   <span className={`text-[9px] font-black px-4 py-2 rounded-full border ${course.status === 'PUBLICADO' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>
                      {course.status}
                   </span>
                </div>
              ))}
            </div>
          </div>

          {/* ÁREA DE CARGA FUNCIONAL */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-600">Área de Producción</h3>
            <div className="p-10 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/5 rounded-[45px] text-center space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600 opacity-50" />
               
               <AnimatePresence mode="wait">
                 {isUploading ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 space-y-6">
                      <LoaderCircle className="mx-auto text-cyan-400 animate-spin" size={48} />
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Sincronizando Material ({uploadProgress}%)</p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                   </motion.div>
                 ) : showSuccess ? (
                   <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-10 space-y-4">
                      <FileCheck className="mx-auto text-green-500" size={50} />
                      <h4 className="text-lg font-black uppercase text-white">¡Recibido!</h4>
                      <p className="text-[9px] text-gray-500 uppercase font-bold">Julhianno Garcia revisará tu material pronto.</p>
                   </motion.div>
                 ) : (
                   <div className="space-y-8 py-4">
                      <UploadCloud size={60} className="mx-auto text-gray-700 group-hover:text-cyan-400 transition-colors" />
                      <div>
                         <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Subida Directa</h4>
                         <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold">MP4 para clases o PDF para guías técnicas.</p>
                      </div>
                      <button onClick={handleFileSelect} className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all">Seleccionar Archivo</button>
                   </div>
                 )}
               </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
