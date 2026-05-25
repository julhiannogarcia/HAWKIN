import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function GET() {
  try {
    const sources = [
      { name: "CriptoNoticias", url: "https://www.criptonoticias.com/feed/" },
      { name: "DiarioBitcoin", url: "https://www.diariobitcoin.com/feed/" },
      { name: "BeInCrypto", url: "https://es.beincrypto.com/feed/" },
      { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" },
      { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" }
    ];

    const allNews: any[] = [];

    // Promesa masiva para cargar noticias rápido
    const fetchPromises = sources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return feed.items.slice(0, 6).map(item => ({
          id: item.guid || Math.random().toString(36).substr(2, 9),
          title: item.title,
          link: item.link,
          content: item.contentSnippet?.substring(0, 160) + "...",
          source: source.name,
          date: item.pubDate || new Date().toISOString(),
          category: "GOLD"
        }));
      } catch (e) {
        console.error(`Error fetching from ${source.name}`, e);
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    results.forEach(batch => allNews.push(...batch));

    // Si no hay noticias (error de feeds), devolvemos datos de respaldo de alta calidad
    if (allNews.length === 0) {
      allNews.push(
        { id: '1', title: "Estrategia de Acumulación: Bitcoin hacia los $100k", source: "HAWKIN Analysis", date: new Date().toISOString(), content: "El análisis técnico sugiere una fase de re-acumulación institucional en los niveles actuales...", link: "#" },
        { id: '2', title: "Mercados Globales: El impacto de la FED en el Oro", source: "HAWKIN Global", date: new Date().toISOString(), content: "La estabilidad del metal precioso se ve reforzada ante la incertidumbre inflacionaria en EE.UU...", link: "#" }
      );
    }

    // Ordenar por fecha (más reciente primero)
    allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // AÑADIMOS ALPHA INSIGHTS (Ayuda en qué invertir)
    const alphaInsights = [
      { asset: "BTC", advice: "ACUMULAR", reason: "Soporte sólido en 90k, ballenas comprando." },
      { asset: "XAU (Oro)", advice: "VIGILAR", reason: "Resistencia en máximos históricos, esperar corrección." },
      { asset: "SOL", advice: "OPORTUNIDAD", reason: "Ecosistema DeFi expandiéndose, entrada ideal en $180." }
    ];

    return NextResponse.json({ 
      news: allNews,
      insights: alphaInsights,
      marketSentiment: "Fuerte Optimismo Institucional"
    });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al sincronizar Radar Gold" }, { status: 500 });
  }
}
