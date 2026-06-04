'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, UserCheck, LoaderCircle, Sparkles } from 'lucide-react';

export default function OnboardingModal() {
  const { data: session, update } = useSession();
  const [nickname, setNickname] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Si hay sesión pero no tiene nickname, abrimos el onboarding
    if (session?.user && !(session.user as any).nickname) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [session]);

  const handleSubmit = async () => {
    if (nickname.length < 3) {
      setError('Socio, tu identidad necesita al menos 3 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });

      const data = await res.json();

      if (res.ok) {
        // Forzamos actualización de la sesión para que el Nik aparezca en el Header
        await update({
          ...session,
          user: {
            ...session?.user,
            nickname: data.nickname
          }
        });
        setIsOpen(false);
      } else {
        setError(data.error || 'Error al procesar identidad.');
      }
    } catch (e) {
      setError('Fallo de conexión Alpha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="glass-card max-w-lg w-full p-12 text-center border-cyan-500/30 shadow-[0_0_100px_rgba(34,211,238,0.2)] space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            
            <div className="space-y-6">
               <div className="w-20 h-20 bg-cyan-500/10 rounded-[30px] flex items-center justify-center mx-auto border border-cyan-500/20 group">
                  <Shield size={40} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Bienvenido, Socio Alpha.</h2>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                     Tu acceso al núcleo ha sido verificado. Elige tu identidad táctica (Nik) para operar en el ecosistema HAWKIN.
                  </p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="relative">
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 15))}
                    placeholder="TU_NIK_DE_ELITE"
                    className="w-full bg-black border-2 border-white/5 rounded-3xl p-6 text-center text-2xl font-black uppercase tracking-widest text-cyan-400 outline-none focus:border-cyan-500 transition-all placeholder:text-gray-900"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30">
                     <UserCheck size={20} className={nickname.length >= 3 ? "text-cyan-400" : "text-gray-700"} />
                  </div>
               </div>
               {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>}
               <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
                  * Este Nik será tu firma en el Radar y el War Room.
               </p>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading || nickname.length < 3}
              className="w-full py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-4"
            >
               {loading ? <LoaderCircle className="animate-spin" size={20} /> : <><Sparkles size={18} /> ACTIVAR IDENTIDAD</>}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
