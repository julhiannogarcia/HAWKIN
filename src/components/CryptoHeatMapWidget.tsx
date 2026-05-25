'use client';

import { useEffect, useRef } from 'react';

export default function CryptoHeatMapWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current && container.current.children.length === 0) {
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
        "container_id": "heatmap_hawkin",
        "width": "100%",
        "height": "400",
        "locale": "es"
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
