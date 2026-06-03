'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Share2, MessageSquare, ThumbsUp, ThumbsDown, 
  ExternalLink, ChevronLeft, Calendar, User, Eye,
  ShieldCheck, Zap, Globe
} from 'lucide-react';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

interface NewsDetailContentProps {
  newsId: string;
}

export default function NewsDetailContent({ newsId }: NewsDetailContentProps) {
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        // Intentar buscar en la API de live news primero (ya que genera IDs dinámicos para RSS)
        const res = await fetch('/api/news/live');
        const data = await res.json();
        
        const allItems = [
          ...(data.news || []),
          ...(data.shield || []),
          ...(data.hardware || [])
        ];

        let found = allItems.find((n: any) => n.id === newsId);

        // Si no está en los feeds vivos, buscar por ID específico (noticias de DB)
        if (!found) {
          const resDb = await fetch(`/api/news?id=${newsId}`);
          found = await resDb.json();
        }

        if (found) {
          setNews(found);
          // Simulación de métricas para la estética "Imperio"
          setLikes(Math.floor(Math.random() * 500) + 100);
          setDislikes(Math.floor(Math.random() * 20));
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
          Desencriptando Inteligencia...
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center px-4">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Reporte no encontrado</h2>
        <p className="text-gray-500 max-w-md">La señal ha sido interceptada o el reporte ha sido movido al archivo clasificado.</p>
        <Link href="/" className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-full">
          Volver al Radar
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        
        {/* ENCABEZADO DE LA NOTICIA (FULL WIDTH) */}
        <div className="mb-16 space-y-8">
           <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-cyan-400 transition-colors group w-fit">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Radar
           </Link>
           
           <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <span className="bg-cyan-600 text-white text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                    {news.category || 'INTEL'}
                 </span>
                 <div className="h-px flex-1 bg-white/5" />
              </div>
              <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                {news.title}
              </h1>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* COLUMNA IZQUIERDA: CONTENIDO PRINCIPAL */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative aspect-video w-full rounded-[40px] overflow-hidden border border-white/5 bg-gray-900 shadow-2xl">
               <img 
                 src={news.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"} 
                 className="w-full h-full object-cover opacity-80"
                 alt=""
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* METADATOS RÁPIDOS */}
            <div className="flex flex-wrap items-center gap-8 py-8 border-y border-white/5 text-gray-500">
               <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-cyan-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{news.date}</span>
               </div>
               <div className="flex items-center gap-3">
                  <User size={16} className="text-cyan-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">HAWKIN Intelligence</span>
               </div>
               <div className="flex items-center gap-3">
                  <Eye size={16} className="text-cyan-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{Math.floor(Math.random() * 5000) + 1200} Visualizaciones</span>
               </div>
            </div>

            {/* RESUMEN ESTRATÉGICO */}
            <div className="space-y-8">
               <div className="flex items-center gap-4 text-cyan-400">
                  <Zap size={20} />
                  <h2 className="text-sm font-black uppercase tracking-[0.5em]">Resumen de Inteligencia</h2>
               </div>
               <div className="prose prose-invert max-w-none">
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300 italic border-l-4 border-cyan-500/30 pl-8 py-4">
                     {news.excerpt}
                  </p>
                  <div className="mt-12 text-lg text-gray-400 font-light leading-loose space-y-6">
                    {/* El contenido real de la noticia o el resumen extendido */}
                    {news.content ? (
                      news.content.split('\n').map((para: string, i: number) => (
                        <p key={i}>{para}</p>
                      ))
                    ) : (
                      <p>Nuestro motor de inteligencia está analizando los detalles técnicos de este evento. La integración agéntica sugiere un impacto significativo en los mercados de IA de frontera. Se recomienda vigilancia continua sobre esta señal.</p>
                    )}
                  </div>
               </div>
            </div>

            {/* SECCIÓN DE COMENTARIOS (SIMULADA) */}
            <div className="pt-20 border-t border-white/5 space-y-12">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                  <MessageSquare className="text-cyan-500" /> Transmisiones del Gremio
               </h3>
               <div className="bg-white/[0.02] border border-white/5 rounded-[30px] p-8">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex-shrink-0" />
                     <div className="flex-1 space-y-4">
                        <div className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-gray-500 italic">
                           "Iniciando sesión para comentar..."
                        </div>
                        <button className="px-6 py-3 bg-cyan-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full opacity-50 cursor-not-allowed">
                           Enviar Reporte
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: ACCIONES Y ENLACE EXTERNO */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* PANEL DE ACCIÓN ESTRATÉGICA */}
            <div className="sticky top-40 space-y-8">
              
              <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] space-y-10">
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Acción Requerida</h3>
                   <div className="h-px bg-white/5" />
                </div>

                {/* BOTÓN AL ENLACE REAL */}
                {news.url && (
                   <a 
                     href={news.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full py-6 bg-white text-black rounded-full flex items-center justify-center gap-4 group hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-2xl"
                   >
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">Ir a la Noticia Real</span>
                      <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
                   </a>
                )}

                {/* INTERACCIONES */}
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => { setLikes(l => hasLiked ? l - 1 : l + 1); setHasLiked(!hasLiked); setHasDisliked(false); }}
                    className={`flex items-center justify-center gap-3 p-5 rounded-3xl border transition-all ${hasLiked ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                   >
                      <ThumbsUp size={16} />
                      <span className="text-[10px] font-black">{likes}</span>
                   </button>
                   <button 
                    onClick={() => { setDislikes(d => hasDisliked ? d - 1 : d + 1); setHasDisliked(!hasDisliked); setHasLiked(false); }}
                    className={`flex items-center justify-center gap-3 p-5 rounded-3xl border transition-all ${hasDisliked ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                   >
                      <ThumbsDown size={16} />
                      <span className="text-[10px] font-black">{dislikes}</span>
                   </button>
                </div>

                <button className="w-full flex items-center justify-center gap-4 py-5 rounded-3xl bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                   <Share2 size={16} /> Compartir Inteligencia
                </button>
              </div>

              {/* INDICADOR DE VERACIDAD */}
              <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-[30px] flex items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-green-500">Fuentes Verificadas</p>
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1">HAWKIN ALPHA-SAFE</p>
                 </div>
              </div>

            </div>
          </div>

        </div>

        {/* ESPACIO PUBLICITARIO INFERIOR (ADMAN) */}
        <div className="mt-32 pt-20 border-t border-white/5">
           <div className="flex flex-col items-center gap-8">
              <div className="text-center space-y-2">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 italic">Ecosistema Comercial Hawkin</h4>
                 <p className="text-[8px] text-gray-800 font-bold uppercase tracking-widest">Oportunidades Inyectadas por Socios</p>
              </div>
              <div className="w-full">
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

function Loader2({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
