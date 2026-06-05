'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Clock, Server, Lock } from 'lucide-react';

export default function SecurityShieldAdmin() {
  const events = [
    { type: 'AUTH_FAILED', ip: '192.168.1.105', location: 'Desconocido', time: 'Hace 5 min', status: 'BLOCKED' },
    { type: 'RATE_LIMIT', ip: '45.33.22.11', location: 'Moscú, RU', time: 'Hace 12 min', status: 'THROTTLED' },
    { type: 'API_KEY_ROTATED', ip: 'Sistema', location: 'Internal', time: 'Hace 2 horas', status: 'SUCCESS' },
    { type: 'DB_BACKUP', ip: 'Sistema', location: 'AWS US-East', time: 'Hace 6 horas', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <ShieldAlert size={16} className="text-red-500" />
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Security Command</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Shield <span className="text-red-500">Admin.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Centro de Operaciones de Ciberseguridad</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Nivel de Amenaza</p>
               <p className="text-3xl font-black text-white italic">BAJO</p>
            </div>
            <ShieldCheck size={40} className="text-red-500 opacity-50" />
         </div>
         <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Ataques Mitigados (24h)</p>
               <p className="text-3xl font-black text-white italic">1,402</p>
            </div>
            <Lock size={40} className="text-gray-600 opacity-50" />
         </div>
         <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
            <div>
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">IPs en Lista Negra</p>
               <p className="text-3xl font-black text-white italic">45</p>
            </div>
            <Server size={40} className="text-gray-600 opacity-50" />
         </div>
      </div>

      <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
         <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500" /> Registro de Seguridad Reciente
         </h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                     <th className="pb-4">Evento</th>
                     <th className="pb-4">IP / Origen</th>
                     <th className="pb-4">Ubicación</th>
                     <th className="pb-4">Hora</th>
                     <th className="pb-4 text-right">Estado</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {events.map((e, i) => (
                    <tr key={i}>
                       <td className="py-4 text-xs font-bold text-white">{e.type}</td>
                       <td className="py-4 text-[10px] text-gray-400 font-mono">{e.ip}</td>
                       <td className="py-4 text-[10px] text-gray-400 uppercase">{e.location}</td>
                       <td className="py-4 text-[10px] text-gray-500 uppercase flex items-center gap-2"><Clock size={10} /> {e.time}</td>
                       <td className="py-4 text-right">
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full ${e.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : e.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                             {e.status}
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
