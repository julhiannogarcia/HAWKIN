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
    // 1. Ampliamos la búsqueda para traer MÁS NOTICIAS REALES Y FRESCAS
    const AI_FEED = 'https://news.google.com/rss/topics/CAAqJQgKIh9DQkFTRVFvSEwyMHZNRzFyZWhJR1pYTXROREU1S0FBUAE?hl=es-419&gl=PE&ceid=PE:es-419';
    const SHIELD_FEED = 'https://news.google.com/rss/search?q=cybersecurity+hacking+vulnerability+exploit+ransomware&hl=es-419&gl=PE&ceid=PE:es-419';
    const HARDWARE_FEED = 'https://news.google.com/rss/search?q=laptop+gaming+IA+processor+chip+nvidia+amd&hl=es-419&gl=PE&ceid=PE:es-419';

    const [aiFeed, shieldFeed, hardwareFeed] = await Promise.all([
      parser.parseURL(AI_FEED),
      parser.parseURL(SHIELD_FEED),
      parser.parseURL(HARDWARE_FEED)
    ]);

    const getTimeAgo = (dateStr: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      if (seconds < 60) return "Ahora mismo";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Hace ${minutes} min`;
      if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} horas`;
      return "Reciente";
    };

    const formatItems = (items: any[], category: string) => items.slice(0, 15).map((item, index) => {
      const uniqueId = generateShortId(item.link);
      
      // IMÁGENES REALES DIVERSIFICADAS (Usando seeds dinámicos para evitar repetición)
      const getProfessionalImage = (title: string, cat: string) => {
        const t = title.toLowerCase();
        if (cat === "SHIELD") return `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000&seed=${uniqueId}`;
        if (t.includes("nvidia") || t.includes("chip") || t.includes("hardware")) return `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000&seed=${uniqueId}`;
        if (t.includes("altman") || t.includes("openai") || t.includes("ai")) return `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&seed=${uniqueId}`;
        return `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000&seed=${uniqueId}`;
      };

      // GENERADOR DE CONTENIDO PROFUNDO (Análisis HAWKIN Inteligente)
      // Expandimos el snippet real para que el artículo sea extenso y profesional
      const snippet = item.contentSnippet || "Analizando impacto tecnológico...";
      const fullAnalysis = `
        En una actualización de impacto global reportada por ${item.source?.name || "Radar HAWKIN"}, la industria tecnológica se enfrenta a un nuevo paradigma. Este hito marca un antes y un después en la competencia por la soberanía digital y el control de la Inteligencia Artificial de alto nivel.

        Según el análisis verificado por el ecosistema HAWKIN, este movimiento estratégico afectará directamente las valoraciones de mercado y la forma en que los consumidores interactúan con el hardware de próxima generación. ${snippet}

        Nuestros analistas en Silicon Valley sugieren que estamos ante el inicio de una era de 'Razonamiento Sintético' integrado. HAWKIN continúa monitoreando cada rumor y decisión de los fundadores para asegurar que nuestra comunidad de socios tenga la verdad técnica antes que cualquier medio masivo. La transparencia informativa es nuestro compromiso inquebrantable.
      `;

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: snippet.substring(0, 160) + "...",
        content: fullAnalysis,
        isLocked: index > 2,
        author: item.source?.name || "HAWKIN Intel",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: getProfessionalImage(item.title, category),
        url: item.link
      };
    });

    return NextResponse.json({
      news: formatItems(aiFeed.items, "INTELIGENCIA"),
      shield: formatItems(shieldFeed.items, "SHIELD"),
      hardware: formatItems(hardwareFeed.items, "TENDENCIAS")
    });
  } catch (error) {
    return new NextResponse("Error en el Motor HAWKIN", { status: 500 });
  }
}
