'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  ShieldCheck, Loader2, MessageCircle, Radio, 
  Layout, ShoppingBag, Target, Tv, Eye, ExternalLink 
} from 'lucide-react';

// Precios y Planes (Fuera para evitar re-renderizados innecesarios)
const AD_PLANS = [
  { id: 'plus', title: 'Plan Plus Streaming', pricePEN: 999, priceUSD: "262.00", placement: 'Banner Principal + Live' },
  { id: 'sidebar', title: 'Sidebar Académica', pricePEN: 699, priceUSD: "183.00", placement: 'Lateral de Cursos' },
  { id: 'native', title: 'Pauta Nativa Radar', pricePEN: 399, priceUSD: "105.00", placement: 'Entre Noticias' },
];

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedId, setSelectedId] = useState('plus');
  const [geoData, setGeoData] = useState<any>({ countryCode: 'PE', currencySymbol: 'S/' });
  const paypalRef = useRef<HTMLDivElement>(null);

  // 1. Montaje Inicial
  useEffect(() => {
    setIsMounted(true);
    
    // Obtener IP de forma segura
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => { if(data?.countryCode) setGeoData(data); })
      .catch(() => console.log("Carga regional por defecto"));

    // CARGADOR DE PAYPAL (Sencillo y directo)
    const CLIENT_ID = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas';
    const scriptId = 'paypal-v24-safe-script';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&locale=es_PE`;
      script.async = true;
      script.onload = () => setIsPaypalReady(true);
      document.body.appendChild(script);
    } else if ((window as any).paypal) {
      setIsPaypalReady(true);
    }
  }, []);

  // 2. Renderizador de Botones
  useEffect(() => {
    if (isPaypalReady && (window as any).paypal && paypalRef.current && isMounted) {
      const container = paypalRef.current;
      container.innerHTML = ''; 
      
      const currentPlan = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];

      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 50 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${currentPlan.title}`,
                amount: { currency_code: 'USD', value: currentPlan.priceUSD }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING', brand_name: 'HAWKIN' }
            });
          },
          onApprove: async (data: any, actions: any) => {
            await actions.order.capture();
            window.location.href = "/b2b?success=true";
          }
        }).render(container);
      } catch (e) {
        console.error("PayPal Interaction Error", e);
      }
    }
  }, [isPaypalReady, selectedId, isMounted]);

  // Si no está montado, retornamos un esqueleto para evitar errores de hidratación
  if (!isMounted) {
    return <div className="min-h-screen bg-black" />;
  }

  const selectedPlacement = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        {/* TITULACIÓN */}
        <section className="text-center space-y-8 mb-24">
          <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN GLOBAL MEDIA • SISTEMA v24.0</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="text-white border-b-8 border-blue-600">Comercial.</span>
          </h1>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
           
           {/* PLANES */}
           <div className="space-y-4">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-500 mb-6">Nuestros Planes</h3>
              {AD_PLANS.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedId(ad.id)}
                  className={`w-full p-8 rounded-[25px] border-2 text-left transition-all flex justify-between items-center ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}
                >
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                         {ad.id === 'plus' ? <Radio size={20} /> : ad.id === 'sidebar' ? <Layout size={20} /> : <ShoppingBag size={20} />}
                      </div>
                      <div>
                         <p className="text-lg font-bold uppercase italic leading-none">{ad.title}</p>
                         <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{ad.placement}</p>
                      </div>
                   </div>
                   <p className="text-2xl font-black text-white">{geoData.currencySymbol} {ad.pricePEN}</p>
                </button>
              ))}
           </div>

           {/* PASARELA DE PAGO */}
           <div className="p-10 rounded-[40px] bg-white text-black space-y-8 shadow-2xl relative">
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Reserva Confirmada:</p>
                 <h4 className="text-2xl font-black uppercase italic text-blue-600 leading-tight">{selectedPlacement.title}</h4>
                 <div className="flex items-end gap-2 mt-4">
                    <span className="text-4xl font-black text-black">{geoData.currencySymbol} {selectedPlacement.pricePEN}</span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase mb-2">Cobro vía PayPal</span>
                 </div>
              </div>

              <div className="min-h-[140px] flex flex-col items-center justify-center w-full relative border-t border-gray-100 pt-8">
                 {!isPaypalReady ? (
                   <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-blue-600" size={40} />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse text-center">ACTIVANDO PASARELA...</p>
                   </div>
                 ) : (
                   <div ref={paypalRef} className="w-full" />
                 )}
              </div>
              
              <div className="pt-4 text-center">
                 <p className="text-[7px] text-gray-400 font-black uppercase tracking-[0.3em]">Débito Seguro • HAWKIN B2B GLOBAL NETWORK</p>
                 <button 
                  onClick={() => window.open('https://wa.me/519XXXXXXXX', '_blank')}
                  className="mt-4 text-[8px] font-black text-blue-600 border border-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                 >
                    Pago Manual WhatsApp
                 </button>
              </div>
           </div>
        </div>

        {/* MAPA DE RECURSOS */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Impacto 360', icon: <Eye size={24} />, text: 'Presencia masiva en todo el ecosistema.' },
             { title: 'Clic Directo', icon: <ExternalLink size={24} />, text: 'Enlaces inteligentes a tu web.' },
             { title: 'Calidad 4K', icon: <Tv size={24} />, text: 'Soporte para videos de alta fidelidad.' }
           ].map((item, i) => (
             <div key={i} className="p-10 rounded-[35px] bg-white/[0.02] border border-white/5 space-y-4 text-center">
                <div className="text-blue-500 mx-auto w-fit">{item.icon}</div>
                <h4 className="text-lg font-black uppercase italic tracking-tighter text-white">{item.title}</h4>
                <p className="text-[10px] text-gray-500 font-light leading-relaxed">{item.text}</p>
             </div>
           ))}
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
