'use client';

import React from 'react';

export default function InclusionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C3E50] font-sans selection:bg-[#AED6F1]">
      {/* HEADER CALMA */}
      <header className="h-20 border-b border-[#EAECEE] bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#5DADE2] rounded-2xl flex items-center justify-center shadow-sm">
              <span className="font-bold text-white text-2xl">H</span>
           </div>
           <div>
              <h2 className="text-lg font-bold tracking-tight text-[#2E86C1]">HAWKIN <span className="text-[#AAB7B8]">INCLUSION</span></h2>
              <p className="text-[10px] font-bold text-[#7F8C8D] uppercase tracking-widest">Espacio de Estimulación Segura</p>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[#BDC3C7] uppercase">Modo Activo</span>
              <span className="text-sm font-bold text-[#2E86C1]">Enfoque y Calma</span>
           </div>
           <div className="w-10 h-10 rounded-full border-2 border-[#D5DBDB] bg-[#F4F6F7] flex items-center justify-center">
              <span className="text-xl">🧩</span>
           </div>
        </div>
      </header>

      {/* ÁREA DE CONTENIDO SEGURO */}
      <div className="max-w-7xl mx-auto w-full flex-1 p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
