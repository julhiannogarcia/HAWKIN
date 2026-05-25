'use client';

import { useEffect, useRef } from 'react';

export default function TradingViewWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Limpieza total
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "es",
        "enable_publishing": false,
        "backgroundColor": "rgba(0, 0, 0, 1)",
        "gridColor": "rgba(255, 255, 255, 0.06)",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "details": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* CAPA DE MARCA BLANCA HAWKIN */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black z-20 flex items-center px-6 pointer-events-none border-b border-white/5">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">HAWKIN <span className="text-[#FFD700]">GOLD</span> TERMINAL • LIVE</span>
         </div>
      </div>
      
      {/* CONTENEDOR FÍSICO DEL GRÁFICO */}
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '500px' }} />

      <div className="absolute bottom-0 left-0 w-full h-8 bg-black z-20 pointer-events-none border-t border-white/5 flex items-center justify-between px-6">
         <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest italic">TRANSMISIÓN FINANCIERA EN VIVO</span>
         <span className="text-[8px] font-bold text-[#FFD700] uppercase tracking-widest">LATENCIA: 1ms</span>
      </div>
    </div>
  );
}
