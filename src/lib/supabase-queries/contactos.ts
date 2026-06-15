import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";

export type Contacto = {
  id: string;
  nombre: string;
  email: string;
  asunto: string | null;
  mensaje: string;
  leido: boolean;
  created_at: string;
};

async function getClient() {
  try {
    return await createServerClient();
  } catch {
    return createBrowserClient();
  }
}

export async function getContactos() {
  const supabase = await getClient();
  const { data } = await supabase
    .from("contactos")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getContactosNoLeidos() {
  const supabase = await getClient();
  const { data } = await supabase
    .from("contactos")
    .select("*")
    .eq("leido", false)
    .order("created_at", { ascending: false });
  return data ?? [];
}
