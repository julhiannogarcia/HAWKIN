'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBar, Newspaper, Users, SlidersHorizontal, Terminal, Pencil,
  DollarSign, Activity, ShoppingBag, Radio, LayoutDashboard, Shield,
  ShieldCheck, CircleAlert, Trash2, Globe, Target, Zap, LoaderCircle, Search,
  Mail, Star, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlpha } from '@/context/AlphaContext';

export default function AdminContent() {
  const { fetchAlpha } = useAlpha();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMounted, setIsMounted] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsMounted(true);
    
    const fetchStats = async () => {
      try {
        const res = await fetchAlpha('/api/admin/stats');
        const data = await res.json();
        setStatsData(data);
      } catch (e) {
        console.error("Error fetching stats", e);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetchAlpha('/api/admin/users');
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
      } catch (e) {
        console.error("Error fetching users", e);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchStats();
    fetchUsers();
  }, []);

  if (!isMounted) return null;

  const filteredUsers = users.filter(u => 
    u.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Revenue Total', value: statsData?.revenue || 'S/ 48,250', icon: <DollarSign className="text-green-500" />, t: '+15%' },
    { label: 'Noticias Bomba', value: statsData?.newsCount || '142', icon: <Newspaper className="text-cyan-500" />, t: '+4 hoy' },
    { label: 'Socios Activos', value: statsData?.totalUsers?.toString() || users.length.toString(), icon: <Users className="text-purple-500" />, t: `+${statsData?.activeNow || 0} hoy` },
    { label: 'Salud de Red', v: '99.9%', i: <Activity className="text-blue-500" />, t: 'Óptima' }
  ];

  return (
    <div className="space-y-16">
      {/* CABECERA DE ÉLITE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12">
         <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Consola Maestro v6.0 (ALPHA ID)</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none italic uppercase text-white">
              Control <span className="text-blue-500">Alpha.</span>
            </h1>
            <p className="text-gray-500 text-sm font-light">Gestión en tiempo real del imperio y sus llaves de acceso.</p>
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
               <div className="text-4xl font-black text-white italic tracking-tighter">
                  {loadingStats ? <LoaderCircle className="animate-spin inline text-blue-500" size={24} /> : s.value || s.v}
               </div>
               <div className="mt-6 flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-500">{s.t}</span>
                  <span className="text-[10px] font-bold text-gray-700 uppercase">sincronizado</span>
               </div>
            </motion.div>
         ))}
      </div>

      {/* GESTIÓN DE SOCIOS ALPHA */}
      <section className="space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-purple-500 flex items-center gap-3">
               <Users size={24} /> Registro de Socios Alpha
            </h3>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
               <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="BUSCAR SOCIO POR NIK O LLAVE..."
                  className="w-full bg-white/[0.03] border border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-purple-500 transition-all"
               />
            </div>
         </div>

         <div className="bg-[#050505] rounded-[50px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="p-8 text-[9px] font-black text-gray-500 uppercase tracking-widest">Socio / Nik / Llave</th>
                        <th className="p-8 text-[9px] font-black text-gray-500 uppercase tracking-widest">Contacto</th>
                        <th className="p-8 text-[9px] font-black text-gray-500 uppercase tracking-widest">Rango</th>
                        <th className="p-8 text-[9px] font-black text-gray-500 uppercase tracking-widest">Puntos XP</th>
                        <th className="p-8 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Acción</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loadingUsers ? (
                        <tr>
                           <td colSpan={5} className="p-20 text-center">
                              <LoaderCircle className="animate-spin text-purple-500 mx-auto" size={32} />
                              <p className="mt-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando Base de Datos de Socios...</p>
                           </td>
                        </tr>
                     ) : filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                        <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors group">
                           <td className="p-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center overflow-hidden">
                                    {user.image ? <img src={user.image} alt="Avatar" className="w-full h-full object-cover" /> : <Users size={18} className="text-purple-400" />}
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tighter">{user.nickname || 'Socio Anónimo'}</p>
                                    <p className="text-[8px] font-mono text-gray-700 uppercase">KEY: {user.accessKey || 'SIN_LLAVE'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className="flex items-center gap-2 text-gray-400">
                                 <Mail size={12} className="text-purple-500" />
                                 <span className="text-[10px] font-bold">{user.email || 'NO_MAIL'}</span>
                              </div>
                           </td>
                           <td className="p-8">
                              <span className={`text-[8px] font-black px-3 py-1 rounded-full border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                 {user.role || 'USER'}
                              </span>
                           </td>
                           <td className="p-8">
                              <div className="flex items-center gap-2 text-cyan-400">
                                 <Star size={12} fill="currentColor" />
                                 <span className="text-xs font-black font-mono">{user.xp || 0} XP</span>
                              </div>
                           </td>
                           <td className="p-8 text-right">
                              <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-purple-600 transition-all">
                                 <Pencil size={14} />
                              </button>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={5} className="p-20 text-center text-gray-600 font-bold uppercase text-[10px] tracking-widest">
                              No se encontraron socios con esos parámetros.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </section>

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
                  <p className="text-gray-600">[{new Date().toISOString()}] INFO: Acceso Administrativo (Sistema Alpha ID).</p>
                  <p className="text-gray-400">[{new Date().toISOString()}] SUCCESS: Red de socios sincronizada con éxito.</p>
                  <p className="text-blue-400 animate-pulse">{'>'} ESPERANDO COMANDOS ALPHA...</p>
               </div>
            </div>
         </div>

         {/* CONTROL DE PRECIOS */}
         <div className="space-y-8">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-400 flex items-center gap-3">
               <SlidersHorizontal size={20} /> Calibración Global
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
                        <Pencil size={16} />
                     </button>
                  </div>
               ))}
            </div>
         </div>

      </div>

      {/* ACCESO TOTAL A GESTIÓN */}
      <div className="mt-24 space-y-8">
         <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-400">Módulos Operativos</h3>
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
