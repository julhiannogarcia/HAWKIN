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
// COMPONENTE DE BOTÓN DE PAYPAL (SIMPLIFICADO AL MÁXIMO)
// =====================================================================
const PaypalButtonB2B = ({ placement, amount, currency }: { placement: any, amount: string, currency: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderButtons = () => {
      if ((window as any).paypal && containerRef.current) {
        containerRef.current.innerHTML = ''; 
        try {
          (window as any).paypal.Buttons({
            style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  description: `HAWKIN B2B - ${placement.title}`,
                  amount: { currency_code: currency, value: amount }
                }],
                application_context: { shipping_preference: 'NO_SHIPPING' }
              });
            },
            onApprove: async (data: any, actions: any) => {
              const order = await actions.order.capture();
              alert(`¡PAGO RECIBIDO! ID: ${order.id}. Tu anuncio se activará en breve.`);
              window.location.href = "/b2b?success=true";
            }
          }).render(containerRef.current);
        } catch (e) {
          console.error("PayPal UI Error", e);
        }
      }
    };

    // Pequeño delay para asegurar que el DOM está listo
    const timer = setTimeout(renderButtons, 500);
    return () => clearTimeout(timer);
  }, [placement.id, amount, currency]);

  return <div ref={containerRef} className="w-full min-h-[50px]" />;
};

// =====================================================================
// PÁGINA B2B PRINCIPAL
// =====================================================================
export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);

  const adPlacements = useMemo(() => [
    { id: 'plus', title: 'Plus: Streaming & Hero', price: 499, placement: 'Banner Principal + Live' },
    { id: 'sidebar', title: 'Sidebar en Academia', price: 299, placement: 'Lateral de Cursos' },
    { id: 'inline', title: 'Nativo en Radar', price: 199, placement: 'Entre Noticias' },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // 1. Obtener ubicación rápido
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => setGeoData({ currencyCode: 'USD', currencySymbol: 'S/', rate: 3.82, locale: 'es_PE' }));
  }, [adPlacements]);

  // 2. Carga forzada del motor de PayPal
  useEffect(() => {
    if (!isMounted) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    
    if (!(window as any).paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&locale=es_PE`;
      script.async = true;
      script.onload = () => setIsPaypalReady(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalReady(true);
    }
  }, [isMounted]);

  if (!isMounted) return null;

  const currentPrice = ((selectedPlacement?.price || 0) * (geoData?.rate || 3.82)).toFixed(0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        {/* TITULACIÓN PRO */}
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B GLOBAL</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            Impulso <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Digital.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Publicidad inteligente con cobro automático. Tu marca en el centro del ecosistema.
          </p>
        </section>

        {/* CONSOLA COMERCIAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
           
           {/* LADO IZQUIERDO: PLANES */}
           <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-cyan-400">Planes de Pauta</h3>
              {adPlacements.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedPlacement(ad)}
                  className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex justify-between items-center ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                >
                   <div className="space-y-1">
                      <p className="text-xl font-bold uppercase italic">{ad.title}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{ad.placement}</p>
                   </div>
                   <p className="text-2xl font-black">{geoData?.currencySymbol || 'S/'}{((ad.price * (geoData?.rate || 3.82))).toFixed(0)}</p>
                </button>
              ))}
           </div>

           {/* LADO DERECHO: PASARELA DE PAGO */}
           <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><CreditCard size={100} /></div>
              
              <div className="space-y-8 relative z-10">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Resumen de Inversión:</p>
                    <h4 className="text-2xl font-black uppercase italic text-white leading-none">{selectedPlacement?.title}</h4>
                    <p className="text-4xl font-black text-cyan-400 mt-4">
                      {geoData?.currencySymbol || 'S/'}{currentPrice}
                    </p>
                 </div>

                 <div className="pt-8 border-t border-white/5 min-h-[150px] flex items-center justify-center">
                    {!isPaypalReady ? (
                      <div className="text-center space-y-4">
                         <Loader2 className="animate-spin text-cyan-400 mx-auto" size={40} />
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Sistema de Pago...</p>
                      </div>
                    ) : (
                      <PaypalButtonB2B 
                        placement={selectedPlacement}
                        amount={selectedPlacement.price.toString()}
                        currency="USD"
                      />
                    )}
                 </div>

                 {/* BOTÓN DE EMERGENCIA */}
                 <div className="pt-4 text-center">
                    <p className="text-[8px] text-gray-700 font-black uppercase mb-4 tracking-widest">¿Problemas con el pago automático?</p>
                    <button 
                      onClick={() => window.open('mailto:julhianno@aihawkin.com', '_self')}
                      className="text-[9px] font-black text-white bg-white/5 border border-white/10 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                    >
                       Pagar por Transferencia / Manual
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* CARGA DE MATERIAL */}
        <div className="mt-40 glass-card p-12 md:p-24 rounded-[80px] text-center space-y-10 shadow-2xl">
           <div className="w-20 h-20 bg-cyan-400/10 rounded-full flex items-center justify-center mx-auto text-cyan-400"><UploadCloud size={40} /></div>
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Carga tu <span className="text-cyan-400">Material de Élite</span></h2>
           <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
             Tras el pago, nuestro sistema te permitirá subir tu video o arte interactivo. 
             La pauta se activará automáticamente en todo el ecosistema global.
           </p>
           <button className="px-16 py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-xl">Seleccionar Archivo</button>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
