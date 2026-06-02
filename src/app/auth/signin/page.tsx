'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Shield, Lock, AlertCircle, Globe, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-lg w-full p-16 text-center border-cyan-500/20 shadow-[0_0_100px_rgba(0,242,255,0.05)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
      
      <div className="mb-12 space-y-6">
         <div className="w-24 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto border border-cyan-500/20 group">
            <Shield size={48} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
         </div>
         <div className="space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-500">Acceso Restringido</h2>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Imperio <span className="text-gray-600">HAWKIN.</span></h1>
         </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
           <AlertCircle size={18} />
           {error === 'OAuthSignin' ? 'Fallo en la conexión de Google' : 'Error de identificación Alpha'}
        </div>
      )}

      <p className="text-gray-500 text-sm mb-12 font-light leading-relaxed px-4">
        Bienvenido al búnker de inteligencia. Inicia sesión con tu cuenta verificada para acceder al War Room y Radar Global.
      </p>
      
      <button 
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="w-full py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-6 shadow-2xl group"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
        Entrar con Google Alpha
      </button>

      <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
         <div className="flex items-center gap-3 text-[8px] font-black text-gray-700 uppercase tracking-widest">
            <Lock size={12} className="text-green-600" /> Cifrado 256-bit
         </div>
         <div className="flex items-center gap-3 text-[8px] font-black text-gray-700 uppercase tracking-widest justify-end">
            <Globe size={12} className="text-blue-600" /> Red Satelital
         </div>
      </div>

      <p className="mt-12 text-[9px] text-gray-700 uppercase tracking-widest leading-relaxed font-bold">
        ESTÁS ENTRANDO EN UNA ZONA DE INTELIGENCIA DE ALTA FIDELIDAD.
      </p>
    </motion.div>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#020202] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Header />
      <Suspense fallback={<Loader2 className="animate-spin text-cyan-500" />}>
        <SignInContent />
      </Suspense>
      <Footer />
    </main>
  );
}
