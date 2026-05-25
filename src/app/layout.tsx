import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Providers from "@/components/Providers";
import dynamic from 'next/dynamic';

// Cargamos los componentes pesados de forma dinámica para NO bloquear la carga
const HawkinAI = dynamic(() => import("@/components/HawkinAI"), { ssr: false });
const GlobalAlert = dynamic(() => import("@/components/GlobalAlert"), { ssr: false });

export const metadata: Metadata = {
  title: {
    default: "AI HAWKIN | El Radar de la Élite",
    template: "%s | AI HAWKIN"
  },
  description: "El primer ecosistema global de noticias de millonarios y cripto GOLD.",
  authors: [{ name: "Julhianno Garcia" }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://aihawkin.com",
    siteName: "AI HAWKIN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-black text-white overflow-x-hidden">
        <Providers>
          <div className="relative z-10">
            {children}
          </div>
          
          <Suspense fallback={null}>
            <GlobalAlert />
            <HawkinAI />
          </Suspense>
          
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
