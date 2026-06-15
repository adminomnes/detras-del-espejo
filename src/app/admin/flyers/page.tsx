"use client";

import { useState } from "react";
import { useFlyerStore } from "@/store/useFlyerStore";
import { ImagePlus, Trash2, Power, PowerOff } from "lucide-react";

export default function FlyersAdminPage() {
  const { flyers, addFlyer, toggleActive, deleteFlyer } = useFlyerStore();
  const [imageUrl, setImageUrl] = useState("");
  const [week, setWeek] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    addFlyer({
      imageUrl,
      assignedWeek: week,
      isActive: true,
    });
    setImageUrl("");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Flyers Semanales</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configura los flyers flotantes que se mostrarán cada semana.
        </p>
      </div>

      <div className="bg-gray-900/30 border border-white/5 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Agregar Nuevo Flyer</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-400 mb-2">URL de la Imagen</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm text-gray-400 mb-2">Semana (1-52)</label>
            <input
              type="number"
              min="1"
              max="52"
              required
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ImagePlus size={18} /> Agregar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {flyers.length === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500 bg-gray-900/30 rounded-2xl border border-white/5">
            No hay flyers configurados aún.
          </div>
        ) : (
          flyers.map((flyer) => (
            <div
              key={flyer.id}
              className={`relative bg-gray-900/30 border ${flyer.isActive ? "border-primary/50" : "border-white/5"} rounded-2xl overflow-hidden group transition-all`}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={flyer.imageUrl}
                  alt={`Flyer Semana ${flyer.assignedWeek}`}
                  className="w-full h-full object-cover"
                />
                {!flyer.isActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white/50 font-medium tracking-widest uppercase">Inactivo</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between border-t border-white/5">
                <div>
                  <span className="text-xs text-primary font-bold tracking-wider uppercase">
                    Semana {flyer.assignedWeek}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 text-[10px]">ID: {flyer.id}</p>
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
