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
  /** Aliases específicos — sin cruces entre generaciones (ej. no mezclar Claude 3.5 con Claude 4) */
  aliases: string[];
  rivalSlug: string;
};

/** Frontier IA — julio 2026. Logos verificados en /public/logos/ */
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
    rivalSlug: 'gemini-2-5-pro',
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
  },
  {
    slug: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    company: 'Google DeepMind',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Demis Hassabis',
    country: 'USA',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['gemini 2.5 pro', 'gemini 2.5', 'gemini pro'],
    rivalSlug: 'gpt-5',
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
  },
  {
    slug: 'ernie-4-5',
    name: 'ERNIE 4.5',
    company: 'Baidu',
    region: 'CN',
    license: 'OPEN',
    founder: 'Robin Li',
    country: 'China',
    logo: '/logos/baidu.svg',
    aliases: ['ernie 4.5', 'ernie 4', 'baidu ernie'],
    rivalSlug: 'glm-4-plus',
  },
  {
    slug: 'yi-large',
    name: 'Yi-Large',
    company: '01.AI',
    region: 'CN',
    license: 'OPEN',
    founder: 'Kai-Fu Lee',
    country: 'China',
    logo: '/logos/01ai.svg',
    aliases: ['yi-large', 'yi large', '01.ai', 'zero one ai'],
    rivalSlug: 'qwen-3-max',
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
  },
];

export function findArenaModel(slugOrName: string): ArenaModelMeta | undefined {
  const key = slugOrName.toLowerCase().trim();
  return ARENA_MODEL_REGISTRY.find(
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

export const ARENA_SCORE_LABEL = 'HAWKIN Index (estimado)';
