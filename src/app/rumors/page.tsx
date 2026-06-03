'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 text-center">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-cyan-400 mb-4">MODULO EN DESARROLLO</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs">Sincronizando con Motor HAWKIN V4...</p>
      </div>
      <Footer />
      <GlobalTicker />
    </main>
  );
}
