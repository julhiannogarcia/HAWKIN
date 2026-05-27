'use client';

import dynamic from 'next/dynamic';

const B2BContent = dynamic(() => import('@/components/b2b/B2BContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Sincronizando Sistema Comercial...</p>
      </div>
    </div>
  )
});

export default function B2BPage() {
  return <B2BContent />;
}
