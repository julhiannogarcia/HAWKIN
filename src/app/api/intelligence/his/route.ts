import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { getLiveMarketAssets } from '@/lib/marketData';
import { HIS_COMPANY_REGISTRY, findCompanyMeta } from '@/lib/hisCompanies';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type NewsSnippet = { title: string; summary?: string; companies?: string[] };

type AiHisRow = {
  id: string;
  his: number;
  change: number;
  confidence: number;
  why: string;
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

function collectNewsSnippets(masterIntel: any, newsLive: any): NewsSnippet[] {
  const items: NewsSnippet[] = [];

  for (const n of masterIntel?.topNews || []) {
    items.push({
      title: n.title || '',
      summary: n.summary || n.consequence,
      companies: n.companies,
    });
  }

  for (const n of newsLive?.news || []) {
    items.push({
      title: n.title || '',
      summary: n.excerpt || '',
    });
  }

  return items.filter((n) => n.title.length > 5).slice(0, 40);
}

function mentionScore(text: string, aliases: string[]) {
  const t = text.toLowerCase();
  return aliases.reduce((acc, alias) => (t.includes(alias) ? acc + 1 : acc), 0);
}

function buildFallbackFromNews(
  snippets: NewsSnippet[],
  marketTrends: Record<string, number>
): AiHisRow[] {
  const rows = HIS_COMPANY_REGISTRY.map((meta) => {
    let mentions = 0;
    let bestWhy = '';

    for (const snip of snippets) {
      const blob = `${snip.title} ${snip.summary || ''}`;
      const hit = mentionScore(blob, meta.aliases);
      if (hit > 0) {
        mentions += hit;
        if (!bestWhy) bestWhy = snip.title;
      }
    }

    const marketChange = marketTrends[meta.id] ?? 0;
    const his = Math.min(99, Math.max(55, 68 + mentions * 4 + Math.max(0, marketChange)));
    const change = Number((marketChange || mentions * 0.3).toFixed(1));
    const confidence = Math.min(98, Math.max(60, 62 + mentions * 6));

    return {
      id: meta.id,
      his: Number(his.toFixed(1)),
      change,
      confidence,
      why: bestWhy || 'Sin menciones recientes en el radar de noticias.',
    };
  });

  return rows.sort((a, b) => b.his - a.his);
}

async function scoreWithGemini(snippets: NewsSnippet[], markets: unknown): Promise<AiHisRow[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || snippets.length === 0) return null;

  const companyList = HIS_COMPANY_REGISTRY.map((c) => c.id).join(', ');
  const prompt = `Eres el motor HIS de HAWKIN. Analiza SOLO las noticias reales abajo.
Calcula Hawkin Intelligence Score (0-100) para estas empresas: ${companyList}.
Reglas:
- NO inventes eventos que no estén en las noticias.
- change = variación % estimada desde momentum en titulares (rango -5 a +8).
- confidence = 60-98 según claridad de las fuentes.
- why = 1 frase citando el titular o hecho real más relevante.

Noticias:
${JSON.stringify(snippets.slice(0, 25))}

Mercados (referencia):
${JSON.stringify(markets)}

Responde SOLO JSON:
{"companies":[{"id":"openai","his":92.1,"change":2.3,"confidence":88,"why":"..."}]}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt.slice(0, 12000));
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as { companies?: AiHisRow[] };
    if (!Array.isArray(parsed.companies) || parsed.companies.length === 0) return null;
    return parsed.companies.filter((c) => c.id && typeof c.his === 'number');
  } catch {
    return null;
  }
}

async function scoreWithGroq(snippets: NewsSnippet[], markets: unknown): Promise<AiHisRow[] | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || snippets.length === 0) return null;

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Analista HIS HAWKIN. Usa SOLO noticias reales. JSON: {"companies":[{"id","his","change","confidence","why"}]}. Sin inventar hechos.',
        },
        {
          role: 'user',
          content: `Noticias: ${JSON.stringify(snippets.slice(0, 20))}\nMercados: ${JSON.stringify(markets)}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    if (!Array.isArray(parsed.companies) || parsed.companies.length === 0) return null;
    return parsed.companies;
  } catch {
    return null;
  }
}

function mergeRows(aiRows: AiHisRow[]) {
  return aiRows
    .map((row) => {
      const meta = findCompanyMeta(row.id);
      if (!meta) return null;
      return {
        id: meta.id,
        name: meta.name,
        logo: meta.logo,
        ceo: meta.ceo,
        his: Number(Math.min(99, Math.max(0, row.his)).toFixed(1)),
        change: Number(row.change.toFixed(1)),
        confidence: Math.round(Math.min(98, Math.max(50, row.confidence))),
        why: row.why || 'Análisis en curso.',
        weights: meta.weights,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b!.his as number) - (a!.his as number));
}

export async function GET() {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) {
    return NextResponse.json(cached.payload);
  }

  try {
    const [markets, newsLive, masterIntel] = await Promise.all([
      getLiveMarketAssets(),
      fetchJson<any>('/api/news/live'),
      fetchJson<any>('/api/news/master-intel'),
    ]);

    const snippets = collectNewsSnippets(masterIntel, newsLive);
    if (snippets.length === 0) {
      return NextResponse.json({
        companies: [],
        updatedAt: new Date().toISOString(),
        source: 'none',
        error: true,
        message: 'Sin datos nuevos',
      });
    }

    const marketTrends: Record<string, number> = {};
    for (const asset of markets || []) {
      const trend = parseFloat(String(asset.trend).replace('+', ''));
      if (asset.symbol === 'NVDA') marketTrends.nvidia = trend;
      if (asset.symbol === 'NDX') {
        marketTrends.microsoft = trend * 0.5;
        marketTrends.google = trend * 0.4;
        marketTrends.meta = trend * 0.3;
      }
    }

    let aiRows = await scoreWithGemini(snippets, markets);
    let source = 'gemini+feeds';

    if (!aiRows || aiRows.length < 6) {
      aiRows = await scoreWithGroq(snippets, markets);
      source = 'groq+feeds';
    }

    if (!aiRows || aiRows.length < 6) {
      aiRows = buildFallbackFromNews(snippets, marketTrends);
      source = 'news-mentions+markets';
    }

    const companies = mergeRows(aiRows);

    const payload = {
      companies,
      updatedAt: new Date().toISOString(),
      source,
      newsCount: snippets.length,
    };

    cached = { payload, at: now };
    return NextResponse.json(payload);
  } catch (error) {
    console.error('HIS API ERR:', error);
    return NextResponse.json({
      companies: [],
      updatedAt: new Date().toISOString(),
      source: 'error',
      error: true,
      message: 'Sin datos nuevos',
    });
  }
}
