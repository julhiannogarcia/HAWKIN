'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion } from 'framer-motion';
import { 
  Clock, Share2, MessageCircle, ThumbsUp, 
  ThumbsDown, Shield, ArrowLeft, Loader2, Globe, Sparkles
} from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function NewsDetailContent({ newsId }: { newsId: string }) {
  const { user } = useAlpha();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch(`/api/news?id=${newsId}`);
        const data = await res.json();
        setNews(Array.isArray(data) ? data.find((n: any) => n.id === newsId) : data);
      } catch (e) {
        console.error("News Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [newsId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
       <Loader2 className="animate-spin text-cyan-500" size={40} />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 animate-pulse">Desencriptando reporte Alpha...</p>
    </div>
  );

  if (!news) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
       <Shield className="text-red-500" size={40} />
       <p className="text-red-500 font-black uppercase text-xs">Reporte no encontrado en la base de datos.</p>
       <button onClick={() => window.history.back()} className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase">Regresar</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      
      {/* HERO IMAGE */}
      <div className="relative h-[70vh] w-full overflow-hidden">
         {news.imageUrl && (
            <img src={news.imageUrl} className="w-full h-full object-cover opacity-60" alt="" />
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
         
         <div className="absolute bottom-20 left-0 w-full">
            <div className="max-w-4xl mx-auto px-6 space-y-8">
               <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">{news.category || 'INTEL'}</span>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase">
                     <Clock size={14} /> {new Date(news.createdAt).toLocaleDateString()}
                  </div>
               </div>
               <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">{news.title}</h1>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* CONTENIDO PRINCIPAL */}
            <div className="lg:col-span-8 space-y-12">
               <div className="prose prose-invert max-w-none">
                  <p className="text-xl text-gray-300 font-light leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-cyan-500 first-letter:mr-3 first-letter:float-left">
                     {news.content}
                  </p>
               </div>

               {/* ACCIONES SOCIALES */}
               <div className="pt-12 border-t border-white/5 flex items-center gap-8">
                  <div className="flex items-center gap-3 group cursor-pointer">
                     <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                        <ThumbsUp size={18} className="group-hover:text-cyan-400" />
                     </div>
                     <span className="text-[10px] font-black text-gray-500 uppercase">1.2k</span>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                     <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                        <ThumbsDown size={18} className="group-hover:text-red-400" />
                     </div>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer ml-auto">
                     <Share2 size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                     <span className="text-[10px] font-black text-gray-500 uppercase">Compartir</span>
                  </div>
               </div>
            </div>

            {/* BARRA LATERAL */}
            <div className="lg:col-span-4 space-y-12">
               <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-cyan-500 tracking-widest flex items-center gap-3">
                     <Globe size={14} /> Análisis de Red
                  </h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-gray-600 tracking-widest">Impacto Global</span>
                        <span className="text-white">{news.isUrgent ? 'Crítico' : 'Alto'}</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-cyan-500" />
                     </div>
                  </div>
               </div>

               <div className="p-8 rounded-[40px] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-6">
                  <Sparkles className="text-purple-400" size={24} />
                  <h4 className="text-lg font-black uppercase italic tracking-tighter">Socio Alpha</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Este reporte ha sido procesado por el núcleo HAWKIN. Los socios Nivel 5+ tienen acceso a predicciones avanzadas sobre esta noticia.</p>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">Desbloquear Predicción</button>
               </div>
            </div>

         </div>
      </div>

      <Footer /><GlobalTicker />
    </main>
  );
}
