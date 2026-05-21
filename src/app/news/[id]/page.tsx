'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Play, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

// BASE DE DATOS DE RESPALDO (NOTICIAS MAESTRAS)
const MASTER_NEWS: Record<string, any> = {
  'gpt-5-leak': {
    id: 'gpt-5-leak',
    title: "OpenAI GPT-5: Filtraciones sobre la nueva arquitectura",
    category: "BIG TECH",
    excerpt: "Análisis profundo sobre el razonamiento System 2 y la memoria persistente.",
    content: "La carrera por la AGI ha tomado un giro inesperado esta semana. Tras meses de especulación, fuentes cercanas a los laboratorios de OpenAI en San Francisco han revelado que la arquitectura de GPT-5 ya no se basa únicamente en la predicción del siguiente token, sino en un sistema de 'System 2 Thinking'.",
    isLocked: true,
    author: "Julhianno Garcia",
    date: "19 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    hasVideo: true
  },
  'nvidia-record': {
    id: 'nvidia-record',
    title: "NVIDIA alcanza valoración récord gracias a nuevos chips",
    category: "MERCADO",
    excerpt: "La demanda de infraestructura para IA no tiene precedentes, posicionando a la empresa como el motor del mundo.",
    content: "Nvidia continúa su dominio en el mercado de hardware para IA. Sus últimos resultados financieros superaron las expectativas de Wall Street, impulsados por una demanda masiva de sus chips especializados.",
    isLocked: false,
    author: "Julhianno Garcia",
    date: "19 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200",
    hasVideo: false
  }
};

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 1. Buscamos primero en la base de datos maestra (estática)
        if (MASTER_NEWS[id]) {
          setArticle(MASTER_NEWS[id]);
          setLoading(false);
          return;
        }

        // 2. Si no está en la maestra, buscamos en el radar en vivo
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        if (found) {
          setArticle(found);
        }
        setLoading(false);
      } catch (e) {
        console.error("Error cargando artículo:", e);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleShare = () => {
    const url = window.location.href;
    const text = `Análisis HAWKIN: ${article?.title}`;
    
    if (navigator.share) {
      navigator.share({ title: 'HAWKIN Intelligence', text, url })
        .catch(() => {
          navigator.clipboard.writeText(url);
          setShowShareTooltip(true);
          setTimeout(() => setShowShareTooltip(false), 2000);
        });
    } else {
      navigator.clipboard.writeText(url);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-black tracking-widest animate-pulse uppercase">Conectando con la Red HAWKIN...</div>;
  
  if (!article) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="text-red-500 mb-6" size={60} />
      <h1 className="text-2xl font-black uppercase text-white mb-4">Noticia Fuera de Cobertura</h1>
      <p className="text-gray-500 max-w-sm mb-10">El sistema de inteligencia no ha podido localizar este ID en el radar actual.</p>
      <a href="/" className="btn-glow text-[10px]">Volver al Radar Global</a>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border ${article.category === 'SHIELD' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
              {article.category}
            </span>
            <button 
              onClick={() => setIsSaved(!isSaved)} 
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:text-cyan-400 transition-all"
            >
              {isSaved ? <BookmarkCheck size={24} className="text-cyan-400" /> : <Bookmark size={24} />}
            </button>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span className="text-white border-b border-cyan-500/30 pb-1">{article.author}</span>
            <span>{article.date}</span>
          </div>
        </header>

        {/* Multimedia - VIDEO REAL SI DISPONIBLE */}
        <div className="relative w-full aspect-video rounded-[40px] overflow-hidden border border-white/10 mb-12 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
           {article.hasVideo ? (
             <iframe 
               className="w-full h-full opacity-70"
               src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ" 
               allow="autoplay; encrypted-media"
             ></iframe>
           ) : (
             <img src={article.image} className="w-full h-full object-cover opacity-50" alt="News" />
           )}
           <div className="absolute bottom-8 left-10 flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">HAWKIN STREAMING ACTIVE</span>
           </div>
        </div>

        <div className="space-y-12 text-xl leading-relaxed text-gray-300 font-light">
          <p>{article.content}</p>
          
          {article.isLocked && (
            <div className="glass-card border-cyan-500/20 p-12 text-center rounded-[40px]">
              <Lock size={40} className="text-cyan-400 mx-auto mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white italic">Análisis Protegido</h3>
              <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">Esta investigación es exclusiva para socios. Desbloquea el conocimiento por $8/mes.</p>
              <button className="btn-glow text-[10px] w-full max-w-xs py-5">SUSCRIBIRME AL ECOSISTEMA</button>
            </div>
          )}
        </div>

        {/* Sistema Social */}
        <div className="mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex gap-10">
              <button onClick={() => setLikes(l => l+1)} className="flex items-center gap-3 text-sm font-black text-gray-500 hover:text-cyan-400 transition-all">
                <ThumbsUp size={24} /> {likes}
              </button>
              <button className="flex items-center gap-3 text-sm font-black text-gray-500 hover:text-red-500 transition-all">
                <ThumbsDown size={24} />
              </button>
           </div>
           <div className="relative">
              <button 
                onClick={handleShare}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 border border-purple-400/30 px-8 py-4 rounded-full hover:bg-purple-400 hover:text-white transition-all shadow-[0_0_20px_rgba(188,19,254,0.1)]"
              >
                <Share2 size={18} /> Compartir Análisis
              </button>
              {showShareTooltip && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-black px-4 py-2 rounded-full flex items-center gap-2 animate-bounce">
                  <CheckCircle2 size={12} /> LINK COPIADO
                </div>
              )}
           </div>
        </div>

        {/* Comentarios */}
        <div className="mt-20 space-y-8">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-3">
             <MessageSquare size={16} /> Debate de la Comunidad
           </h4>
           <div className="p-10 rounded-[30px] bg-white/[0.01] border border-white/5">
             <p className="text-gray-500 text-sm font-light italic">"HAWKIN es la única fuente que realmente profundiza en estos temas." - Socio_Premium</p>
           </div>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
