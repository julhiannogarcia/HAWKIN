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
    <main className="min-h-screen bg-[#020202] text-white pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">HAWKIN V9 // OBSERVABILITY</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-16">
          System <span className="text-gray-700">Health.</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
           {SERVICES.map((s, i) => (
             <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-8">
                   <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{s.type}</span>
                   <div className={`w-3 h-3 rounded-full ${s.status === 'OPERATIONAL' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-white uppercase italic">{s.name}</h3>
                   <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${s.status === 'OPERATIONAL' ? 'text-green-400' : 'text-gray-500'}`}>{s.status}</span>
                      <span className="text-[10px] font-black text-cyan-500 tabular-nums">{s.latency}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="p-10 bg-green-500/5 border border-green-500/10 rounded-[50px] flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <ShieldCheck size={40} className="text-green-500" />
              <div>
                 <h4 className="text-2xl font-black uppercase italic text-white">Todos los Sistemas Nominales</h4>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Uptime: 99.99% // Último incidente: Hace 14 días</p>
              </div>
           </div>
           <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white hover:bg-white hover:text-black transition-all">
              Ver Logs Críticos
           </button>
        </div>

      </div>
    </main>
  );
}
