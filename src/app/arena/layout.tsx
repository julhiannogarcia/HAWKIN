import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HAWKIN Arena — Ranking editorial frontier',
  description:
    'Ranking editorial HAWKIN de modelos frontier 2026. NO es Elo LMSYS / Arena.ai oficial. Gemini 3.6 Flash, Claude, GPT, Kimi, DeepSeek y más.',
  openGraph: {
    title: 'HAWKIN Arena — Ranking editorial frontier',
    description:
      'HAWKIN Index editorial (estimado). NO es Elo LMSYS / Arena.ai oficial. Releases confirmados julio 2026.',
    url: 'https://aihawkin.com/arena',
  },
};

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
