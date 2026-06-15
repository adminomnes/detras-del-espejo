"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedEpisodes } from "@/components/home/FeaturedEpisodes";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type EpisodioConInvitado = {
  id: string;
  titulo: string;
  slug: string | null;
  imagen: string | null;
  invitado_id: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  fecha: string | null;
  invitados: { id: string; nombre: string } | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

export default function Home() {
  const [featured, setFeatured] = useState<EpisodioConInvitado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("episodios")
        .select("*, invitados:invitado_id(*)")
        .eq("estado", "publicado")
        .eq("destacado", true)
        .order("fecha", { ascending: false })
        .limit(4);
      if (data) setFeatured(data as unknown as EpisodioConInvitado[]);
      setLoading(false);
    })();
  }, []);

  const mapped = featured.map((ep) => ({
    id: ep.id,
    title: ep.titulo,
    guest: ep.invitados?.nombre ?? "Invitado por confirmar",
    date: formatDate(ep.fecha),
    image: ep.imagen ?? "",
    spotify_url: ep.spotify_url ?? undefined,
    youtube_url: ep.youtube_url ?? undefined,
  }));

  return (
    <>
      <HeroSection />
      {loading ? (
        <LoadingSpinner className="mx-auto my-20" />
      ) : (
        <FeaturedEpisodes episodes={mapped} />
      )}
      <NewsletterSection />
    </>
  );
}
