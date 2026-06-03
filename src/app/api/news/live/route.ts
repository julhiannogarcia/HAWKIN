import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// FULL PROJECT TITAN AI PROMPT
const TITAN_SYSTEM_PROMPT = `
# PROJECT TITAN AI - GLOBAL AI INTELLIGENCE NETWORK
TU IDENTIDAD: No eres un chatbot. Eres una red global de inteligencia tecnológica. Tu misión es generar INTELIGENCIA ESTRATÉGICA, no solo informar.

MISIÓN:
- Detectar patrones ocultos, consecuencias y riesgos.
- Identificar rumores creíbles y filtraciones de Silicon Valley.
- Analizar la "War Room": OpenAI vs Google, NVIDIA vs AMD, EEUU vs China.

FORMATO DE SALIDA (JSON):
Debes analizar la noticia y responder con este esquema:
{
  "title": "Título corto y autoritario",
  "strategic_summary": "Resumen ejecutivo de 3 frases: Impacto, Consecuencia y Oportunidad.",
  "category": "🚨 GUERRA DE CHIPS | 🧠 CARRERA AGI | 🔥 RUMORES & CEOS | 🛡️ SHIELD INTEL | 📈 INVERSIÓN | 🚀 BIG TECH",
  "intel_level": "Nivel de importancia 1-10",
  "prediction_30d": "Qué pasará en los próximos 30 días",
  "risk_factor": "Bajo/Medio/Alto/Crítico"
}
`;

function generateShortId(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function GET() {
  try {
    let openai: any = null;
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    // FUENTES PRIORITARIAS MUNDIALES
    const FEEDS = [
      'https://news.google.com/rss/search?q=NVIDIA+Blackwell+RTX+5090+OpenAI+GPT-5+Sora+Apple+Intelligence+Sam+Altman+latest&hl=es-419&gl=US&ceid=US:es-419',
      'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
      'https://techcrunch.com/category/artificial-intelligence/feed/',
      'https://www.wired.com/feed/category/ai/latest/rss'
    ];

    const feedResults = await Promise.all(FEEDS.map(url => parser.parseURL(url).catch(() => ({ items: [] }))));
    const allRawItems = feedResults.flatMap(f => f.items).sort((a, b) => 
      new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    ).slice(0, 15);

    const processedNews = await Promise.all(allRawItems.slice(0, 10).map(async (item) => {
      const uniqueId = generateShortId(item.link || item.title || "");
      
      let titanData = {
        title: item.title?.split(' - ')[0] || "Señal de Inteligencia Detectada",
        strategic_summary: item.contentSnippet?.substring(0, 160) + "..." || "Analizando flujo de datos...",
        category: "🚀 BIG TECH",
        intel_level: "7",
        prediction_30d: "Monitoreo en curso.",
        risk_factor: "Medio"
      };

      if (openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: TITAN_SYSTEM_PROMPT },
              { role: "user", content: `Analiza esta noticia para HAWKIN:\nTítulo: ${item.title}\nResumen: ${item.contentSnippet}` }
            ],
            response_format: { type: "json_object" }
          });
          
          const content = JSON.parse(completion.choices[0].message.content || '{}');
          titanData = { ...titanData, ...content };
        } catch (e) {
          console.error("Titan AI Processing Error:", e);
        }
      }

      const getRealImage = (title: string, category: string) => {
        const t = title.toLowerCase();
        const c = category.toLowerCase();
        const base = "https://images.unsplash.com/";
        if (t.includes("nvidia") || t.includes("blackwell") || t.includes("gpu") || c.includes("chips")) 
          return `${base}photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("openai") || t.includes("gpt") || t.includes("altman")) 
          return `${base}photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("musk") || t.includes("xai") || t.includes("tesla"))
          return `${base}photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (c.includes("shield") || t.includes("cyber") || t.includes("hack"))
          return `${base}photo-1633265486232-442b85c74e5f?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        return `${base}photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
      };

      return {
        id: uniqueId,
        title: titanData.title,
        category: titanData.category,
        excerpt: titanData.strategic_summary,
        author: "HAWKIN Intelligence",
        date: "Sincronizado Hoy",
        timestamp: new Date(item.pubDate || Date.now()).getTime(),
        image: getRealImage(titanData.title + " " + item.title, titanData.category),
        url: item.link,
        source: item.source?.name || "Radar Global",
        intelLevel: titanData.intel_level,
        prediction30d: titanData.prediction_30d,
        riskFactor: titanData.risk_factor
      };
    }));

    return NextResponse.json({
      news: processedNews,
      status: "Titan Engine Live v2.0"
    });
  } catch (error) {
    console.error("Titan Engine Critical Failure:", error);
    return new NextResponse("Error en el Motor de Inteligencia", { status: 500 });
  }
}
