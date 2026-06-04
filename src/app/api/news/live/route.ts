import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutos de caché inteligente (Cerebro Frío)

const parser = new Parser();

const TITAN_SYSTEM_PROMPT = `
# PROJECT TITAN AI - GLOBAL AI INTELLIGENCE NETWORK
TU IDENTIDAD: Eres un Analista de Inteligencia Tecnológica Global de élite. Tu misión es generar INTELIGENCIA ESTRATÉGICA de alto nivel.

REGLAS DE OPERACIÓN:
1. No inventar datos. No presentar rumores como hechos.
2. Si la información es insuficiente, indícalo claramente.
3. Priorizar IA, OpenAI, Anthropic, Gemini, NVIDIA, xAI, Meta, Microsoft, Google DeepMind, Apple, Amazon, Tesla, robótica, AGI, chips, agentes IA, startups e inversiones.
4. Escribir como una firma profesional de inteligencia tecnológica.

OBJETIVO DEL FEED DE INTELIGENCIA:
Las noticias son el combustible. Para cada noticia debes responder claramente:
1. Qué ocurrió (what_happened)
2. Por qué importa (why_it_matters)
3. Quién gana (winners)
4. Quién pierde (losers)
5. Riesgo (risk)
6. Oportunidad (opportunity)
7. Impacto de mercado (market_impact)
8. Predicción a 30 días (prediction_30d)

FORMATO DE SALIDA OBLIGATORIO (JSON):
{
  "title": "Título estratégico, corto y autoritario",
  "executive_summary": "Resumen ejecutivo de máximo 3 frases",
  "what_happened": "Hechos confirmados",
  "why_it_matters": "Por qué es relevante a nivel global",
  "winners": ["Ganador 1"],
  "losers": ["Perdedor 1"],
  "risk": "Riesgos detectados",
  "opportunity": "Oportunidades generadas",
  "market_impact": "Impacto en mercado y capital",
  "prediction_30d": "Qué pasará en 30 días",
  "companies": ["Empresa clave"],
  "importance_score": 9.5
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

    const FEEDS = [
      'https://openai.com/news/rss.xml',
      'https://nvidianews.nvidia.com/releases.xml',
      'https://deepmind.google/blog/rss.xml',
      'https://techcrunch.com/category/artificial-intelligence/feed/',
      'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
      'https://www.wired.com/feed/category/ai/latest/rss',
      'https://venturebeat.com/category/ai/feed/',
      'http://export.arxiv.org/rss/cs.AI',
      'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',
      'https://www.reutersagency.com/feed/?best-topics=technology&post_type=best'
    ];

    const feedResults = await Promise.all(FEEDS.map(url => parser.parseURL(url).catch(() => ({ items: [] }))));
    const allRawItems = feedResults.flatMap(f => f.items);

    // DEDUPLICACIÓN
    const seenTitles = new Set();
    const uniqueItems = allRawItems.filter(item => {
      const titleClean = item.title?.toLowerCase().trim();
      if (!titleClean || seenTitles.has(titleClean)) return false;
      seenTitles.add(titleClean);
      return true;
    });

    // SCORING
    const KEY_COMPANIES = ['openai', 'nvidia', 'anthropic', 'deepmind', 'microsoft', 'meta', 'xai', 'amazon', 'apple', 'mistral', 'perplexity'];
    const KEY_CEOS = ['altman', 'musk', 'huang', 'hassabis', 'amodei', 'nadella', 'zuckerberg', 'pichai', 'sutskever', 'wang'];
    const HIGH_IMPACT = ['agi', 'gpt', 'gemini', 'claude', 'blackwell', 'robótica', 'robot', 'humanoides', 'data center', 'chips', 'adquisición', 'funding', 'inversión', '100m', 'multimillonaria'];
    const ELITE_SOURCES = ['openai', 'nvidia', 'deepmind', 'reuters'];

    const scoredItems = uniqueItems.map(item => {
      let score = 0;
      const text = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
      const source = (item.source?.name || "").toLowerCase();

      KEY_COMPANIES.forEach(c => { if (text.includes(c)) score += 10; });
      KEY_CEOS.forEach(p => { if (text.includes(p)) score += 15; });
      HIGH_IMPACT.forEach(w => { if (text.includes(w)) score += 20; });
      ELITE_SOURCES.forEach(s => { if (source.includes(s)) score += 5; });

      return { ...item, titanScore: score };
    });

    const sourceCount: Record<string, number> = {};
    const finalSelection = scoredItems
      .sort((a, b) => b.titanScore - a.titanScore)
      .filter(item => {
        const srcName = item.source?.name || 'Unknown';
        if ((sourceCount[srcName] || 0) >= 2) return false;
        sourceCount[srcName] = (sourceCount[srcName] || 0) + 1;
        return true;
      })
      .slice(0, 10);

    const processedNews = await Promise.all(finalSelection.map(async (item) => {
      const uniqueId = generateShortId(item.link || item.title || "");
      
      let titanData = {
        title: item.title?.split(' - ')[0] || "Señal de Inteligencia Detectada",
        strategic_summary: item.contentSnippet?.substring(0, 160) + "..." || "Analizando flujo de datos...",
        category: "🚀 BIG TECH",
        intel_level: "7.0",
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
          
          const richContent = [
            content.what_happened ? `QUÉ OCURRIÓ:\n${content.what_happened}` : '',
            content.why_it_matters ? `POR QUÉ ES IMPORTANTE:\n${content.why_it_matters}` : '',
            content.winners?.length ? `GANADORES:\n${content.winners.join(', ')}` : '',
            content.losers?.length ? `PERDEDORES:\n${content.losers.join(', ')}` : '',
            content.opportunity ? `OPORTUNIDAD:\n${content.opportunity}` : '',
            content.risk ? `RIESGO:\n${content.risk}` : '',
            content.market_impact ? `IMPACTO DE MERCADO:\n${content.market_impact}` : '',
            content.prediction_30d ? `PREDICCIÓN A 30 DÍAS:\n${content.prediction_30d}` : ''
          ].filter(Boolean).join('\\n\\n');

          titanData = {
            title: content.title || titanData.title,
            strategic_summary: content.executive_summary || titanData.strategic_summary,
            category: content.companies?.length ? content.companies[0].toUpperCase() : "INTEL HUB",
            intel_level: content.importance_score ? String(content.importance_score) : titanData.intel_level,
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
        author: "HAWKIN Analyst Agent",
        date: "Sincronizado Hoy",
        timestamp: new Date(item.pubDate || Date.now()).getTime(),
        image: getRealImage(titanData.title + " " + item.title, titanData.category),
        url: item.link,
        source: item.source?.name || "Radar Global",
        intelLevel: titanData.intel_level,
        content: titanData.content,
        // --- V7.5 TRUST SCORE ENGINE ---
        trustScore: score > 30 ? 98 : score > 15 ? 85 : 70, // Base algorítmica temporal antes de mover a DB
        lastVerified: new Date().toISOString()
      };
    }));

    return NextResponse.json({
      news: processedNews,
      status: "Titan Analyst Agent v7.5 Live",
      cacheTTL: "300s"
    });
  } catch (error) {
    console.error("Titan Engine Critical Failure:", error);
    return new NextResponse("Error en el Motor de Inteligencia", { status: 500 });
  }
}
