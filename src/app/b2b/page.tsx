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
  UserCheck, CreditCard, Info, AlertTriangle, CheckCircle2, Lock
} from 'lucide-react';

// =====================================================================
// COMPONENTE REAL DE PAYPAL - ULTRA ROBUSTO
// =====================================================================
function PaypalBusinessButton({ amount, onSuccess, isLoaded }: { amount: string, onSuccess: (id: string) => void, isLoaded: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo renderizar si el SDK está cargado y el contenedor existe
    if (isLoaded && containerRef.current && (window as any).paypal) {
      containerRef.current.innerHTML = ''; 
      try {
        (window as any).paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: "HAWKIN B2B Ads Sponsorship",
                amount: { currency_code: "USD", value: amount }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            onSuccess(order.id);
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err);
          },
          style: {
            color: 'blue',
            shape: 'pill',
            label: 'pay',
            height: 50
          }
        }).render(containerRef.current);
      } catch (e) {
        console.error("Render Error:", e);
      }
    }
  }, [isLoaded, amount]); // Re-renderizar solo si cambia el monto o la carga

  return (
    <div className="w-full space-y-4">
      <div ref={containerRef} className="w-full min-h-[150px] flex flex-col justify-center items-center bg-white/5 rounded-3xl p-6 border border-white/10" />
      <p className="text-[7px] text-gray-500 font-bold uppercase text-center tracking-widest italic">Transacción encriptada punto a punto</p>
    </div>
  );
}

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
      id: 'plus', title: 'Plan Maestro Plus', days: 20, basePriceUSD: 265, placement: 'TOP_BANNER',
      desc: 'Máxima visibilidad: Banner Gigante en cabecera + Soporte Video 4K.',
      reachLocal: '2.5M+ Impactos', reachGlobal: '12M+ Global',
      features: ['20 DÍAS CORRIDOS', 'Soporta Video 4K', 'Cabecera Principal'],
      icon: <Sparkles className="text-blue-400" />
    },
    { 
      id: 'sidebar', title: 'Plan Táctico Sidebar', days: 15, basePriceUSD: 185, placement: 'SIDEBAR',
      desc: 'Presencia lateral constante junto a toda la inteligencia HAWKIN.',
      reachLocal: '1M+ Impactos', reachGlobal: '5M+ Global',
      features: ['15 DÍAS CORRIDOS', 'Solo Imágenes HQ', 'Lateral Táctico'],
      icon: <LayoutDashboard className="text-blue-300" />
    },
    { 
      id: 'native', title: 'Plan Escencial Native', days: 7, basePriceUSD: 105, placement: 'NEWS_FEED',
      desc: 'Integración orgánica: Tu marca dentro del flujo de noticias del Radar.',
      reachLocal: '500k+ Impactos', reachGlobal: '2M+ Global',
      features: ['7 DÍAS CORRIDOS', 'Anuncio Nativo', 'Económico'],
      icon: <ShoppingBag className="text-blue-200" />
    }
  ], []);

  const selectedPlan = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];
  const globalSurchargeUSD = isGlobal ? 300 : 0;
  const totalPriceUSD = selectedPlan.basePriceUSD + globalSurchargeUSD;
  const finalPriceLocal = Math.round(totalPriceUSD * (geoData?.rate || 3.8));

  const endDateCalculated = useMemo(() => {
    if (!startDate) return null;
    const d = new Date(startDate);
    d.setDate(d.getDate() + (selectedPlan.days - 1));
    return d;
  }, [startDate, selectedPlan.days]);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/geo').then(res => res.json()).then(data => { if(data?.countryCode) setGeoData(data); }).catch(console.error);
    
    // CARGA DE PAYPAL CON PRIORIDAD ALTA
    if (!(window as any).paypal) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas&currency=USD&intent=capture`;
      script.async = true;
      script.onload = () => setIsPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalLoaded(true);
    }
  }, []);

  const handleGoToCheckout = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const chosenDate = new Date(startDate);

    if (!startDate || chosenDate < today) {
       alert("Socio, debes elegir una fecha de inicio válida (de hoy en adelante).");
       return;
    }
    if (!companyName || !bannerUrl) {
      alert("Socio, completa el Nombre de Empresa y Banner para continuar.");
      return;
    }
    setStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSuccess = async (id: string) => {
    setIsProcessing(true);
    setPaypalOrderId(id);
    try {
      const res = await fetch('/api/admin/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName, bannerUrl, targetUrl,
          placement: selectedPlan.placement,
          startDate: new Date(startDate),
          endDate: endDateCalculated,
          isGlobal, targetCountry: geoData.countryCode,
          paypalOrderId: id, paymentVerified: true, status: "PAID"
        })
      });
      if (res.ok) {
        setStep('success');
        setTimeout(() => window.location.href = '/', 4000);
      }
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        
        <section className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
             <Globe className="text-blue-500 animate-pulse" size={14} />
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">HAWKIN B2B GLOBAL NETWORK</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            {step === 'config' ? 'Inyectar' : step === 'checkout' ? 'Verificar' : 'Misión'} <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Pauta.</span>
          </h1>
        </section>

        <AnimatePresence mode="wait">
          
          {step === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                           <Target className="text-blue-400" size={20} /> 1. Plan Alpha
                        </h3>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                           <button onClick={() => setIsGlobal(false)} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${!isGlobal ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Local</button>
                           <button onClick={() => setIsGlobal(true)} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${isGlobal ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Global</button>
                        </div>
                     </div>
                     <div className="space-y-4">
                        {AD_PLANS.map((ad) => (
                          <button key={ad.id} onClick={() => setSelectedId(ad.id)} className={`w-full p-6 rounded-[35px] border-2 text-left transition-all group ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100'}`}>
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5'}`}>{ad.icon}</div>
                                   <p className="text-sm font-black uppercase italic leading-none">{ad.title}</p>
                                </div>
                                <span className="text-[8px] font-black bg-white/10 px-3 py-1.5 rounded-full text-blue-400">{ad.days} DÍAS</span>
                             </div>
                             <div className="flex justify-between items-end">
                                <div>
                                   <p className="text-[7px] text-gray-600 font-bold uppercase tracking-widest leading-none mb-1">Impacto Proyectado</p>
                                   <p className="text-[10px] font-black text-cyan-400 uppercase italic">{isGlobal ? ad.reachGlobal : ad.reachLocal}</p>
                                </div>
                                <p className="text-lg font-black text-white">{geoData.currencySymbol}{Math.round((isGlobal ? ad.basePriceUSD + 300 : ad.basePriceUSD) * (geoData?.rate || 3.8))}</p>
                             </div>
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5"><Calendar size={80} /></div>
                     <div className="flex items-center gap-3 relative z-10 border-b border-white/5 pb-4">
                        <Calendar className="text-blue-500" size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">Disponibilidad del Nodo</h4>
                     </div>
                     <div className="grid grid-cols-7 gap-1.5 relative z-10">
                        {Array.from({ length: 31 }, (_, i) => ({ day: i + 1, available: Math.random() > 0.1 })).map((d) => (
                          <div key={d.day} className={`aspect-square rounded-lg flex items-center justify-center text-[8px] font-black border transition-all ${d.available ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-900 opacity-30'}`}>
                             {d.day}
                          </div>
                        ))}
                     </div>
                     <p className="text-[7px] font-bold text-gray-700 uppercase text-center tracking-[0.2em] relative z-10">Límite: 5 Ads/Día</p>
                  </div>
               </div>

               <div className="lg:col-span-8 space-y-8">
                  <div className="glass-card p-12 space-y-12 border-white/5 shadow-2xl">
                     <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 border-b border-white/5 pb-6">
                        <Radio className="text-cyan-400" size={20} /> 2. Detalles de Campaña
                     </h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Fecha de Inicio (Mínimo hoy)</label>
                              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm font-black text-white focus:border-blue-500 outline-none" min={todayStr} />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Empresa</label>
                              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="EJ: NIKE / TESLA..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm font-black text-white uppercase outline-none focus:border-cyan-500" />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Banner (Link YouTube o Imagen)</label>
                              <input type="text" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Web de Destino</label>
                              <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-[10px] font-bold text-white outline-none focus:border-cyan-500" />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest text-center">Monitor de Impacto v5.1</p>
                           <div className="w-full aspect-video bg-black rounded-[40px] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                              {bannerUrl ? (
                                <img src={bannerUrl} className="w-full h-full object-cover transition-transform" alt="Preview" />
                              ) : (
                                <div className="text-center space-y-4 opacity-20">
                                   <UploadCloud size={60} className="mx-auto" />
                                   <p className="text-[10px] font-black uppercase tracking-widest">Activos Pendientes</p>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                              <div className="absolute bottom-6 left-8 z-20 text-left">
                                 <p className="text-lg font-black uppercase italic tracking-tighter text-white">{companyName || 'TU MARCA'}</p>
                                 <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Socio Patrocinador</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                                 <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Impacto Proyectado</p>
                                 <p className="text-xs font-black text-blue-500 italic">{isGlobal ? selectedPlan.reachGlobal : selectedPlan.reachLocal}</p>
                              </div>
                              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl text-center flex flex-col justify-center">
                                 <div className={`text-[8px] font-black px-2 py-1 rounded mx-auto ${isGlobal ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                    {isGlobal ? 'ALCANCE GLOBAL' : 'ALCANCE LOCAL'}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
                        <div className="text-center md:text-left">
                           <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Inversión Final</p>
                           <p className="text-5xl font-black text-white tracking-tighter">{geoData.currencySymbol} {finalPriceLocal}</p>
                        </div>
                        <button 
                           onClick={handleGoToCheckout}
                           className="px-12 py-6 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                        >
                           REVISAR Y PROCEDER AL PAGO
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-12">
               <div className="glass-card p-12 border-blue-500/30 shadow-[0_0_100px_rgba(34,211,238,0.1)] space-y-10">
                  <div className="text-center space-y-4">
                     <Lock size={32} className="text-blue-500 mx-auto mb-4" />
                     <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Bóveda PayPal.</h3>
                     <p className="text-gray-500 text-sm">Tu pauta será inyectada inmediatamente después de la confirmación.</p>
                  </div>

                  <div className="space-y-6 bg-black/50 p-8 rounded-[40px] border border-white/5 text-left">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plan & Alcance</span>
                        <span className="text-xs font-black text-white uppercase italic">{selectedPlan.title} ({isGlobal ? 'Global' : 'Local'})</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reserva de Bloque</span>
                        <span className="text-xs font-black text-white">{new Date(startDate).toLocaleDateString()} — {endDateCalculated?.toLocaleDateString()}</span>
                     </div>
                     <div className="flex justify-between items-center pt-4">
                        <span className="text-sm font-black text-blue-500 uppercase italic">Monto Total</span>
                        <span className="text-4xl font-black text-white">USD ${totalPriceUSD}</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                    {isPaypalLoaded ? (
                      <PaypalBusinessButton amount={totalPriceUSD.toString()} onSuccess={handleFinalSuccess} isLoaded={isPaypalLoaded} />
                    ) : (
                      <div className="py-16 bg-white/5 rounded-[40px] animate-pulse flex flex-col items-center gap-4">
                         <Loader2 className="animate-spin text-blue-500" />
                         <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Sincronizando Bóveda PayPal...</span>
                      </div>
                    )}
                    <button onClick={() => setStep('config')} className="w-full text-[9px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">Abortar Transacción</button>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 gap-10 text-center">
               <div className="w-40 h-40 bg-green-500 rounded-[60px] flex items-center justify-center text-black shadow-[0_0_100px_rgba(34,197,94,0.4)] animate-bounce"><CheckCircle2 size={80} /></div>
               <div className="space-y-4">
                  <h2 className="text-7xl font-black uppercase italic tracking-tighter text-white leading-none">Misión Éxito.</h2>
                  <p className="text-green-500 text-xl font-bold uppercase tracking-[0.5em]">Tu pauta ID {paypalOrderId} está activa en el imperio.</p>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <Footer /><GlobalTicker />
    </div>
  );
}
