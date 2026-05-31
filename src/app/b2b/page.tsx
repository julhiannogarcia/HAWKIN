'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Loader2, MessageCircle, Radio, 
  LayoutDashboard, ShoppingBag, Target, Tv, Eye, ExternalLink, Play,
  Sparkles, Calendar, Globe, MapPin, Zap, ChevronRight
} from 'lucide-react';

export default function B2BPage() {
  const [selectedId, setSelectedId] = useState('plus');
  const [isGlobal, setIsGlobal] = useState(false);
  const [geoData, setGeoData] = useState<any>({ countryCode: 'PE', currencySymbol: 'S/', rate: 1 });
  const [isMounted, setIsMounted] = useState(false);
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const AD_PLANS = useMemo(() => [
    { 
      id: 'plus', 
      title: 'Plan Maestro Plus', 
      pricePEN: isGlobal ? 1499 : 999, 
      priceUSD: isGlobal ? "395.00" : "265.00", 
      duration: '20 DÍAS',
      placement: 'Banner Principal + Live + Video', 
      reach: isGlobal ? '10M+ Global' : '2.5M+ Local', 
      desc: 'El máximo nivel de impacto. Incluye video 4K en la cabecera global y rotación prioritaria.', 
      features: ['Soporta Video MP4', 'Imágenes Alta Fidelidad', 'Ubicación Premium', isGlobal ? 'Alcance Mundial' : 'Segmentación Local'],
      icon: <Sparkles className="text-blue-400" /> 
    },
    { 
      id: 'sidebar', 
      title: 'Plan Táctico Intermedio', 
      pricePEN: isGlobal ? 899 : 699, 
      priceUSD: isGlobal ? "235.00" : "185.00", 
      duration: '15 DÍAS',
      placement: 'Lateral de todo el ecosistema', 
      reach: isGlobal ? '5M+ Global' : '1M+ Local', 
      desc: 'Presencia constante en el sidebar. Sólo imágenes estáticas de alta calidad.', 
      features: ['Sólo Imágenes', 'Ubicación Lateral', 'Alta Visibilidad', isGlobal ? 'Todo el Mundo' : 'País Específico'],
      icon: <LayoutDashboard className="text-blue-300" /> 
    },
    { 
      id: 'native', 
      title: 'Plan Escencial 7', 
      pricePEN: isGlobal ? 499 : 399, 
      priceUSD: isGlobal ? "135.00" : "105.00", 
      duration: '7 DÍAS',
      placement: 'Nativo en Radar (Sin Banner Top)', 
      reach: isGlobal ? '2M+ Global' : '500k+ Local', 
      desc: 'Impacto rápido para campañas cortas. Sin banner principal y sin video.', 
      features: ['7 Días de Pauta', 'Anuncio Nativo', 'Económico', isGlobal ? 'Visibilidad Global' : 'Tráfico Local'],
      icon: <ShoppingBag className="text-blue-200" /> 
    },
  ], [isGlobal]);

  const selectedPlacement = AD_PLANS.find(p => p.id === selectedId) || AD_PLANS[0];

  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const placementMap: Record<string, string> = {
        'plus': 'TOP_BANNER',
        'sidebar': 'SIDEBAR',
        'native': 'NEWS_FEED'
      };
      const res = await fetch(`/api/ads/availability?placement=${placementMap[selectedId]}&country=${isGlobal ? 'GLOBAL' : geoData.countryCode}`);
      const data = await res.json();
      setAvailability(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/geo').then(res => res.json()).then(data => { 
      if(data?.countryCode) setGeoData(data); 
    }).catch(() => console.log("Geo Local"));
  }, []);

  useEffect(() => {
    if (isMounted) fetchAvailability();
  }, [isMounted, selectedId, isGlobal, geoData.countryCode]);

  useEffect(() => {
    if (isMounted && !isPaypalReady) {
       const timer = setTimeout(() => {
          if ((window as any).paypal) setIsPaypalReady(true);
       }, 1500);
       return () => clearTimeout(timer);
    }
  }, [isMounted, selectedId, isGlobal]);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#010101] text-white font-sans overflow-x-hidden flex flex-col">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32 w-full flex-1">
        <section className="text-center space-y-8 mb-40">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
             <Globe className="text-blue-500 animate-pulse" size={14} />
             <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">Ecosistema Publicitario Global</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic uppercase text-center">
            Poder <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Comercial.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
             Visualiza tu marca y activa tu pauta publicitaria con alcance real. 
             Sincronización por IP y disponibilidad garantizada por contrato digital.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* PLANES Y CONFIGURACIÓN */}
           <div className="lg:col-span-4 space-y-8">
              <div className="flex flex-col gap-6">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                       <Target className="text-blue-400" size={20} /> Tu Estrategia
                    </h3>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                       <button 
                        onClick={() => setIsGlobal(false)}
                        className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${!isGlobal ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                       >Local</button>
                       <button 
                        onClick={() => setIsGlobal(true)}
                        className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${isGlobal ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                       >Global</button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {AD_PLANS.map((ad) => (
                      <button 
                        key={ad.id} 
                        onClick={() => { setSelectedId(ad.id); setIsPaypalReady(false); }} 
                        className={`w-full p-8 rounded-[40px] border-2 text-left transition-all group ${selectedId === ad.id ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-white/[0.01] opacity-60 hover:opacity-100'}`}
                      >
                         <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${selectedId === ad.id ? 'bg-blue-500 text-black' : 'bg-white/5'}`}>{ad.icon}</div>
                              <p className="text-base font-black uppercase italic leading-none">{ad.title}</p>
                            </div>
                            <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded text-blue-400 border border-blue-500/20">{ad.duration}</span>
                         </div>
                         <div className="flex justify-between items-end">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pl-1">Alcance: <span className="text-white">{ad.reach}</span></p>
                            <p className="text-xl font-black text-white">S/{ad.pricePEN}</p>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>

              {/* CALENDARIO DE DISPONIBILIDAD REAL */}
              <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[50px] space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><Calendar size={120} /></div>
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                       <Calendar className="text-blue-500" size={18} />
                       <h4 className="text-xs font-black uppercase tracking-widest">Disponibilidad Real</h4>
                    </div>
                    {loadingAvailability && <Loader2 className="animate-spin text-blue-500" size={14} />}
                 </div>
                 
                 <div className="grid grid-cols-7 gap-2 relative z-10">
                    {availability?.days.map((d: any) => (
                      <div 
                        key={d.day} 
                        title={`${d.totalSlots - d.slotsTaken} cupos disponibles`}
                        className={`aspect-square rounded-xl flex items-center justify-center text-[9px] font-black border transition-all ${d.available ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:scale-110' : 'bg-red-500/10 border-red-500/20 text-red-900 opacity-40 cursor-not-allowed'}`}
                      >
                         {d.day}
                      </div>
                    ))}
                 </div>
                 <div className="flex items-center justify-between px-2 relative z-10">
                    <p className="text-[7px] font-bold text-gray-600 uppercase tracking-[0.2em]">Celdas verdes: Cupos disponibles</p>
                    <p className="text-[7px] font-black text-blue-500 uppercase italic">Límite: 5 Ads / Día</p>
                 </div>
              </div>
           </div>

           {/* MONITOR DE VISIÓN Y PAGO */}
           <div className="lg:col-span-8 space-y-12">
              <div className="glass-card border-white/10 p-4 aspect-video rounded-[60px] bg-[#050505] overflow-hidden flex flex-col shadow-2xl border-2 group relative">
                 <div className="flex-1 rounded-[45px] overflow-hidden bg-black relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <div className="absolute top-10 left-10 z-20 flex flex-col gap-3">
                       <span className="text-[10px] font-black bg-blue-600 text-white px-5 py-2 rounded-full uppercase italic tracking-widest shadow-2xl">Vista Previa: {selectedPlacement.title}</span>
                       <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">Simulador de Impacto v3.0</span>
                    </div>
                    {selectedId === 'plus' ? (
                       <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-[3s]">
                          <source src="https://player.vimeo.com/external/370371480.hd.mp4?s=983b065306917f8a7e5898d63604f5e71490279e&profile_id=175" type="video/mp4" />
                       </video>
                    ) : (
                       <div className="w-full h-full bg-[#080808] flex items-center justify-center p-20">
                          <div className="text-center space-y-6">
                             <div className="p-8 bg-white/5 rounded-full inline-block border border-white/10"><LayoutDashboard size={48} className="text-gray-700" /></div>
                             <p className="text-gray-700 font-black uppercase tracking-[0.5em] text-xs">Posicionamiento {selectedPlacement.placement}</p>
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              {/* PASARELA DE PAGO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 flex flex-col justify-between h-full shadow-xl">
                    <div className="space-y-6">
                       <div className="flex items-center gap-3">
                          <h5 className="text-xl font-black uppercase italic text-white leading-tight underline decoration-blue-500/30">{selectedPlacement.placement}</h5>
                          <div className={`p-2 rounded-lg ${isGlobal ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'}`}>
                             {isGlobal ? <Globe size={14} /> : <MapPin size={14} />}
                          </div>
                       </div>
                       <p className="text-gray-500 text-xs font-light leading-relaxed">{selectedPlacement.desc}</p>
                       <div className="flex flex-wrap gap-2">
                          {selectedPlacement.features.map((f: string, i: number) => (
                             <span key={i} className="text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">{f}</span>
                          ))}
                       </div>
                    </div>
                    <div className="mt-8">
                       <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Inversión por {selectedPlacement.duration} {isGlobal ? '(GLOBAL)' : '(LOCAL)'}</p>
                       <p className="text-4xl font-black text-blue-500">S/{selectedPlacement.pricePEN}</p>
                    </div>
                 </div>

                 <div className="p-10 rounded-[50px] bg-white text-black flex flex-col items-center justify-center gap-6 shadow-2xl relative border-4 border-blue-500/20 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="text-center space-y-4 relative z-10">
                       <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl group-hover:scale-110 transition-transform">
                          <Zap size={32} fill="currentColor" className="text-blue-500" />
                       </div>
                       <div>
                          <h6 className="font-black uppercase italic tracking-tighter text-2xl">Activar Ahora.</h6>
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Checkout Seguro HAWKIN</p>
                       </div>
                    </div>

                    <div className="w-full relative z-10 mt-4">
                      {isPaypalReady ? (
                        <div className="space-y-4">
                           <button className="w-full py-5 bg-blue-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 shadow-xl flex items-center justify-center gap-3">
                              PAGAR CON PAYPAL <ChevronRight size={14} />
                           </button>
                           <p className="text-[7px] text-gray-400 font-bold uppercase text-center">Transacción procesada en USD al cambio del día</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 py-8 bg-gray-50 rounded-3xl animate-pulse">
                           <Loader2 className="animate-spin text-blue-600" />
                           <span className="text-[8px] font-black uppercase text-gray-400">Sincronizando Pasarela Alpha...</span>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* BENEFICIOS B2B */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[{ title: 'Visibilidad 360', icon: <Eye size={32} />, text: 'Presencia masiva en el Radar, Trading y zonas Alpha.' }, { title: 'Clic Directo', icon: <ExternalLink size={32} />, text: 'Botones inteligentes a tu web.' }, { title: 'Calidad 4K', icon: <Tv size={32} />, text: 'Soporte para videos de alta fidelidad.' }].map((item, i) => (
             <div key={i} className="p-12 rounded-[50px] bg-white/[0.01] border border-white/5 hover:border-blue-500/20 transition-all group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:rotate-12 transition-transform">{item.icon}</div>
                <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">{item.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{item.text}</p>
             </div>
           ))}
        </div>
      </div>
      <Footer /><GlobalTicker />
    </div>
  );
}
