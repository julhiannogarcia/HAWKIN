'use client';

import { useEffect, useRef } from 'react';

export default function CryptoHeatMapWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "dataSource": "Crypto",
        "symbolGroups": [
          { "name": "Monedas Base", "symbols": [
            { "name": "BINANCE:BTCUSDT" },
            { "name": "BINANCE:ETHUSDT" },
            { "name": "BINANCE:SOLUSDT" },
            { "name": "BINANCE:BNBUSDT" },
            { "name": "BINANCE:ADAUSDT" }
          ]}
        ],
        "colorTheme": "dark",
        "isTransparent": true,
        "hasTopBar": false,
        "isDayNightMode": false,
        "width": "100%",
        "height": "400",
        "locale": "es"
      });
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full h-full" ref={containerRef} />
  );
}
