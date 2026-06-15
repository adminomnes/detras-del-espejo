"use client";

import { useEffect, useState } from "react";
import { useFlyerStore } from "@/store/useFlyerStore";
import { X } from "lucide-react";

export function WeeklyFlyer() {
  const { flyers } = useFlyerStore();
  const [currentFlyerUrl, setCurrentFlyerUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya se mostró en esta sesión
    if (sessionStorage.getItem("flyerShown")) {
      return;
    }

    const activeFlyers = flyers.filter((f) => f.isActive);
    if (activeFlyers.length === 0) return;

    // 2. Calcular semana actual del año
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff =
      now.getTime() -
      start.getTime() +
      (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const currentWeek = Math.floor(diff / oneWeek) + 1;

    // 3. Buscar flyer para la semana actual
    let selectedFlyer = activeFlyers.find((f) => f.assignedWeek === currentWeek);

    // 4. Fallback al último flyer activo si no hay coincidencia
    if (!selectedFlyer) {
      selectedFlyer = [...activeFlyers].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
    }

    if (selectedFlyer) {
      setCurrentFlyerUrl(selectedFlyer.imageUrl);
      setIsRendered(true);
      // Pequeño delay para asegurar que la transición de CSS se aplique
      setTimeout(() => setIsVisible(true), 50);
    }
  }, [flyers]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("flyerShown", "true");
    // Esperar a que termine la animación antes de desmontar el componente
    setTimeout(() => setIsRendered(false), 400);
  };

  if (!isRendered || !currentFlyerUrl) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-400 ease-in-out ${
        isVisible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative max-w-[90vw] max-h-[90vh] bg-transparent rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-110 hover:bg-gray-100 transition-all z-10"
        >
          <X size={20} className="font-bold" />
        </button>
        <img
          src={currentFlyerUrl}
          alt="Flyer Semanal"
          className="w-full h-auto max-w-[500px] max-h-[85vh] object-contain rounded-2xl block"
        />
      </div>
    </div>
  );
}
