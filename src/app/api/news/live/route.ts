import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  try {
    // 1. FUENTE IA (La que tú pasaste)
    const AI_FEED = 'https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSEwyMHZNRzFyZWhJR1pYTXROREU1S0FBUAE?hl=es-419&gl=PE&ceid=PE:es-419';
    
    // 2. FUENTE CIBERSEGURIDAD (Hackers y Protección)
    const SHIELD_FEED = 'https://news.google.com/rss/search?q=cybersecurity+hacking+vulnerability&hl=es-419&gl=PE&ceid=PE:es-419';

    const [aiFeed, shieldFeed] = await Promise.all([
      parser.parseURL(AI_FEED),
      parser.parseURL(SHIELD_FEED)
    ]);

    const formatItems = (items: any[], category: string) => items.slice(0, 6).map((item, index) => {
      // Intentamos extraer una imagen de la descripción si existe (Google News a veces la oculta)
      // Como el RSS gratuito es limitado, usaremos un "Mapeador de Imágenes Inteligente"
      const techImages = [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
      ];
      
      const shieldImages = [
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
      ];

      return {
        id: Buffer.from(item.link).toString('base64').substring(0, 10), // ID único basado en el link
        title: item.title,
        category: category,
        excerpt: item.contentSnippet?.substring(0, 120) + "...",
        isLocked: index > 1,
        author: item.source || "HAWKIN Global",
        date: item.pubDate ? new Date(item.pubDate).toLocaleTimeString() : "Ahora",
        image: category === "SHIELD" ? shieldImages[index % shieldImages.length] : techImages[index % techImages.length],
        url: item.link,
        hasVideo: index === 0 // Simulamos que la noticia principal tiene video
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
