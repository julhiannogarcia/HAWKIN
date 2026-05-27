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
      { id: 's2', type: 'pattern', title: 'Reflejos', description: 'Completa la forma.', avatarText: '¿Cuál de estas formas encaja perfectamente con la otra mitad?', content: { options: ['🌓', '🌕', '🌑'], correctOption: 0 } }
    ]
  },
  {
    id: 'exp-2', title: 'Sinfonía Estelar', icon: '🎵', color: 'bg-[#FEF9E7]', ageGroup: '4-7', phase: 'Descubrimiento',
    description: 'Frecuencias y ondas sonoras básicas.',
    steps: [{ id: 's1', type: 'fact', title: 'Ondas de Sonido', description: 'El sonido viaja por el aire.', avatarText: 'El sonido es como una ola invisible. Mira cómo vibra.', content: { fact: 'El sonido viaja a 343 metros por segundo en el aire.' } }]
  },
  {
    id: 'exp-3', title: 'Biología de Dinos', icon: '🦖', color: 'bg-[#E9F7EF]', ageGroup: '4-7', phase: 'Descubrimiento',
    description: 'Clasificación de especies por dieta.',
    steps: [{ id: 's1', type: 'exercise', title: 'Herbívoros', description: '¿Qué come un Diplodocus?', avatarText: 'Analiza su cuello largo. ¿Es para alcanzar hojas o para cazar?', content: { options: ['Plantas', 'Carne', 'Piedras'], correctOption: 0 } }]
  },
  {
    id: 'exp-4', title: 'Clima Global', icon: '☁️', color: 'bg-[#EBF5FB]', ageGroup: '4-7', phase: 'Maestría',
    description: 'Ciclo del agua y formación de nubes.',
    steps: [{ id: 's1', type: 'fact', title: 'Evaporación', description: 'El agua sube al cielo.', avatarText: 'Cuando el sol calienta el mar, el agua se vuelve gas.', content: { fact: 'Las nubes son en realidad millones de gotitas de agua líquida o cristales de hielo.' } }]
  },
  {
    id: 'exp-5', title: 'Lógica de Robots', icon: '🤖', color: 'bg-[#F5EEF8]', ageGroup: '4-7', phase: 'Creación',
    description: 'Instrucciones paso a paso.',
    steps: [{ id: 's1', type: 'intro', title: 'Algoritmos Simples', description: 'Dar órdenes claras.', avatarText: 'Un robot solo hace lo que le dices. Vamos a darle una orden.', content: {} }]
  },

  // ==========================================
  // 8-12 AÑOS: CREADORES (CIENCIA, INGENIERÍA Y LÓGICA)
  // ==========================================
  {
    id: 'cre-1', title: 'Ingeniería Aeroespacial', icon: '🚀', color: 'bg-[#FBFCFC]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Propulsión y Newton.',
    steps: [
      { id: 's1', type: 'intro', title: 'Misión Marte', description: 'Vencer la gravedad.', avatarText: 'Para llegar a Marte necesitamos mucha fuerza. Estudiaremos la Tercera Ley de Newton.', content: {} },
      { id: 's2', type: 'exercise', title: 'Empuje', description: 'Acción y Reacción.', avatarText: 'Si el gas sale hacia abajo, ¿hacia dónde va el cohete?', content: { options: ['Abajo', 'Arriba', 'Lados'], correctOption: 1 } }
    ]
  },
  {
    id: 'cre-2', title: 'El Código de Fibonacci', icon: '🐚', color: 'bg-[#FDF2E9]', ageGroup: '8-12', phase: 'Maestría',
    description: 'Sucesiones matemáticas en la vida.',
    steps: [{ id: 's1', type: 'logic', title: 'Suma Infinita', description: 'Cálculo de patrones.', avatarText: '1, 1, 2, 3, 5, 8... ¿Cuál es el siguiente número?', content: { options: ['10', '13', '21'], correctOption: 1 } }]
  },
  {
    id: 'cre-3', title: 'Anatomía Humana Pro', icon: '🧠', color: 'bg-[#F4ECF7]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Sistemas neuronales y órganos.',
    steps: [{ id: 's1', type: 'fact', title: 'La Neurona', description: 'Células eléctricas.', avatarText: 'Tu cerebro tiene 86 mil millones de neuronas. Son como cables vivos.', content: { fact: 'La información viaja por tus neuronas a más de 400 km/h.' } }]
  },
  {
    id: 'cre-4', title: 'Arquitectura Antigua', icon: '🏛️', color: 'bg-[#FBFCFC]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Ingeniería romana y egipcia.',
    steps: [{ id: 's1', type: 'fact', title: 'El Arco Romano', description: 'Distribución de peso.', avatarText: 'Los romanos inventaron el arco para que los puentes no se cayeran.', content: { fact: 'La clave es la piedra del centro, llamada dovela, que sostiene todo el peso.' } }]
  },
  {
    id: 'cre-5', title: 'Fotosíntesis y Energía', icon: '🍃', color: 'bg-[#E9F7EF]', ageGroup: '8-12', phase: 'Maestría',
    description: 'Conversión de luz en glucosa.',
    steps: [{ id: 's1', type: 'exercise', title: 'El Cloroplasto', description: '¿Qué necesita una planta?', avatarText: 'Analiza los ingredientes: Sol, agua y...', content: { options: ['Oxígeno', 'Dióxido de Carbono', 'Nitrógeno'], correctOption: 1 } }]
  },
  {
    id: 'cre-6', title: 'Química de Elementos', icon: '🧪', color: 'bg-[#F5EEF8]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Tabla periódica y enlaces.',
    steps: [{ id: 's1', type: 'fact', title: 'H2O', description: 'La molécula del agua.', avatarText: 'Dos átomos de hidrógeno y uno de oxígeno crean vida.', content: { fact: 'El agua es el único compuesto que se expande al congelarse.' } }]
  },
  {
    id: 'cre-7', title: 'Geografía Tectónica', icon: '🌋', color: 'bg-[#FDF2E9]', ageGroup: '8-12', phase: 'Descubrimiento',
    description: 'Placas tectónicas y volcanes.',
    steps: [{ id: 's1', type: 'intro', title: 'Pangea', description: 'Cuando la Tierra era una.', avatarText: 'Hace millones de años, todos los continentes estaban unidos. Las placas se mueven constantemente.', content: {} }]
  },

  // ==========================================
  // 13-17+ AÑOS: VISIONARIOS (TECNOLOGÍA DE FRONTERA)
  // ==========================================
  {
    id: 'vis-1', title: 'Computación Cuántica', icon: '⚛️', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Descubrimiento',
    description: 'Qubits y Superposición.',
    steps: [
      { id: 's1', type: 'intro', title: 'Más allá del Bit', description: 'La paradoja de Schrödinger.', avatarText: 'Bienvenido al nivel de Élite. Las computadoras clásicas usan bits (0 o 1). Las cuánticas usan ambos al mismo tiempo.', content: {} },
      { id: 's2', type: 'fact', title: 'Entrelazamiento', description: 'Conexión instantánea.', avatarText: 'Dos partículas pueden estar conectadas sin importar la distancia. Einstein lo llamó acción fantasmal.', content: { fact: 'El entrelazamiento cuántico permite teletransportar información de estado entre partículas.' } }
    ]
  },
  {
    id: 'vis-2', title: 'Criptografía RSA', icon: '🔐', color: 'bg-[#EAEDED]', ageGroup: '13-17', phase: 'Maestría',
    description: 'Seguridad basada en números primos.',
    steps: [{ id: 's1', type: 'logic', title: 'Factorización', description: '¿Por qué es seguro RSA?', avatarText: 'Multiplicar dos primos grandes es fácil. Encontrar cuáles eran esos primos es casi imposible para una PC normal.', content: { options: ['Por el Hashing', 'Por la dificultad matemática', 'Por el Firewall'], correctOption: 1 } }]
  },
  {
    id: 'vis-3', title: 'Redes Neuronales GPT', icon: '🧠', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Creación',
    description: 'Arquitectura de Transformadores.',
    steps: [{ id: 's1', type: 'fact', title: 'Atención (Attention)', description: 'Cómo lee la IA.', avatarText: 'La IA no lee palabra por palabra, analiza la relación entre todas al mismo tiempo mediante pesos.', content: { fact: 'El mecanismo de "Self-Attention" permite a los modelos entender el contexto global de un texto largo.' } }]
  },
  {
    id: 'vis-4', title: 'Economía y Blockchain', icon: '💰', color: 'bg-[#F4F6F7]', ageGroup: '13-17', phase: 'Descubrimiento',
    description: 'Descentralización y Ledger.',
    steps: [{ id: 's1', type: 'fact', title: 'Libro Contable', description: 'Nadie puede borrar el pasado.', avatarText: 'Blockchain es un libro que todos ven y nadie puede alterar. Eso crea confianza digital.', content: { fact: 'Bitcoin fue el primer uso exitoso del protocolo Proof of Work para consenso descentralizado.' } }]
  },
  {
    id: 'vis-5', title: 'Astrofísica: Agujeros Negros', icon: '🌀', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Descubrimiento',
    description: 'Singularidad y horizonte de sucesos.',
    steps: [{ id: 's1', type: 'fact', title: 'La Singularidad', description: 'Gravedad infinita.', avatarText: 'En el centro de un agujero negro, las leyes de la física dejan de funcionar.', content: { fact: 'El horizonte de sucesos es el punto de no retorno donde la luz ya no puede escapar.' } }]
  },
  {
    id: 'vis-6', title: 'Ingeniería de Sensores', icon: '📡', color: 'bg-[#EAEDED]', ageGroup: '13-17', phase: 'Maestría',
    description: 'LiDAR, Ultrasónico y Visión Pro.',
    steps: [{ id: 's1', type: 'fact', title: 'LiDAR', description: 'Dibujar con luz.', avatarText: 'Los autos autónomos usan láseres para "ver" el mundo en 3D. Se llama LiDAR.', content: { fact: 'LiDAR emite pulsos de luz láser que rebotan en objetos para medir distancias con precisión milimétrica.' } }]
  },
  {
    id: 'vis-7', title: 'Filosofía Ética en IA', icon: '⚖️', color: 'bg-[#FBFCFC]', ageGroup: '13-17', phase: 'Creación',
    description: 'El dilema del tranvía aplicado a máquinas.',
    steps: [{ id: 's1', type: 'intro', title: 'Alineación de IA', description: 'Valores humanos en el código.', avatarText: '¿Cómo nos aseguramos de que una IA siempre ayude a la humanidad? Ese es el mayor reto actual.', content: {} }]
  }
];
