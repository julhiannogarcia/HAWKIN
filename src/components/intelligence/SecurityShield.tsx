'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, Activity, Globe, Lock, TriangleAlert, Clock } from 'lucide-react';

const ALERTS = [
  { id: 1, title: 'Vulnerabilidad Zero-Day en Protocolos de Auth', company: 'Multiples', risk: 'CRITICAL', impact: 'Pérdida de control de sesiones', status: 'ACTIVE', source: 'CISA', trust: 98, date: 'Hace 2 horas' },
  { id: 2, title: 'Inyección de Prompts en LLMs de Servicio al Cliente', company: 'Varios SaaS', risk: 'HIGH', impact: 'Filtración de datos internos', status: 'MITIGATING', source: 'OWASP', trust: 92, date: 'Hace 5 horas' },
  { id: 3, title: 'Regulación UE contra Modelos > 100T Parámetros', company: 'Gigantes IA', risk: 'MEDIUM', impact: 'Retraso de lanzamientos en Europa', status: 'WATCHING', source: 'Reuters', trust: 99, date: 'Ayer' },
];

export default function SecurityShield() {
  return (
    <section className="w-full bg-[#050505] py-24 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 text-left">
        
        <div className="mb-12 border-l-4 border-red-600 pl-8">
           <div className="flex items-center gap-3 mb-2">
             <ShieldAlert size={16} className="text-red-500" />
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Global Risk Center</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
              Security <span className="text-red-600">Shield.</span>
           </h2>
           <p className="text-gray-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em]">Monitoreo de Ciberseguridad y Riesgos Regulatorios</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALERTS.map((alert) => (
            <div key={alert.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-red-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[8px] font-black px-3 py-1 rounded-full ${
                  alert.risk === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' : 
                  alert.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-500'
                } uppercase tracking-widest`}>
                  {alert.risk} RISK
                </span>
                <span className="text-[8px] font-bold text-gray-600 uppercase flex items-center gap-1"><Clock size={10}/> {alert.date}</span>
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">{alert.title}</h3>
              <div className="space-y-4">
                 <div>
                   <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Impacto Potencial</p>
                   <p className="text-xs text-gray-300 font-light">{alert.impact}</p>
                 </div>
                 <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[7px] font-black text-gray-600 uppercase">Fuente Validada</span>
                       <span className="text-[10px] font-black text-cyan-400">{alert.source}</span>
                    </div>
                    <div className="flex flex-col text-right">
                       <span className="text-[7px] font-black text-gray-600 uppercase">Trust Score</span>
                       <span className="text-[10px] font-black text-green-500">{alert.trust}%</span>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
