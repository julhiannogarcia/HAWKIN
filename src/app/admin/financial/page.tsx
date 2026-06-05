'use client';

import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, CreditCard, Download } from 'lucide-react';

export default function FinancialCenter() {
  const transactions = [
    { id: 'TXN-9021', user: 'corp@tech.com', amount: '$4,500.00', plan: 'Enterprise Annual', date: 'Hoy', status: 'PAID' },
    { id: 'TXN-9020', user: 'investor@fund.com', amount: '$499.00', plan: 'Pro Annual', date: 'Hoy', status: 'PAID' },
    { id: 'TXN-9019', user: 'analyst@bank.com', amount: '$49.00', plan: 'Pro Monthly', date: 'Ayer', status: 'PAID' },
    { id: 'TXN-9018', user: 'unknown@mail.com', amount: '$49.00', plan: 'Pro Monthly', date: 'Ayer', status: 'FAILED' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <DollarSign size={16} className="text-green-500" />
             <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Financial Hub</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Financial <span className="text-green-500">Center.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Flujo de Caja y Transacciones</p>
        </div>
        <button className="px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-green-500 hover:text-black transition-all">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">MRR (Ingreso Mensual)</p>
            <div className="text-5xl font-black text-white italic tracking-tighter">$14,250</div>
            <div className="mt-4 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 text-green-500">
               <ArrowUpRight size={10} /> +15.4% vs mes anterior
            </div>
         </div>
         <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Net Revenue (YTD)</p>
            <div className="text-4xl font-black text-white italic tracking-tighter">$125,400</div>
         </div>
         <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Churn Rate</p>
            <div className="text-4xl font-black text-white italic tracking-tighter">2.1%</div>
            <div className="mt-4 text-[9px] font-bold uppercase tracking-widest text-green-500">
               Saludable
            </div>
         </div>
      </div>

      <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
         <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
            <CreditCard size={16} className="text-green-500" /> Transacciones Recientes (Validación Webhook)
         </h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                     <th className="pb-4">TXN ID</th>
                     <th className="pb-4">Usuario</th>
                     <th className="pb-4">Plan</th>
                     <th className="pb-4">Monto</th>
                     <th className="pb-4">Fecha</th>
                     <th className="pb-4 text-right">Estado</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {transactions.map((t, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                       <td className="py-4 text-[10px] text-gray-500 font-mono">{t.id}</td>
                       <td className="py-4 text-xs font-bold text-white">{t.user}</td>
                       <td className="py-4 text-[10px] text-gray-400 uppercase">{t.plan}</td>
                       <td className="py-4 text-sm font-black text-green-400">{t.amount}</td>
                       <td className="py-4 text-[10px] text-gray-500 uppercase">{t.date}</td>
                       <td className="py-4 text-right">
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full ${t.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                             {t.status}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
