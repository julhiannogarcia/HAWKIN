'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Download } from 'lucide-react';

export default function FinancialCenter() {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/audit').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([s, logs]) => {
        setStats(s);
        setAuditLogs(Array.isArray(logs) ? logs.slice(0, 10) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const revenue = stats?.rawRevenue ?? 0;
  const adRevenue = stats?.adRevenue ?? 0;
  const hasData = revenue > 0 || adRevenue > 0 || (stats?.activeSubscriptions ?? 0) > 0;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Financial <span className="text-green-500">Center.</span>
          </h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">
            {hasData ? 'Ingresos reales de Supabase' : 'Sin datos aún — los pagos aparecerán aquí'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Ingresos Totales</p>
          <div className="text-4xl font-black text-white italic">
            {loading ? '...' : hasData ? `USD $${revenue.toLocaleString()}` : 'Sin datos aún'}
          </div>
        </div>
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Publicidad B2B</p>
          <div className="text-4xl font-black text-white italic">
            {loading ? '...' : `USD $${adRevenue.toLocaleString()}`}
          </div>
        </div>
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Suscripciones Activas</p>
          <div className="text-4xl font-black text-white italic">
            {loading ? '...' : stats?.activeSubscriptions ?? 0}
          </div>
        </div>
      </div>

      <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
          <CreditCard size={16} className="text-green-500" /> Eventos de Pago (Audit Log)
        </h3>
        {auditLogs.length === 0 ? (
          <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest py-8">Sin transacciones registradas aún</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-black text-gray-600 uppercase">
                  <th className="pb-4">Acción</th>
                  <th className="pb-4">Detalle</th>
                  <th className="pb-4 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3 text-xs font-bold text-white">{log.action}</td>
                    <td className="py-3 text-[10px] text-gray-500 truncate max-w-xs">{log.details || '—'}</td>
                    <td className="py-3 text-right text-[10px] text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
