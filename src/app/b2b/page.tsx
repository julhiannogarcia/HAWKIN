'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, Play, Loader2, FileCheck, CheckCircle2 } from 'lucide-react';

export default function B2BPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Obtener moneda por IP
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

    // 2. Cargar el SDK de PayPal
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

  const adPlacements = [
    { id: 'top-banner', title: 'Top Banner Explosivo', price: 499, impressions: '500k+', icon: <Globe className="text-cyan-400" /> },
    { id: 'video-radar', title: 'Video-Anuncio en Radar', price: 399, impressions: '400k+', icon: <Play className="text-purple-500" /> },
    { id: 'shop-link', title: 'Shopping Link Directo', price: 199, impressions: '150k+', icon: <ShoppingBag className="text-green-500" /> },
  ];

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
    const message = encodeURIComponent("Hola HAWKIN, deseo anunciar mi negocio en la plataforma. ¿Cuáles son los pasos a seguir?");
    window.open(`https://wa.me/51900000000?text=${message}`, '_blank');
  };

  // Componente interno para los botones de PayPal en B2B
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

        {/* SELECTOR DE PLANES CON PAYPAL REAL */}
        <section id="ad-selector" className="mt-40 space-y-16">
           <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">Escoge tu <span className="text-cyan-400">Espacio de Poder</span></h2>
              <p className="text-gray-500 mt-4 uppercase font-black text-xs tracking-widest">Reserva segura global vía PayPal • {geoData?.currencyName || 'Soles'}</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adPlacements.map((ad) => (
                <div key={ad.id} className="p-10 glass-card border-white/5 bg-white/[0.01] rounded-[40px] flex flex-col justify-between hover:border-cyan-400/30 transition-all group">
                   <div className="space-y-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         {ad.icon}
                      </div>
                      <h3 className="text-2xl font-black uppercase leading-tight text-white">{ad.title}</h3>
                      <div className="flex items-baseline gap-2">
                         <span className="text-3xl font-black text-white">{geoData?.currencySymbol || 'S/'}{(ad.price * (geoData?.rate || 1)).toFixed(2)}</span>
                         <span className="text-gray-600 text-[10px] font-bold uppercase">/ SEMANA</span>
                      </div>
                      <div className="pt-6 border-t border-white/5">
                         <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <CheckCircle2 size={12} className="text-cyan-400" /> {ad.impressions} Impresiones
                         </div>
                      </div>
                   </div>
                   
                   {/* BOTÓN DE PAYPAL DINÁMICO */}
                   <div className="mt-12 min-h-[60px]">
                      {isPaypalLoaded ? (
                        <PaypalButtonB2B planId={ad.id} amount={(ad.price).toFixed(2)} />
                      ) : (
                        <div className="w-full h-12 bg-white/5 animate-pulse rounded-full flex items-center justify-center text-[9px] text-gray-600 font-black uppercase">
                          Cargando Pasarela...
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </section>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
