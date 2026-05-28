'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Loader2, MessageCircle, Radio, 
  Layout, ShoppingBag, Target, Tv, Eye, ExternalLink, Play, AlertTriangle
} from 'lucide-react';

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedId, setSelectedId] = useState('plus');
  const [geoData, setGeoData] = useState<any>({ countryCode: 'PE', currencySymbol: 'S/' });
  const paypalRef = useRef<HTMLDivElement>(null);

  const AD_PLANS = useMemo(() => [
    { id: 'plus', title: 'Plan Plus Streaming', pricePEN: 999, priceUSD: "262.00", placement: 'Banner Principal + Live', reach: '2.5M+ Views', desc: 'Tu marca en la cabecera principal con video en tiempo real.', icon: <Radio className="text-blue-400" /> },
    { id: 'sidebar', title: 'Sidebar Académica', pricePEN: 699, priceUSD: "183.00", placement: 'Lateral de Cursos', reach: '1M+ Views', desc: 'Presencia constante al lado de cada lección educativa.', icon: <Layout className="text-blue-300" /> },
    { id: 'native', title: 'Pauta Nativa Radar', pricePEN: 399, priceUSD: "105.00", placement: 'Entre Noticias', reach: '500k+ Clics', desc: 'Anuncio integrado orgánicamente en el feed de inteligencia.', icon: <ShoppingBag className="text-blue-200" /> },
  ], []);

  const selectedPlacement = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/geo').then(res => res.json()).then(data => { if(data?.countryCode) setGeoData(data); }).catch(() => console.log("Geo Local"));

    const REAL_ID = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas';
    const scriptId = 'paypal-engine-v30-master-final';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${REAL_ID}&currency=USD&locale=es_PE&v=${Date.now()}`;
      script.async = true;
      script.onload = () => setIsPaypalReady(true);
      document.body.appendChild(script);
    } else if ((window as any).paypal) {
      setIsPaypalReady(true);
    }
  }, []);

  useEffect(() => {
    if (isPaypalReady && (window as any).paypal && paypalRef.current && isMounted) {
      const container = paypalRef.current;
      container.innerHTML = ''; 
      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 50 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B v30 - ${selectedPlacement.title}`,
                amount: { currency_code: 'USD', value: selectedPlacement.priceUSD }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING', brand_name: 'HAWKIN' }
            });
          },
          onApprove: async (data: any, actions: any) => {
            await actions.order.capture();
            window.location.href = "/b2b?success=true";
          }
        }).render(container);
      } catch (e) { console.error(e); }
    }
  }, [isPaypalReady, selectedId, isMounted, selectedPlacement]);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        {/* AVISO DE VERSIÓN PARA CACHÉ */}
        <div className="mb-12 bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-center gap-4">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Sistema v30.1 - Visión y Pagos Activos</p>
        </div>

        <section className="text-center space-y-8 mb-40">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
             Visualiza tu marca y activa tu pauta al instante. Si ves v24.0 presiona Shift + F5.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 mb-8">
                 <Target className="text-blue-400" size={20} />
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Selector de Impacto</h3>
              </div>
              {AD_PLANS.map((ad) => (
                <button key={ad.id} onClick={() => setSelectedId(ad.id)} className={`w-full p-8 rounded-[40px] border-2 text-left transition-all ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
                   <div className="flex items-center gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5'}`}>{ad.icon}</div>
                      <p className="text-base font-black uppercase italic leading-none">{ad.title}</p>
                   </div>
                   <div className="flex justify-between items-end">
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pl-1">Reach: <span className="text-white">{ad.reach}</span></p>
                      <p className="text-xl font-black text-white">S/{ad.pricePEN}</p>
                   </div>
                </button>
              ))}
           </div>

           <div className="lg:col-span-8 space-y-12">
              <div className="glass-card border-white/10 p-4 aspect-video rounded-[60px] bg-[#050505] overflow-hidden flex flex-col shadow-2xl border-2">
                 <div className="h-6 w-full flex items-center px-6 gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /><div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 </div>
                 <div className="flex-1 relative rounded-[40px] overflow-hidden bg-gray-900 border border-white/5">
                    <AnimatePresence mode="wait">
                       {selectedId === 'plus' ? (
                         <motion.div key="v-plus" initial={{opacity:0}} animate={{opacity:1}} className="w-full h-full relative">
                            <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-30" />
                            <div className="absolute top-6 left-6 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse"><span className="text-[10px] font-black text-white">LIVE STREAM</span></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center"><Play size={48} className="text-white opacity-50 mb-6" /><h4 className="text-2xl font-black uppercase italic text-white">Tu Marca Aquí</h4></div>
                            <div className="absolute bottom-6 right-6 bg-white text-black px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3"><ExternalLink size={14} /> VISITAR MARCA</div>
                         </motion.div>
                       ) : (
                         <motion.div key="v-other" initial={{opacity:0}} animate={{opacity:1}} className="w-full h-full flex flex-col items-center justify-center p-8">
                            <div className={`p-6 rounded-2xl bg-blue-500/20 border-2 border-blue-500 flex flex-col items-center gap-4 ${selectedId === 'sidebar' ? 'w-32 h-44' : 'w-3/4 h-24 flex-row justify-between'}`}>
                               <p className="text-[8px] font-black text-white uppercase text-center italic leading-tight">{selectedPlacement.title}</p>
                               <ExternalLink size={16} className="text-blue-400" />
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-full shadow-xl">
                    <div className="space-y-4">
                       <h5 className="text-xl font-black uppercase italic text-white leading-tight underline decoration-blue-500/30">{selectedPlacement.placement}</h5>
                       <p className="text-gray-500 text-xs font-light">{selectedPlacement.desc}</p>
                    </div>
                    <p className="text-4xl font-black text-blue-500 mt-8">S/{selectedPlacement.pricePEN}</p>
                 </div>

                 <div className="p-10 rounded-[50px] bg-white text-black flex flex-col items-center justify-center gap-6 shadow-2xl relative border-4 border-blue-500/20">
                    <div className="w-full">
                       {!isPaypalReady ? (
                         <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Activando Pasarela...</p>
                         </div>
                       ) : (
                         <div className="space-y-6 w-full"><div ref={paypalRef} className="w-full" /><p className="text-center text-[7px] text-gray-400 font-black uppercase">Débito Seguro • PayPal Network</p></div>
                       )}
                       <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                          <button onClick={() => window.open('https://wa.me/519XXXXXXXX', '_blank')} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2 shadow-xl"><MessageCircle size={14} /> Soporte Pago Manual</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[{ title: 'Visibilidad 360', icon: <Eye size={32} /> }, { title: 'Clic Directo', icon: <ExternalLink size={32} /> }, { title: 'Calidad 4K', icon: <Tv size={32} /> }].map((item, i) => (
             <div key={i} className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center shadow-xl">
                <div className="text-blue-500 mx-auto w-fit">{item.icon}</div>
                <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">{item.title}</h4>
             </div>
           ))}
        </div>
      </div>
      <Footer /><GlobalTicker />
    </div>
  );
}
