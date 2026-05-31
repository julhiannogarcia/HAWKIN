import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos frescura total

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Socio, el núcleo de IA no tiene energía (API Key missing)." }, { status: 500 });

    const now = Date.now();
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      return NextResponse.json({ ...cachedIntel, lastUpdate: new Date(lastUpdate).toLocaleTimeString('es-PE') });
    }

    const groq = new Groq({ apiKey });

    // 1. OBTENER INTELIGENCIA MANUAL (DB)
    const dbNews = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const manualIntel = dbNews.map(n => ({
      id: n.id,
      title: n.title,
      summary: n.excerpt || n.content.substring(0, 250) + "...",
      impact: n.isUrgent ? 10 : 9,
      companies: [n.category || "ALPHA"],
      people: ["Fundador HAWKIN"],
      consequence: "Análisis estratégico prioritario.",
      importance: n.isUrgent ? "CRITICO" : "ALTO",
      url: n.url || `/news/${n.id}`,
      image: n.imageUrl,
      timestamp: n.createdAt.toISOString()
    }));

    // 2. RECOPILAR INTELIGENCIA BRUTA (RSS)
    const FEEDS = [
      'https://news.google.com/rss/search?q=OpenAI+NVIDIA+Tesla+Artificial+Intelligence+breaking&hl=en-US&gl=US&ceid=US:en'
    ];

    let rawItems: any[] = [];
    try {
      const results = await Promise.all(FEEDS.map(url => parser.parseURL(url).catch(() => ({ items: [] }))));
      rawItems = results.flatMap(res => res.items).slice(0, 15).map(item => ({
        title: item.title,
        snippet: item.contentSnippet?.substring(0, 200),
        source: item.source?.name || "Global"
      }));
    } catch (e) {
      console.error("RSS Error:", e);
    }

    // 3. MOTOR DE INTELIGENCIA LLAMA-3
    const MASTER_PROMPT = `
      Eres el HAWKIN WAR ROOM. Analiza estos datos de IA: ${JSON.stringify(rawItems)}
      Genera exactamente 10 noticias mas impactantes en JSON.
      Formato:
      {
        "topNews": [
          { "title": "...", "summary": "...", "impact": 10, "companies": ["..."], "people": ["..."], "consequence": "...", "importance": "CRITICO", "url": "..." }
        ],
        "rumors": [{ "text": "...", "source": "...", "probability": "90%" }],
        "battles": [{ "competitors": "A vs B", "motive": "...", "status": "Guerra", "winners": "A" }],
        "trendingCEOs": [{ "name": "...", "company": "...", "reason": "..." }],
        "prediction": { "dominance": "...", "ceo": "...", "risk": "ALTO" }
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: MASTER_PROMPT }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const intelReport = JSON.parse(content);
    
    // MEZCLAR Y ASEGURAR ESTRUCTURA
    if (!intelReport.topNews) intelReport.topNews = [];
    
    const aiNews = intelReport.topNews.map((n: any) => ({
      ...n,
      id: generateId(n.title),
      timestamp: new Date().toISOString()
    }));

    // PRIORIDAD MANUAL (Tus noticias primero)
    intelReport.topNews = [...manualIntel, ...aiNews].slice(0, 10);
    
    // Validar que no esté vacío
    if (intelReport.topNews.length === 0) {
       throw new Error("No se pudo generar inteligencia en este ciclo.");
    }

    cachedIntel = intelReport;
    lastUpdate = now;

    return NextResponse.json({ ...intelReport, lastUpdate: new Date(now).toLocaleTimeString('es-PE') });

  } catch (error: any) {
    console.error("War Room API Error:", error);
    return NextResponse.json({ error: "Interferencia en el canal satelital. Reintentando..." }, { status: 500 });
  }
}
