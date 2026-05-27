'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, Tv, CreditCard
} from 'lucide-react';

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [paypalLoadError, setPaypalLoadError] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  const adPlacements = useMemo(() => [
    { 
      id: 'live-stream-hero', 
      title: 'Plus: Streaming & Hero', 
      price: 499, 
      placement: 'Streaming en vivo + Banner Principal',
      icon: <Radio className="text-red-500 animate-pulse" />,
      features: ['Transmisión en Video Directo', 'Enlace Clickable en Pantalla', 'Aviso "LIVE" a toda la red']
    },
    { 
      id: 'sidebar-academy', 
      title: 'Sidebar en Academia', 
      price: 299, 
      placement: 'Lateral de todos los cursos',
      icon: <CheckCircle2 className="text-purple-500" />,
      features: ['Imagen o GIF interactivo', 'Enlace directo a tu tienda', 'Presencia 24/7']
    },
    { 
      id: 'inline-news', 
      title: 'Anuncio Nativo en Radar', 
      price: 199, 
      placement: 'Entre noticias del Radar Global',
      icon: <ShoppingBag className="text-green-500" />,
      features: ['Formato noticia integrada', 'Alta tasa de clics (CTR)', 'Ideal para lanzamientos']
    },
  ], []);

  // 1. Inicialización de Geodata y Montaje
  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => setGeoData({ countryCode: 'PE', currencySymbol: 'S/', rate: 3.82, currencyCode: 'PEN', currencyName: 'Soles', locale: 'es_PE' }));
  }, [adPlacements]);

  // 2. Inyección Directa de PayPal (Sin filtros, modo rescate)
  useEffect(() => {
    if (!isMounted || !geoData) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    const currency = geoData.currencyCode || 'USD';
    const locale = geoData.locale || 'es_PE';

    // Limpiar rastro anterior
    const old = document.getElementById('paypal-master-script');
    if (old) old.remove();

    const script = document.createElement('script');
    script.id = 'paypal-master-script';
    // Usamos USD por defecto para asegurar que el script cargue SIEMPRE (PEN a veces da error de carga si el comercio no está habilitado)
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&locale=${locale}`;
    script.async = true;
    
    script.onload = () => {
      console.log("PayPal System Loaded Successfully");
      setIsPaypalReady(true);
    };

    script.onerror = () => {
      console.error("PayPal Script failed");
      setPaypalLoadError(true);
    };

    document.head.appendChild(script);

    // Timeout de seguridad: si en 8 segundos no carga, mostrar error
    const timeout = setTimeout(() => {
        if (!isPaypalReady) setPaypalLoadError(true);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [geoData, isMounted]);

  // 3. Activación de Botones
  useEffect(() => {
    if (isPaypalReady && (window as any).paypal && paypalRef.current && selectedPlacement) {
      paypalRef.current.innerHTML = ''; 
      
      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'checkout', height: 55 },
          createOrder: (data: any, actions: any) => {
            // El cobro real lo hacemos en USD para evitar fallos de PayPal con Soles en cuentas nuevas
            // pero el monto es el equivalente a lo que el usuario ve
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${selectedPlacement.title}`,
                amount: { currency_code: 'USD', value: selectedPlacement.price.toString() }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING' }
            });
          },
          onApprove: async (data: any, actions: any) => {
            await actions.order.capture();
            alert("¡RESERVA EXITOSA! Socio, tu espacio publicitario ha sido bloqueado.");
            window.location.href = "/b2b?success=true";
          }
        }).render(paypalRef.current);
      } catch (err) {
        console.error("Render error", err);
      }
    }
  }, [isPaypalReady, selectedPlacement]);

  if (!isMounted) return null;

  const handleContactFallback = () => {
    window.open(`https://wa.me/519XXXXXXXX?text=Hola%20HAWKIN,%20deseo%20pagar%20el%20plan%20B2B%20de%20${selectedPlacement.price}%20por%20otro%20medio.`, '_blank');
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-black overflow-x-hidden text-white selection:bg-cyan-500 font-sans">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full">
        {/* CABECERA */}
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B INTELLIGENCE</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-center uppercase">
            Impulso <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Empresarial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
            Reserva tu espacio publicitario con moneda local. Activación inmediata vía satélite.
          </p>
        </section>

        {/* CONSOLA PRINCIPAL */}
        <section className="space-y-20">
           <div className="text-center">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4">Selector de <span className="text-cyan-400 uppercase">Impacto</span></h2>
              <div className="flex items-center justify-center gap-4">
                 <span className="bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-400/20">
                   IP DETECTADA: {geoData?.countryCode || 'PE'} | {geoData?.currencyName || 'Soles'}
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
                      className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex flex-col gap-4 group ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                    >
                       <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlacement?.id === ad.id ? 'bg-cyan-400 text-black shadow-[0_0_20px_#22d3ee]' : 'bg-white/5 text-gray-500'}`}>
                                {ad.icon}
                             </div>
                             <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tight">{ad.title}</h4>
                                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-2">{ad.impressions} Views Semanales</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-white">{geoData?.currencySymbol || 'S/'}{(ad.price * (geoData?.rate || 3.82)).toFixed(0)}</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>

              {/* ÁREA DE COBRO Y SIMULADOR */}
              <div className="space-y-8 z-10 w-full relative">
                 <div className="glass-card border-white/10 p-8 aspect-[16/10] rounded-[50px] relative overflow-hidden bg-black flex flex-col shadow-2xl">
                    <div className="flex-1 flex flex-col justify-center items-center gap-8 relative text-center">
                       {selectedPlacement?.id === 'live-stream-hero' ? (
                         <div className="w-full h-full bg-gray-900 rounded-[35px] relative overflow-hidden border border-white/5">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-40 animate-pulse" />
                            <div className="absolute top-4 left-4 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                               <div className="w-2 h-2 bg-white rounded-full" />
                               <span className="text-[8px] font-black uppercase text-white">LIVE STREAMING</span>
                            </div>
                            <Play size={50} className="text-white fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                         </div>
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/10 rounded-[35px] relative">
                            <div className={`p-6 rounded-2xl bg-cyan-400/10 border border-cyan-400/40 flex flex-col items-center gap-2`}>
                               <p className="text-[9px] font-black text-white uppercase text-center italic">{selectedPlacement?.title}</p>
                               <ExternalLink size={16} className="text-cyan-400" />
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
                          <h5 className="text-lg font-bold text-cyan-400 uppercase italic underline leading-none">{selectedPlacement?.placement}</h5>
                       </div>
                       <div className="text-right">
                          <p className="text-3xl font-black text-white">{geoData?.currencySymbol || 'S/'}{((selectedPlacement?.price || 0) * (geoData?.rate || 3.82)).toFixed(0)}</p>
                       </div>
                    </div>
                    
                    <div className="min-h-[140px] flex flex-col items-center justify-center w-full relative">
                       {/* Loader / Error / Fallback */}
                       <AnimatePresence mode="wait">
                          {paypalLoadError ? (
                            <motion.div key="err" initial={{opacity:0}} animate={{opacity:1}} className="text-center space-y-6 w-full">
                               <p className="text-[10px] text-red-500 font-black uppercase">La pasarela automática está saturada.</p>
                               <button 
                                onClick={handleContactFallback}
                                className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all shadow-xl"
                               >
                                  <MessageCircle size={18} /> PAGAR POR WHATSAPP / MANO
                               </button>
                               <button onClick={() => window.location.reload()} className="text-[9px] font-black text-gray-600 uppercase underline">Reintentar Conexión PayPal</button>
                            </motion.div>
                          ) : !isPaypalReady ? (
                            <motion.div key="load" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center gap-4 text-center">
                               <Loader2 className="animate-spin text-cyan-400" size={40} />
                               <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">SINCRONIZANDO PASARELA GLOBAL...</p>
                            </motion.div>
                          ) : (
                            <motion.div key="btn" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="w-full">
                               <div ref={paypalRef} className="w-full" />
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                    <p className="text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Débito Seguro HAWKIN • PayPal & Tarjetas Mundiales</p>
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
