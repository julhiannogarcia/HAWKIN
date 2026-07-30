export type ArenaRegion = 'USA' | 'CN' | 'EU';
export type ArenaLicense = 'OPEN' | 'CLOSED';

export type ArenaModelMeta = {
  slug: string;
  name: string;
  company: string;
  region: ArenaRegion;
  license: ArenaLicense;
  founder: string;
  country: string;
  logo: string;
  aliases: string[];
  rivalSlug: string;
  /** Fecha ISO del último release confirmado por HAWKIN (no inventar) */
  releaseDate?: string;
  /** URL fuente oficial del release */
  releaseSource?: string;
  /** Texto de novedad confirmado editorialmente */
  whatsNewConfirmed?: string;
  benefitsConfirmed?: string[];
  tier: 'frontier' | 'archived';
};

/** Modelos fuera del ranking activo — visibles solo en admin/watch */
export const ARENA_ARCHIVED_REGISTRY: ArenaModelMeta[] = [
  {
    slug: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    company: 'Google DeepMind',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Demis Hassabis',
    country: 'USA',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['gemini 2.5 pro', 'gemini 2.5'],
    rivalSlug: 'gemini-3-6-flash',
    releaseDate: '2025-03-01',
    tier: 'archived',
  },
];

/** Frontier IA activo — julio 2026 */
export const ARENA_MODEL_REGISTRY: ArenaModelMeta[] = [
  {
    slug: 'claude-opus-4',
    name: 'Claude Opus 4',
    company: 'Anthropic',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Dario Amodei',
    country: 'USA',
    logo: '/logos/ANTHROPI.webp',
    aliases: ['claude opus 4', 'claude opus', 'opus 4'],
    rivalSlug: 'gpt-5',
    tier: 'frontier',
  },
  {
    slug: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    company: 'Anthropic',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Dario Amodei',
    country: 'USA',
    logo: '/logos/ANTHROPI.webp',
    aliases: ['claude sonnet 4', 'claude 4 sonnet', 'sonnet 4'],
    rivalSlug: 'gemini-3-6-flash',
    tier: 'frontier',
  },
  {
    slug: 'gpt-5',
    name: 'GPT-5',
    company: 'OpenAI',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Sam Altman',
    country: 'USA',
    logo: '/logos/openAI.png',
    aliases: ['gpt-5', 'gpt5', 'openai gpt-5', 'chatgpt-5'],
    rivalSlug: 'claude-opus-4',
    tier: 'frontier',
  },
  {
    slug: 'gemini-3-6-flash',
    name: 'Gemini 3.6 Flash',
    company: 'Google',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Demis Hassabis',
    country: 'USA',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: [
      'gemini 3.6 flash',
      'gemini 3.6',
      'gemini 3.5 flash',
      'google gemini',
      'gemini flash',
    ],
    rivalSlug: 'gpt-5',
    releaseDate: '2026-07-21',
    releaseSource: 'https://deepmind.google/blog/',
    whatsNewConfirmed:
      'Lanzamiento Google (21 jul 2026): Gemini 3.6 Flash — mayor eficiencia de tokens, coding reforzado, multimodal ampliado y precio optimizado para producción.',
    benefitsConfirmed: [
      'Menor costo por token vs generaciones anteriores',
      'Mejor rendimiento en coding y flujos agentic',
      'Multimodal nativo con latencia reducida',
      'Pensado para escala en apps y APIs',
    ],
    tier: 'frontier',
  },
  {
    slug: 'gemini-3-5-flash-lite',
    name: 'Gemini 3.5 Flash-Lite',
    company: 'Google',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Demis Hassabis',
    country: 'USA',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['gemini 3.5 flash-lite', 'gemini 3.5 flash lite', 'flash-lite'],
    rivalSlug: 'gemini-3-6-flash',
    releaseDate: '2026-07-21',
    releaseSource: 'https://deepmind.google/blog/',
    whatsNewConfirmed:
      'Lanzamiento Google (21 jul 2026): variante Flash-Lite orientada a máxima eficiencia de costo y latencia en cargas de alto volumen.',
    benefitsConfirmed: [
      'Ideal para chatbots masivos y clasificación',
      'Costo mínimo por millón de tokens',
      'Latencia ultrabaja en edge y móvil',
    ],
    tier: 'frontier',
  },
  {
    slug: 'gemini-3-5-flash-cyber',
    name: 'Gemini 3.5 Flash Cyber',
    company: 'Google',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Demis Hassabis',
    country: 'USA',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['gemini 3.5 flash cyber', 'gemini cyber', 'flash cyber'],
    rivalSlug: 'claude-sonnet-4',
    releaseDate: '2026-07-21',
    releaseSource: 'https://deepmind.google/blog/',
    whatsNewConfirmed:
      'Lanzamiento Google (21 jul 2026): variante Cyber enfocada en detección de amenazas, análisis de logs y respuesta a incidentes.',
    benefitsConfirmed: [
      'Especializado en seguridad y threat intel',
      'Análisis de vulnerabilidades y IOCs',
      'Integración con flujos SOC y SIEM',
    ],
    tier: 'frontier',
  },
  {
    slug: 'kimi-k3',
    name: 'Kimi K3',
    company: 'Moonshot AI',
    region: 'CN',
    license: 'OPEN',
    founder: 'Yang Zhilin',
    country: 'China',
    logo: '/logos/moonshot-kimi.svg',
    aliases: ['kimi k3', 'kimi k-3', 'moonshot ai', 'moonshot kimi'],
    rivalSlug: 'deepseek-r1',
    tier: 'frontier',
  },
  {
    slug: 'deepseek-r1',
    name: 'DeepSeek R1',
    company: 'DeepSeek',
    region: 'CN',
    license: 'OPEN',
    founder: 'Liang Wenfeng',
    country: 'China',
    logo: '/logos/deepseek.svg',
    aliases: ['deepseek r1', 'deepseek-r1', 'deepseek reasoning'],
    rivalSlug: 'kimi-k3',
    tier: 'frontier',
  },
  {
    slug: 'deepseek-v3',
    name: 'DeepSeek V3',
    company: 'DeepSeek',
    region: 'CN',
    license: 'OPEN',
    founder: 'Liang Wenfeng',
    country: 'China',
    logo: '/logos/deepseek.svg',
    aliases: ['deepseek v3', 'deepseek-v3'],
    rivalSlug: 'qwen-3-max',
    tier: 'frontier',
  },
  {
    slug: 'qwen-3-max',
    name: 'Qwen 3 Max',
    company: 'Alibaba',
    region: 'CN',
    license: 'OPEN',
    founder: 'Jingren Zhou',
    country: 'China',
    logo: '/logos/alibaba-qwen.svg',
    aliases: ['qwen 3', 'qwen3', 'qwen 3 max', 'alibaba qwen'],
    rivalSlug: 'deepseek-v3',
    tier: 'frontier',
  },
  {
    slug: 'llama-4',
    name: 'Llama 4',
    company: 'Meta',
    region: 'USA',
    license: 'OPEN',
    founder: 'Mark Zuckerberg',
    country: 'USA',
    logo: '/logos/META-AI.png',
    aliases: ['llama 4', 'llama4', 'meta llama 4'],
    rivalSlug: 'qwen-3-max',
    tier: 'frontier',
  },
  {
    slug: 'grok-4',
    name: 'Grok 4',
    company: 'xAI',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Elon Musk',
    country: 'USA',
    logo: '/logos/XAI.webp',
    aliases: ['grok 4', 'grok4', 'xai grok 4'],
    rivalSlug: 'gpt-5',
    tier: 'frontier',
  },
  {
    slug: 'mistral-large-2',
    name: 'Mistral Large 2',
    company: 'Mistral AI',
    region: 'EU',
    license: 'OPEN',
    founder: 'Arthur Mensch',
    country: 'Francia',
    logo: '/logos/Mistral.png',
    aliases: ['mistral large 2', 'mistral large', 'mixtral'],
    rivalSlug: 'llama-4',
    tier: 'frontier',
  },
  {
    slug: 'glm-4-plus',
    name: 'GLM-4 Plus',
    company: 'Zhipu AI',
    region: 'CN',
    license: 'OPEN',
    founder: 'Zhang Peng',
    country: 'China',
    logo: '/logos/zhipu.svg',
    aliases: ['glm-4', 'glm 4 plus', 'zhipu', 'chatglm'],
    rivalSlug: 'qwen-3-max',
    tier: 'frontier',
  },
  {
    slug: 'doubao-pro',
    name: 'Doubao Pro',
    company: 'ByteDance',
    region: 'CN',
    license: 'CLOSED',
    founder: 'Liang Rubo',
    country: 'China',
    logo: '/logos/bytedance.svg',
    aliases: ['doubao pro', 'doubao', 'bytedance ai', 'seed ai'],
    rivalSlug: 'kimi-k3',
    tier: 'frontier',
  },
];

export const ALL_ARENA_MODELS = [...ARENA_MODEL_REGISTRY, ...ARENA_ARCHIVED_REGISTRY];

export function getActiveArenaModels() {
  return ARENA_MODEL_REGISTRY.filter((m) => m.tier === 'frontier');
}

export function findArenaModel(slugOrName: string): ArenaModelMeta | undefined {
  const key = slugOrName.toLowerCase().trim();
  return ALL_ARENA_MODELS.find(
    (m) =>
      m.slug === key ||
      m.name.toLowerCase() === key ||
      m.aliases.some((a) => a === key || key.includes(a))
  );
}

export function mentionScore(text: string, aliases: string[]) {
  const t = text.toLowerCase();
  return aliases.reduce((acc, alias) => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i');
    return re.test(t) ? acc + 1 : acc;
  }, 0);
}

export function daysSinceRelease(releaseDate?: string): number | null {
  if (!releaseDate) return null;
  return Math.floor((Date.now() - new Date(releaseDate).getTime()) / 86_400_000);
}

export function isModelStale(
  meta: ArenaModelMeta,
  hasRecentFeedMention: boolean
): boolean {
  const days = daysSinceRelease(meta.releaseDate);
  if (days === null) return true;
  if (days <= 90) return false;
  return !hasRecentFeedMention;
}

export const ARENA_SCORE_LABEL = 'HAWKIN Index (estimado)';

export const NO_RELEASE_CONFIRMED = 'Sin confirmación de release';
