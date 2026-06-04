'use client';

import dynamic from 'next/dynamic';
import { LoaderCircle, ChevronRight } from 'lucide-react';
import { use } from 'react';

const NewsDetailContent = dynamic(() => import('@/components/news/NewsDetailContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <LoaderCircle className="animate-spin text-cyan-500" size={40} />
      <p className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Sincronizando Radar HAWKIN...
      </p>
    </div>
  )
});

export default function NewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  return <NewsDetailContent newsId={id} />;
}
