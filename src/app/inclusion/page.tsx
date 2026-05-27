'use client';

import dynamic from 'next/dynamic';

const InclusionContent = dynamic(() => import('@/components/inclusion/InclusionContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-[#EBF5FB] rounded-full flex items-center justify-center mx-auto animate-pulse">
           <span className="text-4xl">🧩</span>
        </div>
        <p className="text-[#2E86C1] font-bold uppercase tracking-widest text-[10px]">Cargando Entorno Seguro...</p>
      </div>
    </div>
  )
});

export default function InclusionPage() {
  return <InclusionContent />;
}
