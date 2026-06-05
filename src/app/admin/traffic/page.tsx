'use client';

import React from 'react';
import { Activity, Globe, Monitor, Clock, Users, ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react';

export default function TrafficCenter() {
  const kpis = [
    { title: 'Visitantes Activos', val: '4,102', trend: '+15%', icon: <Activity /> },
    { title: 'Tiempo Promedio', val: '04m 12s', trend: '+2%', icon: <Clock /> },
    { title: 'Usuarios Únicos (Hoy)', val: '24,891', trend: '+8%', icon: <Users /> },
    { title: 'Tasa de Rebote', val: '12.4%', trend: '-1.2%', icon: <Globe /> }
  ];

  return (
    <div className="space-y-12">
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Live Traffic <span className="text-blue-500">Center.</span></h1>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Monitoreo global en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {kpis.map((kpi, i) => (
           <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-blue-500/30 transition-colors group">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">{kpi.title}</p>
              <div className="text-4xl font-black text-white italic">{kpi.val}</div>
              <div className="mt-4 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 text-green-500">
                 <ArrowUpRight size={10} /> {kpi.trend} vs ayer
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 bg-white/[0.01] border border-white/5 rounded-[40px] h-[500px] flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-20 grayscale" />
           <div className="relative z-10 flex flex-col items-center">
              <Globe size={60} className="text-blue-500 animate-pulse mb-4" />
              <p className="text-xl font-black uppercase italic text-white tracking-widest">Mapa Mundial Activo</p>
              <p className="text-[10px] text-gray-400 mt-2">Simulando tráfico de 142 países</p>
           </div>
        </div>
        <div className="space-y-6">
          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[40px]">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2"><MapPin size={14} /> Top Regiones</h3>
             <div className="space-y-4">
                {[
                  { r: 'Silicon Valley, US', p: '35%' },
                  { r: 'Londres, UK', p: '20%' },
                  { r: 'Madrid, ES', p: '15%' },
                  { r: 'Lima, PE', p: '10%' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                     <span className="font-bold text-gray-300">{item.r}</span>
                     <span className="font-black text-blue-400">{item.p}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[40px]">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2"><Monitor size={14} /> Fuentes de Tráfico</h3>
             <div className="space-y-4">
                {[
                  { r: 'Búsqueda Directa', p: '45%' },
                  { r: 'Google (Orgánico)', p: '30%' },
                  { r: 'LinkedIn / X', p: '15%' },
                  { r: 'Referidos B2B', p: '10%' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                     <span className="font-bold text-gray-300">{item.r}</span>
                     <span className="font-black text-green-400">{item.p}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
