'use client';

import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, RefreshCcw, UserMinus } from 'lucide-react';

export default function SubscriptionCenter() {
  const subs = [
    { plan: 'Enterprise', users: 142, revenue: '$6,390', growth: '+12%' },
    { plan: 'Pro Annual', users: 840, revenue: '$6,720', growth: '+5%' },
    { plan: 'Pro Monthly', users: 2450, revenue: '$1,140', growth: '-2%' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <CreditCard size={16} className="text-cyan-500" />
             <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">SaaS Metrics</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Subscription <span className="text-cyan-500">Center.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Métricas de Retención y Suscripciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {subs.map((s, i) => (
           <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-colors">
              <p className="text-xs font-black text-white uppercase tracking-widest mb-4">{s.plan}</p>
              <div className="flex justify-between items-end">
                 <div>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Usuarios Activos</span>
                    <div className="text-3xl font-black text-white italic">{s.users}</div>
                 </div>
                 <div className="text-right">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Est. MRR</span>
                    <div className="text-xl font-black text-green-400">{s.revenue}</div>
                 </div>
              </div>
              <div className={`mt-6 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${s.growth.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                 {s.growth.includes('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {s.growth} vs mes anterior
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
               <RefreshCcw size={16} className="text-blue-500" /> Próximas Renovaciones (7 Días)
            </h3>
            <div className="text-5xl font-black text-white italic tracking-tighter">142 <span className="text-xl text-gray-500">socios</span></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ingreso proyectado: <span className="text-green-400">$2,450.00</span></p>
         </div>

         <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
               <UserMinus size={16} className="text-red-500" /> Riesgo de Churn
            </h3>
            <div className="text-5xl font-black text-white italic tracking-tighter">15 <span className="text-xl text-gray-500">cuentas</span></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Impacto potencial: <span className="text-red-500">-$350.00 MRR</span></p>
         </div>
      </div>
    </div>
  );
}
