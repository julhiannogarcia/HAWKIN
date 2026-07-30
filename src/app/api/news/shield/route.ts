import { NextResponse } from "next/server";
import { formatLiveDate, generateShortId, parseFeed } from '@/lib/newsUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 180;

export async function GET() {
  try {
    const sources = [
      { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
      { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/" },
      { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
      { name: "SecurityWeek", url: "https://feeds.feedburner.com/securityweek" },
    ];

    const batches = await Promise.all(
      sources.map(async (source) => {
        const feed = await parseFeed(source.url);
        return (feed.items || []).slice(0, 6).map((item) => {
          const text = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
          const severity = text.includes('critical') || text.includes('zero-day') ? 'CRÍTICA' : 'ALTA';
          return {
            id: generateShortId(item.link || item.title || ""),
            title: item.title,
            link: item.link,
            content: (item.contentSnippet?.substring(0, 150) || '') + (item.contentSnippet ? '...' : ''),
            source: source.name,
            date: item.pubDate || new Date().toISOString(),
            dateLabel: formatLiveDate(item.pubDate),
            severity,
            impact: "Posible exposición de datos o acceso no autorizado.",
            howToAvoid: "Actualizar software, rotar claves y revisar accesos.",
            isFallback: false,
          };
        });
      })
    );

    const allThreats = batches.flat().filter((t) => t.title);
    allThreats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (allThreats.length === 0) {
      return NextResponse.json({
        threats: [],
        refreshedAt: new Date().toISOString(),
        message: 'Sin datos nuevos',
        error: true,
      });
    }

    return NextResponse.json({
      threats: allThreats.slice(0, 12),
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      threats: [],
      refreshedAt: new Date().toISOString(),
      message: 'Sin datos nuevos',
      error: true,
    });
  }
}
