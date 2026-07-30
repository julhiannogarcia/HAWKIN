import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HAWKIN Arena — Quién lidera la IA hoy',
  description:
    'Ranking en vivo de modelos de IA: Claude, GPT, Gemini, Kimi K3, DeepSeek, Qwen, Llama y más. Score HAWKIN Index, beneficios, debate USA vs China y últimas novedades.',
  openGraph: {
    title: 'HAWKIN Arena — Quién lidera la IA hoy',
    description: 'Ranking global de modelos IA con datos en vivo. Kimi K3, DeepSeek, GPT, Claude y la batalla open-weights USA vs China.',
    url: 'https://aihawkin.com/arena',
  },
};

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
