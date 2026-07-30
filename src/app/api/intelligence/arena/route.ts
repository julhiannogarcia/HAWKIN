import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import {
  ARENA_DISCLAIMER,
  ARENA_SCORE_LABEL,
  editorialScore,
  findArenaModel,
  getActiveArenaModels,
  mentionScore,
  NO_DEBATE,
  NO_RELEASE_CONFIRMED,
  sanitizeDebate,
  SPECIALIZED_SCORE_CAP,
  type ArenaModelMeta,
} from '@/lib/arenaModels';
import { enrichModelRelease } from '@/lib/releasesWatch';

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
  releaseConfirmed: boolean;
  needsVerification: boolean;
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

function countMentions(meta: ArenaModelMeta, snippets: NewsSnippet[]) {
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
  return { mentions, bestTitle, bestUrl };
}

/** Ranking editorial: piso por release confirmado; menciones solo afinan. Specialized no puede ser #1. */
function buildEditorialRows(snippets: NewsSnippet[]): AiArenaRow[] {
  return getActiveArenaModels()
    .map((meta) => {
      const { mentions, bestTitle, bestUrl } = countMentions(meta, snippets);
      const score = editorialScore(meta, mentions);
      const hasSource = Boolean(bestUrl || meta.releaseSource);

      let debate = NO_DEBATE;
      if (hasSource && meta.whatsNewConfirmed) {
        const rival = findArenaModel(meta.rivalSlug);
        debate = rival
          ? `${meta.name}: release Google/editorial confirmado. Rival directo: ${rival.name}. ${meta.specialized ? 'Variante especializada — no ranking global de inteligencia general.' : 'Flagship en su línea; score editorial HAWKIN, no Elo LMSYS.'}`
          : meta.whatsNewConfirmed.slice(0, 180);
      }

      return {
        slug: meta.slug,
        score,
        change24h: Number((Math.min(3, mentions * 0.3) - 0.2).toFixed(1)),
        change7d: Number(Math.min(8, mentions * 0.8).toFixed(1)),
        whatsNew: meta.whatsNewConfirmed || bestTitle || NO_RELEASE_CONFIRMED,
        benefits:
          meta.benefitsConfirmed && meta.benefitsConfirmed.length > 0
            ? meta.benefitsConfirmed
            : [
                meta.license === 'OPEN'
                  ? 'Pesos abiertos: despliegue local y auditoría posible.'
                  : 'Modelo propietario con integración de producto.',
                `Desarrollado por ${meta.company} (${meta.region}).`,
              ],
        debate: sanitizeDebate(debate, hasSource),
        sourceUrl: bestUrl || meta.releaseSource,
      };
    })
    .sort((a, b) => b.score - a.score);
}

async function scoreWithGemini(snippets: NewsSnippet[]): Promise<AiArenaRow[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || snippets.length === 0) return null;

  const slugs = getActiveArenaModels().map((m) => m.slug).join(', ');
  const prompt = `Eres HAWKIN Arena. Analiza SOLO estas noticias REALES de IA.
Ranking EDITORIAL estimado (HAWKIN Index 1000-1450). NO es Elo LMSYS / Arena.ai.
Modelos: ${slugs}.

REGLAS OBLIGATORIAS:
- Google flagship julio 2026 = gemini-3-6-flash. Debe rankear ARRIBA de gemini-3-5-flash-cyber y gemini-3-5-flash-lite.
- Cyber y Lite son variantes ESPECIALIZADAS: score máximo 1210. NUNCA #1–#3 global.
- NO inventes lanzamientos no mencionados.
- debate: SOLO si hay fuente en las noticias; si no, escribe exactamente: Sin análisis verificado
- PROHIBIDO: "Sube por cobertura reciente", "quién gana la IA", scores inventados de confianza.
- whatsNew: solo hechos del texto o "Sin confirmación de release".
- benefits: 3-5 bullets cortos en español.

Noticias:
${JSON.stringify(snippets.slice(0, 22))}

JSON:
{"models":[{"slug":"gemini-3-6-flash","score":1365,"change24h":0.5,"change7d":2,"whatsNew":"...","benefits":["..."],"debate":"...","sourceUrl":""}]}`;

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
            'HAWKIN Arena editorial. JSON {"models":[{slug,score,change24h,change7d,whatsNew,benefits[],debate,sourceUrl}]}. gemini-3-6-flash > cyber/lite. Specialized max 1210. debate="Sin análisis verificado" si no hay fuente. NO digas Sube por cobertura reciente. NO Elo LMSYS.',
        },
        { role: 'user', content: JSON.stringify(snippets.slice(0, 18)) },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    if (!Array.isArray(parsed.models) || parsed.models.length < 8) return null;
    return parsed.models;
  } catch {
    return null;
  }
}

function applyReleaseTruth(
  meta: ArenaModelMeta,
  row: AiArenaRow,
  snippets: NewsSnippet[]
): Pick<ArenaModel, 'whatsNew' | 'benefits' | 'sourceUrl' | 'releaseConfirmed' | 'needsVerification'> {
  const release = enrichModelRelease(meta, snippets);
  const benefits =
    meta.benefitsConfirmed && meta.benefitsConfirmed.length > 0
      ? meta.benefitsConfirmed
      : Array.isArray(row.benefits)
        ? row.benefits.slice(0, 5)
        : [];

  return {
    whatsNew: release.whatsNew,
    benefits,
    sourceUrl: release.sourceUrl || row.sourceUrl || meta.releaseSource,
    releaseConfirmed: release.releaseConfirmed,
    needsVerification: release.needsVerification,
  };
}

/** Fuerza score editorial: AI no puede poner Cyber/Lite arriba del flagship Google. */
function enforceEditorialScore(meta: ArenaModelMeta, aiScore: number, snippets: NewsSnippet[]): number {
  const { mentions } = countMentions(meta, snippets);
  const floor = editorialScore(meta, mentions);
  // Si AI propone score, acotar cerca del piso editorial (±20), specialized capped
  let score = Math.round((aiScore + floor) / 2);
  score = Math.max(floor - 15, Math.min(floor + 20, score));
  if (meta.specialized) score = Math.min(score, SPECIALIZED_SCORE_CAP);
  // Flagship Google 3.6: mínimo por encima del techo specialized
  if (meta.slug === 'gemini-3-6-flash') {
    score = Math.max(score, SPECIALIZED_SCORE_CAP + 40);
  }
  return Math.round(Math.min(1450, Math.max(900, score)));
}

function mergeModels(aiRows: AiArenaRow[], snippets: NewsSnippet[]): ArenaModel[] {
  const sorted = [...aiRows]
    .map((row) => {
      const meta = findArenaModel(row.slug);
      if (!meta || meta.tier !== 'frontier') return null;
      const truth = applyReleaseTruth(meta, row, snippets);
      const score = enforceEditorialScore(meta, row.score, snippets);
      return {
        ...meta,
        score,
        change24h: Number(Number(row.change24h || 0).toFixed(1)),
        change7d: Number(Number(row.change7d || 0).toFixed(1)),
        scoreLabel: ARENA_SCORE_LABEL,
        whatsNew: truth.whatsNew,
        benefits: truth.benefits,
        debate: sanitizeDebate(row.debate, Boolean(truth.sourceUrl)),
        sourceUrl: truth.sourceUrl,
        releaseConfirmed: truth.releaseConfirmed,
        needsVerification: truth.needsVerification,
        rank: 0,
      };
    })
    .filter(Boolean) as ArenaModel[];

  sorted.sort((a, b) => b.score - a.score);
  return sorted.map((m, i) => ({ ...m, rank: i + 1 }));
}

function ensureRequiredModels(
  models: ArenaModel[],
  fallbackRows: AiArenaRow[],
  snippets: NewsSnippet[]
): ArenaModel[] {
  const bySlug = new Map(models.map((m) => [m.slug, m]));
  const required = [
    'kimi-k3',
    'deepseek-r1',
    'gpt-5',
    'claude-opus-4',
    'gemini-3-6-flash',
    'gemini-3-5-flash-lite',
    'gemini-3-5-flash-cyber',
    'qwen-3-max',
  ];

  for (const slug of required) {
    if (!bySlug.has(slug)) {
      const fb = fallbackRows.find((r) => r.slug === slug);
      const meta = findArenaModel(slug);
      if (fb && meta && meta.tier === 'frontier') {
        const truth = applyReleaseTruth(meta, fb, snippets);
        bySlug.set(slug, {
          ...meta,
          score: enforceEditorialScore(meta, fb.score, snippets),
          change24h: fb.change24h,
          change7d: fb.change7d,
          scoreLabel: ARENA_SCORE_LABEL,
          whatsNew: truth.whatsNew,
          benefits: truth.benefits,
          debate: sanitizeDebate(fb.debate, Boolean(truth.sourceUrl)),
          sourceUrl: truth.sourceUrl,
          releaseConfirmed: truth.releaseConfirmed,
          needsVerification: truth.needsVerification,
          rank: 0,
        });
      }
    }
  }

  const merged = Array.from(bySlug.values()).sort((a, b) => b.score - a.score);
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
    // Incluso sin noticias, el ranking editorial de releases confirmados debe mostrarse
    const fallbackRows = buildEditorialRows(snippets);

    let aiRows: AiArenaRow[] | null = null;
    let source = 'editorial+releases';

    if (snippets.length > 0) {
      aiRows = await scoreWithGemini(snippets);
      if (aiRows && aiRows.length >= 8) {
        source = 'editorial+gemini';
      } else {
        aiRows = await scoreWithGroq(snippets);
        source = aiRows && aiRows.length >= 8 ? 'editorial+groq' : 'editorial+releases';
      }
    }

    if (!aiRows || aiRows.length < 8) {
      aiRows = fallbackRows;
      source = 'editorial+releases';
    }

    const models = ensureRequiredModels(mergeModels(aiRows, snippets), fallbackRows, snippets);

    // Garantía dura: Cyber/Lite nunca #1–#3
    const top3 = models.slice(0, 3);
    const specializedInTop3 = top3.some((m) => m.specialized);
    if (specializedInTop3) {
      models.sort((a, b) => {
        if (a.specialized && !b.specialized) return 1;
        if (!a.specialized && b.specialized) return -1;
        return b.score - a.score;
      });
      models.forEach((m, i) => {
        m.rank = i + 1;
      });
    }

    const payload = {
      models,
      updatedAt: new Date().toISOString(),
      source,
      scoreLabel: ARENA_SCORE_LABEL,
      disclaimer: ARENA_DISCLAIMER,
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
      disclaimer: ARENA_DISCLAIMER,
    });
  }
}
