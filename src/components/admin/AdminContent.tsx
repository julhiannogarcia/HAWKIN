'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Newspaper, Users, Sliders, Terminal, Edit3,
  DollarSign, Activity, ShoppingBag, Radio, Layout, Shield
} from 'lucide-react';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* CABECERA SIMPLE */}
        <div className="flex justify-between items-center border-b border-white/10 pb-8">
           <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">Panel Maestro v4.0</h1>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Acceso Alpha Sincronizado</p>
           </div>
           <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 border border-white/20 rounded-full text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
           >
             Volver al Inicio
           </button>
        </div>

        {/* NAVEGACIÓN SIMPLE */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
           {[
             { id: 'overview', label: 'Resumen', icon: <BarChart3 size={14} /> },
             { id: 'pricing', label: 'Precios', icon: <Sliders size={14} /> },
             { id: 'content', label: 'Contenido', icon: <Edit3 size={14} /> },
             { id: 'system', label: 'Sistema', icon: <Terminal size={14} /> }
           ].map((tab) => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}
             >
                {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* CONTENIDO DINÁMICO BLINDADO */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 min-h-[400px]">
           {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { l: 'Revenue', v: 'S/ 48,250', i: <DollarSign /> },
                   { l: 'Noticias', v: '142', i: <Newspaper /> },
                   { l: 'Socios', v: '3,842', i: <Users /> },
                   { l: 'Uptime', v: '99.9%', i: <Activity /> }
                 ].map((s, idx) => (
                    <div key={idx} className="p-8 rounded-3xl bg-black border border-white/10">
                       <div className="text-blue-500 mb-4">{s.i}</div>
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{s.l}</p>
                       <p className="text-3xl font-black mt-1 italic">{s.v}</p>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'pricing' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { t: 'Plus', p: 999, i: <Radio /> },
                   { t: 'Sidebar', p: 699, i: <Layout /> },
                   { t: 'Nativo', p: 399, i: <ShoppingBag /> }
                 ].map((p, idx) => (
                    <div key={idx} className="p-10 rounded-3xl bg-black border border-white/10 space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="text-blue-500">{p.i}</div>
                          <p className="font-black uppercase italic">{p.t}</p>
                       </div>
                       <p className="text-4xl font-black text-blue-500">S/{p.p}</p>
                       <button className="w-full py-4 bg-white/5 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase transition-all">Calibrar</button>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'content' && (
              <div className="space-y-4">
                 <h3 className="text-xl font-black uppercase italic mb-6">Últimas Noticias</h3>
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center p-6 bg-black border border-white/10 rounded-2xl">
                       <p className="text-sm font-bold uppercase tracking-tight">Reporte de Inteligencia #{i}</p>
                       <div className="flex gap-2">
                          <button className="p-3 bg-white/5 rounded-lg hover:text-blue-500"><Edit3 size={16} /></button>
                          <button className="p-3 bg-white/5 rounded-lg hover:text-red-500"><Terminal size={16} /></button>
                       </div>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'system' && (
              <div className="bg-black border border-white/20 p-8 rounded-3xl font-mono text-xs text-blue-400 space-y-2">
                 <p className="text-gray-600"># DIAGNÓSTICO MAESTRO...</p>
                 <p>SISTEMA: HAWKIN OS v4.0</p>
                 <p>DNS: SINCRONIZADO</p>
                 <p>PAYPAL: OPERATIVO</p>
                 <p>DATABASE: CONNECTED</p>
                 <p className="text-green-500 mt-4">SISTEMA ONLINE</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
