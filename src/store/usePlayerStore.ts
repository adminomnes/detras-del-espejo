import { create } from "zustand";

export interface Episode {
  id: string;
  title: string;
  guest: string;
  image: string;
  spotify_url?: string;
  youtube_url?: string;
}

interface PlayerState {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  isOpen: boolean;
  activePlatform: "spotify" | "youtube";
  volume: number;
  playEpisode: (episode: Episode, platform?: "spotify" | "youtube") => void;
  togglePlay: () => void;
  closePlayer: () => void;
  setPlatform: (platform: "spotify" | "youtube") => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisode: null,
  isPlaying: false,
  isOpen: false,
  activePlatform: "spotify",
  volume: 80,

  playEpisode: (episode, platform = "spotify") =>
    set({ currentEpisode: episode, isPlaying: true, isOpen: true, activePlatform: platform }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  closePlayer: () => set({ isOpen: false, isPlaying: false }),

  setPlatform: (platform) => set({ activePlatform: platform }),

  setVolume: (volume) => set({ volume }),
}));
