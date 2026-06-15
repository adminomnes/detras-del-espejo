import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

export type Episodio = {
  id: string;
  titulo: string;
  slug: string | null;
  descripcion: string | null;
  meta_descripcion: string | null;
  imagen: string | null;
  invitado_id: string | null;
  spotify_url: string | null;
  youtube_url: string | null;
  fecha: string | null;
  destacado: boolean;
  estado: "publicado" | "borrador" | "programado";
  created_at: string;
};

async function getClient() {
  try {
    return await createServerClient();
  } catch {
    return createBrowserClient();
  }
}

export async function getEpisodiosPublicados() {
  const supabase = await getClient();
  const { data } = await supabase
    .from("episodios")
    .select("*, invitados:invitado_id(*)")
    .eq("estado", "publicado")
    .order("fecha", { ascending: false });
  return data ?? [];
}

export async function getEpisodioBySlug(slug: string) {
  const supabase = await getClient();
  const { data } = await supabase
    .from("episodios")
    .select("*, invitados:invitado_id(*)")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getEpisodioById(id: string) {
  const supabase = await getClient();
  const { data } = await supabase
    .from("episodios")
    .select("*, invitados:invitado_id(*)")
    .eq("id", id)
    .single();
  return data;
}

export async function getAllEpisodios() {
  const supabase = await getClient();
  const { data } = await supabase
    .from("episodios")
    .select("*, invitados:invitado_id(*)")
    .order("fecha", { ascending: false });
  return data ?? [];
}
