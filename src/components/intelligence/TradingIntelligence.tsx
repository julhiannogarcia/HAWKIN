'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Landmark, Activity, CircleCheck } from 'lucide-react';

const ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$85,420.50', trend: '+4.2', volatility: 'HIGH', impact: 'Apetito de riesgo tecnológico al alza', confidence: 98, src: 'CoinDesk' },
  { symbol: 'NDX', name: 'NASDAQ 100', price: '21,150.80', trend: '+1.8', volatility: 'MEDIUM', impact: 'Flujo de capital masivo hacia Big Tech', confidence: 99, src: 'Bloomberg' },
  { symbol: 'NVDA', name: 'NVIDIA', price: '$145.20', trend: '+5.4', volatility: 'HIGH', impact: 'Soporte absoluto para infraestructura IA', confidence: 99, src: 'Reuters' },
  { symbol: 'GOLD', name: 'Oro (XAU)', price: '$2,450.10', trend: '-0.5', volatility: 'LOW', impact: 'Estabilidad económica base', confidence: 97, src: 'Refinitiv' }
];

export default function TradingIntelligence() {
  return (
    <section className="w-full bg-[#020202] py-24 border-y border-white/5 relative text-left">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-16 border-l-4 border-green-500 pl-8">
           <div className="flex items-center gap-3 mb-2">
             <Landmark size={16} className="text-green-500" />
             <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Financial Terminal</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
              Trading <span className="text-green-500">Intelligence.</span>
           </h2>
           <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">El Dinero Detrás de la IA Global</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSETS.map((asset, i) => (
            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.04] transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-black italic text-white leading-none">{asset.symbol}</h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{asset.name}</p>
                 </div>
                 <div className={`flex items-center gap-1 text-sm font-black ${Number(asset.trend) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Number(asset.trend) > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {asset.trend}%
                 </div>
              </div>
              <div className="text-4xl font-black text-white italic tracking-tighter mb-8">{asset.price}</div>
              <div className="space-y-4 border-t border-white/5 pt-6">
                 <div>
                    <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Impacto en IA</span>
                    <p className="text-xs text-gray-400 font-light italic leading-snug mt-1">"{asset.impact}"</p>
                 </div>
                 <div className="flex items-center justify-between pt-2">
                    <span className="text-[7px] font-black text-gray-700 uppercase flex items-center gap-1"><CircleCheck size={8}/> Fuente: {asset.src}</span>
                    <span className="text-[7px] font-black text-green-500 uppercase">Trust: {asset.confidence}%</span>
                 </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
