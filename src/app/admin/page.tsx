'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Shield, 
  BarChart3, 
  Newspaper, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Bell, 
  Settings,
  Lock,
  Zap,
  Globe,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const stats = [
    { label: 'Ingresos B2B', value: 'S/ 12,450', icon: <DollarSign className="text-green-500" />, change: '+12.5%' },
    { label: 'Noticias Bomba', value: '24', icon: <Newspaper className="text-cyan-500" />, change: '+2 hoy' },
    { label: 'Socios Activos', value: '1,280', icon: <Users className="text-purple-500" />, change: '+48 hoy' },
    { label: 'Impacto Global', value: '98.2%', icon: <Globe className="text-blue-500" />, change: 'Óptimo' },
  ];

  const quickActions = [
    { title: 'Publicar Noticia', desc: 'Inyectar reporte al Radar', icon: <Newspaper size={20} />, href: '/admin/news', color: 'bg-cyan-500' },
    { title: 'Gestionar Pauta', desc: 'Controlar artes B2B', icon: <ShoppingBag size={20} />, href: '/admin/b2b', color: 'bg-blue-600' },
    { title: 'Métricas Academia', desc: 'Ver progreso de socios', icon: <BarChart3 size={20} />, href: '/admin/academy', color: 'bg-purple-600' },
    { title: 'Seguridad Shield', desc: 'Ver registros de acceso', icon: <Shield size={20} />, href: '/admin/security', color: 'bg-red-600' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 w-full">
        {/* CABECERA DE CONTROL */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Consola Maestro HAWKIN</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none italic uppercase">
              Dashboard <span className="text-white">Central.</span>
            </h1>
            <p className="text-gray-500 text-sm font-light">Bienvenido, Julhianno. El sistema está operando al 100% de su capacidad.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-3xl border border-white/5">
             <div className="w-10 h-10 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                <Shield size={20} />
             </div>
             <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">Nivel de Acceso</p>
                <p className="text-xs font-bold text-white uppercase mt-1 tracking-tighter">Administrador Alpha</p>
             </div>
          </div>
        </div>

        {/* MÉTRICAS EN TIEMPO REAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[35px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/[0.03] rounded-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded-lg">{stat.change}</span>
              </div>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">{stat.label}</p>
              <p className="text-3xl font-black text-white mt-2 tracking-tighter italic">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ACCIONES RÁPIDAS Y CONTROL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUMNA IZQUIERDA: ACCIONES */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-cyan-400 flex items-center gap-3">
               <Zap size={20} /> Comandos de Ejecución
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {quickActions.map((action, i) => (
                 <button 
                  key={i}
                  onClick={() => window.location.href = action.href}
                  className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5 text-left transition-all hover:bg-white/[0.03] hover:border-white/20 group flex flex-col justify-between h-56"
                 >
                    <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center text-white shadow-xl mb-4 group-hover:rotate-12 transition-transform`}>
                       {action.icon}
                    </div>
                    <div>
                       <h4 className="text-xl font-black uppercase italic tracking-tight leading-none mb-2">{action.title}</h4>
                       <p className="text-xs text-gray-500 font-light">{action.desc}</p>
                    </div>
                 </button>
               ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: ESTADO DEL SISTEMA */}
          <div className="space-y-8">
             <h3 className="text-xl font-black uppercase italic tracking-tighter text-cyan-400 flex items-center gap-3">
                <Settings size={20} /> Estado de Red
             </h3>
             <div className="p-10 rounded-[50px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-8">
                {[
                   { label: 'Servidor Vercel', status: 'Online', color: 'text-green-500' },
                   { label: 'Pasarela PayPal', status: 'Sincronizada', color: 'text-green-500' },
                   { label: 'Motor IA News', status: 'Activo', color: 'text-green-500' },
                   { label: 'Base de Datos', status: 'Conectada', color: 'text-cyan-500' }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</span>
                     <span className={`text-[10px] font-black uppercase ${s.color}`}>{s.status}</span>
                  </div>
                ))}
                
                <div className="pt-6">
                   <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none mb-2">Próxima Sincronización</p>
                      <p className="text-lg font-black text-white italic">00:14:25</p>
                   </div>
                </div>
             </div>

             {/* BLOQUE DE SEGURIDAD */}
             <div className="p-8 rounded-[40px] bg-red-600/5 border border-red-500/20 space-y-4">
                <div className="flex items-center gap-3 text-red-500">
                   <Lock size={16} />
                   <h4 className="text-xs font-black uppercase tracking-widest">Protocolo Shield</h4>
                </div>
                <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                   Todos los accesos están siendo grabados. El sistema de defensa anti-DDoS está en modo activo.
                </p>
             </div>
          </div>

        </div>

        {/* ACTIVIDAD RECIENTE (LOGS) */}
        <div className="mt-24 space-y-8">
           <h3 className="text-xl font-black uppercase italic tracking-tighter text-cyan-400">Actividad del Ecosistema</h3>
           <div className="bg-white/[0.01] border border-white/5 rounded-[50px] overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Evento</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Socio / ID</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Monto / Acción</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Tiempo</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {[
                       { event: 'Pago B2B Exitoso', id: 'Alpha-092', action: 'S/ 999.00', time: 'Hace 5 min', type: 'success' },
                       { event: 'Nuevo Registro', id: 'User-451', action: 'Academia', time: 'Hace 12 min', type: 'info' },
                       { event: 'Noticia Publicada', id: 'Admin', action: 'Tesla Rumor', time: 'Hace 45 min', type: 'admin' },
                       { event: 'Intento de Acceso', id: 'IP: 182.xx', action: 'Rechazado', time: 'Hace 1 hora', type: 'warning' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className={`w-1.5 h-1.5 rounded-full ${row.type === 'success' ? 'bg-green-500' : row.type === 'warning' ? 'bg-red-500' : 'bg-cyan-500'}`} />
                               <span className="text-xs font-bold text-white uppercase">{row.event}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-xs text-gray-400 font-mono">{row.id}</td>
                         <td className="px-8 py-6 text-xs font-black text-white">{row.action}</td>
                         <td className="px-8 py-6 text-xs text-gray-600 text-right font-light">{row.time}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
