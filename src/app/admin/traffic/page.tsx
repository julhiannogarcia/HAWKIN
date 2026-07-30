'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Globe, Clock, Users, FileText } from 'lucide-react';

export default function TrafficCenter() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const noData = !loading && !stats?.totalUsers;

  const kpis = noData
    ? [
        { title: 'Visitantes Activos', val: 'Sin datos aún', note: 'Conecta analytics para medir tráfico' },
        { title: 'Tiempo Promedio', val: 'Sin datos aún', note: 'Requiere integración de analytics' },
        { title: 'Usuarios Únicos', val: 'Sin datos aún', note: 'Requiere integración de analytics' },
        { title: 'Sesiones DB', val: loading ? '...' : String(stats?.activeNow ?? 0), note: 'Sesiones activas en base de datos' },
      ]
    : [
        { title: 'Sesiones Activas (DB)', val: String(stats?.activeNow ?? 0), note: 'Datos reales de Supabase' },
        { title: 'Usuarios Registrados', val: String(stats?.totalUsers ?? 0), note: 'Total en plataforma' },
        { title: 'Noticias Publicadas', val: String(stats?.newsCount ?? 0), note: 'Contenido en radar' },
        { title: 'Impresiones Ads', val: String(stats?.totalAdViews ?? 0), note: 'Vistas reales de publicidad' },
      ];

  return (
    <div className="space-y-12">
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Live Traffic <span className="text-blue-500">Center.</span>
        </h1>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">
          {noData ? 'Sin integración de analytics — mostrando solo datos de base de datos' : 'Métricas reales de la plataforma'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">{kpi.title}</p>
            <div className="text-3xl font-black text-white italic">{kpi.val}</div>
            <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-600">{kpi.note}</p>
          </div>
        ))}
      </div>

      <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] text-center">
        <Globe size={48} className="text-blue-500 mx-auto mb-4 opacity-50" />
        <p className="text-sm font-black uppercase italic text-gray-400">Mapa de tráfico global</p>
        <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">Sin datos aún — conecta Google Analytics o Plausible</p>
      </div>
    </div>
  );
}
