'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  // NOTICIA DE RESPALDO (BACKUP) SIEMPRE REAL
  const BACKUP: any = {
    title: "Análisis HAWKIN: El Futuro de la IA Global",
    category: "INTELIGENCIA",
    author: "Julhianno Garcia",
    date: "Actualizado ahora",
    excerpt: "Sincronizando los últimos movimientos de la industria para nuestra comunidad.",
    content: "Estamos analizando profundamente los cambios en los algoritmos de razonamiento lógico. Como socio de HAWKIN, tu acceso a esta información garantiza una ventaja competitiva en el mercado tecnológico actual. Seguimos vigilando cada rumor de los fundadores para traerte la verdad.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
  };

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        setArticle(found || BACKUP);
        setLoading(false);
      } catch (e) {
        console.error("Fetch error", e);
        setArticle(BACKUP);
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const toggleVoice = () => {
    if ('speechSynthesis' in window && article) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel(); // Limpiar colas
        const text = `${article.title}. Análisis de Julhianno Garcia. ${article.excerpt}. ${article.content}`;
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Intentar voz femenina
        const voices = window.speechSynthesis.getVoices();
        const female = voices.find(v => (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Paulina')) && v.lang.includes('es'));
        if (female) utterance.voice = female;
        
        utterance.lang = 'es-MX';
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyAlert(true);
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
      <p className="text-cyan-400 font-black tracking-widest uppercase text-xs">Cargando Inteligencia...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <article className="max-w-3xl mx-auto px-6 pt-32 pb-32">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors mb-12 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Volver al Radar
        </button>

        <header className="mb-12">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${article.category === 'SHIELD' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
            {article.category}
          </span>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mt-8 mb-8">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span className="text-white border-b border-cyan-500/30">{article.author}</span>
            <span>{article.date}</span>
          </div>
        </header>

        {/* ASISTENTE DE VOZ */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${isSpeaking ? 'animate-pulse border-cyan-400' : ''}`}>
              <Volume2 className={isSpeaking ? 'text-cyan-400' : 'text-gray-500'} size={24} />
            </div>
            <div>
              <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Asistente HAWKIN</p>
              <h4 className="text-sm font-bold text-white uppercase italic">Traducción de voz fluida</h4>
            </div>
          </div>
          <button 
            onClick={toggleVoice}
            className={`px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${isSpeaking ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-cyan-400'}`}
          >
            {isSpeaking ? 'DETENER VOZ' : 'ESCUCHAR REPORTE'}
          </button>
        </div>

        {/* IMAGEN REAL */}
        <div className="w-full aspect-video rounded-[40px] overflow-hidden border border-white/10 mb-12 shadow-2xl bg-gray-900">
          <img src={article.image} className="w-full h-full object-cover" alt="News Image" />
        </div>

        {/* CONTENIDO */}
        <div className="text-xl leading-relaxed text-gray-300 space-y-10 font-light">
          <p className="text-white font-medium text-2xl border-l-4 border-cyan-500 pl-6 py-2 italic">
            "{article.excerpt}"
          </p>
          <p>{article.content}</p>
          
          <div className="glass-card border-white/5 p-12 text-center bg-gradient-to-b from-white/[0.02] to-transparent rounded-[40px]">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-4">🔒 Análisis Protegido</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">
              El análisis profundo y los manuales técnicos son exclusivos para socios élite.
            </p>
            <button className="btn-glow text-[10px] w-full max-w-xs py-4">Suscribirme por $8/mes</button>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-10">
            <button onClick={() => setLikes(l => l+1)} className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-cyan-400 transition-all active:scale-125">
              <ThumbsUp size={20} /> {likes}
            </button>
            <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-red-500 transition-all">
              <ThumbsDown size={20} />
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={copyLink}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 border border-purple-400/30 px-8 py-4 rounded-full hover:bg-purple-400 hover:text-white transition-all shadow-xl"
            >
              <Share2 size={16} /> Compartir
            </button>
            {showCopyAlert && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-black px-4 py-2 rounded-full animate-bounce">
                LINK COPIADO
              </div>
            )}
          </div>
        </div>

        {/* COMENTARIOS */}
        <div className="mt-20 space-y-10 text-left">
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-3">
             <MessageSquare size={16} /> Debate de la Comunidad
           </h3>
           <div className="p-8 rounded-[30px] bg-white/[0.01] border border-white/5 italic text-gray-500 text-sm font-light">
             "HAWKIN es la única fuente transparente. El análisis es excelente." - Socio_101
           </div>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
