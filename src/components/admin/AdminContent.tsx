'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Shield, BarChart3, Newspaper, ShoppingBag, Users, 
  TrendingUp, ArrowUpRight, Bell, Settings, Lock, 
  Zap, Globe, DollarSign, Edit3, Sliders, Database,
  Cpu, Activity, Terminal, Trash2, CheckCircle, AlertCircle,
  Radio, Layout, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuración de pauta para el selector (Movido arriba para estabilidad)
const AD_PLANS = [
  { id: 'plus', title: 'Plus Streaming', pricePEN: 999 },
  { id: 'sidebar', title: 'Sidebar Académica', pricePEN: 699 },
  { id: 'native', title: 'Pauta Nativa Radar', pricePEN: 399 },
];

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
       <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const stats = [
    { label: 'Revenue Global', value: 'S/ 48,250', icon: <DollarSign className="text-green-500" />, trend: '+15.2%' },
    { label: 'Noticias Activas', value: '142', icon: <Newspaper className="text-cyan-500" />, trend: '+4 hoy' },
    { label: 'Socios Alpha', value: '3,842', icon: <Users className="text-purple-500" />, trend: '+112' },
    { label: 'Uptime Sistema', value: '99.98%', icon: <Activity className="text-blue-500" />, trend: 'Estable' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 w-full">
        
        {/* BARRA DE NAVEGACIÓN SUPERIOR DE ADMIN */}
        <div className="flex flex-wrap items-center gap-4 mb-16 bg-white/[0.02] border border-white/5 p-2 rounded-[30px] backdrop-blur-xl">
           {[
             { id: 'overview', label: 'Resumen Global', icon: <BarChart3 size={16} /> },
             { id: 'pricing', label: 'Calibración de Precios', icon: <Sliders size={16} /> },
             { id: 'content', label: 'Gestión de Contenido', icon: <Edit3 size={16} /> },
             { id: 'users', label: 'Control de Socios', icon: <Users size={16} /> },
             { id: 'system', label: 'Terminal de Sistema', icon: <Terminal size={16} /> }
           ].map((tab) => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
             >
                {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* CABECERA DINÁMICA */}
        <div className="mb-16 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Consola Maestro • Acceso Total</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase">
             {activeTab === 'overview' ? 'Operaciones Globales.' : 
              activeTab === 'pricing' ? 'Calibración de Mercado.' : 
              activeTab === 'content' ? 'Editor de Inteligencia.' : 
              activeTab === 'users' ? 'Gestión de Ciudadanos.' : 'Terminal Crítica.'}
          </h2>
        </div>

        {/* CONTENIDO SEGÚN PESTAÑA */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {stats.map((stat, i) => (
                  <div key={i} className="p-10 rounded-[45px] bg-white/[0.01] border border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">{stat.icon}</div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</p>
                    <div className="mt-6 flex items-center gap-2">
                       <span className="text-[10px] font-black text-blue-500">{stat.trend}</span>
                       <span className="text-[10px] font-bold text-gray-700 uppercase">vs mes anterior</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-400">Últimas Transacciones B2B</h3>
                    <div className="bg-white/[0.01] border border-white/5 rounded-[50px] overflow-x-auto">
                       <table className="w-full text-left min-w-[600px]">
                          <thead className="bg-white/[0.02] border-b border-white/5">
                             <tr>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500">Empresa</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500">Plan</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 text-right">Monto</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                             {[
                                { comp: 'NVIDIA Corp', plan: 'Plus Streaming', status: 'Activo', amount: 'S/ 999.00' },
                                { comp: 'Tesla Motors', plan: 'Nativo Radar', status: 'Pendiente', amount: 'S/ 399.00' },
                                { comp: 'OpenAI Labs', plan: 'Sidebar Academy', status: 'Finalizado', amount: 'S/ 699.00' },
                             ].map((row, i) => (
                               <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                  <td className="px-10 py-6 text-sm font-bold text-white uppercase italic">{row.comp}</td>
                                  <td className="px-10 py-6 text-xs text-gray-500 uppercase font-black">{row.plan}</td>
                                  <td className="px-10 py-6">
                                     <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${row.status === 'Activo' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                        {row.status}
                                     </span>
                                  </td>
                                  <td className="px-10 py-6 text-right font-black text-blue-500">{row.amount}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-400">Salud del Nodo</h3>
                    <div className="p-10 rounded-[50px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-8">
                       {[
                          { l: 'Memoria RAM', v: '42%', c: 'text-green-500' },
                          { l: 'Carga CPU', v: '18%', c: 'text-green-500' },
                          { l: 'Latencia Red', v: '24ms', c: 'text-blue-500' },
                          { l: 'Seguridad Shield', v: '100%', c: 'text-cyan-500' }
                       ].map((n, i) => (
                         <div key={i} className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{n.l}</span>
                            <span className={`text-[10px] font-black uppercase ${n.c}`}>{n.v}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {AD_PLANS.map((plan) => (
                <div key={plan.id} className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 space-y-8 shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
                         {plan.id === 'plus' ? <Radio /> : plan.id === 'sidebar' ? <Layout /> : <ShoppingBag />}
                      </div>
                      <h4 className="text-xl font-black uppercase italic leading-none">{plan.title}</h4>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Precio en Soles (PEN)</p>
                      <input type="number" defaultValue={plan.pricePEN} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-2xl font-black text-blue-500 focus:border-blue-500 outline-none transition-all" />
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Equivalente USD (Auto)</p>
                      <div className="w-full bg-white/5 rounded-2xl px-6 py-4 text-lg font-bold text-gray-400">$ {(plan.pricePEN / 3.82).toFixed(2)}</div>
                   </div>
                   <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-600/10">Actualizar Precio</button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} key="content" className="space-y-8">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
                  <div className="space-y-1 text-center md:text-left">
                     <h4 className="text-2xl font-black uppercase italic tracking-tighter">Gestor de Noticias Bomba</h4>
                     <p className="text-xs text-gray-500">Publica o edita reportes de inteligencia en el Radar.</p>
                  </div>
                  <button className="px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all">Nueva Publicación</button>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { t: 'NVIDIA revela Blackwell Ultra para finales de 2026', c: 'Inteligencia Artificial', date: 'Hace 2 horas', status: 'Publicado' },
                    { t: 'OpenAI prepara salida a bolsa (IPO) histórica', c: 'Finanzas Tech', date: 'Hace 5 horas', status: 'Publicado' },
                    { t: 'Rumor: Apple integrará chips de 2nm en iPhone 17', c: 'Hardware', date: 'Ayer', status: 'Borrador' },
                  ].map((news, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.01] border border-white/5 rounded-[30px] hover:bg-white/[0.03] transition-all group gap-6">
                       <div className="flex items-center gap-8 w-full md:w-auto">
                          <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform hidden md:block" />
                          <div>
                             <h5 className="text-lg font-bold uppercase italic leading-none mb-2">{news.t}</h5>
                             <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{news.c}</span>
                                <span className="text-[9px] text-gray-700">{news.date}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <button className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-all"><Edit3 size={18} /></button>
                          <button className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={18} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="system" className="space-y-8">
               <div className="bg-black border border-white/10 rounded-[40px] p-6 md:p-10 font-mono text-xs md:text-sm leading-relaxed relative overflow-hidden">
                  <div className="absolute top-4 right-8 flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/20" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="space-y-2 text-blue-400">
                     <p className="text-gray-500"># Iniciando Terminal Maestro HAWKIN v2.0...</p>
                     <p>... Check DNS: OK</p>
                     <p>... Check SSL Encryption: ACTIVE (Military Grade)</p>
                     <p>... Syncing PayPal Engine: SUCCESS [PEN_GATEWAY]</p>
                     <p>... Database Connection: 12ms [POSTGRES_SUPABASE]</p>
                     <p className="text-white pt-4">{'>'} system.diagnose_all()</p>
                     <p className="text-green-500"># TODOS LOS SISTEMAS OPERATIVOS</p>
                  </div>
                  <div className="mt-12 h-64 bg-white/[0.02] rounded-3xl p-8 border border-white/5 flex flex-col justify-end">
                     <div className="flex items-end gap-2 h-full">
                        {[40, 60, 30, 80, 45, 90, 20, 70, 55, 100, 30, 60, 40, 85, 25].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-600/30 rounded-t-lg border-t border-blue-400 animate-pulse" />
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
