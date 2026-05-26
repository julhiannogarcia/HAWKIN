export type AgeGroup = 'Junior' | 'Professional';
export type LessonLevel = 'Básico' | 'Intermedio' | 'Experto';
export type ModuleType = 'Theory' | 'Lexicon' | 'Listening' | 'Writing' | 'Speaking';

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
    targetPhrase?: string; 
    placeholder?: string;
    longText?: string; // Para explicaciones extensas
  };
}

export interface Module {
  id: string;
  title: string;
  type: ModuleType;
  estimatedTime: string;
  icon: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  steps: LessonStep[];
}

export interface Day {
  dayNumber: number;
  title: string;
  ageGroup: AgeGroup;
  level: LessonLevel;
  modules: Module[];
}

export const COURSE_CURRICULUM: Day[] = [
  {
    dayNumber: 1,
    title: 'The Digital Pioneer',
    ageGroup: 'Professional',
    level: 'Básico',
    modules: [
      {
        id: 'd1-m1',
        title: 'Theory: The Present of Innovation',
        type: 'Theory',
        estimatedTime: '45 min',
        icon: '🧠',
        lessons: [
          {
            id: 'd1-m1-l1',
            title: 'Present Simple in Tech Contexts',
            steps: [
              {
                id: 's1',
                type: 'dialogue',
                avatarText: 'Bienvenido a tu primer módulo de alta densidad. Hoy no solo aprenderás inglés, aprenderás a pensar como un líder global. Empezaremos con la estructura del Presente Simple, pero aplicada al mundo de la tecnología.',
                avatarLang: 'es',
                uiContent: { title: 'Día 1: Módulo de Teoría', description: 'Fundamentos gramaticales para visionarios.' }
              },
              {
                id: 's2',
                type: 'teaching',
                avatarText: 'In English, we use the Present Simple to talk about facts, habits, and permanent states. For example: "The system updates every midnight." Notice the "s" in "updates".',
                avatarLang: 'en',
                uiContent: { 
                  title: 'El Tercer Person Singular', 
                  description: 'En el mundo tech, hablamos mucho de sistemas (it). Siempre añade "s" al verbo.',
                  longText: 'Uso del Presente Simple:\n1. Facts: "AI processes data fast."\n2. Habits: "I check my metrics daily."\n3. States: "Our server is secure."'
                }
              },
              {
                id: 's3',
                type: 'quiz',
                avatarText: '¿Cuál es la forma correcta de decir que tu empresa opera globalmente?',
                avatarLang: 'es',
                uiContent: {
                  options: ['My company operate globally', 'My company operating globally', 'My company operates globally', 'My company is operate'],
                  correctOption: 2
                }
              }
            ]
          }
        ]
      },
      {
        id: 'd1-m2',
        title: 'Lexicon: 100 Essential Tech Terms',
        type: 'Lexicon',
        estimatedTime: '60 min',
        icon: '📚',
        lessons: [
          {
            id: 'd1-m2-l1',
            title: 'Infrastructure & Hardware',
            steps: [
              {
                id: 's1',
                type: 'teaching',
                avatarText: 'Comencemos con el vocabulario de infraestructura. Repite después de mí: Scalability, Bandwidth, Backend, Frontend.',
                avatarLang: 'es',
                uiContent: { title: 'Vocabulario de Élite', description: 'Terminología técnica fundamental.' }
              },
              {
                id: 's2',
                type: 'practice',
                avatarText: 'Scalability refers to the capacity of a system to grow.',
                avatarLang: 'en',
                uiContent: { title: 'Escucha la Pronunciación', description: 'Palabra clave: Scalability' }
              },
              {
                id: 's3',
                type: 'writing',
                avatarText: 'Escribe la palabra que significa "ancho de banda" en inglés.',
                avatarLang: 'es',
                uiContent: { targetPhrase: 'Bandwidth', placeholder: 'Type here...' }
              }
            ]
          }
        ]
      },
      {
        id: 'd1-m3',
        title: 'Deep Listening: The Founder Vision',
        type: 'Listening',
        estimatedTime: '60 min',
        icon: '🎧',
        lessons: [
          {
            id: 'd1-m3-l1',
            title: 'Interview with an AI CEO',
            steps: [
              {
                id: 's1',
                type: 'dialogue',
                avatarText: 'En este módulo, vamos a entrenar tu oído con un diálogo real. Escucha cómo un CEO de Silicon Valley describe su producto.',
                avatarLang: 'es',
                uiContent: { title: 'Inmersión Auditiva', description: 'Escucha atenta y análisis.' }
              },
              {
                id: 's2',
                type: 'practice',
                avatarText: 'Our platform leverages machine learning to optimize supply chains in real-time. We believe that intelligence should be accessible to every enterprise, regardless of its size.',
                avatarLang: 'en',
                uiContent: { 
                    title: 'Discurso de CEO', 
                    description: 'Palabras clave: Leverages, Optimize, Accessible.',
                    longText: 'Transcripción:\n"Nuestra plataforma utiliza aprendizaje automático para optimizar cadenas de suministro en tiempo real. Creemos que la inteligencia debe ser accesible para cada empresa, sin importar su tamaño."'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'd1-m4',
        title: 'The Writing Lab: Networking Scripts',
        type: 'Writing',
        estimatedTime: '45 min',
        icon: '✍️',
        lessons: [
          {
            id: 'd1-m4-l1',
            title: 'Your First Professional Email',
            steps: [
              {
                id: 's1',
                type: 'teaching',
                avatarText: 'Escribir un correo en inglés requiere un tono específico. Siempre comienza con "Dear" o "Hi", y termina con "Best regards".',
                avatarLang: 'es',
                uiContent: { title: 'Protocolo Escrito', description: 'Estructura de un email de negocios.' }
              },
              {
                id: 's2',
                type: 'writing',
                avatarText: 'Completa la frase para saludar a un nuevo socio: "Hi [Name], it ___ a pleasure to meet you."',
                avatarLang: 'es',
                uiContent: { targetPhrase: 'is', placeholder: 'Verbo ser/estar en presente...' }
              }
            ]
          }
        ]
      },
      {
        id: 'd1-m5',
        title: 'Speaking Arena: Elevator Pitch',
        type: 'Speaking',
        estimatedTime: '60 min',
        icon: '🎤',
        lessons: [
          {
            id: 'd1-m5-l1',
            title: 'Introducing Your Vision',
            steps: [
              {
                id: 's1',
                type: 'dialogue',
                avatarText: 'Llegamos a la arena final de hoy. Vas a practicar tu presentación personal de alto impacto. Tienes que sonar seguro.',
                avatarLang: 'es',
                uiContent: { title: 'Puesta en Escena', description: 'Habla con autoridad.' }
              },
              {
                id: 's2',
                type: 'speaking',
                avatarText: 'I am a technology leader and I build the future.',
                avatarLang: 'en',
                uiContent: { 
                  title: 'Reto de Voz', 
                  description: 'Repite la frase con entonación de líder.',
                  targetPhrase: 'I am a technology leader and I build the future'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    dayNumber: 2,
    title: 'The Agile Collaborator',
    ageGroup: 'Professional',
    level: 'Básico',
    modules: [
      {
        id: 'd2-m1',
        title: 'Theory: Continuous Innovation',
        type: 'Theory',
        estimatedTime: '45 min',
        icon: '⚙️',
        lessons: [
          {
            id: 'd2-m1-l1',
            title: 'Present Continuous in Operations',
            steps: [
              {
                id: 's1',
                type: 'dialogue',
                avatarText: 'Hoy nos enfocaremos en lo que está ocurriendo justo ahora. En tecnología, todo es movimiento constante. El Presente Continuo es tu mejor herramienta.',
                avatarLang: 'es',
                uiContent: { title: 'Día 2: Módulo de Teoría', description: 'Acciones en tiempo real.' }
              },
              {
                id: 's2',
                type: 'teaching',
                avatarText: 'We use Present Continuous (Subject + be + verb-ing) for actions happening now. Example: "We are developing a new feature." or "The team is testing the code."',
                avatarLang: 'en',
                uiContent: { 
                  title: 'La Estructura "ING"', 
                  description: 'Recuerda usar siempre el verbo "to be" correctamente.',
                  longText: 'Uso en el Trabajo:\n1. Status Updates: "I am working on the database."\n2. Trends: "Cloud computing is growing."\n3. Meetings: "Are you recording the call?"'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'd2-m2',
        title: 'Lexicon: The Agile Workspace',
        type: 'Lexicon',
        estimatedTime: '60 min',
        icon: '📋',
        lessons: [
          {
            id: 'd2-m2-l1',
            title: 'Methodologies & Sprints',
            steps: [
              {
                id: 's1',
                type: 'teaching',
                avatarText: 'Trabajar en empresas modernas significa usar metodologías Ágiles. Palabras clave: Sprint, Backlog, Stand-up, Stakeholder.',
                avatarLang: 'es',
                uiContent: { title: 'Vocabulario de Gestión', description: 'Cómo se organiza el trabajo de élite.' }
              },
              {
                id: 's2',
                type: 'writing',
                avatarText: 'Escribe la palabra que describe a una persona interesada en el proyecto (Inversionista, cliente, etc).',
                avatarLang: 'es',
                uiContent: { targetPhrase: 'Stakeholder', placeholder: 'S_t_a_k_e_h_o_l_d_e_r' }
              }
            ]
          }
        ]
      },
      {
        id: 'd2-m3',
        title: 'Deep Listening: The Board Meeting',
        type: 'Listening',
        estimatedTime: '60 min',
        icon: '👔',
        lessons: [
          {
            id: 'd2-m3-l1',
            title: 'Quarterly Review Highlights',
            steps: [
              {
                id: 's1',
                type: 'practice',
                avatarText: 'In today\'s meeting, we are analyzing our growth metrics. Our user base is expanding by 20% month-over-month. However, we are facing some latency issues in the European region.',
                avatarLang: 'en',
                uiContent: { 
                  title: 'Análisis de Métricas', 
                  description: 'Escucha cómo se reportan resultados.',
                  longText: 'Vocabulario Clave:\n- Month-over-month: Mes tras mes.\n- Facing: Enfrentando.\n- Latency: Latencia/Retraso.'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'd2-m4',
        title: 'The Writing Lab: Slack & Discord',
        type: 'Writing',
        estimatedTime: '45 min',
        icon: '💬',
        lessons: [
          {
            id: 'd2-m4-l1',
            title: 'Instant Messaging Etiquette',
            steps: [
              {
                id: 's1',
                type: 'teaching',
                avatarText: 'En chats de trabajo, usamos abreviaturas profesionales. ASAP (As soon as possible), FYI (For your information), ETA (Estimated time of arrival).',
                avatarLang: 'es',
                uiContent: { title: 'Comunicación Rápida', description: 'Abreviaturas de alto nivel.' }
              },
              {
                id: 's2',
                type: 'writing',
                avatarText: 'Escribe la abreviatura para "Lo antes posible".',
                avatarLang: 'es',
                uiContent: { targetPhrase: 'ASAP', placeholder: 'A_ _ P' }
              }
            ]
          }
        ]
      },
      {
        id: 'd2-m5',
        title: 'Speaking Arena: The Status Update',
        type: 'Speaking',
        estimatedTime: '60 min',
        icon: '🚀',
        lessons: [
          {
            id: 'd2-m5-l1',
            title: 'Reporting Your Daily Progress',
            steps: [
              {
                id: 's1',
                type: 'speaking',
                avatarText: 'I am finalizing the documentation and starting the deployment phase.',
                avatarLang: 'en',
                uiContent: { 
                  title: 'Daily Stand-up', 
                  description: 'Di lo que estás haciendo hoy con seguridad.',
                  targetPhrase: 'I am finalizing the documentation and starting the deployment phase'
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
