"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NuevaNoticiaPage() {
  const router = useRouter();
  const [form, setForm] = useState({ titulo: "", contenido: "", imagen: "", slug: "", meta_descripcion: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("noticias").insert(form);

    if (error) {
      alert("Error: " + error.message);
    } else {
      router.push("/admin/noticias");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Nueva Noticia</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input label="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
        <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input label="Meta Descripción (SEO)" value={form.meta_descripcion} onChange={(e) => setForm({ ...form, meta_descripcion: e.target.value })} />

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 uppercase tracking-widest">Contenido</label>
          <textarea
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            rows={10}
            required
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <Input label="URL de Imagen" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} />

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Noticia"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
