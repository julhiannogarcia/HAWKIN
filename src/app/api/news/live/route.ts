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
    const AI_FEED = 'https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSEwyMHZNRzFyZWhJR1pYTXROREU1S0FBUAE?hl=es-419&gl=PE&ceid=PE:es-419';
    const SHIELD_FEED = 'https://news.google.com/rss/search?q=cybersecurity+hacking+vulnerability+exploit&hl=es-419&gl=PE&ceid=PE:es-419';

    const [aiFeed, shieldFeed] = await Promise.all([
      parser.parseURL(AI_FEED),
      parser.parseURL(SHIELD_FEED)
    ]);

    const getTimeAgo = (dateStr: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      if (seconds < 60) return "Ahora";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Hace ${minutes} min`;
      return `Hace ${Math.floor(minutes / 60)} h`;
    };

    const formatItems = (items: any[], category: string) => items.slice(0, 9).map((item, index) => {
      const isShield = category === "SHIELD";
      const uniqueId = generateShortId(item.link);

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: item.contentSnippet?.substring(0, 160) + "...",
        isLocked: index > 2,
        author: item.source?.name || item.source || "HAWKIN Intelligence",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: isShield 
          ? `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000` 
          : `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000`,
        url: item.link,
        // DATOS TÉCNICOS PARA SHIELD
        manual: isShield ? "Manual de Protección HAWKIN Shield: Pasos críticos para asegurar tu entorno ante esta amenaza." : null,
        installCode: isShield ? `# HAWKIN SHIELD AUTO-PROTECT\nsudo apt update && sudo apt upgrade -y\n# Bloqueando puertos vulnerables\nsudo ufw deny 445/tcp\nsudo ufw status` : null
      };
    });

    return NextResponse.json({
      news: formatItems(aiFeed.items, "INTELIGENCIA"),
      shield: formatItems(shieldFeed.items, "SHIELD")
    });
  } catch (error) {
    return new NextResponse("Error al sincronizar", { status: 500 });
  }
}
