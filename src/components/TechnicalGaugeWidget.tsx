'use client';

import { useEffect, useRef } from 'react';

export default function TechnicalGaugeWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "interval": "1m",
        "width": "100%",
        "isTransparent": true,
        "height": "400",
        "symbol": "BINANCE:BTCUSDT",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "es",
        "colorTheme": "dark"
      });
      containerRef.current.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
