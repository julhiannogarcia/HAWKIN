export type InclusionAgeGroup = '4-7' | '8-12' | '13-17';
export type InclusionPhase = 'Descubrimiento' | 'Maestría' | 'Creación';

export interface InclusionStep {
  id: string;
  type: 'intro' | 'pattern' | 'creative' | 'logic' | 'success' | 'video' | 'fact';
  title: string;
  description: string;
  avatarText: string;
  content: {
    pattern?: string[];
    options?: string[];
    correctOption?: number;
    fact?: string;
    videoUrl?: string;
    longText?: string;
    image?: string;
  };
}

export interface InclusionModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  ageGroup: InclusionAgeGroup;
  phase: InclusionPhase;
  description: string;
  steps: InclusionStep[];
}

export const INCLUSION_CURRICULUM: InclusionModule[] = [
  // EXPLORADORES (4-7)
  {
    id: 'exp-1',
    title: 'El Jardín de las Secuencias',
    icon: '🌸',
    color: 'bg-[#EBF5FB]',
    ageGroup: '4-7',
    phase: 'Descubrimiento',
    description: 'Aprende el orden natural de las flores y los colores.',
    steps: [
      { id: 's1', type: 'intro', title: '¡Hola!', description: 'Bienvenido al jardín.', avatarText: 'Hola, pequeño explorador. Mira las flores.', content: {} },
      { id: 's2', type: 'pattern', title: 'Serie Roja', description: '¿Qué flor sigue?', avatarText: 'Roja, Azul, Roja... ¿Cuál viene?', content: { pattern: ['🔴', '🔵', '🔴'], options: ['🔵', '🔴'], correctOption: 0 } }
    ]
  },
  {
    id: 'exp-2',
    title: 'Sinfonía Espacial',
    icon: '🎵',
    color: 'bg-[#FDF2E9]',
    ageGroup: '4-7',
    phase: 'Descubrimiento',
    description: 'Sonidos suaves del espacio.',
    steps: [{ id: 's1', type: 'intro', title: 'Música Estelar', description: 'Escucha con calma.', avatarText: 'Las estrellas tienen música suave.', content: {} }]
  },
  {
    id: 'exp-3',
    title: 'Arquitectos de Bloques',
    icon: '🧱',
    color: 'bg-[#E9F7EF]',
    ageGroup: '4-7',
    phase: 'Maestría',
    description: 'Construye torres lógicas.',
    steps: [{ id: 's1', type: 'pattern', title: 'Torre Alta', description: '¿Qué bloque falta?', avatarText: 'Naranja, Naranja, Azul... ¿Cuál sigue?', content: { pattern: ['🟧', '🟧', '🟦'], options: ['🟧', '🟦'], correctOption: 1 } }]
  },
  {
    id: 'exp-4',
    title: 'Amigos de la Selva',
    icon: '🦜',
    color: 'bg-[#FEF9E7]',
    ageGroup: '4-7',
    phase: 'Descubrimiento',
    description: 'Reconoce patrones animales.',
    steps: [{ id: 's1', type: 'intro', title: 'Selva Calma', description: 'Mira los animales.', avatarText: 'En la selva hay amigos muy tranquilos.', content: {} }]
  },

  // CREADORES (8-12)
  {
    id: 'cre-1',
    title: 'El Código del Universo',
    icon: '🔢',
    color: 'bg-[#EBF5FB]',
    ageGroup: '8-12',
    phase: 'Descubrimiento',
    description: 'Matemáticas secretas de la naturaleza.',
    steps: [{ id: 's1', type: 'fact', title: 'Proporción Áurea', description: 'Diseño perfecto.', avatarText: 'Los caracoles usan matemáticas para crecer.', content: { fact: 'La Proporción Áurea (1.618) está en todo el universo.' } }]
  },
  {
    id: 'cre-2',
    title: 'Ingenieros de Patrones',
    icon: '📐',
    color: 'bg-[#F5EEF8]',
    ageGroup: '8-12',
    phase: 'Maestría',
    description: 'Geometría rotacional compleja.',
    steps: [{ id: 's1', type: 'pattern', title: 'Rotación', description: '¿Hacia dónde gira?', avatarText: 'Mira cómo giran las figuras.', content: { pattern: ['⬆️', '➡️', '⬇️'], options: ['⬅️', '⬆️'], correctOption: 0 } }]
  },
  {
    id: 'cre-3',
    title: 'Bio-Sistemas Digitales',
    icon: '🧬',
    color: 'bg-[#EBF5FB]',
    ageGroup: '8-12',
    phase: 'Creación',
    description: 'Diseña ecosistemas.',
    steps: [{ id: 's1', type: 'intro', title: 'Vida Digital', description: 'Crea armonía.', avatarText: 'Vamos a diseñar un mundo equilibrado.', content: {} }]
  },
  {
    id: 'cre-4',
    title: 'Radar de Fibonacci',
    icon: '🐚',
    color: 'bg-[#FEF9E7]',
    ageGroup: '8-12',
    phase: 'Maestría',
    description: 'Sucesiones numéricas.',
    steps: [{ id: 's1', type: 'logic', title: 'Fibonacci', description: 'Suma de números.', avatarText: '1, 1, 2, 3, 5, 8... ¿Qué sigue?', content: { options: ['10', '13'], correctOption: 1 } }]
  },

  // VISIONARIOS (13-17)
  {
    id: 'vis-1',
    title: 'Arquitectura de Redes',
    icon: '🧠',
    color: 'bg-[#FBFCFC]',
    ageGroup: '13-17',
    phase: 'Descubrimiento',
    description: 'IA Deep Learning.',
    steps: [{ id: 's1', type: 'intro', title: 'Neuronas de IA', description: 'Cómo aprenden las máquinas.', avatarText: 'Analizaremos cómo se entrena una red neuronal.', content: {} }]
  },
  {
    id: 'vis-2',
    title: 'Laboratorio de Algoritmos',
    icon: '💻',
    color: 'bg-[#E8F8F5]',
    ageGroup: '13-17',
    phase: 'Maestría',
    description: 'Eficiencia Big O.',
    steps: [{ id: 's1', type: 'logic', title: 'Eficiencia', description: 'Caminos rápidos.', avatarText: '¿Cuál es el algoritmo más rápido?', content: { options: ['O(1)', 'O(n)'], correctOption: 0 } }]
  },
  {
    id: 'vis-3',
    title: 'Diseño de Futuros',
    icon: '🎨',
    color: 'bg-[#F4ECF7]',
    ageGroup: '13-17',
    phase: 'Creación',
    description: 'UX y Filosofía.',
    steps: [{ id: 's1', type: 'intro', title: 'Diseño Humano', description: 'Crea interfaces.', avatarText: 'Diseñar es pensar en el usuario.', content: {} }]
  },
  {
    id: 'vis-4',
    title: 'Criptografía y Seguridad',
    icon: '🔐',
    color: 'bg-[#EAEDED]',
    ageGroup: '13-17',
    phase: 'Maestría',
    description: 'Hashing y Privacidad.',
    steps: [{ id: 's1', type: 'fact', title: 'Privacidad', description: 'Cifrado total.', avatarText: 'El hashing protege tus datos.', content: { fact: 'El hashing es irreversible y único.' } }]
  }
];
