import { NextResponse } from "next/server";
import Parser from "rss-parser";

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
    const sources = [
      { name: "CriptoNoticias", url: "https://www.criptonoticias.com/feed/" },
      { name: "DiarioBitcoin", url: "https://www.diariobitcoin.com/feed/" },
      { name: "BeInCrypto", url: "https://es.beincrypto.com/feed/" },
      { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" },
      { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" }
    ];

    const allNews: any[] = [];

    const fetchPromises = sources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return feed.items.slice(0, 6).map(item => {
          const uniqueId = generateShortId(item.link || item.title || "");
          
          // IMÁGENES GOLD: ESTÉTICA FINANCIERA Y CRIPTO
          const getGoldImage = (title: string) => {
            const t = title.toLowerCase();
            const base = "https://images.unsplash.com/";
            if (t.includes("bitcoin") || t.includes("btc")) return `${base}photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
            if (t.includes("ethereum") || t.includes("eth")) return `${base}photo-1622790698141-94e30457ef12?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
            if (t.includes("stock") || t.includes("mercado") || t.includes("nasdaq")) return `${base}photo-1611974717528-9878a1d26a8e?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
            return `${base}photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
          };

          return {
            id: uniqueId,
            title: item.title,
            link: item.link,
            content: item.contentSnippet?.substring(0, 160) + "...",
            source: source.name,
            date: item.pubDate || new Date().toISOString(),
            category: "GOLD",
            image: getGoldImage(item.title || "")
          };
        });
      } catch (e) {
        console.error(`Error fetching from ${source.name}`, e);
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    results.forEach(batch => allNews.push(...batch));

    if (allNews.length === 0) {
      allNews.push(
        { id: '1', title: "Estrategia de Acumulación: Bitcoin hacia los $100k", source: "HAWKIN Analysis", date: new Date().toISOString(), content: "El análisis técnico sugiere una fase de re-acumulación institucional...", link: "#", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000" },
        { id: '2', title: "Mercados Globales: El impacto de la FED", source: "HAWKIN Global", date: new Date().toISOString(), content: "La estabilidad del metal precioso se ve reforzada...", link: "#", image: "https://images.unsplash.com/photo-1611974717528-9878a1d26a8e?auto=format&fit=crop&q=80&w=1000" }
      );
    }

    allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const alphaInsights = [
      { asset: "BTC", advice: "ACUMULAR", reason: "Soporte sólido en 90k, ballenas comprando." },
      { asset: "XAU (Oro)", advice: "VIGILAR", reason: "Resistencia en máximos históricos." },
      { asset: "SOL", advice: "OPORTUNIDAD", reason: "Ecosistema DeFi expandiéndose." }
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
