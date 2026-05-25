'use client';

import { useEffect, useRef } from 'react';

export default function TickerTapeWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "symbols": [
          { "proName": "BINANCE:BTCUSDT", "title": "Bitcoin" },
          { "proName": "BINANCE:ETHUSDT", "title": "Ethereum" },
          { "proName": "OANDA:XAUUSD", "title": "Oro" },
          { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
          { "proName": "FX_IDC:USDPEN", "title": "USD/PEN" }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "es"
      });
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full h-full" ref={containerRef} />
  );
}
