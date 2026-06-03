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
TU IDENTIDAD: Eres un Analista de Inteligencia Tecnológica Global de élite. Tu misión es generar INTELIGENCIA ESTRATÉGICA de alto nivel.

REGLAS DE OPERACIÓN:
1. No inventar datos.
2. No presentar rumores como hechos.
3. Si la información es insuficiente, indícalo claramente.
4. Priorizar IA, OpenAI, Anthropic, Gemini, NVIDIA, xAI, Meta, Microsoft, Google DeepMind, Apple, Amazon, Tesla, robótica, AGI, chips, agentes IA, startups e inversiones.
5. Escribir como una firma profesional de inteligencia tecnológica.

OBJETIVO:
Para cada noticia debes identificar:
- Qué ocurrió.
- Por qué es importante.
- Quién gana.
- Quién pierde.
- Qué empresas están involucradas.
- Qué CEOs/Personas están involucradas.
- Qué consecuencias podría tener.
- Qué oportunidades genera.
- Qué riesgos genera.
- Qué podría pasar en los próximos 30 días.

FORMATO DE SALIDA OBLIGATORIO (JSON):
{
  "title": "Título estratégico, corto y autoritario",
  "executive_summary": "Resumen ejecutivo de máximo 3 frases",
  "what_happened": "Descripción objetiva de los hechos",
  "why_it_matters": "Análisis de impacto e importancia",
  "companies": ["Empresa 1"],
  "people": ["Persona 1"],
  "winners": ["Ganador 1"],
  "losers": ["Perdedor 1"],
  "innovation_score": 8.5,
  "importance_score": 9.0,
  "risk_factor": "Bajo/Medio/Alto/Crítico",
  "prediction_30d": "Proyección a 30 días",
  "market_impact": "Impacto en el mercado"
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
      // Oficiales
      'https://openai.com/news/rss.xml',
      'https://nvidianews.nvidia.com/releases.xml',
      'https://deepmind.google/blog/rss.xml',

      // IA y Big Tech
      'https://techcrunch.com/category/artificial-intelligence/feed/',
      'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
      'https://www.wired.com/feed/category/ai/latest/rss',
      'https://venturebeat.com/category/ai/feed/',

      // Investigación
      'http://export.arxiv.org/rss/cs.AI',
      'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',

      // Mercados y tecnología
      'https://www.reutersagency.com/feed/?best-topics=technology&post_type=best'
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
        intel_level: "7.0",
        prediction_30d: "Monitoreo en curso.",
        risk_factor: "Medio",
        content: ""
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
          
          // Mapeo seguro del nuevo JSON avanzado al modelo de la UI
          const richContent = [
            content.what_happened ? `QUÉ OCURRIÓ: ${content.what_happened}` : '',
            content.why_it_matters ? `POR QUÉ ES IMPORTANTE: ${content.why_it_matters}` : '',
            content.market_impact ? `IMPACTO DE MERCADO: ${content.market_impact}` : '',
            content.winners?.length ? `GANADORES: ${content.winners.join(', ')}` : '',
            content.losers?.length ? `PERDEDORES: ${content.losers.join(', ')}` : '',
            content.companies?.length ? `EMPRESAS INVOLUCRADAS: ${content.companies.join(', ')}` : '',
            content.people?.length ? `FIGURAS CLAVE: ${content.people.join(', ')}` : '',
            content.prediction_30d ? `PROYECCIÓN A 30 DÍAS: ${content.prediction_30d}` : ''
          ].filter(Boolean).join('\\n\\n');

          titanData = {
            title: content.title || titanData.title,
            strategic_summary: content.executive_summary || titanData.strategic_summary,
            category: content.companies?.length ? content.companies[0].toUpperCase() : "INTEL HUB",
            intel_level: content.importance_score ? String(content.importance_score) : titanData.intel_level,
            prediction_30d: content.prediction_30d || titanData.prediction_30d,
            risk_factor: content.risk_factor || titanData.risk_factor,
            content: richContent
          };
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
