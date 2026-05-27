'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, CreditCard, Tv
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
    { id: 'plus', title: 'Plus: Streaming & Hero', price: 999, usd: 261, placement: 'Banner Principal + Live' },
    { id: 'sidebar', title: 'Sidebar en Academia', price: 699, usd: 183, placement: 'Lateral de Cursos' },
    { id: 'inline', title: 'Nativo en Radar', price: 399, usd: 104, placement: 'Entre Noticias' },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // Obtener Geodata real sin bloquear
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => { if(data?.countryCode) setGeoData(data); })
      .catch(() => console.log("Geodata local activa"));

    // Temporizador de rescate (6 segundos)
    const timer = setTimeout(() => {
      if (!(window as any).paypal) setShowRescue(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [adPlacements]);

  // MOTOR DE CARGA FORZADA (CON CLIENT ID COMPLETO DE 80 CARACTERES)
  useEffect(() => {
    if (!isMounted) return;

    // CLIENT ID REAL RECUPERADO DE LOGS
    const REAL_CLIENT_ID = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKliwE1bbS33tyoI2QT6Dak6VhvUFdv8fenAfboNfcrs7xas';
    const scriptId = 'paypal-engine-v12-master';

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      // Usamos USD internamente para asegurar que el pago sea aceptado SIEMPRE
      script.src = `https://www.paypal.com/sdk/js?client-id=${REAL_CLIENT_ID}&currency=USD&locale=${geoData.locale || 'es_PE'}&components=buttons&disable-funding=venmo`;
      script.async = true;
      script.onload = () => {
        console.log("PayPal SDK v12 Activated");
        setIsPaypalReady(true);
      };
      document.body.appendChild(script);
    } else {
      setIsPaypalReady(true);
    }
  }, [isMounted, geoData.locale]);

  // RENDERIZADOR DE BOTONES
  useEffect(() => {
    if (isPaypalReady && (window as any).paypal && paypalRef.current && selectedPlacement) {
      const container = paypalRef.current;
      container.innerHTML = ''; 

      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'checkout', height: 50 },
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
            const order = await actions.order.capture();
            alert(`¡RESERVA EXITOSA! ID: ${order.id}. Su anuncio se activará en breve.`);
            window.location.href = "/b2b?success=true";
          }
        }).render(container);
      } catch (err) {
        console.error("PayPal Render Error", err);
      }
    }
  }, [isPaypalReady, selectedPlacement]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-black overflow-x-hidden text-white font-sans selection:bg-cyan-500">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full">
        {/* CABECERA */}
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B GLOBAL MEDIA</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            Impulso <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Empresarial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Publicidad inteligente con cobro automático. Tu marca en el centro del ecosistema tecnológico.
          </p>
        </section>

        {/* CONSOLA DE IMPACTO */}
        <section className="space-y-20">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Consola de <span className="text-cyan-400">Impacto Real</span></h2>
              <div className="flex items-center justify-center gap-4">
                 <div className="bg-cyan-500/10 text-cyan-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-400/20 flex items-center gap-2">
                   <Globe size={14} /> IP: {geoData?.countryCode || 'PE'}
                 </div>
                 <div className="bg-white/5 text-gray-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                   Sincronizado: {geoData?.currencyName || 'Soles'}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-white/[0.01] border border-white/5 p-8 md:p-16 rounded-[60px] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              {/* PLANES */}
              <div className="space-y-4 z-10 w-full">
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
                       <p className="text-2xl font-black text-white">S/{ad.price}</p>
                    </button>
                 ))}
              </div>

              {/* SIMULADOR Y PAGO */}
              <div className="space-y-8 z-10 w-full relative">
                 <div className="glass-card border-white/10 p-10 aspect-[16/10] rounded-[50px] relative overflow-hidden bg-black flex flex-col shadow-2xl">
                    <div className="flex-1 flex flex-col justify-center items-center gap-8 relative text-center">
                       {selectedPlacement?.id === 'plus' ? (
                         <div className="w-full h-full bg-gray-900 rounded-[35px] relative overflow-hidden border border-white/5">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-40 animate-pulse" />
                            <div className="absolute top-4 left-4 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                               <div className="w-2 h-2 bg-white rounded-full" />
                               <span className="text-[9px] font-black uppercase text-white">LIVE STREAM</span>
                            </div>
                            <Play size={40} className="text-white fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-xl font-black text-[9px] uppercase shadow-xl">
                               <ExternalLink size={12} /> Visitar Web
                            </div>
                         </div>
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/10 rounded-[35px] relative">
                            <div className={`absolute p-6 rounded-2xl bg-cyan-400/20 border-2 border-cyan-400 flex flex-col items-center gap-2 ${selectedPlacement?.id === 'sidebar' ? 'top-6 right-6 w-32 h-40' : 'bottom-6 inset-x-12 h-20 flex-row justify-between'}`}>
                               <p className="text-[8px] font-black text-white uppercase text-center italic">{selectedPlacement?.title}</p>
                               <ExternalLink size={14} className="text-cyan-400" />
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 {/* PASARELA DE PAGO EXPRESS */}
                 <div className="mt-8 bg-white/[0.02] border border-white/5 p-10 rounded-[45px] space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Confirmar Reserva:</p>
                          <h5 className="text-lg font-bold text-white uppercase italic underline leading-none">{selectedPlacement?.placement}</h5>
                       </div>
                       <div className="text-right">
                          <p className="text-3xl font-black text-cyan-400 leading-none">S/{selectedPlacement?.price}</p>
                       </div>
                    </div>
                    
                    <div className="min-h-[140px] flex flex-col items-center justify-center w-full relative">
                       {!isPaypalReady && !showRescue && (
                         <div className="flex flex-col items-center gap-6">
                            <Loader2 className="animate-spin text-cyan-400" size={50} />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Iniciando Pasarela Global...</p>
                         </div>
                       )}
                       
                       <div ref={paypalRef} className={`w-full ${isPaypalReady ? 'block' : 'hidden'}`} />

                       {/* RESCATE POR WHATSAPP */}
                       {showRescue && !isPaypalReady && (
                         <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center space-y-6 w-full">
                            <p className="text-[10px] text-red-500 font-black uppercase">La conexión automática ha tardado demasiado.</p>
                            <button 
                              onClick={() => window.open('https://wa.me/519XXXXXXXX', '_blank')}
                              className="w-full py-6 bg-green-600 hover:bg-green-500 text-white rounded-[30px] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all shadow-2xl"
                            >
                               <MessageCircle size={20} /> PAGAR POR WHATSAPP (DIRECTO)
                            </button>
                         </motion.div>
                       )}
                    </div>
                    <p className="text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Débito Seguro HAWKIN • PayPal & Tarjetas Globales</p>
                 </div>
              </div>
           </div>
        </section>

        {/* CARGA DE MATERIAL */}
        <div className="mt-40 glass-card p-20 rounded-[80px] text-center space-y-8 bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl relative overflow-hidden">
           <UploadCloud className="text-cyan-400 mx-auto" size={48} />
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Tu Publicidad <span className="text-cyan-400 uppercase">Sin Fronteras</span></h2>
           <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed text-lg">
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
