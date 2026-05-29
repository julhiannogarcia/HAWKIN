'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const NewsDetailContent = dynamic(() => import('@/components/news/NewsDetailContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-cyan-500" size={40} />
      <p className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Sincronizando Radar HAWKIN...
      </p>
    </div>
  )
});

export default function NewsPage() {
  return <NewsDetailContent />;
}
