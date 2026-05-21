'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md w-full p-12 text-center border-cyan-500/20 shadow-[0_0_50px_rgba(0,242,255,0.1)]"
      >
        <div className="text-3xl font-black tracking-widest text-cyan-400 mb-8">HAWKIN</div>
        <h1 className="text-xl font-bold text-white mb-2">Acceso al Ecosistema</h1>
        <p className="text-gray-500 text-sm mb-10">Inicia sesión para acceder a tu radar personalizado.</p>
        
        <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-3">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Entrar con Google
        </button>

        <p className="mt-8 text-[10px] text-gray-700 uppercase tracking-widest leading-relaxed">
          Al entrar, aceptas nuestros términos de socio y políticas de privacidad del ecosistema global.
        </p>
      </motion.div>
      <Footer />
    </main>
  );
}
