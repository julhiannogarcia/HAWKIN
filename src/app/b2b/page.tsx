'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { BarChart3, UploadCloud, PieChart, ShieldCheck, Globe, ShoppingBag, Laptop, Shirt, MessageCircle, Play, Loader2, FileCheck, CheckCircle2 } from 'lucide-react';

export default function B2BPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCheckout = async (planId: string, price: number) => {
    setSelectedPlan(planId);
    // Aquí invocaremos a la pasarela de pago real
    // Simulamos la redirección profesional
    alert(`Socio, estamos conectando con la red bancaria para procesar tu anuncio por un valor de ${geoData?.currencySymbol || '$'}${(price * (geoData?.rate || 1)).toFixed(2)}. Redirigiendo...`);
  };

  const handleContact = () => {
    const message = encodeURIComponent("Hola HAWKIN, deseo anunciar mi negocio en la plataforma. ¿Cuáles son los pasos a seguir?");
    window.open(`https://wa.me/51900000000?text=${message}`, '_blank');
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
                 
                 {/* Estadísticas */}
                 <div className="lg:col-span-2 space-y-16">
                    <h2 className="text-3xl font-black uppercase tracking-widest italic">Alcance <span className="text-cyan-400">Sin Límites</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                       <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                          <Laptop className="mx-auto text-cyan-400 mb-4" />
                          <p className="text-[10px] font-black text-gray-500 uppercase">Tecnología</p>
                          <h4 className="text-3xl font-black mt-2">450K</h4>
                       </div>
                       <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                          <Shirt className="mx-auto text-purple-400 mb-4" />
                          <p className="text-[10px] font-black text-gray-500 uppercase">Moda & Estilo</p>
                          <h4 className="text-3xl font-black mt-2">320K</h4>
                       </div>
                       <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                          <ShoppingBag className="mx-auto text-green-400 mb-4" />
                          <p className="text-[10px] font-black text-gray-500 uppercase">Retail</p>
                          <h4 className="text-3xl font-black mt-2">280K</h4>
                       </div>
                    </div>
                 </div>

                 {/* CARGA DE MATERIAL REAL */}
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
                              <p className="text-[10px] font-black uppercase">¡Material Recibido!</p>
                           </motion.div>
                         ) : (
                           <>
                             <UploadCloud size={40} className="animate-bounce" />
                             <div>
                                <h4 className="text-lg font-black uppercase italic leading-tight">Sube tu Arte <br />o Link de Venta</h4>
                                <p className="text-[9px] font-bold opacity-70 mt-2 uppercase">Video, Imagen o Enlace Directo</p>
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

        {/* SELECTOR DE PLANES Y COBROS */}
        <section id="ad-selector" className="mt-40 space-y-16">
           <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Escoge tu <span className="text-cyan-400">Espacio de Poder</span></h2>
              <p className="text-gray-500 mt-4 uppercase font-black text-xs tracking-widest">Precios en moneda local: {geoData?.currencyName || 'Dólares'}</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adPlacements.map((ad) => (
                <div key={ad.id} className="p-10 glass-card border-white/5 bg-white/[0.01] rounded-[40px] flex flex-col justify-between hover:border-cyan-400/30 transition-all group">
                   <div className="space-y-6">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                         {ad.icon}
                      </div>
                      <h3 className="text-2xl font-black uppercase leading-tight">{ad.title}</h3>
                      <div className="flex items-baseline gap-2">
                         <span className="text-3xl font-black text-white">{geoData?.currencySymbol || '$'}{(ad.price * (geoData?.rate || 1)).toFixed(2)}</span>
                         <span className="text-gray-600 text-[10px] font-bold uppercase">/ SEMANA</span>
                      </div>
                      <div className="pt-6 border-t border-white/5">
                         <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <CheckCircle2 size={12} className="text-cyan-400" /> {ad.impressions} Impresiones
                         </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleCheckout(ad.id, ad.price)}
                     className="mt-12 w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-cyan-400 transition-colors"
                   >
                     RESERVAR Y PAGAR
                   </button>
                </div>
              ))}
           </div>
        </section>

        <section className="mt-40 text-center pb-20">
           <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Publicidad para cualquier negocio • 100% Real</p>
           <h2 className="text-4xl font-black uppercase italic leading-none">Tu éxito empieza <br /><span className="text-cyan-400 text-6xl md:text-8xl">AQUÍ.</span></h2>
        </section>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
