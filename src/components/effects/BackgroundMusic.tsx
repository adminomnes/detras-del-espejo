"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Volume2, VolumeX } from "lucide-react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { isOpen: isEpisodePlaying } = usePlayerStore();

  // Pausar música de fondo cuando el GlobalPlayer está activo
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isEpisodePlaying && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isEpisodePlaying, isPlaying]);

  // Intentar autoplay la primera vez que el usuario interactúa con la página
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        const audio = audioRef.current;
        if (audio && isReady) {
          audio.volume = 0.15; // Volumen muy suave de fondo
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("scroll", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [hasInteracted, isReady]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (isEpisodePlaying) return; // No reproducir si hay episodio activo
      audio.volume = 0.15;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/Detrás del espejo.mp3"
        loop
        preload="metadata"
        onCanPlayThrough={() => setIsReady(true)}
      />

      {/* Botón flotante discreto en esquina inferior izquierda */}
      <button
        onClick={toggleMusic}
        title={isPlaying ? "Silenciar música de fondo" : "Reproducir música de fondo"}
        className={`fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-md group ${
          isPlaying
            ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_20px_rgba(179,0,255,0.3)]"
            : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:bg-white/10"
        }`}
      >
        {/* Anillos animados cuando está reproduciendo */}
        {isPlaying && (
          <>
            <span className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
            <span className="absolute inset-[-6px] rounded-full border border-primary/15 animate-ping [animation-delay:0.5s]" />
          </>
        )}
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </>
  );
}
