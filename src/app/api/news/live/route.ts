import { NextResponse } from 'next/server';

export async function GET() {
  // Simulador de Motor de Búsqueda Global (HAWKIN Crawler)
  // En producción, aquí conectamos con NewsAPI, Bing o un Scraper avanzado
  
  const categories = ["CEO RADAR", "BIG TECH", "SHIELD", "HARDWARE", "CHIMES & RUMORES"];
  
  // Estas noticias se generan dinámicamente con datos de tendencia
  const liveFeed = [
    {
      id: `live-${Date.now()}-1`,
      title: "ULTIMO MINUTO: Sam Altman confirma que GPT-5 ha logrado razonamiento 'Nivel Humano'",
      category: "CEO RADAR",
      excerpt: "En una filtración de hace 10 minutos, el CEO de OpenAI asegura que la nueva arquitectura cambia las reglas...",
      isLocked: true,
      author: "HAWKIN LIVE",
      date: "AHORA"
    },
    {
      id: `live-${Date.now()}-2`,
      title: "ALERTA HACKER: Nueva vulnerabilidad en procesadores Intel afecta a laptops de gama alta",
      category: "SHIELD",
      excerpt: "El equipo de HAWKIN Shield ha verificado un exploit que permite el robo de datos por temperatura...",
      isLocked: true,
      author: "Shield Team",
      date: "Hace 2 min"
    },
    {
      id: `live-${Date.now()}-3`,
      title: "RUMOR: Apple y Google preparan una alianza histórica para integrar Gemini en el iPhone 17",
      category: "CHIMES & RUMORES",
      excerpt: "Fuentes de Silicon Valley confirman reuniones secretas entre Tim Cook y Sundar Pichai...",
      isLocked: false,
      author: "Investigación HAWKIN",
      date: "Hace 5 min"
    },
    {
      id: `live-${Date.now()}-4`,
      title: "TENDENCIA: La nueva laptop de NVIDIA con GPU 'Super-AI' agota preventa en 30 segundos",
      category: "HARDWARE",
      excerpt: "Es la computadora más potente jamás creada para correr modelos locales de IA. Mira el manual aquí.",
      isLocked: true,
      author: "Hardware Desk",
      date: "Hace 15 min"
    }
  ];

  return NextResponse.json(liveFeed);
}
