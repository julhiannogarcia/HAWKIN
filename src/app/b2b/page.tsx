'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, Tv, Target, Eye, Layout
} from 'lucide-react';

// =====================================================================
// COMPONENTE DE BOTÓN DE PAYPAL (ULTRA-RESILIENTE)
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
      containerRef.current.innerHTML = ''; // Limpiar para evitar duplicados
      
      try {
        (window as any).paypal.Buttons({
          style: { 
            layout: 'vertical', 
            color: 'gold', 
            shape: 'rect', 
            label: 'pay', 
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
                brand_name: 'HAWKIN INTELLIGENCE',
                user_action: 'PAY_NOW'
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
        }).render(containerRef.current);
      } catch (e) {
        console.error("PayPal Buttons Render Fail:", e);
      }
    }
  }, [isScriptLoaded, placement?.id, amount, currency, locale]);

  return <div ref={containerRef} className="w-full min-h-[50px]" />;
};

// =====================================================================
// PÁGINA B2B v4.0 - BLINDAJE TOTAL DE PAGOS
// =====================================================================
export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);

  // Precios estandarizados para coincidir con tu visión (PEN)
  const adPlacements = useMemo(() => [
    { 
        id: 'plus', 
        title: 'Plus: Streaming & Hero', 
        price: 999, 
        placement: 'Banner Principal + Live',
        description: 'Transmisión de video en tiempo real en la cabecera de todo el ecosistema.',
        reach: 'Alta Intensidad (2.5M+ Views)',
        icon: <Radio className="text-red-500 animate-pulse" />
    },
    { 
        id: 'sidebar', 
        title: 'Sidebar en Academia', 
        price: 699, 
        placement: 'Lateral de Cursos',
        description: 'Presencia constante al lado de cada lección y video educativo.',
        reach: 'Enfoque Directo (1M+ Views)',
        icon: <CheckCircle2 className="text-purple-500" />
    },
    { 
        id: 'inline', 
        title: 'Nativo en Radar', 
        price: 399, 
        placement: 'Entre Noticias',
        description: 'Publicidad integrada orgánicamente entre los reportes de inteligencia.',
        reach: 'CTR Elevado (500k+ Cliks)',
        icon: <ShoppingBag className="text-green-500" />
    },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // Obtener IP, Moneda e Idioma real con prioridad máxima
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => {
        setGeoData({ countryCode: 'PE', currencySymbol: 'S/', currencyCode: 'PEN', rate: 1, locale: 'es_PE', currencyName: 'Soles' });
      });
  }, [adPlacements]);

  // CARGADOR FORZADO DE PAYPAL
  useEffect(() => {
    if (!geoData || !isMounted) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    // Moneda del cobro real (PEN es aceptado por PayPal para comercios Latam habilitados)
    const currency = geoData.currencyCode || 'USD';
    const locale = geoData.locale || 'es_PE';

    // Limpieza agresiva de cualquier intento previo fallido
    const oldScript = document.getElementById('paypal-master-sdk');
    if (oldScript) oldScript.remove();
    if ((window as any).paypal) delete (window as any).paypal;

    const script = document.createElement('script');
    script.id = 'paypal-master-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=${locale}&components=buttons&disable-funding=credit,card`;
    script.async = true;
    script.onload = () => {
      console.log(`PayPal System Active: ${currency} / ${locale}`);
      setIsPaypalReady(true);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) document.body.removeChild(script);
    };
  }, [geoData, isMounted]);

  if (!isMounted) return null;

  // Mostramos el precio exacto que el socio ve en la moneda local
  const displayPrice = selectedPlacement?.price || 0;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        {/* TITULACIÓN PRO */}
        <section className="text-center space-y-8 mb-40">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN B2B GLOBAL NETWORK</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase">
            Impulso <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Empresarial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
             Precios ajustados para dominar el mercado. 
             Localización total de idioma y moneda por IP al instante.
          </p>
        </section>

        {/* CONSOLA DE IMPACTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* SELECTOR DE PLANES */}
           <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 mb-8">
                 <Target className="text-cyan-400" size={20} />
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Planes Activos</h3>
              </div>
              
              {adPlacements.map((ad) => (
                <button 
                  key={ad.id}
                  onClick={() => setSelectedPlacement(ad)}
                  className={`w-full p-8 rounded-[40px] border-2 text-left transition-all group relative overflow-hidden ${selectedPlacement?.id === ad.id ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_40px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}`}
                >
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPlacement?.id === ad.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-500'}`}>
                            {ad.icon}
                         </div>
                         <p className="text-base font-black uppercase italic leading-none">{ad.title}</p>
                      </div>
                      <p className="text-xl font-black text-white">{geoData?.currencySymbol || 'S/'}{ad.price}</p>
                   </div>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pl-1">
                      {ad.reach}
                   </p>
                </button>
              ))}

              <div className="mt-12 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Sincronización de Élite</p>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase italic">{geoData?.countryCode || 'PE'} | {geoData?.currencyName || 'Soles'}</span>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black uppercase text-gray-500">Live</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* SIMULADOR Y PAGO */}
           <div className="lg:col-span-8 space-y-12">
              <div className="relative group">
                 <div className="glass-card border-white/10 p-4 aspect-video rounded-[60px] bg-[#050505] overflow-hidden flex flex-col shadow-2xl border-2">
                    <div className="flex-1 relative rounded-[40px] overflow-hidden bg-gray-900 border border-white/5 flex flex-col justify-center items-center text-center p-12">
                       <AnimatePresence mode="wait">
                          {selectedPlacement?.id === 'plus' ? (
                            <motion.div key="v-plus" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full relative">
                               <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-30" alt="Live" />
                               <div className="absolute top-6 left-6 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                  <span className="text-[10px] font-black uppercase text-white tracking-widest">LIVE STREAM</span>
                               </div>
                               <Play size={48} className="text-white fill-white opacity-50 mb-6" />
                               <h4 className="text-2xl font-black uppercase italic text-cyan-400">Canal Directo Activo</h4>
                               <div className="absolute bottom-6 right-6 bg-white text-black px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-2xl flex items-center gap-3">
                                  <ExternalLink size={14} /> VISITAR WEB
                               </div>
                            </motion.div>
                          ) : (
                            <motion.div key="v-other" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/10 rounded-[35px] p-8">
                               <div className={`p-6 rounded-2xl bg-cyan-400/20 border-2 border-cyan-400 flex flex-col items-center gap-4 ${selectedPlacement.id === 'sidebar' ? 'w-32 h-40' : 'w-3/4 h-20 flex-row justify-between'}`}>
                                  <p className="text-[8px] font-black text-white uppercase text-center italic">{selectedPlacement.title}</p>
                                  <ExternalLink size={14} className="text-cyan-400" />
                               </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>

              {/* PASARELA DE PAGO INTEGRADA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-full shadow-xl">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Confirmar Reserva:</p>
                       <h5 className="text-xl font-black uppercase italic text-white leading-tight">{selectedPlacement?.placement}</h5>
                    </div>
                    <div className="pt-8">
                       <p className="text-[9px] font-black text-gray-600 uppercase">Total Localizado</p>
                       <p className="text-4xl font-black text-cyan-400">{geoData?.currencySymbol || 'S/'}{displayPrice}</p>
                    </div>
                 </div>

                 <div className="p-10 rounded-[50px] bg-white/[0.03] border border-cyan-400/20 flex flex-col items-center justify-center gap-6 shadow-2xl">
                    <div className="w-full">
                       {!isPaypalReady ? (
                         <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="animate-spin text-cyan-400" size={40} />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Pasarela...</p>
                         </div>
                       ) : (
                         <div className="space-y-6">
                            <PaypalButtonB2B 
                              placement={selectedPlacement}
                              amount={displayPrice.toString()}
                              currency={geoData?.currencyCode || 'USD'}
                              locale={geoData?.locale || 'es_PE'}
                              isLoaded={isPaypalReady}
                            />
                            <p className="text-center text-[7px] text-gray-600 font-black uppercase tracking-[0.3em]">Pago Seguro • PayPal Global</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* MAPA DE RECURSOS */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Eye className="text-cyan-400 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Impacto 360</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Visibilidad masiva en Radar, Academia y Trading simultáneamente.</p>
           </div>
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Layout className="text-purple-500 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Clic Directo</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Enlaces inteligentes integrados para derivar tráfico a tu web de ventas.</p>
           </div>
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Tv className="text-green-500 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Soporte Video</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Transmisiones en vivo y videos 4K para máxima retención de clientes.</p>
           </div>
        </div>

      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
