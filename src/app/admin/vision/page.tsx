'use client';

import Link from 'next/link';
import { Eye, ExternalLink } from 'lucide-react';

/** Vision ya no usa PIN ni datos inventados. El acceso real es /admin (contraseña). */
export default function AdminVision() {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
          <Eye size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">HAWKIN Vision</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Sin datos inventados · panel protegido
          </p>
        </div>
      </div>

      <div className="p-6 border border-amber-500/20 bg-amber-500/[0.05] rounded-xl space-y-3">
        <p className="text-sm text-amber-400 font-semibold">
          El PIN embebido en el cliente y las métricas de demostración fueron eliminados.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Para métricas reales usa el panel admin autenticado. Si no hay dato en base de datos → Sin datos nuevos.
        </p>
      </div>

      <div className="grid gap-3">
        <Link
          href="/admin"
          className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-cyan-500/40 text-sm font-bold uppercase tracking-widest"
        >
          Executive Overview <ExternalLink size={14} className="text-gray-600" />
        </Link>
        <Link
          href="/admin/financial"
          className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-cyan-500/40 text-sm font-bold uppercase tracking-widest"
        >
          Financial Center <ExternalLink size={14} className="text-gray-600" />
        </Link>
        <Link
          href="/admin/b2b"
          className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-cyan-500/40 text-sm font-bold uppercase tracking-widest"
        >
          Advertising Center <ExternalLink size={14} className="text-gray-600" />
        </Link>
      </div>
    </div>
  );
}
