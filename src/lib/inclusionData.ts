export interface InclusionStep {
  id: string;
  type: 'intro' | 'pattern' | 'creative' | 'logic' | 'success';
  title: string;
  description: string;
  avatarText: string;
  content: {
    pattern?: string[]; // Ej: ['🔴', '🔵', '🔴', '?']
    options?: string[]; // Ej: ['🔴', '🔵', '🟢']
    correctOption?: number;
    fact?: string; // Dato científico o técnico
  };
}

export interface InclusionModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  steps: InclusionStep[];
}

export const INCLUSION_CURRICULUM: InclusionModule[] = [
  {
    id: 'patterns',
    title: 'El Arquitecto de Patrones',
    icon: '📐',
    color: 'bg-[#EBF5FB]',
    description: 'Aprende sobre la estructura del universo a través de secuencias.',
    steps: [
      {
        id: 'p1',
        type: 'intro',
        title: 'Bienvenidos, Arquitectos',
        description: 'Todo en la naturaleza sigue un orden. Vamos a descubrirlo juntos.',
        avatarText: 'Hola, genio. Hoy vamos a jugar con el orden de las cosas. Mira los colores con atención.',
        content: {}
      },
      {
        id: 'p2',
        type: 'pattern',
        title: 'Secuencia Binaria',
        description: 'Completa la serie lógica siguiendo el ritmo.',
        avatarText: '¿Puedes ver qué color sigue en esta fila? Tómate tu tiempo, el silencio es tu amigo.',
        content: {
          pattern: ['🔵', '⚪', '🔵', '⚪'],
          options: ['🔴', '🔵', '🟢'],
          correctOption: 1
        }
      },
      {
        id: 'p3',
        type: 'logic',
        title: 'Dato de Élite: Fractales',
        description: '¿Sabías que los copos de nieve son patrones matemáticos?',
        avatarText: 'Las matemáticas están en todas partes, incluso en la nieve. Mira este dato increíble.',
        content: {
          fact: 'Los fractales son patrones que se repiten a sí mismos en diferentes escalas. ¡Como un zoom infinito!'
        }
      }
    ]
  },
  {
    id: 'logic',
    title: 'Pequeños Ingenieros',
    icon: '🚀',
    color: 'bg-[#E9F7EF]',
    description: 'Retos de alta capacidad para resolver problemas complejos.',
    steps: [
      {
        id: 'l1',
        type: 'intro',
        title: 'Misión Marte',
        description: 'Vamos a construir un sistema de señales para nuestra base espacial.',
        avatarText: 'Para llegar a Marte necesitamos mucha lógica. ¿Me ayudas a organizar los suministros?',
        content: {}
      }
    ]
  }
];
