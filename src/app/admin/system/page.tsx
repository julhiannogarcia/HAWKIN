'use client';

import React from 'react';
import { ShieldCheck, Database, Server, Zap, Clock, Cpu, Cloud, Globe } from 'lucide-react';

export default function SystemHealth() {
  const SERVICES = [
    { name: 'PostgreSQL Core', status: 'OPERATIONAL', latency: '12ms', type: 'DATABASE' },
    { name: 'OpenAI API (Titan Engine)', status: 'OPERATIONAL', latency: '450ms', type: 'AI' },
    { name: 'Vercel Edge Cache', status: 'OPERATIONAL', latency: '2ms', type: 'INFRASTRUCTURE' },
    { name: 'Global RSS Feeds', status: 'OPERATIONAL', latency: '120ms', type: 'SCRAPING' },
    { name: 'PayPal Webhooks', status: 'OPERATIONAL', latency: '45ms', type: 'PAYMENTS' },
    { name: 'Background Analyst Agent', status: 'SLEEPING', latency: '--', type: 'CRON_JOB' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
             <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Observability</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             System <span className="text-green-500">Health.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Monitoreo de Infraestructura Global</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {SERVICES.map((s, i) => (
           <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col justify-between hover:border-green-500/30 transition-colors">
              <div className="flex items-center justify-between mb-8">
                 <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{s.type}</span>
                 <div className={`w-3 h-3 rounded-full ${s.status === 'OPERATIONAL' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{s.name}</h3>
                 <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${s.status === 'OPERATIONAL' ? 'text-green-400' : 'text-red-500'}`}>{s.status}</span>
                    <span className="text-[9px] font-black text-cyan-500 tabular-nums">{s.latency}</span>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <div className="p-10 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
               <ShieldCheck size={32} />
            </div>
            <div>
               <h4 className="text-2xl font-black uppercase italic text-white tracking-tighter">Sistemas Nominales</h4>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Uptime: 99.99% // Último incidente: Hace 14 días</p>
            </div>
         </div>
         <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white hover:text-black transition-all">
            Ver Logs Críticos
         </button>
      </div>

    </div>
  );
}
