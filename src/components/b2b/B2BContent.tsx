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

// =====================================================================
// COMPONENTE DE BOTÓN DE PAYPAL (ULTRA-ESTABLE)
// =====================================================================
const PaypalButtonB2B = ({ placement, amount, currency, isLoaded }: { placement: any, amount: string, currency: string, isLoaded: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && (window as any).paypal && containerRef.current) {
      containerRef.current.innerHTML = '';
      try {
        (window as any).paypal.Buttons({
          style: { 
            layout: 'vertical', 
            color: 'gold', 
            shape: 'rect', 
            label: 'checkout', 
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
                brand_name: 'HAWKIN INTELLIGENCE'
              }
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            alert(`¡ÉXITO TOTAL! Socio, su pago de ${amount} ${currency} ha sido procesado. ID: ${order.id}`);
            window.location.href = "/b2b?success=true";
          }
        }).render(containerRef.current);
      } catch (e) {
        console.error("Error al renderizar botones de PayPal:", e);
      }
    }
  }, [isLoaded, placement.id, amount, currency]);

  return <div ref={containerRef} className="w-full" />;
};

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================
export default function B2BContent() {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adPlacements = [
    { 
      id: 'live-stream-hero', 
      title: 'Plus: Streaming & Hero', 
      price: 499, 
      impressions: '2.5M+', 
      icon: <Radio className="text-red-500 animate-pulse" />,
      placement: 'Streaming en vivo + Banner Principal',
      features: ['Transmisión en Video Directo', 'Enlace Clickable en Pantalla', 'Aviso "LIVE" a toda la red']
    },
    { 
      id: 'sidebar-academy', 
      title: 'Sidebar en Academia', 
      price: 299, 
      impressions: '500k+', 
      icon: <CheckCircle2 className="text-purple-500" />,
      placement: 'Lateral de todos los cursos',
      features: ['Imagen o GIF interactivo', 'Enlace directo a tu tienda', 'Presencia 24/7']
    },
    { 
      id: 'inline-news', 
      title: 'Anuncio Nativo en Radar', 
      price: 199, 
      impressions: '250k+', 
      icon: <ShoppingBag className="text-green-500" />,
      placement: 'Entre noticias del Radar Global',
      features: ['Formato noticia integrada', 'Alta tasa de clics (CTR)', 'Ideal para lanzamientos']
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    setSelectedPlacement(adPlacements[0]);

    // 1. Cargar Geodata con timeout de seguridad
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
      } catch (e) {
        setGeoData({ countryCode: 'US', currencySymbol: '$', currencyCode: 'USD', rate: 1, locale: 'en_US' });
      }
    };
    fetchGeo();
  }, []);

  // 2. Cargar Script de PayPal de forma Directa y Forzada
  useEffect(() => {
    if (!geoData || !isMounted) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    const currency = geoData.currencyCode || 'USD';
    const locale = geoData.locale || 'es_PE';

    const scriptId = 'paypal-v5-force-load';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=${locale}&components=buttons`;
      script.async = true;
      script.onload = () => setIsPaypalReady(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalReady(true);
    }
  }, [geoData, isMounted]);

  if (!isMounted || !selectedPlacement) return null;

  const handleContact = () => window.open(`mailto:julhianno@aihawkin.com`, '_self');
  const handleFileSelect = () => fileInputRef.current?.click();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setUploadProgress(0);
    const it = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) { clearInterval(it); setIsUploading(false); setShowSuccess(true); return 100; }
        return p + 10;
      });
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full min-h-screen bg-black overflow-x-hidden">
      <Header />
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />

      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full">
        {/* TITULACIÓN */}
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN GLOBAL MEDIA</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-white text-center">
            Poder <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent uppercase">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed text-center">
            Publicidad inteligente con moneda local automática y pago express en un solo clic.
          </p>
        </section>

        {/* CONSOLA PRINCIPAL */}
        <section id="previsualizador" className="space-y-20">
           <div className="text-center">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4">Consola de <span className="text-cyan-400">Impacto Real</span></h2>
              <div className="flex items-center justify-center gap-4">
                 <span className="bg-cyan-500/10 text-cyan-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-400/20">
                   IP Detectada: {geoData?.countryCode || 'Sincronizando...'}
                 </span>
                 <span className="bg-white/5 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                   Moneda: {geoData?.currencyName || 'Cargando...'}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-white/[0.01] border border-white/5 p-8 md:p-16 rounded-[60px] backdrop-blur-3xl shadow-2xl">
              {/* PLANES */}
              <div className="space-y-4">
                 {adPlacements.map((ad) => (
                    <button 
                      key={ad.id}
                      onClick={() => setSelectedPlacement(ad)}
                      className={`w-full p-8 rounded-[35px] border-2 text-left transition-all flex flex-col gap-4 group ${selectedPlacement.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                    >
                       <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlacement.id === ad.id ? 'bg-cyan-400 text-black shadow-[0_0_20px_#22d3ee]' : 'bg-white/5 text-gray-500'}`}>
                                {ad.icon}
                             </div>
                             <div>
                                <h4 className="text-lg font-black uppercase italic tracking-tight leading-none">{ad.title}</h4>
                                <p className="text-[9px] text-cyan-500 font-bold uppercase tracking-widest mt-2">{ad.impressions} Views</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-white">{geoData?.currencySymbol || '$'}{(ad.price * (geoData?.rate || 1)).toFixed(0)}</p>
                             <p className="text-[7px] text-gray-500 font-black uppercase">Precio Localizado</p>
                          </div>
                       </div>
                    </button>
                 ))}
              </div>

              {/* PAGO Y SIMULADOR */}
              <div className="space-y-8">
                 <div className="glass-card border-white/10 p-6 aspect-[16/9] rounded-[40px] relative overflow-hidden bg-[#050505] flex flex-col shadow-2xl border-2">
                    <div className="flex-1 flex flex-col justify-center items-center relative text-center">
                       {selectedPlacement.id === 'live-stream-hero' ? (
                         <div className="w-full h-full bg-gray-900 rounded-[25px] relative overflow-hidden border border-white/5">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-40 animate-pulse" />
                            <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                               <div className="w-1.5 h-1.5 bg-white rounded-full" />
                               <span className="text-[8px] font-black uppercase text-white tracking-widest">LIVE TRANSMISIÓN</span>
                            </div>
                            <Play size={40} className="text-white fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                            <div className="absolute bottom-3 right-3 bg-cyan-500 text-black px-4 py-2 rounded-xl font-black text-[8px] uppercase flex items-center gap-2">
                               <ExternalLink size={10} /> IR A LA TIENDA
                            </div>
                         </div>
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[30px] p-8">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mb-4">Simulador Activo</p>
                            <div className="w-full h-12 bg-cyan-400/20 border border-cyan-400 rounded-xl flex items-center justify-between px-6">
                               <span className="text-[8px] font-black text-white uppercase italic">{selectedPlacement.title}</span>
                               <ExternalLink size={14} className="text-cyan-400" />
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 {/* ÁREA DE PAGO EXPRESS */}
                 <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/10 space-y-8">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                       <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Reserva de Espacio:</p>
                          <p className="text-sm font-bold text-white uppercase italic leading-none">{selectedPlacement.placement}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-4xl font-black text-cyan-400 leading-none">
                            {geoData?.currencySymbol || '$'}{(selectedPlacement.price * (geoData?.rate || 1)).toFixed(0)}
                          </p>
                       </div>
                    </div>

                    <div className="min-h-[100px] flex flex-col items-center justify-center w-full">
                       {!isPaypalReady ? (
                         <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-cyan-400" size={40} />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse">Sincronizando Pasarela Élite...</p>
                         </div>
                       ) : (
                         <PaypalButtonB2B 
                           placement={selectedPlacement}
                           amount={(selectedPlacement.price * (geoData?.rate || 1)).toFixed(2)}
                           currency={geoData?.currencyCode || 'USD'}
                           isLoaded={isPaypalReady}
                         />
                       )}
                    </div>
                    <p className="text-center text-[8px] font-black text-gray-700 uppercase tracking-[0.4em]">Protección de Datos HAWKIN • PayPal Global</p>
                 </div>
              </div>
           </div>
        </section>

        {/* CARGA DE MATERIAL */}
        <div className="mt-40 glass-card border-white/5 p-16 md:p-32 rounded-[80px] bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-8">
                 <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">Tu Marca <br /><span className="text-cyan-400 uppercase">Sin Fronteras.</span></h2>
                 <p className="text-gray-500 text-xl font-light leading-relaxed">
                    Sube tu video o arte tras el pago. Nuestro satélite distribuirá tu publicidad en todo el ecosistema automáticamente.
                 </p>
              </div>

              <div className="p-16 bg-white text-black rounded-[60px] flex flex-col items-center gap-10 text-center shadow-2xl">
                 <AnimatePresence mode="wait">
                    {isUploading ? (
                      <motion.div key="l" initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                         <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto"><div className="h-full bg-cyan-500" style={{width: `${uploadProgress}%`}} /></div>
                         <p className="text-xs font-black uppercase tracking-widest">Transmitiendo Datos...</p>
                      </motion.div>
                    ) : showSuccess ? (
                      <motion.div key="s" initial={{scale:0.8}} animate={{scale:1}} className="space-y-6 text-green-600">
                         <CheckCircle2 size={80} className="mx-auto" />
                         <p className="text-lg font-black uppercase italic">Material Sincronizado</p>
                      </motion.div>
                    ) : (
                      <>
                        <UploadCloud size={80} className="text-gray-300" />
                        <h4 className="text-3xl font-black uppercase italic tracking-tighter">Cargar Arte</h4>
                        <button onClick={handleFileSelect} className="px-16 py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.4em] text-xs hover:bg-cyan-500 transition-all shadow-2xl">Seleccionar Archivos</button>
                      </>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </div>
  );
}
