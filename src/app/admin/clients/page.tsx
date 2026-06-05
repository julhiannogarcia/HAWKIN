'use client';

import React from 'react';
import { Users, Search, Mail, Star, Shield, Ban } from 'lucide-react';

export default function ClientManagement() {
  const clients = [
    { id: 'usr_823', name: 'Alexander V.', email: 'alex@fund.com', plan: 'ENTERPRISE', status: 'ACTIVE', spend: '$4,500', joined: 'Hace 2 meses' },
    { id: 'usr_822', name: 'Sophia R.', email: 'sophia@tech.io', plan: 'PRO', status: 'ACTIVE', spend: '$499', joined: 'Hace 3 meses' },
    { id: 'usr_821', name: 'Michael T.', email: 'mike@bank.com', plan: 'PRO', status: 'CANCELED', spend: '$49', joined: 'Hace 6 meses' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <Users size={16} className="text-cyan-500" />
             <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">CRM</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Client <span className="text-cyan-500">Management.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Base de datos de Socios y Cuentas</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl w-full max-w-xl">
         <Search size={18} className="text-gray-500" />
         <input 
           type="text" 
           placeholder="Buscar por email, nombre o ID de transacción..." 
           className="bg-transparent border-none outline-none text-xs font-bold text-white w-full"
         />
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-white/5 bg-white/[0.02] text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  <th className="p-6">Socio</th>
                  <th className="p-6">Plan</th>
                  <th className="p-6">Total Spend</th>
                  <th className="p-6">Miembro desde</th>
                  <th className="p-6 text-right">Estado / Acción</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {clients.map((c, i) => (
                 <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 font-black">
                             {c.name[0]}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">{c.name}</p>
                             <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                               <Mail size={10} /> {c.email}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <span className={`text-[8px] font-black px-2 py-1 rounded border uppercase ${c.plan === 'ENTERPRISE' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                          {c.plan}
                       </span>
                    </td>
                    <td className="p-6 text-xs font-black text-green-400">{c.spend}</td>
                    <td className="p-6 text-[10px] text-gray-500 uppercase tracking-widest">{c.joined}</td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-4">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${c.status === 'ACTIVE' ? 'text-green-500' : 'text-gray-500'}`}>
                             {c.status}
                          </span>
                          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                             <Shield size={14} />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
