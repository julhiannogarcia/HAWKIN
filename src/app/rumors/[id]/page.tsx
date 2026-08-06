'use client';

import { use } from 'react';
import IntelDetail from '@/components/news/IntelDetail';

export default function RumorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <IntelDetail
      itemId={id}
      feedHint="rumors"
      backHref="/rumors"
      backLabel="Volver a Rumores"
    />
  );
}
