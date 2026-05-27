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
    // FEEDS GLOBALES DE ÉLITE (Edición Internacional en Español)
    // Rumores y Élite: Enfocado en OpenAI, NVIDIA, Tesla y Futuro
    const ELITE_FEED = 'https://news.google.com/rss/search?q=OpenAI+GPT-5+NVIDIA+Blackwell+Tesla+AI+scoop&hl=es-419&gl=US&ceid=US:es-419';
    
    // Shield: Ciberseguridad Global y Vulnerabilidades Críticas
    const SHIELD_FEED = 'https://news.google.com/rss/search?q=cybersecurity+vulnerability+exploit+hacking+threat+intelligence&hl=es-419&gl=US&ceid=US:es-419';
    
    // Mercado: Finanzas, Cripto y Economía de Silicon Valley
    const FINANCE_FEED = 'https://news.google.com/rss/search?q=bitcoin+ethereum+nasdaq+fed+rates+tech+stocks&hl=es-419&gl=US&ceid=US:es-419';

    const [eliteFeed, shieldFeed, financeFeed] = await Promise.all([
      parser.parseURL(ELITE_FEED),
      parser.parseURL(SHIELD_FEED),
      parser.parseURL(FINANCE_FEED)
    ]);

    const getTimeAgo = (dateStr: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      if (seconds < 60) return "En Vivo";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Hace ${minutes} min`;
      if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} horas`;
      return "Global";
    };

    const formatItems = (items: any[], category: string) => items.slice(0, 15).map((item, index) => {
      const uniqueId = generateShortId(item.link);
      
      // MOTOR DE IMÁGENES DE ÉLITE
      const getProfessionalImage = (title: string, cat: string) => {
        const t = title.toLowerCase();
        const base = "https://images.unsplash.com/";
        
        if (cat === "SHIELD") return `${base}photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("bitcoin") || t.includes("crypto") || t.includes("gold")) return `${base}photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("nvidia") || t.includes("chip")) return `${base}photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        if (t.includes("openai") || t.includes("gpt")) return `${base}photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
        
        return `${base}photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000&sig=${uniqueId}`;
      };

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: (item.contentSnippet || "Analizando impacto en la soberanía tecnológica global...").substring(0, 200) + "...",
        author: item.source?.name || "HAWKIN Intel",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: getProfessionalImage(item.title, category),
        url: item.link
      };
    });

    return NextResponse.json({
      news: formatItems(eliteFeed.items, "RUMORES & ÉLITE"),
      shield: formatItems(shieldFeed.items, "SHIELD"),
      hardware: formatItems(financeFeed.items, "FINANZAS")
    });
  } catch (error) {
    return new NextResponse("Error en el Motor HAWKIN", { status: 500 });
  }
}
