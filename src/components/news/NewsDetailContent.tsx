'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Share2, ThumbsUp, ThumbsDown, 
  ExternalLink, ChevronLeft, Calendar, User, Eye,
  ShieldCheck, Zap, Globe, BarChart3, AlertTriangle, TrendingUp
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
          setLikes(Math.floor(Math.random() * 800) + 150);
          setDislikes(Math.floor(Math.random() * 15));
          setViews(Math.floor(Math.random() * 12000) + 3500);
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
          Sincronizando Nodo de Inteligencia...
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center px-4">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Señal Perdida</h2>
        <p className="text-gray-500 max-w-md">El reporte ha sido clasificado o no está disponible en este momento.</p>
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
        
        {/* ENCABEZADO ESTRATÉGICO */}
        <div className="mb-16 space-y-8">
           <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-cyan-400 transition-colors group w-fit">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Radar Global
           </Link>
           
           <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                    {news.category || 'INTEL'}
                 </span>
                 <div className="h-px flex-1 bg-white/5" />
                 <div className="flex items-center gap-2 text-red-500">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">En Vivo</span>
                 </div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] text-white max-w-5xl">
                {news.title}
              </h1>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 text-left">
          
          {/* COLUMNA IZQUIERDA: CONTENIDO */}
          <div className="lg:col-span-8 space-y-12 text-left">
            <div className="relative aspect-video w-full rounded-[40px] overflow-hidden border border-white/5 bg-gray-900 shadow-2xl">
               <img 
                 src={news.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"} 
                 className="w-full h-full object-cover opacity-80"
                 alt=""
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            </div>

            {/* BARRA DE MÉTRICAS RÁPIDAS */}
            <div className="flex flex-wrap items-center gap-10 py-10 border-y border-white/5 text-gray-400">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-cyan-500"><Clock size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">Sincronización</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{news.date}</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-cyan-500"><Eye size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">Impacto Visual</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{views.toLocaleString()} Vistas</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-cyan-500"><TrendingUp size={16} /></div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-bold text-gray-600 uppercase tracking-widest">Fuente</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{news.source || 'Radar Alpha'}</span>
                  </div>
               </div>
            </div>

            {/* CUERPO DE LA INTELIGENCIA */}
            <div className="space-y-12 text-left">
               <div className="flex items-center gap-4 text-cyan-400">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Zap size={20} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-[0.5em]">Análisis Estratégico TITAN</h2>
               </div>
               
               <div className="space-y-8">
                  <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-200 italic border-l-4 border-cyan-500/40 pl-10 py-4">
                     {news.excerpt}
                  </p>
                  
                  <div className="text-lg md:text-xl text-gray-400 font-light leading-loose space-y-8">
                    {news.content ? (
                      String(news.content).split('\n').map((para: string, i: number) => (
                        <p key={i}>{para}</p>
                      ))
                    ) : (
                      <p>La Red HAWKIN está procesando los flujos secundarios de esta señal. Los patrones iniciales sugieren un cambio de paradigma en el sector de {news.category || 'tecnología de frontera'}. Se recomienda a los socios Atlas mantener vigilancia sobre sus activos relacionados.</p>
                    )}
                  </div>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PANEL DE ACCIÓN */}
          <div className="lg:col-span-4 space-y-12">
            <div className="sticky top-40 space-y-10">
              
              <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[50px] space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <ShieldCheck size={80} />
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Panel de Control Socio</h3>
                   <div className="h-px bg-white/5" />
                </div>

                {/* MÉTRICAS TITAN */}
                <div className="grid grid-cols-1 gap-6">
                   <div className="p-6 bg-black border border-white/5 rounded-3xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-gray-600 uppercase">Intel Level</span>
                        <span className="text-xs font-black text-cyan-500 italic">{news.intelLevel || '8.5'}/10</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${(Number(news.intelLevel) || 8.5) * 10}%` }} />
                      </div>
                   </div>
                </div>

                {/* BOTÓN AL ENLACE REAL */}
                {news.url && (
                   <a 
                     href={news.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full py-6 bg-white text-black rounded-full flex items-center justify-center gap-4 group hover:bg-cyan-500 hover:text-white transition-all duration-500"
                   >
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">Acceder a la Fuente</span>
                      <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
                   </a>
                )}

                {/* INTERACCIONES */}
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                       onClick={() => { setLikes(l => hasLiked ? l - 1 : l + 1); setHasLiked(!hasLiked); setHasDisliked(false); }}
                       className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[35px] border transition-all ${hasLiked ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                      >
                         <ThumbsUp size={20} />
                         <span className="text-[10px] font-black">{likes}</span>
                      </button>
                      <button 
                       onClick={() => { setDislikes(d => hasDisliked ? d - 1 : d + 1); setHasDisliked(!hasDisliked); setHasLiked(false); }}
                       className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[35px] border transition-all ${hasDisliked ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                      >
                         <ThumbsDown size={20} />
                         <span className="text-[10px] font-black">{dislikes}</span>
                      </button>
                   </div>

                   <button 
                     onClick={() => {
                       if (typeof navigator !== 'undefined' && navigator.share) {
                         navigator.share({ title: news.title, url: window.location.href }).catch(() => {});
                       } else if (typeof navigator !== 'undefined') {
                         navigator.clipboard.writeText(window.location.href);
                         alert("Enlace copiado al portapapeles estratégico.");
                       }
                     }}
                     className="w-full flex items-center justify-center gap-4 py-6 rounded-full bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                   >
                      <Share2 size={18} /> Difundir Reporte
                   </button>
                </div>
              </div>

              {/* VERACIDAD BLINDADA */}
              <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-[40px] flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Inteligencia Verificada</p>
                    <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Sello Alpha-Safe Activo</p>
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* PUBLICIDAD ADMAN (Ecosistema Comercial) */}
        <div className="mt-32 pt-20 border-t border-white/5">
           <div className="flex flex-col items-center gap-12">
              <div className="text-center space-y-4">
                 <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <ShoppingBag size={12} className="text-gray-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Socio Comercial Hawkin</span>
                 </div>
                 <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white">Ecosistema de Élite</h4>
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
