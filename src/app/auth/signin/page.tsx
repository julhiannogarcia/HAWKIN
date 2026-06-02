'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAlpha } from '@/context/AlphaContext';
import { Shield, Zap, Key, Loader2, Sparkles, UserPlus, Fingerprint, Globe, Lock, Download, Save } from 'lucide-react';

export default function SignInPage() {
  const { login, init, loading } = useAlpha();
  const [mode, setStep] = useState<'selection' | 'login' | 'init'>('selection');
  const [accessKey, setAccessKey] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState<string | null>(null);

  const handleLogin = async () => {
    setError('');
    const success = await login(accessKey);
    if (success) {
      window.location.href = '/';
    } else {
      setError('LLAVE DE ACCESO INVÁLIDA O INACTIVA.');
    }
  };

  const handleInit = async () => {
    setError('');
    const key = await init(nickname);
    if (key) {
      setShowKey(key);
      // Auto-descarga de la llave para el socio
      downloadKey(nickname, key);
    } else {
      setError('EL NIK YA EXISTE O HUBO UN FALLO DE NÚCLEO.');
    }
  };

  const downloadKey = (nick: string, key: string) => {
    const element = document.createElement("a");
    const file = new Blob([`IDENTIDAD ALPHA HAWKIN\n\nSocio: ${nick}\nLlave Maestra: ${key}\n\nGuarda este archivo en un lugar seguro. Es tu único acceso al imperio.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `HAWKIN_KEY_${nick}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <main className="min-h-screen bg-[#020202] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <Header />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-xl w-full p-16 text-center border-cyan-500/20 shadow-[0_0_100px_rgba(0,242,255,0.05)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
        
        <div className="mb-12 space-y-6">
           <div className="w-20 h-20 bg-cyan-500/10 rounded-[30px] flex items-center justify-center mx-auto border border-cyan-500/20 group">
              <Shield size={40} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
           </div>
           <div className="space-y-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-500">Identidad Digital</h2>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">SISTEMA <span className="text-gray-600">ALPHA ID.</span></h1>
           </div>
        </div>

        <div className="space-y-10">
          {mode === 'selection' && !showKey && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <button onClick={() => setStep('login')} className="p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-cyan-500/40 transition-all group">
                  <Fingerprint size={40} className="text-cyan-500 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-xs uppercase tracking-widest text-white">Tengo una Llave</p>
               </button>
               <button onClick={() => setStep('init')} className="p-10 rounded-[40px] bg-white text-black hover:bg-cyan-500 hover:text-white transition-all group shadow-2xl">
                  <UserPlus size={40} className="mx-auto mb-6 group-hover:rotate-12 transition-transform" />
                  <p className="font-black text-xs uppercase tracking-widest">Nuevo Socio</p>
               </button>
            </div>
          )}

          {mode === 'login' && !showKey && (
            <div className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block text-left ml-4">Ingresar Llave Maestra</label>
                  <div className="relative">
                     <input 
                       type="text" 
                       value={accessKey}
                       onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                       placeholder="ALPHA-XXXX-XXXX"
                       className="w-full bg-black border-2 border-white/10 rounded-3xl p-6 text-center text-xl font-black text-cyan-400 outline-none focus:border-cyan-500 transition-all placeholder:text-gray-900"
                       autoComplete="username"
                     />
                     <Key className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-800" size={20} />
                  </div>
                  {/* Sugerencia de guardado para el navegador */}
                  <input type="password" value="HAWKIN_VAULT" className="hidden" readOnly autoComplete="current-password" />
               </div>
               {error && <p className="text-red-500 text-[9px] font-black uppercase italic animate-pulse">{error}</p>}
               <div className="flex flex-col gap-4">
                  <button onClick={handleLogin} disabled={loading || !accessKey} className="w-full py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-20">
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'CONECTAR AL IMPERIO'}
                  </button>
                  <button onClick={() => setStep('selection')} className="text-[8px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">Volver</button>
               </div>
            </div>
          )}

          {mode === 'init' && !showKey && (
            <div className="space-y-8">
               <div className="space-y-4 text-left px-4">
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                     Elige tu Nik de combate. El sistema generará una llave única que se guardará en tu equipo.
                  </p>
                  <div>
                     <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-4">Elige tu Nickname</label>
                     <input 
                       type="text" 
                       value={nickname}
                       onChange={(e) => setNickname(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                       placeholder="TU_NOMBRRE_ALPHA"
                       className="w-full bg-black border-2 border-white/10 rounded-3xl p-6 text-xl font-black text-white outline-none focus:border-cyan-500 transition-all placeholder:text-gray-900"
                     />
                  </div>
               </div>
               {error && <p className="text-red-500 text-[9px] font-black uppercase italic animate-pulse">{error}</p>}
               <div className="flex flex-col gap-4">
                  <button onClick={handleInit} disabled={loading || nickname.length < 3} className="w-full py-6 bg-cyan-600 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all disabled:opacity-20 flex items-center justify-center gap-4">
                    {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> GENERAR LLAVE ALPHA</>}
                  </button>
                  <button onClick={() => setStep('selection')} className="text-[8px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors">Volver</button>
               </div>
            </div>
          )}

          {showKey && (
            <div className="space-y-10 py-6">
               <div className="p-8 bg-green-500/10 border-2 border-green-500/30 rounded-[40px] space-y-6">
                  <div className="w-16 h-16 bg-green-500 text-black rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                     <Save size={32} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Identidad Guardada.</h3>
                     <p className="text-gray-500 text-xs font-light px-8">Hemos descargado tu llave en tu equipo y la hemos guardado en tu navegador para acceso automático.</p>
                  </div>
                  <div className="bg-black border border-white/10 p-6 rounded-2xl group hover:border-green-500 transition-all relative">
                     <p className="text-2xl font-mono font-black text-green-500 tracking-[0.2em]">{showKey}</p>
                     <div className="absolute top-2 right-2 p-2 bg-white/5 rounded-lg opacity-30 group-hover:opacity-100 transition-opacity">
                        <Download size={12} className="text-white" />
                     </div>
                  </div>
               </div>
               <button onClick={() => window.location.href = '/'} className="w-full py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all shadow-2xl">
                 ENTRAR AL IMPERIO HAWKIN
               </button>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between text-[8px] font-black text-gray-700 uppercase tracking-widest px-4">
           <div className="flex items-center gap-3"><Lock size={12} className="text-green-900" /> PROTECCIÓN DE EQUIPO ACTIVA</div>
           <div className="flex items-center gap-3"><Globe size={12} className="text-blue-900" /> NODO SATELITAL: ONLINE</div>
        </div>
      </motion.div>
      <Footer />
    </main>
  );
}
