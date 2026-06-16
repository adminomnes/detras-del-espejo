import { createAdminClient } from "@/lib/supabase/admin";

export type Noticia = {
  id: string;
  titulo: string;
  contenido: string;
  imagen: string | null;
  slug: string | null;
  meta_descripcion: string | null;
  created_at: string;
};

export async function getNoticias() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("noticias")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getNoticiaBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("noticias")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getNoticiaById(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("noticias")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}
