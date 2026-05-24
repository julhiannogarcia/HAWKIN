'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import { BarChart3, UploadCloud, PieChart, ShieldCheck, Globe, ShoppingBag, Laptop, Shirt, MessageCircle, Play } from 'lucide-react';

export default function B2BPage() {
  const adPlacements = [
    { title: 'Top Banner Explosivo', price: '$499/sem', impressions: '500k+', icon: <Globe className="text-cyan-400" /> },
    { title: 'Video-Anuncio en Radar', price: '$399/sem', impressions: '400k+', icon: <Play className="text-purple-500" /> },
    { title: 'Shopping Link Directo', price: '$199/sem', impressions: '150k+', icon: <ShoppingBag className="text-green-500" /> },
  ];

  const handleContact = () => {
    // Redirección directa a tu WhatsApp para cerrar ventas reales
    const message = encodeURIComponent("Hola HAWKIN, deseo anunciar mi negocio en la plataforma. ¿Cuáles son los pasos a seguir?");
    window.open(`https://wa.me/51900000000?text=${message}`, '_blank'); // Aquí pondrás tu número real
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white selection:bg-cyan-500">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 pt-40 pb-32">
        <section className="text-center space-y-8 mb-32">
          <span className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px]">HAWKIN ADS MARKETPLACE</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Vende más con <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent italic">HAWKIN.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Anuncia tu tienda de ropa, tecnología, celulares o cualquier servicio. <br />
            Llegamos a miles de personas en todo el mundo cada segundo.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-12">
             <button className="btn-glow text-[10px] py-6 px-12">Crear mi Anuncio Ahora</button>
             <button 
               onClick={handleContact}
               className="flex items-center justify-center gap-4 px-12 py-6 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all shadow-[0_0_30px_rgba(34,197,94,0.1)]"
             >
               <MessageCircle size={18} /> Hablar con HAWKIN (Privado)
             </button>
          </div>
        </section>

        {/* Panel de Control B2B Masivo */}
        <div className="glass-card border-white/5 p-1 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[60px] overflow-hidden shadow-2xl">
           <div className="bg-black/60 rounded-[59px] p-8 md:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                 
                 {/* Estadísticas de Ventas */}
                 <div className="lg:col-span-2 space-y-16">
                    <div className="flex items-center justify-between">
                       <h2 className="text-3xl font-black uppercase tracking-widest italic leading-none">Alcance <span className="text-cyan-400">Sin Límites</span></h2>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">En Vivo</span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="p-10 bg-white/[0.03] rounded-[35px] border border-white/5 group hover:border-cyan-500/30 transition-all">
                          <Laptop className="text-cyan-500 mb-6" size={32} />
                          <p className="text-[10px] font-black text-gray-600 uppercase mb-4">Tech & Gadgets</p>
                          <h4 className="text-4xl font-black">450K</h4>
                       </div>
                       <div className="p-10 bg-white/[0.03] rounded-[35px] border border-white/5 group hover:border-purple-500/30 transition-all">
                          <Shirt className="text-purple-500 mb-6" size={32} />
                          <p className="text-[10px] font-black text-gray-600 uppercase mb-4">Moda & Estilo</p>
                          <h4 className="text-4xl font-black">320K</h4>
                       </div>
                       <div className="p-10 bg-white/[0.03] rounded-[35px] border border-white/5 group hover:border-green-500/30 transition-all">
                          <ShoppingBag className="text-green-500 mb-6" size={32} />
                          <p className="text-[10px] font-black text-gray-600 uppercase mb-4">E-Commerce</p>
                          <h4 className="text-4xl font-black">280K</h4>
                       </div>
                    </div>
                 </div>

                 {/* Carga de Contenido Multimedia */}
                 <div className="space-y-10">
                    <div className="p-10 bg-gradient-to-br from-cyan-400 to-purple-600 text-black rounded-[40px] flex flex-col items-center gap-8 text-center shadow-[0_0_50px_rgba(0,242,255,0.2)]">
                       <div className="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center">
                          <Play size={40} />
                       </div>
                       <div>
                          <h4 className="text-lg font-black uppercase italic leading-tight">Sube tu Video <br />o Link de Tienda</h4>
                          <p className="text-[10px] font-bold opacity-70 mt-3 leading-relaxed">Aceptamos Reels, TikToks y enlaces directos a WhatsApp o Web.</p>
                       </div>
                       <button className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Subir Material</button>
                    </div>
                    
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-4">Precios de Lanzamiento:</p>
                       {adPlacements.map((ad, i) => (
                         <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                               {ad.icon}
                               <span className="text-xs font-bold text-gray-400">{ad.title}</span>
                            </div>
                            <span className="text-xs font-black text-white">{ad.price}</span>
                         </div>
                       ))}
                    </div>
                 </div>

              </div>
           </div>
        </div>

        <section className="mt-40 text-center space-y-12 pb-20">
           <h2 className="text-4xl font-black uppercase italic leading-none">Publicidad para <br /><span className="text-cyan-400 text-6xl md:text-8xl">Cualquier Negocio</span></h2>
           <div className="flex flex-wrap justify-center gap-12 pt-8">
              <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors">Tiendas de Ropa</span>
              <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-white hover:text-purple-400 transition-colors">Computadoras</span>
              <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-white hover:text-green-400 transition-colors">Smartphones</span>
              <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors">Servicios</span>
           </div>
           <p className="text-gray-500 text-sm font-black uppercase tracking-[0.4em]">Sin excepciones. Tu marca merece estar aquí.</p>
        </section>

      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
