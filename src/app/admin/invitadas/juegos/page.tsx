"use client";

import { useState } from "react";
import { GameCard } from "@/components/games/GameCard";
import MirrorGame from "@/components/games/MirrorGame";
import RouletteGame from "@/components/games/RouletteGame";
import TruthOrLieGame from "@/components/games/TruthOrLieGame";
import MysteryBoxGame from "@/components/games/MysteryBoxGame";
import WouldYouRatherGame from "@/components/games/WouldYouRatherGame";
import { GAME_CONFIGS, FRAGMENTOS, PREGUNTAS_TRUTH, PREGUNTAS_WYR, CATEGORIAS_RULETA, CAJAS_MISTERIOS } from "@/data/games";
import { Gamepad2, ExternalLink, RefreshCw, Eye } from "lucide-react";
import Link from "next/link";
import type { GameId } from "@/types/games";

const GAME_COMPONENTS: Record<string, React.FC> = {
  mirror: MirrorGame,
  roulette: RouletteGame,
  truth: TruthOrLieGame,
  "mystery-box": MysteryBoxGame,
  "would-you-rather": WouldYouRatherGame,
};

export default function AdminGamesPage() {
  const [activePreview, setActivePreview] = useState<GameId | null>(null);

  if (activePreview) {
    const PreviewComponent = GAME_COMPONENTS[activePreview];
    const config = GAME_CONFIGS.find((g) => g.id === activePreview);
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config?.icon}</span>
            <h2 className="text-xl font-bold text-white">{config?.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePreview(null)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Volver al panel
            </button>
            <Link
              href={`/juegos`}
              target="_blank"
              className="flex items-center gap-2 text-sm text-accent hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              Abrir en público
            </Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/50">
          <PreviewComponent />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Fragmentos del Espejo", value: FRAGMENTOS.length, icon: "🪞" },
    { label: "Categorías Ruleta", value: CATEGORIAS_RULETA.length, icon: "🎡" },
    { label: "Preguntas Verdad/Mentira", value: PREGUNTAS_TRUTH.length, icon: "🔍" },
    { label: "Cajas Misteriosas", value: CAJAS_MISTERIOS.length, icon: "🎁" },
    { label: "Preguntas Qué Prefieres", value: PREGUNTAS_WYR.length, icon: "⚡" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Gamepad2 size={28} className="text-accent" />
            Juegos Interactivos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona y previsualiza los juegos para las transmisiones en vivo
          </p>
        </div>
        <Link
          href="/juegos"
          target="_blank"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-black font-medium rounded-xl hover:bg-accent/90 transition-colors"
        >
          <Eye size={18} />
          Vista Pública
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-900/30 border border-white/5 rounded-xl p-4 text-center hover:border-white/10 transition-colors">
            <span className="text-2xl block mb-2">{stat.icon}</span>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white mb-4">Previsualizar Juegos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAME_CONFIGS.map((game, i) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            icon={game.icon}
            gradient={game.color}
            index={i}
            onClick={() => setActivePreview(game.id)}
          />
        ))}
      </div>

      <div className="mt-10 bg-gray-900/30 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <RefreshCw size={18} className="text-accent" />
            Gestión de Contenido
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Los datos de los juegos se cargan desde archivos JSON locales. En una versión futura, podrás editarlos desde este panel.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { file: "src/data/games.ts → FRAGMENTOS", count: FRAGMENTOS.length, label: "Rompe el Espejo" },
            { file: "src/data/games.ts → CATEGORIAS_RULETA", count: CATEGORIAS_RULETA.reduce((a, c) => a + c.questions.length, 0), label: "Ruleta del Destino (preguntas)" },
            { file: "src/data/games.ts → PREGUNTAS_TRUTH", count: PREGUNTAS_TRUTH.length, label: "Verdad o Mentira" },
            { file: "src/data/games.ts → CAJAS_MISTERIOS", count: CAJAS_MISTERIOS.length, label: "Caja Misteriosa" },
            { file: "src/data/games.ts → PREGUNTAS_WYR", count: PREGUNTAS_WYR.length, label: "Qué Prefieres" },
          ].map((item) => (
            <div key={item.file} className="bg-black/30 border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-gray-600 font-mono mt-0.5">{item.file}</p>
              </div>
              <span className="text-accent font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
