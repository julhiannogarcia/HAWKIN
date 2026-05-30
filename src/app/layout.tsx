import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Providers from "@/components/Providers";
import ClientSideComponents from "@/components/ClientSideComponents";

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
  verification: {
    google: "mNoEg1VurMz0gj5grgyPY19ww0WLd9Dj6_xuTWOzKgQ",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-black text-white overflow-x-hidden">
        <Providers>
          <div className="relative z-10">
            {children}
          </div>
          
          <ClientSideComponents />
          
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
