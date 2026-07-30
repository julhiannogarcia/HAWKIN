import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CeoMeta = {
  id: string;
  name: string;
  role: string;
  company: string;
  photo: string;
  logo: string;
  color: string;
  aliases: string[];
};

const CEO_REGISTRY: CeoMeta[] = [
  { id: 'altman', name: 'Sam Altman', role: 'CEO @ OpenAI', company: 'OpenAI', photo: '/sam-altman.jpg', logo: '/logos/openAI.png', color: '#10a37f', aliases: ['sam altman', 'openai'] },
  { id: 'huang', name: 'Jensen Huang', role: 'CEO @ NVIDIA', company: 'NVIDIA', photo: 'https://unavatar.io/twitter/nvidia', logo: '/logos/NVIDIA.jpeg', color: '#76b900', aliases: ['jensen huang', 'nvidia'] },
  { id: 'musk', name: 'Elon Musk', role: 'Founder @ xAI', company: 'xAI', photo: 'https://unavatar.io/twitter/elonmusk', logo: '/logos/XAI.webp', color: '#ffffff', aliases: ['elon musk', 'xai', 'grok'] },
  { id: 'hassabis', name: 'Demis Hassabis', role: 'CEO @ DeepMind', company: 'DeepMind', photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Demis_Hassabis_Royal_Society.jpg', logo: '/logos/DEEPMIND.jpeg', color: '#4285F4', aliases: ['demis hassabis', 'deepmind', 'gemini'] },
  { id: 'amodei', name: 'Dario Amodei', role: 'CEO @ Anthropic', company: 'Anthropic', photo: 'https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg/960px-Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg&w=400&h=400&fit=cover', logo: '/logos/ANTHROPI.webp', color: '#d97757', aliases: ['dario amodei', 'anthropic', 'claude'] },
  { id: 'nadella', name: 'Satya Nadella', role: 'CEO @ Microsoft', company: 'Microsoft', photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/MS-Exec-Nadella-Satya-2017-08-31-22_(cropped).jpg', logo: '/logos/MICROSOFT.png', color: '#00a4ef', aliases: ['satya nadella', 'microsoft', 'copilot'] },
  { id: 'zuckerberg', name: 'Mark Zuckerberg', role: 'CEO @ Meta', company: 'Meta', photo: 'https://unavatar.io/twitter/finkd', logo: '/logos/META-AI.png', color: '#0668E1', aliases: ['mark zuckerberg', 'meta', 'llama'] },
  { id: 'pichai', name: 'Sundar Pichai', role: 'CEO @ Alphabet', company: 'Alphabet', photo: 'https://unavatar.io/twitter/sundarpichai', logo: '/logos/DEEPMIND.jpeg', color: '#4285F4', aliases: ['sundar pichai', 'alphabet', 'google'] },
  { id: 'wang', name: 'Alexandr Wang', role: 'CEO @ Scale AI', company: 'Scale AI', photo: 'https://unavatar.io/twitter/alexandr_wang', logo: '/logos/SCALE-AI.svg', color: '#aa00ff', aliases: ['alexandr wang', 'scale ai'] },
  { id: 'yang', name: 'Yang Zhilin', role: 'Founder @ Moonshot', company: 'Moonshot AI', photo: 'https://unavatar.io/github/MoonshotAI', logo: '/logos/moonshot-kimi.svg', color: '#ff4444', aliases: ['yang zhilin', 'moonshot', 'kimi k3'] },
  { id: 'wenfeng', name: 'Liang Wenfeng', role: 'Founder @ DeepSeek', company: 'DeepSeek', photo: 'https://unavatar.io/github/deepseek-ai', logo: '/logos/deepseek.svg', color: '#4D6BFE', aliases: ['liang wenfeng', 'deepseek'] },
  { id: 'zhou', name: 'Jingren Zhou', role: 'VP @ Alibaba Cloud', company: 'Alibaba', photo: 'https://unavatar.io/twitter/alibaba_cloud', logo: '/logos/alibaba-qwen.svg', color: '#FF6A00', aliases: ['jingren zhou', 'qwen', 'alibaba'] },
  { id: 'kaifu', name: 'Kai-Fu Lee', role: 'Founder @ 01.AI', company: '01.AI', photo: 'https://unavatar.io/twitter/kaifulee', logo: '/logos/01ai.svg', color: '#22d3ee', aliases: ['kai-fu lee', '01.ai', 'yi-large'] },
];

let cached: { payload: unknown; at: number } | null = null;
const CACHE_MS = 120_000;

function getSiteUrl() {
  if (process.env.URL) return process.env.URL.replace(/\/$/, '');
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://127.0.0.1:3000';
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getSiteUrl()}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

function scoreCeoFromNews(ceo: CeoMeta, snippets: string[]) {
  let mentions = 0;
  let lastMove = '';
  for (const s of snippets) {
    const t = s.toLowerCase();
    if (ceo.aliases.some((a) => t.includes(a))) {
      mentions += 1;
      if (!lastMove) lastMove = s.slice(0, 120);
    }
  }
  return {
    influence: Math.min(99, 72 + mentions * 8),
    momentum: Number((mentions * 0.8 - 0.2).toFixed(1)),
    confidence: Math.min(98, 65 + mentions * 7),
    lastMove: lastMove || 'Sin movimiento destacado en titulares recientes.',
    mentions,
  };
}

async function enrichWithGemini(ceos: unknown[], snippets: string[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(
      `Analiza CEOs tech desde noticias REALES. JSON: {"ceos":[{"id","influence","momentum","confidence","lastMove","timeline":["evento"]}]}
Noticias: ${JSON.stringify(snippets.slice(0, 15))}
IDs: ${CEO_REGISTRY.map((c) => c.id).join(', ')}`.slice(0, 8000)
    );
    const match = result.response.text().match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed.ceos) ? parsed.ceos : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const now = Date.now();
  if (cached && now - cached.at < CACHE_MS) {
    return NextResponse.json(cached.payload);
  }

  try {
    const [masterIntel, newsLive] = await Promise.all([
      fetchJson<any>('/api/news/master-intel'),
      fetchJson<any>('/api/news/live'),
    ]);

    const snippets: string[] = [];
    for (const n of masterIntel?.topNews || []) snippets.push(`${n.title}. ${n.summary || ''}`);
    for (const n of newsLive?.news || []) snippets.push(`${n.title}. ${n.excerpt || ''}`);
    for (const c of masterIntel?.trendingCEOs || []) snippets.push(`${c.name} ${c.company} ${c.reason}`);

    if (snippets.length === 0) {
      return NextResponse.json({ ceos: [], updatedAt: new Date().toISOString(), error: true });
    }

    const aiEnriched = await enrichWithGemini([], snippets);
    const aiMap = new Map((aiEnriched || []).map((c: any) => [c.id, c]));

    const ceos = CEO_REGISTRY.map((meta) => {
      const scored = scoreCeoFromNews(meta, snippets);
      const ai = aiMap.get(meta.id);
      const momentum = ai?.momentum ?? scored.momentum;
      return {
        id: meta.id,
        name: meta.name,
        role: meta.role,
        company: meta.company,
        photo: meta.photo,
        logo: meta.logo,
        color: meta.color,
        influence: ai?.influence ?? scored.influence,
        momentum: momentum >= 0 ? `+${momentum}` : `${momentum}`,
        confidence: ai?.confidence ?? scored.confidence,
        lastMove: ai?.lastMove ?? scored.lastMove,
        dossier: {
          vision: Math.min(99, scored.influence + 2),
          execution: Math.min(99, scored.confidence - 3),
          risk_tolerance: Math.min(99, 70 + scored.mentions * 5),
          market_status: momentum >= 0 ? `+${momentum}% ▲` : `${momentum}% ▼`,
          timeline: Array.isArray(ai?.timeline) && ai.timeline.length > 0
            ? ai.timeline.slice(0, 4)
            : [scored.lastMove],
        },
      };
    })
      .sort((a, b) => b.influence - a.influence)
      .slice(0, 10);

    const payload = { ceos, updatedAt: new Date().toISOString(), source: aiEnriched ? 'gemini+feeds' : 'news-mentions' };
    cached = { payload, at: now };
    return NextResponse.json(payload);
  } catch (error) {
    console.error('CEO RADAR API ERR:', error);
    return NextResponse.json({ ceos: [], updatedAt: new Date().toISOString(), error: true });
  }
}
