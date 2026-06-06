'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, LoaderCircle, MessageCircle, Radio, 
  LayoutDashboard, ShoppingBag, Target, Tv, Eye, ExternalLink, Play,
  Sparkles, Calendar, Globe, MapPin, Zap, ChevronRight, Mail, CloudUpload, 
  UserCheck, CreditCard, Info, TriangleAlert, CircleCheck, Lock
} from 'lucide-react';

// =====================================================================
// COMPONENTE DE PAYPAL - VERSION DEFINITIVA ANTI-BLOQUEO
// =====================================================================
function PaypalBusinessButton({ amount, onSuccess }: { amount: string, onSuccess: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [btnError, setBtnError] = useState(false);

  useEffect(() => {
    let timeout: any;
    
    const renderButtons = () => {
      if (containerRef.current && (window as any).paypal) {
        containerRef.current.innerHTML = ''; 
        try {
          (window as any).paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  description: "HAWKIN B2B Sponsorship",
                  amount: { currency_code: "USD", value: amount }
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture();
              onSuccess(order.id);
            },
            onError: (err: any) => {
              console.error("PayPal Execution Error:", err);
              setBtnError(true);
            },
            style: {
              color: 'blue',
              shape: 'pill',
              label: 'pay',
              height: 45
            }
          }).render(containerRef.current);
        } catch (e) {
          console.error("PayPal Render Error:", e);
          setBtnError(true);
        }
      } else {
        // Re-intentar en 500ms si el SDK aun no está listo
        timeout = setTimeout(renderButtons, 1000);
      }
    };

    renderButtons();
    return () => clearTimeout(timeout);
  }, [amount]);

  if (btnError) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-center space-y-4">
         <TriangleAlert className="text-red-500 mx-auto" />
         <p className="text-xs font-bold text-red-500 uppercase">Error al cargar la pasarela.</p>
         <button onClick={() => window.location.reload()} className="text-[10px] underline font-black uppercase text-white">Recargar Página</button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div ref={containerRef} className="w-full min-h-[150px] flex flex-col justify-center items-center bg-white/5 rounded-3xl p-6 border border-white/10" />
      <p className="text-[7px] text-gray-500 font-bold uppercase text-center tracking-widest italic">Pagos protegidos por HAWKIN Shield Technology</p>
    </div>
  );
}

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<'config' | 'checkout' | 'success'>('config');
  
  // 1. CONFIGURACIÓN
  const [selectedId, setSelectedId] = useState('plus');
  const [isGlobal, setIsGlobal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [geoData, setGeoData] = useState<any>({ countryCode: 'PE', currencySymbol: 'S/', rate: 3.80 });

  // 2. ESTADOS
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState('');
  const [availability, setAvailability] = useState<{ day: number, available: boolean }[]>([]);
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    // Generar disponibilidad aleatoria estable solo en el cliente
    const days = Array.from({ length: 31 }, (_, i) => ({ 
      day: i + 1, 
      available: Math.random() > 0.1 
    }));
    setAvailability(days);
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  const AD_PLANS = useMemo(() => [
    { id: 'plus', title: 'Plan Maestro Plus', days: 20, basePriceUSD: 265, placement: 'TOP_BANNER', reachLocal: '2.5M+', reachGlobal: '12M+', icon: <Sparkles className="text-blue-400" />, desc: 'Máxima visibilidad en cabecera global.' },
    { id: 'sidebar', title: 'Plan Táctico Sidebar', days: 15, basePriceUSD: 185, placement: 'SIDEBAR', reachLocal: '1M+', reachGlobal: '5M+', icon: <LayoutDashboard className="text-blue-300" />, desc: 'Presencia lateral constante.' },
    { id: 'native', title: 'Plan Escencial Native', days: 7, basePriceUSD: 105, placement: 'NEWS_FEED', reachLocal: '500k+', reachGlobal: '2M+', icon: <ShoppingBag className="text-blue-200" />, desc: 'Integración orgánica en noticias.' }
  ], []);

  const selectedPlan = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];
  const totalPriceUSD = selectedPlan.basePriceUSD + (isGlobal ? 300 : 0);
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
    
    // CARGA DE SDK PAYPAL INMEDIATA
    const scriptId = "paypal-sdk-hawkin";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas&currency=USD&intent=capture`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoToCheckout = () => {
    if (!startDate || new Date(startDate) < new Date(new Date().setHours(0,0,0,0))) {
       alert("Socio, elige una fecha de inicio válida (hoy o futuro).");
       return;
    }
    if (!companyName || !bannerUrl) {
      alert("Completa el Nombre de Empresa y el Link del Banner.");
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
      if (res.ok) setStep('success');
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans flex flex-col">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        
        <section className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full">
             <Globe className="text-blue-500 animate-pulse" size={14} />
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">SISTEMA PUBLICITARIO v6.1</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter">
            {step === 'config' ? 'Inyectar' : step === 'checkout' ? 'Verificar' : 'Misión'} <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Pauta.</span>
          </h1>
        </section>

        <AnimatePresence mode="wait">
          
          {step === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
               <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-6">
                     <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 border-b border-white/5 pb-4">
                        <Target className="text-blue-400" size={20} /> 1. Plan Alpha
                     </h3>
                     <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                        <button onClick={() => setIsGlobal(false)} className={`px-6 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${!isGlobal ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>Local</button>
                        <button onClick={() => setIsGlobal(true)} className={`px-6 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${isGlobal ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}>Global</button>
                     </div>
                     <div className="space-y-4">
                        {AD_PLANS.map((ad) => (
                          <button key={ad.id} onClick={() => setSelectedId(ad.id)} className={`w-full p-6 rounded-[35px] border-2 text-left transition-all ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100'}`}>
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5'}`}>{ad.icon}</div>
                                   <p className="text-sm font-black uppercase italic leading-none">{ad.title}</p>
                                </div>
                                <span className="text-[8px] font-black bg-white/10 px-3 py-1.5 rounded-full text-blue-400">{ad.days} DÍAS</span>
                             </div>
                             <div className="flex justify-between items-end">
                                <div><p className="text-[7px] text-gray-600 font-bold uppercase tracking-widest leading-none mb-1">Alcance Estimado</p><p className="text-[10px] font-black text-cyan-400 uppercase italic">{isGlobal ? ad.reachGlobal : ad.reachLocal}</p></div>
                                <p className="text-lg font-black text-white">{geoData.currencySymbol}{Math.round((isGlobal ? ad.basePriceUSD + 300 : ad.basePriceUSD) * (geoData?.rate || 3.8))}</p>
                             </div>
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-6">
                     <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-3"><Calendar className="text-blue-500" size={18} /> Disponibilidad</h4>
                     <div className="grid grid-cols-7 gap-1.5">
                        {availability.map((d) => (
                          <div key={d.day} className={`aspect-square rounded-lg flex items-center justify-center text-[8px] font-black border ${d.available ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-900 opacity-30'}`}>{d.day}</div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-8 space-y-8">
                  {/* SOPORTE B2B DIRECTO */}
                  <div className="p-8 bg-blue-600/5 border border-blue-600/20 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 mb-4">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                           <Mail size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Soporte Comercial Directo</p>
                           <p className="text-xs text-gray-500 font-bold uppercase mt-1">¿Problemas al ingresar o dudas técnicas?</p>
                        </div>
                     </div>
                     <a href="mailto:julhianno@aihawkin.com" className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                        julhianno@aihawkin.com
                     </a>
                  </div>

                  <div className="glass-card p-12 space-y-12 border-white/5 shadow-2xl">
                     <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 border-b border-white/5 pb-6"><Radio className="text-cyan-400" size={20} /> 2. Detalles</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Inicio (Mínimo hoy)</label>
                              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm font-black text-white outline-none" min={todayStr} />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Nombre de Empresa</label>
                              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="EJ: TESLA..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm font-black text-white uppercase outline-none" />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Link Banner (YouTube/Imagen)</label>
                              <input type="text" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-[10px] font-bold text-white outline-none" />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Web Destino</label>
                              <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-5 text-[10px] font-bold text-white outline-none" />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="w-full aspect-video bg-black rounded-[40px] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group">
                              {bannerUrl ? <img src={bannerUrl} className="w-full h-full object-cover" alt="" /> : <div className="text-center opacity-20"><CloudUpload size={60} className="mx-auto" /><p className="text-[10px] font-black uppercase">Vista previa</p></div>}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                              <div className="absolute bottom-6 left-8 z-20"><p className="text-lg font-black uppercase italic text-white">{companyName || 'TU MARCA'}</p><p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Socio Patrocinador</p></div>
                           </div>
                        </div>
                     </div>
                     <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
                        <div className="text-left"><p className="text-[10px] font-black text-gray-600 uppercase mb-1">Inversión Final</p><p className="text-5xl font-black text-white">{geoData.currencySymbol} {finalPriceLocal}</p></div>
                        <button onClick={handleGoToCheckout} className="px-16 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">REVISAR Y PAGAR PAUTA</button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
               <div className="glass-card p-12 border-blue-500/30 shadow-[0_0_100px_rgba(34,211,238,0.1)] space-y-10">
                  <div className="text-center space-y-4">
                     <Lock size={32} className="text-blue-500 mx-auto mb-4" />
                     <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Bóveda PayPal.</h3>
                     <p className="text-gray-500 text-sm">Tu pauta será inyectada inmediatamente tras el éxito del pago.</p>
                  </div>
                  <div className="space-y-6 bg-black/50 p-8 rounded-[40px] border border-white/5 text-left">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4"><span className="text-[10px] font-black text-gray-500 uppercase">Plan</span><span className="text-xs font-black text-white uppercase italic">{selectedPlan.title} ({isGlobal ? 'Global' : 'Local'})</span></div>
                     <div className="flex justify-between items-center pt-4"><span className="text-sm font-black text-blue-500 uppercase italic">Monto Total</span><span className="text-4xl font-black text-white">USD ${totalPriceUSD}</span></div>
                  </div>
                  <div className="space-y-6">
                    <PaypalBusinessButton amount={totalPriceUSD.toString()} onSuccess={handleFinalSuccess} />
                    <button onClick={() => setStep('config')} className="w-full text-[9px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">Abortar Transacción</button>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 gap-10 text-center">
               <div className="w-40 h-40 bg-green-500 rounded-[60px] flex items-center justify-center text-black shadow-[0_0_100px_rgba(34,197,94,0.4)] animate-bounce"><CircleCheck size={80} /></div>
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

