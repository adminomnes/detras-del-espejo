"use client";

import { useState } from "react";
import { GamesLayout } from "@/components/games/GamesLayout";
import { GameCard } from "@/components/games/GameCard";
import MirrorGame from "@/components/games/MirrorGame";
import RouletteGame from "@/components/games/RouletteGame";
import TruthOrLieGame from "@/components/games/TruthOrLieGame";
import MysteryBoxGame from "@/components/games/MysteryBoxGame";
import WouldYouRatherGame from "@/components/games/WouldYouRatherGame";
import { GAME_CONFIGS } from "@/data/games";
import type { GameId } from "@/types/games";

const GAME_COMPONENTS: Record<GameId, React.FC> = {
  mirror: MirrorGame,
  roulette: RouletteGame,
  truth: TruthOrLieGame,
  "mystery-box": MysteryBoxGame,
  "would-you-rather": WouldYouRatherGame,
};

export default function JuegosPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  if (activeGame) {
    const GameComponent = GAME_COMPONENTS[activeGame];
    const config = GAME_CONFIGS.find((g) => g.id === activeGame);
    return (
      <GamesLayout title={config?.title ?? ""} onBack={() => setActiveGame(null)}>
        <GameComponent />
      </GamesLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d0018] to-[#0a000a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <div className="text-5xl mb-4">🪞</div>
          <h1 className="text-4xl md:text-6xl font-outfit uppercase tracking-widest text-white mb-4">
            Detrás del <span className="text-accent">Espejo</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">Juegos Interactivos</p>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            Elige un juego y prepárate para una experiencia única durante la transmisión
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {GAME_CONFIGS.map((game, i) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              icon={game.icon}
              gradient={game.color}
              index={i}
              onClick={() => setActiveGame(game.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
