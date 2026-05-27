'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  Globe, ShoppingBag, Radio, Tv, Target, Layout, ShieldCheck, 
  ExternalLink, Loader2, MessageCircle, Play, CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';

// Planes fuera del componente para evitar re-creación y fallos de hidratación
const AD_PLANS = [
  { id: 'plus', title: 'Plan Plus Streaming', pricePEN: 999, priceUSD: "260.00", placement: 'Banner Principal + Live' },
  { id: 'sidebar', title: 'Sidebar Académica', pricePEN: 699, priceUSD: "180.00", placement: 'Lateral de Cursos' },
  { id: 'native', title: 'Pauta Nativa Radar', pricePEN: 399, priceUSD: "105.00", placement: 'Entre Noticias' },
];

export default function B2BContent() {
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedId, setSelectedId] = useState(AD_PLANS[0].id);
  const [isMounted, setIsMounted] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  const selectedPlacement = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];

  useEffect(() => {
    setIsMounted(true);
    
    // CARGADOR PURO DE PAYPAL
    const CLIENT_ID = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas';
    const scriptId = 'paypal-engine-v22-safe';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&locale=es_PE`;
      script.async = true;
      script.onload = () => setIsPaypalReady(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalReady(true);
    }
  }, []);

  // RENDERIZADOR DE BOTONES
  useEffect(() => {
    if (isPaypalReady && (window as any).paypal && paypalContainerRef.current && isMounted) {
      const container = paypalContainerRef.current;
      container.innerHTML = ''; 

      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 50 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${selectedPlacement.title}`,
                amount: { currency_code: 'USD', value: selectedPlacement.priceUSD }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING', brand_name: 'HAWKIN' }
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log("Pago exitoso", order.id);
            window.location.href = "/b2b?success=true";
          }
        }).render(container);
      } catch (err) {
        console.error("PayPal Interaction Error", err);
      }
    }
  }, [isPaypalReady, selectedId, isMounted, selectedPlacement]);

  if (!isMounted) return null;

  const renderIcon = (id: string) => {
    switch(id) {
      case 'plus': return <Radio className="text-blue-400" />;
      case 'sidebar': return <Layout className="text-blue-300" />;
      case 'native': return <ShoppingBag className="text-blue-200" />;
      default: return <Target />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        {/* TITULACIÓN */}
        <section className="text-center space-y-8 mb-32">
          <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B GLOBAL • VERSIÓN v22.0</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="text-white border-b-8 border-blue-600 uppercase">Comercial.</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
             Activación de pauta publicitaria. Sistema blindado y cobro inmediato.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           {/* PLANES */}
           <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-blue-500 mb-8">Nuestros Planes</h3>
              {AD_PLANS.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedId(ad.id)}
                  className={`w-full p-10 rounded-[30px] border-2 text-left transition-all flex justify-between items-center ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                >
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                         {renderIcon(ad.id)}
                      </div>
                      <div>
                         <p className="text-xl font-bold uppercase italic leading-none">{ad.title}</p>
                         <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">{ad.placement}</p>
                      </div>
                   </div>
                   <p className="text-3xl font-black text-white">S/{ad.pricePEN}</p>
                </button>
              ))}
           </div>

           {/* PASARELA */}
           <div className="p-12 rounded-[50px] bg-white text-black space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={100} className="text-blue-600" /></div>
              
              <div className="space-y-4 relative z-10 text-center md:text-left">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Reserva Confirmada:</p>
                 <h4 className="text-3xl font-black uppercase italic leading-tight text-blue-600">{selectedPlacement?.title}</h4>
                 <p className="text-5xl font-black text-black mt-8 leading-none">
                    S/{selectedPlacement?.pricePEN}
                 </p>
                 <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Cobro Localizado vía PayPal Global</p>
              </div>

              <div className="min-h-[140px] flex flex-col items-center justify-center w-full relative pt-8 border-t border-gray-100">
                 {!isPaypalReady ? (
                   <div className="flex flex-col items-center gap-6">
                      <Loader2 className="animate-spin text-blue-600" size={50} />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">SISTEMA BLINDADO v22.0...</p>
                   </div>
                 ) : (
                   <div ref={paypalContainerRef} className="w-full" />
                 )}
              </div>
              
              <div className="pt-6 text-center">
                 <p className="text-[7px] text-gray-400 font-black uppercase tracking-[0.3em]">Débito Seguro • HAWKIN B2B NETWORK</p>
                 <button 
                  onClick={() => window.open('https://wa.me/519XXXXXXXX', '_blank')}
                  className="mt-6 text-[9px] font-black text-blue-600 border border-blue-600 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
                 >
                    Soporte Manual WhatsApp
                 </button>
              </div>
           </div>
        </div>

        {/* MAPA DE RECURSOS */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'Visibilidad 360', id: 'eye', text: 'Presencia masiva en todo el ecosistema.' },
             { title: 'Clic Directo', id: 'link', text: 'Enlaces inteligentes a tu web.' },
             { title: 'Calidad 4K', id: 'tv', text: 'Soporte para videos de alta fidelidad.' }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[50px] bg-white/[0.02] border border-white/5 space-y-6 text-center hover:bg-white/[0.04] transition-all shadow-lg">
                <div className="text-blue-500 mx-auto w-fit">
                   {item.id === 'eye' ? <Eye size={32} /> : item.id === 'link' ? <ExternalLink size={32} /> : <Tv size={32} />}
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">{item.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed text-center">{item.text}</p>
             </div>
           ))}
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
