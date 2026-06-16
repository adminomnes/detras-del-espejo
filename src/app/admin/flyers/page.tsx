"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Power, PowerOff, UploadCloud, X } from "lucide-react";

interface Flyer {
  id: string;
  image_url: string;
  assigned_week: number;
  is_active: boolean;
  created_at: string;
}

export default function FlyersAdminPage() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [week, setWeek] = useState(1);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/flyers")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setFlyers(json.data);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Selecciona una imagen primero.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error ?? "Error al subir imagen");

      const createRes = await fetch("/api/flyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: uploadJson.url, assigned_week: week }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error ?? "Error al crear flyer");

      setFlyers((prev) => [...prev, createJson.data]);
      handleClearFile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    const res = await fetch(`/api/flyers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    const json = await res.json();
    if (json.success) {
      setFlyers((prev) => prev.map((f) => (f.id === id ? json.data : f)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este flyer?")) return;
    const res = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "flyers", id }),
    });
    const json = await res.json();
    if (json.success) {
      setFlyers((prev) => prev.filter((f) => f.id !== id));
    } else {
      alert("Error: " + (json.error || "No se pudo eliminar"));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Flyers Semanales</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sube imágenes desde tu PC y asígnalas a una semana del año.
        </p>
      </div>

      <div className="bg-gray-900/30 border border-white/5 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-5">Subir Nuevo Flyer</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 w-full">
              {!preview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/10 hover:border-primary/50 rounded-2xl p-10 flex flex-col items-center gap-3 text-gray-500 hover:text-white transition-all duration-300 group"
                >
                  <UploadCloud size={36} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Haz clic para seleccionar imagen</span>
                  <span className="text-xs">JPG, PNG, WEBP, GIF — Máx. 5 MB</span>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-primary/30">
                  <img src={preview} alt="Preview" className="w-full max-h-64 object-contain bg-black/40" />
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2 text-xs text-white truncate">
                    {selectedFile?.name}
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex flex-col gap-4 w-full md:w-44">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Semana del año (1–52)</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
              )}
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subiendo…
                  </>
                ) : (
                  <>
                    <ImagePlus size={18} /> Guardar Flyer
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-12">Cargando flyers...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {flyers.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 bg-gray-900/30 rounded-2xl border border-white/5">
              <UploadCloud size={36} className="mx-auto mb-3 opacity-30" />
              <p>No hay flyers configurados aún.</p>
            </div>
          ) : (
            flyers.map((flyer) => (
              <div
                key={flyer.id}
                className={`relative bg-gray-900/30 border ${flyer.is_active ? "border-primary/50" : "border-white/5"} rounded-2xl overflow-hidden transition-all`}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={flyer.image_url}
                    alt={`Flyer Semana ${flyer.assigned_week}`}
                    className="w-full h-full object-cover"
                  />
                  {!flyer.is_active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white/50 font-medium tracking-widest uppercase text-sm">Inactivo</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center justify-between border-t border-white/5">
                  <div>
                    <span className="text-xs text-primary font-bold tracking-wider uppercase">
                      Semana {flyer.assigned_week}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-0.5">ID: {flyer.id}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(flyer.id, flyer.is_active)}
                      className={`p-2 rounded-lg transition-colors ${flyer.is_active ? "text-green-400 hover:bg-green-400/10" : "text-gray-500 hover:bg-gray-800"}`}
                      title={flyer.is_active ? "Desactivar" : "Activar"}
                    >
                      {flyer.is_active ? <Power size={18} /> : <PowerOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(flyer.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
