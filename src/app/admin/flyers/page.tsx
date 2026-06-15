"use client";

import { useRef, useState } from "react";
import { useFlyerStore } from "@/store/useFlyerStore";
import { ImagePlus, Trash2, Power, PowerOff, UploadCloud, X } from "lucide-react";

export default function FlyersAdminPage() {
  const { flyers, addFlyer, toggleActive, deleteFlyer } = useFlyerStore();
  const [week, setWeek] = useState(1);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar selección de archivo local — mostrar preview inmediato
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

  // Subir al endpoint /api/upload existente y guardar URL pública
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
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al subir imagen");
      addFlyer({ imageUrl: json.url, assignedWeek: week, isActive: true });
      handleClearFile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setUploading(false);
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

      {/* ── Formulario de upload ── */}
      <div className="bg-gray-900/30 border border-white/5 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-5">Subir Nuevo Flyer</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Zona de drop / selección de archivo */}
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

            {/* Semana + botón */}
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

      {/* ── Listado de flyers ── */}
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
              className={`relative bg-gray-900/30 border ${flyer.isActive ? "border-primary/50" : "border-white/5"} rounded-2xl overflow-hidden transition-all`}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={flyer.imageUrl}
                  alt={`Flyer Semana ${flyer.assignedWeek}`}
                  className="w-full h-full object-cover"
                />
                {!flyer.isActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white/50 font-medium tracking-widest uppercase text-sm">Inactivo</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between border-t border-white/5">
                <div>
                  <span className="text-xs text-primary font-bold tracking-wider uppercase">
                    Semana {flyer.assignedWeek}
                  </span>
                  <p className="text-[10px] text-gray-600 mt-0.5">ID: {flyer.id}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(flyer.id)}
                    className={`p-2 rounded-lg transition-colors ${flyer.isActive ? "text-green-400 hover:bg-green-400/10" : "text-gray-500 hover:bg-gray-800"}`}
                    title={flyer.isActive ? "Desactivar" : "Activar"}
                  >
                    {flyer.isActive ? <Power size={18} /> : <PowerOff size={18} />}
                  </button>
                  <button
                    onClick={() => deleteFlyer(flyer.id)}
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
    </div>
  );
}
