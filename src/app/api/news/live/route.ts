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

// =====================================================================
// INTELIGENCIA DE RESPALDO PROFESIONAL (GARANTÍA DE DISPONIBILIDAD)
// =====================================================================
const FALLBACK_NEWS = [
  { id: 'f1', title: "NVIDIA Blackwell: Dominio del Hardware AGI", category: "🚀 CHIPS", excerpt: "Arquitectura Blackwell demuestra eficiencia energética sin precedentes.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "9.8", trustScore: 99 },
  { id: 'f2', title: "OpenAI o3: Razonamiento Lógico de Nivel Humano", category: "🧠 MODELS", excerpt: "Nueva frontera en resolución de tareas complejas y matemáticas.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "9.5", trustScore: 98 },
  { id: 'f3', title: "Google DeepMind: Revolución en Biología Digital", category: "🧬 HEALTH", excerpt: "AlphaFold 3 acelera el descubrimiento de fármacos a escala global.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "9.2", trustScore: 97 },
  { id: 'f4', title: "Anthropic Claude 3.5: Liderazgo en Benchmarks", category: "📊 BENCHMARKS", excerpt: "Supera a GPT-4o en razonamiento y generación de código.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "9.4", trustScore: 96 },
  { id: 'f5', title: "xAI Colossus: El Clúster más Potente del Mundo", category: "💻 INFRA", excerpt: "Ecosistema de Memphis acelera el entrenamiento de Grok-3.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "9.1", trustScore: 95 },
  { id: 'f6', title: "Regulación IA: Nuevos Marcos en la UE y EEUU", category: "⚖️ LAW", excerpt: "Estándares de transparencia para modelos de frontera.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "8.5", trustScore: 99 },
  { id: 'f7', title: "Apple Intelligence: IA Local en Millones de Nodos", category: "📱 MOBILE", excerpt: "Integración masiva en iOS redefine la privacidad del usuario.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "8.8", trustScore: 94 },
  { id: 'f8', title: "Microsoft Copilot: Adopción Empresarial Masiva", category: "🏢 B2B", excerpt: "Transformación del flujo de trabajo en corporaciones Fortune 500.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "8.9", trustScore: 93 },
  { id: 'f9', title: "Tesla FSD v13: Autonomía Urbana de Élite", category: "🚗 AUTO", excerpt: "Avances significativos en navegación por visión computacional.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "9.0", trustScore: 92 },
  { id: 'f10', title: "Figure AI: Humanoides en Líneas de Producción", category: "🤖 ROBOTS", excerpt: "Despliegue exitoso de robots autónomos en fábricas reales.", author: "HAWKIN Analyst", date: "Sincronizado", intelLevel: "9.3", trustScore: 91 }
];

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
      'https://www.reutersagency.com/feed/?best-topics=technology&post_type=best',
      'https://news.google.com/rss/search?q=Artificial+Intelligence+Business+NVIDIA+OpenAI&hl=en-US&gl=US&ceid=US:en'
    ];

    const feedResults = await Promise.all(FEEDS.map(url => parser.parseURL(url).catch(() => ({ items: [] }))));
    const allRawItems = feedResults.flatMap(f => f.items);

    const seenTitles = new Set();
    const uniqueItems = allRawItems.filter(item => {
      const titleClean = item.title?.toLowerCase().trim();
      if (!titleClean || seenTitles.has(titleClean)) return false;
      seenTitles.add(titleClean);
      return true;
    });

    const KEY_COMPANIES = ['openai', 'nvidia', 'anthropic', 'deepmind', 'microsoft', 'meta', 'xai', 'amazon', 'apple', 'mistral', 'perplexity', 'figure'];
    const KEY_CEOS = ['altman', 'musk', 'huang', 'hassabis', 'amodei', 'nadella', 'zuckerberg', 'pichai', 'sutskever', 'wang'];
    const HIGH_IMPACT = ['agi', 'gpt', 'gemini', 'claude', 'blackwell', 'robótica', 'robot', 'humanoides', 'chips', 'adquisición', 'funding', 'inversión', 'llm', 'autonomous'];

    const scoredItems = uniqueItems.map(item => {
      let score = 0;
      const text = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
      KEY_COMPANIES.forEach(c => { if (text.includes(c)) score += 12; });
      KEY_CEOS.forEach(p => { if (text.includes(p)) score += 18; });
      HIGH_IMPACT.forEach(w => { if (text.includes(w)) score += 25; });
      return { ...item, titanScore: score };
    });

    const finalSelection = scoredItems
      .sort((a, b) => b.titanScore - a.titanScore)
      .slice(0, 20);

    const processedNews = await Promise.all(finalSelection.map(async (item) => {
      const uniqueId = generateShortId(item.link || item.title || "");
      
      let titanData = {
        title: item.title?.split(' - ')[0] || "Señal Detectada",
        strategic_summary: item.contentSnippet?.substring(0, 200) + "..." || "Analizando flujo...",
        category: "🚀 INTEL",
        intel_level: "7.5",
        content: ""
      };

      if (openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: TITAN_SYSTEM_PROMPT },
              { role: "user", content: `Analiza: ${item.title}\n${item.contentSnippet}` }
            ],
            response_format: { type: "json_object" }
          });
          const content = JSON.parse(completion.choices[0].message.content || '{}');
          titanData = {
            title: content.title || titanData.title,
            strategic_summary: content.executive_summary || titanData.strategic_summary,
            category: content.companies?.length ? content.companies[0].toUpperCase() : "AI HUB",
            intel_level: content.importance_score ? String(content.importance_score) : "8.0",
            content: ""
          };
        } catch (e) { console.error("Titan AI Skip:", e); }
      }

      return {
        id: uniqueId,
        title: titanData.title,
        category: titanData.category,
        excerpt: titanData.strategic_summary,
        author: "HAWKIN Analyst",
        date: "Sincronizado Hoy",
        timestamp: new Date(item.pubDate || Date.now()).getTime(),
        image: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&sig=${uniqueId}`,
        url: item.link,
        source: item.source?.name || "Radar Global",
        intelLevel: titanData.intel_level,
        trustScore: 98
      };
    }));

    let newsPool = [...processedNews];
    if (newsPool.length < 10) {
      newsPool = [...newsPool, ...FALLBACK_NEWS.slice(0, 10 - newsPool.length)];
    }

    return NextResponse.json({
      news: newsPool.slice(0, 15),
      status: "Titan Analyst v7.5 Online",
      cacheTTL: "300s"
    });
  } catch (error) {
    console.error("Titan Critical Failure:", error);
    return NextResponse.json({
      news: FALLBACK_NEWS,
      status: "Degraded Mode // Fallback Active",
      cacheTTL: "0s"
    });
  }
}
