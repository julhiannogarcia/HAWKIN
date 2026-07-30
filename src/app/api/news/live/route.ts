import { NextResponse } from 'next/server';
import { enrichWithGemini } from '@/lib/geminiNews';
import {
  formatLiveDate,
  generateShortId,
  parseFeed,
  resolveNewsImage,
} from '@/lib/newsUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 120;

const FEEDS = [
  'https://news.google.com/rss/search?q=Sam+Altman+OR+Elon+Musk+OR+Jensen+Huang+OR+tech+CEO+billionaire&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=artificial+intelligence+OpenAI+Anthropic+NVIDIA+breaking&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=AI+technology+startup+funding+AGI&hl=en-US&gl=US&ceid=US:en',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
  'https://openai.com/news/rss.xml',
  'https://nvidianews.nvidia.com/releases.xml',
  'https://deepmind.google/blog/rss.xml',
  'https://venturebeat.com/category/ai/feed/',
];

const FALLBACK_NEWS = [
  { id: 'f1', title: 'NVIDIA Blackwell: Dominio del Hardware AGI', category: 'CHIPS', excerpt: 'Arquitectura Blackwell redefine la eficiencia en centros de datos IA.', author: 'HAWKIN Analyst', date: 'En vivo', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800', url: '#', source: 'HAWKIN', intelLevel: '9.8', trustScore: 99, isBreaking: true },
  { id: 'f2', title: 'OpenAI: Nueva frontera en modelos de razonamiento', category: 'MODELS', excerpt: 'La carrera por AGI acelera alianzas globales con hardware y nube.', author: 'HAWKIN Analyst', date: 'En vivo', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', url: '#', source: 'HAWKIN', intelLevel: '9.5', trustScore: 98, isBreaking: false },
  { id: 'f3', title: 'DeepMind: Biología computacional en escala global', category: 'HEALTH', excerpt: 'AlphaFold impulsa descubrimiento de fármacos y salud digital.', author: 'HAWKIN Analyst', date: 'En vivo', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', url: '#', source: 'HAWKIN', intelLevel: '9.2', trustScore: 97, isBreaking: false },
];

const KEY_COMPANIES = ['openai', 'nvidia', 'anthropic', 'deepmind', 'microsoft', 'meta', 'xai', 'amazon', 'apple', 'mistral', 'figure', 'tesla'];
const KEY_CEOS = ['altman', 'musk', 'huang', 'hassabis', 'amodei', 'nadella', 'zuckerberg', 'pichai', 'sutskever', 'wang'];
const HIGH_IMPACT = ['agi', 'gpt', 'gemini', 'claude', 'blackwell', 'robot', 'chips', 'funding', 'llm', 'breaking', 'billion', 'ceo'];

function scoreItem(text: string) {
  const t = text.toLowerCase();
  let score = 0;
  KEY_COMPANIES.forEach((c) => { if (t.includes(c)) score += 12; });
  KEY_CEOS.forEach((p) => { if (t.includes(p)) score += 18; });
  HIGH_IMPACT.forEach((w) => { if (t.includes(w)) score += 20; });
  if (t.includes('breaking') || t.includes('just in')) score += 30;
  return score;
}

export async function GET() {
  try {
    const feedResults = await Promise.all(FEEDS.map((url) => parseFeed(url)));
    const allRawItems = feedResults.flatMap((f) => f.items || []);

    const seen = new Set<string>();
    const uniqueItems = allRawItems.filter((item) => {
      const title = item.title?.toLowerCase().trim();
      if (!title || seen.has(title)) return false;
      seen.add(title);
      return true;
    });

    const ranked = uniqueItems
      .map((item) => ({
        item,
        titanScore: scoreItem(`${item.title || ''} ${item.contentSnippet || ''}`),
      }))
      .sort((a, b) => b.titanScore - a.titanScore)
      .slice(0, 24);

    const processed = await Promise.all(
      ranked.map(async ({ item, titanScore }, index) => {
        const uniqueId = generateShortId(item.link || item.title || '');
        const title = item.title?.split(' - ')[0] || 'Señal detectada';
        const snippet = item.contentSnippet || '';
        let excerpt = snippet.substring(0, 220) || 'Analizando flujo de inteligencia global...';
        let category = titanScore >= 40 ? 'BREAKING' : 'INTEL IA';
        let intelLevel = String(Math.min(9.9, 6 + titanScore / 15));
        let displayTitle = title;

        if (index < 8) {
          const gemini = await enrichWithGemini(title, snippet);
          if (gemini?.summary) excerpt = gemini.summary;
          if (gemini?.category) category = gemini.category;
          if (gemini?.importance) intelLevel = String(gemini.importance);
          if (gemini?.title) displayTitle = gemini.title;
        }

        return {
          id: uniqueId,
          title: displayTitle,
          category,
          excerpt,
          author: 'HAWKIN Analyst',
          date: formatLiveDate(item.pubDate),
          timestamp: new Date(item.pubDate || Date.now()).getTime(),
          image: resolveNewsImage(item as Record<string, unknown>, title, 'radar'),
          url: item.link,
          source: item.creator || item.author || 'Radar Global',
          intelLevel,
          trustScore: 96,
          isBreaking: titanScore >= 40,
        };
      })
    );

    const news = processed.length >= 8 ? processed : [...processed, ...FALLBACK_NEWS];

    return NextResponse.json({
      news: news.slice(0, 30),
      status: 'HAWKIN Live Radar v9.0',
      refreshedAt: new Date().toISOString(),
      cacheTTL: '120s',
    });
  } catch {
    return NextResponse.json({
      news: FALLBACK_NEWS,
      status: 'Modo respaldo activo',
      refreshedAt: new Date().toISOString(),
      cacheTTL: '0s',
    });
  }
}
