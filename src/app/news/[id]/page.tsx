'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert, Terminal, Copy, Cpu, Monitor } from 'lucide-react';

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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-bold uppercase tracking-widest animate-pulse italic">Sincronizando con la red global...</div>;
  if (!article) return <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4"><p className="text-red-500 font-black">ERROR: NOTICIA FUERA DE COBERTURA</p><button onClick={() => router.push('/')} className="btn-glow text-[10px]">REINICIAR RADAR</button></div>;

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-12 text-[10px] font-black uppercase hover:text-white transition-colors">
          <ArrowLeft size={14} /> Volver al Radar
        </button>

        <header className="mb-12">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${article.category === 'SHIELD' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
            {article.category === 'SHIELD' && <ShieldAlert size={10} className="inline mr-2" />}
            {article.category}
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mt-8 mb-8">{article.title}</h1>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{article.author} • {article.date}</p>
        </header>

        {/* ASISTENTE DE VOZ */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Volume2 className={isSpeaking ? "text-cyan-400 animate-pulse" : "text-gray-600"} size={24} />
            <span className="text-xs font-black uppercase tracking-widest italic">HAWKIN Voice Intelligence</span>
          </div>
          <button onClick={toggleVoice} className="px-8 py-2 bg-white text-black rounded-full text-[10px] font-black hover:bg-cyan-400 transition-all">
            {isSpeaking ? 'DETENER' : 'ESCUCHAR REPORTE'}
          </button>
        </div>

        {/* IMAGEN COHERENTE CON EL TEMA */}
        <div className="w-full aspect-video rounded-[40px] overflow-hidden border border-white/10 mb-12 shadow-2xl bg-gray-900">
          <img src={article.image} className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105" alt="News Multimedia" />
        </div>

        {/* CONTENIDO Y MANUAL SHIELD REAL */}
        <div className="space-y-12 text-xl leading-relaxed text-gray-300 font-light max-w-2xl mx-auto">
          <p className="text-white font-medium text-2xl italic border-l-4 border-cyan-500 pl-6 bg-white/[0.02] py-4 rounded-r-xl">"{article.excerpt}"</p>
          
          {article.category === 'SHIELD' && (
            <section className="mt-24 space-y-10 border-t border-red-500/20 pt-16">
              <div className="flex items-center gap-4 text-red-500">
                <ShieldAlert size={32} className="animate-pulse" />
                <h3 className="text-3xl font-black uppercase tracking-widest italic text-white leading-none">Manual de Defensa <span className="text-red-500">Shield</span></h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                   <div className="flex items-center gap-3 text-cyan-400 mb-3 text-[10px] font-black uppercase tracking-widest">
                      <Monitor size={14} /> Sistema Destino
                   </div>
                   <p className="text-white font-bold">{article.targetOS}</p>
                </div>
                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                   <div className="flex items-center gap-3 text-yellow-500 mb-3 text-[10px] font-black uppercase tracking-widest">
                      <Cpu size={14} /> Propósito
                   </div>
                   <p className="text-white font-bold">{article.purpose}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black uppercase text-gray-500 tracking-[0.3em]">Instrucciones Técnicas Paso a Paso:</p>
                {/* CONSOLA DE CÓDIGO ESTILO GITHUB PROFESIONAL */}
                <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-[#161b22] px-6 py-4 flex justify-between items-center border-b border-[#30363d]">
                     <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">HAWKIN_SHIELD_VULN_PATCH.sh</span>
                     <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase">
                        <Copy size={12} /> Copiar
                     </button>
                  </div>
                  <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto bg-[#0a0a0a]">
                     {article.installCode.split('\n').map((line: string, i: number) => (
                       <div key={i} className="flex gap-6">
                          <span className="text-gray-700 w-4 select-none text-right font-light">{i+1}</span>
                          <span className={line.startsWith('#') ? 'text-gray-500 italic' : line.includes('sudo') || line.includes('netsh') ? 'text-cyan-400 font-bold' : 'text-gray-300'}>{line}</span>
                       </div>
                     ))}
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-red-600/5 border border-red-500/20">
                <p className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-2">Advertencia de Seguridad</p>
                <p className="text-xs text-gray-400 leading-relaxed italic">
                  Este manual ha sido verificado por Julhianno Garcia. Ejecute los comandos únicamente en terminales con privilegios de administrador y asegúrese de realizar un respaldo previo de sus datos críticos.
                </p>
              </div>
            </section>
          )}

          <div className="p-12 rounded-[50px] border border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent text-center italic text-gray-600 text-sm">
            "Este análisis detallado y el soporte técnico 24/7 son exclusivos para socios Élite de HAWKIN."
          </div>
        </div>

        {/* SOCIAL */}
        <div className="mt-32 pt-16 border-t border-white/5 flex justify-between items-center">
           <div className="flex gap-10">
              <button onClick={() => setLikes(l => l+1)} className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-cyan-400 transition-all"><ThumbsUp size={24} /> {likes}</button>
              <button className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-red-500 transition-all"><ThumbsDown size={24} /></button>
           </div>
           <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-400/20 px-10 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-xl">
              <Share2 size={18} /> Compartir en Redes
           </button>
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
