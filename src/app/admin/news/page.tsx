'use client';

import dynamic from 'next/dynamic';
import { LoaderCircle } from 'lucide-react';

const ManageNewsContent = dynamic(() => import('@/components/admin/ManageNewsContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <LoaderCircle className="animate-spin text-cyan-500" size={48} />
      <p className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Sincronizando Consola de Inyección...
      </p>
    </div>
  )
});

export default function ManageNewsPage() {
  return <ManageNewsContent />;
}
