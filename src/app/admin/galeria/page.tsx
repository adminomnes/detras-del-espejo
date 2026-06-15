import { getGaleria } from "@/lib/supabase-queries/galeria";
import { DataTable } from "@/components/admin/DataTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const columns = [
  { key: "imagen", label: "Imagen", render: (value: unknown) => value ? <span className="text-primary">URL</span> : "-" },
  { key: "categoria", label: "Categoría" },
  { key: "descripcion", label: "Descripción", render: (value: unknown) => value ? String(value).slice(0, 60) + "..." : "-" },
];

export default async function AdminGaleriaPage() {
  const galeria = await getGaleria();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Galería</h1>
        <Link href="/admin/galeria/nuevo" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} /> Nueva Imagen
        </Link>
      </div>

      <DataTable columns={columns} data={galeria as unknown as Record<string, unknown>[]} basePath="/admin/galeria" />
    </div>
  );
}
