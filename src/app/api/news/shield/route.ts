import { NextResponse } from "next/server";
import Parser from 'rss-parser';

const parser = new Parser();

function generateShortId(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function GET() {
  try {
    // Fuentes de ciberseguridad global de alta fidelidad
    const sources = [
      { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews" },
      { name: "Threatpost", url: "https://threatpost.com/feed/" },
      { name: "Krebs on Security", url: "https://krebsonsecurity.com/feed/" },
      { name: "SecurityWeek", url: "https://feeds.feedburner.com/securityweek" }
    ];

    const allThreats: any[] = [];

    const fetchPromises = sources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return feed.items.slice(0, 5).map(item => {
          const uniqueId = generateShortId(item.link || item.title || "");
          const severity = item.title?.toLowerCase().includes('critical') || item.content?.toLowerCase().includes('critical') ? 'CRÍTICA' : 'ALTA';
          
          return {
            id: uniqueId,
            title: item.title,
            link: item.link,
            content: item.contentSnippet?.substring(0, 150) + "...",
            source: source.name,
            date: item.pubDate || new Date().toISOString(),
            severity: severity,
            impact: "Vulnerabilidad detectada en sistemas remotos.",
            howToAvoid: "Actualizar sistemas y aplicar parches de seguridad de inmediato."
          };
        });
      } catch (e) {
        console.error(`Error fetching from ${source.name}`, e);
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    results.forEach(batch => allThreats.push(...batch));

    // Ordenar por fecha (más reciente primero)
    allThreats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ threats: allThreats });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al sincronizar Radar Shield" }, { status: 500 });
  }
}
