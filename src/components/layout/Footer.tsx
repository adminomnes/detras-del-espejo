import Link from "next/link";


// Placeholder custom icons for TikTok and Spotify
const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);
const SpotifyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 11.973c2.5-1.473 5.5-.973 7.5.527"/><path d="M9 15c1.5-1 4-1 5 .5"/><path d="M7 9c2-1 6-2 10 .5"/></svg>
);
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const YoutubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6c-1.7 0-3.1-1.4-3.1-3.1V7.1z"/><path d="m10 15 5-3-5-3v6z"/></svg>
);

export function Footer() {
  return (
    <footer className="glass mt-20 border-t border-white/10 relative z-10 pb-24 md:pb-6">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-outfit text-xl tracking-widest uppercase">
            Detrás del <span className="text-accent">Espejo</span>
          </span>
          <p className="text-sm text-gray-400">Historias reales. Verdades sin filtro.</p>
        </div>
        
        <div className="flex gap-6">
          <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><InstagramIcon /></Link>
          <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><FacebookIcon /></Link>
          <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><TikTokIcon /></Link>
          <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><YoutubeIcon /></Link>
          <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><SpotifyIcon /></Link>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pb-4">
        © {new Date().getFullYear()} Detrás del Espejo. Todos los derechos reservados.
      </div>
    </footer>
  );
}
