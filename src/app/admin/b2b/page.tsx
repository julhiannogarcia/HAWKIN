'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, UploadCloud, Clock, Trash2, Edit3, Globe, Target, DollarSign, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageAds() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Simulación de carga de campañas pagadas
    const mockCampaigns = [
      { id: '1', company: 'NVIDIA Corp', placement: 'TOP_BANNER', status: 'ACTIVE', startDate: '2026-05-20', endDate: '2026-06-20', amount: 'S/ 999.00' },
      { id: '2', company: 'Tesla Motors', placement: 'NEWS_FEED', status: 'PENDING', startDate: '2026-05-28', endDate: '2026-06-28', amount: 'S/ 399.00' },
      { id: '3', company: 'SpaceX', placement: 'SIDEBAR', status: 'COMPLETED', startDate: '2026-04-20', endDate: '2026-05-20', amount: 'S/ 699.00' },
    ];
    setCampaigns(mockCampaigns);
    setLoading(false);
  }, []);

  const handleManualUpload = () => {
     setIsUploading(true);
     setTimeout(() => setIsUploading(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="text-blue-400" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Gestión Comercial B2B</span>
           </div>
           <h1 className="text-4xl font-black tracking-tighter italic uppercase">Control de <span className="text-white">Pauta Pagada.</span></h1>
           <p className="text-gray-500 mt-2 font-light">Supervisa y activa campañas publicitarias para socios corporativos.</p>
        </div>
        <button 
          onClick={handleManualUpload}
          className="px-10 py-4 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20"
        >
          {isUploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
          {isUploading ? 'PROCESANDO...' : 'SUBIR ARTE MANUAL'}
        </button>
      </header>

      {/* ESTADÍSTICAS RÁPIDAS B2B */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Revenue Mensual', value: 'S/ 12,450', icon: <DollarSign className="text-green-500" /> },
           { label: 'Campañas Activas', value: '8', icon: <Target className="text-blue-500" /> },
           { label: 'Views Totales', value: '4.2M', icon: <Globe className="text-cyan-500" /> },
         ].map((stat, i) => (
           <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex items-center gap-6">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">{stat.icon}</div>
              <div>
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">{stat.label}</p>
                 <p className="text-2xl font-black text-white mt-1 italic uppercase tracking-tighter">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* LISTA DE CAMPAÑAS */}
      <div className="space-y-6">
         <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-400 flex items-center gap-3">
            <Clock size={20} /> Historial de Reservas
         </h3>
         
         <div className="bg-white/[0.01] border border-white/5 rounded-[50px] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
               <thead className="bg-white/[0.03] border-b border-white/5">
                  <tr>
                     <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Empresa / Socio</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Ubicación</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Estatus</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Inversión</th>
                     <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                     {campaigns.map((ad) => (
                        <motion.tr 
                          key={ad.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-white/[0.01] transition-colors group"
                        >
                           <td className="px-10 py-8">
                              <p className="text-sm font-black text-white uppercase italic">{ad.company}</p>
                              <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">ID: #{ad.id}</p>
                           </td>
                           <td className="px-10 py-8">
                              <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">{ad.placement}</span>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${ad.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : ad.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                                 <span className={`text-[10px] font-black ${ad.status === 'ACTIVE' ? 'text-green-500' : ad.status === 'PENDING' ? 'text-yellow-500' : 'text-gray-500'}`}>
                                    {ad.status}
                                 </span>
                              </div>
                           </td>
                           <td className="px-10 py-8 text-right font-black text-white italic">{ad.amount}</td>
                           <td className="px-10 py-8">
                              <div className="flex justify-center gap-3">
                                 <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"><Edit3 size={16} /></button>
                                 <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>

      {/* SECCIÓN DE ERRORES / LOGS TÉCNICOS */}
      <div className="mt-20 space-y-8">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-red-500 flex items-center gap-3">
               <ShieldCheck size={20} /> Terminal de Errores y Logs
            </h3>
            <button className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-all underline">Limpiar Registro</button>
         </div>

         <div className="bg-black border border-red-900/30 rounded-[40px] p-10 font-mono text-[11px] leading-relaxed relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            <div className="space-y-2">
               <p className="text-gray-600">[2026-05-28 18:41:02] INFO: Sistema Alpha Iniciado.</p>
               <p className="text-red-400 group flex items-center gap-4">
                  <span>[2026-05-28 18:41:05] ERROR: Fallo en carga de arte para Socio #451 (Tesla). Archivo demasiado grande.</span>
                  <button className="text-[9px] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">Corregir</button>
               </p>
               <p className="text-gray-400">[2026-05-28 18:41:10] SUCCESS: Pago B2B procesado (ID: x9k2l1).</p>
               <p className="text-yellow-400">[2026-05-28 18:41:15] WARN: Latencia detectada en API de Noticias (1200ms).</p>
               <p className="text-blue-400 animate-pulse">{'>'} Esperando nuevas instrucciones del Fundador...</p>
            </div>
         </div>
      </div>
    </div>
  );
}
