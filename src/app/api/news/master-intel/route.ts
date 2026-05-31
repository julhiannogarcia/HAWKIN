import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Caching volátil
let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 10; 

function getPeruTime() {
  return new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
}

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

const MASTER_FALLBACK = {
  topNews: [
    { title: "HAWKIN CORE: Sincronización Alpha v5.8", summary: "El núcleo de inteligencia está operando al 100%. Todos los sensores satelitales han sido calibrados para detectar movimientos críticos en el ecosistema de IA.", impact: 10, companies: ["HAWKIN"], people: ["Julhianno Garcia"], consequence: "Dominancia estratégica activada.", importance: "CRITICO", timestamp: new Date().toISOString() },
    { title: "Análisis de Redes Neuronales Blackwell", summary: "Detección de flujos de datos masivos en los nuevos clústeres de NVIDIA. El imperio procesa señales de alta frecuencia para predicción de mercados.", impact: 9, companies: ["NVIDIA", "HAWKIN"], people: ["Jensen Huang"], consequence: "Ventaja competitiva en trading de IA.", importance: "ALTO", timestamp: new Date().toISOString() }
  ],
  rumors: [
    { text: "Filtración interna sugiere integración inminente del núcleo HAWKIN con modelos cuánticos.", source: "Intel Leak", probability: "94%" },
    { text: "NVIDIA busca alianza de exclusividad con los nodos de procesamiento Alpha.", source: "Tech Rumor", probability: "70%" }
  ],
  battles: [
    { competitors: "HAWKIN v5.8 vs Sistemas Tradicionales", motive: "Velocidad de reacción y precisión", status: "Superioridad Alpha", winners: "HAWKIN" }
  ],
  trendingCEOs: [
    { name: "Julhianno Garcia", company: "HAWKIN", reason: "Arquitectura de Inteligencia v5.8" },
    { name: "Sam Altman", company: "OpenAI", reason: "Modelos de razonamiento avanzado" }
  ],
  prediction: { dominance: "NÚCLEO HAWKIN", ceo: "Julhianno Garcia", risk: "BAJO" }
};

export async function GET() {
  const now = Date.now();
  let manualIntel: any[] = [];

  try {
    // 1. NOTICIAS MANUALES (BD)
    try {
      const dbNews = await prisma.news.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      manualIntel = dbNews.map(n => ({
        id: n.id,
        title: n.title,
        summary: n.excerpt || n.content.substring(0, 200) + "...",
        impact: n.isUrgent ? 10 : 8,
        companies: [n.category || "ALPHA"],
        people: ["Fundador"],
        consequence: "Análisis estratégico prioritario.",
        importance: n.isUrgent ? "CRITICO" : "ALTO",
        url: n.url || `/news/${n.id}`,
        image: n.imageUrl,
        timestamp: n.createdAt.toISOString()
      }));
    } catch (e) { console.error("DB ERR:", e); }

    // 2. CACHÉ
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      const merged = [...manualIntel, ...cachedIntel.aiItems].slice(0, 10);
      return NextResponse.json({ ...cachedIntel, topNews: merged, lastUpdate: getPeruTime() });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const groq = apiKey ? new Groq({ apiKey }) : null;

    // 3. RSS
    let rawItems: any[] = [];
    try {
      const results = await Promise.race([
        parser.parseURL('https://news.google.com/rss/search?q=Artificial+Intelligence+breaking+news&hl=en-US&gl=US&ceid=US:en'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]) as any;
      rawItems = (results.items || []).slice(0, 10).map((item: any) => ({
        title: item.title,
        content: item.contentSnippet || item.title
      }));
    } catch (e) { console.error("RSS ERR:", e); }

    // 4. IA GENERATION
    let aiItems: any[] = [];
    let intelReport: any = { ...MASTER_FALLBACK };

    if (groq && rawItems.length > 0) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: `Analiza y devuelve JSON estructurado con: topNews, rumors, battles, trendingCEOs, prediction. Datos: ${JSON.stringify(rawItems)}` }],
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

    // SIEMPRE UNIFICAR
    const finalTopNews = [...manualIntel, ...aiItems];
    if (finalTopNews.length === 0) finalTopNews.push(...MASTER_FALLBACK.topNews);

    const response = {
      ...intelReport,
      topNews: finalTopNews.slice(0, 10),
      lastUpdate: getPeruTime()
    };

    // Actualizar Caché Global
    cachedIntel = { ...intelReport, aiItems: aiItems.length > 0 ? aiItems : MASTER_FALLBACK.topNews };
    lastUpdate = now;

    return NextResponse.json(response);

  } catch (error) {
    console.error("CRITICAL API ERR:", error);
    return NextResponse.json({ ...MASTER_FALLBACK, lastUpdate: getPeruTime() });
  }
}
