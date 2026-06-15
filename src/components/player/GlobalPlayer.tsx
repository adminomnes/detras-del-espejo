"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Share2 } from "lucide-react";
import Image from "next/image";

const SpotifyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 11.973c2.5-1.473 5.5-.973 7.5.527" /><path d="M9 15c1.5-1 4-1 5 .5" /><path d="M7 9c2-1 6-2 10 .5" /></svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6c-1.7 0-3.1-1.4-3.1-3.1V7.1z" /><path d="m10 15 5-3-5-3v6z" /></svg>
);

export function GlobalPlayer() {
  const { currentEpisode, isPlaying, isOpen, activePlatform, togglePlay, closePlayer, setPlatform } = usePlayerStore();

  if (!isOpen || !currentEpisode) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 w-full z-50 glass border-t border-primary/30 shadow-[0_-10px_30px_rgba(179,0,255,0.15)]"
      >
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">

          <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-900 border border-white/10">
            {currentEpisode.image && (
              <Image src={currentEpisode.image} alt={currentEpisode.title} fill className="object-cover" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate text-white">{currentEpisode.title}</h4>
            <p className="text-xs text-gray-400 truncate">{currentEpisode.guest}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlatform("spotify")}
              className={`p-2 rounded-full transition-colors ${activePlatform === "spotify" ? "bg-primary/20 text-[#1DB954]" : "text-gray-500 hover:text-white"}`}
            >
              <SpotifyIcon />
            </button>
            <button
              onClick={() => setPlatform("youtube")}
              className={`p-2 rounded-full transition-colors ${activePlatform === "youtube" ? "bg-primary/20 text-[#FF0000]" : "text-gray-500 hover:text-white"}`}
            >
              <YoutubeIcon />
            </button>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            {activePlatform === "spotify" && currentEpisode.spotify_url && (
              <span className="text-xs text-primary animate-pulse tracking-wider">Reproduciendo desde Spotify...</span>
            )}
            {activePlatform === "youtube" && currentEpisode.youtube_url && (
              <span className="text-xs text-secondary animate-pulse tracking-wider">Reproduciendo audio de YouTube...</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-accent transition-colors shadow-lg shadow-white/10">
              {isPlaying ? <Pause fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} className="ml-1" />}
            </button>
            <button className="p-2 text-gray-400 hover:text-white hidden sm:block">
              <Share2 size={18} />
            </button>
            <button onClick={closePlayer} className="p-2 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
