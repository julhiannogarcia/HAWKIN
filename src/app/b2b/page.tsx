'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, CreditCard
} from 'lucide-react';

// =====================================================================
// COMPONENTE DE BOTÓN DE PAYPAL (EXTERIOR PARA MÁXIMA ESTABILIDAD)
// =====================================================================
const PaypalButtonB2B = ({ placement, amount, currency, locale, isScriptLoaded }: { 
  placement: any, 
  amount: string, 
  currency: string, 
  locale: string,
  isScriptLoaded: boolean 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScriptLoaded && (window as any).paypal && containerRef.current && placement) {
      const container = containerRef.current;
      container.innerHTML = ''; // Limpiar previo

      try {
        (window as any).paypal.Buttons({
          style: { 
            layout: 'vertical', 
            color: 'gold', 
            shape: 'rect', 
            label: 'checkout', 
            height: 50 
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${placement.title}`,
                amount: { 
                  currency_code: currency, 
                  value: amount 
                }
              }],
              application_context: { 
                shipping_preference: 'NO_SHIPPING',
                brand_name: 'HAWKIN INTELLIGENCE'
              }
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            alert(`¡PAGO EXITOSO! ID: ${order.id}. Tu pauta ha sido reservada.`);
            window.location.href = "/b2b?success=true";
          },
          onError: (err: any) => {
            console.error("PayPal Interaction Error:", err);
          }
        }).render(container);
      } catch (e) {
        console.error("PayPal Buttons Render Fail:", e);
      }
    }
  }, [isScriptLoaded, placement?.id, amount, currency, locale]);

  return <div ref={containerRef} className="w-full min-h-[50px]" />;
};

// =====================================================================
// PÁGINA B2B v10.0 - FIX DEFINITIVO
// =====================================================================
export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);

  const adPlacements = useMemo(() => [
    { id: 'plus', title: 'Plus: Streaming & Hero', price: 999, placement: 'Banner Principal + Live' },
    { id: 'sidebar', title: 'Sidebar en Academia', price: 699, placement: 'Lateral de Cursos' },
    { id: 'inline', title: 'Nativo en Radar', price: 399, placement: 'Entre Noticias' },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // Obtener IP, Moneda e Idioma real
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => {
        setGeoData({ countryCode: 'PE', currencySymbol: 'S/', currencyCode: 'PEN', rate: 1, locale: 'es_PE', currencyName: 'Soles' });
      });
  }, [adPlacements]);

  // CARGADOR FORZADO DEL SDK DE PAYPAL
  useEffect(() => {
    if (!geoData || !isMounted) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    // Moneda del cobro: PEN es soportado por PayPal para algunos comercios, si falla el script cargaremos USD
    const currency = geoData.currencyCode || 'USD';
    const locale = geoData.locale || 'es_PE';

    const scriptId = 'paypal-v10-script';
    if (document.getElementById(scriptId)) {
        if ((window as any).paypal) setIsPaypalReady(true);
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=${locale}&components=buttons&disable-funding=credit,card`;
    script.async = true;
    script.onload = () => {
      console.log(`PayPal System Active: ${currency}`);
      setIsPaypalReady(true);
    };
    script.onerror = () => {
        console.error("PEN not supported, retrying with USD");
        script.remove();
        const fallback = document.createElement('script');
        fallback.id = scriptId;
        fallback.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&locale=${locale}`;
        fallback.async = true;
        fallback.onload = () => setIsPaypalReady(true);
        document.body.appendChild(fallback);
    };
    document.body.appendChild(script);

    return () => {
      // Dejamos el script para evitar reinicializaciones
    };
  }, [geoData, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full">
        {/* TITULACIÓN */}
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B GLOBAL MEDIA</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-center uppercase">
            Poder <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
            Pauta publicitaria inteligente con localización por IP. Sistema de cobro global verificado.
          </p>
        </section>

        {/* CONSOLA PRINCIPAL */}
        <section className="space-y-20">
           <div className="text-center">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4 text-center">Consola de <span className="text-cyan-400 uppercase">Impacto Global</span></h2>
              <div className="flex items-center justify-center gap-4">
                 <span className="bg-cyan-500/10 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-400/20">
                   IP Detectada: {geoData?.countryCode || 'PE'}
                 </span>
                 <span className="bg-white/5 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                   Moneda: {geoData?.currencyName || 'Soles'}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-white/[0.01] border border-white/5 p-8 md:p-16 rounded-[60px] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              {/* PLANES */}
              <div className="space-y-4 z-10 w-full">
                 {adPlacements.map((ad) => (
                    <button 
                      key={ad.id}
                      onClick={() => setSelectedPlacement(ad)}
                      className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex flex-col gap-4 group ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                    >
                       <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlacement?.id === ad.id ? 'bg-cyan-400 text-black shadow-[0_0_20px_#22d3ee]' : 'bg-white/5 text-gray-500'}`}>
                                <ShoppingBag size={24} />
                             </div>
                             <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tight leading-none">{ad.title}</h4>
                                <p className="text-[9px] text-cyan-500 font-bold uppercase tracking-widest mt-2">{ad.placement}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-white">{geoData?.currencySymbol || 'S/'}{ad.price}</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>

              {/* PAGO EXPRESS */}
              <div className="space-y-8 z-10 w-full">
                 <div className="p-10 rounded-[45px] bg-white/[0.02] border border-white/10 space-y-10 shadow-2xl text-center sm:text-left">
                    <div className="flex justify-between items-end border-b border-white/5 pb-8">
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Confirmar Reserva:</p>
                          <h5 className="text-lg font-bold text-white uppercase italic leading-none">{selectedPlacement?.title}</h5>
                       </div>
                       <p className="text-3xl font-black text-cyan-400 leading-none">{geoData?.currencySymbol || 'S/'}{selectedPlacement?.price}</p>
                    </div>

                    <div className="min-h-[140px] flex flex-col items-center justify-center w-full relative">
                       {!isPaypalReady ? (
                         <div className="flex flex-col items-center gap-6">
                            <Loader2 className="animate-spin text-cyan-400" size={50} />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Detectando País e Idioma...</p>
                         </div>
                       ) : (
                         <PaypalButtonB2B 
                            placement={selectedPlacement}
                            amount={selectedPlacement.price.toString()}
                            currency={geoData?.currencyCode === 'PEN' ? 'PEN' : 'USD'}
                            locale={geoData?.locale || 'es_PE'}
                            isScriptLoaded={isPaypalReady}
                         />
                       )}
                    </div>
                    
                    <p className="text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Pago seguro HAWKIN • PayPal Internacional Network</p>
                 </div>
              </div>
           </div>
        </section>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
