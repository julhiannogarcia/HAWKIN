'use client';

import React from 'react';
import { UserCircle, Target, ShieldCheck, Zap, Activity, Award } from 'lucide-react';

export default function CeoDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <UserCircle size={16} className="text-blue-500" />
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Master Access</span>
           </div>
           <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
             Master <span className="text-blue-500">Dashboard.</span>
           </h1>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Visión Estratégica Global (HAWKIN)</p>
        </div>
      </div>

      <div className="p-12 bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <Award size={150} className="text-blue-500" />
         </div>
         <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-500/20 shrink-0 bg-gray-900 flex items-center justify-center">
            <UserCircle size={80} className="text-gray-700" />
         </div>
         <div className="space-y-4 z-10">
            <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Panel de Control Alpha</h2>
            <p className="text-gray-400 font-light leading-relaxed max-w-2xl">
               "El sistema opera a su máxima capacidad. El MRR ha crecido un 15.4% este mes y no se detectan vulnerabilidades críticas en el ecosistema. La fase V11 de HAWKIN está en completo despliegue."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
               <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><Target size={12} /> Objetivo Mensual: 92% Completado</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
               <Zap size={16} className="text-blue-500" /> Resumen Ejecutivo IA (Generado por Llama-3)
            </h3>
            <p className="text-xs text-gray-300 font-light leading-relaxed italic">
               "El interés en HAWKIN Academy y las pautas B2B está en su punto más alto. Recomendamos consolidar las asociaciones con fondos de capital de riesgo para acelerar la próxima ronda de valoración empresarial. Las señales indican un aumento de tráfico desde Silicon Valley."
            </p>
         </div>
         <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
               <Activity size={16} className="text-green-500" /> KPIs Principales
            </h3>
            <div className="space-y-4">
               {[
                 { label: 'Tasa de Conversión B2B', val: '8.4%', status: 'Excelente' },
                 { label: 'Crecimiento de Tráfico', val: '+24% YoY', status: 'Excelente' },
                 { label: 'Incidentes de Sistema', val: '0', status: 'Óptimo' }
               ].map((k, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{k.label}</span>
                    <div className="text-right">
                       <span className="text-sm font-black text-white">{k.val}</span>
                       <span className="block text-[7px] text-green-500 uppercase font-black">{k.status}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
