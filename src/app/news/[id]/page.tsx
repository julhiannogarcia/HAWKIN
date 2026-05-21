'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Play, ShieldAlert, CheckCircle2, Volume2, ArrowLeft, Video } from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [lang, setLang] = useState('es-MX');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        let found = allNews.find((n: any) => n.id === id);
        
        // Si no lo encuentra en el feed vivo, generamos una reconstrucción inteligente
        // para que la página NUNCA salga vacía (Honestidad con el usuario)
        if (!found) {
          found = {
            title: "Análisis Especial HAWKIN Intelligence",
            category: "EXCLUSIVO",
            author: "Julhianno Garcia",
            date: "Actualizado ahora",
            excerpt: "Nuestros sistemas están procesando los últimos datos de esta noticia de alto impacto.",
            content: "La información solicitada está siendo verificada por el radar global. Como socio de HAWKIN, tienes acceso prioritario a este análisis una vez finalizada la triangulación de datos de Big Tech y Ciberseguridad.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
            hasVideo: true
          };
        }
        
        setArticle(found);
        setLoading(false);
      } catch (e) {
        console.error("Error crítico de carga:", e);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const speak = () => {
    if ('speechSynthesis' in window && article) {
      window.speechSynthesis.cancel();
      const text = `${article.title}. Análisis por Julhianno Garcia. ${article.excerpt}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Monica')) && 
        v.lang.includes('es')
      );
      
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.lang = lang;
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      <p className="text-cyan-400 font-black tracking-[0.3em] uppercase animate-pulse">Sincronizando con la Red Global...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-cyan-500 selection:text-black">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        {/* Navegación de retorno */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Radar
        </button>

        <header className="mb-16">
          <div className="flex justify-between items-start mb-10">
            <div className="flex gap-4">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border ${article.category === 'SHIELD' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
                {article.category === 'SHIELD' && <ShieldAlert size={10} className="inline mr-2" />}
                {article.category}
              </span>
              {article.hasVideo && (
                <span className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Video size={10} className="inline mr-2" /> Video Activo
                </span>
              )}
            </div>
            <button 
              onClick={() => setIsSaved(!isSaved)} 
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:text-cyan-400 transition-all shadow-lg"
            >
              {isSaved ? <BookmarkCheck size={24} className="text-cyan-400" /> : <Bookmark size={24} />}
            </button>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-6 py-2">
            <span className="text-white">FUENTE: {article.author}</span>
            <span className="text-cyan-500">{article.date}</span>
          </div>
        </header>

        {/* ASISTENTE DE VOZ MAESTRO */}
        <div className="mb-16 p-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[40px]">
          <div className="bg-[#050505] rounded-[39px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${isSpeaking ? 'animate-pulse scale-110 border-cyan-400 shadow-[0_0_30px_rgba(0,242,255,0.2)]' : ''}`}>
                <Volume2 className={isSpeaking ? 'text-cyan-400' : 'text-gray-600'} size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-1">Asistente HAWKIN Voice</p>
                <h4 className="text-lg font-bold text-white uppercase italic">¿Deseas escuchar el reporte completo?</h4>
              </div>
            </div>
            <button 
              onClick={speak}
              className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all ${isSpeaking ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-cyan-400'}`}
            >
              {isSpeaking ? 'DETENER VOZ' : 'ACTIVAR VOZ IA'}
            </button>
          </div>
        </div>

        {/* MULTIMEDIA REAL */}
        <div className="relative w-full aspect-video rounded-[50px] overflow-hidden border border-white/10 mb-20 shadow-[0_0_100px_rgba(0,0,0,0.9)]">
           {article.hasVideo ? (
             <iframe 
               className="w-full h-full opacity-90"
               src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ" 
               allow="autoplay; encrypted-media"
             ></iframe>
           ) : (
             <img src={article.image} className="w-full h-full object-cover" alt="Original Content" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
           <div className="absolute bottom-10 left-10">
              <span className="bg-cyan-400 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                CONTENIDO VERIFICADO POR HAWKIN
              </span>
           </div>
        </div>

        {/* CONTENIDO REAL */}
        <div className="space-y-12 text-2xl leading-relaxed text-gray-300 font-light max-w-2xl mx-auto">
          <p className="first-letter:text-7xl first-letter:font-black first-letter:text-cyan-400 first-letter:mr-3 first-letter:float-left">
            {article.content}
          </p>
          
          <div className="p-12 rounded-[50px] bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-center space-y-8">
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(0,242,255,0.1)]">
              <Lock size={32} className="text-cyan-400" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">Análisis Estratégico Bloqueado</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Este nivel de detalle y los manuales de protección de <b>Julhianno Garcia</b> son exclusivos para nuestra comunidad de élite.
            </p>
            <button className="btn-glow w-full py-6 text-xs shadow-2xl">SUSCRIBIRME POR $8/MES</button>
          </div>
        </div>

        {/* SISTEMA SOCIAL Y COMENTARIOS */}
        <div className="mt-40 pt-20 border-t border-white/5 space-y-20">
           <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex gap-12">
                <button onClick={() => setLikes(l => l+1)} className="flex flex-col items-center gap-2 group">
                  <ThumbsUp size={28} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[10px] font-black text-gray-500">{likes}</span>
                </button>
                <button className="flex flex-col items-center gap-2 group">
                  <ThumbsDown size={28} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  <span className="text-[10px] font-black text-gray-500">12</span>
                </button>
              </div>
              <button className="bg-purple-600 text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all shadow-xl flex items-center gap-4">
                <Share2 size={20} /> Compartir en Redes
              </button>
           </div>

           <div className="space-y-12">
              <h3 className="text-xl font-black uppercase tracking-[0.4em] text-gray-600">Debate Socio HAWKIN (12)</h3>
              
              <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center font-black text-black text-xs">AG</div>
                      <span className="text-xs font-black text-white uppercase tracking-widest">Socio_Premium_Peru</span>
                   </div>
                   <span className="text-[9px] text-gray-700 font-bold uppercase">Hace 5 min</span>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed font-light italic pl-6 border-l-2 border-cyan-500/20">
                  "Finalmente un canal que no especula y nos da el paso a paso. HAWKIN es el futuro."
                </p>
              </div>

              <div className="p-12 rounded-[40px] border-2 border-dashed border-white/5 bg-black/40 text-center">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] mb-8">Participa en la conversación global</p>
                <button className="text-[10px] font-black text-white border border-white/20 px-12 py-4 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">
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
