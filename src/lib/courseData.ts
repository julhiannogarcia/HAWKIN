export interface LessonStep {
  id: string;
  type: 'dialogue' | 'teaching' | 'quiz' | 'practice';
  avatarText: string;
  avatarLang: 'en' | 'es';
  uiContent?: {
    title?: string;
    description?: string;
    options?: string[];
    correctOption?: number;
    visualAid?: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export const ENGLISH_COURSE_DATA: Lesson[] = [
  {
    id: 'intro-to-business-english',
    title: 'Inglés para el Élite Tecnológica',
    description: 'Aprende a presentarte y presentar tu visión en un entorno global.',
    steps: [
      {
        id: 'step-1',
        type: 'dialogue',
        avatarText: 'Hola, soy HAWKIN AI. Bienvenido a tu primer paso hacia la maestría del inglés global. Hoy aprenderemos a presentarnos con autoridad.',
        avatarLang: 'es',
        uiContent: {
          title: 'Bienvenida',
          description: 'Escucha atentamente la introducción de tu tutor de IA.'
        }
      },
      {
        id: 'step-2',
        type: 'teaching',
        avatarText: 'En inglés, la forma más profesional de comenzar es diciendo: "Hello, my name is... and I am a visionary." Repite conmigo.',
        avatarLang: 'es',
        uiContent: {
          title: 'Presentación Profesional',
          description: 'Frase clave: "Hello, my name is... and I am a visionary."'
        }
      },
      {
        id: 'step-3',
        type: 'practice',
        avatarText: 'Hello, my name is Julhianno, and I am a visionary.',
        avatarLang: 'en',
        uiContent: {
          title: 'Escucha la Pronunciación',
          description: 'Presta atención a la entonación y las pausas.'
        }
      },
      {
        id: 'step-4',
        type: 'quiz',
        avatarText: '¿Cuál es la forma correcta de decir que eres un visionario?',
        avatarLang: 'es',
        uiContent: {
          title: 'Prueba de Conocimiento',
          options: [
            'I am a visionary',
            'I am a vision',
            'I have a visionary',
            'I am visionary'
          ],
          correctOption: 0
        }
      },
      {
        id: 'step-5',
        type: 'dialogue',
        avatarText: '¡Excelente! Estás progresando rápidamente. En la próxima lección, profundizaremos en cómo negociar términos de inversión en inglés.',
        avatarLang: 'es',
        uiContent: {
          title: 'Lección Completada',
          description: 'Has dominado tu primera presentación de élite.'
        }
      }
    ]
  }
];
