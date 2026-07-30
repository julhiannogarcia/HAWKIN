'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Database, FileText, Newspaper } from 'lucide-react';

export default function IntelligenceOps() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const newsCount = stats?.newsCount ?? 0;
  const adViews = stats?.totalAdViews ?? 0;

  return (
    <div className="space-y-12">
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Intelligence <span className="text-purple-500">Ops.</span>
        </h1>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Datos reales del radar de noticias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Noticias en DB', v: loading ? '...' : newsCount.toLocaleString(), i: <Newspaper /> },
          { l: 'Impresiones Ads', v: loading ? '...' : adViews.toLocaleString(), i: <Database /> },
          { l: 'Campañas Activas', v: loading ? '...' : String(stats?.activeAds ?? 0), i: <FileText /> },
          { l: 'CTR Publicidad', v: loading ? '...' : stats?.adCtr || '0.0%', i: <BrainCircuit /> },
        ].map((m, i) => (
          <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.l}</p>
              <p className="text-3xl font-black text-white italic">{m.v}</p>
            </div>
            <div className="text-purple-500 opacity-50">{m.i}</div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
          Logs de agentes IA — Sin datos aún (se activará con el cron de noticias)
        </p>
      </div>
    </div>
  );
}
