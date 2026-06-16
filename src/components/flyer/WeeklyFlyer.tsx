"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Flyer {
  id: string;
  image_url: string;
  assigned_week: number;
  is_active: boolean;
  created_at: string;
}

export function WeeklyFlyer() {
  const [currentFlyerUrl, setCurrentFlyerUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("flyerShown")) return;

    fetch("/api/flyers")
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) return;
        const activeFlyers: Flyer[] = json.data.filter((f: Flyer) => f.is_active);
        if (activeFlyers.length === 0) return;

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff =
          now.getTime() -
          start.getTime() +
          (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        const currentWeek = Math.floor(diff / oneWeek) + 1;

        let selected = activeFlyers.find((f) => f.assigned_week === currentWeek);
        if (!selected) {
          selected = [...activeFlyers].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
        }

        if (selected) {
          setCurrentFlyerUrl(selected.image_url);
          setIsRendered(true);
          setTimeout(() => setIsVisible(true), 50);
        }
      });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("flyerShown", "true");
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
