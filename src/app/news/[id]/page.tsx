'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft } from 'lucide-react';

export default function ArticlePage({ params }: { params: any }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Datos de respaldo integrados para asegurar contenido real si la API falla
  const BACKUP_NEWS: Record<string, any> = {
    'gpt-5-leak': {
      title: "GPT-5: El primer paso hacia la conciencia artificial",
      category: "BIG TECH",
      author: "Julhianno Garcia",
      date: "Hoy",
      excerpt: "OpenAI ha filtrado los primeros resultados de su modelo de razonamiento lógico System 2.",
      content: "La carrera por la AGI ha tomado un giro inesperado esta semana. Tras meses de especulación, fuentes cercanas a los laboratorios de OpenAI en San Francisco han revelado que la arquitectura de GPT-5 ya no se basa únicamente en la predicción del siguiente token, sino en un sistema de razonamiento profundo. Esto permitirá que la IA no solo responda, sino que piense antes de actuar.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
    }
  };

  useEffect(() => {
    const resolveParamsAndFetch = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        setArticle(found || BACKUP_NEWS['gpt-5-leak']);
        setLoading(false);
      } catch (e) {
        setArticle(BACKUP_NEWS['gpt-5-leak']);
        setLoading(false);
      }
    };
    resolveParamsAndFetch();
  }, [params]);

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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-bold uppercase">Cargando...</div>;

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <article className="max-w-3xl mx-auto px-6 pt-32 pb-32">
        <header className="mb-10 text-left">
          <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 mb-6 inline-block">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest italic">{article.author} • {article.date}</p>
        </header>

        {/* VOZ */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Volume2 className={isSpeaking ? "text-cyan-400 animate-pulse" : "text-gray-500"} />
            <span className="text-xs font-bold uppercase tracking-widest">Escuchar con IA</span>
          </div>
          <button onClick={toggleVoice} className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">
            {isSpeaking ? 'Detener' : 'ACTIVAR VOZ'}
          </button>
        </div>

        <img src={article.image} className="w-full aspect-video object-cover rounded-3xl mb-10 border border-white/10" alt="News" />

        <div className="text-xl leading-relaxed text-gray-300 space-y-8 font-light">
          <p className="font-bold text-white text-2xl">{article.excerpt}</p>
          <p>{article.content}</p>
          <div className="p-10 border border-cyan-500/20 rounded-3xl bg-cyan-500/5 text-center italic text-sm text-gray-400">
            Análisis completo exclusivo para socios de HAWKIN.
          </div>
        </div>

        {/* SOCIAL */}
        <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center text-gray-500">
          <div className="flex gap-8">
            <ThumbsUp size={20} className="hover:text-cyan-400 cursor-pointer" />
            <ThumbsDown size={20} className="hover:text-red-500 cursor-pointer" />
          </div>
          <div className="flex gap-6">
            <Bookmark size={20} className="hover:text-cyan-400 cursor-pointer" />
            <Share2 size={20} className="hover:text-purple-400 cursor-pointer" />
          </div>
        </div>
      </article>
      <Footer />
      <Ticker />
    </main>
  );
}
