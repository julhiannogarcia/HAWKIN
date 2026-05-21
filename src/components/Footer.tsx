import Link from 'next/link';

export default function Footer() {
  const socials = [
    { name: 'Instagram', url: 'https://www.instagram.com/julhian_garcia/', color: 'hover:text-[#E4405F]' },
    { name: 'YouTube', url: 'https://www.youtube.com/@JulhianGarcia', color: 'hover:text-[#FF0000]' },
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61573680670745', color: 'hover:text-[#1877F2]' },
    { name: 'Twitch', url: 'https://m.twitch.tv/julhiangarcia/home', color: 'hover:text-[#9146FF]' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@julhianno.garcia', color: 'hover:text-[#00f2ea]' },
  ];

  return (
    <footer className="mt-20 pb-40 pt-20 border-t border-white/5 text-center bg-black/40">
      <div className="text-xl font-black tracking-widest bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-12">
        HAWKIN
      </div>
      
      <div className="flex justify-center gap-8 mb-12 flex-wrap">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 transition-all duration-300 ${social.color} hover:scale-110`}
          >
            {social.name}
          </a>
        ))}
      </div>

      <div className="text-[10px] text-gray-700 uppercase tracking-widest leading-loose">
        Ecosistema Global HAWKIN &copy; 2026<br />
        Liderado por la visión de <span className="text-gray-500 font-bold">Julhianno Garcia</span> • Todos los derechos reservados.
      </div>
    </footer>
  );
}
