'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShieldAlert, Lock, EyeOff, Terminal, Zap, ShieldCheck, ExternalLink, Laptop, Smartphone, Monitor, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { useAlpha } from '@/context/AlphaContext';
import Link from 'next/link';

export default function ShieldPage() {
  const { user } = useAlpha();
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShieldData = async () => {
      try {
        const res = await fetch('/api/news/shield');
        const data = await res.json();
        setThreats(data.threats || []);
      } catch (e) {
        console.error("Shield Error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadShieldData();
  }, []);

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-red-500 selection:text-white">
      <Header />

      {/* BARRA DE CONFIRMACIÓN ALPHA v2.0 */}
      <div className="fixed top-[88px] left-0 w-full z-[900] bg-black/80 backdrop-blur-xl border-y border-white/5 py-3 flex items-center justify-center gap-4 overflow-hidden">
         <div className="flex items-center gap-3 animate-pulse">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-green-500">Protocolo Alpha-Safe Activado</span>
         </div>
         <div className="h-4 w-px bg-white/10" />
         <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest italic">Sincronizado con base de datos de amenazas globales</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-56 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 1. MONITOR DE AMENAZAS EN VIVO */}
          <div className="lg:col-span-8 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-red-600/10 rounded-2xl border border-red-600/20">
                    <ShieldAlert className="text-red-500" size={32} />
                 </div>
                 <div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">HAWKIN <span className="text-red-600">SHIELD.</span></h1>
                    <p className="text-gray-500 mt-2 text-xs font-black uppercase tracking-[0.4em]">Inteligencia de Ciberdefensa y Privacidad</p>
                 </div>
              </div>
            </header>

            {loading ? (
              <div className="p-20 bg-white/[0.01] border border-dashed border-white/10 rounded-[60px] flex flex-col items-center justify-center gap-6">
                 <Loader2 className="animate-spin text-red-500" size={40} />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">Analizando red global de amenazas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {threats.map((threat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="p-10 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-[50px] space-y-8 relative overflow-hidden group hover:border-red-600/30 transition-all"
                  >
                    <div className="flex justify-between items-start">
                       <span className={`text-[8px] font-black px-4 py-1.5 rounded-full border ${threat.level === 'ALTO' ? 'bg-red-600/10 text-red-500 border-red-600/20' : 'bg-yellow-600/10 text-yellow-500 border-yellow-600/20'} uppercase tracking-widest`}>Riesgo {threat.level}</span>
                       <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-red-500 transition-colors"><Zap size={14} /></div>
                    </div>
                    <h3 className="text-2xl font-black uppercase italic leading-none">{threat.title}</h3>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">{threat.description}</p>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">{threat.source}</span>
                       <button className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 hover:text-white transition-colors">Ver Detalles <ExternalLink size={10} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* 2. PROTOCOLOS DE SEGURIDAD */}
          <div className="lg:col-span-4 space-y-12">
            <h2 className="text-2xl font-black uppercase italic tracking-widest flex items-center gap-4 border-b border-white/5 pb-8">
              <Zap className="text-yellow-500" /> Seguridad v2.0
            </h2>
            
            {/* ALERTA DE FRAUDE DINÁMICA */}
            <div className="p-10 bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/20 rounded-[50px] space-y-6 relative overflow-hidden">
               <div className="absolute -top-4 -right-4 opacity-10">
                  <ShieldCheck size={100} className="text-yellow-500" />
               </div>
               <h3 className="text-yellow-500 font-black text-lg uppercase italic tracking-tighter">Protocolo Anti-Deepfake</h3>
               <p className="text-sm text-gray-300 leading-relaxed font-light italic">
                 "Fundador, el fraude por IA está en aumento. <b className="text-white">Verifica siempre por un segundo canal físico</b> antes de cualquier movimiento de capital solicitado por video."
               </p>
               <div className="pt-6 border-t border-white/10">
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">HAWKIN SHIELD PROTOCOL</p>
               </div>
            </div>

            {/* PUBLICIDAD DE IMPACTO SIDEBAR */}
            <div className="mt-8">
               <AdSpace isPremium={!!user} type="sidebar" />
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}

function Loader2({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
