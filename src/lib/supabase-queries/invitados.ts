import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

export type Invitado = {
  id: string;
  nombre: string;
  biografia: string | null;
  foto: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  slug: string | null;
  created_at: string;
};

async function getClient() {
  try {
    return await createServerClient();
  } catch {
    return createBrowserClient();
  }
}

export async function getInvitados() {
  const supabase = await getClient();
  const { data } = await supabase
    .from("invitados")
    .select("*")
    .order("nombre", { ascending: true });
  return data ?? [];
}

export async function getInvitadoBySlug(slug: string) {
  const supabase = await getClient();
  const { data } = await supabase
    .from("invitados")
    .select("*, episodios(*, invitados:invitado_id(*))")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getInvitadoById(id: string) {
  const supabase = await getClient();
  const { data } = await supabase
    .from("invitados")
    .select("*, episodios(*)")
    .eq("id", id)
    .single();
  return data;
}
