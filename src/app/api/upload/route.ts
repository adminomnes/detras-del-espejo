import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Formato de imagen no soportado" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede superar 5MB" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("imagenes")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Error al subir: " + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("imagenes")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
