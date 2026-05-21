'use client';

import React, { use, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        if (found) {
          setArticle(found);
        } else {
          // Fallback estable si no se encuentra
          setArticle({
            title: "Actualización de Inteligencia HAWKIN",
            category: "GLOBAL",
            author: "Julhianno Garcia",
            date: "Reciente",
            excerpt: "Sincronizando los últimos datos del radar para este análisis.",
            content: "Nuestros sistemas están procesando la información en tiempo real para ofrecerte el análisis más preciso. La soberanía tecnológica es nuestra prioridad.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
          });
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    loadContent();
  }, [id]);

  const toggleVoice = () => {
    if ('speechSynthesis' in window && article) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const text = `${article.title}. ${article.excerpt}. ${article.content}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX';
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-bold uppercase tracking-widest">Sincronizando...</div>;
  if (!article) return <div className="min-h-screen bg-black text-red-500 p-10">Error de enlace. Por favor regresa al inicio.</div>;

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <article className="max-w-3xl mx-auto px-6 pt-32 pb-32">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 mb-8 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={14} /> Volver
        </button>

        <header className="mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 mb-6 inline-block">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
            {article.title}
          </h1>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {article.author} • {article.date}
          </div>
        </header>

        {/* ASISTENTE DE VOZ SIMPLE */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Volume2 className={isSpeaking ? "text-cyan-400 animate-pulse" : "text-gray-500"} />
            <span className="text-xs font-bold uppercase tracking-widest">Asistente de Voz HAWKIN</span>
          </div>
          <button 
            onClick={toggleVoice}
            className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all"
          >
            {isSpeaking ? 'Detener' : 'Escuchar Noticia'}
          </button>
        </div>

        {/* IMAGEN REAL */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 mb-10 bg-gray-900">
           <img src={article.image} className="w-full h-full object-cover" alt="Noticia" />
        </div>

        {/* CONTENIDO TEXTUAL */}
        <div className="text-lg leading-relaxed text-gray-300 space-y-6">
          <p className="font-bold text-white">{article.excerpt}</p>
          <p>{article.content}</p>
          
          <div className="p-10 border border-cyan-500/20 rounded-3xl bg-cyan-500/5 text-center italic text-sm text-gray-400">
            "Este análisis detallado continúa para socios de HAWKIN. Suscríbete para desbloquear el manual paso a paso."
          </div>
        </div>

        {/* INTERACCIONES */}
        <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
          <div className="flex gap-8">
            <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 font-bold text-xs"><ThumbsUp size={18} /> {likes}</button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold text-xs"><ThumbsDown size={18} /></button>
          </div>
          <div className="flex gap-6">
            <Bookmark size={20} className="text-gray-500 cursor-pointer" />
            <Share2 size={20} className="text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* COMENTARIOS */}
        <div className="mt-16 space-y-6 text-left">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2">
             <MessageSquare size={14} /> Debate de la Comunidad
           </h3>
           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-sm text-gray-400 italic">
             "Increíble actualización. HAWKIN siempre adelante." - Socio_Premium
           </div>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
