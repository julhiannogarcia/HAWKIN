'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, AlertTriangle, RefreshCw, LoaderCircle, Check, X } from 'lucide-react';

type CatalogItem = {
  slug: string;
  name: string;
  company: string;
  releaseDate: string | null;
  daysSinceRelease: number | null;
  hasConfirmedRelease: boolean;
};

type Alert = {
  id: string;
  vendorName: string;
  title: string;
  link?: string;
  reason: string;
  status: string;
};

type StaleModel = {
  slug: string;
  name: string;
  message: string;
};

export default function AdminArenaPage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [staleModels, setStaleModels] = useState<StaleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannedAt, setScannedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/arena', { cache: 'no-store' });
      if (!res.ok) throw new Error('load failed');
      const data = await res.json();
      setCatalog(data.catalog || []);
      setAlerts(data.alerts || []);
      setStaleModels(data.staleModels || []);
      setScannedAt(data.scannedAt || null);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runScan = async () => {
    setScanning(true);
    try {
      await fetch('/api/admin/arena', { method: 'POST' });
      await load();
    } finally {
      setScanning(false);
    }
  };

  const reviewAlert = async (alert: Alert, action: 'APPROVE' | 'REJECT') => {
    await fetch('/api/admin/arena', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId: alert.id, action, title: alert.title, reviewedBy: 'admin' }),
    });
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Arena Control</span>
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Arena <span className="text-amber-400">Releases.</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
            Anti-desfase · aprobar antes de publicar cambios de catálogo
          </p>
          {scannedAt && (
            <p className="text-[9px] text-gray-600 mt-1">Último scan: {new Date(scannedAt).toLocaleString('es-PE')}</p>
          )}
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-400 hover:bg-amber-500/20 disabled:opacity-50"
        >
          {scanning ? <LoaderCircle className="animate-spin" size={14} /> : <RefreshCw size={14} />}
          Escanear releases oficiales
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoaderCircle className="animate-spin text-amber-500" size={28} />
        </div>
      ) : (
        <>
          {alerts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-black uppercase text-red-400 flex items-center gap-2">
                <AlertTriangle size={16} /> Alertas pendientes ({alerts.length})
              </h2>
              {alerts.map((alert) => (
                <div key={alert.id} className="p-5 border border-red-500/20 bg-red-500/5 rounded-2xl">
                  <p className="text-[9px] font-black text-red-400 uppercase mb-1">{alert.vendorName}</p>
                  <p className="text-sm font-bold text-white mb-2">{alert.title}</p>
                  <p className="text-xs text-gray-500 mb-4">{alert.reason}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => reviewAlert(alert, 'APPROVE')}
                      className="flex items-center gap-1 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-[9px] font-black uppercase text-green-400"
                    >
                      <Check size={12} /> Aprobar (actualizar catálogo)
                    </button>
                    <button
                      onClick={() => reviewAlert(alert, 'REJECT')}
                      className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-gray-400"
                    >
                      <X size={12} /> Rechazar
                    </button>
                    {alert.link && (
                      <a
                        href={alert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-[9px] font-black uppercase text-cyan-400"
                      >
                        Ver fuente →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}

          {staleModels.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-black uppercase text-amber-400">Modelos a verificar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {staleModels.map((m) => (
                  <div key={m.slug} className="p-4 border border-amber-500/20 rounded-xl bg-amber-500/5">
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    <p className="text-[10px] text-amber-400/80 mt-1">{m.message}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-black uppercase text-gray-400 mb-4">Catálogo Arena activo</h2>
            <div className="border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] text-[9px] uppercase tracking-widest text-gray-600">
                  <tr>
                    <th className="p-4">Modelo</th>
                    <th className="p-4">Empresa</th>
                    <th className="p-4">Release</th>
                    <th className="p-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {catalog.map((item) => (
                    <tr key={item.slug} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-bold text-white">{item.name}</td>
                      <td className="p-4 text-gray-500">{item.company}</td>
                      <td className="p-4 text-gray-400 tabular-nums">{item.releaseDate || '—'}</td>
                      <td className="p-4">
                        {item.hasConfirmedRelease ? (
                          <span className="text-[9px] font-black uppercase text-green-400">Confirmado</span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-amber-400">Verificar actualidad</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
