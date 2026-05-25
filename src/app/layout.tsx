import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import HawkinAI from "@/components/HawkinAI";
import GlobalAlert from "@/components/GlobalAlert";

export const metadata: Metadata = {
  title: {
    default: "AI HAWKIN | El Radar de la Élite y Academia de IA",
    template: "%s | AI HAWKIN"
  },
  description: "El primer ecosistema global de noticias de millonarios, cursos de IA y ciberseguridad Shield. Liderado por Julhianno Garcia.",
  keywords: ["IA", "Inteligencia Artificial", "Millonarios", "CEOs", "Sam Altman", "NVIDIA", "Ciberseguridad", "Cursos IA", "HAWKIN"],
  authors: [{ name: "Julhianno Garcia" }],
  creator: "Julhianno Garcia",
  publisher: "HAWKIN Global",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://aihawkin.com",
    siteName: "AI HAWKIN",
    title: "AI HAWKIN | El Futuro de la Inteligencia Global",
    description: "Radar de rumores de CEOs, academia multidisciplinaria y protección Shield.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "AI HAWKIN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI HAWKIN",
    description: "Noticias y Cursos de IA de Élite.",
    images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="canonical" href="https://aihawkin.com" />
      </head>
      <body className="antialiased bg-black text-white">
        <Suspense fallback={null}>
          <GlobalAlert />
        </Suspense>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
