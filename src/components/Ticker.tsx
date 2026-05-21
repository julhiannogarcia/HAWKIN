'use client';

import Link from 'next/link';

export default function Ticker() {
  const news = [
    { label: 'OPENAI', text: 'Sam Altman anuncia nueva actualización de GPT-5...' },
    { label: 'TESLA', text: 'Elon Musk revela avances en Optimus Gen 3...' },
    { label: 'GOOGLE', text: 'DeepMind logra hito en medicina con IA...' },
    { label: 'NVIDIA', text: 'Jensen Huang presenta la nueva era de GPUs...' },
    { label: 'HAWKIN', text: 'Julhianno Garcia lanza curso maestro de IA...' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-cyan-500/30 py-3 z-[2000] overflow-hidden flex">
      <div className="bg-cyan-500 text-black px-6 font-black uppercase text-xs flex items-center z-10">
        Live Radar
      </div>
      <div className="flex whitespace-nowrap animate-ticker">
        {[...news, ...news].map((item, index) => (
          <Link key={index} href="/news" className="px-12 text-sm text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer">
            <span className="text-cyan-400 font-bold mr-2">{item.label}:</span>
            {item.text}
          </Link>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
