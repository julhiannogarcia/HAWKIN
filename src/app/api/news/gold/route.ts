import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function GET() {
  try {
    const sources = [
      { name: "CriptoNoticias", url: "https://www.criptonoticias.com/feed/" },
      { name: "DiarioBitcoin", url: "https://www.diariobitcoin.com/feed/" },
      { name: "BeInCrypto", url: "https://es.beincrypto.com/feed/" }
    ];

    const allNews: any[] = [];

    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.url);
        feed.items.slice(0, 5).forEach(item => {
          allNews.push({
            id: item.guid || Math.random().toString(36).substr(2, 9),
            title: item.title,
            link: item.link,
            content: item.contentSnippet?.substring(0, 150) + "...",
            source: source.name,
            date: item.pubDate,
            category: "GOLD"
          });
        });
      } catch (e) {
        console.error(`Error fetching from ${source.name}`, e);
      }
    }

    // Ordenar por fecha (más reciente primero)
    allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ news: allNews });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al sincronizar Radar Gold" }, { status: 500 });
  }
}
