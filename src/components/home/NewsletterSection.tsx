"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.from("suscriptores").insert({ email });

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <section className="py-20 relative z-10 bg-black/50 border-y border-white/5">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-outfit uppercase tracking-widest text-white mb-6">Suscríbete al Podcast</h3>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          No te pierdas ninguna de nuestras entrevistas. Únete a nuestra comunidad y recibe notificaciones de nuevos episodios.
        </p>

        {status === "success" ? (
          <p className="text-accent font-semibold">¡Gracias por suscribirte!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass px-6 py-3 rounded-full flex-1 outline-none focus:border-primary/50 transition-colors text-white"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "loading" ? "Enviando..." : "Unirse"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400 text-sm mt-4">Ocurrió un error. Intenta de nuevo.</p>
        )}
      </div>
    </section>
  );
}
