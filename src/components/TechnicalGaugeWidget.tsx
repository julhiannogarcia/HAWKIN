'use client';

import { useEffect, useRef } from 'react';

export default function TechnicalGaugeWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
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
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }
  }, []);

  return <div ref={container} className="tradingview-widget-container" />;
}
