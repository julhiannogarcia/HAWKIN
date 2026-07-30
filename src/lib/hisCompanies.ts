export type HisCompanyMeta = {
  id: string;
  name: string;
  logo: string;
  ceo: string;
  aliases: string[];
  weights: Record<string, number>;
};

export const HIS_COMPANY_REGISTRY: HisCompanyMeta[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '/logos/openAI.png',
    ceo: 'Sam Altman',
    aliases: ['openai', 'gpt-5', 'chatgpt', 'sam altman'],
    weights: { innovation: 30, talent: 20, capital: 15, execution: 15, impact: 10, adoption: 5, future: 5 },
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    logo: '/logos/NVIDIA.jpeg',
    ceo: 'Jensen Huang',
    aliases: ['nvidia', 'blackwell', 'jensen huang'],
    weights: { innovation: 25, talent: 15, capital: 20, execution: 20, impact: 15, adoption: 3, future: 2 },
  },
  {
    id: 'google',
    name: 'DeepMind',
    logo: '/logos/DEEPMIND.jpeg',
    ceo: 'Demis Hassabis',
    aliases: ['deepmind', 'google deepmind', 'gemini', 'demis hassabis'],
    weights: { innovation: 20, talent: 25, capital: 15, execution: 15, impact: 10, adoption: 10, future: 5 },
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '/logos/ANTHROPI.webp',
    ceo: 'Dario Amodei',
    aliases: ['anthropic', 'claude', 'dario amodei'],
    weights: { innovation: 35, talent: 20, capital: 10, execution: 10, impact: 10, adoption: 10, future: 5 },
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '/logos/MICROSOFT.png',
    ceo: 'Satya Nadella',
    aliases: ['microsoft', 'azure', 'copilot', 'satya nadella'],
    weights: { innovation: 15, talent: 15, capital: 25, execution: 20, impact: 15, adoption: 5, future: 5 },
  },
  {
    id: 'meta',
    name: 'Meta AI',
    logo: '/logos/META-AI.png',
    ceo: 'Mark Zuckerberg',
    aliases: ['meta ai', 'meta', 'llama', 'mark zuckerberg'],
    weights: { innovation: 20, talent: 15, capital: 15, execution: 20, impact: 20, adoption: 5, future: 5 },
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    logo: '/logos/moonshot-kimi.svg',
    ceo: 'Yang Zhilin',
    aliases: ['moonshot', 'moonshot ai', 'kimi', 'kimi k3', 'yang zhilin'],
    weights: { innovation: 32, talent: 22, capital: 12, execution: 14, impact: 12, adoption: 5, future: 3 },
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    logo: '/logos/deepseek.svg',
    ceo: 'Liang Wenfeng',
    aliases: ['deepseek', 'deep seek', 'liang wenfeng'],
    weights: { innovation: 34, talent: 18, capital: 10, execution: 16, impact: 14, adoption: 5, future: 3 },
  },
  {
    id: 'alibaba',
    name: 'Alibaba AI',
    logo: '/logos/alibaba-qwen.svg',
    ceo: 'Jingren Zhou',
    aliases: ['alibaba', 'qwen', 'qwen 3', 'tongyi'],
    weights: { innovation: 28, talent: 18, capital: 18, execution: 14, impact: 12, adoption: 7, future: 3 },
  },
  {
    id: 'baidu',
    name: 'Baidu AI',
    logo: '/logos/baidu.svg',
    ceo: 'Robin Li',
    aliases: ['baidu', 'ernie', 'robin li'],
    weights: { innovation: 24, talent: 16, capital: 16, execution: 14, impact: 12, adoption: 10, future: 4 },
  },
  {
    id: 'bytedance',
    name: 'ByteDance AI',
    logo: '/logos/bytedance.svg',
    ceo: 'Liang Rubo',
    aliases: ['bytedance', 'doubao', 'tiktok ai'],
    weights: { innovation: 26, talent: 20, capital: 14, execution: 16, impact: 14, adoption: 8, future: 2 },
  },
  {
    id: 'zhipu',
    name: 'Zhipu AI',
    logo: '/logos/zhipu.svg',
    ceo: 'Zhang Peng',
    aliases: ['zhipu', 'glm', 'chatglm'],
    weights: { innovation: 30, talent: 18, capital: 12, execution: 14, impact: 12, adoption: 10, future: 4 },
  },
  {
    id: 'xai',
    name: 'xAI',
    logo: '/logos/XAI.webp',
    ceo: 'Elon Musk',
    aliases: ['xai', 'grok', 'elon musk'],
    weights: { innovation: 25, talent: 15, capital: 15, execution: 25, impact: 10, adoption: 5, future: 5 },
  },
  {
    id: 'mistral',
    name: 'Mistral',
    logo: '/logos/Mistral.png',
    ceo: 'Arthur Mensch',
    aliases: ['mistral ai', 'mistral'],
    weights: { innovation: 30, talent: 15, capital: 10, execution: 15, impact: 10, adoption: 15, future: 5 },
  },
  {
    id: 'scale',
    name: 'Scale AI',
    logo: '/logos/SCALE-AI.svg',
    ceo: 'Alexandr Wang',
    aliases: ['scale ai', 'alexandr wang'],
    weights: { innovation: 20, talent: 30, capital: 20, execution: 15, impact: 10, adoption: 3, future: 2 },
  },
];

export function findCompanyMeta(idOrName: string): HisCompanyMeta | undefined {
  const key = idOrName.toLowerCase().trim();
  return HIS_COMPANY_REGISTRY.find(
    (c) => c.id === key || c.name.toLowerCase() === key || c.aliases.some((a) => key.includes(a))
  );
}
