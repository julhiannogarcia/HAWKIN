'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, CreditCard, Tv, Target, Eye, Layout
} from 'lucide-react';

// =====================================================================
// COMPONENTE DE BOTÓN DE PAYPAL (ULTRA-ESTABLE Y LOCALIZADO)
// =====================================================================
const PaypalButtonB2B = ({ placement, amount, currency, locale, isLoaded }: { 
  placement: any, 
  amount: string, 
  currency: string, 
  locale: string,
  isLoaded: boolean 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && (window as any).paypal && containerRef.current && placement) {
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
          }
        }).render(containerRef.current);
      } catch (e) {
        console.error("Error al renderizar botones:", e);
      }
    }
  }, [isLoaded, placement?.id, amount, currency, locale]);

  return <div ref={containerRef} className="w-full min-h-[50px]" />;
};

// =====================================================================
// PÁGINA B2B PRINCIPAL - RECONSTRUCCIÓN TOTAL v13.0
// =====================================================================
export default function B2BPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);

  const adPlacements = useMemo(() => [
    { id: 'plus', title: 'Plus: Streaming & Hero', price: 999, placement: 'Banner Principal + Live', reach: '2.5M+ Views', icon: <Radio className="text-red-500 animate-pulse" /> },
    { id: 'sidebar', title: 'Sidebar en Academia', price: 699, placement: 'Lateral de Cursos', reach: '1M+ Views', icon: <CheckCircle2 className="text-purple-500" /> },
    { id: 'inline', title: 'Nativo en Radar', price: 399, placement: 'Entre Noticias', reach: '500k+ Clics', icon: <ShoppingBag className="text-green-500" /> },
  ], []);

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);
    
    // 1. Detección de IP y Localización (Idioma y Moneda)
    fetch('/api/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => setGeoData({ countryCode: 'PE', currencySymbol: 'S/', currencyCode: 'PEN', rate: 1, locale: 'es_PE', currencyName: 'Soles' }));
  }, [adPlacements]);

  // 2. Cargador Maestro de PayPal (Con Client ID Verificado)
  useEffect(() => {
    if (!geoData || !isMounted) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS'; // ESTA ES LA CLAVE QUE SÍ FUNCIONA
    const currency = geoData.currencyCode || 'USD';
    const locale = geoData.locale || 'es_PE';

    const scriptId = 'paypal-engine-v13-final';
    if (document.getElementById(scriptId)) {
        if ((window as any).paypal) setIsPaypalReady(true);
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&locale=${locale}&components=buttons`;
    script.async = true;
    script.onload = () => {
        console.log("PayPal System v13 Online");
        setIsPaypalReady(true);
    };
    script.onerror = () => console.error("PayPal failed to load");
    document.body.appendChild(script);

    return () => {
      // Dejamos el script para estabilidad
    };
  }, [geoData, isMounted]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans selection:bg-cyan-500 overflow-x-hidden">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        {/* TITULACIÓN PRO */}
        <section className="text-center space-y-8 mb-40">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN ADS MARKETPLACE v13.0</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed text-center">
             Tu marca en el epicentro de la tecnología. 
             Localización automática de idioma y moneda por IP.
          </p>
        </section>

        {/* CONSOLA DE SIMULACIÓN Y PAGO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* SECTOR PLANES */}
           <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 mb-8">
                 <Target className="text-cyan-400" size={20} />
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Objetivos Activos</h3>
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
                      Reach: <span className="text-white">{ad.reach}</span>
                   </p>
                </button>
              ))}

              <div className="mt-12 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Sincronización IP</p>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-cyan-400 uppercase italic">{geoData?.countryCode || 'PE'} | {geoData?.currencyName || 'Soles'}</span>
                    <Globe size={16} className="text-cyan-400 animate-spin-slow" />
                 </div>
              </div>
           </div>

           {/* SIMULADOR Y PASARELA */}
           <div className="lg:col-span-8 space-y-12">
              
              {/* SIMULADOR DE VIDEO REALISTA */}
              <div className="relative group">
                 <div className="glass-card border-white/10 p-4 aspect-video rounded-[60px] bg-[#050505] overflow-hidden flex flex-col shadow-2xl border-2">
                    <div className="flex-1 relative rounded-[40px] overflow-hidden bg-gray-900 border border-white/5 flex flex-col justify-center items-center text-center p-12">
                       <AnimatePresence mode="wait">
                          {selectedPlacement?.id === 'plus' ? (
                            <motion.div key="v-plus" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full relative">
                               <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-30" alt="Live" />
                               <div className="absolute top-6 left-6 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                  <span className="text-[10px] font-black uppercase text-white">LIVE STREAM</span>
                               </div>
                               <Play size={48} className="text-white fill-white opacity-50 mb-6 mx-auto" />
                               <h4 className="text-2xl font-black uppercase italic leading-tight text-white text-center">Visualización Directa</h4>
                               <div className="absolute bottom-6 right-6 bg-white text-black px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-2xl flex items-center gap-3">
                                  <ExternalLink size={14} /> VISITAR TIENDA
                               </div>
                            </motion.div>
                          ) : (
                            <motion.div key="v-other" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/10 rounded-[35px] p-8">
                               <div className={`p-6 rounded-2xl bg-cyan-400/20 border-2 border-cyan-400 flex flex-col items-center gap-4 ${selectedPlacement.id === 'sidebar' ? 'w-32 h-44' : 'w-3/4 h-24 flex-row justify-between'}`}>
                                  <p className="text-[8px] font-black text-white uppercase text-center italic leading-tight">{selectedPlacement.title}</p>
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
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Reserva Confirmada:</p>
                       <h5 className="text-xl font-black uppercase italic text-white leading-tight underline decoration-cyan-500/30">{selectedPlacement?.placement}</h5>
                    </div>
                    <div className="pt-8">
                       <p className="text-[9px] font-black text-gray-600 uppercase">Inversión Final</p>
                       <p className="text-4xl font-black text-cyan-400">{geoData?.currencySymbol || 'S/'}{selectedPlacement?.price}</p>
                    </div>
                 </div>

                 <div className="p-10 rounded-[50px] bg-white/[0.03] border border-cyan-400/20 flex flex-col items-center justify-center gap-6 shadow-2xl relative">
                    <div className="w-full">
                       {!isPaypalReady ? (
                         <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="animate-spin text-cyan-400" size={40} />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Activando Pasarela Global...</p>
                         </div>
                       ) : (
                         <div className="space-y-6">
                            <PaypalButtonB2B 
                              placement={selectedPlacement}
                              amount={(selectedPlacement.price / (geoData?.rate || 3.82)).toFixed(2)}
                              currency="USD"
                              locale={geoData?.locale || 'es_PE'}
                              isLoaded={isPaypalReady}
                            />
                            <p className="text-center text-[7px] text-gray-600 font-black uppercase tracking-[0.3em]">Débito Seguro • PayPal Global Network</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* MAPA DE IMPACTO */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 grayscale hover:grayscale-0 transition-all duration-1000 cursor-default">
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Eye className="text-cyan-400 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Impacto 360</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Presencia en Radar, Academia y Trading simultáneamente.</p>
           </div>
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Layout className="text-purple-500 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Clic Directo</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Botones inteligentes integrados para derivar tráfico a tu web.</p>
           </div>
           <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 text-center">
              <Tv className="text-green-500 mx-auto" size={32} />
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">Alta Fidelidad</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Soporte para videos 4K, animaciones y artes vectoriales.</p>
           </div>
        </div>

      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
