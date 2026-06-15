"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { usePlayerStore } from "@/store/usePlayerStore";

interface EpisodeCardProps {
  id: string;
  title: string;
  guest: string;
  date: string;
  category?: string;
  image: string;
  spotify_url?: string;
  youtube_url?: string;
  index?: number;
}

export function EpisodeCard({ id, title, guest, date, category, image, spotify_url, youtube_url, index = 0 }: EpisodeCardProps) {
  const playEpisode = usePlayerStore((s) => s.playEpisode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
        <button
          onClick={() => playEpisode({ id, title, guest, image, spotify_url, youtube_url })}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100 hover:bg-primary"
        >
          <Play fill="currentColor" size={24} className="ml-1" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          {category && <span className="text-xs text-secondary font-bold uppercase tracking-wider">{category}</span>}
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">Invitado: <span className="text-gray-200">{guest}</span></p>
      </div>
    </motion.div>
  );
}
