'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Newspaper, Sparkles, Send, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Big Tech');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePublish = async () => {
    if (!title || !content) {
      setError('Socio, el título y el contenido son obligatorios.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          isUrgent,
          isLocked,
        }),
      });

      if (!res.ok) throw new Error('Fallo al publicar');

      setShowSuccess(true);
      setTitle('');
      setContent('');
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (e) {
      setError('Error al inyectar noticia al radar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Newspaper className="text-cyan-400" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Editor de Inteligencia</span>
           </div>
           <h1 className="text-4xl font-black tracking-tighter italic uppercase">Crear <span className="text-white">Nueva Noticia.</span></h1>
           <p className="text-gray-500 mt-2 font-light">Inyecta reportes exclusivos directamente al Radar Global HAWKIN.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Guardar Borrador
          </button>
          <button 
            onClick={handlePublish}
            disabled={isLoading}
            className="btn-glow text-xs px-10 py-3 flex items-center gap-3 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            {isLoading ? 'PUBLICANDO...' : 'PUBLICAR AHORA'}
          </button>
        </div>
      </header>

      <AnimatePresence>
         {showSuccess && (
            <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="bg-green-500/10 border border-green-500/30 p-6 rounded-3xl flex items-center gap-4">
               <CheckCircle2 className="text-green-500" size={24} />
               <p className="text-sm font-bold text-green-400 uppercase tracking-tighter">¡Noticia Inyectada con Éxito al Radar!</p>
            </motion.div>
         )}
         {error && (
            <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl flex items-center gap-4">
               <AlertCircle className="text-red-500" size={24} />
               <p className="text-sm font-bold text-red-400 uppercase tracking-tighter">{error}</p>
            </motion.div>
         )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 space-y-8">
            <div>
              <label className="text-[9px] uppercase tracking-[0.4em] text-cyan-400 font-black mb-4 block">Título de la Noticia</label>
              <input 
                type="text" 
                placeholder="Ej: Sam Altman revela el futuro de la IA..." 
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-2xl font-black italic focus:border-cyan-500 outline-none transition-all placeholder:text-gray-800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-[0.4em] text-cyan-400 font-black mb-4 block">Contenido del Reporte</label>
              <textarea 
                placeholder="Escribe tu análisis de profundidad aquí..." 
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 min-h-[500px] text-gray-400 leading-relaxed focus:border-cyan-500 outline-none transition-all font-light text-lg scrollbar-hide"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ajustes */}
        <div className="space-y-8">
          <div className="glass-card p-8 space-y-8">
            <h3 className="text-lg font-black uppercase italic tracking-tighter border-b border-white/5 pb-6 text-white">Sincronización</h3>
            
            <div className="space-y-4">
              <label className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black block">Categoría de Inteligencia</label>
              <select 
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-cyan-500 transition-all appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Big Tech</option>
                <option>CEO Radar</option>
                <option>SHIELD Intel</option>
                <option>Gold Signal</option>
                <option>Noticias del Futuro</option>
              </select>
            </div>

            <div className="space-y-4 pt-4">
               <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-red-500/30 transition-all cursor-pointer">
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-red-500">¿Noticia Urgente?</span>
                 <input 
                   type="checkbox" 
                   className="w-5 h-5 accent-red-500 cursor-pointer"
                   checked={isUrgent}
                   onChange={(e) => setIsUrgent(e.target.checked)}
                 />
               </div>
               
               <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all cursor-pointer">
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-cyan-500">¿Acceso Premium?</span>
                 <input 
                   type="checkbox" 
                   className="w-5 h-5 accent-cyan-500 cursor-pointer"
                   checked={isLocked}
                   onChange={(e) => setIsLocked(e.target.checked)}
                 />
               </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button className="w-full py-5 bg-purple-600/10 border border-purple-500/20 rounded-2xl text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3">
                <Sparkles size={16} /> Generar Resumen IA
              </button>
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
            <h3 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
               <Globe size={14} className="text-cyan-400" /> Cobertura Global
            </h3>
            <p className="text-[10px] text-gray-400 leading-relaxed font-bold">
              Al publicar, esta noticia será inyectada en el Live Radar y notificada a todos los Socios Alpha activos en la red.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
