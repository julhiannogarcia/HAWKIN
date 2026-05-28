'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  ShieldCheck, Loader2, Radio, Layout, ShoppingBag, 
  Target, Tv, Eye, ExternalLink, MessageCircle
} from 'lucide-react';

const AD_PLANS = [
  { id: 'plus', title: 'Plan Plus Streaming', pricePEN: 999, priceUSD: "265.00", placement: 'Banner Principal + Live' },
  { id: 'sidebar', title: 'Sidebar Académica', pricePEN: 699, priceUSD: "185.00", placement: 'Lateral de Cursos' },
  { id: 'native', title: 'Pauta Nativa Radar', pricePEN: 399, priceUSD: "105.00", placement: 'Entre Noticias' },
];

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedId, setSelectedId] = useState('plus');
  const [isPaypalLoading, setIsPaypalLoading] = useState(true);
  const [paypalError, setPaypalError] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    // CLIENT ID QUE FUNCIONÓ ORIGINALMENTE
    const CLIENT_ID = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    const scriptId = 'paypal-engine-v26-final';

    const loadButtons = () => {
      if ((window as any).paypal && paypalContainerRef.current) {
        setIsPaypalLoading(false);
        const currentPlan = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];
        
        paypalContainerRef.current.innerHTML = '';
        try {
          (window as any).paypal.Buttons({
            style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 50 },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  description: `HAWKIN B2B - ${currentPlan.title}`,
                  amount: { currency_code: 'USD', value: currentPlan.priceUSD }
                }],
                application_context: { shipping_preference: 'NO_SHIPPING' }
              });
            },
            onApprove: async (data: any, actions: any) => {
              await actions.order.capture();
              window.location.href = "/b2b?success=true";
            }
          }).render(paypalContainerRef.current);
        } catch (e) {
          console.error("PayPal UI Error", e);
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      // Añadimos cache-buster (?v=26) para forzar descarga
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&locale=es_PE&v=26`;
      script.async = true;
      script.onload = loadButtons;
      script.onerror = () => { setPaypalError(true); setIsPaypalLoading(false); };
      document.body.appendChild(script);
    } else {
      setTimeout(loadButtons, 800);
    }
  }, [selectedId]);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  const selectedPlacement = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        <section className="text-center space-y-8 mb-24">
          <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN GLOBAL MEDIA • SISTEMA v26.0</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="text-white border-b-8 border-blue-600">Comercial.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
             Si ves v24.0 en pantalla, por favor presiona Shift + Actualizar.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
           <div className="space-y-4">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-500 mb-6 flex items-center gap-2">
                 <Target size={20} /> Objetivos Activos
              </h3>
              {AD_PLANS.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => { setSelectedId(ad.id); setIsPaypalLoading(true); }}
                  className={`w-full p-8 rounded-[25px] border-2 text-left transition-all flex justify-between items-center ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-white/[0.01] hover:border-white/10'}`}
                >
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-gray-500'}`}>
                         {ad.id === 'plus' ? <Radio size={20} /> : ad.id === 'sidebar' ? <Layout size={20} /> : <ShoppingBag size={20} />}
                      </div>
                      <div>
                         <p className="text-lg font-bold uppercase italic leading-none">{ad.title}</p>
                         <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{ad.placement}</p>
                      </div>
                   </div>
                   <p className="text-2xl font-black text-white">S/{ad.pricePEN}</p>
                </button>
              ))}
           </div>

           <div className="p-10 rounded-[40px] bg-white text-black space-y-8 shadow-2xl relative overflow-hidden border-4 border-blue-500/20">
              <div className="space-y-2 border-b border-gray-100 pb-6">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Reserva Confirmada:</p>
                 <h4 className="text-2xl font-black uppercase italic text-blue-600 leading-tight">{selectedPlacement.title}</h4>
                 <div className="flex items-end gap-2 mt-4">
                    <span className="text-5xl font-black text-black leading-none">S/{selectedPlacement.pricePEN}</span>
                    <span className="text-[9px] text-gray-400 font-black uppercase mb-1">Carga Local</span>
                 </div>
              </div>

              <div className="min-h-[160px] flex flex-col items-center justify-center w-full relative pt-4">
                 {isPaypalLoading && !paypalError && (
                   <div className="flex flex-col items-center gap-4 text-center">
                      <Loader2 className="animate-spin text-blue-600" size={50} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">CARGANDO MOTOR v26.0...</p>
                   </div>
                 )}

                 {paypalError && (
                    <div className="text-center space-y-4">
                       <p className="text-[10px] text-red-500 font-black uppercase">Falla de Red</p>
                       <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white rounded-full font-black text-[9px] uppercase tracking-widest">Reintentar</button>
                    </div>
                 )}
                 
                 <div ref={paypalContainerRef} className={`w-full ${isPaypalLoading ? 'hidden' : 'block'}`} />
              </div>
              
              <div className="pt-6 border-t border-gray-100 text-center space-y-6">
                 <div className="flex items-center justify-center gap-2 text-gray-400">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <p className="text-[7px] font-black uppercase tracking-[0.3em]">Débito Seguro • HAWKIN B2B NETWORK</p>
                 </div>
                 
                 <button 
                  onClick={() => window.open('https://wa.me/519XXXXXXXX', '_blank')}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl"
                 >
                    <MessageCircle size={20} /> Pago Manual / WhatsApp
                 </button>
              </div>
           </div>
        </div>

        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Presencia 360', icon: <Eye size={24} />, text: 'Tu marca en todo el ecosistema Hawkin.' },
             { title: 'Tráfico Real', icon: <ExternalLink size={24} />, text: 'Enlaces directos hacia tu canal de ventas.' },
             { title: 'Calidad 4K', icon: <Tv size={24} />, text: 'Soporte para videos de alta fidelidad.' }
           ].map((item, i) => (
             <div key={i} className="p-10 rounded-[35px] bg-white/[0.02] border border-white/5 space-y-4 text-center hover:bg-blue-500/5 transition-all">
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
