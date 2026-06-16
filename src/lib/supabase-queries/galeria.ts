import { createAdminClient } from "@/lib/supabase/admin";

export type GaleriaItem = {
  id: string;
  imagen: string;
  categoria: string | null;
  descripcion: string | null;
  created_at: string;
};

export async function getGaleria() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("galeria")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getGaleriaById(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("galeria")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}
