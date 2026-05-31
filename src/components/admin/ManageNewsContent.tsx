'use client';

import { useState, useEffect } from 'react';
import { Loader2, CircleCheckBig, CircleAlert, Newspaper, Sparkles, Send, Globe, Trash2, Link as LinkIcon, Image as ImageIcon, ExternalLink, Clock, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageNews() {
  // Estado para creación
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Big Tech');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  
  // Estado de UI
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [existingNews, setExistingNews] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Cargar noticias existentes
  const fetchNews = async () => {
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      if (Array.isArray(data)) setExistingNews(data);
    } catch (e) {
      console.error("Error fetching news", e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
          image: image || undefined,
          url: url || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.message || 'Fallo de inyección Alpha');
      }

      setShowSuccess(true);
      setTitle('');
      setContent('');
      setImage('');
      setUrl('');
      fetchNews(); // Recargar lista
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (e: any) {
      console.error("Injection error:", e);
      setError(e.message || 'Error al inyectar noticia al radar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este reporte de inteligencia?')) return;

    try {
      const res = await fetch('/api/admin/news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setExistingNews(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-40">
      
      {/* CABECERA PRINCIPAL */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Master News Injector v2.5</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic uppercase">War <span className="text-white">Editor.</span></h1>
        </div>
        
        <button 
          onClick={handlePublish}
          disabled={isLoading}
          className="w-full md:w-auto px-16 py-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-full font-black text-[12px] uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(34,211,238,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          {isLoading ? 'SINCRONIZANDO...' : 'INYECTAR AHORA'}
        </button>
      </header>

      <AnimatePresence>
        {showSuccess && (
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="bg-green-500/20 border-2 border-green-500/50 p-8 rounded-[40px] flex items-center justify-center gap-6 shadow-[0_0_100px_rgba(34,197,94,0.2)]">
              <CircleCheckBig className="text-green-500" size={40} />
              <p className="text-xl font-black text-white uppercase tracking-tighter italic">¡Reporte inyectado con éxito al radar mundial!</p>
            </motion.div>
        )}
        {error && (
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="bg-red-500/20 border-2 border-red-500/50 p-8 rounded-[40px] flex flex-col items-center gap-4 shadow-[0_0_100px_rgba(239,68,68,0.2)]">
              <div className="flex items-center gap-4">
                 <CircleAlert className="text-red-500" size={32} />
                 <p className="text-lg font-black text-white uppercase tracking-tighter italic">Fallo de Comunicación Táctica</p>
              </div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUMNA IZQUIERDA: CAMPOS CRÍTICOS (IMAGEN Y ENLACE) */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/20 space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400 flex items-center gap-3">
                 <ImageIcon size={16} /> Activos Visuales
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Dirección de la Imagen (URL)</label>
                    <div className="relative">
                       <input 
                          type="text" 
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-bold text-white focus:border-cyan-500 outline-none transition-all"
                       />
                       {image && <button onClick={() => setImage('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={14}/></button>}
                    </div>
                 </div>

                 <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Vínculo de Inteligencia (URL Fuente)</label>
                    <div className="relative">
                       <input 
                          type="text" 
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://bloomberg.com/..."
                          className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-bold text-white focus:border-cyan-500 outline-none transition-all"
                       />
                       {url && <button onClick={() => setUrl('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={14}/></button>}
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <div className="w-full aspect-video rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                    {image ? (
                       <img src={image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                       <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Vista previa del arte</p>
                    )}
                 </div>
              </div>
           </div>

           <div className="glass-card p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3 border-b border-white/5 pb-4">
                 <Terminal size={16} /> Sincronización
              </h3>
              <div className="space-y-4">
                 <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full bg-black border border-white/10 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500 appearance-none text-white"
                 >
                    <option>Big Tech</option>
                    <option>CEO Radar</option>
                    <option>SHIELD Intel</option>
                    <option>Gold Signal</option>
                 </select>
                 <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <span className="text-[9px] font-black uppercase text-gray-500">¿Prioridad Roja?</span>
                    <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="w-4 h-4 accent-red-600" />
                 </div>
              </div>
           </div>
        </div>

        {/* COLUMNA DERECHA: TEXTO ANALÍTICO */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-12 space-y-10">
              <div>
                 <label className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-6 block">Título del Reporte Táctico</label>
                 <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="TITULAR DE ALTO IMPACTO..."
                    className="w-full bg-transparent border-b-2 border-white/5 focus:border-cyan-500 p-0 pb-4 text-4xl md:text-6xl font-black italic uppercase outline-none transition-all placeholder:text-gray-800 tracking-tighter"
                 />
              </div>

              <div>
                 <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-6 block">Desarrollo del Análisis de Inteligencia</label>
                 <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escribe el cuerpo del reporte aquí..."
                    className="w-full bg-white/[0.01] border border-white/5 rounded-[40px] p-10 min-h-[500px] text-xl font-light text-gray-400 leading-relaxed outline-none focus:border-cyan-500 transition-all scrollbar-hide"
                 />
              </div>
           </div>
        </div>

      </div>

      {/* ARCHIVO DE INYECCIONES */}
      <section className="space-y-12 pt-20">
         <div className="flex items-center gap-4 border-l-4 border-cyan-500 pl-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Archivo <span className="text-gray-600">Alpha.</span></h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingList ? (
               <div className="col-span-full py-20 text-center">
                  <Loader2 className="animate-spin text-cyan-500 mx-auto" size={40} />
               </div>
            ) : existingNews.map((news) => (
               <div key={news.id} className="glass-card group relative p-0 overflow-hidden h-96 flex flex-col border-white/5 hover:border-red-500/30 transition-all">
                  <div className="h-40 bg-gray-900 relative">
                     <img src={news.image} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" />
                     <button 
                        onClick={() => handleDelete(news.id)}
                        className="absolute top-4 right-4 p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                     <h4 className="text-sm font-black uppercase italic leading-tight line-clamp-2">{news.title}</h4>
                     <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-[8px] font-black text-gray-600 uppercase flex items-center gap-2"><Clock size={10} /> {new Date(news.createdAt).toLocaleDateString()}</span>
                        {news.url && <ExternalLink size={12} className="text-cyan-500" />}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

    </div>
  );
}
