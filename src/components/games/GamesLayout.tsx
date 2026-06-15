"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import ParticlesBackground from "@/components/games/ParticlesBackground";

interface GamesLayoutProps {
  children: ReactNode;
  title: string;
  onBack?: () => void;
}

export function GamesLayout({ children, title, onBack }: GamesLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-black via-[#0a0014] to-black overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10 flex flex-col items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {onBack && (
          <button
            onClick={onBack}
            className="self-start mb-6 flex items-center gap-2 text-white/60 hover:text-[#b300ff] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-sans text-sm">Volver</span>
          </button>
        )}

        <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-bold text-[#b300ff] mb-8 text-center">
          {title}
        </h1>

        <div className="w-full max-w-6xl flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
