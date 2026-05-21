import { NextResponse } from 'next/server';
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
      let interval = seconds / 31536000;
      if (interval > 1) return "Hace " + Math.floor(interval) + " años";
      interval = seconds / 2592000;
      if (interval > 1) return "Hace " + Math.floor(interval) + " meses";
      interval = seconds / 86400;
      if (interval > 1) return "Hace " + Math.floor(interval) + " días";
      interval = seconds / 3600;
      if (interval > 1) return "Hace " + Math.floor(interval) + " horas";
      interval = seconds / 60;
      if (interval > 1) return "Hace " + Math.floor(interval) + " min";
      return "Ahora mismo";
    };

    const formatItems = (items: any[], category: string) => items.slice(0, 9).map((item, index) => {
      const techImages = [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000"
      ];
      
      const shieldImages = [
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1551808195-b9de136738a6?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000"
      ];

      // Creamos un ID seguro que no dependa de Date.now() para que la navegación no falle al refrescar
      const cleanId = Buffer.from(item.link).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 15);

      return {
        id: cleanId,
        title: item.title.split(' - ')[0], // Limpiamos el nombre de la fuente del título
        category: category,
        excerpt: item.contentSnippet?.substring(0, 160) + "...",
        isLocked: index > 2,
        author: item.source?.name || item.source || "Google News",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: category === "SHIELD" ? shieldImages[index % shieldImages.length] : techImages[index % techImages.length],
        url: item.link,
        hasVideo: index % 4 === 0 // Simulamos video cada 4 noticias
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
