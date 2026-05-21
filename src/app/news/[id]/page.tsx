'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Play, ShieldAlert } from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [lang, setLang] = useState('es-ES');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...data.news, ...data.shield];
        const found = allNews.find((n: any) => n.id === id);
        if (found) setArticle(found);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    const detectLang = async () => {
      const res = await fetch('/api/geo');
      const { countryCode } = await res.json();
      setLang(countryCode === 'US' ? 'en-US' : 'es-MX');
    };

    fetchArticle();
    detectLang();
  }, [id]);

  const speakSummary = () => {
    if ('speechSynthesis' in window && article) {
      window.speechSynthesis.cancel();
      const text = `Hola, bienvenido a HAWKIN. Noticia de ${article.author}: ${article.title}. ${article.excerpt}`;
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Female')) && v.lang.startsWith(lang.split('-')[0]));
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-black tracking-widest animate-pulse">CARGANDO INTELIGENCIA...</div>;
  if (!article) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-black">NOTICIA NO ENCONTRADA</div>;

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded ${article.category === 'SHIELD' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'}`}>
              {article.category === 'SHIELD' && <ShieldAlert size={10} className="inline mr-2" />}
              {article.category}
            </span>
            <button onClick={() => setIsSaved(!isSaved)} className="p-3 rounded-full bg-white/5 border border-white/10 hover:text-cyan-400 transition-all">
              {isSaved ? <BookmarkCheck size={20} className="text-cyan-400" /> : <Bookmark size={20} />}
            </button>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none mb-8">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span className="text-white">POR {article.author}</span>
            <span className="text-cyan-500 underline cursor-pointer">{article.date}</span>
          </div>
        </header>

        {/* Multimedia Principal */}
        <div className="relative w-full aspect-video rounded-[40px] overflow-hidden border border-white/10 mb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
           <img src={article.image} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="News" />
           {article.hasVideo && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(0,242,255,0.5)] cursor-pointer hover:scale-110 transition-all">
                  <Play fill="black" size={30} />
                </div>
             </div>
           )}
           <div className="absolute bottom-6 left-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
             Contenido Multimedia Original
           </div>
        </div>

        {/* Resumen IA con Voz Regional */}
        <div className="p-10 rounded-[30px] bg-gradient-to-br from-cyan-500/5 to-purple-600/5 border border-white/10 mb-16 relative overflow-hidden">
          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-4 block">✨ HAWKIN VOICE (INTELIGENCIA REGIONAL)</span>
          <p className="text-xl text-gray-300 italic leading-relaxed mb-8">
            "{article.excerpt}"
          </p>
          <button onClick={speakSummary} className="btn-glow flex items-center gap-3 text-[10px]">
            <Play size={14} fill="white" /> ESCUCHAR ANÁLISIS EN VIVO
          </button>
        </div>

        {/* Cuerpo del Artículo */}
        <div className="space-y-8 text-xl leading-relaxed text-gray-400">
          <p>
            En un avance histórico reportado por <b>{article.author}</b>, la industria tecnológica se enfrenta a un nuevo paradigma. Este acontecimiento, registrado {article.date}, marca un antes y un después en la soberanía digital.
          </p>
          
          <div className="glass-card border-cyan-500/20 p-10 text-center my-12">
            <span className="text-3xl block mb-6">🔒</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Análisis Bloqueado</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Para leer el manual paso a paso de protección y el análisis profundo de Julhianno Garcia, necesitas una suscripción activa.
            </p>
            <button className="btn-glow text-[10px] w-full max-w-xs">DESBLOQUEAR POR $8/MES</button>
          </div>
        </div>

        {/* Sistema Social */}
        <div className="mt-32 pt-12 border-t border-white/5 space-y-12">
           <div className="flex justify-between items-center">
              <div className="flex gap-8">
                <button onClick={() => setLikes(l => l+1)} className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-cyan-400 transition-colors">
                  <ThumbsUp size={20} /> {likes}
                </button>
                <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-red-500 transition-colors">
                  <ThumbsDown size={20} />
                </button>
              </div>
              <button className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-purple-400 hover:text-white transition-all">
                <Share2 size={18} /> Compartir Análisis
              </button>
           </div>

           {/* Comentarios */}
           <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-3">
                <MessageSquare size={16} /> Debate de la Comunidad
              </h4>
              
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase">Socio_Tech_01</span>
                  <span className="text-[9px] text-gray-600 font-bold uppercase">Hace 10 min</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Este es el tipo de noticias que solo HAWKIN reporta a tiempo. Increíble el impacto que tendrá esto en el mercado global.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-dashed border-white/10 text-center">
                <p className="text-xs text-gray-600 uppercase font-black tracking-widest">Inicia sesión para participar en el debate</p>
              </div>
           </div>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
