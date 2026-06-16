"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import Link from "next/link";
import { Plus } from "lucide-react";

const columns = [
  { key: "imagen", label: "Imagen", render: (value: unknown) => value ? <span className="text-primary">URL</span> : "-" },
  { key: "categoria", label: "Categoría" },
  { key: "descripcion", label: "Descripción", render: (value: unknown) => value ? String(value).slice(0, 60) + "..." : "-" },
];

export default function AdminGaleriaPage() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("galeria")
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
        <h1 className="text-3xl font-bold">Galería</h1>
        <Link href="/admin/galeria/nuevo" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} /> Nueva Imagen
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <AdminTableWrapper
          columns={columns}
          data={data}
          basePath="/admin/galeria"
          tableName="galeria"
        />
      )}
    </div>
  );
}
