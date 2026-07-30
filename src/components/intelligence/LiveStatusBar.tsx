'use client';

import React, { useState, useEffect } from 'react';

export default function LiveStatusBar() {
  const [times, setTimes] = useState({
    utc: '--:--',
    ny: '--:--',
    london: '--:--',
    sv: '--:--',
  });
  const [metrics, setMetrics] = useState<{ signals: string; precision: string } | null>(null);

  useEffect(() => {
    const updateTimes = () => {
      try {
        const now = new Date();
        const format = (tz: string) =>
          now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });

        setTimes({
          utc: now.toISOString().substring(11, 16),
          ny: format('America/New_York'),
          london: format('Europe/London'),
          sv: format('America/Los_Angeles'),
        });
      } catch (e) {
        console.error('LiveStatusBar Error:', e);
      }
    };

    updateTimes();
    const timer = setInterval(updateTimes, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || data.error) return;
        const signals = (data.newsCount ?? 0) + (data.totalAdViews ?? 0);
        setMetrics({
          signals: signals.toLocaleString(),
          precision: data.adCtr || '0.0%',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-[#050505] border-b border-white/5 py-2 px-6 flex items-center justify-between overflow-hidden whitespace-nowrap z-[1001] fixed top-0 left-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
          <span className="text-[7px] font-black text-cyan-500 uppercase tracking-[0.4em]">HAWKIN LIVE STATUS v6.1</span>
        </div>

        <div className="flex items-center gap-6 border-l border-white/10 pl-6">
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">UTC</span>
            <span className="text-[9px] font-black text-gray-300 tabular-nums">{times.utc}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">NY</span>
            <span className="text-[9px] font-black text-gray-300 tabular-nums">{times.ny}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">LDN</span>
            <span className="text-[9px] font-black text-gray-300 tabular-nums">{times.london}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">SV</span>
            <span className="text-[9px] font-black text-cyan-400 tabular-nums">{times.sv}</span>
          </div>
        </div>
      </div>

      {metrics && (
        <div className="flex items-center gap-8 text-right">
          <div className="hidden md:flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">Señales Procesadas</span>
            <span className="text-[9px] font-black text-white italic">{metrics.signals}</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-6">
            <span className="text-[6px] font-bold text-gray-600 uppercase">CTR Ads</span>
            <span className="text-[9px] font-black text-green-500">{metrics.precision}</span>
          </div>
        </div>
      )}
    </div>
  );
}
