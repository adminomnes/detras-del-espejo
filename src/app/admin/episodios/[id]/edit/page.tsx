"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function EditarEpisodioPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [form, setForm] = useState({
    id: "",
    titulo: "",
    slug: "",
    descripcion: "",
    meta_descripcion: "",
    imagen: "",
    invitado_id: "",
    spotify_url: "",
    youtube_url: "",
    fecha: "",
    destacado: false,
    estado: "borrador" as const,
  });
  const [invitados, setInvitados] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      const supabase = createClient();
      const [epRes, invRes] = await Promise.all([
        supabase.from("episodios").select("*").eq("id", id).single(),
        supabase.from("invitados").select("id, nombre").order("nombre", { ascending: true }),
      ]);
      if (invRes.data) setInvitados(invRes.data);
      if (epRes.data) {
        setForm({
          id: epRes.data.id,
          titulo: epRes.data.titulo ?? "",
          slug: epRes.data.slug ?? "",
          descripcion: epRes.data.descripcion ?? "",
          meta_descripcion: epRes.data.meta_descripcion ?? "",
          imagen: epRes.data.imagen ?? "",
          invitado_id: epRes.data.invitado_id ?? "",
          spotify_url: epRes.data.spotify_url ?? "",
          youtube_url: epRes.data.youtube_url ?? "",
          fecha: epRes.data.fecha ?? "",
          destacado: epRes.data.destacado ?? false,
          estado: epRes.data.estado ?? "borrador",
        });
      }
      setLoading(false);
    })();
  }, [params]);

  const handleTituloChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        titulo: value,
        slug: slugEdited ? prev.slug : slugify(value),
      }));
    },
    [slugEdited]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("episodios")
      .update({
        titulo: form.titulo,
        slug: form.slug || slugify(form.titulo),
        descripcion: form.descripcion,
        meta_descripcion: form.meta_descripcion,
        imagen: form.imagen,
        invitado_id: form.invitado_id || null,
        spotify_url: form.spotify_url,
        youtube_url: form.youtube_url,
        fecha: form.fecha,
        destacado: form.destacado,
        estado: form.estado,
      })
      .eq("id", form.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      router.push("/admin/episodios");
    }
    setSaving(false);
  };

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (loading) return <LoadingSpinner className="mx-auto mt-20" />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/episodios"
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Episodio</h1>
          <p className="text-sm text-gray-500 mt-1">Modifica los datos del episodio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Basic Info */}
        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Información Básica</h2>

          <Input
            label="Título"
            value={form.titulo}
            onChange={handleTituloChange}
            required
            placeholder="Ej: El precio del éxito"
            className="bg-black/50 border-white/10 focus:border-accent"
          />

          <Input
            label="Slug (URL)"
            value={form.slug}
            onChange={(e) => {
              set("slug", e.target.value);
              setSlugEdited(true);
            }}
            placeholder="el-precio-del-exito"
            className="bg-black/50 border-white/10 focus:border-accent font-mono text-sm"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 uppercase tracking-widest">Invitado</label>
            <select
              value={form.invitado_id}
              onChange={(e) => set("invitado_id", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent transition-colors"
            >
              <option value="">Seleccionar invitado...</option>
              {invitados.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 uppercase tracking-widest">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              rows={4}
              placeholder="Descripción completa del episodio..."
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent transition-colors resize-none placeholder:text-gray-600"
            />
          </div>

          <Input
            label="Meta Descripción (SEO)"
            value={form.meta_descripcion}
            onChange={(e) => set("meta_descripcion", e.target.value)}
            placeholder="Breve descripción para motores de búsqueda..."
            className="bg-black/50 border-white/10 focus:border-accent"
          />
        </div>

        {/* Media */}
        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Multimedia</h2>

          <ImageUploader
            currentImage={form.imagen}
            onUpload={(url) => set("imagen", url)}
          />

          <Input
            label="URL de Spotify"
            value={form.spotify_url}
            onChange={(e) => set("spotify_url", e.target.value)}
            placeholder="https://open.spotify.com/episode/..."
            className="bg-black/50 border-white/10 focus:border-accent"
          />

          <Input
            label="URL de YouTube"
            value={form.youtube_url}
            onChange={(e) => set("youtube_url", e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="bg-black/50 border-white/10 focus:border-accent"
          />
        </div>

        {/* Publication */}
        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Publicación</h2>

          <Input
            label="Fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => set("fecha", e.target.value)}
            className="bg-black/50 border-white/10 focus:border-accent"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 uppercase tracking-widest">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => set("estado", e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent transition-colors"
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
              <option value="programado">Programado</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              role="checkbox"
              aria-checked={form.destacado}
              tabIndex={0}
              onClick={() => set("destacado", !form.destacado)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set("destacado", !form.destacado); } }}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                form.destacado ? "bg-accent" : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-md ${
                  form.destacado ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
            <span className={`flex items-center gap-2 text-sm font-medium ${
              form.destacado ? "text-accent" : "text-gray-400"
            }`}>
              <Star size={14} className={form.destacado ? "fill-accent text-accent" : ""} />
              Episodio Destacado
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
