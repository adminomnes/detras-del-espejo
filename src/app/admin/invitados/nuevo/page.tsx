"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NuevoInvitadoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "", biografia: "", foto: "", instagram: "",
    facebook: "", tiktok: "", youtube: "", slug: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("invitados").insert(form);

    if (error) {
      alert("Error: " + error.message);
    } else {
      router.push("/admin/invitados");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Nuevo Invitado</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 uppercase tracking-widest">Biografía</label>
          <textarea
            value={form.biografia}
            onChange={(e) => setForm({ ...form, biografia: e.target.value })}
            rows={4}
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <Input label="URL de Foto" value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })} />
        <Input label="Instagram URL" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
        <Input label="Facebook URL" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
        <Input label="TikTok URL" value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} />
        <Input label="YouTube URL" value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} />

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Invitado"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
