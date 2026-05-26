export type AgeGroup = 'Junior' | 'Professional';
export type LessonLevel = 'Básico' | 'Intermedio' | 'Experto';

export interface LessonStep {
  id: string;
  type: 'dialogue' | 'teaching' | 'quiz' | 'practice' | 'speaking' | 'writing';
  avatarText: string;
  avatarLang: 'en' | 'es';
  uiContent?: {
    title?: string;
    description?: string;
    options?: string[];
    correctOption?: number;
    visualAid?: string;
    targetPhrase?: string; // Para modo 'speaking' o 'writing'
    placeholder?: string;
  };
}

export interface Day {
  dayNumber: number;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  level: LessonLevel;
  ageGroup: AgeGroup;
  description: string;
  steps: LessonStep[];
}

// CURRÍCULO DE ÉLITE - MUESTRA DE LA SEMANA 1
export const COURSE_CURRICULUM: Day[] = [
  {
    dayNumber: 1,
    title: 'The Visionary Identity',
    lessons: [
      {
        id: 'day1-prof-basic',
        title: 'Presentación de Élite',
        level: 'Básico',
        ageGroup: 'Professional',
        description: 'Domina tu primera impresión en el mundo tecnológico.',
        steps: [
          {
            id: 'd1-s1',
            type: 'dialogue',
            avatarText: 'Hola, soy tu tutor HAWKIN. Hoy comienza tu viaje de 30 días hacia la maestría. Primero, aprendamos a decir quiénes somos con autoridad.',
            avatarLang: 'es',
            uiContent: { title: 'Día 1: Identidad', description: 'Escucha la visión de hoy.' }
          },
          {
            id: 'd1-s2',
            type: 'speaking',
            avatarText: 'Repite conmigo: "I am a technology leader."',
            avatarLang: 'es',
            uiContent: { 
              title: 'Prueba de Voz', 
              description: 'Di con claridad: "I am a technology leader"',
              targetPhrase: 'I am a technology leader'
            }
          },
          {
            id: 'd1-s3',
            type: 'writing',
            avatarText: 'Ahora, escribe la traducción de: "Yo soy un líder tecnológico".',
            avatarLang: 'es',
            uiContent: { 
              title: 'Desafío Escrito', 
              description: 'Escribe la frase en inglés.',
              targetPhrase: 'I am a technology leader',
              placeholder: 'Escribe aquí...'
            }
          }
        ]
      },
      {
        id: 'day1-junior-basic',
        title: 'Pequeño Visionario',
        level: 'Básico',
        ageGroup: 'Junior',
        description: 'Aprende inglés jugando con tecnología.',
        steps: [
          {
            id: 'd1-j-s1',
            type: 'dialogue',
            avatarText: '¡Hola, aventurero! Soy HAWKIN. ¿Listo para aprender el idioma de los robots? Vamos a empezar con algo divertido.',
            avatarLang: 'es',
            uiContent: { title: '¡Hola Robot!', description: 'Bienvenido al futuro.' }
          },
          {
            id: 'd1-j-s2',
            type: 'speaking',
            avatarText: 'Di conmigo: "Hello robot!"',
            avatarLang: 'es',
            uiContent: { 
              title: 'Habla con el Robot', 
              description: 'Di: "Hello robot!"',
              targetPhrase: 'Hello robot'
            }
          }
        ]
      }
    ]
  },
  {
    dayNumber: 2,
    title: 'Global Tech Vocabulary',
    lessons: [
      {
        id: 'day2-prof-basic',
        title: 'Hardware & Software',
        level: 'Básico',
        ageGroup: 'Professional',
        description: 'Vocabulario esencial para navegar en empresas de Silicon Valley.',
        steps: [
          {
            id: 'd2-s1',
            type: 'dialogue',
            avatarText: 'Hoy aprenderemos palabras clave de hardware. En inglés, la computadora de trabajo se llama Workstation.',
            avatarLang: 'es',
            uiContent: { title: 'Día 2: Hardware', description: 'Vocabulario de oficina moderna.' }
          },
          {
            id: 'd2-s2',
            type: 'writing',
            avatarText: 'Escribe en inglés la palabra: "Estación de trabajo".',
            avatarLang: 'es',
            uiContent: { 
              title: 'Prueba Escrita', 
              targetPhrase: 'Workstation',
              placeholder: 'Write the word...'
            }
          }
        ]
      },
      {
        id: 'day2-junior-basic',
        title: 'The Blue Planet',
        level: 'Básico',
        ageGroup: 'Junior',
        description: 'Colores y naturaleza en el espacio.',
        steps: [
          {
            id: 'd2-j-s1',
            type: 'dialogue',
            avatarText: '¡Mira por la ventana de la nave! El planeta es de color azul. En inglés decimos: "The planet is blue".',
            avatarLang: 'es',
            uiContent: { title: 'Colores Espaciales', description: 'Aprendiendo colores.' }
          },
          {
            id: 'd2-j-s2',
            type: 'speaking',
            avatarText: 'Dilo tú: "Blue planet"',
            avatarLang: 'es',
            uiContent: { 
              title: 'Micrófono Abierto', 
              targetPhrase: 'Blue planet'
            }
          }
        ]
      }
    ]
  },
  {
    dayNumber: 3,
    title: 'Action & Code',
    lessons: [
      {
        id: 'day3-prof-basic',
        title: 'Verbos de Programación',
        level: 'Básico',
        ageGroup: 'Professional',
        description: 'Los verbos que usan los programadores cada día.',
        steps: [
          {
            id: 'd3-s1',
            type: 'teaching',
            avatarText: 'Cuando guardas tu progreso, estás haciendo un "Commit". Es una palabra sagrada en HAWKIN.',
            avatarLang: 'es',
            uiContent: { title: 'Día 3: Verbos', description: 'Aprende a ejecutar acciones.' }
          }
        ]
      }
    ]
  }
  // El sistema soporta hasta 30 días cargando dinámicamente
];
