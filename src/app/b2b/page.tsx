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
  const [geoData, setGeoData] = useState<any>({ 
    countryCode: 'PE', 
    currencySymbol: 'S/', 
    currencyCode: 'PEN', 
    rate: 3.82, 
    locale: 'es_PE', 
    currencyName: 'Soles' 
  });
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [showRescueButton, setShowRescueButton] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  const adPlacements = useMemo(() => [
    { id: 'plus', title: 'Plus: Streaming & Hero', price: 499, placement: 'Banner Principal + Live' },
    { id: 'sidebar', title: 'Sidebar en Academia', price: 299, placement: 'Lateral de Cursos' },
    { id: 'inline', title: 'Nativo en Radar', price: 199, placement: 'Entre Noticias' },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // Intentar obtener geo real pero no bloquear el renderizado
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => {
          if (data && data.countryCode) setGeoData(data);
      })
      .catch(() => console.log("Usando geo por defecto"));

    // Temporizador para el botón de rescate (WhatsApp)
    const rescueTimer = setTimeout(() => setShowRescueButton(true), 6000);
    return () => clearTimeout(rescueTimer);
  }, [adPlacements]);

  // CARGADOR DE PAYPAL BALA DE PLATA (USD para máxima compatibilidad)
  useEffect(() => {
    if (!isMounted) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    
    const script = document.createElement('script');
    script.id = 'paypal-engine-v8';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&locale=${geoData.locale || 'es_PE'}&components=buttons&disable-funding=credit,card`;
    script.async = true;
    script.onload = () => setIsPaypalLoaded(true);
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById('paypal-engine-v8');
      if (s) s.remove();
    };
  }, [isMounted, geoData.locale]);

  // RENDERIZADOR DE BOTONES
  useEffect(() => {
    if (isPaypalLoaded && (window as any).paypal && paypalContainerRef.current && selectedPlacement) {
      paypalContainerRef.current.innerHTML = ''; 
      try {
        (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'checkout', height: 50 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${selectedPlacement.title}`,
                amount: { 
                    currency_code: 'USD', 
                    value: selectedPlacement.price.toString() 
                }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING' }
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            alert(`¡PAGO EXITOSO! Socio, bienvenido. ID: ${order.id}`);
            window.location.href = "/b2b?success=true";
          }
        }).render(paypalContainerRef.current);
      } catch (err) {
        console.error("PayPal Error:", err);
      }
    }
  }, [isPaypalLoaded, selectedPlacement]);

  if (!isMounted) return null;

  const currentPrice = ((selectedPlacement?.price || 0) * (geoData?.rate || 3.82)).toFixed(0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B GLOBAL</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
            Poder <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Inversión inteligente localizada por IP. Sistema de cobro global verificado.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-white/[0.01] border border-white/5 p-8 md:p-16 rounded-[60px] backdrop-blur-3xl shadow-2xl relative">
           
           {/* SECTOR PLANES */}
           <div className="space-y-6 w-full">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-cyan-400 mb-8">Selecciona tu Espacio</h3>
              {adPlacements.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedPlacement(ad)}
                  className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex justify-between items-center ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                >
                   <div>
                      <p className="text-xl font-bold uppercase italic">{ad.title}</p>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{ad.placement}</p>
                   </div>
                   <p className="text-2xl font-black text-white">{geoData?.currencySymbol || 'S/'}{((ad.price * (geoData?.rate || 3.82))).toFixed(0)}</p>
                </button>
              ))}
           </div>

           {/* SECTOR PAGO */}
           <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/10 space-y-10">
              <div className="flex justify-between items-end border-b border-white/5 pb-8">
                 <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Confirmar Reserva:</p>
                    <h5 className="text-lg font-bold text-white uppercase italic leading-none">{selectedPlacement?.placement}</h5>
                 </div>
                 <p className="text-3xl font-black text-cyan-400 leading-none">{geoData?.currencySymbol || 'S/'}{currentPrice}</p>
              </div>

              <div className="min-h-[120px] flex flex-col items-center justify-center w-full relative">
                 {!isPaypalLoaded && (
                   <div className="flex flex-col items-center gap-6 py-8">
                      <Loader2 className="animate-spin text-cyan-400" size={50} />
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Pasarela...</p>
                   </div>
                 )}
                 <div ref={paypalContainerRef} className="w-full" />
                 
                 {/* BOTÓN DE RESCATE (WhatsApp) */}
                 <AnimatePresence>
                    {showRescueButton && (
                      <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="w-full mt-6 space-y-4">
                         <div className="h-px bg-white/5 w-full" />
                         <p className="text-[8px] text-gray-600 font-black uppercase text-center">¿Fallas de conexión?</p>
                         <button 
                           onClick={() => window.open('https://wa.me/519XXXXXXXX', '_blank')}
                           className="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl"
                         >
                            <MessageCircle size={18} /> Pagar vía WhatsApp
                         </button>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
              <p className="text-center text-[7px] text-gray-700 font-black uppercase tracking-[0.3em]">Débito Seguro • PayPal Internacional Service</p>
           </div>
        </div>

        {/* CARGA DE MATERIAL */}
        <div className="mt-40 glass-card p-20 rounded-[80px] text-center space-y-8 bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl">
           <UploadCloud className="text-cyan-400 mx-auto" size={48} />
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Carga tu <span className="text-cyan-400">Material de Élite</span></h2>
           <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
             Tras el pago, sube tu video o arte interactivo. 
             La pauta se activará en todo el ecosistema global mediante nuestra IA.
           </p>
           <button className="px-16 py-6 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-xl">Seleccionar Archivo</button>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
