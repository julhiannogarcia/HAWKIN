'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, Crosshair, Sword, LoaderCircle, RefreshCw } from 'lucide-react';

type ApiBattle = {
  competitors: string;
  motive: string;
  status: string;
  winners: string;
};

type ApiPrediction = {
  dominance?: string;
  ceo?: string;
  risk?: string;
};

type BattleView = {
  id: string;
  title: string;
  sideA: string;
  sideB: string;
  motive: string;
  status: string;
  winners: string;
};

function parseBattle(raw: ApiBattle, index: number): BattleView {
  const parts = raw.competitors.split(/\s+vs\.?\s+|\s+VS\s+/i);
  const sideA = parts[0]?.trim() || 'Actor A';
  const sideB = parts[1]?.trim() || 'Actor B';

  return {
    id: `battle-${index}-${sideA.slice(0, 8)}`,
    title: raw.competitors.length > 42 ? `${sideA} vs ${sideB}` : raw.competitors,
    sideA,
    sideB,
    motive: raw.motive || 'Análisis en curso.',
    status: raw.status || 'Monitoreo activo',
    winners: raw.winners || 'Por definir',
  };
}

function formatMinutesAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'hace menos de 1 min';
  if (mins === 1) return 'hace 1 min';
  return `hace ${mins} min`;
}

function formatTimeHHMM(date: Date): string {
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function AIWarRoom() {
  const [battles, setBattles] = useState<BattleView[]>([]);
  const [prediction, setPrediction] = useState<ApiPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  const fetchIntel = useCallback(async () => {
    try {
      const res = await fetch('/api/news/master-intel', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      const rawBattles: ApiBattle[] = Array.isArray(data.battles) ? data.battles : [];

      if (rawBattles.length === 0) {
        setFetchError(true);
        return;
      }

      setBattles(rawBattles.map(parseBattle));
      setPrediction(data.prediction || null);
      setLastUpdated(data.updatedAt ? new Date(data.updatedAt) : new Date());
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntel();
    const pollMs = 60000 + Math.floor(Math.random() * 60000);
    const interval = setInterval(fetchIntel, pollMs);
    return () => clearInterval(interval);
  }, [fetchIntel]);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const statusLabel = lastUpdated
    ? `Actualizado ${formatMinutesAgo(lastUpdated)} · ${formatTimeHHMM(lastUpdated)}`
    : 'Sincronizando…';

  return (
    <section className="w-full bg-[#020202] py-24 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-l-4 border-red-600 pl-8 text-left">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sword size={16} className="text-red-500" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Active Frontlines</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
              AI War <span className="text-red-600">Room.</span>
            </h2>
            <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">
              Conflictos tecnológicos vía Gemini + RSS
            </p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
              Última actualización: {lastUpdated ? formatTimeHHMM(lastUpdated) : '--:--'}
            </p>
            <p key={tick} className="text-[8px] font-bold uppercase tracking-widest text-gray-600">{statusLabel}</p>
            <button
              onClick={() => { setLoading(true); fetchIntel(); }}
              className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              <RefreshCw size={10} /> Refrescar
            </button>
          </div>
        </div>

        {loading && battles.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-6">
            <LoaderCircle className="animate-spin text-red-500" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Cargando inteligencia…</p>
          </div>
        ) : fetchError && battles.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-[40px]">
            <p className="text-lg font-black uppercase italic text-gray-500">Sin datos nuevos</p>
            <p className="text-[10px] text-gray-700 uppercase tracking-widest mt-3">El motor RSS/Gemini no respondió</p>
            <button
              onClick={() => { setLoading(true); fetchIntel(); }}
              className="mt-6 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white/10"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            {battles.map((battle) => (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] border border-white/5 rounded-[50px] p-10 space-y-10 relative group hover:border-red-600/20 transition-all duration-500"
              >
                <div className="flex justify-between items-center">
                  <span className="px-4 py-1.5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-full text-[8px] font-black uppercase tracking-widest line-clamp-1">
                    {battle.title}
                  </span>
                  <div className="flex items-center gap-2 text-gray-600 text-[9px] font-bold shrink-0">
                    <Crosshair size={12} /> {battle.status}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex flex-col items-center gap-4 text-center flex-1">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 transition-all">
                      <span className="text-lg font-black text-white uppercase">{battle.sideA.slice(0, 2)}</span>
                    </div>
                    <span className="text-xs font-black uppercase text-white">{battle.sideA}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-black italic text-red-600 animate-pulse">VS</div>
                    <div className="h-10 w-px bg-gradient-to-b from-red-600/50 to-transparent my-2" />
                  </div>

                  <div className="flex flex-col items-center gap-4 text-center flex-1">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 grayscale">
                      <span className="text-lg font-black text-gray-400 uppercase">{battle.sideB.slice(0, 2)}</span>
                    </div>
                    <span className="text-xs font-black uppercase text-gray-400">{battle.sideB}</span>
                  </div>
                </div>

                <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Zap size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Motivo estratégico</span>
                  </div>
                  <p className="text-xs text-gray-400 font-light italic leading-relaxed">&ldquo;{battle.motive}&rdquo;</p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-gray-700 uppercase">Estado</span>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{battle.status}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[6px] font-black text-gray-700 uppercase">Ventaja</span>
                      <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">{battle.winners}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {prediction && !fetchError && (
          <div className="mt-12 p-8 bg-white/[0.02] border border-white/5 rounded-[40px] text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500 mb-4">Predicción Alpha (fuente RSS/Gemini)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prediction.dominance && (
                <div>
                  <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Dominancia</p>
                  <p className="text-sm font-black text-white uppercase italic">{prediction.dominance}</p>
                </div>
              )}
              {prediction.ceo && (
                <div>
                  <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Líder</p>
                  <p className="text-sm font-black text-white uppercase italic">{prediction.ceo}</p>
                </div>
              )}
              {prediction.risk && (
                <div>
                  <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Riesgo</p>
                  <p className="text-sm font-black text-red-400 uppercase italic">{prediction.risk}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
