'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Clock, Globe, Zap, 
  TrendingUp, ChartBar, ShieldCheck, 
  Flame, Cpu, Target
} from 'lucide-react';

export default function LiveStatusBar() {
  const [times, setTimes] = useState({
    utc: '',
    ny: '',
    london: '',
    sv: ''
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimes({
        utc: now.toLocaleString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        ny: now.toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false }),
        london: now.toLocaleString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false }),
        sv: now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false })
      });
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#050505] border-b border-white/5 py-2 px-6 flex items-center justify-between overflow-hidden whitespace-nowrap z-[1001] fixed top-0 left-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
          <span className="text-[7px] font-black text-cyan-500 uppercase tracking-[0.4em]">HAWKIN LIVE STATUS</span>
        </div>
        
        <div className="flex items-center gap-6 border-l border-white/10 pl-6">
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">UTC</span>
            <span className="text-[9px] font-black text-gray-300 tabular-nums">{times.utc}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">NY</span>
            <span className="text-[9px] font-black text-gray-300 tabular-nums">{times.ny}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">LDN</span>
            <span className="text-[9px] font-black text-gray-300 tabular-nums">{times.london}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-bold text-gray-600 uppercase">SV</span>
            <span className="text-[9px] font-black text-cyan-400 tabular-nums">{times.sv}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 text-right">
        <div className="flex flex-col">
          <span className="text-[6px] font-bold text-gray-600 uppercase">Señales Procesadas</span>
          <span className="text-[9px] font-black text-white italic">241,902</span>
        </div>
        <div className="flex flex-col border-l border-white/10 pl-6">
          <span className="text-[6px] font-bold text-gray-600 uppercase">Precisión Histórica</span>
          <span className="text-[9px] font-black text-green-500">98.4%</span>
        </div>
        <div className="flex flex-col border-l border-white/10 pl-6">
          <span className="text-[6px] font-bold text-gray-600 uppercase">Predicciones Activas</span>
          <span className="text-[9px] font-black text-purple-500">1,405</span>
        </div>
      </div>
    </div>
  );
}
