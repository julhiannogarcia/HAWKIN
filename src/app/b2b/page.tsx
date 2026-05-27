'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { 
  BarChart3, UploadCloud, Globe, ShoppingBag, MessageCircle, 
  Play, Loader2, FileCheck, CheckCircle2, ChevronRight, ArrowLeft,
  ExternalLink, Radio, Tv, CreditCard
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

  // 1. OBTENER GEOLOCALIZACIÓN (IP, PAÍS, MONEDA)
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        setGeoData(data);
      } catch (e) {
        console.error("Geo error", e);
        // Fallback básico
        setGeoData({ countryCode: 'US', currency: 'USD', locale: 'en_US' });
      }
    };
    fetchGeo();
  }, []);

  // 2. CARGAR PAYPAL DINÁMICAMENTE SEGÚN IP
  useEffect(() => {
    if (!geoData) return;

    const clientId = 'ASALTTzsK9I-m087Qv64N3tPLr_HFAyDKhliwe1bbS';
    const currency = geoData.currency || 'USD';
    const locale = geoData.countryCode === 'US' ? 'en_US' : 'es_ES';

    // Limpiar scripts previos para evitar conflictos de carga
    const existingScript = document.getElementById('paypal-sdk-v5');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'paypal-sdk-v5';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=${locale}&disable-funding=credit,card`;
    script.async = true;
    script.onload = () => {
      console.log("PayPal SDK Loaded for:", locale, currency);
      setIsPaypalLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById('paypal-sdk-v5');
      if (s) s.remove();
    };
  }, [geoData]);

  const handleFileSelect = () => fileInputRef.current?.click();

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
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleContact = () => {
    window.open(`mailto:julhianno@aihawkin.com?subject=B2B Proposal&body=Interesado en pauta corporativa.`, '_self');
  };

  const PaypalButtonB2B = ({ planId, amount, currency }: { planId: string, amount: string, currency: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isPaypalLoaded && containerRef.current && window.paypal) {
        containerRef.current.innerHTML = '';
        window.paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'checkout', height: 50 },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: `HAWKIN B2B - ${planId}`,
                amount: { currency_code: currency, value: amount }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING' }
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            alert(`¡Reserva Exitosa! ID: ${order.id}`);
            window.location.href = "/b2b?success=true";
          }
        }).render(containerRef.current);
      }
    }, [isPaypalLoaded, planId, amount, currency]);

    return <div ref={containerRef} className="w-full mt-4" />;
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500">
      <Header />
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />

      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        {/* HERO */}
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN GLOBAL MEDIA</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-white">
            Domina el <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Mercado.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Streaming en vivo y anuncios inteligentes. Transforma tu marca en autoridad mundial.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-12">
             <button onClick={() => document.getElementById('previsualizador')?.scrollIntoView({behavior: 'smooth'})} className="btn-glow text-[10px] py-6 px-16 uppercase">
                Empezar Ahora
             </button>
             <button onClick={handleContact} className="px-16 py-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
               Tarifas Élite
             </button>
          </div>
        </section>

        {/* CONSOLA DE PREVISUALIZACIÓN */}
        <section id="previsualizador" className="mt-40 space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white line-none">Consola de <span className="text-cyan-400">Poder B2B</span></h2>
              <p className="text-gray-600 uppercase font-black text-xs tracking-widest flex items-center justify-center gap-2">
                 <Globe size={14} /> Sincronización Automática: {geoData?.countryCode || 'INT'} | {geoData?.currency || 'USD'}
              </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center bg-white/[0.01] border border-white/5 p-8 md:p-20 rounded-[80px] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5"><BarChart3 size={150} /></div>
              
              <div className="space-y-6 relative z-10">
                 {adPlacements.map((ad) => (
                    <button 
                      key={ad.id}
                      onClick={() => setSelectedPlacement(ad)}
                      className={`w-full p-8 rounded-[40px] border-2 text-left transition-all flex flex-col gap-4 group ${selectedPlacement.id === ad.id ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                    >
                       <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedPlacement.id === ad.id ? 'bg-cyan-400 text-black shadow-[0_0_20px_#22d3ee]' : 'bg-white/5 text-gray-500'}`}>
                                {ad.icon}
                             </div>
                             <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tight">{ad.title}</h4>
                                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">{ad.impressions} Views Semanales</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-white">{geoData?.currencySymbol || '$'}{(ad.price * (geoData?.rate || 1)).toFixed(0)}</p>
                          </div>
                       </div>
                       
                       {selectedPlacement.id === ad.id && (
                         <motion.ul initial={{opacity:0, y: -10}} animate={{opacity:1, y: 0}} className="pl-20 space-y-2">
                            {ad.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                 <CheckCircle2 size={10} className="text-cyan-400" /> {f}
                              </li>
                            ))}
                         </motion.ul>
                       )}
                    </button>
                 ))}
              </div>

              <div className="relative">
                 <div className="absolute -inset-10 bg-cyan-500/10 blur-[100px] rounded-full" />
                 <div className="glass-card border-white/10 p-6 aspect-[16/10] rounded-[50px] relative overflow-hidden bg-black flex flex-col shadow-2xl">
                    <div className="flex-1 flex flex-col justify-center items-center gap-8 relative">
                       {selectedPlacement.id === 'live-stream-hero' ? (
                         <div className="w-full h-full bg-gray-900 rounded-[30px] border border-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-40 animate-pulse" />
                            <div className="absolute top-4 left-4 bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                               <div className="w-2 h-2 bg-white rounded-full" />
                               <span className="text-[9px] font-black uppercase text-white">LIVE STREAM</span>
                            </div>
                            <Play size={40} className="text-white fill-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-xl font-black text-[9px] uppercase shadow-xl cursor-pointer hover:bg-white transition-all">
                               <ExternalLink size={12} /> Ir a mi Tienda
                            </div>
                         </div>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center border-4 border-dashed border-white/10 rounded-[35px] relative">
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] rotate-12">Simulador de Ubicación</span>
                            <div className={`absolute p-6 rounded-2xl bg-cyan-400/20 border-2 border-cyan-400 flex flex-col items-center gap-2 ${selectedPlacement.id === 'sidebar-academy' ? 'top-6 right-6 w-32 h-40' : 'bottom-6 inset-x-12 h-20 flex-row justify-between'}`}>
                               <p className="text-[8px] font-black text-white uppercase text-center italic">{selectedPlacement.title}</p>
                               <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-black shadow-lg"><ExternalLink size={12} /></div>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="mt-12 bg-white/[0.02] border border-white/5 p-8 rounded-[40px] space-y-6">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reserva el espacio:</p>
                       <p className="text-xs font-bold text-cyan-400 uppercase italic underline">{selectedPlacement.placement}</p>
                    </div>
                    
                    <div className="min-h-[60px] flex items-center justify-center">
                       {isPaypalLoaded ? (
                         <PaypalButtonB2B 
                            planId={selectedPlacement.id} 
                            amount={(selectedPlacement.price).toFixed(2)} 
                            currency={geoData?.currency || 'USD'}
                         />
                       ) : (
                         <div className="flex flex-col items-center gap-4 text-center">
                            <Loader2 className="animate-spin text-cyan-400" size={32} />
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] animate-pulse">Sincronizando Pasarela Internacional ({geoData?.locale || '...'})</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CARGA DE MATERIAL */}
        <div className="mt-40 glass-card border-white/5 p-20 rounded-[80px] bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl relative overflow-hidden">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">Carga tu <span className="text-cyan-400">Material Pro</span></h2>
                 <p className="text-gray-400 text-lg leading-relaxed font-light">
                    Sube tu video o imagen clickable tras el pago. Incluye el enlace de destino para maximizar tu retorno de inversión.
                 </p>
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/10">
                       <div className="w-10 h-10 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400"><Tv size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-white">Soporte Multiformato</p>
                          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest tracking-tighter">MP4, GIF, PNG de Alta Fidelidad</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 bg-white text-black rounded-[50px] flex flex-col items-center gap-8 text-center shadow-[0_0_50px_rgba(255,255,255,0.1)] group">
                 <AnimatePresence mode="wait">
                    {isUploading ? (
                      <motion.div key="l" initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
                         <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto"><div className="h-full bg-cyan-500" style={{width: `${uploadProgress}%`}} /></div>
                         <p className="text-[10px] font-black uppercase tracking-widest">Transmitiendo al Ecosistema...</p>
                      </motion.div>
                    ) : showSuccess ? (
                      <motion.div key="s" initial={{scale:0.8}} animate={{scale:1}} className="space-y-4 text-green-600">
                         <CheckCircle2 size={60} className="mx-auto" />
                         <p className="text-xs font-black uppercase italic">Anuncio Configurado con Éxito</p>
                      </motion.div>
                    ) : (
                      <>
                        <UploadCloud size={60} className="text-gray-300 group-hover:text-cyan-500 transition-colors" />
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">Subir Arte Clickable</h4>
                        <button onClick={handleFileSelect} className="px-12 py-5 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all shadow-xl">Seleccionar Archivos</button>
                      </>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
