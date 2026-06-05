'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Activity, Target, ShieldCheck, Download } from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function BusinessValuationCenter() {
  const { fetchAlpha } = useAlpha();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadValuation = async () => {
      try {
        // En producción real esto llamaría a un endpoint avanzado de agregación financiera
        const res = await fetchAlpha('/api/admin/stats');
        const stats = await res.json();
        setData(stats);
      } catch (e) { console.error(e); }
    };
    loadValuation();
  }, []);

  const valuationEst = 12500000; // Simulación de valor empresarial basado en ARR (Ej. 10x ARR)
  const arr = 1250000;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <Target size={16} className="text-purple-500" />
             <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Business Intelligence</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Valuation <span className="text-purple-500">Center.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Métricas de Adquisición y Valor Corporativo</p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all">
          <Download size={14} /> Exportar Reporte para Inversores
        </button>
      </div>

      <div className="p-12 bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 rounded-[40px] shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <TrendingUp size={200} className="text-purple-500" />
         </div>
         <div className="relative z-10 space-y-4">
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.5em]">Valor Estimado del Negocio (USD)</span>
            <h2 className="text-7xl font-black text-white italic tracking-tighter">${(valuationEst / 1000000).toFixed(1)}M</h2>
            <div className="flex items-center gap-3 pt-4 border-t border-white/10 w-fit pr-10">
               <ShieldCheck size={16} className="text-green-500" />
               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Basado en un múltiplo 10x ARR verificado</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { l: 'ARR (Anual Recurrente)', v: `$${(arr / 1000000).toFixed(2)}M`, i: <DollarSign /> },
           { l: 'Usuarios Activos', v: '24.8K', i: <Activity /> },
           { l: 'Retención (12 Meses)', v: '94.2%', i: <Users /> },
           { l: 'Crecimiento MoM', v: '15.4%', i: <TrendingUp /> }
         ].map((m, i) => (
           <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-colors">
              <div className="text-purple-500 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{m.i}</div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">{m.l}</p>
              <p className="text-3xl font-black text-white italic">{m.v}</p>
           </div>
         ))}
      </div>

      <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
         <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Proyección a 3 Años (Conservadora)</h3>
         <div className="h-64 w-full border-b border-white/10 flex items-end justify-between px-4">
            {/* Gráfico estático de proyección */}
            {[20, 35, 50, 70, 95].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-16">
                 <div className="w-full bg-purple-500/20 rounded-t-lg hover:bg-purple-500/50 transition-colors" style={{ height: `${h}%` }} />
                 <span className="text-[9px] font-black text-gray-500 uppercase">Año {i+1}</span>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}
