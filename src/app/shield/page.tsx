'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Lock, EyeOff, Terminal, Zap, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';

const threats = [
  {
    title: 'Nueva vulnerabilidad en kernel de Windows',
    severity: 'CRÍTICA',
    impact: 'Acceso remoto no autorizado',
    howToAvoid: 'Instalar parche KB503... inmediatamente.'
  },
  {
    title: 'Phishing avanzado con clonación de voz IA',
    severity: 'ALTA',
    impact: 'Fraude bancario masivo',
    howToAvoid: 'Establecer palabras clave de seguridad con familiares.'
  }
];

export default function ShieldPage() {
  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 pt-40 pb-32">
        {/* Hero Shield */}
        <section className="text-center space-y-8 mb-24">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(239,68,68,0.2)]"
          >
            <ShieldAlert size={48} className="text-red-500 animate-pulse" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              HAWKIN <span className="text-red-500">SHIELD</span>
            </h1>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto uppercase tracking-widest font-bold">
              Tu Centro de Mando contra Amenazas Digitales
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Alertas de Emergencia */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Terminal className="text-red-500" size={20} /> Radar de Vulnerabilidades
            </h2>
            <div className="space-y-4">
              {threats.map((threat, i) => (
                <div key={i} className="glass-card border-red-500/20 bg-red-500/5 p-8 group hover:border-red-500/40 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest">
                      {threat.severity}
                    </span>
                    <span className="text-[10px] text-gray-600 font-bold">DETECTADO: HOY</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{threat.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">Impacto: {threat.impact}</p>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <ShieldCheck size={14} /> Cómo protegerse:
                    </p>
                    <p className="text-sm text-gray-300">{threat.howToAvoid}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guías de Ciberseguridad */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Zap className="text-yellow-500" size={20} /> Manuales de Defensa
            </h2>
            
            <div className="glass-card p-6 border-white/5 space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                  <Lock size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Guía Windows 11</h4>
                  <p className="text-[10px] text-gray-500">Defensa contra Ransomware</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <EyeOff size={20} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Privacidad Mac/Linux</h4>
                  <p className="text-[10px] text-gray-500">Navegación Cifrada</p>
                </div>
              </div>

              <button className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Ver todos los tutoriales
              </button>
            </div>

            {/* Alerta de Fraude IA */}
            <div className="glass-card bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20 p-6">
              <h3 className="text-yellow-500 font-black text-sm uppercase tracking-tighter mb-2">¡Cuidado con el Deepfake!</h3>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "Nunca autorices transferencias por videollamada sin verificar la identidad con una pregunta secreta."
              </p>
              <p className="text-[10px] text-gray-600 mt-4 uppercase font-bold text-right">— Radar HAWKIN</p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <Ticker />
    </main>
  );
}
