'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Building2,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react';

type HisCompany = {
  id: string;
  name: string;
  logo: string;
  ceo: string;
  his: number;
  confidence: number;
  change: number;
  why: string;
  weights: Record<string, number>;
};

type HISRankingProps = {
  limit?: number;
  showViewAllLink?: boolean;
};

function formatTimeHHMM(date: Date) {
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function CompanyLogo({ src, alt, compact }: { src: string; alt: string; compact?: boolean }) {
  const [error, setError] = useState(false);
  const size = compact ? 'w-10 h-10 rounded-xl p-1.5' : 'w-11 h-11 sm:w-12 sm:h-12 rounded-xl p-2';

  return (
    <div className={`${size} bg-white/5 flex items-center justify-center border border-white/5 shrink-0`}>
      {error ? (
        <Building2 size={16} className="text-gray-600" />
      ) : (
        <img src={src} alt={alt} className="w-full h-full object-contain opacity-90" onError={() => setError(true)} />
      )}
    </div>
  );
}

export default function HISRanking({ limit, showViewAllLink = false }: HISRankingProps) {
  const [companies, setCompanies] = useState<HisCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFormula, setShowFormula] = useState<string | null>(null);

  const fetchHis = useCallback(async () => {
    try {
      const res = await fetch('/api/intelligence/his', { cache: 'no-store' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!Array.isArray(data.companies) || data.companies.length === 0) {
        setFetchError(true);
        return;
      }
      setCompanies(data.companies);
      setLastUpdated(data.updatedAt ? new Date(data.updatedAt) : new Date());
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHis();
    const interval = setInterval(fetchHis, 120_000);
    return () => clearInterval(interval);
  }, [fetchHis]);

  const visible = limit ? companies.slice(0, limit) : companies;

  return (
    <section className="w-full bg-[#020202] py-12 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 border-l-4 border-cyan-500 pl-4 sm:pl-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-cyan-500 text-black text-[8px] font-black uppercase rounded">
                HIS Index
              </span>
              {lastUpdated && !fetchError && (
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  Actualizado: {formatTimeHHMM(lastUpdated)}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white">
              HAWKIN Intelligence <span className="text-cyan-400">Score</span>
            </h2>
            <p className="text-gray-600 mt-1 text-[9px] font-bold uppercase tracking-[0.35em]">
              Ranking desde noticias y mercados en vivo
            </p>
          </div>
          {!loading && (
            <button
              onClick={() => fetchHis()}
              className="self-start sm:self-auto flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <RefreshCw size={12} /> Actualizar
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-600 gap-3">
            <LoaderCircle className="animate-spin text-cyan-500" size={22} />
            <span className="text-xs uppercase tracking-widest font-bold">Calculando HIS…</span>
          </div>
        )}

        {!loading && fetchError && (
          <div className="py-12 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sin datos nuevos</p>
            <p className="text-[10px] text-gray-700 mt-2">El ranking se actualizará en el próximo ciclo (120s)</p>
          </div>
        )}

        {!loading && !fetchError && visible.length > 0 && (
          <>
            <div className="hidden sm:grid sm:grid-cols-[2rem_1fr_auto_auto] gap-3 px-3 py-2 text-[8px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5 mb-1">
              <span>#</span>
              <span>Empresa</span>
              <span className="text-right">HIS</span>
              <span className="text-right w-16">Δ</span>
            </div>

            <ul className="space-y-1">
              {visible.map((company, index) => {
                const isExpanded = expandedId === company.id;
                const isFormulaOpen = showFormula === company.id;

                return (
                  <li
                    key={company.id}
                    className="border border-white/5 rounded-xl sm:rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/20 transition-colors overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : company.id)}
                      className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 min-h-[56px] sm:min-h-[64px] text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-sm font-black text-gray-700 tabular-nums w-6 shrink-0">
                          #{index + 1}
                        </span>
                        <CompanyLogo src={company.logo} alt={company.name} compact />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black uppercase italic text-white truncate">{company.name}</p>
                          <p className="text-[9px] text-gray-600 uppercase tracking-wide truncate hidden sm:block">
                            CEO: {company.ceo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-9 sm:pl-0">
                        <div className="text-right">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest sm:hidden">HIS</p>
                          <p className="text-xl sm:text-2xl font-black italic tabular-nums text-white leading-none">
                            {company.his}
                          </p>
                          <p className="text-[8px] text-green-500/80 font-bold mt-0.5 hidden sm:block">
                            Conf. {company.confidence}%
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-0.5 text-xs font-black tabular-nums w-16 justify-end ${
                            company.change >= 0 ? 'text-cyan-400' : 'text-red-400'
                          }`}
                        >
                          {company.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {company.change > 0 ? '+' : ''}
                          {company.change}%
                        </div>
                        <ChevronDown
                          size={14}
                          className={`text-gray-600 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-3">
                        <div className="sm:hidden text-[9px] text-gray-600 uppercase">CEO: {company.ceo}</div>
                        <div>
                          <p className="text-[8px] font-black text-cyan-500/70 uppercase tracking-widest mb-1">
                            Why it matters
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{company.why}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowFormula(isFormulaOpen ? null : company.id)}
                          className="text-[9px] font-black uppercase tracking-widest text-cyan-500/60 hover:text-cyan-400 underline decoration-dotted"
                        >
                          {isFormulaOpen ? 'Ocultar fórmula HIS' : 'Ver fórmula HIS'}
                        </button>
                        {isFormulaOpen && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                            {Object.entries(company.weights).map(([key, weight]) => (
                              <div
                                key={key}
                                className="p-2 bg-black/40 border border-white/5 rounded-lg text-center"
                              >
                                <span className="text-[7px] font-black text-gray-600 uppercase block">{key}</span>
                                <span className="text-xs font-black text-cyan-500 tabular-nums">{weight}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {showViewAllLink && companies.length > (limit || 0) && (
              <div className="mt-6 text-center">
                <Link
                  href="/intelligence"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Ver ranking completo →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
