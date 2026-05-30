'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import Paywall from '@/components/news/Paywall';
import { useSession } from 'next-auth/react';
import { 
  Share2, ThumbsUp, ThumbsDown, ArrowLeft, Bookmark, Lock, Zap, Target, Globe, TrendingUp, MessageCircle, ExternalLink, Clock, User, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================================
// COMPONENTES AUXILIARES (DEFINIDOS ANTES PARA EVITAR ERRORES)
// =====================================================================
const CustomLoader = ({ className, size }: { className?: string, size?: number }) => (
  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className={className}>
    <Zap size={size} />
  </motion.div>
);

// =====================================================================
// BASE DE DATOS DE REPORTES PROFUNDOS (MASTER INTELLIGENCE)
// =====================================================================
const MASTER_NEWS: Record<string, any> = {
  'openai-ipo-breaking': {
    id: 'openai-ipo-breaking',
    title: "OpenAI: El Camino Secreto hacia la salida a Bolsa (IPO) de $900B",
    category: "BIG TECH",
    author: "Julhianno Garcia",
    date: "28 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    isLocked: true,
    impact: "EXTREMO",
    url: "https://openai.com",
    source: "San Francisco Chronicle",
    content: "En un movimiento que redefine la estructura del capital tecnológico mundial, OpenAI ha iniciado conversaciones preliminares y confidenciales con reguladores de la SEC para una posible Oferta Pública Inicial (IPO). Según fuentes internas del ecosistema HAWKIN, la valoración proyectada rozaría los $900,000 millones de dólares."
  },
  'karpathy-anthropic': {
    id: 'karpathy-anthropic',
    title: "Andrej Karpathy y la Fuga de Cerebros: El Pulso por la AGI",
    category: "CEO RADAR",
    author: "HAWKIN Intel",
    date: "28 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    isLocked: true,
    impact: "ALTO",
    url: "https://anthropic.com",
    source: "Bloomberg Tech",
    content: "La industria de la Inteligencia Artificial está presenciando el mayor trasvase de talento de la década. Andrej Karpathy, arquitecto fundamental de la visión de Tesla y OpenAI, ha sido detectado en reuniones de alto nivel con Anthropic."
  },
  'eje-ia-cumbre-trump': {
    id: 'eje-ia-cumbre-trump',
    title: "Cumbre de la IA 2026: La Nueva Geopolítica del Silicio",
    category: "GLOBAL",
    author: "Julhianno Garcia",
    date: "27 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1200",
    isLocked: false,
    impact: "MODERADO",
    url: "https://reuters.com",
    source: "Reuters Intel",
    content: "Los líderes de las 20 economías más grandes del mundo se han reunido en una cumbre de emergencia para discutir la 'Soberanía Computacional'."
  }
};

export default function NewsDetailContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);

  // Lógica de Paywall: Si no es socio, disparar a los 8 segundos
  useEffect(() => {
    if (article?.isLocked && !session) {
      const timer = setTimeout(() => {
        setShowPaywall(true);
      }, 8000); // 8 segundos de "gracia"
      return () => clearTimeout(timer);
    }
  }, [article, session]);

  useEffect(() => {
    const fetchArticle = async () => {
      const id = params?.id as string;
      if (!id) return;

      try {
        const resGeo = await fetch('/api/geo');
        const dataGeo = await resGeo.json();
        setGeoData(dataGeo);

        if (MASTER_NEWS[id]) {
          setArticle(MASTER_NEWS[id]);
          setLoading(false);
          return;
        }

        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || []), ...(data.hardware || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        if (found) {
          setArticle(found);
        } else {
          // Intentar buscar en Master Intel
          const resIntel = await fetch('/api/news/master-intel');
          const dataIntel = await resIntel.json();
          const intelNews = dataIntel.topNews || [];
          const foundIntel = intelNews.find((n: any) => n.id === id);
          setArticle(foundIntel || MASTER_NEWS['openai-ipo-breaking']);
        }
      } catch (e) {
        setArticle(MASTER_NEWS['openai-ipo-breaking']);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    // Mock initial data
    setLikes(Math.floor(Math.random() * 500) + 100);
    setDislikes(Math.floor(Math.random() * 50));
    setComments([
      { id: 1, user: "Socio Alpha", text: "Excelente análisis. La IPO de OpenAI cambiará todo el mercado.", date: "Hace 2 horas" },
      { id: 2, user: "CyberTrader", text: "Me interesa ver cómo reacciona NVIDIA ante esto.", date: "Hace 1 hora" }
    ]);
  }, [params]);

  const handleVote = (type: 'like' | 'dislike') => {
    if (!session) { setShowPaywall(true); return; }
    if (userVote === type) {
      setUserVote(null);
      if (type === 'like') setLikes(l => l - 1);
      else setDislikes(d => d - 1);
    } else {
      if (userVote) {
        if (userVote === 'like') setLikes(l => l - 1);
        else setDislikes(d => d - 1);
      }
      setUserVote(type);
      if (type === 'like') setLikes(l => l + 1);
      else setDislikes(d => d + 1);
    }
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { setShowPaywall(true); return; }
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      user: session.user?.name || "Socio",
      text: newComment,
      date: "Ahora"
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  if (loading || !article) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center">
      <CustomLoader className="animate-spin text-cyan-500" size={40} />
      <p className="text-cyan-400 font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Sincronizando Archivos de Inteligencia...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">
      <Header />
      
      {/* Paywall Flotante */}
      <AnimatePresence>
        {showPaywall && (
          <Paywall price={geoData?.currencySymbol ? `${geoData.currencySymbol} ${geoData.monthlyPrice}` : "S/ 8.00"} />
        )}
      </AnimatePresence>

      <div className={`max-w-4xl mx-auto px-6 pt-40 pb-32 transition-all duration-1000 ${showPaywall ? 'blur-xl pointer-events-none' : ''}`}>
        <button onClick={() => router.back()} className="flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-16 text-[9px] font-black uppercase tracking-widest group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Radar Global
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          
          <header className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
               <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full border ${article.category?.includes('SHIELD') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
                 {article.category || 'RADAR'}
               </span>
               <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <Zap size={12} className="text-yellow-500" />
                  <span className="text-[9px] font-black uppercase text-gray-400">Impacto: {article.impact || 'ANÁLISIS'}</span>
               </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic text-white">
              {article.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-y border-white/5">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                     <Target size={20} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Reporte de Inteligencia</p>
                     <p className="text-xs font-bold text-white uppercase">{article.author || 'HAWKIN Intel'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={10} /> Fecha y Hora Sincronizada
                     </p>
                     <p className="text-xs font-bold text-white uppercase">{article.date || 'Hoy'}</p>
                  </div>
                  <div className="flex gap-3">
                     <button 
                        onClick={handleShare}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group relative"
                      >
                        <Share2 size={18} className="text-gray-400 group-hover:text-cyan-400" />
                        <AnimatePresence>
                          {showShareToast && (
                            <motion.span 
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -40 }} exit={{ opacity: 0 }}
                              className="absolute left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[8px] font-black px-2 py-1 rounded-md whitespace-nowrap"
                            >
                              ENLACE COPIADO
                            </motion.span>
                          )}
                        </AnimatePresence>
                     </button>
                     <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"><Bookmark size={18} className="text-gray-400" /></button>
                  </div>
               </div>
            </div>
          </header>

          <div className="w-full aspect-video rounded-[60px] overflow-hidden border border-white/10 shadow-2xl relative group bg-gray-900">
            <img 
              src={article.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"} 
              className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" 
              alt="Intel Image" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
             <div className="lg:col-span-8 space-y-12">
                <div className="text-xl md:text-2xl leading-relaxed text-gray-400 font-light space-y-6">
                   {typeof article.content === 'string' ? (
                      article.content.split('\n').map((line: string, i: number) => (
                        <p key={i}>{line}</p>
                      ))
                   ) : (
                      <p>{article.excerpt || article.summary || "Analizando el impacto de este desarrollo..."}</p>
                   )}
                </div>

                {article.url && (
                  <div className="pt-8">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
                    >
                      <Globe size={14} className="group-hover:rotate-12 transition-transform" />
                      Fuente: {article.source || 'Ver Artículo Original'}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-8 py-10 border-y border-white/5">
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleVote('like')}
                        className={`p-4 rounded-2xl transition-all flex items-center gap-3 ${userVote === 'like' ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                      >
                        <ThumbsUp size={20} className={userVote === 'like' ? 'fill-black' : ''} />
                        <span className="text-sm font-black">{likes}</span>
                      </button>
                      <button 
                        onClick={() => handleVote('dislike')}
                        className={`p-4 rounded-2xl transition-all flex items-center gap-3 ${userVote === 'dislike' ? 'bg-red-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                      >
                        <ThumbsDown size={20} className={userVote === 'dislike' ? 'fill-black' : ''} />
                        <span className="text-sm font-black">{dislikes}</span>
                      </button>
                   </div>
                   <div className="h-10 w-px bg-white/5 hidden md:block" />
                   <div className="flex items-center gap-3 text-gray-500">
                      <MessageCircle size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">{comments.length} Comentarios</span>
                   </div>
                </div>

                <div className="space-y-12">
                   <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Debate Alpha</h3>
                   
                   <form onSubmit={handleAddComment} className="space-y-4">
                      <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu análisis o perspectiva..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-gray-300 focus:border-cyan-500 outline-none transition-all min-h-[120px]"
                      />
                      <button type="submit" className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-black rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/10">
                        Enviar Comentario
                      </button>
                   </form>

                   <div className="space-y-6">
                      {comments.map((c) => (
                        <div key={c.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">
                                    <User size={16} />
                                 </div>
                                 <span className="text-[10px] font-black uppercase text-white">{c.user}</span>
                              </div>
                              <span className="text-[9px] font-bold text-gray-600 uppercase">{c.date}</span>
                           </div>
                           <p className="text-sm text-gray-400 leading-relaxed">{c.text}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-20 border-t border-white/5">
                   <AdSpace isPremium={!!session} type="inline" />
                </div>
             </div>

             <aside className="lg:col-span-4 space-y-8">
                <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6 shadow-xl">
                   <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                      <TrendingUp size={14} /> Datos Críticos
                   </h4>
                   <div className="space-y-4">
                      {[
                         { label: 'Market Sentiment', val: 'Bullish' },
                         { label: 'IA Trust Score', val: '98.2%' },
                         { label: 'Soberanía Digital', val: 'Alta' }
                      ].map((d, i) => (
                         <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                            <span className="text-[9px] font-bold text-gray-600 uppercase">{d.label}</span>
                            <span className="text-[9px] font-black text-white uppercase">{d.val}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </aside>
          </div>
        </motion.div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
