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
    aliases: ['openai', 'gpt', 'chatgpt', 'sam altman'],
    weights: { innovation: 30, talent: 20, capital: 15, execution: 15, impact: 10, adoption: 5, future: 5 },
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    logo: '/logos/NVIDIA.jpeg',
    ceo: 'Jensen Huang',
    aliases: ['nvidia', 'blackwell', 'jensen huang', 'gpu'],
    weights: { innovation: 25, talent: 15, capital: 20, execution: 20, impact: 15, adoption: 3, future: 2 },
  },
  {
    id: 'google',
    name: 'DeepMind',
    logo: '/logos/DEEPMIND.jpeg',
    ceo: 'Demis Hassabis',
    aliases: ['deepmind', 'google', 'gemini', 'demis hassabis', 'alphabet'],
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
    aliases: ['meta', 'llama', 'facebook', 'mark zuckerberg'],
    weights: { innovation: 20, talent: 15, capital: 15, execution: 20, impact: 20, adoption: 5, future: 5 },
  },
  {
    id: 'xai',
    name: 'xAI',
    logo: '/logos/XAI.webp',
    ceo: 'Elon Musk',
    aliases: ['xai', 'grok', 'x.com'],
    weights: { innovation: 25, talent: 15, capital: 15, execution: 25, impact: 10, adoption: 5, future: 5 },
  },
  {
    id: 'amazon',
    name: 'Amazon AI',
    logo: '/logos/AMAZON-AI.png',
    ceo: 'Andy Jassy',
    aliases: ['amazon', 'aws', 'bedrock', 'andy jassy'],
    weights: { innovation: 15, talent: 15, capital: 25, execution: 15, impact: 15, adoption: 10, future: 5 },
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: '/logos/APPLE.png',
    ceo: 'Tim Cook',
    aliases: ['apple', 'apple intelligence', 'tim cook'],
    weights: { innovation: 15, talent: 15, capital: 20, execution: 15, impact: 15, adoption: 15, future: 5 },
  },
  {
    id: 'mistral',
    name: 'Mistral',
    logo: '/logos/Mistral.png',
    ceo: 'Arthur Mensch',
    aliases: ['mistral'],
    weights: { innovation: 30, talent: 15, capital: 10, execution: 15, impact: 10, adoption: 15, future: 5 },
  },
  {
    id: 'figure',
    name: 'Figure AI',
    logo: '/logos/FIGURE-AI.avif',
    ceo: 'Brett Adcock',
    aliases: ['figure ai', 'figure', 'humanoid'],
    weights: { innovation: 35, talent: 20, capital: 15, execution: 10, impact: 10, adoption: 5, future: 5 },
  },
  {
    id: 'scale',
    name: 'Scale AI',
    logo: '/logos/SCALE-AI.svg',
    ceo: 'Alexandr Wang',
    aliases: ['scale ai', 'scale', 'alexandr wang'],
    weights: { innovation: 20, talent: 30, capital: 20, execution: 15, impact: 10, adoption: 3, future: 2 },
  },
];

export function findCompanyMeta(idOrName: string): HisCompanyMeta | undefined {
  const key = idOrName.toLowerCase().trim();
  return HIS_COMPANY_REGISTRY.find(
    (c) => c.id === key || c.name.toLowerCase() === key || c.aliases.some((a) => key.includes(a))
  );
}
