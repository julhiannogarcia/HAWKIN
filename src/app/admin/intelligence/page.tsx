'use client';

import React from 'react';
import { BrainCircuit, Database, Network, Search, FileText } from 'lucide-react';

export default function IntelligenceOps() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <BrainCircuit size={16} className="text-purple-500" />
             <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Titan Engine</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Intelligence <span className="text-purple-500">Ops.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Monitoreo del Agente Analista Central</p>
        </div>
        <button className="px-6 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-[10px] font-black uppercase hover:bg-purple-500 hover:text-white transition-all">
          Forzar Escaneo Global
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { l: 'Señales Procesadas (24h)', v: '14,204', i: <Database /> },
           { l: 'Reportes Generados', v: '124', i: <FileText /> },
           { l: 'Nodos RSS Activos', v: '24', i: <Network /> },
           { l: 'Eficiencia de IA', v: '98.4%', i: <BrainCircuit /> }
         ].map((m, i) => (
           <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group">
              <div>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.l}</p>
                 <p className="text-3xl font-black text-white italic">{m.v}</p>
              </div>
              <div className="text-purple-500 opacity-50 group-hover:opacity-100 transition-opacity">{m.i}</div>
           </div>
         ))}
      </div>

      <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
         <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
            <Search size={16} className="text-purple-500" /> Registro de Ejecución (Cron Logs)
         </h3>
         <div className="space-y-4 font-mono text-xs">
            {[
              { time: '14:00:01', msg: 'Analyst Agent iniciado. Extrayendo datos de 24 nodos RSS.', status: 'INFO' },
              { time: '14:00:15', msg: 'Se detectaron 452 nuevas señales en bruto. Iniciando deduplicación.', status: 'INFO' },
              { time: '14:00:18', msg: '12 señales pasaron el umbral de relevancia. Solicitando análisis a OpenAI.', status: 'INFO' },
              { time: '14:00:25', msg: 'Análisis completado. Generando Trust Scores y métricas de impacto.', status: 'SUCCESS' },
              { time: '14:00:26', msg: 'Base de datos PostgreSQL actualizada. Cache global invalidada.', status: 'SUCCESS' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-4 bg-black border border-white/5 rounded-xl">
                 <span className="text-gray-600">[{log.time}]</span>
                 <span className={`${log.status === 'SUCCESS' ? 'text-green-400' : 'text-purple-400'}`}>
                    {log.msg}
                 </span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
