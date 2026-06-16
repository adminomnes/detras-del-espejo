"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, ChevronDown, Users, Clock, CheckCircle, XCircle, Calendar, ExternalLink } from "lucide-react";
import type { GuestApplication } from "@/lib/supabase-queries/guestApplications";
import { timeAgo } from "@/lib/utils/date";

const statusConfig = {
  pendiente: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", label: "Pendiente" },
  aprobada: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", label: "Aprobada" },
  rechazada: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", label: "Rechazada" },
  programada: { icon: Calendar, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", label: "Programada" },
};

export function InvitadasAdminList({ applications }: { applications: GuestApplication[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("todas");

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !search ||
        app.nombre.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "todas" || app.estado === filter;
      return matchesSearch && matchesFilter;
    });
  }, [applications, search, filter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-gray-900/50 border border-white/10 rounded-xl px-6 py-3 pr-12 text-white outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="programada">Programadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="bg-gray-900/30 border border-white/5 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No hay solicitudes</p>
            <p className="text-sm mt-1">
              {search || filter !== "todas" ? "Intenta con otros filtros." : "Aún no has recibido solicitudes."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
              {filtered.map((app) => {
                const status = statusConfig[app.estado] ?? statusConfig.pendiente;
                const StatusIcon = status.icon;
              return (
                <Link
                  key={app.id}
                  href={`/admin/invitadas/${app.id}`}
                  className="flex items-center gap-4 px-6 py-5 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-primary/20">
                    {app.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-white truncate group-hover:text-accent transition-colors">
                        {app.nombre}
                      </h4>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color} ${status.border} border`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{app.email}</span>
                      <span>{timeAgo(app.created_at)}</span>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-600 group-hover:text-accent transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-600 mt-4">
        {filtered.length} de {applications.length} solicitudes
      </p>
    </div>
  );
}
