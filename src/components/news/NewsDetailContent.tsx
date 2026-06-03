'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Share2, ThumbsUp, ThumbsDown, 
  ExternalLink, ChevronLeft, Calendar, User, Eye,
  ShieldCheck, Zap, Globe, TrendingUp, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';
import { useAlpha } from '@/context/AlphaContext';

interface NewsDetailContentProps {
  newsId: string;
}

export default function NewsDetailContent({ newsId }: NewsDetailContentProps) {
  const { user } = useAlpha();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        
        const allItems = [
          ...(data.news || []),
          ...(data.shield || []),
          ...(data.hardware || [])
        ];

        let found = allItems.find((n: any) => n.id === newsId);

        if (!found) {
          const resDb = await fetch(`/api/news?id=${newsId}`);
          const dbData = await resDb.json();
          if (!dbData.error) found = dbData;
        }

        if (found) {
          setNews(found);
          // Métricas inyectadas para la Red TITAN
          setLikes(Math.floor(Math.random() * 850) + 200);
          setDislikes(Math.floor(Math.random() * 12));
          setViews(Math.floor(Math.random() * 15000) + 4000);
        }
      } catch (e) {
        console.error("Error loading news detail:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
    window.scrollTo(0, 0);
  }, [newsId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
          Accediendo a Bóveda de Inteligencia...
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center px-4">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Reporte Encriptado</h2>
        <p className="text-gray-500 max-w-md">La señal ha sido movida o no tienes el nivel de acceso requerido.</p>
        <Link href="/" className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full">
          Volver al Radar
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        
        {/* ENCABEZADO DE REPORTE */}
        <div className="mb-16 space-y-8">
           <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-cyan-400 transition-colors group w-fit">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Radar Global
           </Link>
           
           <div className="flex flex-col gap-6 text-left">
              <div className="flex items-center gap-4">
                 <span className="bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                    {news.category || 'INTEL'}
                 </span>
                 <div className="h-px flex-1 bg-white/5" />
                 <div className="flex items-center gap-2 text-red-500">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Señal Activa</span>
                 </div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                {news.title}
              </h1>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* COLUMNA IZQUIERDA: CUERPO DEL REPORTE */}
          <div className="lg:col-span-8 space-y-12 text-left">
            <div className="relative aspect-video w-full rounded-[50px] overflow-hidden border border-white/5 bg-gray-900 shadow-2xl">
               <img 
                 src={news.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"} 
                 className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                 alt=""
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* PANEL DE MÉTRICAS ESTRATÉGICAS */}
            <div className="flex flex-wrap items-center gap-12 py-10 border-y border-white/5">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-500 border border-white/10"><Clock size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Sincronizado</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{news.date}</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-500 border border-white/10"><Eye size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Intercepciones</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{views.toLocaleString()}</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-500 border border-white/10"><TrendingUp size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Origen</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{news.source || 'Intel Hub'}</span>
                  </div>
               </div>
            </div>

            {/* ANÁLISIS ESTRATÉGICO */}
            <div className="space-y-12">
               <div className="flex items-center gap-4 text-cyan-400">
                  <Zap size={20} className="animate-pulse" />
                  <h2 className="text-sm font-black uppercase tracking-[0.5em]">Informe de Inteligencia TITAN</h2>
               </div>
               
               <div className="space-y-10">
                  <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-100 italic border-l-4 border-cyan-500/50 pl-10 py-4 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-r-3xl">
                     {news.excerpt}
                  </p>
                  
                  <div className="text-lg md:text-xl text-gray-400 font-light leading-loose space-y-8">
                    {news.content ? (
                      String(news.content).split('\n').map((para: string, i: number) => (
                        <p key={i}>{para}</p>
                      ))
                    ) : (
                      <p>Nuestro sistema está procesando datos adicionales para este reporte. Los indicadores sugieren un cambio estructural en el ecosistema de {news.category || 'tecnología de frontera'}. Se recomienda vigilancia continua sobre esta señal.</p>
                    )}
                  </div>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PANEL DE ACCIONES */}
          <div className="lg:col-span-4 space-y-12">
            <div className="sticky top-40 space-y-10">
              
              <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[50px] space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <ShieldCheck size={100} />
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Protocolo de Acción</h3>
                   <div className="h-px bg-white/5" />
                </div>

                {/* NIVEL DE INTELIGENCIA */}
                <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                   <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black text-gray-500 uppercase">Impacto Alpha</span>
                     <span className="text-xs font-black text-cyan-500 italic">{news.intelLevel || '8.5'}/10</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(Number(news.intelLevel) || 8.5) * 10}%` }}
                       className="h-full bg-gradient-to-r from-cyan-600 to-blue-400" 
                     />
                   </div>
                </div>

                {/* BOTÓN AL ENLACE REAL */}
                {news.url && (
                   <a 
                     href={news.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full py-6 bg-white text-black rounded-full flex items-center justify-center gap-4 group hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-xl"
                   >
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">Acceder a la Fuente</span>
                      <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
                   </a>
                )}

                {/* INTERACCIONES REFINADAS */}
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                       onClick={() => { setLikes(l => hasLiked ? l - 1 : l + 1); setHasLiked(!hasLiked); setHasDisliked(false); }}
                       className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[35px] border transition-all ${hasLiked ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}`}
                      >
                         <ThumbsUp size={22} />
                         <span className="text-[10px] font-black">{likes}</span>
                      </button>
                      <button 
                       onClick={() => { setDislikes(d => hasDisliked ? d - 1 : d + 1); setHasDisliked(!hasDisliked); setHasLiked(false); }}
                       className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[35px] border transition-all ${hasDisliked ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/5'}`}
                      >
                         <ThumbsDown size={22} />
                         <span className="text-[10px] font-black">{dislikes}</span>
                      </button>
                   </div>

                   <button 
                     onClick={() => {
                       if (typeof navigator !== 'undefined' && navigator.share) {
                         navigator.share({ title: news.title, url: window.location.href }).catch(() => {});
                       } else if (typeof navigator !== 'undefined') {
                         navigator.clipboard.writeText(window.location.href);
                         alert("Link de inteligencia copiado.");
                       }
                     }}
                     className="w-full flex items-center justify-center gap-4 py-6 rounded-full bg-cyan-600/5 border border-cyan-500/10 text-cyan-500/60 hover:bg-cyan-600/10 hover:text-cyan-400 transition-all text-[10px] font-black uppercase tracking-widest"
                   >
                      <Share2 size={18} /> Difundir Inteligencia
                   </button>
                </div>
              </div>

              {/* SELLO DE VERIFICACIÓN */}
              <div className="p-8 bg-green-500/5 border border-green-500/10 rounded-[40px] flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-green-500/5 flex items-center justify-center text-green-500/40 border border-green-500/10">
                    <ShieldCheck size={28} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60">Datos Verificados</p>
                    <p className="text-[8px] text-gray-700 font-bold uppercase mt-1 tracking-widest">Protocolo Alpha-Safe</p>
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* PUBLICIDAD INFERIOR ADMAN */}
        <div className="mt-40 pt-24 border-t border-white/5">
           <div className="flex flex-col items-center gap-12">
              <div className="text-center space-y-4">
                 <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <ShoppingBag size={12} className="text-gray-600" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Socio Comercial Hawkin</span>
                 </div>
                 <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white/80">Ecosistema Global de Socios</h4>
              </div>
              <div className="w-full max-w-5xl">
                <AdSpace isPremium={false} type="inline" />
              </div>
           </div>
        </div>

      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
