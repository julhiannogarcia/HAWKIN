'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

// BASE DE DATOS MAESTRA PARA ENLACES PERMANENTES
const MASTER_NEWS: Record<string, any> = {
  'gpt-5-leak': {
    id: 'gpt-5-leak',
    title: "OpenAI GPT-5: Filtraciones sobre la nueva arquitectura",
    category: "BIG TECH",
    author: "Julhianno Garcia",
    date: "19 Mayo, 2026",
    excerpt: "Análisis profundo sobre el razonamiento System 2 y la memoria persistente.",
    content: `
      La carrera por la Inteligencia Artificial General (AGI) ha alcanzado un punto de inflexión crítico con las recientes filtraciones sobre GPT-5. Fuentes internas de OpenAI confirman que la nueva arquitectura, denominada internamente "Artemis", marca el fin de la era de la simple predicción estadística. 

      A diferencia de GPT-4, que opera bajo una lógica de "pensamiento rápido" o System 1, GPT-5 implementa un mecanismo de razonamiento System 2. Esto significa que el modelo ahora es capaz de realizar pausas deliberadas durante la generación de respuestas para verificar la lógica interna y contrastar hechos contra una base de conocimientos verificada en tiempo real. 

      Las implicaciones para el mercado global son masivas. Se estima que GPT-5 podrá resolver problemas complejos de ingeniería, medicina y leyes con una tasa de precisión del 99.8%, eliminando prácticamente las alucinaciones que plagaban a sus predecesores. Además, la integración de una "memoria persistente episódica" permitirá que la IA aprenda de cada interacción con el usuario, creando un asistente verdaderamente personalizado que evoluciona junto a la visión del socio de HAWKIN.
    `,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    isLocked: true
  },
  'magnifica-humanitas': {
    id: 'magnifica-humanitas',
    title: "Magnifica Humanitas: La Encíclica de la IA",
    category: "RUMORES & ÉLITE",
    author: "Julhianno Garcia",
    date: "25 Mayo, 2026",
    excerpt: "El Vaticano define la postura ética global sobre la Inteligencia Artificial.",
    content: `
      En un documento histórico titulado "Magnifica Humanitas", la Iglesia Católica ha presentado su visión más profunda y disruptiva sobre el papel de la Inteligencia Artificial en el futuro de la civilización. Este documento no solo analiza la técnica, sino la esencia misma de lo que significa ser humano en un mundo de algoritmos.

      La encíclica destaca que estamos "en un momento de cambio histórico" donde la IA no debe ser vista como una amenaza, sino como una herramienta para potenciar la dignidad humana, siempre y cuando esté bajo un control ético estricto. El texto aboga por una "algor-ética", un marco moral que dicte el desarrollo de los sistemas autónomos para evitar la deshumanización de los procesos sociales.

      Para el ecosistema HAWKIN, este documento es una validación de nuestra filosofía: la soberanía intelectual debe ir de la mano con la responsabilidad tecnológica. El Vaticano propone que el acceso a la IA de alta capacidad sea un derecho universal, algo que resuena con nuestra misión de democratizar la inteligencia de élite para nuestros socios.
    `,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
    isLocked: false
  },
  'sam-altman-ubr': {
    id: 'sam-altman-ubr',
    title: "La visión de Sam Altman sobre la renta básica universal",
    category: "CEO RADAR",
    author: "Julhianno Garcia",
    date: "18 Mayo, 2026",
    excerpt: "Cómo la IA financiará el futuro de la sociedad a través de dividendos de inteligencia.",
    content: `
      En una cumbre exclusiva sobre el futuro del capital, Sam Altman ha presentado una propuesta que redefine el contrato social moderno: el Dividendo de Inteligencia Global. La premisa es simple pero radical: a medida que la IA genera una riqueza sin precedentes al automatizar la producción global, una parte de ese valor debe ser redistribuida directamente a los ciudadanos.

      "No estamos hablando de caridad, sino de soberanía", afirmó Altman durante su intervención. Su modelo propone que las grandes corporaciones de IA aporten un porcentaje de su capacidad de cómputo y beneficios a un fondo soberano digital. Este fondo distribuiría activos no solo en moneda fiduciaria, sino en créditos de energía y procesamiento de datos, las dos materias primas más valiosas del siglo XXI.

      Para los socios de HAWKIN, esto representa una oportunidad única de posicionamiento. Aquellos que dominen el uso de estas herramientas hoy, serán los administradores de la abundancia del mañana. La IA no viene a reemplazar al humano, sino a liberar su potencial creativo de las tareas mecánicas, permitiendo una nueva era de exploración intelectual y financiera.
    `,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    isLocked: true
  }
};

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false); 

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

    // Lógica para detectar si el usuario ha pagado (Simulación en Beta)
    // Buscamos un indicador en localStorage o sesión
    const paidStatus = localStorage.getItem('hawkin_premium_active');
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
        
        setArticle(found || MASTER_NEWS['gpt-5-leak']);
        setLoading(false);
      } catch (e) {
        console.error("Fetch error", e);
        setArticle(MASTER_NEWS['gpt-5-leak']);
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
        const utterance = new SpeechSynthesisUtterance(`${article.title}. Análisis de Julhianno Garcia. ${article.excerpt}. ${article.content}`);
        
        let voices = window.speechSynthesis.getVoices();
        const female = voices.find(v => 
          (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Monica')) && 
          (v.lang.includes('es') || v.lang.includes('MX'))
        );
        
        if (female) utterance.voice = female;
        utterance.lang = geoData?.countryCode === 'US' ? 'en-US' : 'es-MX';
        utterance.rate = 0.95;
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
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
                {article.category}
              </span>
              
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mt-10 mb-10">
                {article.title}
              </h1>

              <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-6 py-1">
                <span className="text-white">POR {article.author}</span>
                <span className="text-cyan-500">{article.date}</span>
              </div>
            </header>

            {/* ASISTENTE DE VOZ MAESTRO */}
            <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
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
                {isSpeaking ? 'DETENER VOZ' : 'ACTIVAR VOZ DE IA'}
              </button>
            </div>

            <div className="w-full aspect-video rounded-[50px] overflow-hidden border border-white/10 mb-16 shadow-2xl bg-gray-900">
              <img src={article.image} className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105" alt="News" />
            </div>

            <div className="text-xl md:text-2xl leading-relaxed text-gray-300 space-y-12 font-light max-w-2xl mx-auto">
              <div className="space-y-10 text-gray-400 leading-relaxed font-light">
                 {article.content || article.excerpt}
              </div>

              {/* Botón para ver fuente original si es noticia en vivo */}
              {article.url && (
                <div className="pt-10">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-cyan-400 hover:text-white transition-all border-b-2 border-cyan-400/20 pb-2"
                  >
                    Leer Reporte Completo en la Fuente <Share2 size={16} />
                  </a>
                </div>
              )}

              {/* ANUNCIO DINÁMICO (Se oculta si es premium) */}
              <AdSpace isPremium={isPremium} type="inline" />
            </div>

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
                    <CheckCircle2 size={14} /> LINK COPIADO
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN DE DEBATE LIMPIA */}
            <div className="mt-24 space-y-12 text-left">
               <h3 className="text-sm font-black uppercase tracking-[0.5em] text-gray-700 flex items-center gap-4 italic">
                 <MessageSquare size={20} className="text-cyan-400" /> Conversación Global
               </h3>
               
               <div className="p-12 rounded-[45px] border-2 border-dashed border-white/5 bg-black/40 text-center">
                  <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em] mb-6">Sé el primero en iniciar el debate de élite</p>
                  <button className="text-[9px] font-black text-white border border-white/10 px-10 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase">
                    Iniciar Sesión para Comentar
                  </button>
               </div>
            </div>
          </>
        )}
      </article>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
