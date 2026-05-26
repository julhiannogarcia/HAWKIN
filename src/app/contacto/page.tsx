'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { Mail, MessageSquare, Shield, Globe, Send, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulación de envío
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <main className="min-h-screen bg-[#010101] text-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN DEL FUNDADOR */}
          <div className="space-y-12">
            <div>
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                La Mente Detrás del Sistema
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
                Julhianno <br /> <span className="text-gray-500">Garcia.</span>
              </h1>
            </div>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                Visionario tecnológico y estratega digital. Fundador de <span className="text-white font-bold">HAWKIN</span>, 
                un ecosistema diseñado para potenciar la soberanía intelectual y financiera a través de la Inteligencia Artificial.
              </p>
              <p>
                Con años de experiencia liderando comunidades digitales, Julhianno ha construido este radar para 
                aquellos que no se conforman con la información tradicional y buscan la ventaja competitiva de la élite.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-cyan-500/30 transition-all">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Contacto Directo</p>
                  <p className="text-sm font-bold text-white">julhianno@aihawkin.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-all">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Estado del Sistema</p>
                  <p className="text-sm font-bold text-white">Operativo • Lima, Perú</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO DE CONTACTO */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-3xl opacity-50 -z-10"></div>
            
            <div className="glass-card p-8 md:p-12 border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} />
              </div>

              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8">Enviar Mensaje de Élite</h2>
              
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20 space-y-6"
                >
                  <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                    <Send className="text-black" size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase">Mensaje Recibido</h3>
                  <p className="text-gray-500 text-sm tracking-widest uppercase">Julhianno revisará tu propuesta en breve.</p>
                  <button onClick={() => setStatus('idle')} className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Nombre Completo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Identifícate"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-sm font-bold"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Email de Negocios</label>
                    <input 
                      required
                      type="email" 
                      placeholder="tu@empresa.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-sm font-bold"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Mensaje / Propuesta</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Describe tu visión..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-sm font-bold resize-none"
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    disabled={status === 'sending'}
                    className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {status === 'sending' ? 'TRANSMITIENDO...' : (
                      <>
                        DESPLEGAR MENSAJE <ChevronRight size={16} />
                      </>
                    )}
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
