import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Caching layer para no saturar pero manteniendo frescura
let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutos para el análisis profundo de IA

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Socio, falta el núcleo de energía de IA." }, { status: 500 });

    const now = Date.now();
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      return NextResponse.json({ ...cachedIntel, lastUpdate: new Date(lastUpdate).toLocaleTimeString('es-PE') });
    }

    const groq = new Groq({ apiKey });

    // 1. OBTENER INTELIGENCIA MANUAL (DB)
    const dbNews = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const manualIntel = dbNews.map(n => ({
      id: n.id,
      title: n.title,
      summary: n.excerpt || n.content.substring(0, 250) + "...",
      impact: n.isUrgent ? 10 : 8,
      companies: [n.category],
      people: ["Julhianno Garcia"],
      consequence: "Análisis exclusivo inyectado por el Fundador.",
      importance: n.isUrgent ? "CRITICO" : "ALTO",
      url: n.url,
      timestamp: n.createdAt.toISOString()
    }));

    // 2. RECOPILAR INTELIGENCIA BRUTA (RSS)
    const FEEDS = [
      'https://news.google.com/rss/search?q=OpenAI+NVIDIA+Tesla+Anthropic+startups+AI+AGI+breaking&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=Sam+Altman+Elon+Musk+Jensen+Huang+tech+CEO+leak+rumor&hl=en-US&gl=US&ceid=US:en'
    ];

    const results = await Promise.all(FEEDS.map(url => parser.parseURL(url)));
    const rawItems = results.flatMap(res => res.items).slice(0, 15).map(item => ({
      title: item.title,
      snippet: item.contentSnippet?.substring(0, 300),
      source: item.source?.name || "Global Intel",
      link: item.link
    }));

    // 3. MOTOR DE INTELIGENCIA DE GRADO MILITAR (MASTER PROMPT)
    const MASTER_PROMPT = `
      Actúa como un sistema de inteligencia periodística mundial especializado exclusivamente en Inteligencia Artificial.
      Analiza los siguientes datos y genera un reporte estructurado en JSON.

      OBJETIVO CRÍTICO: Debes identificar y reportar exactamente las 10 noticias más impactantes de los datos proporcionados.

      FORMATO JSON REQUERIDO (ESTRICTO):
      {
        "topNews": [
          { "title": "TITULO", "summary": "RESUMEN", "impact": 1-10, "companies": ["EMPRESA"], "people": ["PERSONA"], "consequence": "POSIBLE CONSECUENCIA", "importance": "CRITICO/ALTO/MEDIO", "url": "URL" }
        ],
        "rumors": [
          { "text": "RUMOR", "source": "FUENTE", "credibility": "ALTO/MEDIO", "probability": "0-100%" }
        ],
        "battles": [
          { "competitors": "Empresa A vs Empresa B", "motive": "MOTIVO", "status": "SITUACION ACTUAL", "winners": "LIDER ACTUAL" }
        ],
        "trendingCEOs": [
          { "name": "Nombre", "company": "Empresa", "reason": "Motivo de tendencia" }
        ],
        "emergingTech": ["Tecnología A"],
        "startups": ["Startup A"],
        "prediction": { "dominance": "EMPRESA DOMINANTE", "ceo": "CEO INFLUYENTE", "tech": "TECNOLOGIA CLAVE", "risk": "RIESGO MAYOR" }
      }

      NOTICIAS PARA PROCESAR (EXTRAE LAS MEJORES): ${JSON.stringify(rawItems)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Eres el HAWKIN WAR ROOM COMMAND CENTER. Genera inteligencia de élite en JSON puro." },
        { role: "user", content: MASTER_PROMPT }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    let intelReport;
    
    try {
      intelReport = JSON.parse(content);
      
      // Enriquecimiento de datos para el UI
      if (intelReport.topNews) {
        const aiNews = intelReport.topNews.map((n: any) => ({
          ...n,
          id: generateId(n.title),
          timestamp: new Date().toISOString()
        }));

        // MEZCLAR Y PRIORIZAR MANUALES
        intelReport.topNews = [...manualIntel, ...aiNews].slice(0, 10);
      }
    } catch (e) {
      console.error("Failed to parse AI JSON:", content);
      return NextResponse.json({ error: "Sincronizando flujos de datos..." }, { status: 500 });
    }

    cachedIntel = intelReport;
    lastUpdate = now;

    return NextResponse.json({ ...intelReport, lastUpdate: new Date(now).toLocaleTimeString('es-PE') });

  } catch (error: any) {
    console.error("War Room API Error:", error);
    return NextResponse.json({ error: "Interferencia en el canal de inteligencia." }, { status: 500 });
  }
}
