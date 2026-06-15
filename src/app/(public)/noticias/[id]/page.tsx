import { getNoticiaById } from "@/lib/supabase-queries/noticias";
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
  const noticia = await getNoticiaById(id);
  if (!noticia) return { title: "Noticia no encontrada" };
  return { title: noticia.titulo, description: noticia.meta_descripcion };
}

export default async function NoticiaDetailPage({ params }: Props) {
  const { id } = await params;
  const noticia = await getNoticiaById(id);

  if (!noticia) notFound();

  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <Link href="/noticias" className="text-accent hover:underline mb-8 inline-block">&larr; Volver a noticias</Link>

      <article>
        {noticia.imagen && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={noticia.imagen} alt={noticia.titulo} fill className="object-cover" />
          </div>
        )}

        <div className="text-accent text-sm font-bold tracking-widest mb-2">
          {formatDate(noticia.created_at)}
        </div>

        <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-8">{noticia.titulo}</h1>

        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
          {noticia.contenido}
        </div>
      </article>
    </div>
  );
}
