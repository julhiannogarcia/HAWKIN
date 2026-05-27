import { NextResponse } from "next/server";
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic'; // FORZAR DATOS EN VIVO AL SEGUNDO
export const revalidate = 0;

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
    // RADAR GLOBAL: EXCLUSIVO IA, CEOS Y FUNDADORES (SILICON VALLEY SCOOPS)
    // Filtros de búsqueda para obtener solo noticias de primera hora y rumores de élite
    const AI_MASTER_FEED = 'https://news.google.com/rss/search?q=OpenAI+GPT-5+Sam+Altman+rumor+Elon+Musk+xAI+Jensen+Huang+NVIDIA+Blackwell+DeepMind+Anthropic+Claude+scoop+breaking&hl=es-419&gl=US&ceid=US:es-419';
    
    // Shield: Enfocado en Zero-Day exploits y ciberdefensa de IA
    const SHIELD_INTEL_FEED = 'https://news.google.com/rss/search?q=cybersecurity+zero-day+exploit+AI+vulnerability+threat+intelligence+breaking&hl=es-419&gl=US&ceid=US:es-419';
    
    // Novedades de Fundadores y Creaciones de IA
    const CREATIONS_FEED = 'https://news.google.com/rss/search?q=new+AI+startup+founder+exit+investment+funding+round+Silicon+Valley+latest&hl=es-419&gl=US&ceid=US:es-419';

    const [aiFeed, shieldFeed, creationsFeed] = await Promise.all([
      parser.parseURL(AI_MASTER_FEED),
      parser.parseURL(SHIELD_INTEL_FEED),
      parser.parseURL(CREATIONS_FEED)
    ]);

    const getTimeAgo = (dateStr: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      if (seconds < 60) return "¡RECIÉN LANZADO!";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Hace ${minutes} min`;
      if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} h`;
      return "Dato Reciente";
    };

    const formatItems = (items: any[], category: string) => items.slice(0, 12).map((item) => {
      const uniqueId = generateShortId(item.link);
      
      const getRealImage = (title: string, cat: string) => {
        const t = title.toLowerCase();
        const base = "https://images.unsplash.com/";
        
        if (cat === "SHIELD") return `${base}photo-1633265486232-442b85c74e5f?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("musk") || t.includes("tesla") || t.includes("xai")) return `${base}photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("altman") || t.includes("openai") || t.includes("gpt")) return `${base}photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("nvidia") || t.includes("chip") || t.includes("gpu")) return `${base}photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("google") || t.includes("deepmind")) return `${base}photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        
        return `${base}photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
      };

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: (item.contentSnippet || "Analizando el impacto de esta creación en el ecosistema global...").substring(0, 250) + "...",
        author: item.source?.name || "HAWKIN Intelligence",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "En Vivo",
        timestamp: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(), // Campo para ordenamiento
        image: getRealImage(item.title, category),
        url: item.link
      };
    });

    return NextResponse.json({
      news: formatItems(aiFeed.items, "RUMORES & CEOS"),
      shield: formatItems(shieldFeed.items, "SHIELD INTEL"),
      hardware: formatItems(creationsFeed.items, "CREACIONES IA")
    });
  } catch (error) {
    return new NextResponse("Error en el Motor HAWKIN", { status: 500 });
  }
}
