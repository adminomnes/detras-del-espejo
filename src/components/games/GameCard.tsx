"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  onClick: () => void;
  index: number;
}

export function GameCard({ title, description, icon, gradient, onClick, index }: GameCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-4 p-8 rounded-2xl",
        "border border-white/5",
        "hover:border-accent/50",
        "bg-black/40 backdrop-blur-xl",
        "shadow-xl hover:shadow-[0_0_30px_-5px_rgba(179,0,255,0.3)]",
        "transition-shadow duration-300",
        "cursor-pointer text-left w-full",
        "overflow-hidden"
      )}
    >
      <div className={cn("absolute inset-0 opacity-10 rounded-2xl", gradient)} />
      <span className="relative text-5xl">{icon}</span>
      <div className="relative flex flex-col gap-1">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </motion.button>
  );
}
