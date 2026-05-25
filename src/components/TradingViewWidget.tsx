'use client';

import { useEffect, useRef } from 'react';

export default function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Evitar duplicaciones
    if (container.current && container.current.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "1", // 1 minuto para que se vea EL VIVO total
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "es",
        "enable_publishing": false,
        "backgroundColor": "rgba(0, 0, 0, 1)",
        "gridColor": "rgba(255, 255, 255, 0.06)",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "save_image": false,
        "details": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container h-full w-full relative group">
      {/* CAPA DE MARCA BLANCA HAWKIN (MAQUILLAJE SUPERIOR) */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black z-20 flex items-center px-6 pointer-events-none border-b border-white/5">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">HAWKIN <span className="text-[#FFD700]">GOLD</span> TERMINAL</span>
         </div>
      </div>
      
      {/* EL CONTENEDOR DONDE NACE EL GRÁFICO REAL */}
      <div ref={container} className="h-full w-full" />
      
      {/* MÁSCARA INFERIOR */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-black z-20 pointer-events-none border-t border-white/5 flex items-center justify-between px-6">
         <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Servidor: Nivel Institucional</span>
         <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest italic">Latencia: 1ms • LIVE</span>
      </div>
    </div>
  );
}
