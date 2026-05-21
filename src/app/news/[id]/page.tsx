'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { motion } from 'framer-motion';

// Mock de datos para la demostración
const ALL_NEWS: Record<string, any> = {
  'gpt-5-leak': {
    title: "OpenAI GPT-5: Filtraciones sobre la nueva arquitectura",
    category: "BIG TECH",
    content: "La carrera por la AGI ha tomado un giro inesperado esta semana. Tras meses de especulación, fuentes cercanas a los laboratorios de OpenAI en San Francisco han revelado que la arquitectura de GPT-5 ya no se basa únicamente en la predicción del siguiente token, sino en un sistema de 'System 2 Thinking'. \n\nEste nuevo modelo es capaz de razonar de forma autónoma antes de emitir una respuesta, reduciendo las alucinaciones en un 90% según las pruebas internas. Además, la integración con memoria persistente permitirá que la IA recuerde conversaciones de meses atrás sin perder el hilo conductor.",
    isLocked: true,
    author: "Julhianno Garcia",
    date: "19 Mayo, 2026"
  },
  'sam-altman-ubr': {
    title: "La visión de Sam Altman sobre la renta básica universal",
    category: "CEO RADAR",
    content: "En una reciente entrevista exclusiva, el CEO de OpenAI explicó cómo la IA no solo automatizará trabajos, sino que financiará el futuro de la sociedad a través de dividendos de inteligencia. \n\nAltman propone un modelo donde el poder de cómputo se convierta en la nueva moneda de cambio, permitiendo que cada ciudadano del mundo reciba una compensación básica financiada por las ganancias de los modelos de IA más avanzados.",
    isLocked: true,
    author: "Julhianno Garcia",
    date: "18 Mayo, 2026"
  },
  'nvidia-record': {
    title: "NVIDIA alcanza valoración récord gracias a nuevos chips",
    category: "MERCADO",
    content: "La demanda de infraestructura para IA no tiene precedentes. Con el lanzamiento de la arquitectura Blackwell, NVIDIA se ha posicionado como el motor indiscutible del mundo tecnológico. \n\nLas acciones de la compañía han subido un 15% tras el anuncio de alianzas estratégicas con las principales nubes del mundo, asegurando el suministro de chips de alto rendimiento para los próximos 3 años.",
    isLocked: false,
    author: "Julhianno Garcia",
    date: "19 Mayo, 2026"
  }
};

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const article = ALL_NEWS[id] || ALL_NEWS['gpt-5-leak'];

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      // Cancelamos cualquier voz anterior
      window.speechSynthesis.cancel();
      
      const summary = `Análisis de HAWKIN. Este artículo analiza los movimientos más recientes de ${article.category === 'BIG TECH' ? 'OpenAI' : 'el mercado'} y su impacto en la soberanía tecnológica global.`;
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tu navegador no soporta lectura de voz.");
    }
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />

      <article className="max-w-3xl mx-auto px-6 pt-40 pb-32">
        <header className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex gap-4 mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Por {article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </header>

        {/* Sección de Resumen IA */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/20 mb-12 relative overflow-hidden group">
          <span className="absolute top-4 right-6 text-[8px] font-black text-cyan-400 uppercase tracking-widest">✨ Resumen IA</span>
          <p className="text-gray-300 italic text-lg leading-relaxed">
            "Este artículo analiza los movimientos más recientes de {article.category === 'BIG TECH' ? 'OpenAI' : 'el mercado'} y su impacto en la soberanía tecnológica global."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <button 
              onClick={speakSummary}
              className="w-12 h-12 rounded-full border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all active:scale-95 shadow-[0_0_15px_rgba(0,242,255,0.2)]"
            >
              ▶
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-cyan-400 transition-colors">Activar Voz de IA</span>
          </div>
        </div>

        {/* Cuerpo del Artículo con Paywall */}
        <div className="space-y-8 text-lg leading-relaxed text-gray-300">
          <p>
            {article.content.split('\n')[0]}
          </p>

          {article.isLocked ? (
            <div className="relative mt-12">
              <p className="blur-md select-none opacity-30 leading-loose">
                {article.content.substring(50, 500)}... 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-[#010101] via-[#010101]/80 to-transparent">
                <div className="glass-card border-cyan-500/30 p-10 max-w-md shadow-[0_0_50px_rgba(0,242,255,0.1)]">
                  <span className="text-2xl block mb-4">🔒</span>
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Contenido de Élite</h3>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    Este análisis profundo es exclusivo para socios de HAWKIN. Suscríbete por solo $8/mes para desbloquear toda la plataforma.
                  </p>
                  <button className="btn-glow w-full text-[10px]">
                    Suscribirme Ahora
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {article.content.split('\n').slice(1).map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
              <div className="mt-20 p-8 border-t border-white/5 text-center italic text-gray-600">
                Análisis realizado de forma independiente por el equipo de HAWKIN.
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
      <Ticker />
    </main>
  );
}
