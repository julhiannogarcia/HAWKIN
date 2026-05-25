'use client';

import { useEffect, useRef } from 'react';

export default function EconomicCalendarWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "colorTheme": "dark",
        "isTransparent": true,
        "width": "100%",
        "height": "600",
        "locale": "es",
        "importanceFilter": "-1,0,1",
        "countryFilter": "us,eu,gb,jp"
      });
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }
  }, []);

  return <div ref={container} className="tradingview-widget-container" />;
}
