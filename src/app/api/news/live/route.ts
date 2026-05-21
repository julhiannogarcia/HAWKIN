import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  try {
    const AI_FEED = 'https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSEwyMHZNRzFyZWhJR1pYTXROREU1S0FBUAE?hl=es-419&gl=PE&ceid=PE:es-419';
    const SHIELD_FEED = 'https://news.google.com/rss/search?q=cybersecurity+hacking+vulnerability&hl=es-419&gl=PE&ceid=PE:es-419';

    const [aiFeed, shieldFeed] = await Promise.all([
      parser.parseURL(AI_FEED),
      parser.parseURL(SHIELD_FEED)
    ]);

    const getTimeAgo = (dateStr: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      if (seconds < 60) return "Ahora mismo";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Hace ${minutes} min`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `Hace ${hours} horas`;
      return "Hace 1 día";
    };

    const extractImage = (content: string) => {
      const imgReg = /<img src="([^"]+)"/;
      const match = content.match(imgReg);
      return match ? match[1] : null;
    };

    const formatItems = (items: any[], category: string) => items.slice(0, 9).map((item, index) => {
      // Intentar sacar la imagen original de Google si está disponible
      const originalImage = extractImage(item.content || "");
      
      const techImages = [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        "https://images.unsplash.com/photo-1518770660439-4636190af475"
      ];

      // ID ÚNICO REALMENTE BASADO EN EL ENLACE PARA QUE NO SE MEZCLEN
      const uniqueId = Buffer.from(item.link).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: item.contentSnippet?.substring(0, 160) + "...",
        isLocked: index > 1,
        author: item.source?.name || item.source || "Google News",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: originalImage || `${techImages[index % techImages.length]}?auto=format&fit=crop&q=80&w=1000`,
        url: item.link,
        hasVideo: index % 3 === 0 // Simulamos video cada 3 noticias
      };
    });

    return NextResponse.json({
      news: formatItems(aiFeed.items, "INTELIGENCIA"),
      shield: formatItems(shieldFeed.items, "SHIELD")
    });
  } catch (error) {
    console.error("[MASTER_CRAWLER_ERROR]", error);
    return new NextResponse("Error al sincronizar noticias", { status: 500 });
  }
}
