'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const DonacionContent = dynamic(() => import('@/components/donation/DonacionContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-pink-600" size={48} />
      <p className="text-pink-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Iniciando Misión Social...
      </p>
    </div>
  )
});

export default function DonacionPage() {
  return <DonacionContent />;
}
