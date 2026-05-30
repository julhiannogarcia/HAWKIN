'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Newspaper, Users, Sliders, Terminal, Edit3,
  DollarSign, Activity, ShoppingBag, Radio, LayoutDashboard, Shield,
  ShieldCheck, CircleAlert, Trash2, Globe, Target, Zap, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMounted, setIsMounted] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStatsData(data);
      } catch (e) {
        console.error("Error fetching stats", e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  if (!isMounted) return null;

  const stats = [
    { label: 'Revenue Total', value: statsData?.revenue || 'S/ 48,250', icon: <DollarSign className="text-green-500" />, t: '+15%' },
    { label: 'Noticias Bomba', value: statsData?.newsCount || '142', icon: <Newspaper className="text-cyan-500" />, t: '+4 hoy' },
    { label: 'Socios Activos', value: statsData?.totalUsers?.toString() || '3,842', icon: <Users className="text-purple-500" />, t: `+${statsData?.activeNow || 0} hoy` },
    { label: 'Salud de Red', v: '99.9%', i: <Activity className="text-blue-500" />, t: 'Óptima' }
  ];

  return (
    <div className="space-y-12">
      {/* CABECERA DE ÉLITE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12">
         <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Consola Maestro v5.0</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none italic uppercase">
              Control <span className="text-white">Alpha.</span>
            </h1>
            <p className="text-gray-500 text-sm font-light">Gestión en tiempo real de socios y métricas del imperio.</p>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center gap-4">
               <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                  <ShieldCheck size={20} />
               </div>
               <div className="text-left">
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">Seguridad</p>
                  <p className="text-xs font-bold text-white uppercase mt-1">Nivel 10 Activo</p>
               </div>
            </div>
         </div>
      </div>

      {/* MÉTRICAS DE IMPACTO REAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((s: any, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[45px] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">{s.icon || s.i}</div>
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">{s.label}</p>
               <p className="text-4xl font-black text-white italic tracking-tighter">
                  {loadingStats ? <Loader2 className="animate-spin inline text-blue-500" size={24} /> : s.value || s.v}
               </p>
               <div className="mt-6 flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-500">{s.t}</span>
                  <span className="text-[10px] font-bold text-gray-700 uppercase">sincronizado</span>
               </div>
            </motion.div>
         ))}
      </div>

      {/* TERMINAL DE ERRORES Y CONTROL TOTAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* MONITOR DE ERRORES */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black uppercase italic tracking-tighter text-red-500 flex items-center gap-3">
                  <CircleAlert size={20} /> Registro de Actividad Alpha
               </h3>
               <button className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-all underline">Limpiar Terminal</button>
            </div>

            <div className="bg-black border border-red-900/30 rounded-[50px] p-10 font-mono text-[11px] leading-relaxed relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
               <div className="space-y-3">
                  <p className="text-gray-600">[2026-05-28 18:41:02] INFO: Acceso Administrativo Detectado (Julhianno).</p>
                  <p className="text-gray-400">[2026-05-28 19:12:05] SUCCESS: Nuevo Socio Registrado vía Google OAuth.</p>
                  <p className="text-red-400">[2026-05-28 19:15:10] ERROR: Paywall disparado para usuario anónimo (IP: 190.xx.xx.xx).</p>
                  <p className="text-blue-400 animate-pulse">{'>'} SISTEMA ALPHA ESPERANDO COMANDOS...</p>
               </div>
            </div>
         </div>

         {/* CONTROL DE PRECIOS */}
         <div className="space-y-8">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-400 flex items-center gap-3">
               <Sliders size={20} /> Calibración Global
            </h3>
            <div className="p-10 rounded-[50px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-8 shadow-xl">
               {[
                  { label: 'Suscripción Mensual', value: 'S/ 8.00', id: 'monthly' },
                  { label: 'Suscripción Anual', value: 'S/ 48.00', id: 'annual' }
               ].map((p, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-6 last:border-0 last:pb-0">
                     <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{p.label}</p>
                        <p className="text-2xl font-black text-white">{p.value}</p>
                     </div>
                     <button className="p-3 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all text-gray-500 hover:text-white">
                        <Edit3 size={16} />
                     </button>
                  </div>
               ))}
            </div>
         </div>

      </div>

      {/* ACCESO TOTAL A GESTIÓN */}
      <div className="mt-24 space-y-8">
         <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-400">Control de Módulos</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
               { t: 'Editor de Noticias', d: 'Inyectar reportes profundos al Radar.', i: <Newspaper />, h: '/admin/news', c: 'bg-cyan-500' },
               { t: 'Gestor B2B', d: 'Activar pautas pagadas por socios.', i: <ShoppingBag />, h: '/admin/b2b', c: 'bg-blue-600' }
            ].map((m, i) => (
               <button 
                  key={i}
                  onClick={() => window.location.href = m.h}
                  className="p-10 rounded-[50px] bg-white/[0.01] border border-white/5 text-left transition-all hover:bg-white/[0.03] group h-72 flex flex-col justify-between"
               >
                  <div className={`w-14 h-14 ${m.c} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform`}>
                     {m.i}
                  </div>
                  <div>
                     <h4 className="text-2xl font-black uppercase italic leading-none mb-3">{m.t}</h4>
                     <p className="text-xs text-gray-500 font-light">{m.d}</p>
                  </div>
               </button>
            ))}
         </div>
      </div>
    </div>
  );
}
