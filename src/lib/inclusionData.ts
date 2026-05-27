export type InclusionAgeGroup = '4-7' | '8-12' | '13-17';
export type InclusionPhase = 'Descubrimiento' | 'Maestría' | 'Creación';

export interface InclusionStep {
  id: string;
  type: 'intro' | 'pattern' | 'creative' | 'logic' | 'success' | 'video' | 'fact' | 'exercise';
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
    codeSnippet?: string;
    question?: string;
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
    id: 'exp-1', title: 'Geometría Natural', icon: '❄️', color: 'bg-[#EBF5FB]', ageGroup: '4-7', phase: 'Descubrimiento',
    description: 'Simetría en copos de nieve y flores.',
    steps: [
      { id: 's1', type: 'intro', title: 'Mundo Simétrico', description: 'Todo tiene un reflejo.', avatarText: 'Hola, genio. Mira este copo de nieve. Sus lados son iguales. Eso es simetría.', content: {} },
      { id: 's2', type: 'pattern', title: 'Reflejos', description: 'Completa la forma.', avatarText: '¿Cuál de estas formas encaja perfectamente con la otra mitad?', content: { pattern: ['🌓'], options: ['🌓', '🌕', '🌑'], correctOption: 0 } },
      { id: 's3', type: 'fact', title: 'Simetría en la Naturaleza', description: 'Casi todos los seres vivos son simétricos.', avatarText: 'Mira tus manos, son reflejos una de la otra. ¡Eres una obra de arte geométrica!', content: { fact: 'La simetría bilateral ayuda a los animales a moverse de forma equilibrada.' } }
    ]
  },
  {
    id: 'exp-robot-1', title: 'Comandos de Robot', icon: '🤖', color: 'bg-[#F5EEF8]', ageGroup: '4-7', phase: 'Creación',
    description: 'Instrucciones paso a paso para máquinas.',
    steps: [
      { id: 's1', type: 'intro', title: 'El Lenguaje del Robot', description: 'Dar órdenes claras.', avatarText: 'Los robots no saben qué hacer solos. ¡Tú eres su jefe! Vamos a darle una orden.', content: {} },
      { id: 's2', type: 'exercise', title: 'Misión: Caminar', description: '¿Qué botón hace que el robot avance?', avatarText: 'Si quieres que el robot llegue a la meta, ¿qué comando usarías?', content: { options: ['Girar', 'Caminar', 'Saltar'], correctOption: 1 } }
    ]
  },
  // CREADORES (8-12)
  {
    id: 'cre-phy-1', title: 'Física de Cohetes', icon: '🚀', color: 'bg-[#FBFCFC]', ageGroup: '8-12', phase: 'Maestría',
    description: 'Vencer la gravedad con cálculo.',
    steps: [
      { id: 's1', type: 'intro', title: 'Acción y Reacción', description: 'La Tercera Ley de Newton.', avatarText: 'Bienvenido, ingeniero. Hoy analizaremos cómo escapar de la gravedad terrestre.', content: {} },
      { id: 's2', type: 'exercise', title: 'Vector de Empuje', description: 'Si el gas sale hacia abajo, ¿hacia dónde va el cohete?', avatarText: 'Aplica la ley física. ¿Hacia dónde apunta el vector de movimiento?', content: { options: ['Abajo', 'Arriba', 'Se queda quieto'], correctOption: 1 } },
      { id: 's3', type: 'fact', title: 'Velocidad de Escape', description: 'Cruzar la frontera espacial.', avatarText: 'Para salir de la Tierra necesitamos ir a 11.2 km/s.', content: { fact: '¡Es súper rápido!' } }
    ]
  },
  // VISIONARIOS (13-17)
  {
    id: 'vis-quant-1', title: 'Mundo Cuántico', icon: '⚛️', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Descubrimiento',
    description: 'Qubits, Superposición y Entrelazamiento.',
    steps: [
      { id: 's1', type: 'intro', title: 'Más allá del Bit', description: 'La lógica del futuro.', avatarText: 'Bienvenido al nivel de Élite. Las computadoras normales usan bits. Las cuánticas usan Qubits.', content: {} },
      { id: 's2', type: 'exercise', title: 'Superposición', description: '¿En qué estado está un Qubit antes de medirlo?', avatarText: 'Piensa en una moneda girando. ¿Es cara o cruz?', content: { options: ['Solo 0', 'Solo 1', '0 y 1 al mismo tiempo'], correctOption: 2 } }
    ]
  }
];
