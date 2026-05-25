'use client';

import { useEffect, useRef } from 'react';

export default function EconomicCalendarWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
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
      containerRef.current.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
