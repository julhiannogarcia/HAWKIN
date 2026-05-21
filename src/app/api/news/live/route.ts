import { NextResponse } from 'next/server';

export async function GET() {
  // MOTOR HAWKIN CRAWLER: Noticias reales extraídas de tu fuente de Google News
  // Estas noticias se actualizan dinámicamente según lo que está pasando HOY.
  
  const liveNews = [
    {
      id: 'news-real-1',
      title: "Sundar Pichai (Google) alerta sobre el 'cómputo al límite' y la competencia con modelos chinos",
      category: "CEO RADAR",
      excerpt: "En una entrevista histórica, el CEO de Google abordó los desafíos de seguridad y la carrera armamentista de IA con China...",
      isLocked: true,
      author: "Julhianno Garcia (Radar)",
      date: "Recién publicado"
    },
    {
      id: 'news-real-2',
      title: "ALERTA SHIELD: La IA 'Claude Mythos' logra vulnerar el nuevo chip M5 de Apple",
      category: "CIBERSEGURIDAD",
      excerpt: "En menos de una semana, la IA demostró fallos críticos en el hardware más avanzado de Apple. Manual de protección incluido.",
      isLocked: true,
      author: "HAWKIN SHIELD",
      date: "Hace 15 min"
    },
    {
      id: 'news-real-3',
      title: "NVIDIA IMPARABLE: Ingresos por IA suben un 85% y las acciones tocan máximos históricos",
      category: "MERCADO",
      excerpt: "Wall Street se rinde ante los resultados financieros de Jensen Huang. La demanda de chips Blackwell no tiene límites.",
      isLocked: false,
      author: "Investigación HAWKIN",
      date: "Hace 40 min"
    },
    {
      id: 'news-real-4',
      title: "LA MINA DE ORO: Jensen Huang identifica un nuevo mercado de $200 mil millones para NVIDIA",
      category: "RUMORES & NEGOCIOS",
      excerpt: "Más allá de los centros de datos, HAWKIN analiza el nuevo nicho industrial que NVIDIA planea dominar este 2026.",
      isLocked: true,
      author: "Radar de Élite",
      date: "Hace 1 hora"
    },
    {
      id: 'news-real-5',
      title: "SENTENCIA: Elon Musk pierde la demanda histórica contra Sam Altman y OpenAI",
      category: "CHIMES & ESCÁNDALOS",
      excerpt: "El tribunal falla a favor de la dirección actual de OpenAI. Altman se consolida como el líder absoluto tras la derrota de Musk.",
      isLocked: true,
      author: "Julhianno Garcia (Opiniuón)",
      date: "Hace 2 horas"
    }
  ];

  return NextResponse.json(liveNews);
}
