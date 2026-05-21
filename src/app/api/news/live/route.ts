import { NextResponse } from 'next/server';

export async function GET() {
  // En un sistema real, aquí llamaríamos a NewsAPI o Bing News API
  // Simulamos el motor inteligente con noticias frescas según tus criterios
  const liveNews = [
    {
      id: 'news-1',
      title: "RUMOR: Sam Altman planea alianza secreta con NVIDIA para chips de 2nm",
      category: "CEO RADAR",
      excerpt: "Fuentes internas indican que OpenAI busca independencia total de la infraestructura actual...",
      isLocked: true,
      author: "Radar HAWKIN",
      date: "Recién publicado"
    },
    {
      id: 'news-2',
      title: "ESCÁNDALO: Filtración masiva en Meta expone planes de Zuckerberg para IA militar",
      category: "CHIMES & RUMORES",
      excerpt: "Documentos confidenciales sugieren una dirección agresiva en el desarrollo de agentes autónomos...",
      isLocked: true,
      author: "Investigación HAWKIN",
      date: "Hace 5 minutos"
    },
    {
      id: 'news-3',
      title: "NUEVO HARDWARE: Razer lanza laptop con procesador de IA dedicado de 1000 TOPS",
      category: "TENDENCIAS",
      excerpt: "La nueva era de las computadoras personales ha llegado. Mira el manual de instalación abajo...",
      isLocked: false,
      author: "Hardware Desk",
      date: "Hace 12 minutos"
    },
    {
      id: 'news-4',
      title: "CIBERSEGURIDAD: Detectado nuevo virus que roba llaves de criptomonedas usando IA",
      category: "SHIELD",
      excerpt: "Los hackers están usando modelos de lenguaje para crear correos de phishing perfectos. Guía paso a paso incluida.",
      isLocked: true,
      author: "HAWKIN SHIELD",
      date: "Hace 1 hora"
    }
  ];

  return NextResponse.json(liveNews);
}
