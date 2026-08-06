import { NextResponse } from 'next/server';
import { summarizeWithGemini } from '@/lib/geminiNews';
import {
  formatLiveDate,
  generateShortId,
  parseFeed,
  resolveVerifiedNewsImage,
  extractSourceName,
  isValidNewsUrl,
  trimExcerpt,
} from '@/lib/newsUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 120;

const RUMOR_FEEDS = [
  'https://news.google.com/rss/search?q=AI+rumor+OR+tech+leak+OR+OpenAI+rumored+OR+Apple+AI+rumor&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=Elon+Musk+OR+Sam+Altman+OR+Jensen+Huang+OR+Demis+Hassabis+rumor+OR+reportedly&hl=en-US&gl=US&ceid=US:en',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
];

const RUMOR_WORDS = [
  'rumor', 'rumour', 'leak', 'reportedly', 'sources say', 'unconfirmed',
  'speculation', 'might', 'could', 'insider', 'alleged', 'supposedly',
];

const CEO_NAMES = [
  'sam altman', 'elon musk', 'jensen huang', 'demis hassabis', 'dario amodei',
  'satya nadella', 'mark zuckerberg', 'sundar pichai', 'yang zhilin', 'liang wenfeng',
  'altman', 'musk', 'huang', 'hassabis', 'amodei', 'nadella', 'zuckerberg', 'pichai',
];

function isCeoRumor(text: string) {
  const t = text.toLowerCase();
  return CEO_NAMES.some((n) => t.includes(n));
}

function cleanTitle(raw: string): string {
  const parts = raw.split(' - ');
  if (parts.length > 1 && parts[parts.length - 1].length < 60) {
    return parts.slice(0, -1).join(' - ').trim();
  }
  return raw.trim();
}

export async function GET() {
  try {
    const feeds = await Promise.all(RUMOR_FEEDS.map((url) => parseFeed(url)));
    const items = feeds.flatMap((f) => f.items || []);

    const filtered = items.filter((item) => {
      if (!isValidNewsUrl(item.link) || !item.title?.trim()) return false;
      const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
      return RUMOR_WORDS.some((w) => text.includes(w)) || isCeoRumor(text);
    });

    const unique = Array.from(
      new Map(filtered.map((item) => [item.title?.toLowerCase(), item])).values()
    ).slice(0, 20);

    if (unique.length === 0) {
      return NextResponse.json({
        news: [],
        status: 'Sin datos nuevos',
        refreshedAt: new Date().toISOString(),
      });
    }

    const rumors = await Promise.all(
      unique.map(async (item, index) => {
        const url = item.link!;
        const title = cleanTitle(item.title || '');
        const snippet = (item.contentSnippet || '').trim();
        const ceo = isCeoRumor(`${title} ${snippet}`);
        const source = extractSourceName(item);

        let excerpt = trimExcerpt(snippet, 280);
        if (index < 6 && snippet.length > 40) {
          const gemini = await summarizeWithGemini(title, snippet);
          if (gemini && 'summary' in gemini) {
            excerpt = trimExcerpt(gemini.summary, 280);
          }
        }

        const image =
          index < 10
            ? await resolveVerifiedNewsImage(item as Record<string, unknown>, url)
            : null;

        return {
          id: generateShortId(url),
          title,
          category: 'RUMOR',
          excerpt: excerpt || trimExcerpt(snippet, 120) || title,
          date: formatLiveDate(item.pubDate),
          pubDate: item.pubDate || new Date().toISOString(),
          image,
          url,
          source,
          isRumor: true,
          isCeoRumor: ceo,
          badge: ceo ? 'RUMOR · CEO' : 'RUMOR',
          disclaimer: 'No confirmado — inteligencia no verificada',
          verified: false,
        };
      })
    );

    // CEOs primero para que se vean con badge claro
    rumors.sort((a, b) => Number(b.isCeoRumor) - Number(a.isCeoRumor));

    return NextResponse.json({
      news: rumors,
      status: 'Rumor desk — no confirmado',
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      news: [],
      status: 'Sin datos nuevos',
      refreshedAt: new Date().toISOString(),
    });
  }
}
