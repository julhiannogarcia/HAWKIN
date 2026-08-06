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

type CeoRegion = 'USA' | 'CN';

type CeoMeta = {
  id: string;
  name: string;
  aliases: string[];
  region: CeoRegion;
  company: string;
};

/** CEOs grandes USA + China — filtro rumor desk */
const CEOS: CeoMeta[] = [
  { id: 'altman', name: 'Sam Altman', aliases: ['sam altman', 'altman'], region: 'USA', company: 'OpenAI' },
  { id: 'huang', name: 'Jensen Huang', aliases: ['jensen huang', 'jensen'], region: 'USA', company: 'NVIDIA' },
  { id: 'musk', name: 'Elon Musk', aliases: ['elon musk', 'elon'], region: 'USA', company: 'xAI' },
  { id: 'hassabis', name: 'Demis Hassabis', aliases: ['demis hassabis', 'hassabis'], region: 'USA', company: 'Google DeepMind' },
  { id: 'amodei', name: 'Dario Amodei', aliases: ['dario amodei', 'amodei'], region: 'USA', company: 'Anthropic' },
  { id: 'nadella', name: 'Satya Nadella', aliases: ['satya nadella', 'nadella'], region: 'USA', company: 'Microsoft' },
  { id: 'zuckerberg', name: 'Mark Zuckerberg', aliases: ['mark zuckerberg', 'zuckerberg'], region: 'USA', company: 'Meta' },
  { id: 'pichai', name: 'Sundar Pichai', aliases: ['sundar pichai', 'pichai'], region: 'USA', company: 'Alphabet' },
  { id: 'yang', name: 'Yang Zhilin', aliases: ['yang zhilin', 'zhilin'], region: 'CN', company: 'Moonshot' },
  { id: 'wenfeng', name: 'Liang Wenfeng', aliases: ['liang wenfeng', 'wenfeng'], region: 'CN', company: 'DeepSeek' },
  { id: 'robinli', name: 'Robin Li', aliases: ['robin li', 'li yanhong'], region: 'CN', company: 'Baidu' },
  { id: 'kaifu', name: 'Kai-Fu Lee', aliases: ['kai-fu lee', 'kaifu lee', 'kai fu lee'], region: 'CN', company: '01.AI' },
];

const RUMOR_FEEDS = [
  'https://news.google.com/rss/search?q=AI+rumor+OR+tech+leak+OR+OpenAI+rumored+OR+reportedly&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=%22Sam+Altman%22+OR+%22Elon+Musk%22+OR+%22Jensen+Huang%22+OR+%22Dario+Amodei%22+(rumor+OR+reportedly+OR+leak)&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=%22Liang+Wenfeng%22+OR+%22Yang+Zhilin%22+OR+DeepSeek+OR+Moonshot+OR+Kimi+(rumor+OR+reportedly+OR+leak)&hl=en-US&gl=US&ceid=US:en',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
];

const RUMOR_WORDS = [
  'rumor', 'rumour', 'leak', 'reportedly', 'sources say', 'unconfirmed',
  'speculation', 'insider', 'alleged', 'supposedly', 'according to people',
];

function matchCeo(text: string): CeoMeta | null {
  const t = text.toLowerCase();
  return CEOS.find((c) => c.aliases.some((a) => t.includes(a))) || null;
}

function cleanTitle(raw: string): string {
  const parts = raw.split(' - ');
  if (parts.length > 1 && parts[parts.length - 1].length < 60) {
    return parts.slice(0, -1).join(' - ').trim();
  }
  return raw.trim();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const regionFilter = (searchParams.get('region') || 'ALL').toUpperCase() as 'ALL' | CeoRegion;
    const ceoOnly = searchParams.get('ceo') === '1' || searchParams.get('filter') === 'ceo';

    const feeds = await Promise.all(RUMOR_FEEDS.map((url) => parseFeed(url)));
    const items = feeds.flatMap((f) => f.items || []);

    const filtered = items.filter((item) => {
      if (!isValidNewsUrl(item.link) || !item.title?.trim()) return false;
      const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
      const ceo = matchCeo(text);
      const isRumorish = RUMOR_WORDS.some((w) => text.includes(w));
      if (!ceo && !isRumorish) return false;
      if (ceoOnly && !ceo) return false;
      if (regionFilter !== 'ALL' && ceo && ceo.region !== regionFilter) return false;
      if (regionFilter !== 'ALL' && !ceo) return false;
      return true;
    });

    const unique = Array.from(
      new Map(filtered.map((item) => [item.title?.toLowerCase(), item])).values()
    ).slice(0, 24);

    if (unique.length === 0) {
      return NextResponse.json({
        news: [],
        ceos: CEOS,
        status: 'Sin datos nuevos',
        refreshedAt: new Date().toISOString(),
      });
    }

    const rumors = await Promise.all(
      unique.map(async (item, index) => {
        const url = item.link!;
        const title = cleanTitle(item.title || '');
        const snippet = (item.contentSnippet || '').trim();
        const ceo = matchCeo(`${title} ${snippet}`);
        const source = extractSourceName(item);

        const fullSnippet = trimExcerpt(snippet, 900);
        let excerpt = trimExcerpt(snippet, 320);
        if (index < 8 && snippet.length > 40) {
          const gemini = await summarizeWithGemini(title, snippet);
          if (gemini && 'summary' in gemini) {
            excerpt = trimExcerpt(gemini.summary, 420);
          }
        }

        const image = await resolveVerifiedNewsImage(item as Record<string, unknown>, url);

        return {
          id: generateShortId(url),
          title,
          category: 'RUMOR',
          excerpt: excerpt || trimExcerpt(snippet, 160) || title,
          body: fullSnippet || excerpt || title,
          date: formatLiveDate(item.pubDate),
          pubDate: item.pubDate || new Date().toISOString(),
          image,
          url,
          source,
          isRumor: true,
          isCeoRumor: Boolean(ceo),
          ceoName: ceo?.name || null,
          ceoRegion: ceo?.region || null,
          ceoCompany: ceo?.company || null,
          badge: ceo ? `RUMOR · CEO · ${ceo.region}` : 'RUMOR',
          disclaimer: 'No confirmado — inteligencia no verificada',
          verified: false,
        };
      })
    );

    rumors.sort((a, b) => {
      if (a.isCeoRumor !== b.isCeoRumor) return Number(b.isCeoRumor) - Number(a.isCeoRumor);
      return 0;
    });

    return NextResponse.json({
      news: rumors,
      ceos: CEOS,
      status: 'Rumor desk — no confirmado',
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      news: [],
      ceos: CEOS,
      status: 'Sin datos nuevos',
      refreshedAt: new Date().toISOString(),
    });
  }
}
