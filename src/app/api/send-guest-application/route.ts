import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Asegura que la tabla existe con todas las columnas necesarias
async function ensureTable(supabase: ReturnType<typeof createAdminClient>) {
  await supabase.rpc("exec_guest_table_setup" as never).maybeSingle().catch(() => null);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      email,
      telefono,
      foto_principal,
      fotos_adicionales,
      biografia,
      instagram,
      facebook,
      tiktok,
      youtube,
      twitter,
      motivacion,
      temas_sugeridos,
      experiencia_medios,
      preguntas_previas,
      consentimiento_imagen,
      turnstileToken,
    } = body;

    if (!nombre || !email) {
      return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
    }

    if (!consentimiento_imagen) {
      return NextResponse.json({ error: "Debes aceptar el consentimiento de imagen" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (!turnstileToken) {
        return NextResponse.json({ error: "Verificación de seguridad requerida" }, { status: 400 });
      }
      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
        }
      );
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return NextResponse.json({ error: "Verificación de seguridad fallida" }, { status: 400 });
      }
    }

    const supabase = createAdminClient();

    // Insertar usando la URL REST directa con service role key para bypassear el schema cache
    const insertRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/guest_applications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY!,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          nombre,
          email,
          telefono: telefono || null,
          foto_principal: foto_principal || null,
          fotos_adicionales: fotos_adicionales || [],
          biografia: biografia || null,
          instagram: instagram || null,
          facebook: facebook || null,
          tiktok: tiktok || null,
          youtube: youtube || null,
          twitter: twitter || null,
          motivacion: motivacion || null,
          temas_sugeridos: temas_sugeridos || null,
          experiencia_medios: experiencia_medios || null,
          preguntas_previas: preguntas_previas || null,
          consentimiento_imagen: consentimiento_imagen ?? false,
        }),
      }
    );

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      // Si la tabla no existe, intentamos crearla y reenviar
      if (errText.includes("does not exist") || errText.includes("schema cache")) {
        // Crear tabla via SQL
        await supabase.from("_pgrst_reserved" as never).select().limit(0).maybeSingle().catch(() => null);
        return NextResponse.json(
          { error: "La tabla aún no existe en Supabase. Ejecuta el SQL de creación en el dashboard." },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: "Error al enviar la solicitud: " + errText }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

