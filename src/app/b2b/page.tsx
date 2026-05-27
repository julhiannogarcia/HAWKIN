'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft 
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
      id: 'top-banner', 
      title: 'Mega-Banner Hero', 
      price: 499, 
      impressions: '1.2M+', 
      icon: <Globe className="text-cyan-400" />,
      placement: 'Parte superior de la Página de Inicio'
    },
    { 
      id: 'sidebar-academy', 
      title: 'Sidebar en Academia', 
      price: 299, 
      impressions: '500k+', 
      icon: <CheckCircle2 className="text-purple-500" />,
      placement: 'Lateral de todos los cursos'
    },
    { 
      id: 'inline-news', 
      title: 'Anuncio Nativo en Radar', 
      price: 199, 
      impressions: '250k+', 
      icon: <ShoppingBag className="text-green-500" />,
      placement: 'Entre noticias del Radar Global'
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
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN ADS MARKETPLACE</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Vende más con <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent italic">HAWKIN.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Anuncia tu tienda de ropa, tecnología o servicios en el ecosistema líder de IA.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-12">
             <button onClick={() => document.getElementById('ad-selector')?.scrollIntoView({behavior: 'smooth'})} className="btn-glow text-[10px] py-6 px-12 uppercase">
                Crear mi Anuncio Ahora
             </button>
             <button onClick={handleContact} className="flex items-center justify-center gap-4 px-12 py-6 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
               <MessageCircle size={18} /> Hablar con HAWKIN
             </button>
          </div>
        </section>

        {/* Panel de Gestión Masiva */}
        <div className="glass-card border-white/5 p-1 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[60px] overflow-hidden shadow-2xl">
           <div className="bg-black/60 rounded-[59px] p-8 md:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 
                 <div className="lg:col-span-2 space-y-16">
                    <h2 className="text-3xl font-black uppercase tracking-widest italic text-white">Alcance <span className="text-cyan-400">Sin Límites</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                       <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Tecnología</p>
                          <h4 className="text-3xl font-black mt-2 text-cyan-400">450K</h4>
                       </div>
                       <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Moda & Estilo</p>
                          <h4 className="text-3xl font-black mt-2 text-purple-500">320K</h4>
                       </div>
                       <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Retail</p>
                          <h4 className="text-3xl font-black mt-2 text-green-500">280K</h4>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="p-10 bg-gradient-to-br from-cyan-400 to-purple-600 text-black rounded-[40px] flex flex-col items-center gap-6 text-center shadow-2xl relative overflow-hidden">
                       <AnimatePresence mode="wait">
                         {isUploading ? (
                           <motion.div key="loader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                              <Loader2 className="animate-spin mx-auto" size={40} />
                              <p className="text-[10px] font-black uppercase">Sincronizando Anuncio ({uploadProgress}%)</p>
                           </motion.div>
                         ) : showSuccess ? (
                           <motion.div key="success" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} className="space-y-4">
                              <FileCheck className="mx-auto" size={40} />
                              <p className="text-[10px] font-black uppercase text-black">¡Material Recibido!</p>
                           </motion.div>
                         ) : (
                           <>
                             <UploadCloud size={40} className="animate-bounce" />
                             <div>
                                <h4 className="text-lg font-black uppercase italic leading-tight">Sube tu Arte <br />o Link de Venta</h4>
                             </div>
                             <button onClick={handleFileSelect} className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                SUBIR MATERIAL
                             </button>
                           </>
                         )}
                       </AnimatePresence>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* PREVISUALIZACIÓN DE UBICACIÓN */}
        <section id="ad-selector" className="mt-40 space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Escoge tu <span className="text-cyan-400">Espacio de Poder</span></h2>
              <p className="text-gray-500 uppercase font-black text-xs tracking-widest">Visualiza dónde dominará tu marca</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-white/[0.02] border border-white/5 p-12 md:p-20 rounded-[80px]">
              <div className="space-y-6">
                 {adPlacements.map((ad) => (
                    <button 
                      key={ad.id}
                      onClick={() => setSelectedPlacement(ad)}
                      className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex items-center justify-between group ${selectedPlacement.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 hover:border-white/20 bg-black'}`}
                    >
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlacement.id === ad.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-gray-500'}`}>
                             {ad.icon}
                          </div>
                          <div>
                             <h4 className="text-xl font-black uppercase italic tracking-tight">{ad.title}</h4>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ad.impressions} Impresiones potenciales</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black">{geoData?.currencySymbol || 'S/'}{(ad.price * (geoData?.rate || 1)).toFixed(0)}</p>
                          <p className="text-[8px] text-gray-600 font-black uppercase">Semanales</p>
                       </div>
                    </button>
                 ))}
              </div>

              <div className="relative">
                 <div className="absolute -inset-10 bg-cyan-500/10 blur-[100px] rounded-full" />
                 <div className="glass-card border-white/10 p-4 aspect-[4/3] rounded-[40px] relative overflow-hidden bg-black flex flex-col shadow-2xl">
                    <div className="h-6 w-full border-b border-white/5 flex items-center px-4 gap-2 mb-4">
                       <div className="w-2 h-2 rounded-full bg-red-500" />
                       <div className="w-2 h-2 rounded-full bg-yellow-500" />
                       <div className="w-2 h-2 rounded-full bg-green-500" />
                       <div className="h-3 w-32 bg-white/5 rounded-full mx-auto" />
                    </div>
                    
                    <div className="flex-1 space-y-4 px-6 overflow-hidden relative">
                       <div className="h-8 w-1/2 bg-white/10 rounded-xl" />
                       <div className="grid grid-cols-3 gap-3">
                          <div className="h-20 bg-white/5 rounded-2xl" />
                          <div className="h-20 bg-white/5 rounded-2xl" />
                          <div className="h-20 bg-white/5 rounded-2xl" />
                       </div>

                       <motion.div 
                        key={selectedPlacement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`border-2 border-dashed border-cyan-400 p-6 rounded-3xl flex items-center justify-center text-center bg-cyan-400/10 ${selectedPlacement.id === 'top-banner' ? 'h-32 mb-4' : selectedPlacement.id === 'sidebar-academy' ? 'h-40 w-32 absolute top-20 right-4' : 'h-24 mt-4'}`}
                       >
                          <div className="relative z-10">
                            <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1 animate-pulse">Tu Anuncio Aquí</p>
                            <p className="text-[10px] font-bold text-white uppercase italic leading-none">{selectedPlacement.title}</p>
                          </div>
                       </motion.div>

                       <div className="h-4 w-full bg-white/5 rounded-full" />
                       <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                    </div>
                 </div>
                 <div className="mt-8 text-center md:text-left">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Confirmar Ubicación:</p>
                    <h5 className="text-lg font-bold text-cyan-400 uppercase italic underline decoration-white/20">{selectedPlacement.placement}</h5>
                    
                    <div className="mt-10">
                       {isPaypalLoaded ? (
                         <PaypalButtonB2B planId={selectedPlacement.id} amount={(selectedPlacement.price).toFixed(2)} />
                       ) : (
                         <div className="w-full h-12 bg-white/5 animate-pulse rounded-full flex items-center justify-center text-[9px] text-gray-600 font-black uppercase tracking-widest">
                           Sincronizando Pasarela de Pago...
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
