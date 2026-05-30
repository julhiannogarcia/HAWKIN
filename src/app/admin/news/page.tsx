'use client';

import { useState, useEffect } from 'react';
import { Loader2, CircleCheckBig, CircleAlert, Newspaper, Sparkles, Send, Globe, Trash2, Link as LinkIcon, Image as ImageIcon, ExternalLink, Clock } from 'lucide-react';
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

      if (!res.ok) throw new Error('Fallo al publicar');

      setShowSuccess(true);
      setTitle('');
      setContent('');
      setImage('');
      setUrl('');
      fetchNews(); // Recargar lista
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (e) {
      setError('Error al inyectar noticia al radar.');
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
    <div className="max-w-6xl mx-auto space-y-20 pb-40">
      
      {/* SECCIÓN 1: EDITOR DE NOTICIAS */}
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <Newspaper className="text-cyan-400" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Consola de Inyección v2.0</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Inyectar <span className="text-white">Reporte.</span></h1>
            <p className="text-gray-500 mt-2 font-light">Publica noticias bomba con imagen y fuente directa al Radar Global.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handlePublish}
              disabled={isLoading}
              className="btn-glow text-xs px-12 py-4 flex items-center gap-4 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {isLoading ? 'INYECTANDO...' : 'PUBLICAR EN VIVO'}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {showSuccess && (
              <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="bg-green-500/10 border border-green-500/30 p-6 rounded-3xl flex items-center gap-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <CircleCheckBig className="text-green-500" size={24} />
                <p className="text-sm font-bold text-green-400 uppercase tracking-tighter">¡Inteligencia Sincronizada con el Radar!</p>
              </motion.div>
          )}
          {error && (
              <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl flex items-center gap-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <CircleAlert className="text-red-500" size={24} />
                <p className="text-sm font-bold text-red-400 uppercase tracking-tighter">{error}</p>
              </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 space-y-10">
              <div>
                <label className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-black mb-4 block">Título del Reporte</label>
                <input 
                  type="text" 
                  placeholder="TITULAR DE IMPACTO..." 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-2xl font-black italic focus:border-cyan-500 outline-none transition-all placeholder:text-gray-800 uppercase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 font-black mb-4 block">Contenido Analítico</label>
                <textarea 
                  placeholder="DESARROLLO DE LA INTELIGENCIA..." 
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-8 min-h-[400px] text-gray-400 leading-relaxed focus:border-cyan-500 outline-none transition-all font-light text-lg scrollbar-hide"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-4 block flex items-center gap-2"><ImageIcon size={14} /> URL de Imagen</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-bold focus:border-cyan-500 outline-none transition-all"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mb-4 block flex items-center gap-2"><LinkIcon size={14} /> Enlace Fuente</label>
                  <input 
                    type="text" 
                    placeholder="https://bloomberg.com/..." 
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-bold focus:border-cyan-500 outline-none transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
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
            </div>

            <div className="glass-card p-8 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
              <h3 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <Globe size={14} className="text-cyan-400" /> Cobertura Global
              </h3>
              <p className="text-[10px] text-gray-400 leading-relaxed font-bold">
                Al inyectar el reporte, este aparecerá instantáneamente en el War Room mundial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: GESTIÓN DE NOTICIAS EXISTENTES */}
      <div className="space-y-10">
         <div className="flex items-center gap-4 border-l-4 border-cyan-500 pl-6">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Archivo de <span className="text-gray-600">Inyección.</span></h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingList ? (
              <div className="col-span-full py-20 text-center">
                 <Loader2 className="animate-spin text-cyan-500 mx-auto" size={40} />
                 <p className="mt-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando Archivo...</p>
              </div>
            ) : existingNews.length > 0 ? existingNews.map((news) => (
              <motion.div 
                key={news.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card group relative p-0 overflow-hidden flex flex-col h-full border-white/5 hover:border-red-500/30 transition-all"
              >
                <div className="h-40 bg-gray-900 relative overflow-hidden">
                   <img src={news.image} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="" />
                   <div className="absolute top-4 left-4">
                      <span className="text-[7px] font-black bg-cyan-500 text-black px-2 py-1 rounded-full uppercase">{news.category}</span>
                   </div>
                   <button 
                     onClick={() => handleDelete(news.id)}
                     className="absolute top-4 right-4 p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                <div className="p-8 flex-1 flex flex-col space-y-4">
                   <h3 className="text-lg font-black uppercase italic leading-tight line-clamp-2">{news.title}</h3>
                   <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[8px] font-black text-gray-600 uppercase">
                         <Clock size={10} /> {new Date(news.createdAt).toLocaleDateString()}
                      </div>
                      {news.url && (
                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-white transition-colors">
                           <ExternalLink size={14} />
                        </a>
                      )}
                   </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center bg-white/[0.01] rounded-[60px] border border-dashed border-white/10">
                 <p className="text-xs font-black text-gray-700 uppercase tracking-widest">No hay reportes inyectados manualmente</p>
              </div>
            )}
         </div>
      </div>

    </div>
  );
}
