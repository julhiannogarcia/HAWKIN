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

const RUMOR_FEEDS = [
  'https://news.google.com/rss/search?q=AI+rumor+OR+tech+leak+OR+OpenAI+rumored+OR+Apple+AI+rumor&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=Elon+Musk+OR+Sam+Altman+rumor+OR+acquisition+talks+tech&hl=en-US&gl=US&ceid=US:en',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
];

const RUMOR_WORDS = ['rumor', 'rumour', 'leak', 'reportedly', 'sources say', 'unconfirmed', 'speculation', 'might', 'could', 'insider'];

export async function GET() {
  try {
    const feeds = await Promise.all(RUMOR_FEEDS.map((url) => parseFeed(url)));
    const items = feeds.flatMap((f) => f.items || []);

    const filtered = items.filter((item) => {
      const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
      return RUMOR_WORDS.some((w) => text.includes(w)) || text.includes('?');
    });

    const unique = Array.from(
      new Map(filtered.map((item) => [item.title?.toLowerCase(), item])).values()
    ).slice(0, 20);

    const rumors = await Promise.all(
      unique.map(async (item) => {
        const id = generateShortId(item.link || item.title || '');
        const title = item.title || 'Señal no confirmada';
        const snippet = item.contentSnippet || '';
        const gemini = await enrichWithGemini(title, snippet);

        return {
          id,
          title: gemini?.title || title,
          category: 'RUMOR',
          excerpt: gemini?.summary || snippet.substring(0, 200) || 'Inteligencia no verificada — en seguimiento.',
          author: 'HAWKIN Rumor Desk',
          date: formatLiveDate(item.pubDate),
          image: resolveNewsImage(item as Record<string, unknown>, title, 'rumor'),
          url: item.link,
          source: 'Radar Rumores',
          isRumor: true,
          disclaimer: 'No confirmado por HAWKIN',
        };
      })
    );

    return NextResponse.json({
      news: rumors,
      status: 'Rumor radar activo',
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ news: [], status: 'Sin señales de rumor' });
  }
}
