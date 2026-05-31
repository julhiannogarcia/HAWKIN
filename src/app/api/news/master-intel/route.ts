import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Caching global persistente (transient)
let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 15; 

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

export async function GET() {
  const now = Date.now();
  let manualIntel: any[] = [];

  try {
    // 1. OBTENER NOTICIAS MANUALES (PRIORIDAD ALPHA - SIEMPRE DEBE FUNCIONAR)
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
        consequence: "Análisis estratégico prioritario.",
        importance: n.isUrgent ? "CRITICO" : "ALTO",
        url: n.url || `/news/${n.id}`,
        image: n.imageUrl,
        timestamp: n.createdAt.toISOString()
      }));
    } catch (dbErr) {
      console.error("DB Error in Master Intel:", dbErr);
    }

    // 2. RETORNAR CACHÉ SI ES VÁLIDO (EVITA 500 POR LENTITUD)
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      const merged = [...manualIntel, ...cachedIntel.aiItems].slice(0, 10);
      return NextResponse.json({ 
        ...cachedIntel, 
        topNews: merged, 
        lastUpdate: new Date(lastUpdate).toLocaleTimeString('es-PE') 
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
       console.error("Missing GROQ_API_KEY");
       return NextResponse.json({ 
         topNews: manualIntel, 
         rumors: [], battles: [], trendingCEOs: [], 
         prediction: { dominance: "HAWKIN", ceo: "Socio Alpha", risk: "BAJO" },
         lastUpdate: new Date().toLocaleTimeString('es-PE') 
       });
    }

    const groq = new Groq({ apiKey });

    // 3. RECOPILAR RSS CON FALLBACK
    let rawItems: any[] = [];
    try {
      const FEEDS = ['https://news.google.com/rss/search?q=AI+breaking+news&hl=en-US&gl=US&ceid=US:en'];
      const results = await Promise.all(FEEDS.map(url => 
        Promise.race([
          parser.parseURL(url),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]).catch(() => ({ items: [] }))
      ));
      // @ts-ignore
      rawItems = results.flatMap(res => res.items || []).slice(0, 5).map(item => ({
        title: item.title,
        snippet: item.contentSnippet?.substring(0, 100),
        source: item.source?.name || "Global"
      }));
    } catch (e) { console.error("RSS Error:", e); }

    // 4. MOTOR DE IA (LLAMA-3-8B - ULTRA RÁPIDO)
    let aiItems: any[] = [];
    let intelReport: any = { rumors: [], battles: [], trendingCEOs: [], prediction: {} };

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Eres el HAWKIN WAR ROOM. Responde SOLO en JSON." },
          { role: "user", content: `Analiza: ${JSON.stringify(rawItems)}. Formato JSON: { "topNews": [{"title":"", "summary":"", "impact":10, "companies":[], "people":[], "consequence":"", "importance":"ALTO"}], "rumors":[], "battles":[], "trendingCEOs":[], "prediction":{} }` }
        ],
        model: "llama3-8b-8192",
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const content = chatCompletion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      
      intelReport = parsed;
      aiItems = (parsed.topNews || []).map((n: any) => ({
        ...n,
        id: generateId(n.title),
        timestamp: new Date().toISOString()
      }));

      // Actualizar Caché
      cachedIntel = { ...intelReport, aiItems };
      lastUpdate = now;
    } catch (aiErr) {
      console.error("AI Error:", aiErr);
    }

    // MEZCLAR Y RESPONDER (SIEMPRE MUESTRA ALGO)
    const finalTopNews = [...manualIntel, ...aiItems].slice(0, 10);

    return NextResponse.json({ 
      ...intelReport, 
      topNews: finalTopNews, 
      lastUpdate: new Date(now).toLocaleTimeString('es-PE') 
    });

  } catch (error: any) {
    console.error("Critical War Room API Failure:", error);
    // FALLBACK DE EMERGENCIA: SOLO MANUALES
    return NextResponse.json({ 
       topNews: manualIntel, 
       rumors: [], battles: [], trendingCEOs: [],
       lastUpdate: new Date().toLocaleTimeString('es-PE'),
       emergency: true
    });
  }
}
