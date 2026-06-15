"use client";

import { useState, useEffect } from "react";
import { EpisodeCard } from "@/components/episodios/EpisodeCard";
import { EpisodeFilters } from "@/components/episodios/EpisodeFilters";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type EpisodioConInvitado = {
  id: string;
  titulo: string;
  slug: string | null;
  descripcion: string | null;
  imagen: string | null;
  invitado_id: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  fecha: string | null;
  destacado: boolean;
  invitados: { id: string; nombre: string } | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

export default function EpisodiosPage() {
  const [episodios, setEpisodios] = useState<EpisodioConInvitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("episodios")
        .select("*, invitados:invitado_id(*)")
        .eq("estado", "publicado")
        .order("fecha", { ascending: false });
      if (data) setEpisodios(data as unknown as EpisodioConInvitado[]);
      setLoading(false);
    })();
  }, []);

  const filtered = episodios.filter((ep) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      ep.titulo.toLowerCase().includes(q) ||
      (ep.invitados?.nombre ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-outfit uppercase tracking-widest text-white mb-4">
          Todos los <span className="text-accent">Episodios</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explora nuestro catálogo completo de entrevistas profundas y conversaciones sin filtro.
        </p>
      </div>

      <EpisodeFilters
        search={search}
        onSearchChange={setSearch}
        categories={["Todos"]}
        activeCategory="Todos"
        onCategoryChange={() => {}}
        hideCategories
      />

      {loading ? (
        <LoadingSpinner className="mx-auto mt-20" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((ep, i) => (
            <EpisodeCard
              key={ep.id}
              id={ep.id}
              title={ep.titulo}
              guest={ep.invitados?.nombre ?? "Invitado por confirmar"}
              date={formatDate(ep.fecha)}
              image={ep.imagen ?? "/placeholder.jpg"}
              spotify_url={ep.spotify_url ?? undefined}
              youtube_url={ep.youtube_url ?? undefined}
              index={i}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No se encontraron episodios que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
