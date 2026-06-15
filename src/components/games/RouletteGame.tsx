"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { CATEGORIAS_RULETA } from "@/data/games";
import type { RouletteCategory, RouletteResult } from "@/types/games";

const SEGMENT_COUNT = CATEGORIAS_RULETA.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

function buildWheelGradient(): string {
  return CATEGORIAS_RULETA.map((cat, i) => {
    const start = i * SEGMENT_ANGLE;
    const end = (i + 1) * SEGMENT_ANGLE;
    return `${cat.color} ${start}deg ${end}deg`;
  }).join(", ");
}

export default function RouletteGame() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [animateSpin, setAnimateSpin] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<RouletteCategory | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<RouletteResult[]>([]);

  const handleSpin = useCallback(() => {
    if (spinning) return;

    const catIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const category = CATEGORIAS_RULETA[catIndex];
    const qIndex = Math.floor(Math.random() * category.questions.length);
    const question = category.questions[qIndex];

    setSelectedCategory(category);
    setSelectedQuestion(question);

    const segmentCenter = catIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetAngle = (360 - segmentCenter + 360) % 360;
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const currentBase = rotation % 360;
    const extra = (targetAngle - currentBase + 360) % 360;
    const newRotation = rotation + fullSpins + extra;

    setRotation(newRotation);
    setAnimateSpin(true);
    setSpinning(true);
  }, [spinning, rotation]);

  const handleAnimationComplete = useCallback(() => {
    if (!animateSpin) return;
    setAnimateSpin(false);
    setSpinning(false);
    setShowResult(true);
  }, [animateSpin]);

  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    if (selectedCategory && selectedQuestion) {
      setHistory((prev) =>
        [
          {
            category: selectedCategory.label,
            emoji: selectedCategory.emoji,
            question: selectedQuestion,
            timestamp: Date.now(),
          },
          ...prev,
        ].slice(0, 10),
      );
    }
  }, [selectedCategory, selectedQuestion]);

  const wheelGradient = `conic-gradient(${buildWheelGradient()})`;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-black to-[#0a0015] flex flex-col items-center py-16 px-4 md:px-8 overflow-hidden">
      <div className="text-center mb-8 md:mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#b300ff] via-[#ff00cc] to-[#d4af37] bg-clip-text text-transparent tracking-tight"
        >
          🎡 RULETA DEL DESTINO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-white/40 text-base md:text-lg"
        >
          Gira y descubre qué pregunta te espera
        </motion.p>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        {/* Wheel section */}
        <div className="flex flex-col items-center w-full max-w-md mx-auto lg:mx-0">
          <div className="relative w-full aspect-square">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1">
              <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-[#d4af37]" />
              <div className="absolute -top-[2px] -left-[6px] w-3 h-[6px] bg-[#ff00cc] blur-[3px] rounded-full opacity-60" />
            </div>

            {/* Wheel container */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={
                animateSpin
                  ? { duration: 4, ease: [0.2, 0.8, 0.2, 1] }
                  : { duration: 0 }
              }
              onAnimationComplete={handleAnimationComplete}
              className="w-full h-full rounded-full relative select-none"
              style={{
                backgroundImage: wheelGradient,
                boxShadow:
                  "0 0 40px rgba(212, 175, 55, 0.25), 0 0 80px rgba(179, 0, 255, 0.15), inset 0 0 30px rgba(0,0,0,0.4)",
              }}
            >
              {/* Gold border */}
              <div className="absolute inset-0 rounded-full border-[3px] border-[#d4af37]/60 pointer-events-none" />
              <div className="absolute inset-0 rounded-full border-[6px] border-transparent pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(212,175,55,0.15), transparent, rgba(212,175,55,0.08))",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              {/* Segment labels */}
              {CATEGORIAS_RULETA.map((cat, i) => {
                const midAngle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
                return (
                  <div
                    key={cat.label}
                    className="absolute inset-0 pointer-events-none"
                    style={{ transform: `rotate(${midAngle}deg)` }}
                  >
                    <span className="absolute left-1/2 -translate-x-1/2 text-white text-[10px] md:text-xs font-bold whitespace-nowrap drop-shadow-lg leading-tight text-center"
                      style={{
                        top: "11%",
                        textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {cat.emoji}
                      <br />
                      {cat.label}
                    </span>
                  </div>
                );
              })}

              {/* Center hub */}
              <div className="absolute inset-0 m-auto w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-[#1a0025] to-black border-2 border-[#d4af37]/50 flex items-center justify-center shadow-[0_0_20px_rgba(179,0,255,0.3)]">
                <span className="text-lg md:text-xl">🎡</span>
              </div>
            </motion.div>
          </div>

          {/* Spin button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSpin}
            disabled={spinning}
            className={cn(
              "mt-8 px-10 py-3.5 rounded-full font-bold uppercase tracking-wider text-sm",
              "bg-gradient-to-r from-[#b300ff] to-[#ff00cc] text-white",
              "shadow-lg shadow-[#b300ff]/30",
              "transition-all duration-300",
              spinning
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-[0_0_30px_-4px_rgba(179,0,255,0.6)]",
            )}
          >
            {spinning ? "GIRANDO..." : "🎡 GIRAR"}
          </motion.button>
        </div>

        {/* History panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full lg:w-72 shrink-0"
        >
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 md:p-5">
            <h3 className="text-white/60 text-sm font-bold tracking-wide mb-4">
              📜 Historial
            </h3>
            {history.length === 0 ? (
              <p className="text-white/20 text-xs italic">
                Ningún giro todavía...
              </p>
            ) : (
              <ul className="space-y-2.5">
                {history.map((entry, idx) => (
                  <li
                    key={`${entry.timestamp}-${idx}`}
                    className="flex items-start gap-2.5 text-white/60"
                  >
                    <span className="text-base shrink-0 mt-0.5">
                      {entry.emoji}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block leading-tight">
                        {entry.category}
                      </span>
                      <span className="text-white/50 text-xs leading-tight block mt-0.5 truncate">
                        {entry.question.length > 50
                          ? entry.question.slice(0, 50) + "..."
                          : entry.question}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      {/* Result modal */}
      <AnimatePresence>
        {showResult && selectedCategory && (
          <motion.div
            key="roulette-result-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleCloseResult}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
              key="roulette-result-content"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{
                type: "spring",
                damping: 26,
                stiffness: 280,
                mass: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#0f0018] to-black border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#b300ff]/15"
            >
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#b300ff] to-transparent opacity-50" />

              {/* Category badge */}
              <div className="flex items-center justify-center mb-6">
                <span
                  className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-bold text-white shadow-lg tracking-wide"
                  style={{
                    background: `linear-gradient(135deg, ${selectedCategory.color}88, ${selectedCategory.color}44)`,
                    border: `1px solid ${selectedCategory.color}66`,
                  }}
                >
                  <span>{selectedCategory.emoji}</span>
                  <span>{selectedCategory.label}</span>
                </span>
              </div>

              {/* Question */}
              <div className="relative">
                <div className="flex justify-center mb-4">
                  <span className="text-5xl">{selectedCategory.emoji}</span>
                </div>
                <p className="text-white text-xl md:text-2xl leading-relaxed text-center font-light">
                  {selectedQuestion}
                </p>
              </div>

              {/* Next button */}
              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCloseResult}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#b300ff] to-[#ff00cc] text-white font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#b300ff]/30"
                >
                  Siguiente
                </motion.button>
              </div>

              {/* Decorative bottom gradient line */}
              <div className="absolute bottom-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff00cc] to-transparent opacity-40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </div>
  );
}
