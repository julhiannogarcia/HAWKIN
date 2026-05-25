'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Cargamos los componentes de cliente de forma dinámica y segura
const HawkinAI = dynamic(() => import("@/components/HawkinAI"), { ssr: false });
const GlobalAlert = dynamic(() => import("@/components/GlobalAlert"), { ssr: false });

export default function ClientSideComponents() {
  return (
    <Suspense fallback={null}>
      <GlobalAlert />
      <HawkinAI />
    </Suspense>
  );
}
