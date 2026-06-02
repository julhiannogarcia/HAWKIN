'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Share2, ThumbsUp, 
  ThumbsDown, Shield, Loader2, Globe, Sparkles, Bookmark, CheckCircle2
} from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function NewsDetailContent({ newsId }: { newsId: string }) {
  const { user, fetchAlpha } = useAlpha();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch(`/api/news?id=${newsId}`);
        const data = await res.json();
        setNews(data);
      } catch (e) {
        console.error("News Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [newsId]);

  const handleReact = async (action: 'LIKE' | 'DISLIKE' | 'SAVE') => {
    if (!user) {
      setShowToast("Identidad Alpha requerida para esta acción.");
      setTimeout(() => setShowToast(null), 3000);
      return;
    }
    
    setReacting(true);
    try {
      const res = await fetchAlpha('/api/news/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId, action })
      });
      const data = await res.json();
      if (res.ok) {
        if (action === 'LIKE') setNews({ ...news, likes: data.likes });
        if (action === 'DISLIKE') setNews({ ...news, dislikes: data.dislikes });
        if (action === 'SAVE') {
          setSaved(true);
          setShowToast("Reporte guardado en tu Bóveda Alpha.");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReacting(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
       <Loader2 className="animate-spin text-cyan-500" size={40} />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 animate-pulse">Desencriptando reporte Alpha...</p>
    </div>
  );

  if (!news) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
       <Shield className="text-red-500" size={40} />
       <p className="text-red-500 font-black uppercase text-xs">Reporte no encontrado.</p>
       <button onClick={() => window.history.back()} className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase">Regresar</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 bg-cyan-500 text-black rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl"
          >
            <CheckCircle2 size={14} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* HERO IMAGE */}
      <div className="relative h-[70vh] w-full overflow-hidden">
         <img src={news.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"} className="w-full h-full object-cover opacity-60" alt="" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
         
         <div className="absolute bottom-20 left-0 w-full">
            <div className="max-w-4xl mx-auto px-6 space-y-8">
               <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">{news.category || 'INTEL'}</span>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                     <Clock size={14} /> {new Date(news.createdAt).toLocaleDateString()}
                  </div>
               </div>
               <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">{news.title}</h1>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            <div className="lg:col-span-8 space-y-12">
               <div className="prose prose-invert max-w-none">
                  <p className="text-xl text-gray-300 font-light leading-relaxed first-letter:text-6xl first-letter:font-black first-letter:text-cyan-500 first-letter:mr-3 first-letter:float-left">
                     {news.content}
                  </p>
               </div>

               <div className="pt-12 border-t border-white/5 flex items-center gap-8">
                  <button onClick={() => handleReact('LIKE')} disabled={reacting} className="flex items-center gap-3 group">
                     <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all border border-white/5">
                        <ThumbsUp size={18} className="group-hover:text-cyan-400" />
                     </div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{news.likes || 0}</span>
                  </button>
                  <button onClick={() => handleReact('DISLIKE')} disabled={reacting} className="flex items-center gap-3 group">
                     <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-all border border-white/5">
                        <ThumbsDown size={18} className="group-hover:text-red-400" />
                     </div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{news.dislikes || 0}</span>
                  </button>
                  <button onClick={() => handleReact('SAVE')} disabled={reacting || saved} className="flex items-center gap-3 group">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border border-white/5 ${saved ? 'bg-cyan-500 text-black' : 'bg-white/5 group-hover:bg-cyan-500/20'}`}>
                        <Bookmark size={18} className={saved ? '' : 'group-hover:text-cyan-400'} fill={saved ? "currentColor" : "none"} />
                     </div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{saved ? 'GUARDADO' : 'GUARDAR'}</span>
                  </button>
                  <div className="flex items-center gap-3 group cursor-pointer ml-auto">
                     <Share2 size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
               <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6 text-center">
                  <Globe className="text-cyan-500 mx-auto" size={32} />
                  <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Nivel de Relevancia</h4>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-gradient-to-r from-cyan-500 to-purple-600" />
                  </div>
                  <p className="text-[9px] font-black text-white uppercase tracking-widest">IMPACTO CRÍTICO</p>
               </div>

               <div className="p-10 rounded-[50px] bg-gradient-to-br from-purple-600/10 via-transparent to-transparent border border-purple-500/20 space-y-8 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Sparkles size={200} /></div>
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">Análisis Alpha.</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">El núcleo HAWKIN ha detectado patrones de inversión masivos tras este reporte. Se recomienda precaución en posiciones cortas.</p>
                  <button className="w-full py-5 bg-white text-black rounded-full font-black text-[9px] uppercase tracking-[0.4em] hover:bg-purple-600 hover:text-white transition-all shadow-xl">Ver Predicción</button>
               </div>
            </div>

         </div>
      </div>

      <Footer /><GlobalTicker />
    </main>
  );
}
