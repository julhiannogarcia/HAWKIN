'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Clock, LoaderCircle, RefreshCw, ExternalLink } from 'lucide-react';

type Threat = {
  id: string;
  title: string;
  link?: string;
  content?: string;
  source: string;
  dateLabel?: string;
  severity: string;
  impact?: string;
};

export default function SecurityShield() {
  const [alerts, setAlerts] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchShield = useCallback(async () => {
    try {
      const res = await fetch('/api/news/shield', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!Array.isArray(data.threats) || data.threats.length === 0) {
        setError(true);
        return;
      }
      setAlerts(data.threats.slice(0, 6));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShield();
    const interval = setInterval(fetchShield, 180_000);
    return () => clearInterval(interval);
  }, [fetchShield]);

  return (
    <section className="w-full bg-[#050505] py-16 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-left">
        <div className="mb-8 border-l-4 border-red-600 pl-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert size={16} className="text-red-500" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Fuentes RSS de seguridad</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none text-white">
              Security <span className="text-red-600">Shield.</span>
            </h2>
            <p className="text-gray-500 mt-3 text-[10px] font-black uppercase tracking-[0.4em]">
              Hacker News · BleepingComputer · Krebs · SecurityWeek
            </p>
          </div>
          {!loading && (
            <button onClick={fetchShield} className="flex items-center gap-1 text-[9px] font-black uppercase text-gray-600 hover:text-red-400">
              <RefreshCw size={12} /> Actualizar
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-12 gap-3 text-gray-600">
            <LoaderCircle className="animate-spin text-red-500" size={22} />
            <span className="text-xs uppercase tracking-widest">Escaneando feeds…</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center border border-white/5 rounded-2xl">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sin datos nuevos</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <a
                key={alert.id}
                href={alert.link || '#'}
                target={alert.link ? '_blank' : undefined}
                rel={alert.link ? 'noopener noreferrer' : undefined}
                className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-red-500/30 transition-all group block"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      alert.severity === 'CRÍTICA'
                        ? 'bg-red-600 text-white'
                        : 'bg-orange-500/20 text-orange-500'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  {alert.dateLabel && (
                    <span className="text-[8px] font-bold text-gray-600 uppercase flex items-center gap-1">
                      <Clock size={10} /> {alert.dateLabel}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-white italic uppercase tracking-tighter mb-3 line-clamp-2">
                  {alert.title}
                </h3>
                {alert.content && (
                  <p className="text-xs text-gray-400 font-light line-clamp-2 mb-4">{alert.content}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-[9px] font-black text-cyan-400 uppercase">{alert.source}</span>
                  {alert.link && <ExternalLink size={12} className="text-gray-600" />}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
