import Image from "next/image";
import Link from "next/link";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6c-1.7 0-3.1-1.4-3.1-3.1V7.1z" /><path d="m10 15 5-3-5-3v6z" /></svg>
);

const MOCK_GUESTS = [
  { id: 1, name: "Ana María", bio: "Experta en negocios y liderazgo.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" },
  { id: 2, name: "Carlos Ruiz", bio: "Atleta de alto rendimiento.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80" },
  { id: 3, name: "Laura Gómez", bio: "Investigadora neurocientífica.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" },
  { id: 4, name: "Miguel Santos", bio: "Autor best-seller de misterio.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80" },
];

export default function InvitadosPage() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-outfit uppercase tracking-widest text-white mb-4">
          Nuestros <span className="text-secondary">Invitados</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Conoce a las personas extraordinarias que han compartido sus historias con nosotros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {MOCK_GUESTS.map((guest) => (
          <Link key={guest.id} href={`/invitados/${guest.id}`} className="glass p-6 rounded-2xl flex flex-col items-center text-center group hover:border-secondary/50 transition-colors">
            <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-black group-hover:border-secondary transition-colors">
              <Image src={guest.image} alt={guest.name} fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{guest.name}</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">{guest.bio}</p>
            <div className="flex gap-4">
              <span className="text-gray-500 hover:text-white transition-colors"><InstagramIcon /></span>
              <span className="text-gray-500 hover:text-white transition-colors"><YoutubeIcon /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
