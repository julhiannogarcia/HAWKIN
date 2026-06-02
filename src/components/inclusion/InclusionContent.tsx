'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Globe, Heart, ShieldCheck, 
  ArrowUpRight, Clock, Star, Zap, Loader2, Sparkles
} from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';

export default function InclusionContent() {
  const { user } = useAlpha();
  const [stats, setStats] = useState({
     beneficiaries: 12450,
     centers: 12,
     projects: 45
  });

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-cyan-500 selection:text-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
           
           {/* 1. CABECERA Y MISIÓN */}
           <div className="lg:col-span-8 space-y-12">
              <header className="space-y-6">
                 <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <Globe className="text-blue-400" size={14} />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Inclusión Global Alpha</span>
                 </div>
                 <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
                    Impacto <span className="text-gray-600">Digital.</span>
                 </h1>
                 <p className="text-gray-400 text-xl font-light leading-relaxed border-l-2 border-cyan-500 pl-8">
                     Democratizando la inteligencia artificial para cerrar la brecha tecnológica mundial. HAWKIN INCLUSION es nuestra división de impacto social.
                 </p>
              </header>

              {/* MÉTRICAS DE IMPACTO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { l: 'Beneficiarios', v: stats.beneficiaries.toLocaleString(), i: <Users /> },
                   { l: 'Nodos Sociales', v: stats.centers, i: <Globe /> },
                   { l: 'Proyectos Activos', v: stats.projects, i: <Zap /> }
                 ].map((s, i) => (
                   <div key={i} className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all text-center">
                      <div className="flex justify-center mb-4 text-cyan-500">{s.i}</div>
                      <p className="text-[9px] font-black text-gray-600 uppercase mb-2">{s.l}</p>
                      <p className="text-3xl font-black text-white italic">{s.v}</p>
                   </div>
                 ))}
              </div>

              {/* GALERÍA DE PROYECTOS */}
              <div className="space-y-8">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">Proyectos en <span className="text-cyan-500">Ejecución</span></h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { t: 'IA en Zonas Rurales', d: 'Implementación de nodos satelitales para educación asistida por IA.', im: 'https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?auto=format&fit=crop&q=80&w=800' },
                      { t: 'Becas Alpha Code', d: 'Financiamiento total para jóvenes talentos en desarrollo de modelos.', im: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800' }
                    ].map((p, i) => (
                      <div key={i} className="rounded-[50px] overflow-hidden border border-white/5 group relative h-80 shadow-2xl">
                         <img src={p.im} className="w-full h-full object-cover opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000" alt="" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                         <div className="absolute bottom-8 left-8 right-8 space-y-2">
                            <h4 className="text-xl font-black uppercase italic text-white">{p.t}</h4>
                            <p className="text-xs text-gray-400 font-light leading-relaxed">{p.d}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* 2. BARRA LATERAL: COLABORACIÓN */}
           <div className="lg:col-span-4 space-y-8">
              <div className="p-10 rounded-[60px] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 shadow-2xl space-y-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Heart size={150} /></div>
                 <div className="space-y-4 relative z-10 text-center">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Únete a la Causa.</h3>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">Cada punto de XP que ganas contribuye a nuestros fondos de inclusión digital.</p>
                 </div>
                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center p-6 bg-black/40 rounded-3xl border border-white/5">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tu Aporte XP</span>
                       <span className="text-xl font-black text-cyan-400">{user?.xp || 0}</span>
                    </div>
                    <button className="w-full py-6 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-[0.4em] hover:bg-pink-500 hover:text-white transition-all shadow-xl">Contribuir Ahora</button>
                 </div>
              </div>

              <div className="p-10 rounded-[60px] bg-white/[0.01] border border-white/5 space-y-8">
                 <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] text-center italic">Aliados Estratégicos</h4>
                 <div className="flex flex-wrap justify-center gap-6 opacity-30">
                    <div className="w-12 h-12 bg-white rounded-full" />
                    <div className="w-12 h-12 bg-white rounded-full" />
                    <div className="w-12 h-12 bg-white rounded-full" />
                 </div>
              </div>
           </div>

        </div>
      </div>

      <Footer /><GlobalTicker />
    </main>
  );
}
