'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, CreditCard, DollarSign, Target, Newspaper, Activity, TrendingUp, BarChart, FileText, Eye,
} from 'lucide-react';

export default function AdminContent() {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, auditRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/audit'),
        ]);
        setStats(await statsRes.json());
        const logs = await auditRes.json();
        setAuditLogs(Array.isArray(logs) ? logs.slice(0, 8) : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fmt = (value: number | undefined, prefix = '') =>
    loading ? '...' : `${prefix}${(value ?? 0).toLocaleString()}`;

  const kpis = [
    { title: 'Sesiones Activas', val: fmt(stats?.activeNow), note: 'Datos reales de la base', icon: <Activity size={20} /> },
    { title: 'Usuarios Registrados', val: fmt(stats?.totalUsers), note: 'Total en la plataforma', icon: <Users size={20} /> },
    {
      title: 'Suscripciones Pagadas',
      val: fmt(stats?.activeSubscriptions),
      note: 'Planes activos en Stripe',
      icon: <CreditCard size={20} />,
    },
    { title: 'Noticias Publicadas', val: fmt(stats?.newsCount), note: 'Contenido en base de datos', icon: <Newspaper size={20} /> },
    {
      title: 'Ingresos Registrados',
      val: loading ? '...' : stats?.revenue || 'USD $0',
      note: 'PayPal + suscripciones',
      icon: <DollarSign size={20} />,
    },
    {
      title: 'Ingresos por Publicidad',
      val: fmt(stats?.adRevenue, 'USD $'),
      note: 'Solo pagos B2B verificados',
      icon: <TrendingUp size={20} />,
    },
    { title: 'Campañas Activas', val: fmt(stats?.activeAds), note: 'Anuncios en vivo', icon: <Target size={20} /> },
    {
      title: 'Impresiones de Ads',
      val: fmt(stats?.totalAdViews),
      note: `CTR real: ${stats?.adCtr || '0.0%'}`,
      icon: <Eye size={20} />,
    },
  ];

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Módulo de Control</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
            Executive <span className="text-blue-500">Overview.</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4">
            Métricas conectadas a Supabase — ya no son números de demostración
          </p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Última Sincronización</span>
            <span className="text-[10px] font-bold text-white">{loading ? 'Cargando...' : 'En tiempo real'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
              {kpi.icon}
            </div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">{kpi.title}</p>
            <div className="text-3xl font-black text-white italic tracking-tighter">{kpi.val}</div>
            <div className="mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-500">{kpi.note}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
            <BarChart size={16} className="text-blue-500" /> Resumen Financiero
          </h3>
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ingresos totales</span>
              <span className="text-3xl font-black italic text-white">{loading ? '...' : stats?.revenue || 'USD $0'}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Publicidad B2B</span>
              <span className="text-2xl font-black italic text-green-400">
                {loading ? '...' : `USD $${(stats?.adRevenue ?? 0).toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Clics en anuncios</span>
              <span className="text-2xl font-black italic text-cyan-400">
                {loading ? '...' : (stats?.totalAdClicks ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
            <FileText size={16} className="text-purple-500" /> Últimos Eventos (Audit Log)
          </h3>
          {auditLogs.length === 0 ? (
            <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center py-6">Sin eventos registrados aún</p>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-xl">
                  <div>
                    <p className="text-xs font-black text-white">{log.action}</p>
                    <p className="text-[9px] text-gray-500 truncate max-w-md">{log.details || '—'}</p>
                  </div>
                  <span className="text-[9px] text-gray-600 uppercase">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          <a href="/admin/audit" className="block w-full py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-white transition-colors text-center">
            Ver auditoría completa
          </a>
        </div>
      </div>
    </div>
  );
}
