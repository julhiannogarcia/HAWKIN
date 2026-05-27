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

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  // Precios finales solicitados por el usuario
  const adPlacements = useMemo(() => [
    { id: 'plus', title: 'Plus: Streaming & Hero', price: 999, placement: 'Banner Principal + Live' },
    { id: 'sidebar', title: 'Sidebar en Academia', price: 699, placement: 'Lateral de Cursos' },
    { id: 'inline', title: 'Nativo en Radar', price: 399, placement: 'Entre Noticias' },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // Obtener GeoData de forma silenciosa
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => setGeoData({ countryCode: 'PE', currencyCode: 'PEN', locale: 'es_PE', currencySymbol: 'S/' }));
  }, [adPlacements]);

  // CARGADOR DE PAYPAL DEFINITIVO (Moneda Local Real)
  useEffect(() => {
    if (!isMounted || !geoData) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    const currency = geoData.currencyCode === 'PEN' ? 'PEN' : 'USD'; // Forzamos PEN si es Perú
    const locale = geoData.locale || 'es_PE';

    const scriptId = 'paypal-ultimate-v9';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=${locale}&components=buttons`;
    script.async = true;
    script.onload = () => {
      console.log("PayPal System Operational");
      setIsPaypalLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
        // No removemos para evitar parpadeos
    };
  }, [geoData, isMounted]);

  // RENDERIZADOR DE BOTONES (Garantizado)
  useEffect(() => {
    if (isPaypalLoaded && (window as any).paypal && paypalContainerRef.current && selectedPlacement && geoData) {
      const container = paypalContainerRef.current;
      container.innerHTML = ''; 

      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${selectedPlacement.title}`,
                amount: { 
                    currency_code: geoData.currencyCode === 'PEN' ? 'PEN' : 'USD', 
                    value: selectedPlacement.price.toString() 
                }
              }],
              application_context: { 
                shipping_preference: 'NO_SHIPPING',
                brand_name: 'HAWKIN'
              }
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            alert(`¡TRANSACCIÓN EXITOSA! ID: ${order.id}. Bienvenido al ecosistema.`);
            window.location.href = "/b2b?success=true";
          }
        }).render(container);
      } catch (err) {
        console.error("PayPal Render Fail", err);
      }
    }
  }, [isPaypalLoaded, selectedPlacement, geoData]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 overflow-x-hidden font-sans">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B GLOBAL</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            Impulso <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Empresarial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Plataforma de pauta comercial de élite. Precios en moneda local y pago instantáneo.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-white/[0.01] border border-white/5 p-8 md:p-16 rounded-[60px] backdrop-blur-3xl shadow-2xl relative">
           
           {/* PLANES CON PRECIOS SOLICITADOS */}
           <div className="space-y-6 w-full">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-cyan-400 mb-8 text-center sm:text-left">Nuestros Planes</h3>
              {adPlacements.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedPlacement(ad)}
                  className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex justify-between items-center ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                >
                   <div>
                      <p className="text-xl font-bold uppercase italic">{ad.title}</p>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{ad.placement}</p>
                   </div>
                   <p className="text-2xl font-black text-white">{geoData?.currencySymbol || 'S/'}{ad.price}</p>
                </button>
              ))}
           </div>

           {/* PASARELA DE PAGO */}
           <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/10 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><CreditCard size={120} /></div>
              
              <div className="space-y-4 relative z-10 text-center sm:text-left">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Resumen de Reserva:</p>
                 <h4 className="text-2xl font-black uppercase italic text-white leading-none">{selectedPlacement?.placement}</h4>
                 <p className="text-4xl font-black text-cyan-400 mt-6">
                    {geoData?.currencySymbol || 'S/'}{selectedPlacement?.price}
                 </p>
                 <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Moneda Local: {geoData?.currencyName || 'Soles'}</p>
              </div>

              <div className="min-h-[140px] flex flex-col items-center justify-center w-full relative">
                 {!isPaypalLoaded ? (
                   <div className="flex flex-col items-center gap-6">
                      <Loader2 className="animate-spin text-cyan-400" size={50} />
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Sistema Comercial...</p>
                   </div>
                 ) : (
                   <div ref={paypalContainerRef} className="w-full" />
                 )}
              </div>
              
              <div className="pt-6 border-t border-white/5 text-center">
                 <p className="text-[7px] text-gray-700 font-black uppercase tracking-[0.3em]">Débito Seguro • PayPal Internacional Network</p>
              </div>
           </div>
        </div>

        {/* CARGA DE MATERIAL */}
        <div className="mt-40 glass-card p-20 rounded-[80px] text-center space-y-10 bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl">
           <UploadCloud className="text-cyan-400 mx-auto" size={48} />
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Tu Publicidad <span className="text-cyan-400">Sin Límites</span></h2>
           <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
             Tras confirmar tu pago, el satélite HAWKIN te permitirá cargar tu video o arte interactivo de forma inmediata.
           </p>
           <button className="px-16 py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/10">Seleccionar Archivo</button>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
