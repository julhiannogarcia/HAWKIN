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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
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

  const [selectedPlacement, setSelectedPlacement] = useState(adPlacements[0]);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
      } catch (e) {
        console.error("Geo error", e);
      }
    };
    fetchGeo();

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';
    if (!document.getElementById('paypal-sdk-b2b')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk-b2b';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      script.onload = () => setIsPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsPaypalLoaded(true);
    }
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleContact = () => {
    const subject = encodeURIComponent("Propuesta Comercial - HAWKIN Ads");
    const body = encodeURIComponent("Hola HAWKIN,\n\nDeseo anunciar mi negocio en la plataforma. Mi marca es [Nombre de Empresa] y estoy interesado en el espacio [Tipo de Anuncio].\n\nQuedo a la espera de sus instrucciones.\n\nSaludos.");
    window.open(`mailto:julhianno@aihawkin.com?subject=${subject}&body=${body}`, '_self');
  };

  const PaypalButtonB2B = ({ planId, amount }: { planId: string, amount: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isPaypalLoaded && containerRef.current && window.paypal) {
        containerRef.current.innerHTML = '';
        window.paypal.Buttons({
          style: { layout: 'horizontal', color: 'blue', shape: 'pill', label: 'buynow', height: 45 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `Publicidad HAWKIN - ${planId}`,
                amount: { value: amount }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            alert(`¡Reserva Exitosa! Su espacio publicitario ha sido bloqueado. ID: ${order.id}`);
            window.location.href = "/b2b?success=true";
          }
        }).render(containerRef.current);
      }
    }, [isPaypalLoaded, planId, amount]);

    return <div ref={containerRef} className="mt-8" />;
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-cyan-500">
      <Header />
      
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="video/*,image/*,.pdf" />

      <div className="max-w-6xl mx-auto px-4 pt-40 pb-32">
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN MEDIA & ADS</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white">
            Domina el <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent italic">Ecosistema.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Streaming en vivo, anuncios interactivos y enlaces directos a tu web. 
            Convierte visualizaciones en ventas reales.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-12">
             <button onClick={() => document.getElementById('ad-selector')?.scrollIntoView({behavior: 'smooth'})} className="btn-glow text-[10px] py-6 px-12 uppercase">
                Ver Planes y Ubicaciones
             </button>
             <button onClick={handleContact} className="flex items-center justify-center gap-4 px-12 py-6 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
               <MessageCircle size={18} /> Tarifas Corporativas
             </button>
          </div>
        </section>

        {/* PREVISUALIZACIÓN DE UBICACIÓN (MODO VIDEO/REALISTA) */}
        <section id="ad-selector" className="mt-40 space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Consola de <span className="text-cyan-400">Previsualización</span></h2>
              <p className="text-gray-500 uppercase font-black text-xs tracking-widest">Simula tu impacto comercial en tiempo real</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-white/[0.02] border border-white/5 p-8 md:p-20 rounded-[80px]">
              {/* LISTA DE OPCIONES CON PLUS */}
              <div className="space-y-6">
                 {adPlacements.map((ad) => (
                    <button 
                      key={ad.id}
                      onClick={() => setSelectedPlacement(ad)}
                      className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex flex-col gap-4 group ${selectedPlacement.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 hover:border-white/20 bg-black'}`}
                    >
                       <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlacement.id === ad.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-500'}`}>
                                {ad.icon}
                             </div>
                             <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tight">{ad.title}</h4>
                                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">{ad.impressions} Views</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-white">{geoData?.currencySymbol || 'S/'}{(ad.price * (geoData?.rate || 1)).toFixed(0)}</p>
                          </div>
                       </div>
                       
                       {selectedPlacement.id === ad.id && (
                         <motion.ul initial={{opacity:0}} animate={{opacity:1}} className="pl-20 space-y-2">
                            {ad.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                 <CheckCircle2 size={10} className="text-cyan-400" /> {f}
                              </li>
                            ))}
                         </motion.ul>
                       )}
                    </button>
                 ))}
              </div>

              {/* SIMULADOR DE PANTALLA MODO VIDEO */}
              <div className="relative">
                 <div className="absolute -inset-10 bg-cyan-500/10 blur-[100px] rounded-full" />
                 <div className="glass-card border-white/10 p-4 aspect-[16/10] rounded-[40px] relative overflow-hidden bg-[#050505] flex flex-col shadow-2xl">
                    <div className="h-6 w-full border-b border-white/5 flex items-center px-4 gap-2 mb-4 bg-black/40">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                       <div className="h-2 w-32 bg-white/5 rounded-full mx-auto" />
                    </div>
                    
                    <div className="flex-1 space-y-4 px-6 overflow-hidden relative">
                       {/* HEADER SIMULADO */}
                       <div className="flex justify-between items-center mb-6">
                          <div className="h-4 w-20 bg-white/10 rounded-full" />
                          <div className="flex gap-4">
                             <div className="h-3 w-10 bg-white/5 rounded-full" />
                             <div className="h-3 w-10 bg-white/5 rounded-full" />
                          </div>
                       </div>

                       {/* MODO VIDEO EN HERO (PLAN 499) */}
                       {selectedPlacement.id === 'live-stream-hero' ? (
                         <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="w-full h-48 bg-gradient-to-br from-black to-gray-900 rounded-3xl border border-white/10 relative overflow-hidden group cursor-pointer"
                         >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-30 animate-pulse" />
                            <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                               <div className="w-1.5 h-1.5 bg-white rounded-full" />
                               <span className="text-[8px] font-black uppercase tracking-widest text-white">LIVE: TU MARCA</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                                  <Play size={20} className="text-white fill-white ml-1" />
                               </div>
                            </div>
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-cyan-400">
                               <ExternalLink size={10} />
                               <span className="text-[8px] font-black uppercase">Visitar Web</span>
                            </div>
                         </motion.div>
                       ) : (
                         <div className="space-y-4">
                            <div className="h-32 w-full bg-white/[0.02] rounded-3xl border border-dashed border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                               {selectedPlacement.id === 'sidebar-academy' && (
                                 <motion.div 
                                  initial={{ x: 20 }} animate={{ x: 0 }}
                                  className="absolute top-2 right-2 w-24 h-32 bg-cyan-400/20 border-2 border-dashed border-cyan-400 rounded-2xl flex items-center justify-center text-center p-2"
                                 >
                                    <div className="space-y-1">
                                       <p className="text-[6px] font-black text-white uppercase italic leading-none">Anuncio Academy</p>
                                       <div className="flex items-center justify-center gap-1 text-cyan-400"><ExternalLink size={8} /> <span className="text-[5px] font-black uppercase">Tu Link</span></div>
                                    </div>
                                 </motion.div>
                               )}
                               
                               {selectedPlacement.id === 'inline-news' && (
                                 <motion.div 
                                  initial={{ y: 20 }} animate={{ y: 0 }}
                                  className="h-20 w-3/4 bg-white/5 border-2 border-dashed border-green-500 rounded-2xl flex items-center justify-between px-6"
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center"><ShoppingBag size={14} className="text-green-500" /></div>
                                       <p className="text-[8px] font-black uppercase text-white italic">Tu Producto en el Radar</p>
                                    </div>
                                    <div className="p-2 rounded-full bg-green-500 text-black"><ExternalLink size={10} /></div>
                                 </motion.div>
                               )}
                               
                               <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Interface Preview</span>
                            </div>
                         </div>
                       )}

                       <div className="h-3 w-1/2 bg-white/5 rounded-full" />
                       <div className="h-3 w-full bg-white/5 rounded-full opacity-40" />
                    </div>
                 </div>
                 <div className="mt-8 text-center md:text-left">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Ubicación Estratégica:</p>
                    <h5 className="text-lg font-bold text-cyan-400 uppercase italic leading-none">{selectedPlacement.placement}</h5>
                    
                    <div className="mt-10">
                       {isPaypalLoaded ? (
                         <PaypalButtonB2B planId={selectedPlacement.id} amount={(selectedPlacement.price).toFixed(2)} />
                       ) : (
                         <div className="w-full h-12 bg-white/5 animate-pulse rounded-full flex items-center justify-center text-[9px] text-gray-600 font-black uppercase tracking-widest">
                           Sincronizando Sistema de Streaming...
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* PANEL DE CARGA DE ARTE Y LINKS */}
        <div className="mt-40 glass-card border-white/5 p-1 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[60px] overflow-hidden shadow-2xl">
           <div className="bg-black/60 rounded-[59px] p-8 md:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-3xl font-black uppercase tracking-widest italic text-white">Material <span className="text-cyan-400">Interactivo</span></h2>
                    <p className="text-gray-400 leading-relaxed font-light">
                       Tras la reserva, sube tu video o imagen. Incluye el enlace de destino para que los socios lleguen directamente a tu plataforma con un solo clic.
                    </p>
                    <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <CheckCircle2 className="text-cyan-400" size={16} /> Soporte Video 4K / GIFs
                       </div>
                       <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <CheckCircle2 className="text-cyan-400" size={16} /> Enlaces de Venta Trackeables
                       </div>
                    </div>
                 </div>

                 <div className="p-12 bg-gradient-to-br from-cyan-400 to-purple-600 text-black rounded-[40px] flex flex-col items-center gap-6 text-center shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isUploading ? (
                        <motion.div key="loader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                           <Loader2 className="animate-spin mx-auto" size={40} />
                           <p className="text-[10px] font-black uppercase">Procesando Multimedia ({uploadProgress}%)</p>
                        </motion.div>
                      ) : showSuccess ? (
                        <motion.div key="success" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} className="space-y-4">
                           <FileCheck className="mx-auto" size={40} />
                           <p className="text-[10px] font-black uppercase text-black italic">¡Tu Anuncio está listo para emitir!</p>
                        </motion.div>
                      ) : (
                        <>
                          <UploadCloud size={40} className="animate-bounce" />
                          <div>
                             <h4 className="text-xl font-black uppercase italic leading-tight">Carga tu Video <br />o Arte Clickable</h4>
                          </div>
                          <button onClick={handleFileSelect} className="w-full py-5 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                             SELECCIONAR ARCHIVOS
                          </button>
                        </>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
