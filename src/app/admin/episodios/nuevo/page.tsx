"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NuevoEpisodioPage() {
  const router = useRouter();
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("invitados")
        .select("id, nombre")
        .order("nombre", { ascending: true });
      if (data) setInvitados(data);
    })();
  }, []);

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
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("episodios").insert({
      titulo: form.titulo,
      slug: form.slug || slugify(form.titulo),
      descripcion: form.descripcion || null,
      meta_descripcion: form.meta_descripcion || null,
      imagen: form.imagen || null,
      invitado_id: form.invitado_id || null,
      spotify_url: form.spotify_url || null,
      youtube_url: form.youtube_url || null,
      fecha: form.fecha || null,
      destacado: form.destacado,
      estado: form.estado,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      router.push("/admin/episodios");
    }
    setLoading(false);
  };

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
          <h1 className="text-3xl font-bold text-white">Nuevo Episodio</h1>
          <p className="text-sm text-gray-500 mt-1">Crea un nuevo episodio para el podcast</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Guardando..." : "Guardar Episodio"}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
