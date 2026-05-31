'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, UploadCloud, Clock, Trash2, Edit3, Globe, 
  Target, DollarSign, Loader2, ShieldCheck, X, Send, 
  ExternalLink, Calendar, LayoutDashboard, Plus, Sparkles,
  CircleAlert, CircleCheckBig, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageAds() {
  // Estado para creación/edición
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [placement, setPlacement] = useState('TOP_BANNER');
  const [status, setStatus] = useState('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estado de UI
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/b2b');
      const data = await res.json();
      if (Array.isArray(data)) setCampaigns(data);
    } catch (e) {
      console.error("Error fetching campaigns", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSave = async () => {
    if (!companyName || !bannerUrl || !placement) {
      setError('Socio, el nombre de empresa, banner y ubicación son obligatorios.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsUploading(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/b2b', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editId,
          companyName,
          bannerUrl,
          targetUrl,
          placement,
          status,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error en la inyección de pauta.');
      }

      setSuccess(editId ? 'Pauta actualizada con éxito.' : 'Nueva pauta inyectada al ecosistema.');
      resetForm();
      fetchCampaigns();
      setTimeout(() => setSuccess(''), 5000);
    } catch (e: any) {
      setError(e.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (ad: any) => {
    setEditId(ad.id);
    setCompanyName(ad.companyName);
    setBannerUrl(ad.bannerUrl);
    setTargetUrl(ad.targetUrl || '');
    setPlacement(ad.placement);
    setStatus(ad.status);
    setStartDate(ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '');
    setEndDate(ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas anular esta pauta publicitaria?')) return;

    try {
      const res = await fetch('/api/admin/b2b', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
      }
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setCompanyName('');
    setBannerUrl('');
    setTargetUrl('');
    setPlacement('TOP_BANNER');
    setStatus('ACTIVE');
    setStartDate('');
    setEndDate('');
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32">
      
      {/* CABECERA COMERCIAL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="text-blue-400" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">HAWKIN AD ENGINE v1.0</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Gestión de <span className="text-white">Pauta.</span></h1>
           <p className="text-gray-500 mt-2 font-light italic border-l-2 border-blue-500 pl-4">Control total sobre los activos publicitarios del imperio.</p>
        </div>
        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            className="px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all flex items-center gap-4 shadow-2xl shadow-blue-600/20"
          >
            <Plus size={18} /> INYECTAR NUEVO ANUNCIO
          </button>
        ) : (
          <button 
            onClick={resetForm}
            className="px-12 py-5 bg-white/5 border border-white/10 text-gray-400 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-4"
          >
            <X size={18} /> CANCELAR OPERACIÓN
          </button>
        )}
      </header>

      <AnimatePresence>
        {/* FORMULARIO DE INYECCIÓN DE PAUTA */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-12 border-blue-500/30 shadow-[0_0_80px_rgba(34,211,238,0.1)] space-y-12"
          >
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* CONFIGURACIÓN BÁSICA */}
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-3">
                         <Target size={16} /> Parámetros del Cliente
                      </h3>
                      <div>
                         <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Empresa o Socio B2B</label>
                         <input 
                            type="text" 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="EJ: NVIDIA CORP / TESLA..."
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xl font-black italic uppercase outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-900"
                         />
                      </div>
                      <div>
                         <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Ubicación Estratégica (Placement)</label>
                         <select 
                            value={placement}
                            onChange={(e) => setPlacement(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-white appearance-none"
                         >
                            <option value="TOP_BANNER">Top Banner (Cabecera Global)</option>
                            <option value="NEWS_FEED">News Feed (Pauta Nativa)</option>
                            <option value="SIDEBAR">Sidebar de Impacto (Lateral)</option>
                         </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Inicio de Campaña</label>
                         <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white outline-none focus:border-blue-500"
                         />
                      </div>
                      <div>
                         <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Fin de Campaña</label>
                         <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white outline-none focus:border-blue-500"
                         />
                      </div>
                   </div>
                </div>

                {/* ACTIVOS DIGITALES */}
                <div className="space-y-10">
                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400 flex items-center gap-3">
                         <Globe size={16} /> Activos Digitales
                      </h3>
                      <div>
                         <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">URL del Banner (Imagen 16:9)</label>
                         <input 
                            type="text" 
                            value={bannerUrl}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-bold text-white outline-none focus:border-cyan-500 transition-all"
                         />
                      </div>
                      <div>
                         <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">URL de Destino (Clic del Usuario)</label>
                         <input 
                            type="text" 
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://su-web.com/..."
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-bold text-white outline-none focus:border-cyan-500 transition-all"
                         />
                      </div>
                   </div>

                   <div className="w-full aspect-video bg-black rounded-[40px] border border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group">
                      {bannerUrl ? (
                         <img src={bannerUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Preview" />
                      ) : (
                         <div className="text-center space-y-3">
                            <UploadCloud className="text-gray-800 mx-auto" size={40} />
                            <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Vista previa del anuncio</p>
                         </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                </div>

             </div>

             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className={`p-4 rounded-2xl border ${status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'} flex items-center gap-3`}>
                      <Activity size={16} className={status === 'ACTIVE' ? 'animate-pulse' : ''} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
                   </div>
                   <button 
                     onClick={() => setStatus(status === 'ACTIVE' ? 'PENDING' : 'ACTIVE')}
                     className="text-[9px] font-black text-gray-500 uppercase hover:text-white transition-all underline"
                   >
                      Alternar Estado
                   </button>
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="w-full md:w-auto px-20 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : (editId ? <Sparkles size={20} /> : <Send size={20} />)}
                  {isProcessing ? 'PROCESANDO...' : (editId ? 'ACTUALIZAR CAMPAÑA' : 'ACTIVAR PAUTA EN VIVO')}
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-green-500/20 border-2 border-green-500/50 p-8 rounded-[40px] flex items-center gap-6 shadow-[0_0_100px_rgba(34,197,94,0.1)]">
             <CircleCheckBig className="text-green-500" size={32} />
             <p className="text-lg font-black text-white uppercase italic tracking-tighter">{success}</p>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-red-500/20 border-2 border-red-500/50 p-8 rounded-[40px] flex flex-col gap-2 shadow-[0_0_100px_rgba(239,68,68,0.1)]">
             <div className="flex items-center gap-6">
                <CircleAlert className="text-red-500" size={32} />
                <p className="text-lg font-black text-white uppercase italic tracking-tighter">Fallo en la Inyección Táctica</p>
             </div>
             <p className="text-red-400 text-xs font-bold uppercase tracking-widest border-t border-red-500/20 pt-4 mt-2">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ESTADÍSTICAS RÁPIDAS B2B */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Revenue Proyectado', value: 'S/ 24,900', icon: <DollarSign className="text-green-500" /> },
           { label: 'Campañas Activas', value: campaigns.filter(c => c.status === 'ACTIVE').length.toString(), icon: <Target className="text-blue-500" /> },
           { label: 'Impacto Global', value: '12.8M', icon: <Activity className="text-cyan-500" /> },
           { label: 'CTR Promedio', value: '4.8%', icon: <Sparkles className="text-purple-500" /> },
         ].map((stat, i) => (
           <div key={i} className="p-8 rounded-[40px] bg-[#080808] border border-white/5 flex items-center gap-6 hover:border-blue-500/20 transition-all group">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:rotate-12 transition-transform">{stat.icon}</div>
              <div>
                 <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none">{stat.label}</p>
                 <p className="text-2xl font-black text-white mt-1 italic uppercase tracking-tighter">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* LISTA DE CAMPAÑAS REALES */}
      <div className="space-y-8">
         <div className="flex items-center gap-4 border-l-4 border-blue-600 pl-8">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Archivo de <span className="text-gray-600">Publicidad.</span></h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                 <Loader2 className="animate-spin text-blue-500 mx-auto" size={40} />
              </div>
            ) : campaigns.length > 0 ? campaigns.map((ad) => (
              <motion.div 
                key={ad.id}
                layout
                className={`glass-card group relative p-0 overflow-hidden flex flex-col h-full transition-all duration-500 ${editId === ad.id ? 'border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.2)]' : 'border-white/5 hover:border-blue-500/40'}`}
              >
                 <div className="h-48 bg-gray-900 relative">
                    <img src={ad.bannerUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="text-[7px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase shadow-xl">{ad.placement}</span>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button 
                          onClick={() => handleEdit(ad)}
                          className="p-3 bg-white/10 hover:bg-blue-600 text-white rounded-xl transition-all border border-white/10"
                       >
                          <Edit3 size={16} />
                       </button>
                       <button 
                          onClick={() => handleDelete(ad.id)}
                          className="p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
                 <div className="p-8 flex-1 flex flex-col space-y-6">
                    <div className="flex justify-between items-start">
                       <h4 className="text-xl font-black uppercase italic leading-tight">{ad.companyName}</h4>
                       <div className={`w-2 h-2 rounded-full ${ad.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    </div>
                    
                    <div className="space-y-3">
                       <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} className="text-blue-500" /> {new Date(ad.startDate).toLocaleDateString()} — {new Date(ad.endDate).toLocaleDateString()}
                       </p>
                       {ad.targetUrl && (
                         <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 truncate">
                            <ExternalLink size={12} /> {ad.targetUrl}
                         </p>
                       )}
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                       <div>
                          <p className="text-[7px] font-black text-gray-700 uppercase tracking-widest mb-1">Clicks</p>
                          <p className="text-lg font-black text-white font-mono">{ad.clicks || 0}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[7px] font-black text-gray-700 uppercase tracking-widest mb-1">Status</p>
                          <p className={`text-xs font-black uppercase ${ad.status === 'ACTIVE' ? 'text-green-500' : 'text-yellow-500'}`}>{ad.status}</p>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center bg-white/[0.01] rounded-[60px] border border-dashed border-white/10">
                 <p className="text-xs font-black text-gray-700 uppercase tracking-widest">No hay pautas publicitarias registradas</p>
              </div>
            )}
         </div>
      </div>

      {/* MONITOR DE LOGS B2B */}
      <div className="mt-20 space-y-8">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-red-500 flex items-center gap-3">
               <ShieldCheck size={20} /> Registro de Operaciones Comerciales
            </h3>
            <button className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-all underline">Limpiar Terminal</button>
         </div>

         <div className="bg-black border border-red-900/30 rounded-[40px] p-10 font-mono text-[11px] leading-relaxed relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            <div className="space-y-2">
               <p className="text-gray-600">[{new Date().toISOString()}] INFO: Motor Publicitario HAWKIN Inicializado.</p>
               <p className="text-gray-400">[{new Date().toISOString()}] SUCCESS: Nodo de Base de Datos Sincronizado en Puerto 5432.</p>
               <p className="text-blue-400 animate-pulse">{'>'} Esperando comandos del Administrador...</p>
            </div>
         </div>
      </div>
    </div>
  );
}
