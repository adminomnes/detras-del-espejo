import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { table, id } = await request.json();

    if (!table || !id) {
      return NextResponse.json({ error: "table e id son obligatorios" }, { status: 400 });
    }

    const allowedTables = ["invitados", "galeria", "noticias", "episodios", "contactos", "mensajes"];
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: "Tabla no permitida" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
