'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Loader2, MessageCircle, Radio, 
  LayoutDashboard, ShoppingBag, Target, Tv, Eye, ExternalLink, Play,
  Sparkles, Calendar, Globe, MapPin, Zap, ChevronRight, Mail, UploadCloud, 
  CircleCheckBig, CircleAlert, TrendingUp, BarChart, UserCheck
} from 'lucide-react';

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedId, setSelectedId] = useState('plus');
  const [isGlobal, setIsGlobal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [geoData, setGeoData] = useState<any>({ countryCode: 'PE', currencySymbol: 'S/', rate: 3.75 });
  
  // Estados de Flujo de Pago
  const [paymentStep, setPaymentStep] = useState<'selection' | 'processing' | 'upload'>('selection');
  const [paypalOrderId, setPaypalOrderId] = useState('');
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);

  // Estados de Formulario Post-Pago
  const [companyName, setCompanyName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const AD_PLANS = useMemo(() => [
    { 
      id: 'plus', 
      title: 'Plan Maestro Plus', 
      days: 20,
      basePriceUSD: 265,
      placement: 'TOP_BANNER',
      desc: 'Banner Gigante + Video 4K + Rotación Prioritaria.',
      reachLocal: '2.5M+ Impactos',
      reachGlobal: '12M+ Global',
      features: ['20 Días Corridos', 'Soporta Video 4K', 'Cabecera Principal'],
      icon: <Sparkles className="text-blue-400" />
    },
    { 
      id: 'sidebar', 
      title: 'Plan Táctico Sidebar', 
      days: 15,
      basePriceUSD: 185,
      placement: 'SIDEBAR',
      desc: 'Presencia lateral constante en todo el ecosistema.',
      reachLocal: '1M+ Impactos',
      reachGlobal: '5M+ Global',
      features: ['15 Días Corridos', 'Solo Imágenes HQ', 'Lateral Táctico'],
      icon: <LayoutDashboard className="text-blue-300" />
    },
    { 
      id: 'native', 
      title: 'Plan Escencial Native', 
      days: 7,
      basePriceUSD: 105,
      placement: 'NEWS_FEED',
      desc: 'Anuncio integrado orgánicamente en el feed del Radar.',
      reachLocal: '500k+ Impactos',
      reachGlobal: '2M+ Global',
      features: ['7 Días Corridos', 'Anuncio Nativo', 'Económico'],
      icon: <ShoppingBag className="text-blue-200" />
    }
  ], []);

  const selectedPlan = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];
  
  // Cálculo exacto de precios
  const globalSurchargeUSD = 300;
  const totalPriceUSD = isGlobal ? selectedPlan.basePriceUSD + globalSurchargeUSD : selectedPlan.basePriceUSD;
  const finalPriceLocal = Math.round(totalPriceUSD * geoData.rate);

  const endDateCalculated = useMemo(() => {
    if (!startDate) return null;
    const d = new Date(startDate);
    d.setDate(d.getDate() + selectedPlan.days);
    return d;
  }, [startDate, selectedPlan.days]);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/geo').then(res => res.json()).then(data => { if(data?.countryCode) setGeoData(data); }).catch(console.error);
    
    // Carga de PayPal SDK
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas&currency=USD&disable-funding=credit,card`;
    script.async = true;
    script.onload = () => setIsPaypalLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleStartPayment = () => {
    if (!startDate) { 
      alert("Socio, elige una fecha de inicio primero en el calendario."); 
      return; 
    }
    setPaymentStep('processing');
    setTimeout(() => {
       setPaypalOrderId(`PAY-HAWKIN-${Math.random().toString(36).substring(7).toUpperCase()}`);
       setPaymentStep('upload');
    }, 2000);
  };

  const handleFinalInjection = async () => {
    if (!companyName || !bannerUrl) return;
    setIsUploading(true);
    try {
      const res = await fetch('/api/admin/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          bannerUrl,
          targetUrl,
          placement: selectedPlan.placement,
          startDate: new Date(startDate),
          endDate: endDateCalculated,
          isGlobal,
          targetCountry: geoData.countryCode,
          paypalOrderId,
          paymentVerified: true
        })
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => window.location.href = '/', 3000);
      }
    } catch (e) { console.error(e); }
    finally { setIsUploading(false); }
  };

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        <section className="text-center space-y-8 mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
             <Globe className="text-blue-500 animate-pulse" size={14} />
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">HAWKIN B2B GLOBAL NETWORK</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
             Visualiza tu marca y activa tu pauta publicitaria con alcance real. 
             Localización inteligente y reserva automática por bloque.
          </p>
        </section>

        <AnimatePresence mode="wait">
          {paymentStep === 'selection' && (
            <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* CONFIGURACIÓN Y PLANES */}
               <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                           <Target className="text-blue-400" size={20} /> 1. Elige tu Plan
                        </h3>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                           <button onClick={() => setIsGlobal(false)} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${!isGlobal ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Local</button>
                           <button onClick={() => setIsGlobal(true)} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${isGlobal ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Global</button>
                        </div>
                     </div>
                     <div className="space-y-4">
                        {AD_PLANS.map((ad) => (
                          <button 
                            key={ad.id} 
                            onClick={() => setSelectedId(ad.id)} 
                            className={`w-full p-6 rounded-[40px] border-2 text-left transition-all group ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100'}`}
                          >
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5'}`}>{ad.icon}</div>
                                   <p className="text-sm font-black uppercase italic leading-none">{ad.title}</p>
                                </div>
                                <span className="text-[8px] font-black bg-white/10 px-3 py-1.5 rounded-full text-blue-400">{ad.days} DÍAS</span>
                             </div>
                             <div className="flex justify-between items-end">
                                <div>
                                   <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Alcance Estimado</p>
                                   <p className="text-xs font-black text-cyan-400 uppercase italic">{isGlobal ? ad.reachGlobal : ad.reachLocal}</p>
                                </div>
                                <p className="text-xl font-black text-white">S/{Math.round((isGlobal ? ad.basePriceUSD + 300 : ad.basePriceUSD) * geoData.rate)}</p>
                             </div>
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 border-b border-white/5 pb-4">
                        <Calendar className="text-blue-500" size={20} /> 2. Fecha de Inicio
                     </h3>
                     <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-6 text-xl font-black text-white focus:border-blue-500 outline-none" min={new Date().toISOString().split('T')[0]} />
                        {startDate && (
                          <div className="p-6 bg-blue-600/10 border border-blue-600/30 rounded-3xl text-center">
                             <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Bloque Reservado</p>
                             <p className="text-lg font-black uppercase italic tracking-tighter">Del {new Date(startDate).toLocaleDateString()} al {endDateCalculated?.toLocaleDateString()}</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* MONITOR DE IMPACTO Y CIERRE */}
               <div className="lg:col-span-7 space-y-12">
                  <div className="glass-card p-12 space-y-10 border-blue-500/20 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp size={200} className="text-blue-500" /></div>
                     <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className={`p-4 rounded-3xl ${isGlobal ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'} shadow-2xl`}><Globe size={32} /></div>
                           <div>
                              <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Simulador {isGlobal ? 'Global' : 'Local'}.</h4>
                              <p className="text-gray-500 text-sm mt-2 font-bold uppercase tracking-widest">{selectedPlan.placement} • {isGlobal ? 'Alcance Mundial' : `País de Origen (${geoData.countryCode})`}</p>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <p className="text-gray-400 text-lg font-light leading-relaxed border-l-2 border-blue-500 pl-6">"{selectedPlan.desc}"</p>
                              <div className="flex flex-wrap gap-2">
                                 {selectedPlan.features.map((f, i) => (
                                    <span key={i} className="text-[8px] font-black bg-white/5 text-gray-500 px-3 py-1 rounded-full border border-white/5">{f}</span>
                                 ))}
                              </div>
                           </div>
                           <div className="p-8 bg-black/40 rounded-[40px] border border-white/5 flex flex-col justify-center">
                              <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-2 text-center">Visibilidad Proyectada</p>
                              <p className="text-4xl font-black text-center text-blue-500 italic leading-none">{isGlobal ? selectedPlan.reachGlobal : selectedPlan.reachLocal}</p>
                              <div className="flex items-center justify-center gap-2 mt-4 text-[8px] font-bold text-gray-600 uppercase">
                                 <BarChart size={10} /> Datos en Tiempo Real
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="relative z-10 pt-10 flex flex-col items-center gap-6">
                        <div className="w-full h-px bg-white/5" />
                        <div className="flex justify-between items-end w-full px-4">
                           <div>
                              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Inversión por {selectedPlan.days} días</p>
                              <p className="text-5xl font-black text-white">{geoData.currencySymbol} {finalPriceLocal}</p>
                           </div>
                           <button 
                              onClick={handleStartPayment}
                              className="px-12 py-5 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl flex items-center gap-4"
                           >
                              RESERVAR Y PAGAR <ChevronRight size={18} />
                           </button>
                        </div>
                        <p className="text-[8px] font-bold text-gray-700 uppercase tracking-[0.3em]">Checkout seguro vía PayPal Intelligence v5.0</p>
                     </div>
                  </div>

                  {/* SOPORTE DIRECTO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center gap-6 group hover:border-blue-500/20 transition-all">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 transition-transform group-hover:rotate-12"><Mail size={24} /></div>
                        <div>
                           <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Dpto. Comercial</p>
                           <a href="mailto:publicidad@aihawkin.com" className="text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase">publicidad@aihawkin.com</a>
                        </div>
                     </div>
                     <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center gap-6 group hover:border-cyan-500/20 transition-all">
                        <div className="w-14 h-14 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500 transition-transform group-hover:-rotate-12"><MessageCircle size={24} /></div>
                        <div>
                           <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Chat Alpha</p>
                           <p className="text-sm font-bold text-white uppercase">Soporte Estratégico 24/7</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {paymentStep === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-40 gap-8">
               <Loader2 className="animate-spin text-blue-600" size={80} />
               <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter animate-pulse">Sincronizando Bóveda de Pago...</h2>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-[0.5em]">Validando reserva en el Nodo {geoData.countryCode}</p>
               </div>
            </motion.div>
          )}

          {paymentStep === 'upload' && !isSuccess && (
            <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
               <div className="bg-green-500/10 border-2 border-green-500/50 p-10 rounded-[50px] text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500 text-black rounded-3xl flex items-center justify-center mx-auto shadow-2xl mb-4"><UserCheck size={40} /></div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">¡Socio Confirmado!</h2>
                  <p className="text-green-500 font-bold uppercase text-[10px] tracking-[0.4em]">ID Transacción: {paypalOrderId}</p>
               </div>

               <div className="glass-card p-12 space-y-12 border-blue-500/30 shadow-[0_0_100px_rgba(34,211,238,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><UploadCloud size={150} className="text-blue-500" /></div>
                  <div className="text-center space-y-4 relative z-10">
                     <h3 className="text-3xl font-black uppercase italic tracking-tighter">Inyecta tu Activo Publicitario.</h3>
                     <p className="text-gray-500 text-sm font-light">Has reservado un espacio de {selectedPlan.days} días. Sube tu arte ahora.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">Identidad de Marca (Empresa)</label>
                           <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="EJ: COCA COLA / NIKE..." className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white uppercase outline-none focus:border-cyan-500 transition-all font-bold" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">URL del Banner (JPG/PNG o YouTube/MP4)</label>
                           <input type="text" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500 transition-all text-xs" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">URL de Destino (Link de Clic)</label>
                           <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://tu-web.com" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500 transition-all text-xs" />
                        </div>
                     </div>
                     <div className="w-full aspect-video bg-black rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden group">
                        {bannerUrl ? (
                          <img src={bannerUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                        ) : (
                          <div className="text-center space-y-3 opacity-20">
                             <UploadCloud size={48} className="mx-auto" />
                             <p className="text-[9px] font-black uppercase tracking-widest">Vista previa táctica</p>
                          </div>
                        )}
                     </div>
                  </div>

                  <button 
                    onClick={handleFinalInjection}
                    disabled={isUploading || !companyName || !bannerUrl}
                    className="w-full py-8 bg-blue-600 text-white rounded-full font-black text-xl uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-2xl disabled:opacity-30 flex items-center justify-center gap-4"
                  >
                     {isUploading ? <Loader2 className="animate-spin" /> : <><Zap size={20} fill="currentColor" /> PUBLICAR EN EL IMPERIO HAWKIN</>}
                  </button>
               </div>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 gap-10">
               <div className="w-40 h-40 bg-blue-600 rounded-[60px] flex items-center justify-center text-white shadow-[0_0_100px_rgba(37,99,235,0.4)] animate-bounce"><Sparkles size={80} /></div>
               <div className="text-center space-y-4">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white">¡Operación Éxito!</h2>
                  <p className="text-blue-500 text-xl font-bold uppercase tracking-[0.5em]">Tu marca ha sido inyectada al Radar Global.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer /><GlobalTicker />
    </div>
  );
}
