'use client';

import { AlphaProvider } from "@/context/AlphaContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AlphaProvider>
      {children}
    </AlphaProvider>
  );
}
