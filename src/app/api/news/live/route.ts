import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  try {
    // ESTE ES EL CANAL DE DATOS REAL DE GOOGLE NEWS PARA TU LINK
    const FEED_URL = 'https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSEwyMHZNRzFyZWhJR1pYTXROREU1S0FBUAE?hl=es-419&gl=PE&ceid=PE:es-419';
    
    const feed = await parser.parseURL(FEED_URL);
    
    // Transformamos los datos de Google a nuestro formato HAWKIN
    const liveNews = feed.items.slice(0, 12).map((item, index) => {
      // Imagen por defecto futurista según la posición (ya que el RSS gratuito no trae la imagen)
      const images = [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
      ];

      return {
        id: `google-${index}-${Date.now()}`,
        title: item.title || "Noticia en desarrollo",
        category: "INTELIGENCIA GLOBAL",
        excerpt: item.contentSnippet?.substring(0, 150) + "...",
        isLocked: index > 2, // Las primeras 3 son libres, el resto bloqueadas
        author: item.creator || item.source || "Radar HAWKIN",
        date: item.pubDate ? new Date(item.pubDate).toLocaleTimeString() : "Recién publicado",
        image: images[index % images.length],
        url: item.link
      };
    });

    return NextResponse.json(liveNews);
  } catch (error) {
    console.error("[CRAWLER_ERROR]", error);
    return new NextResponse("Error al capturar noticias reales", { status: 500 });
  }
}
