'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { useAlpha } from '@/context/AlphaContext';
import { Heart, Globe, Users, Zap, Mail, ShieldCheck, Info, Loader2 } from 'lucide-react';

export default function DonacionPage() {
  const { user } = useAlpha();
  const [geoData, setGeoData] = useState<any>(null);
  const [amount, setAmount] = useState('10.00');
  const [isPaypalLoaded, setIsPaypalLoaded] = useState(false);
  const [isLoadingGeo, setIsLoadingGeo] = useState(true);

  useEffect(() => {
    fetch('/api/geo').then(res => res.json()).then(data => {
      setGeoData(data);
      setIsLoadingGeo(false);
    }).catch(() => setIsLoadingGeo(false));
  }, []);

  const totalPEN = geoData ? (parseFloat(amount) * geoData.rate).toFixed(2) : '0.00';

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-pink-500 selection:text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
           
           {/* LADO IZQUIERDO: MISIÓN */}
           <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full mb-4">
                    <Heart className="text-pink-500 animate-pulse" size={14} />
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em]">Filantropía Alpha</span>
                 </div>
                 <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                    Misión <span className="text-gray-600 text-stroke">Social.</span>
                 </h1>
                 <p className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl">
                    HAWKIN no es solo tecnología. Es una red de impacto humano. Tu contribución acelera el desarrollo de herramientas de inclusión y educación global.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 hover:border-pink-500/30 transition-all group">
                    <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 group-hover:rotate-12 transition-transform">
                       <Globe size={28} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Inclusión Digital</h3>
                    <p className="text-gray-500 text-sm font-light">Llevamos el poder de la IA a comunidades con recursos limitados.</p>
                 </div>
                 <div className="p-10 rounded-[50px] bg-white/[0.01] border border-white/5 space-y-6 hover:border-cyan-500/30 transition-all group">
                    <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:-rotate-12 transition-transform">
                       <Zap size={28} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Becas de Talento</h3>
                    <p className="text-gray-500 text-sm font-light">Financiamos la educación de futuros arquitectos de inteligencia.</p>
                 </div>
              </div>

              <div className="p-12 rounded-[60px] bg-gradient-to-br from-pink-500/5 to-transparent border border-white/5 space-y-8">
                 <h4 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-4">
                    <Info size={16} /> Destino del Capital
                 </h4>
                 <div className="space-y-6">
                    <div className="flex gap-4 text-left">
                       <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 shrink-0"><ShieldCheck size={20} /></div>
                       <p className="text-sm text-gray-300"><b>Infraestructura:</b> Servidores y nodos de baja latencia para el Radar.</p>
                    </div>
                    <div className="flex gap-4 text-left">
                       <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 shrink-0"><Users size={20} /></div>
                       <p className="text-sm text-gray-300"><b>Comunidad:</b> Eventos presenciales y bootcamps de entrenamiento.</p>
                    </div>
                    <div className="flex gap-4 text-left">
                       <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 shrink-0"><Zap size={20} /></div>
                       <p className="text-sm text-gray-300"><b>Impulso:</b> Equipos y software para nuevos talentos Alpha.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-10">
                 <AdSpace isPremium={!!user} type="inline" />
              </div>
           </div>

           {/* LADO DERECHO: PASARELA */}
           <div className="lg:col-span-5 sticky top-32">
              <div className="glass-card bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/20 p-12 rounded-[60px] shadow-2xl">
                 <h3 className="text-xl font-black uppercase tracking-widest text-center mb-10">Monto de la Donación</h3>
                 
                 <div className="grid grid-cols-3 gap-4 mb-10">
                    {['10.00', '50.00', '100.00'].map((val) => (
                      <button 
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`py-4 rounded-2xl font-black text-xs transition-all border ${amount === val ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}
                      >
                        ${val}
                      </button>
                    ))}
                 </div>

                 <div className="space-y-8">
                    <div className="relative">
                       <input 
                         type="number" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         className="w-full bg-black/40 border-2 border-white/10 rounded-[30px] p-8 text-4xl font-black text-center outline-none focus:border-pink-500 transition-all"
                       />
                       <span className="absolute left-10 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-700">USD</span>
                    </div>

                    <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4">
                       <div className="flex justify-between items-center opacity-50">
                          <span className="text-[10px] font-bold uppercase tracking-widest">Base USD</span>
                          <span className="text-sm font-black font-mono">${amount}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Total en Soles (PEN)</span>
                          <span className="text-2xl font-black font-mono text-white">S/ {totalPEN}</span>
                       </div>
                       <p className="text-[7px] text-center text-gray-700 uppercase tracking-widest">Tipo de cambio real: 1 USD = {geoData?.rate || '...'} PEN</p>
                    </div>

                    <div className="pt-6 space-y-4">
                       <button className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:bg-pink-500 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4">
                          Contribuir con PayPal <Heart size={14} fill="currentColor" />
                       </button>
                       <p className="text-center text-[8px] font-bold text-gray-600 uppercase tracking-widest">Transacción encriptada punto a punto</p>
                    </div>
                 </div>
              </div>

              <div className="mt-8 flex items-center gap-6 justify-center">
                 <div className="flex items-center gap-3">
                    <Mail size={16} className="text-pink-500" />
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">ayuda@aihawkin.com</span>
                 </div>
              </div>
           </div>

        </div>
      </div>

      <Footer /><GlobalTicker />
    </main>
  );
}
