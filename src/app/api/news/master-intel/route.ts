import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 10; 

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

// Inteligencia de Respaldo por si falla el satélite
const FALLBACK_AI_INTEL = [
  { title: "Sincronización de Núcleo HAWKIN", summary: "El sistema de inteligencia Alpha está operando en modo de baja latencia. Procesando señales de mercados globales y movimientos de IA.", impact: 10, companies: ["HAWKIN"], people: ["Julhianno Garcia"], consequence: "Estabilidad del sistema garantizada.", importance: "ALTO" },
  { title: "Análisis de Modelos Llama-3 en Progreso", summary: "Detección de nuevas arquitecturas neuronales optimizadas para procesamiento masivo de datos. El imperio está calibrando sensores.", impact: 9, companies: ["Meta", "HAWKIN"], people: ["Socio Alpha"], consequence: "Aceleración de reportes inminente.", importance: "ALTO" }
];

export async function GET() {
  const now = Date.now();
  let manualIntel: any[] = [];

  try {
    // 1. OBTENER NOTICIAS MANUALES (PRIORIDAD ALPHA)
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
        people: ["Fundador HAWKIN"],
        consequence: "Análisis inyectado manualmente.",
        importance: n.isUrgent ? "CRITICO" : "ALTO",
        url: n.url || `/news/${n.id}`,
        image: n.imageUrl || null,
        timestamp: n.createdAt.toISOString()
      }));
    } catch (e) { console.error("DB Error:", e); }

    // 2. RETORNAR CACHÉ SI ES VÁLIDO
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      const merged = [...manualIntel, ...cachedIntel.aiItems].slice(0, 10);
      return NextResponse.json({ ...cachedIntel, topNews: merged, lastUpdate: new Date(lastUpdate).toLocaleTimeString('es-PE') });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const groq = apiKey ? new Groq({ apiKey }) : null;

    // 3. RECOPILAR RSS
    let rawItems: any[] = [];
    try {
      const FEEDS = [
        'https://news.google.com/rss/search?q=Artificial+Intelligence+OpenAI+NVIDIA+breaking&hl=en-US&gl=US&ceid=US:en'
      ];
      const results = await Promise.all(FEEDS.map(url => 
        Promise.race([
          parser.parseURL(url),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
        ]).catch(() => ({ items: [] }))
      ));
      // @ts-ignore
      rawItems = results.flatMap(res => res.items || []).slice(0, 10).map(item => ({
        title: item.title,
        content: item.contentSnippet || item.title,
        source: item.source?.name || "Global"
      }));
    } catch (e) { console.error("RSS Error:", e); }

    // 4. GENERAR CON IA O USAR FALLBACK
    let aiItems: any[] = [];
    let intelReport: any = { rumors: [], battles: [], trendingCEOs: [], prediction: { dominance: "AI", ceo: "Growth", risk: "BAJO" } };

    if (groq && rawItems.length > 0) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "Eres el HAWKIN WAR ROOM. Analiza noticias de IA y devuelve un JSON con: topNews (array), rumors (array), battles (array), trendingCEOs (array), prediction (object). Cada noticia DEBE tener title y summary." },
            { role: "user", content: `Analiza: ${JSON.stringify(rawItems)}` }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.2,
          response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        intelReport = {
          rumors: parsed.rumors || [],
          battles: parsed.battles || [],
          trendingCEOs: parsed.trendingCEOs || [],
          prediction: parsed.prediction || intelReport.prediction
        };
        aiItems = (parsed.topNews || [])
          .filter((n: any) => n.title && n.summary)
          .map((n: any) => ({ ...n, id: generateId(n.title), timestamp: new Date().toISOString() }));
      } catch (e) { console.error("AI Error:", e); }
    }

    // SI NO HAY AI NI MANUALES, USAR DUMMIES PARA QUE SE VEA VIVO
    if (manualIntel.length === 0 && aiItems.length === 0) {
       aiItems = FALLBACK_AI_INTEL.map(n => ({ ...n, id: generateId(n.title), timestamp: new Date().toISOString() }));
    }

    const finalTopNews = [...manualIntel, ...aiItems].slice(0, 10);

    // Guardar en caché si tenemos algo bueno
    if (finalTopNews.length > 0) {
      cachedIntel = { ...intelReport, aiItems };
      lastUpdate = now;
    }

    return NextResponse.json({ 
      ...intelReport, 
      topNews: finalTopNews, 
      lastUpdate: new Date(now).toLocaleTimeString('es-PE') 
    });

  } catch (error: any) {
    console.error("Critical API Failure:", error);
    return NextResponse.json({ 
       topNews: manualIntel.length > 0 ? manualIntel : FALLBACK_AI_INTEL,
       rumors: [], battles: [], trendingCEOs: [],
       lastUpdate: new Date().toLocaleTimeString('es-PE')
    });
  }
}
