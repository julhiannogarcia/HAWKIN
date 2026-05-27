'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown, MessageSquare, Volume2, ArrowLeft, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

// BASE DE DATOS MAESTRA PARA ENLACES PERMANENTES - ACTUALIZADA CON HAWKIN LIVE INTEL
const MASTER_NEWS: Record<string, any> = {
  'openai-ipo-breaking': {
    id: 'openai-ipo-breaking',
    title: "🚨 EXCLUSIVA: OpenAI Inicia Trámites Confidenciales para IPO",
    category: "RUMORES & CEOS",
    author: "Julhianno Garcia",
    date: "27 Mayo, 2026",
    excerpt: "La salida a bolsa más grande de la historia tech se prepara en San Francisco con una valoración de $900B.",
    content: `
      En un movimiento que ha sacudido los cimientos de Wall Street, OpenAI ha presentado formalmente una declaración de registro confidencial ante la SEC para su oferta pública inicial (IPO). Fuentes de alta fidelidad indican que la operación está siendo orquestada por un sindicato bancario liderado por Goldman Sachs y Morgan Stanley.

      La valoración objetivo se sitúa en un rango sin precedentes de entre $850,000 y $900,000 millones de dólares. Este hito financiero se produce tras la resolución de varios conflictos legales clave, incluyendo la desestimación de la demanda interpuesta por Elon Musk. Según analistas de HAWKIN Intel, la IPO no solo busca capital, sino consolidar la soberanía de OpenAI en la carrera hacia la Inteligencia Artificial General (AGI).

      Se espera que las acciones comiencen a cotizar en el NASDAQ bajo el ticker "OAI" a finales del tercer trimestre de 2026. Para los socios de HAWKIN, este evento representa el punto de inflexión definitivo donde la IA deja de ser una tecnología emergente para convertirse en el pilar central de la economía global.
    `,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    isLocked: true
  },
  'karpathy-anthropic': {
    id: 'karpathy-anthropic',
    title: "Andrej Karpathy Ficha por Anthropic: El Plan de Mejora Auto-Recursiva",
    category: "RUMORES & CEOS",
    author: "Julhianno Garcia",
    date: "27 Mayo, 2026",
    excerpt: "El cofundador de OpenAI liderará el equipo de entrenamiento avanzado de Claude.",
    content: `
      Anthropic ha asestado un golpe maestro en la guerra del talento de Silicon Valley al anunciar la incorporación de Andrej Karpathy. El legendario ingeniero, conocido por su trabajo pionero en OpenAI y por liderar el sistema Autopilot de Tesla, asumirá el cargo de Director de Mejora Auto-Recursiva.

      La misión de Karpathy es tan ambiciosa como disruptiva: utilizar las capacidades actuales de Claude para optimizar y acelerar el pre-entrenamiento de las futuras generaciones de modelos. Este enfoque de "IA entrenando a la IA" promete reducir los tiempos de desarrollo en un 40% y alcanzar niveles de eficiencia en el procesamiento de tokens nunca antes vistos.

      Expertos de la industria sugieren que este movimiento coloca a Anthropic en una posición de ventaja técnica sobre Meta y Google. Karpathy ha declarado que su enfoque se centrará en la "limpieza arquitectónica", buscando modelos que no solo sean más potentes, sino más elegantes y menos costosos de operar a escala masiva.
    `,
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=1200",
    isLocked: true
  },
  'eje-ia-cumbre-trump': {
    id: 'eje-ia-cumbre-trump',
    title: "Cumbre en Beijing: Musk, Altman y Huang definen el 'Eje de la IA'",
    category: "RUMORES & CEOS",
    author: "Julhianno Garcia",
    date: "26 Mayo, 2026",
    excerpt: "La IA es declarada oficialmente como materia de Soberanía Nacional y Seguridad Global.",
    content: `
      En una reunión relámpago que ha redefinido la geopolítica del siglo XXI, el presidente Trump, flanqueado por Elon Musk, Sam Altman y Jensen Huang, se ha reunido con altos mandos tecnológicos en Beijing. El resultado: el nacimiento del "Acuerdo de Estabilidad Algorítmica".

      La IA ha dejado de ser tratada como un producto comercial para ser clasificada oficialmente como un activo de Seguridad Nacional. Bajo este nuevo marco, el hardware de NVIDIA (Blackwell) y el poder de cómputo de las grandes redes neuronales se consideran materias primas críticas, equivalentes al petróleo en el siglo XX.

      Musk ha enfatizado la necesidad de una desregulación estratégica en Occidente para evitar que la burocracia frene la innovación frente al avance asiático. Para los observadores del Radar HAWKIN, esto significa que el acceso a la potencia de cálculo será el nuevo indicador de riqueza y poder soberano de las naciones y las empresas de élite.
    `,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
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
        
        setArticle(found || MASTER_NEWS['openai-ipo-breaking']);
        setLoading(false);
      } catch (e) {
        console.error("Fetch error", e);
        setArticle(MASTER_NEWS['openai-ipo-breaking']);
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
