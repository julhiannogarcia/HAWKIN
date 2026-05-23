'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { BarChart3, UploadCloud, PieChart, ShieldCheck, Globe } from 'lucide-react';

export default function B2BPage() {
  const adPlacements = [
    { title: 'Top Banner Hero', price: '$499/sem', impressions: '500k+', icon: <Globe className="text-cyan-400" /> },
    { title: 'Radar Feed Native', price: '$299/sem', impressions: '250k+', icon: <BarChart3 className="text-purple-500" /> },
    { title: 'Shield Security Slot', price: '$399/sem', impressions: '300k+', icon: <ShieldCheck className="text-red-500" /> },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 pt-40 pb-32">
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN Business</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Impulsa tu <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Empresa.</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Conecta tu marca con la élite tecnológica. Publicidad nativa, métricas en tiempo real y posicionamiento de alto impacto.
          </p>
          <div className="flex justify-center gap-6 pt-8">
             <button className="btn-glow text-[10px]">Empezar Campaña</button>
             <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Hablar con Julhianno</button>
          </div>
        </section>

        {/* Panel de Control B2B Prototipo */}
        <div className="glass-card border-white/10 p-1 bg-gradient-to-br from-white/5 to-transparent rounded-[50px] overflow-hidden">
           <div className="bg-black/40 rounded-[49px] p-8 md:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 
                 {/* Columna Izquierda: Estadísticas */}
                 <div className="lg:col-span-2 space-y-12">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black uppercase tracking-widest italic">Performance de Marca</h2>
                       <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">Live Metrics</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-4">Alcance Total</p>
                          <h4 className="text-4xl font-black">1.2M</h4>
                       </div>
                       <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-4">Clicks Globales</p>
                          <h4 className="text-4xl font-black text-cyan-400">85.4K</h4>
                       </div>
                       <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-4">CTR Promedio</p>
                          <h4 className="text-4xl font-black text-purple-500">7.2%</h4>
                       </div>
                    </div>
                    <div className="h-64 w-full bg-white/[0.02] border border-dashed border-white/10 rounded-3xl flex items-center justify-center">
                       <p className="text-xs text-gray-700 uppercase font-black tracking-widest">Gráfico de Tráfico Predictivo</p>
                    </div>
                 </div>

                 {/* Columna Derecha: Gestión */}
                 <div className="space-y-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5 pb-4">Gestión de Anuncio</h3>
                    <div className="p-8 bg-cyan-400 text-black rounded-3xl flex flex-col items-center gap-6 text-center cursor-pointer hover:scale-105 transition-all">
                       <UploadCloud size={40} />
                       <div>
                          <p className="text-sm font-black uppercase">Subir Arte Final</p>
                          <p className="text-[9px] font-bold opacity-60 mt-1">Soporta WebP, MP4, SVG (Máx 10MB)</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-500 uppercase">Espacios Premium Disponibles:</p>
                       {adPlacements.map((ad, i) => (
                         <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-cyan-400/30 transition-all">
                            <div className="flex items-center gap-3">
                               {ad.icon}
                               <span className="text-xs font-bold text-gray-300">{ad.title}</span>
                            </div>
                            <span className="text-[10px] font-black text-white">{ad.price}</span>
                         </div>
                       ))}
                    </div>
                 </div>

              </div>
           </div>
        </div>

        <section className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">¿Por qué <br /><span className="text-cyan-400">HAWKIN B2B?</span></h2>
              <ul className="space-y-6">
                 <li className="flex gap-4">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-black font-black text-[10px]">1</div>
                    <p className="text-gray-400 text-sm leading-relaxed"><b className="text-white uppercase">Audiencia de Élite:</b> Tu marca será vista por fundadores, ingenieros y entusiastas de la tecnología con alto poder adquisitivo.</p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-black font-black text-[10px]">2</div>
                    <p className="text-gray-400 text-sm leading-relaxed"><b className="text-white uppercase">Entorno Seguro:</b> Publicidad en un contexto de innovación y ciberseguridad avanzada.</p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-black font-black text-[10px]">3</div>
                    <p className="text-gray-400 text-sm leading-relaxed"><b className="text-white uppercase">IA Matching:</b> Nuestro algoritmo coloca tu anuncio frente al socio que más probabilidad tiene de interactuar con él.</p>
                 </li>
              </ul>
           </div>
           <div className="relative aspect-square bg-gradient-to-tr from-cyan-500/10 to-purple-600/10 rounded-[60px] border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" />
              <PieChart size={100} className="text-cyan-400 drop-shadow-[0_0_30px_rgba(0,242,255,0.5)]" />
           </div>
        </section>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
