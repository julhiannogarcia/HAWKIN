'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, CloudUpload, Clock, Trash2, Pencil, Globe, 
  Target, DollarSign, LoaderCircle, ShieldCheck, X, Send, 
  ExternalLink, Calendar, LayoutDashboard, Plus, Sparkles,
  CircleAlert, CircleCheckBig, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdMediaPreview from '@/components/admin/AdMediaPreview';
import { validateBannerUrl, isVideoUrl } from '@/lib/adMediaUtils';
import { ALL_PLACEMENTS, PLACEMENT_ZONES } from '@/lib/adPlacements';

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
  const [isGlobal, setIsGlobal] = useState(false);
  const [targetCountry, setTargetCountry] = useState('PE');

  // Estado de UI
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [adStats, setAdStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [uploading, setUploading] = useState(false);

  const bannerValidation = bannerUrl ? validateBannerUrl(bannerUrl) : null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir');
      setBannerUrl(data.url);
      setSuccess('Archivo subido correctamente.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 4000);
    } finally {
      setUploading(false);
    }
  };

  const toggleCampaignStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/b2b', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchCampaigns();
    } catch (e) {
      console.error(e);
    }
  };

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
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setAdStats(data))
      .catch(() => {});
  }, []);

  const handlePublishAllZones = async () => {
    if (!companyName || !bannerUrl) {
      setError('Completa nombre y banner antes de publicar en las 3 zonas.');
      return;
    }
    const validation = validateBannerUrl(bannerUrl);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setIsUploading(true);
    try {
      for (const zone of ALL_PLACEMENTS) {
        await fetch('/api/admin/b2b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName,
            bannerUrl,
            targetUrl,
            placement: zone,
            status: 'ACTIVE',
            isGlobal,
            targetCountry: isGlobal ? null : targetCountry,
            startDate: startDate || new Date().toISOString().split('T')[0],
            endDate: endDate || undefined,
          }),
        });
      }
      setSuccess('Campaña publicada en las 3 zonas (Banner, Inline, Sidebar).');
      resetForm();
      fetchCampaigns();
      setTimeout(() => setSuccess(''), 5000);
    } catch (e: any) {
      setError(e.message || 'Error al publicar en múltiples zonas.');
    } finally {
      setIsUploading(false);
    }
  };

  const selectedZone = PLACEMENT_ZONES[placement];

  const handleSave = async () => {
    if (!companyName || !bannerUrl || !placement) {
      setError('Socio, el nombre de empresa, banner y ubicación son obligatorios.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const validation = validateBannerUrl(bannerUrl);
    if (!validation.valid) {
      setError(validation.message);
      setTimeout(() => setError(''), 4000);
      return;
    }

    if (status === 'ACTIVE' && !validation.valid) {
      setError('No puedes activar una campaña con URL incompatible. Corrige la vista previa primero.');
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
          isGlobal,
          targetCountry: isGlobal ? null : targetCountry,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || resData.message || 'Error en la inyección de pauta.');
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
    setIsGlobal(!!ad.isGlobal);
    setTargetCountry(ad.targetCountry || 'PE');
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
    setIsGlobal(false);
    setTargetCountry('PE');
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
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">HAWKIN AD ENGINE v2.0</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Gestión de <span className="text-white">Pauta.</span></h1>
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
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Ubicación</label>
                            <select 
                                value={placement}
                                onChange={(e) => setPlacement(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-white appearance-none"
                            >
                                <option value="TOP_BANNER">Plus Streaming</option>
                                <option value="NEWS_FEED">Native Radar</option>
                                <option value="SIDEBAR">Sidebar Táctico</option>
                            </select>
                            {selectedZone && (
                              <p className="text-[8px] text-gray-600 mt-2 uppercase tracking-widest">
                                Aparece en: {selectedZone.pages.join(', ')}
                              </p>
                            )}
                         </div>
                         <div>
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">Alcance</label>
                            <select 
                                value={isGlobal ? 'GLOBAL' : 'LOCAL'}
                                onChange={(e) => setIsGlobal(e.target.value === 'GLOBAL')}
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-white appearance-none"
                            >
                                <option value="LOCAL">Local (Por País)</option>
                                <option value="GLOBAL">Global (Todo el Mundo)</option>
                            </select>
                         </div>
                      </div>
                      {!isGlobal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                           <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">País Objetivo (ISO)</label>
                           <input 
                             type="text" 
                             value={targetCountry}
                             onChange={(e) => setTargetCountry(e.target.value.toUpperCase())}
                             placeholder="EJ: PE, MX, US..."
                             className="w-full bg-black border border-white/10 rounded-2xl p-4 text-xs font-black text-white focus:border-blue-500 outline-none"
                           />
                        </motion.div>
                      )}
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
                         <Globe size={16} /> Activos Digitales (Soporta Video)
                      </h3>
                      <div>
                         <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2 block">URL del Banner (JPG/PNG o YouTube/MP4)</label>
                         <input 
                            type="text" 
                            value={bannerUrl}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            placeholder="YouTube, Vimeo, MP4, JPG/PNG, Instagram..."
                            className="w-full bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-bold text-white outline-none focus:border-cyan-500 transition-all"
                         />
                         <label className="mt-3 flex items-center gap-3 cursor-pointer text-[9px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400">
                            <CloudUpload size={14} />
                            {uploading ? 'Subiendo...' : 'Subir archivo desde PC (JPG/PNG/MP4)'}
                            <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                         </label>
                         {bannerValidation && (
                           <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${bannerValidation.valid ? 'text-green-500' : 'text-red-400'}`}>
                             {bannerValidation.message}
                           </p>
                         )}
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

                   <AdMediaPreview url={bannerUrl} />
                </div>

             </div>

             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl border ${status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'} flex items-center gap-3`}>
                         <Activity size={16} className={status === 'ACTIVE' ? 'animate-pulse' : ''} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
                      </div>
                      <button 
                        onClick={() => setStatus(status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                        className="text-[9px] font-black text-gray-500 uppercase hover:text-white transition-all underline"
                      >
                         Alternar Estado
                      </button>
                   </div>
                   {!editId && (
                     <button
                       onClick={handlePublishAllZones}
                       disabled={isProcessing}
                       className="text-[9px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 underline text-left"
                     >
                       Publicar en las 3 zonas con un clic
                     </button>
                   )}
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="w-full md:w-auto px-20 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isProcessing ? <LoaderCircle className="animate-spin" size={20} /> : (editId ? <Sparkles size={20} /> : <Send size={20} />)}
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

      {/* ESTADÍSTICAS RÁPIDAS B2B (datos reales) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           {
             label: 'Ingresos por Ads',
             value: `USD $${(adStats?.adRevenue ?? 0).toLocaleString()}`,
             icon: <DollarSign className="text-green-500" />,
             real: 'Pagos B2B verificados',
           },
           {
             label: 'Campañas Activas',
             value: campaigns.filter((c) => c.status === 'ACTIVE' || c.status === 'PAID').length.toString(),
             icon: <Target className="text-blue-500" />,
             real: 'Desde tu base de datos',
           },
           {
             label: 'Impresiones Totales',
             value: campaigns.reduce((sum, c) => sum + (c.views || 0), 0).toLocaleString(),
             icon: <Activity className="text-cyan-500" />,
             real: 'Se cuentan al mostrar el anuncio',
           },
           {
             label: 'CTR Real',
             value: (() => {
               const views = campaigns.reduce((sum, c) => sum + (c.views || 0), 0);
               const clicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
               return views > 0 ? `${((clicks / views) * 100).toFixed(1)}%` : '0.0%';
             })(),
             icon: <Sparkles className="text-purple-500" />,
             real: 'Clics ÷ impresiones',
           },
         ].map((stat, i) => (
           <div key={i} className="p-8 rounded-[40px] bg-[#080808] border border-white/5 flex items-center gap-6 hover:border-blue-500/20 transition-all group">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:rotate-12 transition-transform">{stat.icon}</div>
              <div>
                 <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none">{stat.label}</p>
                 <p className="text-2xl font-black text-white mt-1 italic uppercase tracking-tighter">{stat.value}</p>
                 <p className="text-[7px] font-bold text-gray-600 uppercase tracking-widest mt-2">{stat.real}</p>
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
                 <LoaderCircle className="animate-spin text-blue-500 mx-auto" size={40} />
              </div>
            ) : campaigns.length > 0 ? campaigns.map((ad) => (
              <motion.div 
                key={ad.id}
                layout
                className={`glass-card group relative p-0 overflow-hidden flex flex-col h-full transition-all duration-500 ${editId === ad.id ? 'border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.2)]' : 'border-white/5 hover:border-blue-500/40'}`}
              >
                 <div className="h-48 bg-gray-900 relative overflow-hidden">
                    {isVideoUrl(ad.bannerUrl) ? (
                      <AdMediaPreview
                        url={ad.bannerUrl}
                        className="absolute inset-0 w-full h-full bg-black"
                        emptyLabel=""
                      />
                    ) : (
                      <img src={ad.bannerUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                    )}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       <span className="text-[7px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase shadow-xl">{ad.placement}</span>
                       <span className="text-[7px] font-black bg-gray-800 text-gray-300 px-3 py-1 rounded-full uppercase">
                         {(PLACEMENT_ZONES[ad.placement]?.pages || []).join(' · ')}
                       </span>
                       <span className={`text-[7px] font-black ${ad.isGlobal ? 'bg-purple-600' : 'bg-gray-700'} text-white px-3 py-1 rounded-full uppercase shadow-xl`}>
                          {ad.isGlobal ? 'GLOBAL' : `LOCAL (${ad.targetCountry})`}
                       </span>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button 
                          onClick={() => handleEdit(ad)}
                          className="p-3 bg-white/10 hover:bg-blue-600 text-white rounded-xl transition-all border border-white/10"
                       >
                          <Pencil size={16} />
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

                    <div className="mt-auto space-y-4 border-t border-white/5 pt-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[7px] font-black text-gray-700 uppercase tracking-widest mb-1">Vistas</p>
                             <p className="text-lg font-black text-white font-mono">{ad.views || 0}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[7px] font-black text-gray-700 uppercase tracking-widest mb-1">Clics</p>
                             <p className="text-lg font-black text-cyan-400 font-mono">{ad.clicks || 0}</p>
                          </div>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {ad.status === 'PAID' && (
                            <button onClick={() => toggleCampaignStatus(ad.id, 'ACTIVE')} className="px-3 py-1.5 bg-green-600/20 text-green-400 text-[8px] font-black uppercase rounded-full border border-green-500/30 hover:bg-green-600 hover:text-white transition-all">
                              Aprobar y Publicar
                            </button>
                          )}
                          {ad.status === 'ACTIVE' ? (
                            <button onClick={() => toggleCampaignStatus(ad.id, 'PAUSED')} className="px-3 py-1.5 bg-yellow-600/20 text-yellow-400 text-[8px] font-black uppercase rounded-full border border-yellow-500/30">
                              Pausar
                            </button>
                          ) : ad.status === 'PAUSED' || ad.status === 'PENDING' ? (
                            <button onClick={() => toggleCampaignStatus(ad.id, 'ACTIVE')} className="px-3 py-1.5 bg-green-600/20 text-green-400 text-[8px] font-black uppercase rounded-full border border-green-500/30">
                              Activar
                            </button>
                          ) : null}
                          <span className={`px-3 py-1.5 text-[8px] font-black uppercase rounded-full ${ad.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : ad.status === 'PAID' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-500'}`}>
                            {ad.status}
                          </span>
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
    </div>
  );
}
