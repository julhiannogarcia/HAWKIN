'use client';

import dynamic from 'next/dynamic';
import { LoaderCircle } from 'lucide-react';

const ShieldContent = dynamic(() => import('@/components/shield/ShieldContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <LoaderCircle className="animate-spin text-red-600" size={48} />
      <p className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Activando Protocolos SHIELD...
      </p>
    </div>
  )
});

export default function ShieldPage() {
  return <ShieldContent />;
}
