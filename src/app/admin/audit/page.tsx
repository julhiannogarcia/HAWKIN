'use client';

import React from 'react';
import { FileText, Shield, User, Globe } from 'lucide-react';

export default function AuditLogs() {
  const logs = [
    { id: 'log_901', action: 'CREATE_AD_CAMPAIGN', user: 'Julhianno G.', ip: '192.168.1.1', date: 'Hace 10 min' },
    { id: 'log_900', action: 'UPDATE_SYSTEM_SETTINGS', user: 'Julhianno G.', ip: '192.168.1.1', date: 'Hace 2 horas' },
    { id: 'log_899', action: 'DELETE_USER_ACCOUNT', user: 'System Auto', ip: 'Internal', date: 'Hace 5 horas' },
    { id: 'log_898', action: 'FORCE_GLOBAL_SCAN', user: 'Julhianno G.', ip: '192.168.1.1', date: 'Ayer' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <FileText size={16} className="text-gray-400" />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Audit <span className="text-gray-500">Logs.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Registro inmutable de acciones administrativas</p>
        </div>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="border-b border-white/5 bg-white/[0.02] text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  <th className="p-6">Log ID</th>
                  <th className="p-6">Acción</th>
                  <th className="p-6">Administrador</th>
                  <th className="p-6">Origen (IP)</th>
                  <th className="p-6 text-right">Fecha</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {logs.map((log, i) => (
                 <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-[10px] font-mono text-gray-600">{log.id}</td>
                    <td className="p-6 text-xs font-black text-white">{log.action}</td>
                    <td className="p-6 text-[10px] font-bold text-gray-400 flex items-center gap-2"><User size={12}/> {log.user}</td>
                    <td className="p-6 text-[10px] font-mono text-gray-500 flex items-center gap-2"><Globe size={12}/> {log.ip}</td>
                    <td className="p-6 text-right text-[10px] text-gray-500 uppercase tracking-widest">{log.date}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
