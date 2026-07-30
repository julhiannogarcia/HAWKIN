import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import {
  ARENA_MODEL_REGISTRY,
  ARENA_SCORE_LABEL,
  findArenaModel,
  mentionScore,
  type ArenaModelMeta,
} from '@/lib/arenaModels';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type NewsSnippet = { title: string; summary?: string; url?: string };

type AiArenaRow = {
  slug: string;
  score: number;
  change24h: number;
  change7d: number;
  whatsNew: string;
  benefits: string[];
  debate: string;
  sourceUrl?: string;
};

export type ArenaModel = ArenaModelMeta & {
  score: number;
  change24h: number;
  change7d: number;
  scoreLabel: string;
  whatsNew: string;
  benefits: string[];
  debate: string;
  sourceUrl?: string;
  rank: number;
};

let cached: { payload: unknown; at: number } | null = null;
const CACHE_MS = 120_000;

function getSiteUrl() {
  if (process.env.URL) return process.env.URL.replace(/\/$/, '');
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://127.0.0.1:3000';
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getSiteUrl()}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

function collectSnippets(masterIntel: any, newsLive: any): NewsSnippet[] {
  const items: NewsSnippet[] = [];
  for (const n of masterIntel?.topNews || []) {
    items.push({ title: n.title || '', summary: n.summary, url: n.url });
  }
  for (const n of newsLive?.news || []) {
    items.push({ title: n.title || '', summary: n.excerpt, url: n.url });
  }
  return items.filter((n) => n.title.length > 5).slice(0, 35);
}

function buildFallbackRows(snippets: NewsSnippet[]): AiArenaRow[] {
  const baseScore = 1180;
  return ARENA_MODEL_REGISTRY.map((meta) => {
    let mentions = 0;
    let bestTitle = '';
    let bestUrl: string | undefined;

    for (const snip of snippets) {
      const blob = `${snip.title} ${snip.summary || ''}`;
      const hit = mentionScore(blob, meta.aliases);
      if (hit > 0) {
        mentions += hit;
        if (!bestTitle) {
          bestTitle = snip.title;
          bestUrl = snip.url;
        }
      }
    }

    const rival = findArenaModel(meta.rivalSlug);
    const score = baseScore + mentions * 18 + (meta.region === 'CN' ? 5 : 0);
    const change24h = Number((mentions * 0.4 - 0.5).toFixed(1));
    const change7d = Number((mentions * 1.2).toFixed(1));

    return {
      slug: meta.slug,
      score,
      change24h,
      change7d,
      whatsNew: bestTitle || 'Sin novedad verificada en titulares recientes.',
      benefits: [
        meta.license === 'OPEN'
          ? 'Pesos abiertos: despliegue local y auditoría posible.'
          : 'Modelo propietario con integración de producto.',
        `Desarrollado por ${meta.company} (${meta.region}).`,
        mentions > 0
          ? 'Momentum detectado en cobertura mediática reciente.'
          : 'Sin menciones destacadas en el ciclo actual — score estimado.',
      ],
      debate:
        mentions > 0 && rival
          ? `Sube por cobertura reciente vs ${rival.name}. ${meta.license === 'OPEN' ? 'Ventaja en costo/despliegue local.' : 'Ventaja en producto integrado y escala.'}`
          : rival
            ? `Compite directamente con ${rival.name} por adopción ${meta.region === 'CN' ? 'en Asia' : 'global'}.`
            : 'Posición estable en el ranking HAWKIN Index.',
      sourceUrl: bestUrl,
    };
  }).sort((a, b) => b.score - a.score);
}

async function scoreWithGemini(snippets: NewsSnippet[]): Promise<AiArenaRow[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || snippets.length === 0) return null;

  const slugs = ARENA_MODEL_REGISTRY.map((m) => m.slug).join(', ');
  const prompt = `Eres HAWKIN Arena. Analiza SOLO estas noticias REALES de IA.
Calcula ranking estimado (HAWKIN Index 1000-1450, NO es Elo oficial LMSYS) para modelos: ${slugs}.
Incluye sí o sí: kimi-k3, deepseek-r1, qwen-3-max, claude-opus-4, gpt-5, gemini-2-5-pro, llama-4, grok-4.
Reglas:
- NO inventes lanzamientos no mencionados en noticias.
- benefits: 3-5 bullets cortos en español para usuario final.
- debate: 1 párrafo comparando vs rival directo (USA vs China si aplica).
- whatsNew: última novedad REAL del titular más relevante.
- change24h (-5 a +8), change7d (-10 a +15).

Noticias:
${JSON.stringify(snippets.slice(0, 22))}

JSON:
{"models":[{"slug":"kimi-k3","score":1280,"change24h":1.2,"change7d":4.5,"whatsNew":"...","benefits":["..."],"debate":"...","sourceUrl":""}]}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt.slice(0, 14000));
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as { models?: AiArenaRow[] };
    if (!Array.isArray(parsed.models) || parsed.models.length < 8) return null;
    return parsed.models.filter((m) => m.slug && typeof m.score === 'number');
  } catch {
    return null;
  }
}

async function scoreWithGroq(snippets: NewsSnippet[]): Promise<AiArenaRow[] | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || snippets.length === 0) return null;

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'HAWKIN Arena analyst. JSON {"models":[{slug,score,change24h,change7d,whatsNew,benefits[],debate,sourceUrl}]}. Solo hechos de noticias. Incluir Kimi K3 y modelos China.',
        },
        { role: 'user', content: JSON.stringify(snippets.slice(0, 18)) },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.15,
      response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    if (!Array.isArray(parsed.models) || parsed.models.length < 8) return null;
    return parsed.models;
  } catch {
    return null;
  }
}

function mergeModels(aiRows: AiArenaRow[]): ArenaModel[] {
  const sorted = [...aiRows].sort((a, b) => b.score - a.score);

  return sorted
    .map((row, index) => {
      const meta = findArenaModel(row.slug);
      if (!meta) return null;
      return {
        ...meta,
        score: Math.round(Math.min(1500, Math.max(900, row.score))),
        change24h: Number(row.change24h.toFixed(1)),
        change7d: Number(row.change7d.toFixed(1)),
        scoreLabel: ARENA_SCORE_LABEL,
        whatsNew: row.whatsNew || 'Sin novedad destacada en el ciclo actual.',
        benefits: Array.isArray(row.benefits) ? row.benefits.slice(0, 5) : [],
        debate: row.debate || 'Análisis en curso.',
        sourceUrl: row.sourceUrl,
        rank: index + 1,
      };
    })
    .filter(Boolean) as ArenaModel[];
}

function ensureRequiredModels(models: ArenaModel[], fallbackRows: AiArenaRow[]): ArenaModel[] {
  const bySlug = new Map(models.map((m) => [m.slug, m]));
  const required = ['kimi-k3', 'deepseek-r1', 'gpt-5', 'claude-opus-4', 'gemini-2-5-pro', 'qwen-3-max'];

  for (const slug of required) {
    if (!bySlug.has(slug)) {
      const fb = fallbackRows.find((r) => r.slug === slug);
      const meta = findArenaModel(slug);
      if (fb && meta) {
        bySlug.set(slug, {
          ...meta,
          score: fb.score,
          change24h: fb.change24h,
          change7d: fb.change7d,
          scoreLabel: ARENA_SCORE_LABEL,
          whatsNew: fb.whatsNew,
          benefits: fb.benefits,
          debate: fb.debate,
          sourceUrl: fb.sourceUrl,
          rank: 0,
        });
      }
    }
  }

  const merged = [...bySlug.values()].sort((a, b) => b.score - a.score);
  return merged.map((m, i) => ({ ...m, rank: i + 1 })).slice(0, 15);
}

export async function GET() {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) {
    return NextResponse.json(cached.payload);
  }

  try {
    const [newsLive, masterIntel] = await Promise.all([
      fetchJson<any>('/api/news/live'),
      fetchJson<any>('/api/news/master-intel'),
    ]);

    const snippets = collectSnippets(masterIntel, newsLive);
    if (snippets.length === 0) {
      return NextResponse.json({
        models: [],
        updatedAt: new Date().toISOString(),
        source: 'none',
        error: true,
        message: 'Sin datos nuevos',
      });
    }

    const fallbackRows = buildFallbackRows(snippets);
    let aiRows = await scoreWithGemini(snippets);
    let source = 'gemini+feeds';

    if (!aiRows || aiRows.length < 8) {
      aiRows = await scoreWithGroq(snippets);
      source = 'groq+feeds';
    }

    if (!aiRows || aiRows.length < 8) {
      aiRows = fallbackRows;
      source = 'news-mentions';
    }

    const models = ensureRequiredModels(mergeModels(aiRows), fallbackRows);

    const payload = {
      models,
      updatedAt: new Date().toISOString(),
      source,
      scoreLabel: ARENA_SCORE_LABEL,
      disclaimer: 'HAWKIN Index (estimado) — no es el Elo oficial de LMSYS Chatbot Arena.',
      newsCount: snippets.length,
    };

    cached = { payload, at: now };
    return NextResponse.json(payload);
  } catch (error) {
    console.error('ARENA API ERR:', error);
    return NextResponse.json({
      models: [],
      updatedAt: new Date().toISOString(),
      source: 'error',
      error: true,
      message: 'Sin datos nuevos',
    });
  }
}
