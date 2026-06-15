import { getEpisodioById } from "@/lib/supabase-queries/episodios";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const episodio = await getEpisodioById(id);
  if (!episodio) return { title: "Episodio no encontrado" };

  return {
    title: episodio.titulo,
    description: episodio.meta_descripcion ?? episodio.descripcion,
  };
}

export default async function EpisodioDetailPage({ params }: Props) {
  const { id } = await params;
  const episodio = await getEpisodioById(id);

  if (!episodio) notFound();

  const invitado = Array.isArray(episodio.invitados) ? episodio.invitados[0] : episodio.invitados;

  return (
    <div className="container mx-auto px-4 py-32">
      <Link href="/episodios" className="text-accent hover:underline mb-8 inline-block">&larr; Volver a episodios</Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-video lg:aspect-auto rounded-2xl overflow-hidden">
          {episodio.imagen && (
            <Image src={episodio.imagen} alt={episodio.titulo} fill className="object-cover" />
          )}
        </div>

        <div>
          <Badge variant="accent">{episodio.estado}</Badge>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold mt-4 mb-4">{episodio.titulo}</h1>

          {episodio.fecha && (
            <p className="text-gray-400 mb-2">{formatDate(episodio.fecha)}</p>
          )}

          {invitado && (
            <Link href={`/invitados/${invitado.id}`} className="text-secondary hover:underline block mb-6">
              Invitado: {invitado.nombre}
            </Link>
          )}

          {episodio.descripcion && (
            <p className="text-gray-300 leading-relaxed mb-8">{episodio.descripcion}</p>
          )}

          <div className="flex gap-4">
            {episodio.spotify_url && (
              <a href={episodio.spotify_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#1DB954] text-black rounded-full font-semibold hover:opacity-90 transition-opacity">
                Escuchar en Spotify
              </a>
            )}
            {episodio.youtube_url && (
              <a href={episodio.youtube_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#FF0000] text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
                Ver en YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
