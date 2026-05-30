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

    // 1. RECOPILAR INTELIGENCIA BRUTA (FUENTES DE ALTA CREDIBILIDAD)
    const FEEDS = [
      'https://news.google.com/rss/search?q=OpenAI+NVIDIA+Tesla+Anthropic+startups+AI+AGI+breaking&hl=en-US&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=Sam+Altman+Elon+Musk+Jensen+Huang+tech+CEO+leak+rumor&hl=en-US&gl=US&ceid=US:en',
      'https://hnrss.org/frontpage?q=AI'
    ];

    const results = await Promise.all(FEEDS.map(url => parser.parseURL(url)));
    const rawItems = results.flatMap(res => res.items).slice(0, 20).map(item => ({
      title: item.title,
      snippet: item.contentSnippet?.substring(0, 300),
      source: item.source?.name || "Global Intel",
      link: item.link
    }));

    // 2. MOTOR DE INTELIGENCIA DE GRADO MILITAR (MASTER PROMPT)
    const MASTER_PROMPT = `
      Actúa como un sistema de inteligencia periodística mundial especializado exclusivamente en Inteligencia Artificial.
      Analiza los siguientes datos y genera un reporte estructurado en JSON.

      OBJETIVOS:
      1. Detectar noticias bomba, rumores y filtraciones.
      2. Analizar conflictos entre empresas y CEOs (OpenAI vs Google, etc).
      3. Identificar tecnologías disruptivas y startups a vigilar.

      FORMATO JSON REQUERIDO:
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
        "emergingTech": ["Tecnología A", "Tech B"],
        "startups": ["Startup A (Crecimiento X%)"],
        "prediction": { "dominance": "EMPRESA DOMINANTE", "ceo": "CEO INFLUYENTE", "tech": "TECNOLOGIA CLAVE", "risk": "RIESGO MAYOR" }
      }

      NOTICIAS PARA PROCESAR: ${JSON.stringify(rawItems)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Eres el HAWKIN WAR ROOM COMMAND CENTER. Genera inteligencia de élite en JSON puro." },
        { role: "user", content: MASTER_PROMPT }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Menos creatividad, más precisión
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    let intelReport;
    
    try {
      intelReport = JSON.parse(content);
      
      // Enriquecimiento de datos para el UI
      if (intelReport.topNews) {
        intelReport.topNews = intelReport.topNews.map((n: any) => ({
          ...n,
          id: generateId(n.title),
          timestamp: new Date().toISOString()
        }));
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
