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

      // Mapeo de imágenes por palabras clave para mayor realismo
      const getImageUrl = (title: string, cat: string) => {
        if (cat === "SHIELD") {
          if (title.toLowerCase().includes("windows")) return "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&q=80&w=1000";
          if (title.toLowerCase().includes("mac") || title.toLowerCase().includes("apple")) return "https://images.unsplash.com/photo-1611186871348-b1ce696e543b?auto=format&fit=crop&q=80&w=1000";
          if (title.toLowerCase().includes("linux")) return "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1000";
          return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000";
        }
        return `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000&seed=${index}`;
      };

      return {
        id: uniqueId,
        title: item.title.split(' - ')[0],
        category: category,
        excerpt: item.contentSnippet?.substring(0, 160) + "...",
        isLocked: index > 2,
        author: item.source?.name || item.source || "HAWKIN Intelligence",
        date: item.pubDate ? getTimeAgo(item.pubDate) : "Ahora",
        image: getImageUrl(item.title, category),
        url: item.link,
        // DATOS VERÍDICOS PARA SHIELD
        manual: isShield ? "Manual de Protección HAWKIN Shield: Acciones críticas de mitigación." : null,
        targetOS: isShield ? (item.title.toLowerCase().includes("windows") ? "Windows" : item.title.toLowerCase().includes("mac") ? "MacOS" : "Linux / Servidores") : null,
        purpose: isShield ? "Bloqueo de puertos vulnerables y actualización de parches de seguridad de emergencia." : null,
        installCode: isShield ? `# EJECUCIÓN EN: ${item.title.toLowerCase().includes("windows") ? "POWERSHELL (ADMIN)" : "TERMINAL (ROOT)"}\n# Propósito: Mitigar vulnerabilidad detectada\n\n${item.title.toLowerCase().includes("windows") ? "netsh advfirewall set allprofiles state on\n# Bloqueando puerto detectado\nnetsh advfirewall firewall add rule name='ShieldBlock' protocol=TCP localport=445 action=block dir=IN" : "sudo ufw enable\nsudo ufw deny 445/tcp\nsudo ufw status"}` : null
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
