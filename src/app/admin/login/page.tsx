"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { SITE_NAME } from "@/lib/utils/constants";
import { Mic } from "lucide-react";

const isSupabaseConfigured =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("tu_supabase");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión con Supabase");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0d0018] to-[#0a000a] p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl shadow-primary/5">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <Mic size={24} className="text-white" />
            </div>
            <h1 className="font-outfit text-2xl tracking-widest text-white uppercase mb-1">
              Admin <span className="text-accent drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Panel</span>
            </h1>
            <p className="text-gray-500 text-sm">{SITE_NAME}</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 mb-6">
              <p className="text-accent text-xs font-medium mb-1">Supabase no configurado</p>
              <p className="text-gray-400 text-xs">
                Reemplaza las variables en <code className="text-accent">.env.local</code> con tus credenciales reales de Supabase para que el panel funcione.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 uppercase tracking-widest font-medium">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@detrasdelespejo.com"
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-accent transition-colors placeholder:text-gray-700 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 uppercase tracking-widest font-medium">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-accent transition-colors placeholder:text-gray-700 text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative mt-2 bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/30 disabled:opacity-50 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </span>
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
