import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

export type GaleriaItem = {
  id: string;
  imagen: string;
  categoria: string | null;
  descripcion: string | null;
  created_at: string;
};

async function getClient() {
  try {
    return await createServerClient();
  } catch {
    return createBrowserClient();
  }
}

export async function getGaleria() {
  const supabase = await getClient();
  const { data } = await supabase
    .from("galeria")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getGaleriaById(id: string) {
  const supabase = await getClient();
  const { data } = await supabase
    .from("galeria")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}
