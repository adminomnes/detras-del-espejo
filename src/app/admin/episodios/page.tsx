"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Plus, Edit, Trash2, Star, StarOff } from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface EpisodioRow {
  id: string;
  titulo: string;
  slug: string | null;
  estado: string;
  destacado: boolean;
  fecha: string | null;
}

export default function AdminEpisodiosPage() {
  const [episodios, setEpisodios] = useState<EpisodioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("episodios")
        .select("id, titulo, slug, estado, destacado, fecha")
        .order("fecha", { ascending: false });
      if (mounted) {
        if (data) setEpisodios(data as EpisodioRow[]);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este episodio?")) return;
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.from("episodios").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      setEpisodios((prev) => prev.filter((e) => e.id !== id));
    }
    setDeleting(null);
  };

  if (loading) return <LoadingSpinner className="mx-auto mt-20" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Episodios</h1>
          <p className="text-sm text-gray-500 mt-1">Administra todos los episodios del podcast</p>
        </div>
        <Link
          href="/admin/episodios/nuevo"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Nuevo Episodio
        </Link>
      </div>

      <div className="bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-gray-400 uppercase tracking-wider font-medium">Título</th>
                <th className="text-left px-6 py-4 text-gray-400 uppercase tracking-wider font-medium">Estado</th>
                <th className="text-left px-6 py-4 text-gray-400 uppercase tracking-wider font-medium">Destacado</th>
                <th className="text-left px-6 py-4 text-gray-400 uppercase tracking-wider font-medium">Fecha</th>
                <th className="text-right px-6 py-4 text-gray-400 uppercase tracking-wider font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {episodios.map((ep) => (
                <tr key={ep.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-white font-medium">{ep.titulo}</span>
                      {ep.slug && (
                        <span className="block text-xs text-gray-500 font-mono mt-0.5">{ep.slug}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={ep.estado === "publicado" ? "accent" : "default"}>
                      {ep.estado}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {ep.destacado ? (
                      <Star size={16} className="text-accent fill-accent" />
                    ) : (
                      <StarOff size={16} className="text-gray-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {ep.fecha ? formatDate(ep.fecha) : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/episodios/${ep.id}/edit`}
                        className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(ep.id)}
                        disabled={deleting === ep.id}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {episodios.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No hay episodios todavía.</p>
            <Link
              href="/admin/episodios/nuevo"
              className="text-primary hover:underline text-sm"
            >
              Crear el primer episodio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
