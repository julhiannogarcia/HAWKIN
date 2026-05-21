'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';

const ALL_NEWS: Record<string, any> = {
  'gpt-5-leak': {
    id: 'gpt-5-leak',
    title: "OpenAI GPT-5: Filtraciones sobre la nueva arquitectura",
    category: "BIG TECH",
    content: "La carrera por la AGI ha tomado un giro inesperado esta semana. Tras meses de especulación, fuentes cercanas a los laboratorios de OpenAI en San Francisco han revelado que la arquitectura de GPT-5 ya no se basa únicamente en la predicción del siguiente token, sino en un sistema de 'System 2 Thinking'. \n\nEste nuevo modelo es capaz de razonar de forma autónoma antes de emitir una respuesta, reduciendo las alucinaciones en un 90% según las pruebas internas. Además, la integración con memoria persistente permitirá que la IA recuerde conversaciones de meses atrás sin perder el hilo conductor.",
    isLocked: false, // DESACTIVADO TEMPORALMENTE PARA PRUEBAS
    author: "Julhianno Garcia",
    date: "19 Mayo, 2026"
  },
  'sam-altman-ubr': {
    id: 'sam-altman-ubr',
    title: "La visión de Sam Altman sobre la renta básica universal",
    category: "CEO RADAR",
    content: "En una reciente entrevista exclusiva, el CEO de OpenAI explicó cómo la IA no solo automatizará trabajos, sino que financiará el futuro de la sociedad a través de dividendos de inteligencia. \n\nAltman propone un modelo donde el poder de cómputo se convierta en la nueva moneda de cambio, permitiendo que cada ciudadano del mundo reciba una compensación básica financiada por las ganancias de los modelos de IA más avanzados.",
    isLocked: false, // DESACTIVADO TEMPORALMENTE PARA PRUEBAS
    author: "Julhianno Garcia",
    date: "18 Mayo, 2026"
  },
  'nvidia-record': {
    id: 'nvidia-record',
    title: "NVIDIA alcanza valoración récord gracias a nuevos chips",
    category: "MERCADO",
    content: "La demanda de infraestructura para IA no tiene precedentes. Con el lanzamiento de la arquitectura Blackwell, NVIDIA se ha posicionado como el motor indiscutible del mundo tecnológico. \n\nLas acciones de la compañía han subido un 15% tras el anuncio de alianzas estratégicas con las principales nubes del mundo, asegurando el suministro de chips de alto rendimiento para los próximos 3 años.",
    isLocked: false, // SIEMPRE LIBRE
    author: "Julhianno Garcia",
    date: "19 Mayo, 2026"
  }
};

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const article = ALL_NEWS[id] || ALL_NEWS['gpt-5-leak'];
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(1240);
  const [lang, setLang] = useState('es-ES');

  useEffect(() => {
    // Detectar idioma del navegador/IP para la voz
    const detectLang = async () => {
      try {
        const res = await fetch('/api/geo');
        const { countryCode } = await res.json();
        if (countryCode === 'US' || countryCode === 'GB') setLang('en-US');
        else setLang('es-MX'); // Voz en español de la región
      } catch (e) {
        setLang(navigator.language || 'es-ES');
      }
    };
    detectLang();
  }, []);

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Hola, bienvenido a HAWKIN. Este es el resumen de la noticia: ${article.title}. ${article.content.split('\n')[0]}`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Buscamos una voz femenina disponible
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Monica') || v.name.includes('Paulina')) && v.lang.startsWith(lang.split('-')[0]));
      
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      <article className="max-w-3xl mx-auto px-6 pt-40 pb-32">
        <header className="mb-12">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded">
              {article.category}
            </span>
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:text-cyan-400 transition-all"
            >
              {isSaved ? <BookmarkCheck size={20} className="text-cyan-400" /> : <Bookmark size={20} />}
            </button>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex gap-4 mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Por {article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </header>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 mb-12 relative overflow-hidden group">
          <span className="absolute top-4 right-6 text-[8px] font-black text-cyan-400 uppercase tracking-widest">✨ HAWKIN VOICE (Beta)</span>
          <p className="text-gray-300 italic text-lg leading-relaxed">
            "Activando síntesis de voz regional femenina..."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <button 
              onClick={speakSummary}
              className="w-12 h-12 rounded-full border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]"
            >
              ▶
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-cyan-400 transition-colors">Escuchar ahora</span>
          </div>
        </div>

        <div className="space-y-8 text-lg leading-relaxed text-gray-300">
          {article.content.split('\n').map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-white/5">
           <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <button onClick={() => setLikes(l => l+1)} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-cyan-400 transition-colors">
                  <ThumbsUp size={16} /> {likes}
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-red-400 transition-colors">
                  <ThumbsDown size={16} />
                </button>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-400">
                <Share2 size={16} /> Compartir
              </button>
           </div>
        </div>
      </article>
      <Footer />
      <Ticker />
    </main>
  );
}
