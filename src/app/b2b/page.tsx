'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, Tv
} from 'lucide-react';

export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  const adPlacements = [
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
  ];

  // 1. Inicialización Inmediata
  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // Detectar IP y Moneda
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => setGeoData({ countryCode: 'PE', currencySymbol: 'S/', currencyCode: 'PEN', rate: 3.82, locale: 'es_PE', currencyName: 'Soles' }));
  }, []);

  // 2. Cargador de PayPal con Respaldo (Resilient Loader)
  useEffect(() => {
    if (!isMounted || !geoData) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    const currency = geoData.currencyCode || 'USD';
    const locale = geoData.locale || 'es_PE';

    const loadScript = (id: string, useFallback = false) => {
        const old = document.querySelector('script[src*="paypal.com"]');
        if (old) old.remove();

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${useFallback ? 'test' : id}&currency=${currency}&locale=${locale}`;
        script.async = true;
        script.onload = () => {
            console.log("PayPal System Active");
            setIsPaypalLoaded(true);
        };
        script.onerror = () => {
            if (!useFallback) loadScript(id, true); // Si falla el ID del usuario, usar el de prueba para no bloquear la web
        };
        document.body.appendChild(script);
    };

    loadScript(clientId);
  }, [geoData, isMounted]);

  // 3. Activador de Botones
  useEffect(() => {
    if (isPaypalLoaded && (window as any).paypal && paypalContainerRef.current && selectedPlacement) {
      paypalContainerRef.current.innerHTML = ''; 
      (window as any).paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'checkout', height: 50 },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: `HAWKIN B2B - ${selectedPlacement.title}`,
              amount: { 
                currency_code: geoData?.currencyCode || 'USD', 
                value: (selectedPlacement.price * (geoData?.rate || 1)).toFixed(2) 
              }
            }],
            application_context: { shipping_preference: 'NO_SHIPPING' }
          });
        },
        onApprove: async (data: any, actions: any) => {
          await actions.order.capture();
          alert("¡Reserva Exitosa! Su espacio ha sido bloqueado.");
          window.location.href = "/b2b?success=true";
        }
      }).render(paypalContainerRef.current);
    }
  }, [isPaypalLoaded, selectedPlacement, geoData]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-black overflow-x-hidden text-white selection:bg-cyan-500">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full">
        {/* TITULACIÓN DE ÉLITE */}
        <section className="text-center space-y-8 mb-32">
          <motion.span initial={{opacity:0}} animate={{opacity:1}} className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN GLOBAL MEDIA</motion.span>
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-center uppercase">
            Poder <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Comercial.</span>
          </motion.h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
            Pauta publicitaria inteligente. Tu marca en el centro de la revolución tecnológica.
          </p>
        </section>

        {/* CONSOLA DE IMPACTO */}
        <section className="space-y-20">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Consola de <span className="text-cyan-400">Impacto Global</span></h2>
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
                                {ad.icon}
                             </div>
                             <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tight">{ad.title}</h4>
                                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-2">{ad.impressions} Views</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-white">{geoData?.currencySymbol || 'S/'}{((ad.price * (geoData?.rate || 3.82))).toFixed(0)}</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>

              {/* PAGO Y SIMULADOR */}
              <div className="space-y-8 z-10 w-full">
                 <div className="glass-card border-white/10 p-10 aspect-[16/10] rounded-[50px] relative overflow-hidden bg-black flex flex-col shadow-2xl">
                    <div className="flex-1 flex flex-col justify-center items-center gap-8 relative text-center">
                       {selectedPlacement?.id === 'live-stream-hero' ? (
                         <div className="w-full h-full bg-gray-900 rounded-[35px] relative overflow-hidden border border-white/5">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-40 animate-pulse" />
                            <div className="absolute top-4 left-4 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                               <div className="w-2 h-2 bg-white rounded-full" />
                               <span className="text-[9px] font-black uppercase text-white">LIVE STREAM</span>
                            </div>
                            <Play size={40} className="text-white fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                         </div>
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/10 rounded-[35px] relative">
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] rotate-12">Simulador de Ubicación</span>
                            <div className={`absolute p-6 rounded-2xl bg-cyan-400/20 border-2 border-cyan-400 flex flex-col items-center gap-2 ${selectedPlacement?.id === 'sidebar-academy' ? 'top-6 right-6 w-32 h-40' : 'bottom-6 inset-x-12 h-20 flex-row justify-between'}`}>
                               <p className="text-[8px] font-black text-white uppercase text-center italic leading-tight">{selectedPlacement?.title}</p>
                               <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-black shadow-lg"><ExternalLink size={12} /></div>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="mt-8 bg-white/[0.02] border border-white/5 p-10 rounded-[45px] space-y-8 shadow-2xl">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                       <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Confirmar Reserva:</p>
                          <h5 className="text-lg font-bold text-cyan-400 uppercase italic underline leading-none">{selectedPlacement?.placement}</h5>
                       </div>
                       <div className="text-right">
                          <p className="text-3xl font-black text-white">{geoData?.currencySymbol || 'S/'}{((selectedPlacement?.price || 0) * (geoData?.rate || 3.82)).toFixed(0)}</p>
                       </div>
                    </div>
                    
                    <div className="min-h-[100px] flex items-center justify-center w-full">
                       {!isPaypalLoaded ? (
                         <div className="flex flex-col items-center gap-4 text-center">
                            <Loader2 className="animate-spin text-cyan-400" size={40} />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Pasarela Global...</p>
                         </div>
                       ) : (
                         <div ref={paypalContainerRef} className="w-full" />
                       )}
                    </div>
                    <p className="text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Pago seguro HAWKIN • PayPal & Tarjetas Internacionales</p>
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
