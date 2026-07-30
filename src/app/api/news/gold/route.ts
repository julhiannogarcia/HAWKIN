import { NextResponse } from "next/server";
import { getLiveMarketAssets } from '@/lib/marketData';
import {
  formatLiveDate,
  generateShortId,
  parseFeed,
  resolveNewsImage,
} from '@/lib/newsUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 120;

export async function GET() {
  try {
    const sources = [
      { name: "CoinDesk Global", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
      { name: "CoinTelegraph", url: "https://cointelegraph.com/rss" },
      { name: "Nasdaq Intel", url: "https://www.nasdaq.com/feed/rssoutbound?category=Markets" },
    ];

    const allNews: any[] = [];

    const fetchPromises = sources.map(async (source) => {
      const feed = await parseFeed(source.url);
      return (feed.items || []).slice(0, 8).map((item) => {
        const uniqueId = generateShortId(item.link || item.title || "");
        const pubDate = new Date(item.pubDate || new Date());

        return {
          id: uniqueId,
          title: item.title,
          link: item.link,
          url: item.link,
          excerpt: (item.contentSnippet || "Analizando flujo de capital institucional...").substring(0, 250) + "...",
          source: source.name,
          author: source.name,
          date: formatLiveDate(item.pubDate),
          timestamp: pubDate.getTime(),
          category: "GOLD INTEL",
          image: resolveNewsImage(item as Record<string, unknown>, item.title || '', 'gold'),
        };
      });
    });

    const results = await Promise.all(fetchPromises);
    results.forEach((batch) => allNews.push(...batch));
    allNews.sort((a, b) => b.timestamp - a.timestamp);

    const assets = await getLiveMarketAssets();
    const alphaInsights = assets.map((a) => ({
      asset: `${a.name} (${a.symbol})`,
      advice: Number(a.trend) >= 0 ? 'MOMENTUM ALCISTA' : 'PRECAUCIÓN',
      reason: `${a.price} • ${a.trend}% 24h • Fuente ${a.src}`,
    }));

    return NextResponse.json({
      news: allNews.slice(0, 24),
      insights: alphaInsights,
      marketSentiment: "Datos en vivo",
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Fallo al sincronizar Radar Gold" }, { status: 500 });
  }
}
