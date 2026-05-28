'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// CARGA DINÁMICA CON SSR DESACTIVADO: La "Bala de Plata" contra las excepciones de cliente
const AdminContent = dynamic(() => import('@/components/admin/AdminContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
        Autenticando Acceso Maestro...
      </p>
    </div>
  )
});

export default function AdminPage() {
  return <AdminContent />;
}
