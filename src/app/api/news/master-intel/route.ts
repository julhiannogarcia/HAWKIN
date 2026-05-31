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

function getPeruTime() {
  return new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
}

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

// =====================================================================
// ESTRUCTURA DE RESPALDO PROFESIONAL (GENÉRICA Y VERÍDICA)
// =====================================================================
const MASTER_FALLBACK = {
  topNews: [],
  rumors: [
    { text: "Detección de flujos de capital masivos en infraestructuras de centros de datos de IA.", source: "Monitor Global", probability: "90%" },
    { text: "Aceleración en el desarrollo de modelos de razonamiento lógico autónomo.", source: "Análisis Alpha", probability: "85%" }
  ],
  battles: [
    { competitors: "Arquitecturas Propietarias vs Open Source", motive: "Dominancia del estándar industrial de IA", status: "Competencia Activa", winners: "Mercado Global" }
  ],
  trendingCEOs: [
    { name: "Jensen Huang", company: "NVIDIA", reason: "Liderazgo en hardware para supercomputación" },
    { name: "Sam Altman", company: "OpenAI", reason: "Expansión de modelos de frontera" }
  ],
  prediction: { dominance: "SISTEMAS AUTÓNOMOS", ceo: "NVIDIA / OPENAI", risk: "ESTABLE" }
};

export async function GET() {
  const now = Date.now();
  let manualIntel: any[] = [];

  try {
    // 1. OBTENER NOTICIAS MANUALES (BD - INFORMACIÓN VERIFICADA POR EL FUNDADOR)
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
        companies: [n.category || "TECH"],
        people: ["Oficial"],
        consequence: "Análisis estratégico verificado.",
        importance: n.isUrgent ? "CRITICO" : "ALTO",
        url: n.url || `/news/${n.id}`,
        image: n.imageUrl,
        timestamp: n.createdAt.toISOString()
      }));
    } catch (e) { console.error("DB ERR:", e); }

    // 2. RETORNAR CACHÉ SI ES VÁLIDO
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      const merged = [...manualIntel, ...cachedIntel.aiItems].slice(0, 10);
      return NextResponse.json({ ...cachedIntel, topNews: merged, lastUpdate: getPeruTime() });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const groq = apiKey ? new Groq({ apiKey }) : null;

    // 3. RECOPILAR RSS DE FUENTES LEGÍTIMAS (Reuters, Google News AI)
    let rawItems: any[] = [];
    const RSS_FEEDS = [
      'https://news.google.com/rss/search?q=Artificial+Intelligence+breaking+news+Reuters+Bloomberg&hl=en-US&gl=US&ceid=US:en'
    ];

    try {
      const rssResults = await Promise.all(RSS_FEEDS.map(url => 
        Promise.race([
          parser.parseURL(url),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
        ]).catch(() => ({ items: [] }))
      ));
      // @ts-ignore
      rawItems = rssResults.flatMap(res => res.items || []).slice(0, 15).map((item: any) => ({
        title: item.title,
        content: item.contentSnippet || item.title
      }));
    } catch (e) { console.error("RSS ERR:", e); }

    // 4. PROCESAMIENTO IA (STRICT FACTUAL MODE)
    let aiItems: any[] = [];
    let intelReport: any = { ...MASTER_FALLBACK };

    if (groq && rawItems.length > 0) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: "Eres el HAWKIN WAR ROOM. Tu tarea es analizar noticias REALES de IA. Prohíbe cualquier mención a nombres de personas que no aparezcan en los datos proporcionados. Genera un reporte JSON estrictamente profesional y verídico." 
            },
            { 
              role: "user", 
              content: `Analiza los siguientes datos verídicos y genera el reporte JSON: ${JSON.stringify(rawItems)}. Asegúrate de que topNews tenga 10 items si es posible.` 
            }
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

    // 5. UNIFICACIÓN FINAL
    const finalTopNews = [...manualIntel, ...aiItems];
    
    // Si sigue vacío o muy corto, no inventamos nombres, dejamos los oficiales de Nvidia/OpenAI
    const response = {
      ...intelReport,
      topNews: finalTopNews.slice(0, 10),
      lastUpdate: getPeruTime()
    };

    if (finalTopNews.length > 0) {
      cachedIntel = { ...intelReport, aiItems: aiItems };
      lastUpdate = now;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error("CRITICAL API ERR:", error);
    return NextResponse.json({ ...MASTER_FALLBACK, lastUpdate: getPeruTime() });
  }
}
