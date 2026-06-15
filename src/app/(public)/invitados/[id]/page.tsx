import { getInvitadoById } from "@/lib/supabase-queries/invitados";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const invitado = await getInvitadoById(id);
  if (!invitado) return { title: "Invitado no encontrado" };
  return { title: invitado.nombre };
}

export default async function InvitadoDetailPage({ params }: Props) {
  const { id } = await params;
  const invitado = await getInvitadoById(id);

  if (!invitado) notFound();

  const episodios = Array.isArray(invitado.episodios) ? invitado.episodios : [];

  return (
    <div className="container mx-auto px-4 py-32">
      <Link href="/invitados" className="text-accent hover:underline mb-8 inline-block">&larr; Todos los invitados</Link>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-secondary/50 flex-shrink-0 mx-auto md:mx-0">
          {invitado.foto && <Image src={invitado.foto} alt={invitado.nombre} fill className="object-cover" />}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">{invitado.nombre}</h1>

          {invitado.biografia && <p className="text-gray-300 leading-relaxed mb-6">{invitado.biografia}</p>}

          <div className="flex gap-4 justify-center md:justify-start mb-8">
            {invitado.instagram && <a href={invitado.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">Instagram</a>}
            {invitado.facebook && <a href={invitado.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">Facebook</a>}
            {invitado.tiktok && <a href={invitado.tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">TikTok</a>}
            {invitado.youtube && <a href={invitado.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">YouTube</a>}
          </div>

          {episodios.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-accent mb-4">Episodios</h2>
              <div className="flex flex-col gap-3">
                {episodios.map((ep: { id: string; titulo: string; fecha: string | null }) => (
                  <Link
                    key={ep.id}
                    href={`/episodios/${ep.id}`}
                    className="glass px-6 py-4 rounded-xl hover:border-primary/50 transition-colors flex justify-between items-center"
                  >
                    <span className="font-semibold">{ep.titulo}</span>
                    <span className="text-gray-400 text-sm">{ep.fecha ? formatDate(ep.fecha) : ""}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
