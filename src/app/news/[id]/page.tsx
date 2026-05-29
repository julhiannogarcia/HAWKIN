'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { 
  Share2, ThumbsUp, ArrowLeft, ShieldAlert, 
  CheckCircle2, Lock, Zap, Target, Globe, BarChart3, Clock,
  ChevronRight, Sparkles, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================================
// BASE DE DATOS DE REPORTES PROFUNDOS (MASTER INTELLIGENCE)
// =====================================================================
const MASTER_NEWS: Record<string, any> = {
  'openai-ipo-breaking': {
    id: 'openai-ipo-breaking',
    title: "OpenAI: El Camino Secreto hacia la salida a Bolsa (IPO) de $900B",
    category: "BIG TECH",
    author: "Julhianno Garcia",
    date: "28 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    isLocked: true,
    impact: "EXTREMO",
    content: `
      En un movimiento que redefine la estructura del capital tecnológico mundial, OpenAI ha iniciado conversaciones preliminares y confidenciales con reguladores de la SEC para una posible Oferta Pública Inicial (IPO). 
      
      Según fuentes internas del ecosistema HAWKIN, la valoración proyectada rozaría los $900,000 millones de dólares, posicionándola instantáneamente por encima de gigantes históricos como Meta o Berkshire Hathaway.

      ### El "Razonamiento System 2" como Motor de Valor
      La clave de esta valoración no reside solo en GPT-5, sino en el nuevo paradigma de 'Razonamiento Computacional'. A diferencia de los modelos actuales, la nueva arquitectura permite a la IA "pensar antes de hablar", resolviendo problemas lógicos que antes eran exclusivos de la mente humana.

      ### ¿Qué significa esto para los inversores?
      1. **Dominancia del Mercado:** OpenAI busca el monopolio de la infraestructura cognitiva.
      2. **Soberanía de Datos:** El entrenamiento se está moviendo hacia datos sintéticos de alta fidelidad, eliminando la dependencia de internet público.
      3. **Energía Nuclear:** Se confirma la inversión masiva en fusión nuclear para alimentar los centros de datos del futuro.

      Este reporte confirma que la IA ya no es una herramienta, es la nueva capa base de la economía global. Los Socios Alpha de HAWKIN recibirán la actualización del prospecto de inversión en el canal SHIELD mañana a las 09:00 UTC.
    `
  },
  'karpathy-anthropic': {
    id: 'karpathy-anthropic',
    title: "Andrej Karpathy y la Fuga de Cerebros: El Pulso por la AGI",
    category: "CEO RADAR",
    author: "HAWKIN Intel",
    date: "28 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    isLocked: true,
    impact: "ALTO",
    content: `
      La industria de la Inteligencia Artificial está presenciando el mayor trasvase de talento de la década. Andrej Karpathy, arquitecto fundamental de la visión de Tesla y OpenAI, ha sido detectado en reuniones de alto nivel con Anthropic.

      ### El Proyecto "Claude Omega"
      Nuestras señales indican que Anthropic está desarrollando un modelo diseñado específicamente para la autonomía robótica total. La integración de Karpathy sugeriría que el enfoque está virando de LLMs puramente textuales hacia 'Agentes de Visión' capaces de operar en el mundo físico.

      ### Análisis de Situación:
      * **Tesla en Riesgo:** La salida de talento clave podría retrasar el despliegue masivo de Optimus Gen 3.
      * **Consolidación de Anthropic:** Con el apoyo de Amazon y la visión de Karpathy, la empresa se posiciona como el rival más serio de OpenAI.
      * **Impacto en Hardware:** NVIDIA está ajustando sus pedidos de chips Blackwell para priorizar a Anthropic en el próximo trimestre.

      La "Guerra por el Talento" ha terminado; ahora estamos en la "Guerra por la Ejecución". Quien logre el primer agente autónomo confiable, controlará el mercado laboral del 2027.
    `
  },
  'eje-ia-cumbre-trump': {
    id: 'eje-ia-cumbre-trump',
    title: "Cumbre de la IA 2026: La Nueva Geopolítica del Silicio",
    category: "GLOBAL",
    author: "Julhianno Garcia",
    date: "27 Mayo, 2026",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1200",
    isLocked: false,
    impact: "MODERADO",
    content: `
      Los líderes de las 20 economías más grandes del mundo se han reunido en una cumbre de emergencia para discutir la 'Soberanía Computacional'. La conclusión es clara: los países sin capacidad de cómputo propia serán colonias digitales en menos de 5 años.

      ### Puntos Clave del Acuerdo Global:
      1. **Libre Tránsito de Chips:** Se proponen corredores seguros para la entrega de GPUs H200 y Blackwell.
      2. **Regulación de Algoritmos:** Se establece una moratoria en el uso de IA para toma de decisiones militares autónomas en zonas civiles.
      3. **Impulso a la Energía Limpia:** El 40% de la energía de los Data Centers deberá ser de origen renovable para 2028.

      ### La Posición de HAWKIN:
      Creemos que estas regulaciones son solo una fachada. El verdadero poder se está concentrando en empresas privadas que poseen más datos que los propios estados. La descentralización es la única vía para la libertad individual.
    `
  }
};

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (e) { console.error(e); }
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

        // Si no está en Master, buscar en la API live
        const res = await fetch('/api/news/live');
        const data = await res.json();
        const allNews = [...(data.news || []), ...(data.shield || []), ...(data.hardware || [])];
        const found = allNews.find((n: any) => n.id === id);
        
        // Si no se encuentra nada, cargar uno por defecto para evitar error 404
        setArticle(found || MASTER_NEWS['openai-ipo-breaking']);
      } catch (e) {
        setArticle(MASTER_NEWS['openai-ipo-breaking']);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading || !id) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-center">
      <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
      <p className="text-cyan-400 font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Sincronizando Archivos de Inteligencia...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        {/* NAVEGACIÓN */}
        <button onClick={() => router.back()} className="flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-16 text-[9px] font-black uppercase tracking-widest group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver al Radar Global
        </button>

        {article && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            
            {/* CABECERA TIPO REPORTE CLASIFICADO */}
            <header className="space-y-8">
              <div className="flex flex-wrap items-center gap-4">
                 <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full border ${article.category === 'SHIELD INTEL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'}`}>
                   {article.category || 'RADAR'}
                 </span>
                 <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <Zap size={12} className="text-yellow-500" />
                    <span className="text-[9px] font-black uppercase text-gray-400">Impacto: {article.impact || 'ANÁLISIS'}</span>
                 </div>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic text-white">
                {article.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-y border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                       <Target size={20} />
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Reporte de Inteligencia</p>
                       <p className="text-xs font-bold text-white uppercase">{article.author || 'HAWKIN Intel'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                       <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Fecha Sincronizada</p>
                       <p className="text-xs font-bold text-white uppercase">{article.date || 'Hoy'}</p>
                    </div>
                    <div className="flex gap-3">
                       <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"><Share2 size={18} className="text-gray-400" /></button>
                       <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"><Bookmark size={18} className="text-gray-400" /></button>
                    </div>
                 </div>
              </div>
            </header>

            {/* IMAGEN DE ALTA FIDELIDAD */}
            <div className="w-full aspect-video rounded-[60px] overflow-hidden border border-white/10 shadow-2xl relative group">
              <img 
                src={article.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"} 
                className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" 
                alt="Intel Image" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>

            {/* CONTENIDO PROFUNDO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
               
               {/* Texto del Artículo */}
               <div className="lg:col-span-8 space-y-12">
                  <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:text-gray-400 prose-p:leading-relaxed prose-h3:text-2xl prose-h3:font-black prose-h3:uppercase prose-h3:italic prose-h3:tracking-tighter prose-h3:text-white">
                     {article.content ? (
                        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} className="font-light" />
                     ) : (
                        <p className="text-xl text-gray-400 font-light leading-relaxed italic">
                           {article.excerpt || "Analizando el impacto de este desarrollo en la infraestructura tecnológica global..."}
                        </p>
                     )}
                  </div>

                  {article.isLocked && !isPremium && (
                    <div className="p-12 rounded-[50px] bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border-2 border-white/5 text-center space-y-8 backdrop-blur-xl">
                       <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-2xl">
                          <Lock className="text-cyan-400" size={32} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-2xl font-black uppercase italic tracking-tighter">Acceso Restringido</h4>
                          <p className="text-gray-500 text-sm max-w-xs mx-auto">Este nivel de inteligencia profunda solo está disponible para Socios Alpha con suscripción activa.</p>
                       </div>
                       <button 
                        onClick={() => router.push('/#planes')}
                        className="px-12 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-xl"
                       >
                         Suscribirse Ahora
                       </button>
                    </div>
                  )}

                  <div className="pt-20 border-t border-white/5">
                     <AdSpace isPremium={isPremium} type="inline" />
                  </div>
               </div>

               {/* Barra Lateral de Métricas / Datos Rápidos */}
               <aside className="lg:col-span-4 space-y-8">
                  <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-6 shadow-xl">
                     <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                        <TrendingUp size={14} /> Datos Críticos
                     </h4>
                     <div className="space-y-4">
                        {[
                           { label: 'Market Sentiment', val: 'Bullish' },
                           { label: 'IA Trust Score', val: '98.2%' },
                           { label: 'Soberanía Digital', val: 'Alta' }
                        ].map((d, i) => (
                           <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                              <span className="text-[9px] font-bold text-gray-600 uppercase">{d.label}</span>
                              <span className="text-[9px] font-black text-white uppercase">{d.val}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 space-y-4">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Dato Curioso HAWKIN</p>
                     <p className="text-xs text-gray-400 leading-relaxed font-light">
                        ¿Sabías que el 80% de las noticias bomba actuales son analizadas por nuestra propia IA Alpha antes de ser inyectadas en tu Radar?
                     </p>
                  </div>
               </aside>

            </div>

            {/* FEEDBACK FINAL */}
            <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center sm:text-left">
              <div className="flex gap-12">
                <button className="flex flex-col items-center gap-3 group">
                  <div className="p-5 bg-white/5 rounded-2xl group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <ThumbsUp size={24} />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Informativa</span>
                </button>
                <button className="flex flex-col items-center gap-3 group">
                  <div className="p-5 bg-white/5 rounded-2xl group-hover:bg-purple-600 transition-all">
                    <Globe size={24} />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global</span>
                </button>
              </div>
              
              <div className="flex flex-col items-center sm:items-end gap-2">
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">HAWKIN NETWORK &copy; 2026</p>
                 <p className="text-[8px] text-gray-800 uppercase font-bold tracking-[0.4em]">Tecnología Prohibida para Mentes Ordinarias</p>
              </div>
            </div>

          </motion.div>
        )}
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
