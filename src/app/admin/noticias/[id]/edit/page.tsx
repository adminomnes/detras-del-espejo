"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditarNoticiaPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "", titulo: "", contenido: "", imagen: "", slug: "", meta_descripcion: "",
  });

  useEffect(() => {
    (async () => {
      const { id } = await params;
      const supabase = createClient();
      const { data } = await supabase.from("noticias").select("*").eq("id", id).single();
      if (data) setForm(data as typeof form);
      setLoading(false);
    })();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase.from("noticias").update(form).eq("id", form.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      router.push("/admin/noticias");
    }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner className="mx-auto mt-20" />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Editar Noticia</h1>

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
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
