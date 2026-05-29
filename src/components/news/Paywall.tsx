'use client';

import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Paywall({ price = "S/ 8.00" }: { price?: string }) {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-4 bottom-8 md:bottom-12 z-[5000] max-w-4xl mx-auto"
    >
      <div className="glass-card bg-black/90 border-cyan-500/50 backdrop-blur-2xl p-8 md:p-12 rounded-[50px] shadow-[0_0_100px_rgba(34,211,238,0.2)] border-2 flex flex-col md:flex-row items-center gap-10">
        
        <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-500/30">
          <Lock size={32} className="animate-pulse" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <ShieldCheck size={16} className="text-cyan-400" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500">Acceso Restringido</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
            Socio, el Futuro <span className="text-cyan-400">tiene un precio.</span>
          </h3>
          <p className="text-gray-400 text-sm font-light leading-relaxed max-w-md">
            Estás leyendo inteligencia de alto nivel. Para desbloquear el radar completo y eliminar anuncios, únete a la red Alpha.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <button 
            onClick={() => router.push('/#planes')}
            className="btn-glow px-12 py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4"
          >
             Suscribirse {price} <Zap size={16} />
          </button>
          <button 
            onClick={() => signIn()}
            className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4"
          >
            Ya soy Socio <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
