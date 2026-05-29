'use client';

import { motion } from 'framer-motion';
import { Play, Camera, MessageCircle, Send, Radio, Globe, ShieldCheck } from 'lucide-react';

export default function FounderZone() {
  const stats = [
    { label: 'Noticias Inyectadas', value: '450+' },
    { label: 'Socios Activos', value: '12.5k' },
    { label: 'Países Cubiertos', value: '8' },
    { label: 'Impacto IA', value: '100%' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-32 w-full">
      <div className="glass-card bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-white/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <ShieldCheck size={200} className="text-cyan-400" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-4 md:p-12 relative z-10">
          
          {/* Columna 1: Info del Ecosistema */}
          <div className="space-y-8">
            <div>
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                Nuestra Infraestructura
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                Ecosistema <br />
                <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Alpha Intelligence
                </span>
              </h2>
            </div>

            <p className="text-gray-400 leading-relaxed text-lg italic border-l-2 border-cyan-500 pl-6 font-light">
              "HAWKIN no es solo una plataforma, es una red de inteligencia diseñada para democratizar el acceso al futuro. 
              Eliminamos el ruido para que solo recibas datos con poder de ejecución."
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-white/5">
               {stats.map((stat, i) => (
                  <div key={i} className="text-center md:text-left">
                     <p className="text-xl font-black text-white">{stat.value}</p>
                     <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
               ))}
            </div>

            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Protocolo Global</span>
               <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-150" />
               </div>
            </div>
          </div>

          {/* Columna 2: Espacio Multimedia / Stream */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-video bg-black rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Simulación de Video/Live */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse z-20">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Live Radar Intel</span>
              </div>
              
              <div className="text-center p-8 relative z-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-cyan-500/50 transition-all cursor-pointer backdrop-blur-md">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Inyectar Datos Visuales</p>
              </div>
              
              {/* Imagen de fondo desenfocada simulando miniatura */}
              <div className="absolute inset-0 z-10 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-black/40 z-10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
