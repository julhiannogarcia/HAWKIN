import Intro from '@/components/Intro';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import NewsCard from '@/components/NewsCard';
import FounderZone from '@/components/FounderZone';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pricing from '@/components/Pricing';

export default function Home() {
  const sampleNews = [
    {
      id: "gpt-5-leak",
      title: "OpenAI GPT-5: Filtraciones sobre la nueva arquitectura",
      excerpt: "Fuentes cercanas a la compañía indican que el nuevo modelo superará la capacidad de razonamiento humano en pruebas estándar...",
      category: "BIG TECH",
      isLocked: true
    },
    {
      id: "sam-altman-ubr",
      title: "La visión de Sam Altman sobre la renta básica universal",
      excerpt: "En una reciente entrevista, el CEO de OpenAI explicó cómo la IA financiará el futuro de la sociedad...",
      category: "CEO RADAR",
      isLocked: true
    },
    {
      id: "nvidia-record",
      title: "NVIDIA alcanza valoración récord gracias a nuevos chips",
      excerpt: "La demanda de infraestructura para IA no tiene precedentes, posicionando a la empresa como el motor del mundo...",
      category: "MERCADO",
      isLocked: false
    }
  ];

  return (
    <main className="relative min-h-screen">
      <Intro />
      <Header />

      <div className="flex flex-col">
        {/* Espacio Publicitario Premium */}
        <div className="mt-40 max-w-5xl mx-auto w-full px-4">
          <div className="relative h-24 w-full bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center overflow-hidden group hover:border-cyan-500/30 transition-all">
            <span className="absolute top-2 right-4 text-[8px] uppercase tracking-[0.3em] text-gray-600 font-black">
              Ad Space Premium
            </span>
            <div className="text-gray-600 font-black tracking-tighter text-xl group-hover:text-cyan-400 transition-colors uppercase">
              Anuncia tu Empresa Aquí
            </div>
          </div>
        </div>

        <Hero />

        {/* Feed de Noticias */}
        <section id="news" className="max-w-6xl mx-auto px-4 py-32 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Radar Global.</h2>
              <p className="text-gray-500 mt-4 text-xs font-black uppercase tracking-[0.4em]">Análisis de élite curado por Julhianno</p>
            </div>
            <a href="#" className="text-[10px] font-black tracking-widest text-cyan-400 hover:text-white transition-colors uppercase">Ver Archivo Completo →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleNews.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>
        </section>

        <FounderZone />
        <Pricing />
        <Footer />
        <Ticker />
      </div>
    </main>
  );
}
