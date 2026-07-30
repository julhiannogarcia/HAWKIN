'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalTicker from '@/components/Ticker';

const SponsorSpace = dynamic(() => import('@/components/SponsorSpace'), { ssr: false });

export default function Page() {
  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-cyan-400 mb-4">
              Intelligence Hub
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs">
              Centro de análisis estratégico HAWKIN
            </p>
          </div>
          <div className="lg:col-span-4">
            <SponsorSpace isPremium={false} type="sidebar" />
          </div>
        </div>
      </div>
      <Footer />
      <GlobalTicker />
    </main>
  );
}
