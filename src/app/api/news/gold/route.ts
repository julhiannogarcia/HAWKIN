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
      { name: "Bloomberg Crypto", url: "https://www.bloomberg.com/feeds/crypto/sitemap.xml" }, // Bloomberg es el estándar de oro
      { name: "CoinDesk Global", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
      { name: "Reuters Finance", url: "https://www.reutersagency.com/feed/?best-topics=business-finance&format=rss" },
      { name: "Nasdaq Intel", url: "https://www.nasdaq.com/feed/rssoutbound?category=Markets" },
      { name: "CoinTelegraph Pro", url: "https://cointelegraph.com/rss" }
    ];

    const allNews: any[] = [];

    const fetchPromises = sources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return feed.items.slice(0, 8).map(item => {
          const uniqueId = generateShortId(item.link || item.title || "");
          
          // IMÁGENES GOLD: REALISMO FINANCIERO Y ALTA FIDELIDAD
          const getGoldRealImage = (title: string) => {
            const t = title.toLowerCase();
            const base = "https://images.unsplash.com/";
            if (t.includes("bitcoin") || t.includes("btc")) return `${base}photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
            if (t.includes("ethereum") || t.includes("eth")) return `${base}photo-1622790698141-94e30457ef12?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
            if (t.includes("wall street") || t.includes("nasdaq") || t.includes("trading")) return `${base}photo-1611974717528-9878a1d26a8e?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
            if (t.includes("gold") || t.includes("oro")) return `${base}photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
            
            return `${base}photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
          };

          return {
            id: uniqueId,
            title: item.title,
            link: item.link,
            content: (item.contentSnippet || "Analizando el flujo de capital institucional y estrategias de arbitraje...").substring(0, 250) + "...",
            source: source.name,
            date: item.pubDate || new Date().toISOString(),
            category: "GOLD INTEL",
            image: getGoldRealImage(item.title || "")
          };
        });
      } catch (e) {
        return [];
      }
    });

    const results = await Promise.all(fetchPromises);
    results.forEach(batch => allNews.push(...batch));

    allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const alphaInsights = [
      { asset: "BITCOIN (BTC)", advice: "FUERTE ACUMULACIÓN", reason: "Entrada masiva de ETFs de BlackRock, soporte en $94k confirmado." },
      { asset: "NASDAQ 100", advice: "VIGILAR RIESGO", reason: "Alta volatilidad por reportes trimestrales de NVIDIA." },
      { asset: "GOLD (XAU)", advice: "REFUGIO", reason: "Incertidumbre macroeconómica favorece al metal físico." }
    ];

    return NextResponse.json({ 
      news: allNews.slice(0, 24), // Más noticias para inmersión total
      insights: alphaInsights,
      marketSentiment: "Dominancia Institucional / Bullish"
    });
  } catch (error) {
    return NextResponse.json({ error: "Fallo al sincronizar Radar Gold" }, { status: 500 });
  }
}
