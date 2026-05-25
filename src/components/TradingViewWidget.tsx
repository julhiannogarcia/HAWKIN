'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewWidget() {
  const containerId = "tradingview_chart_hawkin";

  useEffect(() => {
    // 1. Cargar la librería maestra 'tv.js' (El cerebro de TradingView)
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      // 2. Una vez cargada, construimos el gráfico de forma infalible
      if (window.TradingView) {
        new window.TradingView.widget({
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "es",
          "toolbar_bg": "#000000",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": containerId,
          "backgroundColor": "rgba(0, 0, 0, 1)",
          "gridColor": "rgba(255, 255, 255, 0.06)",
          "hide_side_toolbar": false,
          "details": true,
          "hotlist": true,
          "calendar": false,
          "width": "100%",
          "height": "100%"
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Limpieza al desmontar
      const s = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (s) s.remove();
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-black">
      {/* CAPA DE MARCA BLANCA HAWKIN */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black z-30 flex items-center px-6 pointer-events-none border-b border-white/5">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse shadow-[0_0_10px_#FFD700]" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">HAWKIN <span className="text-[#FFD700]">GOLD</span> TERMINAL</span>
         </div>
      </div>
      
      {/* EL CONTENEDOR MAESTRO */}
      <div id={containerId} className="w-full h-full" style={{ height: '750px' }} />

      {/* MÁSCARA INFERIOR */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-black z-30 pointer-events-none border-t border-white/5 flex items-center justify-between px-6">
         <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest italic">HAWKIN SATELLITE LINK: LIVE</span>
         <span className="text-[8px] font-bold text-[#FFD700] uppercase tracking-widest">LATENCIA: 1ms</span>
      </div>
    </div>
  );
}
