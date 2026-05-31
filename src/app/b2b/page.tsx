'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Loader2, MessageCircle, Radio, 
  LayoutDashboard, ShoppingBag, Target, Tv, Eye, ExternalLink, Play,
  Sparkles, Calendar, Globe, MapPin, Zap, ChevronRight, Mail, UploadCloud, CheckCircle2, CircleAlert
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
      priceUSD: isGlobal ? 565 : 265, // +$300 si es global
      placement: 'TOP_BANNER',
      desc: 'Banner Gigante + Video 4K + Rotación Mundial Prioritaria.',
      features: ['20 Días Corridos', 'Soporta Video MP4/YouTube', 'Cabecera Principal', isGlobal ? 'Alcance 100% Global' : 'Alcance País Local'],
      icon: <Sparkles className="text-blue-400" />
    },
    { 
      id: 'sidebar', 
      title: 'Plan Táctico Sidebar', 
      days: 15,
      priceUSD: isGlobal ? 485 : 185,
      placement: 'SIDEBAR',
      desc: 'Presencia lateral constante en todo el ecosistema.',
      features: ['15 Días Corridos', 'Solo Imágenes HQ', 'Lateral Táctico', isGlobal ? 'Todo el Mundo' : 'País Específico'],
      icon: <LayoutDashboard className="text-blue-300" />
    },
    { 
      id: 'native', 
      title: 'Plan Escencial Native', 
      days: 7,
      priceUSD: isGlobal ? 405 : 105,
      placement: 'NEWS_FEED',
      desc: 'Anuncio integrado orgánicamente en el feed del Radar.',
      features: ['7 Días Corridos', 'Impacto en el Radar', 'Sin Banner Principal', 'Económico'],
      icon: <ShoppingBag className="text-blue-200" />
    }
  ], [isGlobal]);

  const selectedPlan = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];
  const finalPriceLocal = Math.round(selectedPlan.priceUSD * geoData.rate);
  const endDateCalculated = useMemo(() => {
    if (!startDate) return null;
    const d = new Date(startDate);
    d.setDate(d.getDate() + selectedPlan.days);
    return d;
  }, [startDate, selectedPlan.days]);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/geo').then(res => res.json()).then(data => { if(data?.countryCode) setGeoData(data); }).catch(console.error);
    
    // Carga de PayPal SDK v5 (Verificado)
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas&currency=USD&disable-funding=credit,card`;
    script.async = true;
    script.onload = () => setIsPaypalLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleFakePayment = () => {
    if (!startDate) { alert("Socio, elige una fecha de inicio primero."); return; }
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
        <section className="text-center space-y-8 mb-40">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
             <Globe className="text-blue-500 animate-pulse" size={14} />
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Ecosistema Publicitario v5.0</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
             Reserva tu espacio, paga de forma segura e inyecta tu marca en el mundo HAWKIN al instante.
          </p>
        </section>

        <AnimatePresence mode="wait">
          {paymentStep === 'selection' && (
            <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               
               {/* CONFIGURACIÓN Y PLANES */}
               <div className="lg:col-span-5 space-y-12">
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
                          <button key={ad.id} onClick={() => setSelectedId(ad.id)} className={`w-full p-8 rounded-[40px] border-2 text-left transition-all ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100'}`}>
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5'}`}>{ad.icon}</div>
                                   <p className="text-base font-black uppercase italic leading-none">{ad.title}</p>
                                </div>
                                <span className="text-[8px] font-black bg-white/10 px-3 py-1.5 rounded-full text-blue-400">{ad.days} DÍAS</span>
                             </div>
                             <div className="flex justify-between items-end">
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Costo total por periodo</p>
                                <p className="text-2xl font-black text-white">{geoData.currencySymbol} {finalPriceLocal}</p>
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
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-blue-600/10 border border-blue-600/30 rounded-3xl text-center">
                             <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Bloque Reservado Automáticamente</p>
                             <p className="text-lg font-black uppercase italic tracking-tighter">Del {new Date(startDate).toLocaleDateString()} al {endDateCalculated?.toLocaleDateString()}</p>
                          </motion.div>
                        )}
                     </div>
                  </div>
               </div>

               {/* MONITOR DE IMPACTO Y CIERRE */}
               <div className="lg:col-span-7 space-y-12">
                  <div className="glass-card p-12 space-y-10 border-blue-500/20 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={200} className="text-blue-500" /></div>
                     <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className={`p-4 rounded-3xl ${isGlobal ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'} shadow-2xl`}><Globe size={32} /></div>
                           <div>
                              <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Simulador {isGlobal ? 'Global' : 'Local'}.</h4>
                              <p className="text-gray-500 text-sm mt-2 font-bold uppercase tracking-widest">{selectedPlan.placement} • {isGlobal ? 'Todo el Mundo' : `País de Origen (${geoData.countryCode})`}</p>
                           </div>
                        </div>
                        <p className="text-gray-400 text-xl font-light leading-relaxed border-l-2 border-blue-500 pl-8">"{selectedPlan.desc}"</p>
                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                           <div>
                              <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-2">Impacto en Pantalla</p>
                              <p className="text-3xl font-black text-white italic">4K UHD</p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-2">Tráfico Estimado</p>
                              <p className="text-3xl font-black text-blue-500 italic">{selectedPlan.reach}</p>
                           </div>
                        </div>
                     </div>

                     <div className="relative z-10 pt-10">
                        <button 
                           onClick={handleFakePayment}
                           className="w-full py-8 bg-white text-black rounded-full font-black text-2xl uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all shadow-[0_20px_80px_rgba(255,255,255,0.1)] flex items-center justify-center gap-6"
                        >
                           RESERVAR Y PAGAR <ChevronRight size={32} />
                        </button>
                        <p className="text-center mt-6 text-[8px] font-bold text-gray-600 uppercase tracking-[0.3em]">Redirección segura a la pasarela de pago protegida</p>
                     </div>
                  </div>

                  {/* SOPORTE DIRECTO */}
                  <div className="flex flex-col md:flex-row gap-6">
                     <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500"><Mail size={24} /></div>
                        <div>
                           <p className="text-[9px] font-black text-gray-600 uppercase">Consultas Estratégicas</p>
                           <a href="mailto:publicidad@aihawkin.com" className="text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase">publicidad@aihawkin.com</a>
                        </div>
                     </div>
                     <div className="flex-1 p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center gap-6">
                        <div className="w-14 h-14 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500"><MessageCircle size={24} /></div>
                        <div>
                           <p className="text-[9px] font-black text-gray-600 uppercase">Chat Alpha</p>
                           <p className="text-sm font-bold text-white uppercase">Soporte 24/7 Activo</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {paymentStep === 'processing' && (
            <motion.div key="step-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-40 gap-8">
               <Loader2 className="animate-spin text-blue-600" size={80} />
               <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter animate-pulse">Sincronizando Pasarela Global...</h2>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-[0.5em]">Verificando disponibilidad de cupo Alpha</p>
               </div>
            </motion.div>
          )}

          {paymentStep === 'upload' && !isSuccess && (
            <motion.div key="step-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
               <div className="bg-green-500/10 border-2 border-green-500/30 p-10 rounded-[50px] text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500 text-black rounded-3xl flex items-center justify-center mx-auto shadow-2xl"><CircleCheckBig size={40} /></div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">¡Pago Verificado!</h2>
                  <p className="text-green-500 font-bold uppercase text-[10px] tracking-[0.4em]">Transacción: {paypalOrderId}</p>
               </div>

               <div className="glass-card p-12 space-y-12 border-blue-500/30 shadow-[0_0_100px_rgba(34,211,238,0.1)]">
                  <div className="text-center space-y-4">
                     <h3 className="text-3xl font-black uppercase italic tracking-tighter">Inyecta tu Publicidad.</h3>
                     <p className="text-gray-500 text-sm font-light">Socio, ya puedes configurar el arte que verá el mundo.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">Nombre de tu Empresa</label>
                           <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="EJ: COCA COLA..." className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white uppercase outline-none focus:border-cyan-500 transition-all" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">URL del Banner (YouTube o JPG/PNG)</label>
                           <input type="text" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500 transition-all" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">Enlace de Destino (Web del socio)</label>
                           <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://..." className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500 transition-all" />
                        </div>
                     </div>
                     <div className="w-full aspect-video bg-black rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                        {bannerUrl ? <img src={bannerUrl} className="w-full h-full object-cover" alt="Preview" /> : <div className="text-center space-y-3 opacity-20"><ImageIcon size={48} className="mx-auto" /><p className="text-[9px] font-black uppercase">Vista previa en vivo</p></div>}
                     </div>
                  </div>

                  <button 
                    onClick={handleFinalInjection}
                    disabled={isUploading || !companyName || !bannerUrl}
                    className="w-full py-8 bg-blue-600 text-white rounded-full font-black text-2xl uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-2xl disabled:opacity-30"
                  >
                     {isUploading ? <Loader2 className="animate-spin mx-auto" /> : 'PUBLICAR EN EL IMPERIO HAWKIN'}
                  </button>
               </div>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-40 gap-10">
               <div className="w-40 h-40 bg-blue-600 rounded-[60px] flex items-center justify-center text-white shadow-[0_0_100px_rgba(37,99,235,0.4)] animate-bounce"><Sparkles size={80} /></div>
               <div className="text-center space-y-4">
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white">¡Misión Cumplida!</h2>
                  <p className="text-blue-500 text-xl font-bold uppercase tracking-[0.5em]">Tu marca está ahora en el Radar Global.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer /><GlobalTicker />
    </div>
  );
}

function ImageIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  );
}
