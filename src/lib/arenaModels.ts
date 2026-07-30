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
};

export const ARENA_MODEL_REGISTRY: ArenaModelMeta[] = [
  {
    slug: 'claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    company: 'Anthropic',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Dario Amodei',
    country: 'USA',
    logo: '/logos/ANTHROPI.webp',
    aliases: ['claude 4', 'claude sonnet', 'anthropic claude', 'claude 3.5'],
    rivalSlug: 'gpt-4o',
  },
  {
    slug: 'gpt-4o',
    name: 'GPT-4o',
    company: 'OpenAI',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Sam Altman',
    country: 'USA',
    logo: '/logos/openAI.png',
    aliases: ['gpt-4o', 'gpt4o', 'openai gpt', 'chatgpt', 'o3', 'o1'],
    rivalSlug: 'claude-4-sonnet',
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
    aliases: ['gemini 2.5', 'gemini pro', 'google gemini', 'deepmind'],
    rivalSlug: 'gpt-4o',
  },
  {
    slug: 'deepseek-r1',
    name: 'DeepSeek R1',
    company: 'DeepSeek',
    region: 'CN',
    license: 'OPEN',
    founder: 'Liang Wenfeng',
    country: 'China',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['deepseek r1', 'deepseek-r1', 'deep seek', 'reasoning model'],
    rivalSlug: 'kimi-k3',
  },
  {
    slug: 'kimi-k3',
    name: 'Kimi K3',
    company: 'Moonshot AI',
    region: 'CN',
    license: 'OPEN',
    founder: 'Yang Zhilin',
    country: 'China',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['kimi k3', 'kimi', 'moonshot', 'moonshot ai'],
    rivalSlug: 'deepseek-r1',
  },
  {
    slug: 'qwen-2-5-max',
    name: 'Qwen 2.5 Max',
    company: 'Alibaba',
    region: 'CN',
    license: 'OPEN',
    founder: 'Jingren Zhou',
    country: 'China',
    logo: '/logos/AMAZON-AI.png',
    aliases: ['qwen', 'qwen 2.5', 'alibaba qwen', 'tongyi'],
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
    aliases: ['llama 4', 'llama4', 'meta llama', 'llama 3'],
    rivalSlug: 'qwen-2-5-max',
  },
  {
    slug: 'grok-3',
    name: 'Grok 3',
    company: 'xAI',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Elon Musk',
    country: 'USA',
    logo: '/logos/XAI.webp',
    aliases: ['grok 3', 'grok', 'xai grok'],
    rivalSlug: 'gpt-4o',
  },
  {
    slug: 'mistral-large',
    name: 'Mistral Large',
    company: 'Mistral AI',
    region: 'EU',
    license: 'OPEN',
    founder: 'Arthur Mensch',
    country: 'Francia',
    logo: '/logos/Mistral.png',
    aliases: ['mistral large', 'mistral ai', 'mixtral'],
    rivalSlug: 'llama-4',
  },
  {
    slug: 'deepseek-v3',
    name: 'DeepSeek V3',
    company: 'DeepSeek',
    region: 'CN',
    license: 'OPEN',
    founder: 'Liang Wenfeng',
    country: 'China',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['deepseek v3', 'deepseek-v3'],
    rivalSlug: 'qwen-2-5-max',
  },
  {
    slug: 'gemini-flash',
    name: 'Gemini 2.0 Flash',
    company: 'Google',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Sundar Pichai',
    country: 'USA',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['gemini flash', 'gemini 2.0 flash'],
    rivalSlug: 'claude-3-5-haiku',
  },
  {
    slug: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    company: 'Anthropic',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Dario Amodei',
    country: 'USA',
    logo: '/logos/ANTHROPI.webp',
    aliases: ['claude haiku', 'claude 3.5 haiku'],
    rivalSlug: 'gemini-flash',
  },
  {
    slug: 'phi-4',
    name: 'Phi-4',
    company: 'Microsoft',
    region: 'USA',
    license: 'OPEN',
    founder: 'Satya Nadella',
    country: 'USA',
    logo: '/logos/MICROSOFT.png',
    aliases: ['phi-4', 'phi 4', 'microsoft phi'],
    rivalSlug: 'llama-4',
  },
  {
    slug: 'yi-large',
    name: 'Yi-Large',
    company: '01.AI',
    region: 'CN',
    license: 'OPEN',
    founder: 'Kai-Fu Lee',
    country: 'China',
    logo: '/logos/DEEPMIND.jpeg',
    aliases: ['yi-large', 'yi large', '01.ai', 'zero one ai'],
    rivalSlug: 'qwen-2-5-max',
  },
  {
    slug: 'o3-mini',
    name: 'o3-mini',
    company: 'OpenAI',
    region: 'USA',
    license: 'CLOSED',
    founder: 'Sam Altman',
    country: 'USA',
    logo: '/logos/openAI.png',
    aliases: ['o3-mini', 'o3 mini', 'openai o3'],
    rivalSlug: 'deepseek-r1',
  },
];

export function findArenaModel(slugOrName: string): ArenaModelMeta | undefined {
  const key = slugOrName.toLowerCase().trim();
  return ARENA_MODEL_REGISTRY.find(
    (m) =>
      m.slug === key ||
      m.name.toLowerCase() === key ||
      m.aliases.some((a) => key.includes(a) || a.includes(key))
  );
}

export function mentionScore(text: string, aliases: string[]) {
  const t = text.toLowerCase();
  return aliases.reduce((acc, alias) => (t.includes(alias) ? acc + 1 : acc), 0);
}
