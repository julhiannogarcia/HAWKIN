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

export default function B2BContent() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>({ 
    countryCode: 'PE', 
    currencySymbol: 'S/', 
    currencyCode: 'PEN', 
    rate: 3.82, 
    locale: 'es_PE', 
    currencyName: 'Soles' 
  });
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [showRescue, setShowRescue] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  const adPlacements = useMemo(() => [
    { id: 'plus', title: 'Plus: Streaming & Hero', price: 999, usd: 260, placement: 'Banner Principal + Live' },
    { id: 'sidebar', title: 'Sidebar en Academia', price: 699, usd: 180, placement: 'Lateral de Cursos' },
    { id: 'inline', title: 'Nativo en Radar', price: 399, usd: 105, placement: 'Entre Noticias' },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // Intentar obtener geo real pero sin bloquear NADA
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => { if(data?.countryCode) setGeoData(data); })
      .catch(() => console.log("Modo local activo"));

    // Rescate: Si en 5 segundos no hay PayPal, mostrar WhatsApp
    const timer = setTimeout(() => {
      if (!(window as any).paypal) setShowRescue(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [adPlacements]);

  // CARGADOR DE PAYPAL (USD PARA ESTABILIDAD TOTAL)
  useEffect(() => {
    if (!isMounted) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    const scriptId = 'paypal-engine-ultimate';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&locale=es_PE&disable-funding=venmo`;
      script.async = true;
      script.onload = () => setIsPaypalReady(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalReady(true);
    }
  }, [isMounted]);

  // RENDERIZADOR DE BOTONES (SIMPLIFICADO)
  useEffect(() => {
    if (isPaypalReady && (window as any).paypal && paypalRef.current && selectedPlacement) {
      const container = paypalRef.current;
      container.innerHTML = ''; 

      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${selectedPlacement.title}`,
                amount: { 
                  currency_code: 'USD', 
                  value: selectedPlacement.usd.toString() 
                }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING' }
            });
          },
          onApprove: async (data: any, actions: any) => {
            await actions.order.capture();
            alert("¡PAGO PROCESADO! Tu espacio publicitario ha sido reservado.");
            window.location.href = "/b2b?success=true";
          }
        }).render(container);
      } catch (err) {
        console.error("PayPal UI Error", err);
      }
    }
  }, [isPaypalReady, selectedPlacement]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B SYSTEM</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            Poder <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
            Pauta publicitaria de élite. Pago express en Soles con tecnología global.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-white/[0.01] border border-white/5 p-8 md:p-16 rounded-[60px] backdrop-blur-3xl shadow-2xl relative">
           
           {/* PLANES */}
           <div className="space-y-6 w-full">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-cyan-400 mb-8">Nuestros Planes</h3>
              {adPlacements.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedPlacement(ad)}
                  className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex justify-between items-center ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                >
                   <div>
                      <p className="text-xl font-bold uppercase italic">{ad.title}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{ad.placement}</p>
                   </div>
                   <p className="text-2xl font-black text-white">S/{ad.price}</p>
                </button>
              ))}
           </div>

           {/* PASARELA DE PAGO */}
           <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/10 space-y-10 relative">
              <div className="flex justify-between items-end border-b border-white/5 pb-8">
                 <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Confirmar Reserva:</p>
                    <h5 className="text-lg font-bold text-white uppercase italic leading-none">{selectedPlacement?.placement}</h5>
                 </div>
                 <p className="text-3xl font-black text-cyan-400 leading-none">S/{selectedPlacement?.price}</p>
              </div>

              <div className="min-h-[140px] flex flex-col items-center justify-center w-full">
                 {!isPaypalReady && !showRescue && (
                   <div className="flex flex-col items-center gap-6">
                      <Loader2 className="animate-spin text-cyan-400" size={50} />
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Pasarela...</p>
                   </div>
                 )}
                 
                 <div ref={paypalRef} className={`w-full ${isPaypalReady ? 'block' : 'hidden'}`} />

                 {/* BOTÓN DE RESCATE (WHATSAPP) */}
                 {showRescue && !isPaypalReady && (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center space-y-6 w-full">
                      <p className="text-[10px] text-red-500 font-black uppercase">La conexión automática ha tardado demasiado.</p>
                      <button 
                        onClick={() => window.open('https://wa.me/519XXXXXXXX', '_blank')}
                        className="w-full py-6 bg-green-600 hover:bg-green-500 text-white rounded-[30px] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all shadow-2xl"
                      >
                         <MessageCircle size={20} /> PAGAR POR WHATSAPP (DIRECTO)
                      </button>
                      <button onClick={() => window.location.reload()} className="text-[9px] font-black text-gray-700 uppercase underline">Reintentar Conexión</button>
                   </motion.div>
                 )}
              </div>
              <p className="text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Pago Seguro HAWKIN • PayPal Global Service</p>
           </div>
        </div>

        {/* CARGA DE MATERIAL */}
        <div className="mt-40 glass-card p-20 rounded-[80px] text-center space-y-8 bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl">
           <UploadCloud className="text-cyan-400 mx-auto" size={48} />
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Carga tu <span className="text-cyan-400 uppercase">Material de Élite</span></h2>
           <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
             Tras confirmar tu pago, el sistema HAWKIN te permitirá cargar tu video o arte interactivo de forma inmediata.
           </p>
           <button className="px-16 py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-xl">Seleccionar Archivo</button>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
