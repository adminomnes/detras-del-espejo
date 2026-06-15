"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { usePlayerStore } from "@/store/usePlayerStore";

interface FeaturedEpisode {
  id: string;
  title: string;
  guest: string;
  date: string;
  image: string;
  spotify_url?: string;
  youtube_url?: string;
}

interface FeaturedEpisodesProps {
  episodes: FeaturedEpisode[];
}

export function FeaturedEpisodes({ episodes }: FeaturedEpisodesProps) {
  const playEpisode = usePlayerStore((s) => s.playEpisode);

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4 mb-10">
        <h3 className="text-2xl font-outfit uppercase tracking-widest text-accent mb-2">Destacados</h3>
        <div className="h-px w-24 bg-gradient-to-r from-accent to-transparent" />
      </div>

      <div className="w-full overflow-x-auto pb-10 [&::-webkit-scrollbar]:hidden pl-4 md:pl-10">
        <div className="flex gap-6 w-max pr-10">
          {episodes.map((ep, i) => (
            <motion.div
              key={ep.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative group w-64 md:w-80 aspect-[2/3] rounded-xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-800">
                <Image src={ep.image} alt={ep.guest} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/50 rounded-xl transition-colors duration-300" />
              <div className="absolute inset-0 shadow-[inset_0_0_0_0_rgba(179,0,255,0)] group-hover:shadow-[inset_0_0_20px_0_rgba(179,0,255,0.4)] transition-all duration-300 rounded-xl" />

              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-accent text-xs font-bold tracking-widest mb-2">{ep.date}</p>
                <h4 className="text-xl font-bold mb-1 line-clamp-2 leading-tight">{ep.title}</h4>
                <p className="text-sm text-gray-300 mb-4">{ep.guest}</p>

                <button
                  onClick={() => playEpisode({ id: ep.id, title: ep.title, guest: ep.guest, image: ep.image, spotify_url: ep.spotify_url, youtube_url: ep.youtube_url })}
                  className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary shadow-[0_0_15px_rgba(179,0,255,0.6)]"
                >
                  <Play fill="currentColor" size={20} className="ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
