import Image from "next/image";
import Link from "next/link";

const MOCK_NEWS = [
  { id: 1, title: "Detrás del Espejo alcanza 1 Millón de oyentes", date: "10 Jun 2026", excerpt: "Un hito histórico para nuestro programa independiente...", image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80" },
  { id: 2, title: "Nuevo estudio de grabación", date: "05 Jun 2026", excerpt: "Mejoramos nuestra calidad audiovisual con tecnología 4K...", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80" },
];

export default function NoticiasPage() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-outfit uppercase tracking-widest text-white mb-4">
          Novedades y <span className="text-secondary">Noticias</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Mantente al tanto de los últimos anuncios, eventos y curiosidades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {MOCK_NEWS.map((news) => (
          <Link key={news.id} href={`/noticias/${news.id}`}>
            <article className="glass rounded-3xl overflow-hidden group hover:border-secondary/50 transition-colors">
              <div className="relative h-64 overflow-hidden">
                <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 glass px-4 py-1 rounded-full text-xs font-bold text-accent tracking-widest backdrop-blur-md">
                  {news.date}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-secondary transition-colors">{news.title}</h3>
                <p className="text-gray-400 mb-6">{news.excerpt}</p>
                <span className="text-white font-medium uppercase tracking-widest text-sm border-b border-primary pb-1 hover:text-primary transition-colors">
                  Leer Artículo Completo
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
