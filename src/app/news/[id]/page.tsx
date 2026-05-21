'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert, Terminal, Copy } from 'lucide-react';

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likes, setLikes] = useState(1240);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || [])];
        const found = allNews.find((n: any) => n.id === id);
        setArticle(found);
        setLoading(false);
      } catch (e) {
        console.error(e);
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
        const text = `${article.title}. ${article.excerpt}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX';
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-bold uppercase">Sincronizando...</div>;
  if (!article) return <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4"><p className="text-red-500 font-black">NOTICIA FUERA DE COBERTURA</p><button onClick={() => router.push('/')} className="btn-glow text-[10px]">INICIO</button></div>;

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-12 text-[10px] font-black uppercase hover:text-white transition-colors">
          <ArrowLeft size={14} /> Volver
        </button>

        <header className="mb-12">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${article.category === 'SHIELD' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
            {article.category === 'SHIELD' && <ShieldAlert size={10} className="inline mr-2" />}
            {article.category}
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mt-8 mb-8">{article.title}</h1>
          <p className="text-xs text-gray-500 uppercase font-bold">{article.author} • {article.date}</p>
        </header>

        {/* REPRODUCTOR DE VOZ */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Volume2 className={isSpeaking ? "text-cyan-400 animate-pulse" : "text-gray-600"} size={24} />
            <span className="text-xs font-black uppercase tracking-widest italic">Asistente HAWKIN Voice</span>
          </div>
          <button onClick={toggleVoice} className="px-8 py-2 bg-white text-black rounded-full text-[10px] font-black hover:bg-cyan-400 transition-all">
            {isSpeaking ? 'DETENER' : 'ACTIVAR VOZ IA'}
          </button>
        </div>

        <img src={article.image} className="w-full aspect-video object-cover rounded-[40px] mb-12 border border-white/10" alt="Intel" />

        {/* CONTENIDO Y MANUAL SHIELD */}
        <div className="space-y-12 text-xl leading-relaxed text-gray-400 font-light">
          <p className="text-white font-medium text-2xl italic border-l-4 border-cyan-500 pl-6 bg-white/[0.02] py-4 rounded-r-xl">"{article.excerpt}"</p>
          
          {article.category === 'SHIELD' && (
            <section className="mt-20 space-y-10">
              <div className="flex items-center gap-4 text-red-500">
                <Terminal size={24} />
                <h3 className="text-2xl font-black uppercase tracking-widest italic text-white">Manual de Defensa HAWKIN</h3>
              </div>
              <p className="text-sm text-gray-500">{article.manual}</p>
              
              {/* CONSOLA DE CÓDIGO ESTILO GITHUB */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-[#161b22] px-6 py-3 flex justify-between items-center border-b border-[#30363d]">
                   <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">shell / installation_script.sh</span>
                   <Copy size={14} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="p-8 font-mono text-xs md:text-sm leading-loose">
                   {article.installCode.split('\n').map((line: string, i: number) => (
                     <div key={i} className="flex gap-4">
                        <span className="text-gray-600 w-4 select-none">{i+1}</span>
                        <span className={line.startsWith('#') ? 'text-gray-500 italic' : 'text-cyan-400'}>{line}</span>
                     </div>
                   ))}
                </div>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl text-xs italic text-red-400">
                Aviso: Ejecute estos comandos bajo su propia responsabilidad en un entorno seguro. HAWKIN Shield verifica cada script antes de su publicación.
              </div>
            </section>
          )}

          <div className="p-12 rounded-[50px] border border-white/10 bg-white/[0.01] text-center italic text-gray-500 text-sm">
            "Este análisis detallado continúa para socios de HAWKIN. Desbloquea las guías avanzadas por $8/mes."
          </div>
        </div>

        {/* SOCIAL */}
        <div className="mt-32 pt-16 border-t border-white/5 flex justify-between items-center">
           <div className="flex gap-8">
              <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-cyan-400 transition-all"><ThumbsUp size={24} /> {likes}</button>
              <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-red-500 transition-all"><ThumbsDown size={24} /></button>
           </div>
           <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-400/20 px-8 py-3 rounded-full hover:bg-purple-600 hover:text-white transition-all">
              <Share2 size={18} /> Compartir Análisis
           </button>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
