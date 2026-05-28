'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

const MASTER_NEWS: Record<string, any> = {
  'openai-ipo-breaking': {
    id: 'openai-ipo-breaking',
    title: "🚨 EXCLUSIVA: OpenAI Inicia Trámites Confidenciales para IPO",
    category: "RUMORES & CEOS",
    author: "Julhianno Garcia",
    date: "27 Mayo, 2026",
    excerpt: "La salida a bolsa más grande de la historia tech se prepara en San Francisco con una valoración de $900B.",
    content: "En un movimiento que ha sacudido los cimientos de Wall Street, OpenAI ha presentado formalmente una declaración de registro confidencial ante la SEC para su oferta pública inicial (IPO)...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    isLocked: true
  }
};

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false); 

  useEffect(() => {
    if (params?.id) setId(params.id as string);
  }, [params]);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
      } catch (e) {
        console.error("Error fetching geo pricing", e);
      }
    };
    fetchGeo();

    const paidStatus = typeof window !== 'undefined' ? localStorage.getItem('hawkin_premium_active') : null;
    if (paidStatus === 'true') setIsPremium(true);
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        if (MASTER_NEWS[id]) {
          setArticle(MASTER_NEWS[id]);
          setLoading(false);
          return;
        }

        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || []), ...(data.hardware || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        setArticle(found || MASTER_NEWS['openai-ipo-breaking']);
      } catch (e) {
        console.error("Fetch error", e);
        setArticle(MASTER_NEWS['openai-ipo-breaking']);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading || !id) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
      <p className="text-cyan-400 font-black tracking-widest uppercase text-[10px] animate-pulse">Sincronizando Radar HAWKIN...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-cyan-500 selection:text-black">
      <Header />
      
      <article className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 text-[10px] font-black uppercase tracking-widest group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Radar
        </button>

        {article && (
          <>
            <header className="mb-12 text-left">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${article.category === 'SHIELD' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
                {article.category || 'RADAR'}
              </span>
              
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mt-10 mb-10 uppercase">
                {article.title}
              </h1>

              <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-6 py-1">
                <span className="text-white">POR {article.author || 'HAWKIN Intel'}</span>
                <span className="text-cyan-500">{article.date || 'Hoy'}</span>
              </div>
            </header>

            <div className="w-full aspect-video rounded-[50px] overflow-hidden border border-white/10 mb-16 shadow-2xl bg-gray-900">
              <img src={article.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105" alt="News" />
            </div>

            <div className="text-xl md:text-2xl leading-relaxed text-gray-300 space-y-12 font-light max-w-2xl mx-auto">
              <div className="space-y-10 text-gray-400 leading-relaxed font-light">
                 {article.content || article.excerpt || "Analizando el impacto de esta noticia en el ecosistema global..."}
              </div>

              <AdSpace isPremium={isPremium} type="inline" />
            </div>

            <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex gap-12">
                <button onClick={() => setLikes(l => l+1)} className="flex flex-col items-center gap-2 group">
                  <ThumbsUp size={32} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[10px] font-black text-gray-500 uppercase">{likes} Likes</span>
                </button>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowCopyAlert(true);
                  setTimeout(() => setShowCopyAlert(false), 2000);
                }}
                className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-purple-400 border-2 border-purple-400/20 px-10 py-5 rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-2xl"
              >
                <Share2 size={20} /> Compartir Radar
              </button>
            </div>
          </>
        )}
      </article>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
