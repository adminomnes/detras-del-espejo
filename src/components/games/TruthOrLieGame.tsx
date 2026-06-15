"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { PREGUNTAS_TRUTH } from "@/data/games";
import type { TruthQuestion } from "@/types/games";

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRating(score: number): { text: string; emoji: string } {
  if (score <= 5) return { text: "¡Sigue intentando!", emoji: "🎯" };
  if (score <= 10) return { text: "¡Buen trabajo!", emoji: "🌟" };
  if (score <= 13) return { text: "¡Impresionante!", emoji: "👏" };
  return { text: "¡ERES UN GENIO!", emoji: "🏆" };
}

function getScoreColor(percentage: number): string {
  if (percentage < 40) return "#ef4444";
  if (percentage < 70) return "#eab308";
  return "#22c55e";
}

const TOTAL_QUESTIONS = PREGUNTAS_TRUTH.length;

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export default function TruthOrLieGame() {
  const [questions, setQuestions] = useState<TruthQuestion[]>(() =>
    shuffle(PREGUNTAS_TRUTH),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiIdRef = useRef(0);

  const currentQuestion = questions[currentIndex] ?? null;
  const progress = currentIndex / TOTAL_QUESTIONS;
  const percentage = TOTAL_QUESTIONS > 0 ? (score / TOTAL_QUESTIONS) * 100 : 0;
  const scoreColor = getScoreColor(percentage);
  const isCorrect = selectedAnswer === currentQuestion?.truth;

  const spawnConfetti = useCallback(() => {
    const particles: ConfettiParticle[] = [];
    const colors = ["#22c55e", "#d4af37", "#b300ff", "#ff00cc", "#38bdf8"];
    for (let i = 0; i < 18; i++) {
      particles.push({
        id: confettiIdRef.current++,
        x: 40 + Math.random() * 20,
        y: 30 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 3,
      });
    }
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 1500);
  }, []);

  const handleAnswer = useCallback(
    (answer: boolean) => {
      if (answered || !currentQuestion) return;

      setAnswered(true);
      setSelectedAnswer(answer);

      if (answer === currentQuestion.truth) {
        setScore((s) => s + 1);
        spawnConfetti();
      }

      nextTimerRef.current = setTimeout(() => {
        handleNext();
      }, 2000);
    },
    [answered, currentQuestion, spawnConfetti],
  );

  const handleNext = useCallback(() => {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= TOTAL_QUESTIONS) {
      setGameOver(true);
      return;
    }

    setCurrentIndex(nextIndex);
    setAnswered(false);
    setSelectedAnswer(null);
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setQuestions(shuffle(PREGUNTAS_TRUTH));
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameOver(false);
    setConfetti([]);
  }, []);

  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-black to-[#0a0015] flex flex-col items-center py-16 px-4 md:px-8 overflow-hidden">
      {/* Game Over */}
      <AnimatePresence mode="wait">
        {gameOver ? (
          <motion.div
            key="game-over"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="flex flex-col items-center justify-center gap-8 w-full max-w-md"
          >
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl block mb-4"
              >
                {getRating(score).emoji}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#b300ff] via-[#ff00cc] to-[#d4af37] bg-clip-text text-transparent"
              >
                {getRating(score).text}
              </motion.h2>
            </div>

            {/* Final score circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", damping: 16, stiffness: 180 }}
              className="relative"
            >
              <svg width="180" height="180" className="transform -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r="78"
                  fill="none"
                  stroke="white/5"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="90"
                  cy="90"
                  r="78"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 78}
                  initial={{ strokeDashoffset: 2 * Math.PI * 78 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 78 * (1 - percentage / 100),
                  }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-extrabold text-white">
                  {score}
                  <span className="text-2xl text-white/40">/{TOTAL_QUESTIONS}</span>
                </span>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRestart}
              className="px-10 py-3.5 rounded-full font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-[#b300ff] to-[#ff00cc] text-white shadow-lg shadow-[#b300ff]/30 hover:shadow-[0_0_30px_-4px_rgba(179,0,255,0.6)] transition-shadow"
            >
              Jugar de nuevo
            </motion.button>

            {/* Game over particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={`go-particle-${i}`}
                  initial={{
                    opacity: 0,
                    x: 50 + Math.random() * 200,
                    y: 200 + Math.random() * 100,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * -600 - 100,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: 1 + Math.random() * 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: [
                      "#d4af37",
                      "#b300ff",
                      "#ff00cc",
                      "#22c55e",
                      "#38bdf8",
                    ][i % 5],
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* Game play area */
          <motion.div
            key="game-play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-lg gap-8"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#b300ff] via-[#ff00cc] to-[#d4af37] bg-clip-text text-transparent tracking-tight text-center"
            >
              🔍 VERDAD O MENTIRA
            </motion.h1>

            {/* Progress bar */}
            <div className="w-full flex items-center gap-4">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#b300ff] to-[#ff00cc]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-white/40 text-sm font-mono tabular-nums shrink-0">
                Pregunta {currentIndex + 1}/{TOTAL_QUESTIONS}
              </span>
            </div>

            {/* Question card */}
            <motion.div
              key={currentQuestion?.id ?? "empty"}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              className={cn(
                "relative w-full rounded-3xl p-8 md:p-10 border",
                "bg-white/[0.03] backdrop-blur-xl",
                answered && isCorrect
                  ? "border-green-500/40 shadow-[0_0_40px_-8px_rgba(34,197,94,0.25)]"
                  : answered && !isCorrect
                    ? "border-red-500/40 shadow-[0_0_40px_-8px_rgba(239,68,68,0.25)]"
                    : "border-white/[0.06]",
              )}
            >
              {/* Question number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#b300ff] to-[#ff00cc] text-white text-xs font-bold tracking-wider shadow-lg">
                PREGUNTA {currentIndex + 1}
              </div>

              {/* Statement */}
              <p className="text-white text-xl md:text-2xl leading-relaxed text-center font-light mt-2">
                {currentQuestion?.statement}
              </p>

              {/* Confetti particles overlay */}
              <AnimatePresence>
                {confetti.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {confetti.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{
                          opacity: 1,
                          x: "50%",
                          y: "50%",
                          scale: 0,
                        }}
                        animate={{
                          opacity: [1, 0.8, 0],
                          x: `${p.x}%`,
                          y: `${p.y}%`,
                          scale: [0, 1.2, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full"
                        style={{
                          width: p.size,
                          height: p.size,
                          backgroundColor: p.color,
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Explanation */}
              <AnimatePresence>
                {answered && currentQuestion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <span className="text-green-400 text-xl">✓</span>
                        ) : (
                          <span className="text-red-400 text-xl">✗</span>
                        )}
                        <span
                          className={cn(
                            "text-sm font-bold uppercase tracking-wider",
                            isCorrect ? "text-green-400" : "text-red-400",
                          )}
                        >
                          {isCorrect ? "¡Correcto!" : "Incorrecto"}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Answer buttons */}
            <div className="flex gap-4 w-full">
              <motion.button
                whileHover={!answered ? { scale: 1.04 } : undefined}
                whileTap={!answered ? { scale: 0.96 } : undefined}
                animate={
                  !answered
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(34,197,94,0)",
                          "0 0 20px rgba(34,197,94,0.3)",
                          "0 0 0px rgba(34,197,94,0)",
                        ],
                      }
                    : selectedAnswer === true && isCorrect
                      ? { boxShadow: "0 0 40px rgba(34,197,94,0.5)" }
                      : selectedAnswer === true && !isCorrect
                        ? {
                            x: [0, -8, 8, -6, 6, -3, 3, 0],
                            boxShadow: "0 0 40px rgba(239,68,68,0.5)",
                          }
                        : { boxShadow: "0 0 0px rgba(34,197,94,0)" }
                }
                transition={
                  !answered
                    ? {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : selectedAnswer === true && !isCorrect
                      ? { duration: 0.5 }
                      : { duration: 0.3 }
                }
                onClick={() => handleAnswer(true)}
                disabled={answered}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-extrabold text-lg tracking-widest",
                  "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white",
                  "shadow-lg shadow-emerald-500/20",
                  "transition-opacity",
                  answered && !(selectedAnswer === true)
                    ? "opacity-30"
                    : answered && selectedAnswer === true
                      ? "opacity-100"
                      : "opacity-90 hover:opacity-100",
                )}
              >
                VERDAD
              </motion.button>

              <motion.button
                whileHover={!answered ? { scale: 1.04 } : undefined}
                whileTap={!answered ? { scale: 0.96 } : undefined}
                animate={
                  !answered
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(239,68,68,0)",
                          "0 0 20px rgba(239,68,68,0.3)",
                          "0 0 0px rgba(239,68,68,0)",
                        ],
                      }
                    : selectedAnswer === false && isCorrect
                      ? { boxShadow: "0 0 40px rgba(34,197,94,0.5)" }
                      : selectedAnswer === false && !isCorrect
                        ? {
                            x: [0, -8, 8, -6, 6, -3, 3, 0],
                            boxShadow: "0 0 40px rgba(239,68,68,0.5)",
                          }
                        : { boxShadow: "0 0 0px rgba(34,197,94,0)" }
                }
                transition={
                  !answered
                    ? {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : selectedAnswer === false && !isCorrect
                      ? { duration: 0.5 }
                      : { duration: 0.3 }
                }
                onClick={() => handleAnswer(false)}
                disabled={answered}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-extrabold text-lg tracking-widest",
                  "bg-gradient-to-br from-rose-500 to-rose-700 text-white",
                  "shadow-lg shadow-rose-500/20",
                  "transition-opacity",
                  answered && !(selectedAnswer === false)
                    ? "opacity-30"
                    : answered && selectedAnswer === false
                      ? "opacity-100"
                      : "opacity-90 hover:opacity-100",
                )}
              >
                MENTIRA
              </motion.button>
            </div>

            {/* Score display */}
            <div className="flex items-center gap-3 mt-2">
              <svg width="48" height="48" className="transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="white/5"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 20}
                  initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 20 * (1 - percentage / 100),
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
              <span className="text-white/80 text-lg font-mono tabular-nums">
                <span className="font-bold text-white">{score}</span>
                <span className="text-white/40">/{TOTAL_QUESTIONS}</span>
              </span>
            </div>

            {/* Siguiente button */}
            <AnimatePresence>
              {answered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#b300ff] to-[#ff00cc] text-white font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#b300ff]/30"
                >
                  Siguiente
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </div>
  );
}
