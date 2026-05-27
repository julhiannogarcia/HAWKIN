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
  // ==========================================
  // 4-7 AÑOS: EXPLORADORES (ESTIMULACIÓN DE ALTA CAPACIDAD)
  // ==========================================
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
    id: 'exp-5', title: 'Lógica de Robots', icon: '🤖', color: 'bg-[#F5EEF8]', ageGroup: '4-7', phase: 'Creación',
    description: 'Instrucciones paso a paso.',
    steps: [
      { id: 's1', type: 'intro', title: 'Algoritmos Simples', description: 'Dar órdenes claras.', avatarText: 'Un robot solo hace lo que le dices. Vamos a darle una orden secreta.', content: {} },
      { id: 's2', type: 'exercise', title: 'Misión: Caminar', description: 'Para que el robot llegue a la meta, ¿qué orden es mejor?', avatarText: 'Piensa como un programador. Si quieres que avance, ¿qué botón pulsarías?', content: { options: ['Girar', 'Caminar Adelante', 'Dormir'], correctOption: 1 } },
      { id: 's3', type: 'fact', title: 'El Lenguaje del Robot', description: 'Los robots hablan con números.', avatarText: 'Los robots no entienden palabras como nosotros, ellos leen código binario.', content: { fact: 'El código binario solo usa 0 y 1 para crear todo lo que ves en una pantalla.' } }
    ]
  },

  // ==========================================
  // 8-12 AÑOS: CREADORES (CIENCIA, INGENIERÍA Y LÓGICA)
  // ==========================================
  {
    id: 'cre-1', title: 'Ingeniería Aeroespacial', icon: '🚀', color: 'bg-[#FBFCFC]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Propulsión y Newton.',
    steps: [
      { id: 's1', type: 'intro', title: 'Misión Marte', description: 'Vencer la gravedad.', avatarText: 'Para llegar a Marte necesitamos mucha fuerza. Estudiaremos la Tercera Ley de Newton.', content: {} },
      { id: 's2', type: 'exercise', title: 'Reto de Empuje', description: 'Si el gas sale hacia abajo con fuerza 10, ¿hacia dónde va el cohete?', avatarText: 'Aplica la física: Acción y Reacción. ¿Hacia dónde apunta el vector de movimiento?', content: { options: ['Abajo', 'Arriba', 'Se queda quieto'], correctOption: 1 } },
      { id: 's3', type: 'fact', title: 'Propulsores de Plasma', description: 'El futuro de los viajes espaciales.', avatarText: 'Hoy usamos fuego, pero en el futuro usaremos plasma para viajar más rápido.', content: { fact: 'Un motor de plasma puede ser hasta 10 veces más eficiente que uno químico.' } }
    ]
  },
  {
    id: 'cre-2', title: 'El Código de Fibonacci', icon: '🐚', color: 'bg-[#FDF2E9]', ageGroup: '8-12', phase: 'Maestría',
    description: 'Sucesiones matemáticas en la vida.',
    steps: [
      { id: 's1', type: 'intro', title: 'La Espiral Secreta', description: 'Números que crean vida.', avatarText: 'Descubriremos el número que hace que las flores y galaxias se vean tan hermosas.', content: {} },
      { id: 's2', type: 'logic', title: 'Reto de Sucesión', description: '1, 1, 2, 3, 5, 8... ¿Cuál es el siguiente número?', avatarText: 'Suma los dos últimos números para encontrar el secreto.', content: { options: ['10', '13', '21'], correctOption: 1 } },
      { id: 's3', type: 'fact', title: 'La Proporción Áurea', description: 'El número de oro: 1.618.', avatarText: 'Este número es la firma de la perfección en el diseño del universo.', content: { fact: 'La Proporción Áurea se encuentra incluso en la estructura del ADN humano.' } }
    ]
  },

  // ==========================================
  // 13-17+ AÑOS: VISIONARIOS (TECNOLOGÍA DE FRONTERA)
  // ==========================================
  {
    id: 'vis-1', title: 'Computación Cuántica', icon: '⚛️', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Descubrimiento',
    description: 'Qubits y Superposición.',
    steps: [
      { id: 's1', type: 'intro', title: 'Más allá del Bit', description: 'La paradoja de Schrödinger.', avatarText: 'Bienvenido al nivel de Élite. Las computadoras clásicas usan bits (0 o 1). Las cuánticas usan ambos al mismo tiempo.', content: {} },
      { id: 's2', type: 'exercise', title: 'Lógica del Qubit', description: 'Si un Qubit está en superposición, ¿en qué estado se encuentra?', avatarText: 'Piensa en una moneda girando. ¿Es cara o cruz?', content: { options: ['Solo 0', 'Solo 1', '0 y 1 simultáneamente'], correctOption: 2 } },
      { id: 's3', type: 'fact', title: 'Entrelazamiento', description: 'Conexión instantánea.', avatarText: 'Dos partículas pueden estar conectadas sin importar la distancia. Es la base de la internet cuántica.', content: { fact: 'El entrelazamiento cuántico permite que el cambio de estado de una partícula afecte a la otra de forma inmediata.' } }
    ]
  }
];
