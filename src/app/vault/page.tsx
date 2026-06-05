'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, Shield, Zap, Globe, Clock, 
  LoaderCircle, Trash2, ArrowRight, Sparkles 
} from 'lucide-react';
import { useAlpha } from '@/context/AlphaContext';
import NewsCard from '@/components/NewsCard';

export default function VaultPage() {
  const { user, fetchAlpha, loading: authLoading } = useAlpha();
  const [savedNews, setSavedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchVault = async () => {
      try {
        const res = await fetchAlpha('/api/user/vault');
        const data = await res.json();
        setSavedNews(data.savedNews || []);
      } catch (e) {
        console.error("Vault Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchVault();
  }, [user]);

  if (authLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LoaderCircle className="animate-spin text-cyan-500" size={40} />
    </div>
  );

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center space-y-8">
         <Shield size={80} className="text-red-500 opacity-20" />
         <h1 className="text-4xl font-black uppercase italic tracking-tighter">Acceso Restringido.</h1>
         <p className="text-gray-500 max-w-md uppercase text-[10px] tracking-widest font-bold">Debes activar tu Identidad Alpha para acceder a la Bóveda de Inteligencia.</p>
         <button onClick={() => window.location.href = '/auth/signin'} className="px-10 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em]">Activar Identidad</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-32">
        <header className="mb-20 space-y-6">
           <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <Bookmark className="text-cyan-500" size={14} />
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Bóveda de Inteligencia</span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
             Archivos <span className="text-gray-600">Guardados.</span>
           </h1>
           <p className="text-gray-500 text-xl font-light max-w-3xl">Tus reportes interceptados y señales de alta fidelidad almacenadas en tu nodo local.</p>
        </header>

        {loading ? (
          <div className="py-40 text-center space-y-6">
             <LoaderCircle className="animate-spin text-cyan-500 mx-auto" size={40} />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 animate-pulse">Sincronizando con base de datos segura...</p>
          </div>
        ) : savedNews.length === 0 ? (
          <div className="py-40 glass-card bg-white/[0.01] border-dashed border-white/10 rounded-[80px] text-center space-y-8">
             <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto opacity-20">
                <Zap size={40} />
             </div>
             <p className="text-gray-600 font-black uppercase text-xs tracking-widest">No has almacenado ningún reporte todavía.</p>
             <button onClick={() => window.location.href = '/radar'} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Explorar Radar</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {savedNews.map((news) => (
               <NewsCard key={news.id} {...news} />
             ))}
          </div>
        )}

        {/* MÉTRICAS DE BÓVEDA */}
        <div className="mt-32 p-16 rounded-[80px] bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="flex items-center gap-10">
              <div className="w-20 h-20 bg-purple-500/10 rounded-[30px] flex items-center justify-center border border-purple-500/20 shadow-2xl">
                 <Sparkles size={32} className="text-purple-400" />
              </div>
              <div>
                 <h4 className="text-3xl font-black uppercase italic tracking-tighter">Capacidad Alpha</h4>
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2 italic">Estás usando el 2% de tu almacenamiento de inteligencia.</p>
              </div>
           </div>
           <div className="h-2 w-full md:w-96 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '2%' }} className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
           </div>
        </div>

      </div>

      <Footer /><GlobalTicker />
    </main>
  );
}
