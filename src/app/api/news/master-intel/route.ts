import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Caching global (transient)
let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutos para evitar lentitud excesiva

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

export async function GET() {
  const now = Date.now();

  try {
    // 1. OBTENER NOTICIAS MANUALES (ESTO ES ULTRA RÁPIDO)
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

    // 2. RETORNAR CACHÉ SI EXISTE Y ES RECIENTE (MÁXIMA VELOCIDAD)
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      // Siempre inyectar las manuales más recientes incluso en el caché
      const merged = [...manualIntel, ...cachedIntel.aiItems].slice(0, 10);
      return NextResponse.json({ ...cachedIntel, topNews: merged, lastUpdate: new Date(lastUpdate).toLocaleTimeString('es-PE') });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
       // Si no hay API KEY, al menos mostrar las manuales para no dejar la web vacía
       return NextResponse.json({ 
         topNews: manualIntel, 
         rumors: [], battles: [], trendingCEOs: [], 
         prediction: { dominance: "HAWKIN", ceo: "Julhianno Garcia", risk: "BAJO" },
         lastUpdate: new Date().toLocaleTimeString('es-PE') 
       });
    }

    const groq = new Groq({ apiKey });

    // 3. RECOPILAR RSS (CON TIMEOUT PARA QUE NO SE TRABE)
    const FEEDS = [
      'https://news.google.com/rss/search?q=AI+breaking+news+OpenAI+NVIDIA&hl=en-US&gl=US&ceid=US:en'
    ];

    let rawItems: any[] = [];
    try {
      const results = await Promise.all(FEEDS.map(url => 
        Promise.race([
          parser.parseURL(url),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout RSS')), 4000))
        ]).catch(() => ({ items: [] }))
      ));
      // @ts-ignore
      rawItems = results.flatMap(res => res.items || []).slice(0, 8).map(item => ({
        title: item.title,
        snippet: item.contentSnippet?.substring(0, 150),
        source: item.source?.name || "Global"
      }));
    } catch (e) {
      console.error("RSS Error:", e);
    }

    // 4. MOTOR DE IA (LLAMA-3-8B PARA MÁXIMA VELOCIDAD)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Eres el HAWKIN WAR ROOM. Responde solo en JSON." },
        { role: "user", content: `Analiza y genera inteligencia en este JSON: ${JSON.stringify(rawItems)}. Sigue este formato: { "topNews": [...], "rumors": [...], "battles": [...], "trendingCEOs": [...], "prediction": {...} }` }
      ],
      model: "llama3-8b-8192", // Usamos el modelo 8B que es instantáneo
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const intelReport = JSON.parse(content);
    
    const aiItems = (intelReport.topNews || []).map((n: any) => ({
      ...n,
      id: generateId(n.title),
      timestamp: new Date().toISOString()
    }));

    cachedIntel = { ...intelReport, aiItems };
    lastUpdate = now;

    const finalTopNews = [...manualIntel, ...aiItems].slice(0, 10);

    return NextResponse.json({ ...intelReport, topNews: finalTopNews, lastUpdate: new Date(now).toLocaleTimeString('es-PE') });

  } catch (error: any) {
    console.error("War Room API Error:", error);
    // FALLBACK FINAL: SI TODO FALLA, MOSTRAR MANUALES
    return NextResponse.json({ 
       error: "Modo de Emergencia Activado",
       topNews: [], // Aquí deberíamos traer manualIntel si logramos sacarlas
       rumors: [], battles: [], trendingCEOs: [],
       lastUpdate: new Date().toLocaleTimeString('es-PE') 
    });
  }
}
