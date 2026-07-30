'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ExternalLink,
  Globe,
  LoaderCircle,
  RefreshCw,
  Swords,
  Trophy,
} from 'lucide-react';
import type { ArenaRegion } from '@/lib/arenaModels';
import { ARENA_SCORE_LABEL } from '@/lib/arenaModels';

type ArenaModelView = {
  slug: string;
  name: string;
  company: string;
  region: ArenaRegion;
  license: 'OPEN' | 'CLOSED';
  founder: string;
  country: string;
  logo: string;
  score: number;
  change24h: number;
  change7d: number;
  scoreLabel: string;
  whatsNew: string;
  benefits: string[];
  debate: string;
  sourceUrl?: string;
  rank: number;
  rivalSlug: string;
  releaseConfirmed?: boolean;
  needsVerification?: boolean;
};

type ArenaRankingProps = {
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
  showViewAllLink?: boolean;
};

function formatTimeHHMM(date: Date) {
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function regionFlag(region: ArenaRegion) {
  if (region === 'CN') return '🇨🇳';
  if (region === 'EU') return '🇪🇺';
  return '🇺🇸';
}

function ModelDetail({ model }: { model: ArenaModelView }) {
  return (
    <div className="px-3 sm:px-4 pb-4 pt-2 border-t border-white/5 space-y-4 text-left">
      <div>
        <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest mb-1">Qué trajo de nuevo</p>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{model.whatsNew}</p>
      </div>

      <div>
        <p className="text-[8px] font-black text-green-500/80 uppercase tracking-widest mb-2">Beneficios</p>
        <ul className="space-y-1.5">
          {model.benefits.map((b, i) => (
            <li key={i} className="text-xs text-gray-400 flex gap-2">
              <span className="text-cyan-500 shrink-0">•</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <p className="text-[8px] font-black text-amber-500/80 uppercase tracking-widest mb-1 flex items-center gap-1">
          <Swords size={10} /> Debate HAWKIN
        </p>
        <p className="text-xs text-gray-400 leading-relaxed italic">{model.debate}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-[9px] uppercase tracking-widest text-gray-600">
        <span>Fundador: <span className="text-gray-400">{model.founder}</span></span>
        <span>{model.company}</span>
        <span>{model.country}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/arena/${model.slug}`}
          className="text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300"
        >
          Ficha completa →
        </Link>
        {model.sourceUrl && model.sourceUrl !== '#' && (
          <a
            href={model.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-1"
          >
            Fuente <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function ArenaRanking({
  limit,
  compact = false,
  showHeader = true,
  showViewAllLink = false,
}: ArenaRankingProps) {
  const [models, setModels] = useState<ArenaModelView[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<'ALL' | ArenaRegion>('ALL');

  const fetchArena = useCallback(async () => {
    try {
      const res = await fetch('/api/intelligence/arena', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!Array.isArray(data.models) || data.models.length === 0) {
        setFetchError(true);
        return;
      }
      setModels(data.models);
      setLastUpdated(data.updatedAt ? new Date(data.updatedAt) : new Date());
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArena();
    const interval = setInterval(fetchArena, 120_000);
    return () => clearInterval(interval);
  }, [fetchArena]);

  const filtered = useMemo(() => {
    const list = regionFilter === 'ALL' ? models : models.filter((m) => m.region === regionFilter);
    return limit ? list.slice(0, limit) : list;
  }, [models, regionFilter, limit]);

  const chinaHighlight = models.find((m) => m.slug === 'kimi-k3');

  return (
    <section className={`w-full bg-[#020202] ${compact ? 'py-8' : 'py-12'} border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-4 px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] text-left">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400">
            {ARENA_SCORE_LABEL}
          </p>
          <p className="text-[8px] sm:text-[9px] text-gray-500 mt-0.5 uppercase tracking-wide">
            NO es Elo LMSYS / Arena.ai oficial · Variantes Cyber/Lite no son ranking de inteligencia general
          </p>
        </div>

        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 border-l-4 border-amber-500 pl-4 sm:pl-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={14} className="text-amber-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">HAWKIN Arena</span>
                {lastUpdated && !fetchError && (
                  <span className="text-[9px] font-bold text-gray-600 uppercase">
                    Actualizado: {formatTimeHHMM(lastUpdated)}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white">
                Ranking editorial <span className="text-amber-400">frontier</span>
              </h2>
              <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-[0.2em]">
                {ARENA_SCORE_LABEL}
              </p>
              <p className="text-[8px] text-amber-500/70 mt-1 font-bold uppercase tracking-widest">
                NO es Elo LMSYS / Arena.ai oficial
              </p>
            </div>
            {!loading && (
              <button
                onClick={() => fetchArena()}
                className="self-start flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-amber-400"
              >
                <RefreshCw size={12} /> Actualizar
              </button>
            )}
          </div>
        )}

        {!compact && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(['ALL', 'USA', 'CN', 'EU'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                  regionFilter === r
                    ? r === 'CN'
                      ? 'bg-red-500/20 border-red-500/40 text-red-300'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'border-white/10 text-gray-600 hover:text-white'
                }`}
              >
                {r === 'ALL' ? 'Global' : r === 'CN' ? '🇨🇳 China' : r === 'EU' ? '🇪🇺 Europa' : '🇺🇸 USA'}
              </button>
            ))}
          </div>
        )}

        {!compact && regionFilter === 'CN' && chinaHighlight && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-left">
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">China Front · Kimi K3</p>
            <p className="text-xs text-gray-400">
              Batalla open-weights: <strong className="text-white">{chinaHighlight.name}</strong> vs DeepSeek —{' '}
              {chinaHighlight.debate.slice(0, 140)}…
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12 gap-3 text-gray-600">
            <LoaderCircle className="animate-spin text-amber-500" size={22} />
            <span className="text-xs uppercase tracking-widest font-bold">Cargando Arena…</span>
          </div>
        )}

        {!loading && fetchError && (
          <div className="py-10 text-center border border-white/5 rounded-2xl">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sin datos nuevos</p>
          </div>
        )}

        {!loading && !fetchError && filtered.length > 0 && (
          <>
            <div className="hidden sm:grid sm:grid-cols-[2rem_1fr_auto_auto_auto_auto] gap-2 px-3 py-2 text-[8px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
              <span>#</span>
              <span>Modelo</span>
              <span className="text-center">Región</span>
              <span className="text-right">Index</span>
              <span className="text-right w-12">24h</span>
              <span className="text-right w-12">7d</span>
            </div>

            <ul className="space-y-1">
              {filtered.map((model) => {
                const isExpanded = expandedSlug === model.slug;
                const isTop = model.rank === 1;

                return (
                  <li
                    key={model.slug}
                    className={`border rounded-xl overflow-hidden transition-colors ${
                      isTop
                        ? 'border-amber-500/30 bg-amber-500/[0.04]'
                        : 'border-white/5 bg-white/[0.02] hover:border-amber-500/20'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedSlug(isExpanded ? null : model.slug)}
                      className="w-full flex flex-col sm:grid sm:grid-cols-[2rem_1fr_auto_auto_auto_auto] sm:items-center gap-2 sm:gap-3 px-3 py-3 min-h-[56px] text-left"
                    >
                      <span className={`text-sm font-black tabular-nums ${isTop ? 'text-amber-400' : 'text-gray-700'}`}>
                        #{model.rank}
                      </span>

                      <div className="flex items-center gap-2 min-w-0 sm:col-span-1">
                        <img src={model.logo} alt="" className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 opacity-90" />
                        <div className="min-w-0">
                          <p className="text-sm font-black uppercase italic text-white truncate">{model.name}</p>
                          <p className="text-[9px] text-gray-600 truncate">
                            {model.company}
                            <span
                              className={`ml-2 px-1.5 py-0.5 rounded text-[7px] font-black ${
                                model.license === 'OPEN'
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-gray-500/10 text-gray-400'
                              }`}
                            >
                              {model.license}
                            </span>
                            {model.needsVerification && (
                              <span className="ml-1 px-1.5 py-0.5 rounded text-[7px] font-black bg-amber-500/10 text-amber-400">
                                Verificar actualidad
                              </span>
                            )}
                            {model.releaseConfirmed && !model.needsVerification && (
                              <span className="ml-1 px-1.5 py-0.5 rounded text-[7px] font-black bg-cyan-500/10 text-cyan-400">
                                Release confirmado
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <span className="hidden sm:block text-center text-sm">{regionFlag(model.region)}</span>

                      <div className="flex sm:contents items-center justify-between gap-4 pl-10 sm:pl-0">
                        <span className="sm:hidden text-[9px] text-gray-600 flex items-center gap-1">
                          <Globe size={10} /> {model.region}
                        </span>
                        <div className="sm:text-right">
                          <p className="text-[8px] text-gray-600 uppercase sm:hidden">{model.scoreLabel}</p>
                          <p className={`text-lg sm:text-xl font-black tabular-nums italic ${isTop ? 'text-amber-400' : 'text-white'}`}>
                            {model.score}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-black tabular-nums w-12 text-right ${
                            model.change24h >= 0 ? 'text-cyan-400' : 'text-red-400'
                          }`}
                        >
                          {model.change24h >= 0 ? '+' : ''}
                          {model.change24h}%
                        </span>
                        <span
                          className={`text-xs font-black tabular-nums w-12 text-right hidden sm:block ${
                            model.change7d >= 0 ? 'text-cyan-400/70' : 'text-red-400/70'
                          }`}
                        >
                          {model.change7d >= 0 ? '+' : ''}
                          {model.change7d}%
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-gray-600 shrink-0 sm:col-span-1 sm:justify-self-end transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && <ModelDetail model={model} />}
                  </li>
                );
              })}
            </ul>

            {showViewAllLink && (
              <div className="mt-5 text-center">
                <Link
                  href="/arena"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 hover:text-amber-300"
                >
                  Ver Arena completa →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
