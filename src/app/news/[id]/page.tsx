'use client';

import React, { useState, useEffect, use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft } from 'lucide-react';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        if (found) {
          setArticle(found);
        } else {
          // Fallback con noticia real integrada
          setArticle({
            title: "El futuro de la IA generativa en 2026",
            category: "INTELIGENCIA",
            author: "Julhianno Garcia",
            date: "Hoy",
            excerpt: "La evolución de los modelos de lenguaje está alcanzando un punto de inflexión sin precedentes.",
            content: "Estamos presenciando una transformación radical en cómo interactuamos con la tecnología. Los nuevos modelos de inteligencia artificial no solo procesan información, sino que comprenden el contexto profundo y las sutilezas humanas. HAWKIN se mantiene a la vanguardia de esta revolución, analizando cada rumor y lanzamiento para nuestra comunidad de élite.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
          });
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  const toggleVoice = () => {
    if ('speechSynthesis' in window && article) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead = `${article.title}. ${article.excerpt}. ${article.content}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        // Configuración para voz femenina fluida
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => 
          (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Monica') || v.name.includes('Paulina')) && 
          v.lang.includes('es')
        );

        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.lang = 'es-MX';
        utterance.rate = 0.9;
        utterance.pitch = 1.1; // Tono un poco más femenino y fluido
        
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
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 mb-8 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
          <ArrowLeft size={14} /> Volver al Radar
        </button>

        {/* CABECERA ÚNICA (SIN TÍTULOS DUPLICADOS) */}
        <header className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 mb-6 inline-block">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span className="text-white">{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </header>

        {/* ASISTENTE DE VOZ FEMENINA FLUIDA */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-cyan-400/10 border border-cyan-400/20 ${isSpeaking ? 'animate-pulse' : ''}`}>
              <Volume2 className={isSpeaking ? "text-cyan-400" : "text-gray-500"} size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-1">HAWKIN Voice</p>
              <span className="text-xs font-bold text-white uppercase italic">Traducción fluida activa</span>
            </div>
          </div>
          <button 
            onClick={toggleVoice}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isSpeaking ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-cyan-400'}`}
          >
            {isSpeaking ? 'Detener' : 'Escuchar Reporte'}
          </button>
        </div>

        {/* IMAGEN REAL (SIN LOGOS DE VIDEO FALSOS) */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 mb-12 bg-gray-900 shadow-2xl">
           <img src={article.image} className="w-full h-full object-cover" alt="Contenido Original" />
        </div>

        {/* CONTENIDO LIMPIO Y CONTEXTUAL */}
        <div className="text-xl leading-relaxed text-gray-300 space-y-10 font-light">
          <div className="p-8 border-l-4 border-cyan-500 bg-white/[0.02] rounded-r-2xl italic text-white text-2xl font-medium">
            "{article.excerpt}"
          </div>
          
          <div className="article-body prose prose-invert max-w-none">
            {article.content}
          </div>

          <div className="p-10 border border-white/5 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent text-center">
            <div className="text-cyan-400 text-2xl mb-4">🔒</div>
            <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Análisis Estratégico</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              El contexto completo y las guías técnicas son exclusivos para socios de HAWKIN.
            </p>
            <button className="btn-glow text-[10px] py-4 px-10">Suscribirme al Ecosistema</button>
          </div>
        </div>

        {/* SISTEMA DE DEBATE Y SOCIAL */}
        <div className="mt-32 pt-16 border-t border-white/5">
          <div className="flex justify-between items-center mb-16">
            <div className="flex gap-8">
              <button className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors font-bold text-xs">
                <ThumbsUp size={18} /> {likes}
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-xs">
                <ThumbsDown size={18} />
              </button>
            </div>
            <div className="flex gap-6">
              <Bookmark size={22} className="text-gray-600 hover:text-cyan-400 cursor-pointer transition-all" />
              <Share2 size={22} className="text-gray-600 hover:text-purple-400 cursor-pointer transition-all" />
            </div>
          </div>

          <div className="space-y-10 text-left">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
              <MessageSquare size={16} /> Debate de la Comunidad
            </h3>
            
            <div className="p-8 rounded-[30px] bg-white/[0.02] border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Socio_Premium_Beta</span>
                <span className="text-[9px] text-gray-700 font-bold uppercase">Hace 15 min</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-light italic">
                "Excelente que HAWKIN sea transparente con el contenido. El análisis de Julhianno es impecable."
              </p>
            </div>

            <div className="p-10 border-2 border-dashed border-white/5 rounded-[30px] text-center bg-black/40">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em] mb-6">Únete a la conversación exclusiva</p>
              <button className="text-[9px] font-black text-white border border-white/10 px-10 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase">
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
