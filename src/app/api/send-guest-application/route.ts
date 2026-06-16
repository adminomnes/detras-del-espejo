import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    const { error: insertError } = await supabase
      .from("guest_applications")
      .insert({
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
      });

    if (insertError) {
      return NextResponse.json({
        error: "Error de Supabase: " + insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

