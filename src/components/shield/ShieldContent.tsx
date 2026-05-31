'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShieldAlert, Lock, EyeOff, Terminal, Zap, ShieldCheck, ExternalLink, Laptop, Smartphone, Monitor, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import AdSpace from '@/components/AdSpace';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ShieldPage() {
  const { data: session } = useSession();
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShieldData = async () => {
      try {
        const res = await fetch('/api/news/shield');
        const data = await res.json();
        setThreats(data.threats || []);
        setLoading(false);
      } catch (e) {
        console.error("Error loading Shield data", e);
      }
    };
    loadShieldData();
  }, []);

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-red-500 selection:text-white">
      <Header />

      {/* BARRA DE CONFIRMACIÓN ALPHA v2.0 */}
      <div className="fixed top-[88px] left-0 w-full z-[900] bg-red-600 text-white py-2 px-6 text-center shadow-[0_0_30px_rgba(220,38,38,0.5)]">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">SISTEMA ALPHA SHIELD v2.0 • MONITOREO GLOBAL ACTIVO • NO USAR CACHÉ</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-56 pb-32">
        {/* Hero Shield Evolucionado */}
        <section className="text-center space-y-10 mb-32">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-28 h-24 bg-red-500/10 border border-red-500/40 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(239,68,68,0.2)] group"
          >
            <ShieldAlert size={56} className="text-red-500 group-hover:scale-110 transition-transform animate-pulse" />
          </motion.div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
               <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">HAWKIN SHIELD LIVE MONITOR</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase italic">
              Blindaje <span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]">Total.</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Detección de vulnerabilidades en tiempo real y manuales de defensa de élite para cada sistema operativo del mundo.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 1. RADAR DE VULNERABILIDADES (REAL Y EN VIVO) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
               <h2 className="text-2xl font-black uppercase italic tracking-widest flex items-center gap-4">
                 <Terminal className="text-red-500" /> Amenazas Globales Activas
               </h2>
               <span className="text-[9px] font-black text-gray-500 uppercase">Actualización: Milisegundos</span>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-white/[0.02] rounded-[40px] animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {threats.map((threat) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    key={threat.id} 
                    className="p-10 glass-card border-red-500/10 bg-red-500/[0.02] rounded-[40px] group hover:border-red-500/40 transition-all shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <ShieldAlert size={120} />
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
                       <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${
                            threat.severity === 'CRÍTICA' ? 'bg-red-600 text-white border-red-600' : 'bg-orange-600/10 text-orange-500 border-orange-500/20'
                          }`}>
                            {threat.severity}
                          </span>
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{threat.source}</span>
                       </div>
                       <span className="text-[10px] font-black text-gray-400 uppercase italic flex items-center gap-2">
                         <Clock size={12} className="text-red-500" /> {new Date(threat.date).toLocaleTimeString()}
                       </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black mb-6 group-hover:text-red-500 transition-colors leading-tight italic uppercase tracking-tighter">
                      {threat.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                       <div className="p-6 bg-black/60 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-3 flex items-center gap-2">
                             <Activity size={12} className="text-red-500" /> Impacto de Riesgo
                          </p>
                          <p className="text-sm text-gray-400 font-light">{threat.impact}</p>
                       </div>
                       <div className="p-6 bg-green-500/5 rounded-3xl border border-green-500/20">
                          <p className="text-[10px] font-black text-green-500 uppercase mb-3 flex items-center gap-2">
                             <ShieldCheck size={12} /> Contramedida HAWKIN
                          </p>
                          <p className="text-sm text-gray-300 font-bold">{threat.howToAvoid}</p>
                       </div>
                    </div>
                    
                    <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
                       <a href={threat.link} target="_blank" className="flex items-center gap-3 text-[10px] font-black text-white hover:text-red-500 transition-colors uppercase tracking-[0.3em]">
                          Analizar Código <ExternalLink size={14} />
                       </a>
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
               <AdSpace isPremium={!!session} type="sidebar" />
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}

// Iconos locales para la interfaz
function Activity({ size, className }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

function Clock({ size, className }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
