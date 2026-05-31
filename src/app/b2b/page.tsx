'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Loader2, MessageCircle, Radio, 
  LayoutDashboard, ShoppingBag, Target, Tv, Eye, ExternalLink, Play,
  Sparkles, Calendar, Globe, MapPin, Zap, ChevronRight, Mail, UploadCloud, 
  UserCheck, CreditCard, Info, AlertTriangle, CheckCircle2
} from 'lucide-react';

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<'config' | 'checkout' | 'success'>('config');
  
  // 1. CONFIGURACIÓN DE CAMPAÑA
  const [selectedId, setSelectedId] = useState('plus');
  const [isGlobal, setIsGlobal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [geoData, setGeoData] = useState<any>({ countryCode: 'PE', currencySymbol: 'S/', rate: 3.80 });

  // 2. ESTADOS DE PROCESAMIENTO
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState('');
  const [availability, setAvailability] = useState<any>(null);

  const AD_PLANS = useMemo(() => [
    { 
      id: 'plus', 
      title: 'Plan Maestro Plus', 
      days: 20,
      basePriceUSD: 265,
      placement: 'TOP_BANNER',
      desc: 'Máxima visibilidad: Banner Gigante en cabecera + Soporte Video 4K.',
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
      desc: 'Presencia lateral constante junto a toda la inteligencia HAWKIN.',
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
      desc: 'Integración orgánica: Tu marca dentro del flujo de noticias del Radar.',
      reachLocal: '500k+ Impactos',
      reachGlobal: '2M+ Global',
      features: ['7 Días Corridos', 'Anuncio Nativo', 'Económico'],
      icon: <ShoppingBag className="text-blue-200" />
    }
  ], []);

  const selectedPlan = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];
  const globalSurchargeUSD = isGlobal ? 300 : 0;
  const totalPriceUSD = selectedPlan.basePriceUSD + globalSurchargeUSD;
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
    if (!(window as any).paypal) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas&currency=USD&disable-funding=credit,card`;
      script.async = true;
      script.onload = () => setIsPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalLoaded(true);
    }
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`/api/ads/availability?placement=${selectedPlan.placement}&country=${isGlobal ? 'GLOBAL' : geoData.countryCode}`);
      const data = await res.json();
      setAvailability(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (isMounted) fetchAvailability();
  }, [isMounted, selectedId, isGlobal, geoData.countryCode]);

  const handleGoToCheckout = () => {
    if (!companyName || !bannerUrl || !startDate) {
      alert("Socio, por favor completa todos los campos de la campaña y elige una fecha.");
      return;
    }
    setStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
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
          paypalOrderId: `PAY-${Math.random().toString(36).substring(7).toUpperCase()}`, // Simulado para dev
          paymentVerified: true
        })
      });
      if (res.ok) {
        setStep('success');
      }
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        
        {/* CABECERA DINÁMICA */}
        <section className="text-center space-y-8 mb-24">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
             <Globe className="text-blue-500 animate-pulse" size={14} />
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Ecosistema Publicitario v5.1</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            {step === 'config' ? 'Configurar' : step === 'checkout' ? 'Verificar' : 'Misión'} <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Pauta.</span>
          </h1>
        </section>

        <AnimatePresence mode="wait">
          
          {/* PASO 1: CONFIGURACIÓN COMPLETA */}
          {step === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* LADO IZQUIERDO: PLANES Y FECHAS */}
               <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                           <Target className="text-blue-400" size={20} /> 1. Elige Plan
                        </h3>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                           <button onClick={() => setIsGlobal(false)} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${!isGlobal ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Local</button>
                           <button onClick={() => setIsGlobal(true)} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${isGlobal ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Global</button>
                        </div>
                     </div>
                     <div className="space-y-4">
                        {AD_PLANS.map((ad) => (
                          <button key={ad.id} onClick={() => setSelectedId(ad.id)} className={`w-full p-6 rounded-[35px] border-2 text-left transition-all group ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100'}`}>
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5'}`}>{ad.icon}</div>
                                   <p className="text-sm font-black uppercase italic leading-none">{ad.title}</p>
                                </div>
                                <span className="text-[8px] font-black bg-white/10 px-3 py-1 rounded-full text-blue-400">{ad.days} DÍAS</span>
                             </div>
                             <div className="flex justify-between items-end">
                                <div>
                                   <p className="text-[7px] text-gray-600 font-bold uppercase tracking-widest leading-none mb-1">Impacto Proyectado</p>
                                   <p className="text-[10px] font-black text-cyan-400 uppercase italic">{isGlobal ? ad.reachGlobal : ad.reachLocal}</p>
                                </div>
                                <p className="text-lg font-black text-white">{geoData.currencySymbol}{Math.round((isGlobal ? ad.basePriceUSD + 300 : ad.basePriceUSD) * geoData.rate)}</p>
                             </div>
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* CALENDARIO REAL */}
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5"><Calendar size={80} /></div>
                     <div className="flex items-center gap-3 relative z-10 border-b border-white/5 pb-4">
                        <Calendar className="text-blue-500" size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">Disponibilidad del Nodo</h4>
                     </div>
                     <div className="grid grid-cols-7 gap-1.5 relative z-10">
                        {availability?.days.map((d: any) => (
                          <div key={d.day} className={`aspect-square rounded-lg flex items-center justify-center text-[8px] font-black border transition-all ${d.available ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-900 opacity-30'}`}>
                             {d.day}
                          </div>
                        ))}
                     </div>
                     <p className="text-[7px] font-bold text-gray-700 uppercase text-center tracking-[0.2em] relative z-10">Límite de Saturación: 5 Ads/Día</p>
                  </div>
               </div>

               {/* LADO DERECHO: FORMULARIO Y CONTENIDO */}
               <div className="lg:col-span-8 space-y-8">
                  <div className="glass-card p-12 space-y-12 border-white/5 shadow-2xl">
                     <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 border-b border-white/5 pb-6">
                        <Radio className="text-cyan-400" size={20} /> 2. Detalles de Campaña
                     </h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Fecha de Inicio de Pauta</label>
                              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm font-black text-white focus:border-blue-500 outline-none" min={new Date().toISOString().split('T')[0]} />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Nombre del Patrocinador</label>
                              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="EJ: TESLA CORP..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm font-black text-white uppercase outline-none focus:border-cyan-500" />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Banner (YouTube, MP4 o Imagen)</label>
                              <input type="text" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Página de Destino (URL Clic)</label>
                              <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                           </div>
                        </div>

                        {/* VISTA PREVIA TÁCTICA */}
                        <div className="space-y-6">
                           <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest text-center">Simulador de Impacto Real</p>
                           <div className="w-full aspect-video bg-black rounded-[40px] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                              {bannerUrl ? (
                                <img src={bannerUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Preview" />
                              ) : (
                                <div className="text-center space-y-4 opacity-20">
                                   <UploadCloud size={60} className="mx-auto" />
                                   <p className="text-[10px] font-black uppercase tracking-widest">Esperando Activos</p>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                              <div className="absolute bottom-6 left-8 z-20">
                                 <p className="text-lg font-black uppercase italic tracking-tighter text-white">{companyName || 'TU MARCA AQUÍ'}</p>
                                 <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Socio Patrocinador</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                                 <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Calidad</p>
                                 <p className="text-xs font-black text-white italic">4K UHD</p>
                              </div>
                              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                                 <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Alcance</p>
                                 <p className="text-xs font-black text-blue-500 italic">{isGlobal ? selectedPlan.reachGlobal : selectedPlan.reachLocal}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
                        <div className="text-center md:text-left">
                           <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total a Invertir</p>
                           <p className="text-5xl font-black text-white tracking-tighter">{geoData.currencySymbol} {finalPriceLocal}</p>
                        </div>
                        <button 
                           onClick={handleGoToCheckout}
                           className="w-full md:w-auto px-16 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4"
                        >
                           REVISAR Y PAGAR <CreditCard size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* PASO 2: CHECKOUT SEGURO */}
          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-12">
               <div className="glass-card p-12 border-blue-500/30 shadow-[0_0_100px_rgba(34,211,238,0.1)] space-y-10">
                  <div className="text-center space-y-4">
                     <h3 className="text-3xl font-black uppercase italic tracking-tighter">Resumen Alpha.</h3>
                     <p className="text-gray-500 text-sm">Verifica los datos de inyección antes del cobro express.</p>
                  </div>

                  <div className="space-y-6 bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plan Seleccionado</span>
                        <span className="text-xs font-black text-white uppercase italic">{selectedPlan.title}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Alcance de Pauta</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${isGlobal ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>{isGlobal ? 'GLOBAL MUNDIAL' : `LOCAL (${geoData.countryCode})`}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Periodo Activo</span>
                        <span className="text-xs font-black text-white">{new Date(startDate).toLocaleDateString()} — {endDateCalculated?.toLocaleDateString()}</span>
                     </div>
                     <div className="flex justify-between items-center pt-4">
                        <span className="text-sm font-black text-blue-500 uppercase italic">Inversión Final</span>
                        <span className="text-4xl font-black text-white">{geoData.currencySymbol} {finalPriceLocal}</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                    {isPaypalLoaded ? (
                      <button 
                        onClick={handlePaymentSuccess}
                        disabled={isProcessing}
                        className="w-full py-6 bg-blue-600 text-white rounded-full font-black text-[12px] uppercase tracking-[0.4em] hover:bg-blue-500 shadow-2xl flex items-center justify-center gap-4 transition-all"
                      >
                         {isProcessing ? <Loader2 className="animate-spin" /> : 'PAGAR Y ACTIVAR AHORA'}
                      </button>
                    ) : (
                      <div className="py-10 bg-white/5 rounded-[40px] animate-pulse flex flex-col items-center gap-4">
                         <Loader2 className="animate-spin text-blue-500" />
                         <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Cargando Bóveda PayPal...</span>
                      </div>
                    )}
                    <button onClick={() => setStep('config')} className="w-full text-[9px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">Volver a Configuración</button>
                  </div>
               </div>
            </motion.div>
          )}

          {/* PASO 3: ÉXITO TOTAL */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 gap-10 text-center">
               <div className="w-40 h-40 bg-blue-600 rounded-[60px] flex items-center justify-center text-white shadow-[0_0_100px_rgba(37,99,235,0.4)] animate-bounce"><CheckCircle2 size={80} /></div>
               <div className="space-y-4">
                  <h2 className="text-7xl font-black uppercase italic tracking-tighter text-white leading-none">Misión Éxito.</h2>
                  <p className="text-blue-500 text-xl font-bold uppercase tracking-[0.5em]">Tu marca ha sido inyectada al Radar Global.</p>
                  <p className="text-gray-600 text-sm mt-8 animate-pulse italic">Redirigiendo al centro de mando...</p>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <Footer /><GlobalTicker />
    </div>
  );
}
