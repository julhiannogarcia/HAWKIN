'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft } from 'lucide-react';

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Backup data for reliability
  const BACKUP_NEWS: Record<string, any> = {
    'gpt-5-leak': {
      title: "GPT-5: El primer paso hacia la conciencia artificial",
      category: "BIG TECH",
      author: "Julhianno Garcia",
      date: "Hoy",
      excerpt: "OpenAI ha filtrado los primeros resultados de su modelo de razonamiento lógico System 2.",
      content: "La carrera por la AGI ha tomado un giro inesperado esta semana. Tras meses de especulación, fuentes cercanas a los laboratorios de OpenAI en San Francisco han revelado que la arquitectura de GPT-5 ya no se basa únicamente en la predicción del siguiente token, sino en un sistema de razonamiento profundo.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const res = await fetch('/api/news/live');
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        setArticle(found || BACKUP_NEWS['gpt-5-leak']);
        setLoading(false);
      } catch (e) {
        console.error("Error loading article:", e);
        setArticle(BACKUP_NEWS['gpt-5-leak']);
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
        const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.excerpt}. ${article.content}`);
        utterance.lang = 'es-MX';
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-bold uppercase tracking-widest">Sincronizando...</div>;

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <article className="max-w-3xl mx-auto px-6 pt-32 pb-32">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-8 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
          <ArrowLeft size={14} /> Volver
        </button>

        {article && (
          <>
            <header className="mb-12">
              <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 mb-6 inline-block tracking-widest">
                {article.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
                {article.title}
              </h1>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {article.author} • {article.date}
              </div>
            </header>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Volume2 className={isSpeaking ? "text-cyan-400 animate-pulse" : "text-gray-500"} size={20} />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Asistente HAWKIN Voice</span>
              </div>
              <button 
                onClick={toggleVoice}
                className="px-8 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all"
              >
                {isSpeaking ? 'Detener' : 'Escuchar'}
              </button>
            </div>

            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
              <img src={article.image} className="w-full h-full object-cover" alt="HAWKIN Intel" />
            </div>

            <div className="text-xl leading-relaxed text-gray-300 space-y-10 font-light">
              <p className="text-white text-2xl font-medium italic border-l-4 border-cyan-500 pl-6 bg-white/[0.02] py-4 rounded-r-xl">
                "{article.excerpt}"
              </p>
              <p>{article.content}</p>
              
              <div className="p-10 border border-white/5 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent text-center">
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">🔒 Análisis Exclusivo</h3>
                <p className="text-sm text-gray-500 mb-6">El contenido completo es solo para socios.</p>
                <button className="btn-glow text-[10px] py-4 px-10">Desbloquear Ecosistema</button>
              </div>
            </div>

            <div className="mt-32 pt-16 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-8">
                <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors font-bold text-xs">
                  <ThumbsUp size={18} /> {likes}
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-xs">
                  <ThumbsDown size={18} />
                </button>
              </div>
              <div className="flex gap-6">
                <Bookmark size={22} className="text-gray-600 hover:text-cyan-400 cursor-pointer" />
                <Share2 size={22} className="text-gray-600 hover:text-purple-400 cursor-pointer" />
              </div>
            </div>
          </>
        )}
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
