'use client';

import { useEffect, useRef } from 'react';

export default function MarketOverviewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "colorTheme": "dark",
        "dateRange": "12M",
        "showChart": true,
        "locale": "es",
        "width": "100%",
        "height": "600",
        "largeChartHeight": 312,
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "tabs": [
          {
            "title": "Criptomonedas",
            "symbols": [
              { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
              { "s": "BINANCE:ETHUSDT", "d": "Ethereum" },
              { "s": "BINANCE:SOLUSDT", "d": "Solana" }
            ]
          },
          {
            "title": "Mercado Global",
            "symbols": [
              { "s": "OANDA:XAUUSD", "d": "Oro" },
              { "s": "FOREXCOM:SPX500", "d": "S&P 500" },
              { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" }
            ]
          }
        ]
      });
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }
  }, []);

  return <div ref={container} className="tradingview-widget-container" />;
}
