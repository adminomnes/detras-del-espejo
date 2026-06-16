import { createAdminClient } from "@/lib/supabase/admin";
import { StatsCard } from "@/components/admin/StatsCard";
import { Mic, Users, MessageSquare, Star, Calendar, Clock, UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { timeAgo } from "@/lib/utils/date";

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [episodiosRes, invitadosCount, destacadosCount, mensajesRes, estadoCounts, programadosRes, invitadasRes] = await Promise.all([
    supabase.from("episodios").select("*", { count: "exact", head: true }),
    supabase.from("invitados").select("*", { count: "exact", head: true }).then((r) => r.count ?? 0),
    supabase.from("episodios").select("*", { count: "exact", head: true }).eq("destacado", true).then((r) => r.count ?? 0),
    supabase.from("contactos").select("*", { count: "exact" }).eq("leido", false).order("created_at", { ascending: false }).limit(5),
    supabase.from("episodios").select("estado").then((r) => {
      const counts = { borrador: 0, programado: 0, publicado: 0 };
      (r.data ?? []).forEach((e) => { if (e.estado in counts) counts[e.estado as keyof typeof counts]++; });
      return counts;
    }),
    supabase.from("episodios").select("id, titulo, slug, fecha, invitados:invitado_id(nombre)").eq("estado", "programado").order("fecha", { ascending: true }).limit(5),
    supabase.from("guest_applications").select("*", { count: "exact", head: true }).eq("estado", "pendiente").then((r) => r.count ?? 0),
  ]);

  const episodiosCount = episodiosRes.count ?? 0;
  const { data: mensajes, count: mensajesNoLeidos } = mensajesRes;
  const { data: programados } = programadosRes;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del podcast</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard icon={Mic} label="Episodios" value={episodiosCount} color="primary" />
        <StatsCard icon={Users} label="Invitados" value={invitadosCount} color="secondary" />
        <StatsCard icon={Star} label="Destacados" value={destacadosCount} color="accent" />
        <StatsCard icon={MessageSquare} label="Mensajes" value={mensajesNoLeidos ?? 0} color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatsCard icon={Clock} label="Borradores" value={estadoCounts.borrador} color="primary" />
        <StatsCard icon={Calendar} label="Programados" value={estadoCounts.programado} color="accent" />
        <StatsCard icon={UserPlus} label="Solicitudes Pendientes" value={invitadasRes} color="accent" />
      </div>

      {programados && programados.length > 0 && (
        <div className="bg-gray-900/30 border border-white/5 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-accent" />
              Próximos Episodios Programados
            </h2>
            <Link href="/admin/calendario" className="text-sm text-accent hover:text-white transition-colors">
              Ver calendario
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {programados.map((ep: Record<string, unknown>) => {
              const invitado = (ep.invitados as { nombre?: string } | null);
              return (
                <div key={ep.id as string} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div>
                      <p className="font-medium text-white">{ep.titulo as string}</p>
                      {invitado?.nombre && <p className="text-xs text-gray-500">{invitado.nombre}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{ep.fecha ? new Date(ep.fecha as string).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "Sin fecha"}</span>
                    <Link href={`/admin/episodios/${ep.id}/edit`} className="text-xs text-accent hover:text-white transition-colors">
                      Editar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-900/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Mensajes Sin Leer
          </h2>
          <Link href="/admin/mensajes" className="text-sm text-accent hover:text-white transition-colors">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {mensajes && mensajes.length > 0 ? (
            mensajes.map((msg: { id: string; nombre: string; mensaje: string; created_at: string }) => (
              <div key={msg.id} className="px-6 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg shadow-primary/20">
                  {msg.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-white truncate">{msg.nombre}</h4>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{timeAgo(msg.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{msg.mensaje}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p>No hay mensajes sin leer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
