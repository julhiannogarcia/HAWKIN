'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [lang, setLang] = useState('es-ES');
  const [showShareTooltip, setShowShareShareTooltip] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...data.news, ...data.shield];
        // Buscamos la noticia exacta usando el ID único
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

  const handleShare = () => {
    const url = window.location.href;
    const text = `Mira esta noticia en HAWKIN: ${article.title}`;
    
    if (navigator.share) {
      navigator.share({ title: 'HAWKIN News', text, url });
    } else {
      navigator.clipboard.writeText(url);
      setShowShareShareTooltip(true);
      setTimeout(() => setShowShareShareTooltip(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-black tracking-widest animate-pulse italic text-2xl uppercase">Conectando con la Red HAWKIN...</div>;
  if (!article) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-black text-xl uppercase">Error: Noticia fuera de cobertura</div>;

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded ${article.category === 'SHIELD' ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.3)]'}`}>
              {article.category === 'SHIELD' && <ShieldAlert size={10} className="inline mr-2" />}
              {article.category}
            </span>
            <button 
              onClick={() => {
                setIsSaved(!isSaved);
                // Simulamos guardado en localStorage
                localStorage.setItem(`saved_${article.id}`, String(!isSaved));
              }} 
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:text-cyan-400 transition-all group"
            >
              {isSaved ? <BookmarkCheck size={20} className="text-cyan-400" /> : <Bookmark size={20} className="group-hover:scale-110 transition-transform" />}
            </button>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span className="text-white bg-white/5 px-3 py-1 rounded border border-white/10">{article.author}</span>
            <span className="text-cyan-500 font-black">{article.date}</span>
          </div>
        </header>

        {/* Multimedia Principal - VIDEO REAL SIMULADO */}
        <div className="relative w-full aspect-video rounded-[40px] overflow-hidden border border-white/10 mb-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] group">
           {article.hasVideo ? (
             <iframe 
               className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
               src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ" 
               title="IA Content"
               allow="autoplay; encrypted-media"
             ></iframe>
           ) : (
             <img src={article.image} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[3s]" alt="News" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
           <div className="absolute bottom-8 left-10 flex items-center gap-3">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              <span className="bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                {article.hasVideo ? 'Transmisión de Inteligencia Activa' : 'Captura Original de la Fuente'}
              </span>
           </div>
        </div>

        {/* Resumen IA */}
        <div className="p-10 rounded-[35px] bg-white/[0.03] border border-white/10 mb-16 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)]" />
          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-4 block">✨ HAWKIN VOICE v2.0 (REGIONAL)</span>
          <p className="text-xl text-gray-300 italic leading-relaxed mb-8 font-light">
            "{article.excerpt}"
          </p>
          <button onClick={speakSummary} className="btn-glow flex items-center gap-3 text-[10px] py-4 px-8 shadow-[0_0_30px_rgba(0,242,255,0.3)]">
            <Play size={14} fill="white" /> ESCUCHAR ANÁLISIS POR IA
          </button>
        </div>

        <div className="space-y-8 text-xl leading-relaxed text-gray-400 font-light">
          <p>
            En un reporte histórico verificado por el ecosistema <b>{article.author}</b>, la frontera de la inteligencia se ha desplazado hoy. Este hito, registrado {article.date}, no solo representa un avance técnico, sino un cambio en la soberanía digital global.
          </p>
          
          <div className="glass-card border-cyan-500/20 p-12 text-center my-20 bg-gradient-to-b from-white/5 to-transparent rounded-[40px]">
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <Lock size={30} className="text-cyan-400" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white italic">Análisis Bloqueado</h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
              El manual paso a paso de protección y el análisis profundo de <b>Julhianno Garcia</b> son exclusivos para la élite de HAWKIN.
            </p>
            <button className="btn-glow text-[10px] w-full max-w-xs py-5">DESBLOQUEAR ECOSISTEMA • $8/MES</button>
          </div>
        </div>

        {/* SISTEMA SOCIAL REAL */}
        <div className="mt-40 pt-16 border-t border-white/5 space-y-16">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex gap-10">
                <button onClick={() => setLikes(l => l+1)} className="flex items-center gap-3 text-sm font-black text-gray-500 hover:text-cyan-400 transition-all active:scale-125">
                  <ThumbsUp size={24} /> {likes}
                </button>
                <button className="flex items-center gap-3 text-sm font-black text-gray-500 hover:text-red-500 transition-all active:scale-125">
                  <ThumbsDown size={24} />
                </button>
              </div>
              <div className="relative">
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 border border-purple-400/30 px-8 py-4 rounded-full hover:bg-purple-400 hover:text-white transition-all shadow-[0_0_20px_rgba(188,19,254,0.1)]"
                >
                  <Share2 size={18} /> Compartir en Redes
                </button>
                {showShareTooltip && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-black px-4 py-2 rounded-full whitespace-nowrap animate-bounce flex items-center gap-2">
                    <CheckCircle2 size={12} /> LINK COPIADO AL PORTAPAPELES
                  </div>
                )}
              </div>
           </div>

           {/* Comentarios */}
           <div className="space-y-12">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-4">
                <MessageSquare size={18} className="text-cyan-400" /> Debate de la Comunidad HAWKIN
              </h4>
              
              <div className="p-10 rounded-[40px] bg-white/[0.01] border border-white/5 space-y-6 relative overflow-hidden group hover:border-cyan-500/20 transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-black text-black text-[10px]">SP</div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Socio_Premium_Alpha</span>
                  </div>
                  <span className="text-[9px] text-gray-700 font-bold uppercase">Hace 12 min</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-light italic border-l-2 border-cyan-500/30 pl-6">
                  "Esta es la información que los medios tradicionales ocultan. Gracias Julhianno por traernos la verdad técnica a tiempo."
                </p>
              </div>

              <div className="p-12 rounded-[40px] border border-dashed border-white/5 text-center bg-black/40">
                <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em] mb-6">¿Tienes una perspectiva diferente?</p>
                <button className="text-[9px] font-black text-white border border-white/10 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                  Inicia Sesión para Comentar
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
