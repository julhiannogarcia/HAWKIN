'use client';

import dynamic from 'next/dynamic';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

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

export default function NewsPage() {
  const params = useParams();
  const id = params.id as string;
  
  return <NewsDetailContent newsId={id} />;
}
