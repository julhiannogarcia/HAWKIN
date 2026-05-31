import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Caching volátil para alta velocidad
let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 10; 

function getPeruTime() {
  return new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
}

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

// =====================================================================
// INTELIGENCIA DE RESPALDO ALPHA (10 ITEMS GARANTIZADOS)
// =====================================================================
const MASTER_FALLBACK_TOP_10 = [
  { title: "HAWKIN CORE: Sincronización Alpha v5.9", summary: "El núcleo de inteligencia opera al 100%. Todos los sensores satelitales han sido calibrados para detectar movimientos críticos en el ecosistema global de IA.", impact: 10, companies: ["HAWKIN"], people: ["Julhianno Garcia"], consequence: "Dominancia estratégica activada.", importance: "CRITICO" },
  { title: "NVIDIA Blackwell: Flujo de Datos Masivo", summary: "Detección de flujos de datos en tiempo real en los nuevos clústeres de NVIDIA. El imperio procesa señales de alta frecuencia para predicción de mercados.", impact: 9, companies: ["NVIDIA", "HAWKIN"], people: ["Jensen Huang"], consequence: "Ventaja competitiva en trading de IA.", importance: "ALTO" },
  { title: "OpenAI: Modelo o3 y Razonamiento Autónomo", summary: "Nuevas filtraciones sugieren que el modelo o3 de OpenAI ha logrado hitos en razonamiento lógico complejo. HAWKIN analiza el impacto en la seguridad global.", impact: 9, companies: ["OpenAI"], people: ["Sam Altman"], consequence: "Aceleración hacia la AGI.", importance: "ALTO" },
  { title: "Tesla: Integración de FSD en Redes Alpha", summary: "Elon Musk anuncia avances en el sistema de conducción autónoma. El núcleo HAWKIN detecta patrones de aprendizaje masivo en la flota global.", impact: 8, companies: ["Tesla"], people: ["Elon Musk"], consequence: "Evolución de la robótica móvil.", importance: "ALTO" },
  { title: "Apple Intelligence: Despliegue en Mercados Emergentes", summary: "Apple acelera el lanzamiento de su IA en Asia y Europa. El imperio monitorea la adopción masiva y el flujo de datos personales.", impact: 8, companies: ["Apple"], people: ["Tim Cook"], consequence: "Saturación del mercado móvil con IA.", importance: "MEDIO" },
  { title: "Anthropic: Claude 3.5 Sonnet y Seguridad Sistémica", summary: "Nuevas pruebas de seguridad demuestran que Anthropic lidera en alineación de modelos. HAWKIN integra estos protocolos en el escudo SHIELD.", impact: 9, companies: ["Anthropic"], people: ["Dario Amodei"], consequence: "Blindaje de modelos de lenguaje.", importance: "ALTO" },
  { title: "Google DeepMind: Hitos en Medicina Predictiva", summary: "La división de IA de Google logra predecir estructuras proteicas con precisión del 99%. Impacto masivo en la industria biotecnológica.", impact: 9, companies: ["Google", "DeepMind"], people: ["Demis Hassabis"], consequence: "Revolución en salud Alpha.", importance: "ALTO" },
  { title: "Microsoft: Inversión de 10B en Nodos de Energía", summary: "Microsoft asegura suministro eléctrico para centros de datos de IA por los próximos 10 años. HAWKIN detecta monopolio energético inminente.", impact: 8, companies: ["Microsoft"], people: ["Satya Nadella"], consequence: "Guerra por la energía computacional.", importance: "MEDIO" },
  { title: "Meta: Llama-4 en Fase de Entrenamiento Final", summary: "Zuckerberg confirma que Llama-4 usará 10 veces más potencia que su predecesor. El núcleo HAWKIN se prepara para su integración táctica.", impact: 9, companies: ["Meta"], people: ["Mark Zuckerberg"], consequence: "Democratización de la superinteligencia.", importance: "CRITICO" },
  { title: "Grok-3: El Modelo de IA más Potente de xAI", summary: "Elon Musk afirma que Grok-3 será el líder indiscutible en veracidad de datos. HAWKIN sincroniza canales con xAI para datos sin censura.", impact: 9, companies: ["xAI"], people: ["Elon Musk"], consequence: "Verdad de datos en tiempo real.", importance: "ALTO" }
];

const MASTER_FALLBACK = {
  topNews: MASTER_FALLBACK_TOP_10.map(n => ({ ...n, timestamp: new Date().toISOString() })),
  rumors: [
    { text: "Filtración interna sugiere integración inminente del núcleo HAWKIN con modelos cuánticos.", source: "Intel Leak", probability: "94%" },
    { text: "NVIDIA busca alianza de exclusividad con los nodos de procesamiento Alpha.", source: "Tech Rumor", probability: "70%" }
  ],
  battles: [
    { competitors: "HAWKIN v5.9 vs Sistemas Tradicionales", motive: "Velocidad de reacción y precisión", status: "Superioridad Alpha", winners: "HAWKIN" }
  ],
  trendingCEOs: [
    { name: "Julhianno Garcia", company: "HAWKIN", reason: "Arquitectura de Inteligencia v5.9" },
    { name: "Sam Altman", company: "OpenAI", reason: "Modelos de razonamiento avanzado" }
  ],
  prediction: { dominance: "NÚCLEO HAWKIN", ceo: "Julhianno Garcia", risk: "BAJO" }
};

export async function GET() {
  const now = Date.now();
  let manualIntel: any[] = [];

  try {
    // 1. OBTENER NOTICIAS MANUALES (PRIORIDAD #1)
    try {
      const dbNews = await prisma.news.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      manualIntel = dbNews.map(n => ({
        id: n.id,
        title: n.title,
        summary: n.excerpt || n.content.substring(0, 250) + "...",
        impact: n.isUrgent ? 10 : 9,
        companies: [n.category || "ALPHA"],
        people: ["Fundador"],
        consequence: "Análisis estratégico prioritario.",
        importance: n.isUrgent ? "CRITICO" : "ALTO",
        url: n.url || `/news/${n.id}`,
        image: n.imageUrl,
        timestamp: n.createdAt.toISOString()
      }));
    } catch (e) { console.error("DB ERR:", e); }

    // 2. RETORNAR CACHÉ SI ES VÁLIDO (VELOCIDAD RAYO)
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      const merged = [...manualIntel, ...cachedIntel.aiItems].slice(0, 10);
      return NextResponse.json({ ...cachedIntel, topNews: merged, lastUpdate: getPeruTime() });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const groq = apiKey ? new Groq({ apiKey }) : null;

    // 3. RECOPILAR RSS (MAS FUENTES PARA TENER MAS DATOS)
    let rawItems: any[] = [];
    const RSS_FEEDS = [
      'https://news.google.com/rss/search?q=Artificial+Intelligence+OpenAI+NVIDIA+Tesla&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=Sam+Altman+Elon+Musk+AI+news&hl=en-US&gl=US&ceid=US:en'
    ];

    try {
      const rssResults = await Promise.all(RSS_FEEDS.map(url => 
        Promise.race([
          parser.parseURL(url),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
        ]).catch(() => ({ items: [] }))
      ));
      // @ts-ignore
      rawItems = rssResults.flatMap(res => res.items || []).slice(0, 20).map((item: any) => ({
        title: item.title,
        content: item.contentSnippet || item.title
      }));
    } catch (e) { console.error("RSS ERR:", e); }

    // 4. MOTOR DE IA (DEMANDANDO 10 NOTICIAS)
    let aiItems: any[] = [];
    let intelReport: any = { ...MASTER_FALLBACK };

    if (groq && rawItems.length > 0) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "Eres el HAWKIN WAR ROOM. Analiza y genera exactamente 10 noticias de alto impacto en JSON." },
            { role: "user", content: `Datos: ${JSON.stringify(rawItems)}. Genera un reporte completo con: topNews (exactamente 10 items), rumors, battles, trendingCEOs, prediction.` }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.1,
          response_format: { type: "json_object" }
        });
        const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
        
        intelReport = {
          rumors: (parsed.rumors?.length > 0) ? parsed.rumors : MASTER_FALLBACK.rumors,
          battles: (parsed.battles?.length > 0) ? parsed.battles : MASTER_FALLBACK.battles,
          trendingCEOs: (parsed.trendingCEOs?.length > 0) ? parsed.trendingCEOs : MASTER_FALLBACK.trendingCEOs,
          prediction: parsed.prediction || MASTER_FALLBACK.prediction
        };
        aiItems = (parsed.topNews || [])
          .filter((n: any) => n.title && n.summary)
          .map((n: any) => ({ ...n, id: generateId(n.title), timestamp: new Date().toISOString() }));
      } catch (e) { console.error("AI ERR:", e); }
    }

    // 5. UNIFICAR Y RELLENAR (MODO BUNKER)
    let finalTopNews = [...manualIntel, ...aiItems];
    
    // Si faltan para llegar a 10, rellenar con los fallbacks maestros
    if (finalTopNews.length < 10) {
       const needed = 10 - finalTopNews.length;
       const fallbacks = MASTER_FALLBACK_TOP_10.map(n => ({ ...n, id: generateId(n.title), timestamp: new Date().toISOString() }));
       finalTopNews = [...finalTopNews, ...fallbacks].slice(0, 10);
    }

    const response = {
      ...intelReport,
      topNews: finalTopNews.slice(0, 10),
      lastUpdate: getPeruTime()
    };

    // Actualizar Caché Global
    cachedIntel = { ...intelReport, aiItems: aiItems.length > 0 ? aiItems : MASTER_FALLBACK_TOP_10 };
    lastUpdate = now;

    return NextResponse.json(response);

  } catch (error) {
    console.error("CRITICAL API ERR:", error);
    return NextResponse.json({ ...MASTER_FALLBACK, lastUpdate: getPeruTime() });
  }
}
