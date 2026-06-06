'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Shield, User, Globe, LoaderCircle } from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function AuditLogs() {
  const { fetchAlpha } = useAlpha();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await fetchAlpha('/api/admin/audit');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) {
        console.error("Failed to load audit logs", e);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [fetchAlpha]);

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
               {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <LoaderCircle className="animate-spin text-gray-500 mx-auto" size={24} />
                      <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-bold">Obteniendo registros inmutables...</p>
                    </td>
                  </tr>
               ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      No hay registros auditables.
                    </td>
                  </tr>
               ) : logs.map((log, i) => (
                 <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-[10px] font-mono text-gray-600">{log.id.slice(0, 10)}...</td>
                    <td className="p-6 text-xs font-black text-white">{log.action}</td>
                    <td className="p-6 text-[10px] font-bold text-gray-400 flex items-center gap-2"><User size={12}/> {log.userName || log.userId || 'System'}</td>
                    <td className="p-6 text-[10px] font-mono text-gray-500 flex items-center gap-2"><Globe size={12}/> {log.ipAddress || 'Internal'}</td>
                    <td className="p-6 text-right text-[10px] text-gray-500 uppercase tracking-widest">{new Date(log.createdAt).toLocaleString()}</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
