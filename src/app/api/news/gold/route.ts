import { NextResponse } from 'next/server';
import { getLiveMarketAssets } from '@/lib/marketData';
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

export async function GET() {
  try {
    const sources = [
      { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
      { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
      { name: 'Nasdaq', url: 'https://www.nasdaq.com/feed/rssoutbound?category=Markets' },
    ];

    const allNews: Array<{
      id: string;
      title: string;
      url: string;
      excerpt: string;
      source: string;
      date: string;
      timestamp: number;
      category: string;
      image: string | null;
      verified: boolean;
    }> = [];

    for (const source of sources) {
      const feed = await parseFeed(source.url);
      const items = (feed.items || []).slice(0, 8);

      for (const item of items) {
        if (!isValidNewsUrl(item.link) || !item.title?.trim()) continue;

        const url = item.link!;
        const snippet = (item.contentSnippet || '').trim();
        const image = await resolveVerifiedNewsImage(item as Record<string, unknown>, url);

        allNews.push({
          id: generateShortId(url),
          title: item.title.trim(),
          url,
          excerpt: trimExcerpt(snippet, 280) || item.title.trim(),
          source: extractSourceName(item) || source.name,
          date: formatLiveDate(item.pubDate),
          timestamp: new Date(item.pubDate || Date.now()).getTime(),
          category: 'GOLD',
          image,
          verified: true,
        });
      }
    }

    allNews.sort((a, b) => b.timestamp - a.timestamp);

    const assets = await getLiveMarketAssets();
    const alphaInsights = assets
      .filter((a) => a.price !== '$—')
      .map((a) => ({
        asset: `${a.name} (${a.symbol})`,
        advice: Number(a.trend) >= 0 ? 'Alcista' : 'Bajista',
        reason: `${a.price} · ${a.trend}% 24h · ${a.src}`,
      }));

    if (allNews.length === 0) {
      return NextResponse.json({
        news: [],
        insights: alphaInsights,
        status: 'Sin datos nuevos',
        refreshedAt: new Date().toISOString(),
        error: true,
      });
    }

    return NextResponse.json({
      news: allNews.slice(0, 24),
      insights: alphaInsights,
      marketSentiment: alphaInsights.length > 0 ? 'Datos en vivo' : 'Sin datos de mercado',
      refreshedAt: new Date().toISOString(),
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
