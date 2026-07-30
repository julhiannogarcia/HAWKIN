'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { LoaderCircle, ChevronRight } from 'lucide-react';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Intro = dynamic(() => import('@/components/Intro'), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const GlobalTicker = dynamic(() => import('@/components/Ticker'), { ssr: false });
const FounderZone = dynamic(() => import('@/components/FounderZone'), { ssr: false });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: false });
const LiveFeed = dynamic(() => import('@/components/LiveFeed'), { ssr: false });
const SponsorSpace = dynamic(() => import('@/components/SponsorSpace'), { ssr: false });
const GlobalAIPulse = dynamic(() => import('@/components/intelligence/GlobalAIPulse'), { ssr: false });
const HISRanking = dynamic(() => import('@/components/intelligence/HISRanking'), { ssr: false });
const AIWarRoom = dynamic(() => import('@/components/intelligence/AIWarRoom'), { ssr: false });
const SecurityShield = dynamic(() => import('@/components/intelligence/SecurityShield'), { ssr: false });
const TradingIntelligence = dynamic(() => import('@/components/intelligence/TradingIntelligence'), { ssr: false });
const CommandCenterTop10 = dynamic(() => import('@/components/intelligence/CommandCenterTop10'), { ssr: false });
const LiveStatusBar = dynamic(() => import('@/components/intelligence/LiveStatusBar'), { ssr: false });

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoaderCircle className="animate-spin text-cyan-500" size={40} />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#020202]">
      <LiveStatusBar />
      <Header />

      <div className="flex flex-col">
        <Intro />
        
        <div className="w-full mt-10">
          <SponsorSpace isPremium={false} type="banner" />
        </div>

        <Hero />

        <GlobalAIPulse />

        <HISRanking limit={6} showViewAllLink />

        <AIWarRoom />
        
        <SecurityShield />
        
        <TradingIntelligence />
        
        <CommandCenterTop10 />

        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <Link
            href="/intelligence"
            className="inline-flex items-center gap-2 px-6 py-3 border border-cyan-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            Ver Intelligence Hub completo <ChevronRight size={14} />
          </Link>
          <p className="text-[9px] text-gray-700 mt-3 uppercase tracking-widest">
            CEO Radar · Executive Brief · Market Terminal
          </p>
        </div>

        <div className="max-w-6xl mx-auto w-full px-4 py-20">
           <SponsorSpace isPremium={false} type="inline" />
        </div>

        <Pricing />
        <Footer />
        <div className="text-center pb-10 opacity-20">
           <span className="text-[7px] font-black uppercase tracking-[0.8em] text-gray-500">TITAN AI SYSTEM v11.0 // MINIMALIST ACTIVE</span>
        </div>
        <GlobalTicker />
      </div>
    </main>
  );
}
