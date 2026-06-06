'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { Mail, MessageSquare, Globe, Send, ChevronRight, UserCircle, Zap, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-32">
        
        {/* SECCIÓN LIDERAZGO INSTITUCIONAL (ACTUALIZADO) */}
        <section className="mb-32">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="text-left space-y-8">
                 <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10 group-hover:border-cyan-400/50 transition-all">
                       <Shield size={24} />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Liderazgo <br/> <span className="text-cyan-400">Hawkin.</span></h2>
                 </div>
                 <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl">
                    "Operamos en la frontera de la inteligencia global. HAWKIN es el resultado de una visión dedicada a la transparencia tecnológica y la soberanía del dato."
                 </p>
                 <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                       <Award size={16} className="text-purple-500" />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">Protocolo Alpha-1</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Zap size={16} className="text-cyan-500" />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">Innovación Continua</span>
                    </div>
                 </div>
              </div>

              {/* PERFIL DEL FUNDADOR - PLACEHOLDER INSTITUCIONAL HASTA TENER FOTO REAL */}
              <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[60px] flex flex-col md:flex-row items-center gap-10 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Globe size={150} />
                 </div>
                 <div className="w-40 h-40 rounded-[35px] bg-gray-900 border-2 border-white/5 flex items-center justify-center shadow-2xl shrink-0 group-hover:border-cyan-500/30 transition-all">
                    <UserCircle size={80} className="text-gray-700" />
                 </div>
                 <div className="text-left space-y-3">
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em]">Founder & Director</span>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Julhianno Garcia</h3>
                    <p className="text-xs text-gray-500 font-light italic leading-relaxed">
                       "Liderando la arquitectura de inteligencia de HAWKIN. Comprometido con la creación del nodo tecnológico más veraz del planeta."
                    </p>
                 </div>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 border-t border-white/5 pt-32">
          
          {/* COLUMNA IZQUIERDA: CONTACTO DIRECTO */}
          <div className="space-y-12 text-left">
            <div>
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                Canal de Comunicación Seguro
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
                Desplegar <br /> <span className="text-gray-500">Mensaje.</span>
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Canal Oficial</p>
                  <p className="text-sm font-bold text-white">julhianno@aihawkin.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-all">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Nodo Central</p>
                  <p className="text-sm font-bold text-white">Operativo • Lima, Perú</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <div className="relative">
            <div className="glass-card p-8 md:p-12 border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} />
              </div>

              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8">Enviar Propuesta de Élite</h2>
              
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 space-y-6">
                  <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                    <Send className="text-black" size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase">Mensaje Recibido</h3>
                  <p className="text-gray-500 text-sm tracking-widest uppercase">El sistema ha procesado tu transmisión.</p>
                  <button onClick={() => setStatus('idle')} className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Enviar otro mensaje</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Identidad</label>
                    <input required type="text" placeholder="Tu nombre o empresa" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-sm font-bold" />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Canal de Retorno</label>
                    <input required type="email" placeholder="tu@email.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-sm font-bold" />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Mensaje</label>
                    <textarea required rows={5} placeholder="Escribe aquí..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-sm font-bold resize-none"></textarea>
                  </div>
                  <button disabled={status === 'sending'} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                    {status === 'sending' ? 'TRANSMITIENDO...' : <>ENVIAR AL SISTEMA <ChevronRight size={16} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <GlobalTicker />
    </main>
  );
}
