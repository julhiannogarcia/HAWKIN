import { NextResponse } from "next/server";
import { formatLiveDate, generateShortId, parseFeed } from '@/lib/newsUtils';

export const dynamic = 'force-dynamic';
export const revalidate = 180;

const FALLBACK = [
  { id: 's1', title: 'Monitoreo activo: amenazas zero-day en ecosistemas cloud', link: '#', content: 'HAWKIN Shield en vigilancia continua...', source: 'HAWKIN Shield', date: new Date().toISOString(), severity: 'ALTA', impact: 'Riesgo en infraestructura expuesta.', howToAvoid: 'Activar MFA y parches automáticos.' },
];

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
            content: (item.contentSnippet?.substring(0, 150) || 'Amenaza detectada...') + '...',
            source: source.name,
            date: item.pubDate || new Date().toISOString(),
            dateLabel: formatLiveDate(item.pubDate),
            severity,
            impact: "Posible exposición de datos o acceso no autorizado.",
            howToAvoid: "Actualizar software, rotar claves y revisar accesos.",
          };
        });
      })
    );

    const allThreats = batches.flat();
    allThreats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      threats: allThreats.length ? allThreats : FALLBACK,
      refreshedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ threats: FALLBACK, refreshedAt: new Date().toISOString() });
  }
}
