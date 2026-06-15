export type FragmentType = "pregunta" | "confesion" | "reto" | "historia" | "recuerdo";

export type MirrorFragment = {
  id: number;
  type: FragmentType;
  content: string;
  used: boolean;
};

export type RouletteCategory = {
  label: string;
  emoji: string;
  color: string;
  questions: string[];
};

export type RouletteResult = {
  category: string;
  emoji: string;
  question: string;
  timestamp: number;
};

export type TruthQuestion = {
  id: number;
  statement: string;
  truth: boolean;
  explanation: string;
};

export type MysteryBoxType = "premio" | "reto" | "confesion" | "pregunta" | "karaoke" | "bonus";

export type MysteryBox = {
  id: number;
  type: MysteryBoxType;
  content: string;
};

export type WYRQuestion = {
  id: number;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
};

export type GameState = {
  currentGame: GameId | null;
  scores: Record<string, number>;
};

export type GameId = "mirror" | "roulette" | "truth" | "mystery-box" | "would-you-rather";

export type GameConfig = {
  id: GameId;
  title: string;
  description: string;
  icon: string;
  color: string;
};
