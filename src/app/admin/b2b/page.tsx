'use client';

import dynamic from 'next/dynamic';
import { LoaderCircle } from 'lucide-react';

const ManageB2BContent = dynamic(() => import('@/components/admin/ManageB2BContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <LoaderCircle className="animate-spin text-blue-600" size={48} />
      <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Sincronizando Motor Publicitario...
      </p>
    </div>
  )
});

export default function ManageB2BPage() {
  return <ManageB2BContent />;
}
