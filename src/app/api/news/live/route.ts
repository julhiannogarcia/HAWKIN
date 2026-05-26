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
      
      // MOTOR DE IMÁGENES AUTÉNTICAS CON SEEDS DINÁMICOS
      const getProfessionalImage = (title: string, cat: string) => {
        const t = title.toLowerCase();
        const base = "https://images.unsplash.com/";
        
        // Colecciones ultra-específicas para evitar repetición
        if (cat === "SHIELD") {
          return `${base}photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        }
        if (t.includes("nvidia") || t.includes("chip") || t.includes("gpu")) {
          return `${base}photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        }
        if (t.includes("altman") || t.includes("openai") || t.includes("gpt")) {
          return `${base}photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        }
        if (t.includes("apple") || t.includes("mac") || t.includes("iphone")) {
          return `${base}photo-1510511459019-5dee99dc47ef?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        }
        if (t.includes("robot") || t.includes("tesla") || t.includes("musk")) {
          return `${base}photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        }
        
        // Imagen por defecto tecnológica variada
        return `${base}photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
      };

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: (item.contentSnippet || "Analizando impacto tecnológico...").substring(0, 160) + "...",
        author: item.source?.name || "HAWKIN Intel",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: getProfessionalImage(item.title, category),
        url: item.link
      };
    });

    return NextResponse.json({
      news: formatItems(aiFeed.items, "RUMORES & ÉLITE"),
      shield: formatItems(shieldFeed.items, "SHIELD"),
      hardware: formatItems(hardwareFeed.items, "TENDENCIAS")
    });
  } catch (error) {
    return new NextResponse("Error en el Motor HAWKIN", { status: 500 });
  }
}
