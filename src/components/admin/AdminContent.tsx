'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, CreditCard, DollarSign, Target, Newspaper, 
  Activity, ArrowUpRight, TrendingUp, BarChart, FileText
} from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function AdminContent() {
  const { fetchAlpha } = useAlpha();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simularemos la carga de métricas reales o conectaremos a la API existente
    const loadData = async () => {
      try {
        const res = await fetchAlpha('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const kpis = [
    { title: 'Usuarios Activos Hoy', val: '241', trend: '+12%', icon: <Activity size={20} /> },
    { title: 'Usuarios (30 Días)', val: '4,892', trend: '+5%', icon: <Users size={20} /> },
    { title: 'Suscripciones Activas', val: '1,154', trend: '+8%', icon: <CreditCard size={20} /> },
    { title: 'Nuevos Registros', val: '56', trend: '-2%', icon: <UserPlus size={20} /> },
    { title: 'MRR', val: '$14,250', trend: '+15%', icon: <TrendingUp size={20} /> },
    { title: 'Ingresos Hoy', val: '$840', trend: '+4%', icon: <DollarSign size={20} /> },
    { title: 'Campañas Activas', val: '12', trend: 'Estable', icon: <Target size={20} /> },
    { title: 'Señales Procesadas', val: '14,204', trend: '+20%', icon: <Newspaper size={20} /> },
  ];

  return (
    <div className="space-y-16">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Módulo de Control</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
             Executive <span className="text-blue-500">Overview.</span>
           </h1>
        </div>
        <div className="flex items-center gap-4 text-right">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Última Sincronización</span>
              <span className="text-[10px] font-bold text-white">Hace 2 minutos</span>
           </div>
           <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-colors">
             Exportar Reporte
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {kpis.map((kpi, i) => (
           <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
                 {kpi.icon}
              </div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">{kpi.title}</p>
              <div className="text-3xl font-black text-white italic tracking-tighter">{kpi.val}</div>
              <div className={`mt-4 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${kpi.trend.includes('+') ? 'text-green-500' : kpi.trend.includes('-') ? 'text-red-500' : 'text-gray-500'}`}>
                 {kpi.trend.includes('+') ? <ArrowUpRight size={10} /> : null} {kpi.trend} vs mes anterior
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
               <BarChart size={16} className="text-blue-500" /> Ingresos este Mes
            </h3>
            <div className="flex items-baseline gap-4">
               <span className="text-6xl font-black italic tracking-tighter text-white">$24,850</span>
               <span className="text-sm font-black text-green-500">+12.4%</span>
            </div>
            <div className="h-48 w-full bg-gradient-to-t from-blue-500/10 to-transparent border-b border-blue-500/30 flex items-end justify-between px-4 pb-2">
               {/* Gráfico simulado por ahora */}
               {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                 <div key={i} className="w-12 bg-blue-500/20 rounded-t-sm hover:bg-blue-500/40 transition-colors" style={{ height: `${h}%` }} />
               ))}
            </div>
         </div>

         <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
               <FileText size={16} className="text-purple-500" /> Auditoría Reciente
            </h3>
            <div className="space-y-4">
               {[
                 { action: 'Nueva campaña B2B activada', user: 'Julhianno Garcia', time: 'Hace 10 min' },
                 { action: 'Suscripción PRO procesada', user: 'Sistema', time: 'Hace 45 min' },
                 { action: 'Actualización HIS Score', user: 'Analyst Agent', time: 'Hace 2 horas' },
                 { action: 'Alerta de Seguridad Crítica', user: 'Shield', time: 'Hace 5 horas' }
               ].map((log, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div>
                       <p className="text-[10px] font-bold text-white uppercase">{log.action}</p>
                       <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{log.user}</p>
                    </div>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{log.time}</span>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-white transition-colors">
              Ver Registro Completo
            </button>
         </div>
      </div>
      
    </div>
  );
}
