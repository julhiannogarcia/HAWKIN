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
    id: 'exp-robot-1', title: 'Comandos de Robot', icon: '🤖', color: 'bg-[#F5EEF8]', ageGroup: '4-7', phase: 'Creación',
    description: 'Instrucciones paso a paso para máquinas.',
    steps: [
      { id: 's1', type: 'intro', title: 'El Lenguaje del Robot', description: 'Dar órdenes claras.', avatarText: 'Los robots no saben qué hacer solos. ¡Tú eres su jefe! Vamos a darle una orden.', content: {} },
      { id: 's2', type: 'exercise', title: 'Misión: Caminar', description: '¿Qué botón hace que el robot avance?', avatarText: 'Si quieres que el robot llegue a la meta, ¿qué comando usarías?', content: { options: ['Girar', 'Caminar', 'Saltar'], correctOption: 1 } }
    ]
  },
  {
    id: 'exp-astro-1', title: 'Explorador Solar', icon: '☀️', color: 'bg-[#FEF9E7]', ageGroup: '4-7', phase: 'Descubrimiento',
    description: 'Planetas y estrellas para pequeños genios.',
    steps: [
      { id: 's1', type: 'fact', title: 'El Sol', description: 'Nuestra estrella gigante.', avatarText: 'El Sol es una bola de fuego gigante que nos da luz y calor.', content: { fact: '¡Caben un millón de Tierras dentro del Sol!' } }
    ]
  },

  // ==========================================
  // 8-12 AÑOS: CREADORES (CIENCIA, INGENIERÍA Y LÓGICA)
  // ==========================================
  {
    id: 'cre-phy-1', title: 'Física de Cohetes', icon: '🚀', color: 'bg-[#FBFCFC]', ageGroup: '8-12', phase: 'Maestría',
    description: 'Vencer la gravedad con cálculo.',
    steps: [
      { id: 's1', type: 'intro', title: 'Acción y Reacción', description: 'La Tercera Ley de Newton.', avatarText: 'Bienvenido, ingeniero. Hoy analizaremos cómo escapar de la gravedad terrestre.', content: {} },
      { id: 's2', type: 'exercise', title: 'Vector de Empuje', description: 'Si el gas sale hacia abajo, ¿hacia dónde va el cohete?', avatarText: 'Aplica la ley física. ¿Hacia dónde apunta el vector de movimiento?', content: { options: ['Abajo', 'Arriba', 'Se queda quieto'], correctOption: 1 } },
      { id: 's3', type: 'fact', title: 'Velocidad de Escape', description: 'Cruzar la frontera espacial.', avatarText: 'Para salir de la Tierra necesitamos ir a 11.2 km/s. ¡Es súper rápido!', content: { fact: 'A esa velocidad, podrías cruzar todo el Perú en menos de 2 minutos.' } }
    ]
  },
  {
    id: 'cre-math-1', title: 'Secuencia Fibonacci', icon: '🐚', color: 'bg-[#FDF2E9]', ageGroup: '8-12', phase: 'Maestría',
    description: 'El código matemático de la vida.',
    steps: [
      { id: 's1', type: 'logic', title: 'Suma Infinita', description: '¿Cuál es el siguiente número?', avatarText: 'Recuerda: cada número es la suma de los dos anteriores. 1, 1, 2, 3, 5, 8... ¿Cuál sigue?', content: { options: ['10', '13', '21'], correctOption: 1 } },
      { id: 's2', type: 'fact', title: 'La Espiral Dorada', description: 'Arte en la naturaleza.', avatarText: 'Este patrón está en galaxias y caracoles. Es la firma del orden.', content: { fact: 'La Proporción Áurea se usa en el diseño de los autos más rápidos del mundo.' } }
    ]
  },
  {
    id: 'cre-bio-1', title: 'Células de IA', icon: '🧬', color: 'bg-[#E9F7EF]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Biología molecular aplicada.',
    steps: [
      { id: 's1', type: 'fact', title: 'El ADN', description: 'Tu código fuente.', avatarText: 'Tu cuerpo tiene un libro de instrucciones llamado ADN. Es como el código de un programa.', content: { fact: 'Si estiráramos tu ADN, ¡llegaría de la Tierra a la Luna 6000 veces!' } }
    ]
  },
  {
    id: 'cre-chem-1', title: 'Laboratorio de Átomos', icon: '🧪', color: 'bg-[#F5EEF8]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Química elemental para visionarios.',
    steps: [
      { id: 's1', type: 'exercise', title: 'La Molécula del Agua', description: '¿De qué está hecha el agua?', avatarText: 'H2O significa que necesitamos dos de Hidrógeno y uno de...', content: { options: ['Helio', 'Oxígeno', 'Carbono'], correctOption: 1 } }
    ]
  },

  // ==========================================
  // 13-17+ AÑOS: VISIONARIOS (TECNOLOGÍA DE FRONTERA)
  // ==========================================
  {
    id: 'vis-quant-1', title: 'Mundo Cuántico', icon: '⚛️', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Descubrimiento',
    description: 'Qubits, Superposición y Entrelazamiento.',
    steps: [
      { id: 's1', type: 'intro', title: 'Más allá del Bit', description: 'La lógica del futuro.', avatarText: 'Bienvenido al nivel de Élite. Las computadoras normales usan bits. Las cuánticas usan Qubits.', content: {} },
      { id: 's2', type: 'exercise', title: 'Superposición', description: '¿En qué estado está un Qubit antes de medirlo?', avatarText: 'Piensa en una moneda girando. ¿Es cara o cruz?', content: { options: ['Solo 0', 'Solo 1', '0 y 1 al mismo tiempo'], correctOption: 2 } },
      { id: 's3', type: 'fact', title: 'Entrelazamiento', description: 'Acción fantasmal.', avatarText: 'Dos partículas pueden estar conectadas sin importar la distancia. Es pura magia física.', content: { fact: 'El entrelazamiento permite teletransportar información instantáneamente.' } }
    ]
  },
  {
    id: 'vis-sec-1', title: 'Criptografía RSA', icon: '🔐', color: 'bg-[#EAEDED]', ageGroup: '13-17', phase: 'Maestría',
    description: 'Seguridad basada en números primos gigantes.',
    steps: [
      { id: 's1', type: 'logic', title: 'Factorización', description: '¿Por qué RSA es tan seguro?', avatarText: 'La base es que es muy difícil encontrar dos números primos que al multiplicarse den un número gigante.', content: { options: ['Por el firewall', 'Por la dificultad matemática', 'Por la velocidad de internet'], correctOption: 1 } }
    ]
  },
  {
    id: 'vis-ai-1', title: 'Redes Neuronales', icon: '🧠', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Creación',
    description: 'Arquitectura de transformadores y GPT.',
    steps: [
      { id: 's1', type: 'fact', title: 'Auto-Atención', description: 'Cómo la IA entiende el contexto.', avatarText: 'La IA analiza qué palabras son más importantes mediante pesos lógicos. Se llama mecanismo de atención.', content: { fact: 'La arquitectura Transformer cambió el mundo de la IA en 2017.' } }
    ]
  },
  {
    id: 'vis-fin-1', title: 'Algoritmos Financieros', icon: '💰', color: 'bg-[#F4F6F7]', ageGroup: '13-17', phase: 'Maestría',
    description: 'Blockchain y descentralización.',
    steps: [
      { id: 's1', type: 'fact', title: 'El Ledger', description: 'El libro que nadie puede borrar.', avatarText: 'En el blockchain, la información es inmutable. Nadie puede alterar el pasado.', content: { fact: 'Bitcoin utiliza criptografía de curva elíptica para su seguridad.' } }
    ]
  }
];
