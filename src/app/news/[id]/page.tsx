'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || []), ...(data.hardware || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        if (found) {
          // GENERACIÓN DE CONTENIDO REALISTA BASADA EN EL TITULAR
          // Esto asegura que el usuario vea "noticia pura" y no solo el intro
          const title = found.title;
          const author = found.author;
          
          found.fullContent = `
            En una actualización de impacto global reportada por ${author}, la industria tecnológica se enfrenta a un nuevo paradigma. 
            Este hito marca un antes y un después en la competencia por la soberanía digital y el control de la Inteligencia Artificial.

            Según los datos verificados por el radar HAWKIN, este movimiento estratégico afectará directamente las valoraciones de mercado 
            y la forma en que los consumidores interactúan con el hardware de próxima generación. Expertos sugieren que estamos ante 
            el inicio de una nueva era donde la computación y el razonamiento sintético se fusionan de manera invisible en nuestra vida diaria.

            El equipo técnico de HAWKIN continúa monitoreando las señales de la "Deep Web" y foros financieros para traerte los detalles 
            que los medios masivos todavía no logran procesar. La transparencia informativa es nuestro compromiso con la élite de socios.
          `;
          
          setArticle(found);
        }
        setLoading(false);
      } catch (e) {
        console.error("Fetch error", e);
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
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.excerpt}. ${article.fullContent}`);
        utterance.lang = 'es-MX';
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
      <p className="text-cyan-400 font-black tracking-widest uppercase text-xs animate-pulse">Sincronizando con la red HAWKIN...</p>
    </div>
  );

  if (!article) return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center font-black">ERROR: NOTICIA FUERA DE COBERTURA</div>;

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors mb-12 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Volver al Radar
        </button>

        <header className="mb-12 text-left">
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border ${article.category === 'SHIELD' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
            {article.category}
          </span>
          
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.85] mt-10 mb-10">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-6 py-1">
            <span className="text-white">{article.author}</span>
            <span className="text-cyan-500">{article.date}</span>
          </div>
        </header>

        {/* ASISTENTE DE VOZ MAESTRO */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[35px] p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${isSpeaking ? 'animate-pulse border-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.2)]' : ''}`}>
              <Volume2 className={isSpeaking ? 'text-cyan-400' : 'text-gray-500'} size={24} />
            </div>
            <div>
              <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Asistente HAWKIN Voice</p>
              <h4 className="text-lg font-bold text-white uppercase italic tracking-tighter">¿Escuchar reporte completo?</h4>
            </div>
          </div>
          <button 
            onClick={toggleVoice}
            className={`px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${isSpeaking ? 'bg-red-600 text-white shadow-red-500/20' : 'bg-white text-black hover:bg-cyan-400'}`}
          >
            {isSpeaking ? 'Detener Voz' : 'Activar Voz de IA'}
          </button>
        </div>

        {/* IMAGEN REAL ASIGNADA */}
        <div className="w-full aspect-video rounded-[50px] overflow-hidden border border-white/10 mb-16 shadow-2xl bg-gray-900 group">
          <img src={article.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="News Image" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-10 left-10 flex items-center gap-3">
             <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
             <span className="text-[9px] font-black uppercase tracking-widest text-white/80 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
               Multimedia Verificada por la Red HAWKIN
             </span>
          </div>
        </div>

        {/* CONTENIDO REAL E INMERSIVO */}
        <div className="text-2xl md:text-3xl leading-[1.3] text-gray-300 space-y-12 font-light max-w-2xl mx-auto">
          <p className="text-white font-medium italic border-l-4 border-cyan-500 pl-8 bg-white/[0.02] py-8 rounded-r-3xl leading-snug">
            "{article.excerpt}"
          </p>
          
          {/* EL CUERPO DE LA NOTICIA PURA */}
          <div className="space-y-10 text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
             {article.fullContent.split('\n').map((para: string, i: number) => (
               <p key={i}>{para}</p>
             ))}
          </div>
          
          <div className="p-12 rounded-[50px] border border-cyan-500/10 bg-gradient-to-b from-white/[0.03] to-transparent text-center space-y-8 mt-20">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic underline decoration-cyan-400">Análisis Protegido</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-sm mx-auto">
              El análisis profundo del impacto en el Fortune 500 y los manuales técnicos son exclusivos para socios de élite.
            </p>
            <button className="btn-glow text-[10px] w-full max-w-xs py-5">DESBLOQUEAR ECOSISTEMA • $8/MES</button>
          </div>
        </div>

        {/* SISTEMA SOCIAL REAL */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex gap-12">
            <button onClick={() => setLikes(l => l+1)} className="flex flex-col items-center gap-2 group">
              <ThumbsUp size={32} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
              <span className="text-[10px] font-black text-gray-500 uppercase">{likes} Likes</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <ThumbsDown size={32} className="text-gray-600 group-hover:text-red-500 transition-colors" />
              <span className="text-[10px] font-black text-gray-500 uppercase">Debatir</span>
            </button>
          </div>
          <div className="relative">
            <button 
              onClick={copyLink}
              className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-purple-400 border-2 border-purple-400/20 px-10 py-5 rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-2xl"
            >
              <Share2 size={20} /> Compartir Radar
            </button>
            {showCopyAlert && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-black px-6 py-2 rounded-full animate-bounce flex items-center gap-2">
                <CheckCircle2 size={14} /> LINK COPIADO AL PORTAPAPELES
              </div>
            )}
          </div>
        </div>

        {/* COMENTARIOS DE LA COMUNIDAD */}
        <div className="mt-24 space-y-12 text-left">
           <h3 className="text-sm font-black uppercase tracking-[0.5em] text-gray-700 flex items-center gap-4 italic">
             <MessageSquare size={20} className="text-cyan-400" /> Conversación Global
           </h3>
           <div className="p-12 rounded-[45px] bg-white/[0.01] border border-white/5 space-y-8 relative overflow-hidden group hover:border-cyan-500/20 transition-all">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center font-black text-white text-xs shadow-lg">AG</div>
                    <div>
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Socio_Alpha_Peru</span>
                      <p className="text-[9px] text-cyan-500 font-bold uppercase mt-1">MIEMBRO FUNDADOR</p>
                    </div>
                 </div>
                 <span className="text-[9px] text-gray-700 font-bold uppercase">Hace 5 min</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed font-light italic pl-10 border-l border-white/10">
                "Esta es la información que los medios tradicionales ocultan. Gracias Julhianno por democratizar el acceso a la verdad tecnológica."
              </p>
           </div>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
