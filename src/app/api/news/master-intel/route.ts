import { NextResponse } from "next/server";
import Parser from 'rss-parser';
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

let cachedIntel: any = null;
let lastUpdate = 0;
const CACHE_DURATION = 1000 * 60 * 10;

function getPeruTime() {
  return new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
}

function generateId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50) + '-' + Math.random().toString(36).substring(2, 5);
}


const EMPTY_INTEL = {
  topNews: [] as unknown[],
  rumors: [] as unknown[],
  battles: [] as unknown[],
  trendingCEOs: [] as unknown[],
  prediction: null as null,
};

export async function GET() {
  const now = Date.now();
  let manualIntel: any[] = [];
  let hasVerified = false;

  try {
    try {
      const dbNews = await prisma.news.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      manualIntel = dbNews.map((n) => ({
        id: n.id,
        title: n.title,
        summary: n.excerpt || n.content.substring(0, 250) + '...',
        impact: n.isUrgent ? 10 : 9,
        companies: [n.category || 'TECH'],
        people: ['Oficial'],
        consequence: 'Análisis estratégico verificado.',
        importance: n.isUrgent ? 'CRITICO' : 'ALTO',
        url: n.url || `/news/${n.id}`,
        image: n.image,
        timestamp: n.createdAt.toISOString(),
        isFallback: false,
      }));
      if (manualIntel.length > 0) hasVerified = true;
    } catch (e) {
      console.error('DB ERR:', e);
    }

    if (cachedIntel && now - lastUpdate < CACHE_DURATION) {
      const merged = [...manualIntel, ...(cachedIntel.aiItems || [])];
      return NextResponse.json({
        ...cachedIntel,
        topNews: merged.slice(0, 10),
        lastUpdate: getPeruTime(),
        updatedAt: new Date(lastUpdate).toISOString(),
        hasVerified: hasVerified || cachedIntel.hasVerified,
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const groq = apiKey ? new Groq({ apiKey }) : null;

    let rawItems: any[] = [];
    try {
      const RSS_FEEDS = [
        'https://news.google.com/rss/search?q=Artificial+Intelligence+breaking+news&hl=en-US&gl=US&ceid=US:en',
        'https://news.google.com/rss/search?q=DeepSeek+OR+Kimi+OR+Qwen+OR+Chinese+AI&hl=en-US&gl=US&ceid=US:en',
      ];
      const rssResults = await Promise.all(
        RSS_FEEDS.map((url) =>
          Promise.race([
            parser.parseURL(url),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3500)),
          ]).catch(() => ({ items: [] }))
        )
      );
      rawItems = rssResults
        .flatMap((res: any) => res.items || [])
        .slice(0, 20)
        .map((item: any) => ({
          title: item.title,
          content: item.contentSnippet || item.title,
          link: item.link,
        }));
    } catch (e) {
      console.error('RSS ERR:', e);
    }

    let aiItems: any[] = [];
    let intelReport: any = { ...EMPTY_INTEL };

    if (groq && rawItems.length > 0) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'HAWKIN WAR ROOM. Analiza SOLO noticias REALES del input. NO inventes hechos. JSON: {topNews,rumors,battles,trendingCEOs,prediction}. Si no hay dato, devuelve array vacío.',
            },
            { role: 'user', content: `Analiza: ${JSON.stringify(rawItems)}` },
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          response_format: { type: 'json_object' },
        });
        const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
        intelReport = {
          rumors: Array.isArray(parsed.rumors) ? parsed.rumors : [],
          battles: Array.isArray(parsed.battles) ? parsed.battles : [],
          trendingCEOs: Array.isArray(parsed.trendingCEOs) ? parsed.trendingCEOs : [],
          prediction: parsed.prediction || null,
        };
        aiItems = (parsed.topNews || [])
          .filter((n: any) => n.title && n.summary)
          .map((n: any) => ({
            ...n,
            id: generateId(n.title),
            timestamp: new Date().toISOString(),
            url: n.url || rawItems.find((r) => r.title === n.title)?.link,
            isFallback: false,
          }));
        if (aiItems.length > 0) hasVerified = true;
      } catch (e) {
        console.error('AI ERR:', e);
      }
    }

    const finalTopNews = [...manualIntel, ...aiItems];

    const response = {
      ...intelReport,
      topNews: finalTopNews.slice(0, 10),
      lastUpdate: getPeruTime(),
      updatedAt: new Date().toISOString(),
      hasVerified,
      message: finalTopNews.length === 0 ? 'Sin datos nuevos' : undefined,
    };

    cachedIntel = { ...intelReport, aiItems, hasVerified };
    lastUpdate = now;

    return NextResponse.json(response);
  } catch (error) {
    console.error('CRITICAL API ERR:', error);
    return NextResponse.json({
      ...EMPTY_INTEL,
      lastUpdate: getPeruTime(),
      updatedAt: new Date().toISOString(),
      error: true,
      message: 'Sin datos nuevos',
    });
  }
}
