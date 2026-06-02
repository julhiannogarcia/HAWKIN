const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const news = [
    {
      title: "HAWKIN ALPHA ID: El nuevo estándar de soberanía digital",
      content: "Hoy lanzamos oficialmente HAWKIN ALPHA ID, un sistema de identidad único que elimina la dependencia de terceros como Google o Apple. Cada socio ahora posee su propia llave de acceso cifrada, garantizando privacidad absoluta y control total sobre su rastro digital en el imperio.",
      excerpt: "Independencia tecnológica total: Presentamos el sistema Alpha ID para socios de élite.",
      category: "HAWKIN",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
      published: true,
      isUrgent: true,
      isLocked: false
    },
    {
      title: "Rumores de GPT-5: Capacidades de razonamiento nivel humano",
      content: "Fuentes internas sugieren que OpenAI está probando una versión preliminar de GPT-5 que supera con creces las pruebas de Turing tradicionales. El modelo, apodado internamente como 'Gobi', muestra una capacidad de planificación y memoria a largo plazo que podría redefinir el trabajo profesional en 2026.",
      excerpt: "Filtraciones desde Silicon Valley revelan los avances del próximo gran modelo de lenguaje.",
      category: "RUMORES & CEOS",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000",
      published: true,
      isUrgent: false,
      isLocked: true
    },
    {
      title: "NVIDIA Blackwell B200: El cerebro del imperio HAWKIN",
      content: "Nuestra infraestructura ha comenzado la transición a los nuevos chips Blackwell de NVIDIA. Esta actualización permitirá a la IA de HAWKIN procesar flujos de datos globales en tiempo real con una latencia reducida en un 40%. La soberanía tecnológica de nuestros socios está asegurada.",
      excerpt: "Actualización masiva de hardware en nuestros nodos principales.",
      category: "HARDWARE",
      image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=2000",
      published: true,
      isUrgent: false,
      isLocked: true
    },
    {
      title: "Vulnerabilidad Zero-Day detectada en protocolos bancarios",
      content: "El equipo de HAWKIN SHIELD ha interceptado una brecha crítica en el sistema SWIFT que afecta a transferencias internacionales. Recomendamos a todos los socios Alpha activar el protocolo de verificación física antes de realizar movimientos de gran escala esta semana.",
      excerpt: "Alerta crítica de seguridad financiera interceptada por nuestros radares.",
      category: "SHIELD INTEL",
      image: "https://images.unsplash.com/photo-1633265486232-442b85c74e5f?auto=format&fit=crop&q=80&w=2000",
      published: true,
      isUrgent: true,
      isLocked: true
    },
    {
      title: "Julhianno Garcia anuncia expansión del Radar Global",
      content: "En una sesión privada, el Fundador reveló los planes para expandir el Radar Global a más de 50 países. La meta es crear el primer ecosistema de inteligencia humana-artificial descentralizado que no pueda ser censurado por gobiernos ni corporaciones.",
      excerpt: "La visión del Fundador para la siguiente fase del imperio.",
      category: "CEOS",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000",
      published: true,
      isUrgent: false,
      isLocked: false
    }
  ];

  console.log('--- SEEDING NEWS ---');
  for (const n of news) {
    const created = await prisma.news.create({ data: n });
    console.log(`Created: ${created.title}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
