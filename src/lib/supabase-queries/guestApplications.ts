import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type GuestApplication = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  foto_principal: string | null;
  fotos_adicionales: string[];
  biografia: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  twitter: string | null;
  motivacion: string | null;
  temas_sugeridos: string | null;
  experiencia_medios: string | null;
  preguntas_previas: string | null;
  consentimiento_imagen: boolean;
  estado: "pendiente" | "aprobada" | "rechazada" | "programada";
  nota_interna: string | null;
  fecha_entrevista: string | null;
  created_at: string;
  updated_at: string;
};

export async function getGuestApplications() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guest_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as GuestApplication[];
}

export async function getGuestApplication(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guest_applications")
    .select("*")
    .eq("id", id)
    .single();
  return data as GuestApplication | null;
}

export async function updateGuestApplicationStatus(
  id: string,
  estado: GuestApplication["estado"],
  nota_interna?: string,
  fecha_entrevista?: string
) {
  const supabase = createAdminClient();
  const updates: Record<string, unknown> = {
    estado,
    updated_at: new Date().toISOString(),
  };
  if (nota_interna !== undefined) updates.nota_interna = nota_interna;
  if (fecha_entrevista !== undefined) updates.fecha_entrevista = fecha_entrevista;

  const { error } = await supabase
    .from("guest_applications")
    .update(updates)
    .eq("id", id);
  return { error };
}
