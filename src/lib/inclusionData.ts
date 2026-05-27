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
  // GRUPO 1: EXPLORADORES (4-7 AÑOS) - ESTIMULACIÓN SENSORIAL PRO
  // ==========================================
  {
    id: 'exp-geo-1',
    title: 'Geometría de la Naturaleza',
    icon: '❄️',
    color: 'bg-[#EBF5FB]',
    ageGroup: '4-7',
    phase: 'Descubrimiento',
    description: 'Análisis de simetría y fractales simples en el mundo real.',
    steps: [
      {
        id: 's1',
        type: 'intro',
        title: 'El Ojo del Observador',
        description: 'Todo lo que ves tiene una forma matemática.',
        avatarText: 'Bienvenido, pequeño genio. Hoy vamos a entrenar tu visión para ver el código oculto en las flores y los cristales de hielo.',
        content: {}
      },
      {
        id: 's2',
        type: 'fact',
        title: 'Simetría Radial',
        description: 'El orden de las estrellas de mar.',
        avatarText: 'Mira esta estrella. Si la cortas por el centro, todos sus lados son iguales. Eso se llama simetría.',
        content: { fact: 'La simetría radial permite a los organismos captar información de su entorno en 360 grados.' }
      },
      {
        id: 's3',
        type: 'pattern',
        title: 'Crecimiento de Pétalos',
        description: 'Identifica la secuencia de expansión.',
        avatarText: 'Las flores crecen en espirales. ¿Cuál es la siguiente forma en este patrón de crecimiento?',
        content: {
          pattern: ['🌱', '🌿', '🌸'],
          options: ['🍂', '🌸', '🌵'],
          correctOption: 1
        }
      }
    ]
  },
  {
    id: 'exp-logic-1',
    title: 'El Código Secreto (Gates)',
    icon: '🔌',
    color: 'bg-[#E9F7EF]',
    ageGroup: '4-7',
    phase: 'Maestría',
    description: 'Introducción visual a las compuertas lógicas (AND/OR).',
    steps: [
      {
        id: 's1',
        type: 'logic',
        title: 'La Compuerta AND',
        description: 'Para que la luz se encienda, necesitamos dos llaves.',
        avatarText: 'En el mundo de los robots, a veces necesitamos que dos cosas pasen al mismo tiempo para que algo funcione.',
        content: {
          longText: 'Si tenemos la Llave A y la Llave B encendidas, la luz brilla. ¡Es lógica pura!'
        }
      }
    ]
  },

  // ==========================================
  // GRUPO 2: CREADORES (8-12 AÑOS) - CIENCIA Y LÓGICA NIVEL ÉLITE
  // ==========================================
  {
    id: 'cre-phy-1',
    title: 'Ingeniería de Cohetes',
    icon: '🚀',
    color: 'bg-[#FDF2E9]',
    ageGroup: '8-12',
    phase: 'Descubrimiento',
    description: 'Física de propulsión y leyes de Newton aplicadas.',
    steps: [
      {
        id: 's1',
        type: 'intro',
        title: 'Misión: Escape Atmosférico',
        description: 'Cómo vencer la gravedad con cálculo.',
        avatarText: 'Hoy analizaremos la Tercera Ley de Newton: A toda acción corresponde una reacción igual y opuesta. Es la base de nuestros viajes a Marte.',
        content: {}
      },
      {
        id: 's2',
        type: 'exercise',
        title: 'Cálculo de Empuje',
        description: 'Si el cohete expulsa gas hacia abajo, ¿hacia dónde se mueve?',
        avatarText: 'Analiza el vector de fuerza. Es una pregunta lógica de ingeniería.',
        content: {
          options: ['Hacia la derecha', 'Hacia arriba', 'Se queda quieto'],
          correctOption: 1
        }
      },
      {
        id: 's3',
        type: 'fact',
        title: 'Velocidad de Escape',
        description: '11.2 kilómetros por segundo.',
        avatarText: 'Para salir de la Tierra, necesitamos ir extremadamente rápido. Esa cifra es una constante física.',
        content: { fact: 'La velocidad de escape es la velocidad mínima necesaria para que un objeto sin propulsión supere la atracción gravitatoria.' }
      }
    ]
  },
  {
    id: 'cre-algo-1',
    title: 'Maestría en Algoritmos',
    icon: '🧬',
    color: 'bg-[#F5EEF8]',
    ageGroup: '8-12',
    phase: 'Maestría',
    description: 'Estructuras de datos y optimización de procesos lógicos.',
    steps: [
      {
        id: 's1',
        type: 'logic',
        title: 'Búsqueda Binaria',
        description: 'Encuentra un número eliminando la mitad de las opciones cada vez.',
        avatarText: '¿Sabías que puedes encontrar una palabra en un diccionario de 1000 páginas en solo 10 pasos? Eso es eficiencia algorítmica.',
        content: {
          longText: 'La búsqueda binaria divide el espacio de búsqueda. Si el número es mayor al centro, descartamos la mitad inferior. Repetimos hasta encontrarlo.'
        }
      },
      {
        id: 's2',
        type: 'exercise',
        title: 'El Reto del Pívot',
        description: 'Si buscamos el 7 en una lista del 1 al 10, ¿cuál es nuestro primer pívot?',
        avatarText: 'Aplica la regla de la mitad.',
        content: {
          options: ['2', '5', '9'],
          correctOption: 1
        }
      }
    ]
  },

  // ==========================================
  // GRUPO 3: VISIONARIOS (13-17+ AÑOS) - TECNOLOGÍA DE FRONTERA
  // ==========================================
  {
    id: 'vis-quant-1',
    title: 'Computación Cuántica',
    icon: '⚛️',
    color: 'bg-[#FBFCFC]',
    ageGroup: '13-17',
    phase: 'Descubrimiento',
    description: 'Superposición, entrelazamiento y la lógica del Qubit.',
    steps: [
      {
        id: 's1',
        type: 'intro',
        title: 'Más allá del Bit',
        description: 'Cuando 0 y 1 ocurren al mismo tiempo.',
        avatarText: 'Bienvenido al nivel más alto de HAWKIN. Las computadoras clásicas usan bits. Las cuánticas usan Qubits, capaces de estar en múltiples estados.',
        content: {}
      },
      {
        id: 's2',
        type: 'fact',
        title: 'Superposición Cuántica',
        description: 'La paradoja del observador.',
        avatarText: 'Un Qubit no es 0 ni 1 hasta que lo medimos. Mientras tanto, explora todas las soluciones posibles simultáneamente.',
        content: { fact: 'La superposición es el principio que permite a las computadoras cuánticas resolver en segundos problemas que a una supercomputadora clásica le tomarían milenios.' }
      }
    ]
  },
  {
    id: 'vis-sec-1',
    title: 'Criptografía y Ciberdefensa',
    icon: '🔐',
    color: 'bg-[#EAEDED]',
    ageGroup: '13-17',
    phase: 'Maestría',
    description: 'Protocolos de cifrado asimétrico y seguridad de redes.',
    steps: [
      {
        id: 's1',
        type: 'logic',
        title: 'RSA: El Poder de los Primos',
        description: 'Cómo dos números gigantes protegen tu cuenta bancaria.',
        avatarText: 'La seguridad de internet depende de que sea fácil multiplicar dos números primos, pero casi imposible factorizarlos. Analicemos el protocolo RSA.',
        content: {
          longText: ' RSA utiliza una clave pública y una privada. La seguridad reside en la dificultad computacional de la factorización de enteros grandes.'
        }
      }
    ]
  },
  {
    id: 'vis-ai-adv',
    title: 'Arquitectura de Transformadores',
    icon: '🤖',
    color: 'bg-[#F4ECF7]',
    ageGroup: '13-17',
    phase: 'Creación',
    description: 'Cómo funcionan los modelos de lenguaje como GPT.',
    steps: [
      {
        id: 's1',
        type: 'intro',
        title: 'Mecanismos de Atención',
        description: 'Entendiendo el "Self-Attention" en IA.',
        avatarText: '¿Cómo sabe una IA qué palabra es más importante en una frase? Mediante la atención. Analicemos cómo se procesan las secuencias de datos.',
        content: {}
      }
    ]
  }
];
