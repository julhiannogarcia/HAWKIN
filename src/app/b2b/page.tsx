'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, CreditCard, Tv, Layout, Eye, Target
} from 'lucide-react';

// =====================================================================
// COMPONENTE DE BOTÓN DE PAYPAL (ULTRA-ESTABLE)
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
    const timer = setTimeout(renderButtons, 500);
    return () => clearTimeout(timer);
  }, [placement.id, amount, currency]);

  return <div ref={containerRef} className="w-full min-h-[50px]" />;
};

// =====================================================================
// PÁGINA B2B PRINCIPAL CON SIMULADOR DE VIDEO
// =====================================================================
export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);

  const adPlacements = useMemo(() => [
    { 
        id: 'plus', 
        title: 'Plus: Streaming & Hero', 
        price: 499, 
        placement: 'Banner Principal + Live',
        description: 'Transmisión de video en tiempo real en la cabecera de todo el ecosistema.',
        reach: 'Alta Intensidad (2.5M+ Views)',
        icon: <Radio className="text-red-500 animate-pulse" />
    },
    { 
        id: 'sidebar', 
        title: 'Sidebar en Academia', 
        price: 299, 
        placement: 'Lateral de Cursos',
        description: 'Presencia constante al lado de cada lección y video educativo.',
        reach: 'Enfoque Directo (1M+ Views)',
        icon: <CheckCircle2 className="text-purple-500" />
    },
    { 
        id: 'inline', 
        title: 'Nativo en Radar', 
        price: 199, 
        placement: 'Entre Noticias',
        description: 'Publicidad integrada orgánicamente entre los reportes de inteligencia.',
        reach: 'CTR Elevado (500k+ Cliks)',
        icon: <ShoppingBag className="text-green-500" />
    },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => setGeoData({ currencyCode: 'USD', currencySymbol: 'S/', rate: 3.82, locale: 'es_PE' }));
  }, [adPlacements]);

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
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        {/* TITULACIÓN PRO */}
        <section className="text-center space-y-8 mb-40">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN ADS MARKETPLACE</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase">
            Centro de <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Poder.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Visualiza tu marca dominando el ecosistema tecnológico más influyente. 
            Simula tu impacto antes de reservar.
          </p>
        </section>

        {/* CONSOLA DE SIMULACIÓN Y PAGO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* COLUMNA IZQUIERDA: SELECTOR (4 COLUMNAS) */}
           <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 mb-8">
                 <Target className="text-cyan-400" size={20} />
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Selecciona tu Objetivo</h3>
              </div>
              
              {adPlacements.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedPlacement(ad)}
                  className={`w-full p-8 rounded-[40px] border-2 text-left transition-all group relative overflow-hidden ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_40px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}`}
                >
                   <div className="flex items-center gap-6 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedPlacement?.id === ad.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-500'}`}>
                         {ad.icon}
                      </div>
                      <p className="text-lg font-black uppercase italic leading-none">{ad.title}</p>
                   </div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
                      Alcance: <span className="text-white">{ad.reach}</span>
                   </p>
                </button>
              ))}

              <div className="mt-12 p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Localización Activa</p>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase italic">{geoData?.countryCode || 'PE'} | {geoData?.currencyName || 'Soles'}</span>
                    <Globe size={16} className="text-cyan-400 animate-spin-slow" />
                 </div>
              </div>
           </div>

           {/* COLUMNA DERECHA: SIMULADOR DE VIDEO Y PAGO (8 COLUMNAS) */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* SIMULADOR DE VIDEO REALISTA */}
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[60px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                 <div className="relative glass-card border-white/10 p-4 aspect-video rounded-[60px] bg-[#050505] overflow-hidden flex flex-col shadow-2xl">
                    
                    {/* Interfaz de la Web Hawkin Simulada */}
                    <div className="h-6 w-full flex items-center px-6 gap-2 mb-4">
                       <div className="w-2 h-2 rounded-full bg-red-500" />
                       <div className="w-2 h-2 rounded-full bg-yellow-500" />
                       <div className="w-2 h-2 rounded-full bg-green-500" />
                       <div className="h-2.5 w-1/3 bg-white/5 rounded-full mx-auto" />
                    </div>

                    <div className="flex-1 relative rounded-[40px] overflow-hidden bg-gray-900 border border-white/5">
                       <AnimatePresence mode="wait">
                          {selectedPlacement?.id === 'plus' ? (
                            <motion.div key="v-plus" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full relative">
                               <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-40" alt="Live" />
                               <div className="absolute top-6 left-6 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                  <span className="text-[10px] font-black uppercase text-white tracking-widest">LIVE STREAM</span>
                               </div>
                               <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                                  <Play size={64} className="text-white fill-white opacity-80 mb-6" />
                                  <h4 className="text-3xl font-black uppercase italic leading-none">Tu Video Aquí</h4>
                                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-4">Transmisión Directa al Ecosistema</p>
                               </div>
                               <div className="absolute bottom-6 right-6 bg-cyan-500 text-black px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-2xl flex items-center gap-3">
                                  <ExternalLink size={14} /> IR A TU PÁGINA
                               </div>
                            </motion.div>
                          ) : (
                            <motion.div key="v-other" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full bg-black p-12 flex flex-col gap-8">
                               <div className="h-8 w-1/2 bg-white/10 rounded-full" />
                               <div className="flex-1 grid grid-cols-12 gap-8">
                                  <div className="col-span-8 space-y-6">
                                     <div className="h-4 w-full bg-white/5 rounded-full" />
                                     <div className="h-4 w-full bg-white/5 rounded-full" />
                                     <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                                  </div>
                                  <div className="col-span-4 relative">
                                     {/* El Anuncio en su Ubicación */}
                                     <motion.div 
                                      animate={{ scale: [1, 1.02, 1] }} 
                                      transition={{ duration: 2, repeat: Infinity }}
                                      className={`w-full bg-cyan-400/20 border-2 border-dashed border-cyan-400 rounded-3xl flex flex-col items-center justify-center p-6 text-center ${selectedPlacement.id === 'sidebar' ? 'h-full' : 'h-24 absolute bottom-0'}`}
                                     >
                                        <Tv size={selectedPlacement.id === 'sidebar' ? 32 : 20} className="text-cyan-400 mb-3" />
                                        <p className="text-[8px] font-black uppercase text-white leading-tight italic">{selectedPlacement.title}</p>
                                        <div className="mt-4 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black shadow-lg"><ExternalLink size={12} /></div>
                                     </motion.div>
                                  </div>
                               </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>

              {/* CONSOLA DE PAGO INTEGRADA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-full shadow-xl">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Reserva el Espacio:</p>
                       <h5 className="text-2xl font-black uppercase italic text-white leading-tight">{selectedPlacement?.placement}</h5>
                       <p className="text-gray-500 text-sm font-light leading-relaxed">{selectedPlacement?.description}</p>
                    </div>
                    <div className="pt-8 flex items-end justify-between">
                       <div className="text-left">
                          <p className="text-[9px] font-black text-gray-600 uppercase">Inversión Semanal</p>
                          <p className="text-4xl font-black text-cyan-400">{geoData?.currencySymbol || 'S/'}{currentPrice}</p>
                       </div>
                       <button onClick={() => window.open('mailto:julhianno@aihawkin.com', '_self')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all"><MessageCircle size={20} /></button>
                    </div>
                 </div>

                 <div className="p-10 rounded-[50px] bg-white/[0.03] border border-cyan-400/20 flex flex-col items-center justify-center gap-6 shadow-2xl relative">
                    <div className="absolute top-4 right-8 bg-cyan-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase">Seguro</div>
                    <div className="w-full">
                       {!isPaypalReady ? (
                         <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="animate-spin text-cyan-400" size={40} />
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Pasarela Global...</p>
                         </div>
                       ) : (
                         <div className="space-y-6">
                            <PaypalButtonB2B 
                              placement={selectedPlacement}
                              amount={selectedPlacement.price.toString()}
                              currency="USD"
                            />
                            <p className="text-center text-[7px] text-gray-600 font-black uppercase tracking-[0.3em]">Débito inmediato • PayPal Global Service</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* MAPA DE TRÁFICO (RECURSOS DE ÉLITE) */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Eye className="text-cyan-400 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter">Visibilidad 360</h4>
              <p className="text-sm text-gray-500 font-light leading-relaxed">Tu marca aparece en el Radar, Academia y Trading simultáneamente.</p>
           </div>
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Layout className="text-purple-500 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter">Click-Through Directo</h4>
              <p className="text-sm text-gray-500 font-light leading-relaxed">Botones de compra integrados en la imagen para derivar clientes a tu web.</p>
           </div>
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Tv className="text-green-500 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter">Soporte Multiformato</h4>
              <p className="text-sm text-gray-500 font-light leading-relaxed">Sube videos 4K, GIFs de alta fidelidad o artes vectoriales.</p>
           </div>
        </div>

      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
