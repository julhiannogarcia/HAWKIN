import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAWKIN | El Futuro de la IA",
  description: "Plataforma global de noticias y cursos de IA por Julhianno Garcia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
