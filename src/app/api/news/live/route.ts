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
    // FILTROS DE ÉLITE HAWKIN - RASTREO MULTIDIMENSIONAL
    const FEEDS = {
      ELITE: 'https://news.google.com/rss/search?q=CEO+founder+millionaire+billionaire+artificial+intelligence+IA&hl=es-419&gl=PE&ceid=PE:es-419',
      BUSINESS: 'https://news.google.com/rss/search?q=tech+acquisition+bankruptcy+scandal+layoffs+fusión+IA&hl=es-419&gl=PE&ceid=PE:es-419',
      SHIELD: 'https://news.google.com/rss/search?q=cybersecurity+hacking+vulnerability+exploit+ransomware&hl=es-419&gl=PE&ceid=PE:es-419',
      HARDWARE: 'https://news.google.com/rss/search?q=laptop+gaming+IA+processor+chip+nvidia+amd&hl=es-419&gl=PE&ceid=PE:es-419'
    };

    // Lanzamos los 4 cazadores simultáneamente
    const [eliteRes, businessRes, shieldRes, hardwareRes] = await Promise.all([
      parser.parseURL(FEEDS.ELITE),
      parser.parseURL(FEEDS.BUSINESS),
      parser.parseURL(FEEDS.SHIELD),
      parser.parseURL(FEEDS.HARDWARE)
    ]);

    const getTimeAgo = (dateStr: string) => {
      const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      if (seconds < 60) return "Ahora";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Hace ${minutes} min`;
      if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} h`;
      return "Hace 1 día";
    };

    const formatItems = (items: any[], category: string) => items.slice(0, 10).map((item, index) => {
      const uniqueId = generateShortId(item.link);
      
      // Inteligencia de Imágenes: Mapeamos fotos de alta fidelidad según palabras clave
      const getProfessionalImage = (title: string, cat: string) => {
        const t = title.toLowerCase();
        if (cat === "SHIELD") return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b";
        if (cat === "HARDWARE") return "https://images.unsplash.com/photo-1518770660439-4636190af475";
        if (t.includes("musk")) return "https://images.unsplash.com/photo-1570126618983-224422391cf1"; // Inversor/CEO
        if (t.includes("altman") || t.includes("openai")) return "https://images.unsplash.com/photo-1677442136019-21780ecad995";
        if (t.includes("nvidia") || t.includes("huang")) return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485";
        return `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000&id=${index}`;
      };

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: item.contentSnippet?.substring(0, 180) + "...",
        content: item.contentSnippet || "Contenido bajo análisis de la red HAWKIN.",
        isLocked: index > 2,
        author: item.source?.name || "HAWKIN Global Intelligence",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: getProfessionalImage(item.title, category),
        url: item.link,
        manual: category === "SHIELD" ? "Guía de protección HAWKIN Shield activa para esta vulnerabilidad." : null,
        targetOS: category === "SHIELD" ? "Universal (Windows/Mac/Linux)" : null,
        installCode: category === "SHIELD" ? "# HAWKIN SHIELD AUTO-PROTECT\nsudo apt update && sudo apt upgrade -y\n# Bloqueando puertos de riesgo\nsudo ufw deny 445/tcp" : null
      };
    });

    return NextResponse.json({
      news: [...formatItems(eliteRes.items, "ÉLITE CEO"), ...formatItems(businessRes.items, "NEGOCIOS & IA")],
      shield: formatItems(shieldRes.items, "SHIELD"),
      hardware: formatItems(hardwareRes.items, "TENDENCIAS")
    });
  } catch (error) {
    console.error("[SUPREME_ENGINE_ERROR]", error);
    return new NextResponse("Error en el Motor Supremo", { status: 500 });
  }
}
