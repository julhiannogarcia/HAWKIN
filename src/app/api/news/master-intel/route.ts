import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Caching layer to avoid hitting API limits
let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Socio, falta el núcleo de energía de IA." }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const now = Date.now();
    if (cachedIntel && (now - lastUpdate < CACHE_DURATION)) {
      return NextResponse.json(cachedIntel);
    }

    // 1. RECOPILAR INTELIGENCIA BRUTA (RSS)
    const FEEDS = [
      'https://news.google.com/rss/search?q=OpenAI+NVIDIA+Tesla+Anthropic+startups+AI+AGI+breaking&hl=es-419&gl=US&ceid=US:es-419',
      'https://news.google.com/rss/search?q=Sam+Altman+Elon+Musk+Jensen+Huang+Satya+Nadella+tech+CEO+scoop&hl=es-419&gl=US&ceid=US:es-419'
    ];

    const results = await Promise.all(FEEDS.map(url => parser.parseURL(url)));
    const rawItems = results.flatMap(res => res.items).slice(0, 15).map(item => ({
      title: item.title,
      content: item.contentSnippet,
      date: item.pubDate
    }));

    // 2. PROCESAMIENTO CON MASTER PROMPT (MOTOR ALPHA)
    const MASTER_PROMPT = `
      Actúa como un sistema de inteligencia periodística mundial especializado exclusivamente en Inteligencia Artificial.
      Tu misión es monitorear, analizar y reportar en tiempo real las noticias más importantes sobre IA, tecnología avanzada, robótica, computación cuántica, startups tecnológicas, AGI y guerras tecnológicas.

      OBJETIVOS:
      1. Detectar noticias bomba y rumores.
      2. Analizar conflictos entre empresas y CEOs.
      3. Identificar tecnologías disruptivas.

      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "topNews": [
          { "title": "TITULO", "summary": "RESUMEN", "impact": 1-10, "companies": [], "people": [], "consequence": "POSIBLE CONSECUENCIA", "importance": "ALTO/CRITICO" }
        ],
        "rumors": [
          { "text": "RUMOR", "source": "FUENTE", "credibility": "ALTO/MEDIO", "probability": "0-100%" }
        ],
        "battles": [
          { "competitors": "Empresa A vs Empresa B", "motive": "MOTIVO", "status": "SITUACION ACTUAL", "winners": "POSIBLES GANADORES" }
        ],
        "trendingCEOs": [
          { "name": "Nombre", "company": "Empresa", "reason": "Motivo" }
        ],
        "emergingTech": [],
        "prediction": { "dominance": "EMPRESA DOMINANTE", "ceo": "CEO INFLUYENTE", "tech": "TECNOLOGIA CLAVE", "risk": "RIESGO" }
      }

      NOTICIAS PARA ANALIZAR: ${JSON.stringify(rawItems)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Eres el Command Center de HAWKIN. Responde siempre en JSON puro." },
        { role: "user", content: MASTER_PROMPT }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const intelReport = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    cachedIntel = intelReport;
    lastUpdate = now;

    return NextResponse.json(intelReport);

  } catch (error: any) {
    console.error("Intel Engine Error:", error);
    return NextResponse.json({ error: "Sincronizando Sistema Alpha..." }, { status: 500 });
  }
}
