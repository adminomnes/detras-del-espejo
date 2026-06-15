"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Calendar, ChevronLeft, ChevronRight, Mic, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

type Episodio = {
  id: string;
  titulo: string;
  slug: string | null;
  fecha: string | null;
  estado: string;
  invitados: { nombre: string } | null;
};

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const estadoColors: Record<string, string> = {
  borrador: "text-gray-500 border-gray-600",
  programado: "text-accent border-accent/50",
  publicado: "text-green-500 border-green-500/50",
};

export default function CalendarioPage() {
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("episodios")
        .select("id, titulo, slug, fecha, estado, invitados:invitado_id(nombre)")
        .order("fecha", { ascending: true });
      if (data) setEpisodios(data as unknown as Episodio[]);
      setLoading(false);
    })();
  }, []);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const getEpisodiosForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return episodios.filter((ep) => ep.fecha?.startsWith(dateStr));
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Calendar size={28} className="text-accent" />
          Calendario Editorial
        </h1>
        <p className="text-sm text-gray-500 mt-1">Visualiza y planifica tus episodios</p>
      </div>

      <div className="bg-gray-900/30 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevMonth} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-white">
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-white/5 rounded-xl overflow-hidden">
          {DAYS.map((d) => (
            <div key={d} className="bg-gray-900/50 p-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
              {d}
            </div>
          ))}

          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-900/30 p-3 min-h-[120px]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEpisodios = getEpisodiosForDay(day);
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === day;

            return (
              <div
                key={day}
                className={`bg-gray-900/50 p-2 min-h-[120px] transition-colors hover:bg-gray-800/50 ${
                  isToday ? "ring-1 ring-accent/50" : ""
                }`}
              >
                <span className={`text-sm font-bold mb-1 block ${isToday ? "text-accent" : "text-gray-400"}`}>
                  {day}
                </span>
                <div className="flex flex-col gap-1">
                  {dayEpisodios.slice(0, 3).map((ep) => (
                    <Link
                      key={ep.id}
                      href={`/admin/episodios/${ep.id}/edit`}
                      className={`group text-xs p-1.5 rounded border truncate transition-colors ${
                        estadoColors[ep.estado] ?? "text-gray-500 border-gray-600"
                      } hover:bg-white/5`}
                    >
                      <span className="flex items-center gap-1">
                        {ep.estado === "publicado" ? (
                          <CheckCircle size={10} className="shrink-0" />
                        ) : ep.estado === "programado" ? (
                          <Clock size={10} className="shrink-0" />
                        ) : (
                          <Mic size={10} className="shrink-0" />
                        )}
                        <span className="truncate">{ep.titulo}</span>
                      </span>
                    </Link>
                  ))}
                  {dayEpisodios.length > 3 && (
                    <span className="text-xs text-gray-500 pl-1">+{dayEpisodios.length - 3} más</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {loading && <LoadingSpinner className="mx-auto mt-10" />}
    </div>
  );
}
