'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const GoldContent = dynamic(() => import('@/components/gold/GoldContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-[#FFD700]" size={40} />
      <p className="text-[#FFD700] font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Sincronizando Terminal Alpha Gold...
      </p>
    </div>
  )
});

export default function GoldPage() {
  return <GoldContent />;
}
