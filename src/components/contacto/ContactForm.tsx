"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const supabase = createClient();
    const { error } = await supabase.from("contactos").insert(form);

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
    }
  };

  if (status === "success") {
    return (
      <div className="glass p-12 rounded-3xl text-center">
        <h3 className="text-2xl font-bold text-accent mb-4">¡Mensaje enviado!</h3>
        <p className="text-gray-400">Gracias por contactarnos. Te responderemos pronto.</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 uppercase tracking-widest">Nombre</label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 uppercase tracking-widest">Correo</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400 uppercase tracking-widest">Asunto</label>
        <input
          type="text"
          value={form.asunto}
          onChange={(e) => setForm({ ...form, asunto: e.target.value })}
          className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400 uppercase tracking-widest">Mensaje</label>
        <textarea
          required
          rows={5}
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity mt-4 shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Enviar Mensaje"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">Ocurrió un error. Intenta de nuevo.</p>
      )}
    </form>
  );
}
