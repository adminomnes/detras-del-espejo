"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { ImageIcon, Upload, Trash2, Link2, Search } from "lucide-react";
import Image from "next/image";

type MediaItem = {
  name: string;
  publicUrl: string;
  metadata: Record<string, unknown> | null;
};

export default function BibliotecaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const listItems = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from("imagenes").list("biblioteca", {
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      console.error("Error loading media:", error);
      return [];
    }
    return (data ?? []).map((item) => ({
      name: item.name,
      metadata: item.metadata,
      publicUrl: supabase.storage.from("imagenes").getPublicUrl(`biblioteca/${item.name}`).data.publicUrl,
    }));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await listItems();
      if (cancelled) return;
      setItems(result);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const reloadItems = async () => {
    const result = await listItems();
    setItems(result);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    const { error } = await supabase.storage.from("imagenes").upload(`biblioteca/${fileName}`, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      alert("Error al subir: " + error.message);
    } else {
      await reloadItems();
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;
    const supabase = createClient();
    const { error } = await supabase.storage.from("imagenes").remove([`biblioteca/${item.name}`]);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      setSelected(null);
      await reloadItems();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ImageIcon size={28} className="text-accent" />
            Biblioteca Multimedia
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona las imágenes de tu sitio</p>
        </div>
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-black font-medium rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Upload size={18} />
            {uploading ? "Subiendo..." : "Subir imagen"}
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar imágenes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-gray-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-accent transition-colors placeholder:text-gray-600"
        />
      </div>

      {loading ? (
        <LoadingSpinner className="mx-auto mt-20" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p>{search ? "No se encontraron imágenes." : "Aún no hay imágenes. Sube tu primera imagen."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelected(item)}
              className="group relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-gray-800 hover:border-accent/50 transition-all"
            >
              <Image src={item.publicUrl} alt={item.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">{item.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="relative aspect-video w-full max-h-[60vh]">
              <Image src={selected.publicUrl} alt={selected.name} fill className="object-contain" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-white truncate">{selected.name}</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyUrl(selected.publicUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Link2 size={16} />
                  Copiar URL
                </button>
                <button
                  onClick={() => handleDelete(selected)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Tamaño: {selected.metadata?.size ? `${(Number(selected.metadata.size) / 1024).toFixed(1)} KB` : "---"}</p>
                <p>Tipo: {(selected.metadata?.mimetype as string) ?? "---"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
