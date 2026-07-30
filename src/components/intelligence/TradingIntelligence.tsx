'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Landmark, CircleCheck, LoaderCircle } from 'lucide-react';

type Asset = {
  symbol: string;
  name: string;
  price: string;
  trend: string;
  volatility: string;
  impact: string;
  confidence: number;
  src: string;
};

export default function TradingIntelligence() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/markets/live', { cache: 'no-store' });
        const data = await res.json();
        setAssets(data.assets || []);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 120_000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="w-full bg-[#020202] py-24 border-y border-white/5 relative text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 border-l-4 border-green-500 pl-8">
          <div className="flex items-center gap-3 mb-2">
            <Landmark size={16} className="text-green-500" />
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Financial Terminal • En vivo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
            Trading <span className="text-green-500">Intelligence.</span>
          </h2>
          <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Precios reales • CoinGecko + Mercados</p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoaderCircle className="animate-spin text-green-500" size={36} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <div key={asset.symbol} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.04] transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black italic text-white leading-none">{asset.symbol}</h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{asset.name}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-black ${Number(asset.trend) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Number(asset.trend) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {asset.trend}%
                  </div>
                </div>
                <div className="text-4xl font-black text-white italic tracking-tighter mb-8">{asset.price}</div>
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <div>
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Impacto en IA</span>
                    <p className="text-xs text-gray-400 font-light italic leading-snug mt-1">&quot;{asset.impact}&quot;</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[7px] font-black text-gray-700 uppercase flex items-center gap-1"><CircleCheck size={8}/> Fuente: {asset.src}</span>
                    <span className="text-[7px] font-black text-green-500 uppercase">Live</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
