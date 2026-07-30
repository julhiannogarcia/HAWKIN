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
  'agi', 'gpt', 'gemini', 'claude', 'blackwell', 'robot', 'chips', 'funding',
  'llm', 'breaking', 'billion', 'ceo', 'kimi', 'deepseek', 'qwen', 'chinese ai',
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

    if (ranked.length === 0) {
      return NextResponse.json({
        news: [],
        status: 'Sin datos nuevos',
        refreshedAt: new Date().toISOString(),
        cacheTTL: '120s',
        error: true,
      });
    }

    const processed = await Promise.all(
      ranked.map(async ({ item, titanScore }, index) => {
        const uniqueId = generateShortId(item.link || item.title || '');
        const title = item.title?.split(' - ')[0] || 'Señal detectada';
        const snippet = item.contentSnippet || '';
        let excerpt = snippet.substring(0, 220) || '';
        let category = titanScore >= 40 ? 'BREAKING' : 'INTEL IA';
        let intelLevel = String(Math.min(9.9, 6 + titanScore / 15));
        let displayTitle = title;

        if (index < 8 && excerpt) {
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
          excerpt: excerpt || snippet.substring(0, 120),
          author: item.creator || item.author || 'Radar Global',
          date: formatLiveDate(item.pubDate),
          timestamp: new Date(item.pubDate || Date.now()).getTime(),
          image: resolveNewsImage(item as Record<string, unknown>, title, 'radar'),
          url: item.link,
          source: item.creator || item.author || 'RSS',
          intelLevel,
          isBreaking: titanScore >= 40,
          isFallback: false,
        };
      })
    );

    return NextResponse.json({
      news: processed.slice(0, 30),
      status: 'HAWKIN Live Radar',
      refreshedAt: new Date().toISOString(),
      cacheTTL: '120s',
    });
  } catch {
    return NextResponse.json({
      news: [],
      status: 'Sin datos nuevos',
      refreshedAt: new Date().toISOString(),
      cacheTTL: '0s',
      error: true,
    });
  }
}
