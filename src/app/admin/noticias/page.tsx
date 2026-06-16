"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

const columns = [
  { key: "titulo", label: "Título" },
  { key: "created_at", label: "Fecha", render: (value: unknown) => value ? formatDate(String(value)) : "-" },
];

export default function AdminNoticiasPage() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("noticias")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data: result }) => {
        setData((result ?? []) as unknown as Record<string, unknown>[]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Noticias</h1>
        <Link href="/admin/noticias/nuevo" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} /> Nueva Noticia
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <AdminTableWrapper
          columns={columns}
          data={data}
          basePath="/admin/noticias"
          tableName="noticias"
        />
      )}
    </div>
  );
}
