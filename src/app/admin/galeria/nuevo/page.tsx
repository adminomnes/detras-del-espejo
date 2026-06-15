"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NuevaImagenGaleriaPage() {
  const router = useRouter();
  const [form, setForm] = useState({ imagen: "", categoria: "", descripcion: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("galeria").insert(form);

    if (error) {
      alert("Error: " + error.message);
    } else {
      router.push("/admin/galeria");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Nueva Imagen</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input label="URL de Imagen" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} required />
        <Input label="Categoría" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 uppercase tracking-widest">Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            rows={3}
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Imagen"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
