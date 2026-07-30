import { NextResponse } from 'next/server';
import { summarizeWithGemini } from '@/lib/geminiNews';
import { isVideoUrl, getYoutubeEmbedId, getVimeoEmbedId, buildYoutubeEmbedUrl } from '@/lib/adMediaUtils';
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

const FEEDS = [
  'https://news.google.com/rss/search?q=Sam+Altman+OR+Elon+Musk+OR+Jensen+Huang+OR+tech+CEO+billionaire&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=artificial+intelligence+OpenAI+Anthropic+NVIDIA+breaking&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=AI+technology+startup+funding+AGI&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=Gemini+3.6+OR+Gemini+3.5+Flash+Google+AI&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=DeepSeek+OR+Kimi+OR+Moonshot+OR+Qwen+OR+GLM+OR+Baidu+ERNIE+OR+ByteDance+AI&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=Chinese+AI+open+source+LLM+breaking&hl=en-US&gl=US&ceid=US:en',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
  'https://openai.com/news/rss.xml',
  'https://nvidianews.nvidia.com/releases.xml',
  'https://deepmind.google/blog/rss.xml',
  'https://venturebeat.com/category/ai/feed/',
];

const KEY_COMPANIES = [
  'openai', 'nvidia', 'anthropic', 'deepmind', 'microsoft', 'meta', 'xai',
  'deepseek', 'moonshot', 'kimi', 'qwen', 'alibaba', 'baidu', 'ernie',
  'bytedance', 'doubao', 'zhipu', 'glm', 'mistral', 'figure', 'tesla',
];
const KEY_CEOS = [
  'altman', 'musk', 'huang', 'hassabis', 'amodei', 'nadella', 'zuckerberg',
  'pichai', 'wenfeng', 'zhilin', 'kai-fu', 'robin li',
];
const HIGH_IMPACT = [
  'agi', 'gpt', 'gemini', 'gemini 3.6', 'gemini 3.5', 'claude', 'blackwell',
  'llm', 'breaking', 'kimi', 'deepseek', 'qwen', 'chinese ai', 'flash cyber',
];

function scoreItem(text: string) {
  const t = text.toLowerCase();
  let score = 0;
  KEY_COMPANIES.forEach((c) => { if (t.includes(c)) score += 12; });
  KEY_CEOS.forEach((p) => { if (t.includes(p)) score += 18; });
  HIGH_IMPACT.forEach((w) => { if (t.includes(w)) score += 20; });
  if (t.includes('breaking') || t.includes('just in')) score += 30;
  return score;
}

function cleanTitle(raw: string): string {
  const parts = raw.split(' - ');
  if (parts.length > 1 && parts[parts.length - 1].length < 60) {
    return parts.slice(0, -1).join(' - ').trim();
  }
  return raw.trim();
}

function videoEmbedFromUrl(url: string): string | null {
  if (!isVideoUrl(url)) return null;
  const yt = getYoutubeEmbedId(url);
  if (yt) return buildYoutubeEmbedUrl(yt, {});
  const vimeo = getVimeoEmbedId(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return url;
  return null;
}

export async function GET() {
  try {
    const feedResults = await Promise.all(FEEDS.map((url) => parseFeed(url)));
    const allRawItems = feedResults.flatMap((f) => f.items || []);

    const seen = new Set<string>();
    const uniqueItems = allRawItems.filter((item) => {
      if (!isValidNewsUrl(item.link)) return false;
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

    if (ranked.length === 0) {
      return NextResponse.json({
        news: [],
        status: 'Sin datos nuevos',
        refreshedAt: new Date().toISOString(),
        error: true,
      });
    }

    const processed = await Promise.all(
      ranked.map(async ({ item, titanScore }, index) => {
        const url = item.link!;
        const rawTitle = item.title || '';
        const displayTitle = cleanTitle(rawTitle);
        const snippet = (item.contentSnippet || '').trim();
        const source = extractSourceName(item);
        const pubDate = item.pubDate || new Date().toISOString();

        let excerpt = trimExcerpt(snippet, 280);
        if (index < 6 && snippet.length > 40) {
          const gemini = await summarizeWithGemini(displayTitle, snippet);
          if (gemini && 'summary' in gemini) {
            excerpt = trimExcerpt(gemini.summary, 280);
          }
        }

        const image =
          index < 10
            ? await resolveVerifiedNewsImage(item as Record<string, unknown>, url)
            : extractRssImageSync(item as Record<string, unknown>);

        const titleLower = `${displayTitle} ${snippet}`.toLowerCase();
        const category =
          titleLower.includes('gemini 3.6') || titleLower.includes('gemini 3.5 flash') || titanScore >= 40
            ? 'BREAKING'
            : 'INTEL';

        const videoEmbed = videoEmbedFromUrl(url);

        return {
          id: generateShortId(url),
          title: displayTitle,
          category,
          excerpt: excerpt || trimExcerpt(snippet, 120) || displayTitle,
          date: formatLiveDate(pubDate),
          pubDate,
          timestamp: new Date(pubDate).getTime(),
          image,
          url,
          source,
          isBreaking: titanScore >= 40,
          videoEmbed,
          verified: true,
        };
      })
    );

    const verified = processed.filter((n) => n.title && n.url && n.source);

    return NextResponse.json({
      news: verified.slice(0, 30),
      status: verified.length > 0 ? 'HAWKIN Live Radar' : 'Sin datos nuevos',
      refreshedAt: new Date().toISOString(),
      cacheTTL: '120s',
      error: verified.length === 0,
    });
  } catch {
    return NextResponse.json({
      news: [],
      status: 'Sin datos nuevos',
      refreshedAt: new Date().toISOString(),
      error: true,
    });
  }
}

function extractRssImageSync(item: Record<string, unknown>): string | null {
  const enclosure = item.enclosure as { url?: string; type?: string } | undefined;
  if (enclosure?.url && (!enclosure.type || enclosure.type.startsWith('image'))) {
    const u = enclosure.url;
    return u.includes('unsplash.com') ? null : u;
  }
  return null;
}
