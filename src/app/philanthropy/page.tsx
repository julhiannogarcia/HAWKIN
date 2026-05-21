'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';

export default function PhilanthropyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 pt-40 pb-32">
        <section className="text-center space-y-6 mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]"
          >
            Trascendiendo la Tecnología
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            HAWKIN <br />
            <span className="text-amber-500">Philanthropy</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Un sistema de apoyo discreto y profesional diseñado para impulsar el talento, 
            la educación y cumplir sueños sin exposición innecesaria.
          </p>
        </section>

        <div className="glass-card border-amber-500/20 bg-amber-500/5 p-12 rounded-[40px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="text-6xl text-amber-500">🤝</span>
          </div>

          <h2 className="text-3xl font-bold mb-8">Formas de Colaboración</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
              <h3 className="text-amber-500 font-bold mb-2 uppercase tracking-widest text-xs">Aporte al Ecosistema</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Contribución directa para el desarrollo de proyectos y ayuda inmediata a casos urgentes.</p>
            </div>
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
              <h3 className="text-amber-500 font-bold mb-2 uppercase tracking-widest text-xs">Fondo de Impulso</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Destinado específicamente a la compra de herramientas (Laptops, Celulares) y becas.</p>
            </div>
          </div>

          <button className="w-full py-5 bg-amber-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(255,191,0,0.2)]">
            Postular como Colaborador Privado
          </button>
          
          <p className="text-center mt-8 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            🔒 Sistema Cifrado y Discreto | Gestión Directa por Julhianno Garcia
          </p>
        </div>
      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
