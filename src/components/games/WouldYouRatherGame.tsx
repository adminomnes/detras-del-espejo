"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { PREGUNTAS_WYR } from "@/data/games";
import type { WYRQuestion } from "@/types/games";

type Answer = "A" | "B";

interface AnsweredQuestion {
  question: WYRQuestion;
  selected: Answer;
}

function getPercentage(a: number, b: number): number {
  const total = a + b;
  if (total === 0) return 50;
  return (a / total) * 100;
}

const TOTAL = PREGUNTAS_WYR.length;

export default function WouldYouRatherGame() {
  const [questions, setQuestions] = useState<WYRQuestion[]>(() =>
    PREGUNTAS_WYR.map((q) => ({ ...q })),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);

  const currentQuestion = questions[currentIndex] ?? null;
  const percA = currentQuestion
    ? getPercentage(currentQuestion.votesA, currentQuestion.votesB)
    : 50;
  const percB = 100 - percA;

  const handleSelect = useCallback(
    (answer: Answer) => {
      if (showResult || !currentQuestion) return;

      setSelectedAnswer(answer);

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === currentQuestion.id
            ? {
                ...q,
                votesA: q.votesA + (answer === "A" ? 1 : 0),
                votesB: q.votesB + (answer === "B" ? 1 : 0),
              }
            : q,
        ),
      );

      setAnswers((prev) => [
        ...prev,
        { question: currentQuestion, selected: answer },
      ]);

      setShowResult(true);
    },
    [showResult, currentQuestion],
  );

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= TOTAL) {
      setGameOver(true);
      return;
    }
    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setQuestions(PREGUNTAS_WYR.map((q) => ({ ...q })));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setAnswers([]);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-black to-[#0a0015] flex flex-col items-center py-16 px-4 md:px-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {gameOver ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="flex flex-col items-center w-full max-w-2xl gap-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-[#b300ff] via-[#ff00cc] to-[#d4af37] bg-clip-text text-transparent tracking-tight text-center"
            >
              Estadísticas de la Partida
            </motion.h1>

            <div className="w-full space-y-4">
              {answers.map(({ question, selected }, idx) => {
                const pctA = getPercentage(question.votesA, question.votesB);
                const chosenA = selected === "A";
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 md:p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono text-white/30 tabular-nums">
                        #{idx + 1}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
                    </div>
                    <div className="space-y-2">
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                          chosenA
                            ? "border-[#b300ff]/40 bg-[#b300ff]/10"
                            : "border-transparent bg-white/[0.02]",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            chosenA ? "bg-[#b300ff]" : "bg-white/20",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            chosenA ? "text-white font-medium" : "text-white/40",
                          )}
                        >
                          {question.optionA}
                        </span>
                        {chosenA && (
                          <span className="ml-auto text-[#b300ff] text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                          !chosenA
                            ? "border-[#ff00cc]/40 bg-[#ff00cc]/10"
                            : "border-transparent bg-white/[0.02]",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            !chosenA ? "bg-[#ff00cc]" : "bg-white/20",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            !chosenA ? "text-white font-medium" : "text-white/40",
                          )}
                        >
                          {question.optionB}
                        </span>
                        {!chosenA && (
                          <span className="ml-auto text-[#ff00cc] text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden flex">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pctA}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.08 + 0.2 }}
                        className="h-full bg-gradient-to-r from-[#b300ff] to-[#b300ff]/60 rounded-l-full"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - pctA}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.08 + 0.2 }}
                        className="h-full bg-gradient-to-l from-[#ff00cc] to-[#ff00cc]/60 rounded-r-full"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRestart}
              className="px-10 py-3.5 rounded-full font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-[#b300ff] to-[#ff00cc] text-white shadow-lg shadow-[#b300ff]/30 hover:shadow-[0_0_30px_-4px_rgba(179,0,255,0.6)] transition-shadow"
            >
              Jugar de nuevo
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="game-play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl gap-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#b300ff] via-[#ff00cc] to-[#d4af37] bg-clip-text text-transparent tracking-tight text-center"
            >
              ⚡ QUÉ PREFIERES
            </motion.h1>

            <div className="w-full max-w-lg flex items-center gap-4">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#b300ff] to-[#ff00cc]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentIndex / TOTAL) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-white/40 text-sm font-mono tabular-nums shrink-0">
                Pregunta {currentIndex + 1}/{TOTAL}
              </span>
            </div>

            <motion.h2
              key={currentQuestion?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl md:text-3xl font-light text-white/80 text-center"
            >
              ¿Qué prefieres?
            </motion.h2>

            <div className="relative flex flex-col md:flex-row gap-4 w-full items-stretch">
              <motion.button
                key={`${currentQuestion?.id}-a`}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 200 }}
                whileHover={!showResult ? { scale: 1.03 } : undefined}
                whileTap={!showResult ? { scale: 0.97 } : undefined}
                onClick={() => handleSelect("A")}
                disabled={showResult}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center p-6 md:p-8 min-h-[200px] md:min-h-[280px] rounded-3xl border",
                  "bg-gradient-to-br from-[#b300ff]/20 to-[#b300ff]/5",
                  showResult
                    ? selectedAnswer === "A"
                      ? "border-[#b300ff] shadow-[0_0_40px_-8px_rgba(179,0,255,0.5)]"
                      : "border-white/[0.06] opacity-50"
                    : "border-white/[0.08] hover:border-[#b300ff]/50 cursor-pointer",
                  "transition-all duration-300",
                )}
              >
                {showResult && selectedAnswer === "A" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#b300ff] flex items-center justify-center text-white text-sm font-bold shadow-lg z-10"
                  >
                    ✓
                  </motion.div>
                )}
                <span className="text-sm font-bold uppercase tracking-widest text-[#b300ff] mb-3">
                  Opción A
                </span>
                <span className="text-white text-lg md:text-xl text-center font-medium leading-relaxed">
                  {currentQuestion?.optionA}
                </span>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-5 w-full space-y-1.5"
                  >
                    <div className="flex justify-between text-xs text-white/60 tabular-nums">
                      <span>{Math.round(percA)}%</span>
                      <span>{currentQuestion.votesA} votos</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percA}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#b300ff] to-[#b300ff]/60"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.button>

              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center"
                  >
                    <span className="text-sm font-extrabold bg-gradient-to-r from-[#b300ff] to-[#ff00cc] bg-clip-text text-transparent tracking-wide">
                      {Math.round(percA)}% vs {Math.round(percB)}%
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-[10px] text-white/30 font-mono">
                        {currentQuestion.votesA + currentQuestion.votesB} votos
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                key={`${currentQuestion?.id}-b`}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 200 }}
                whileHover={!showResult ? { scale: 1.03 } : undefined}
                whileTap={!showResult ? { scale: 0.97 } : undefined}
                onClick={() => handleSelect("B")}
                disabled={showResult}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center p-6 md:p-8 min-h-[200px] md:min-h-[280px] rounded-3xl border",
                  "bg-gradient-to-br from-[#ff00cc]/20 to-[#ff00cc]/5",
                  showResult
                    ? selectedAnswer === "B"
                      ? "border-[#ff00cc] shadow-[0_0_40px_-8px_rgba(255,0,204,0.5)]"
                      : "border-white/[0.06] opacity-50"
                    : "border-white/[0.08] hover:border-[#ff00cc]/50 cursor-pointer",
                  "transition-all duration-300",
                )}
              >
                {showResult && selectedAnswer === "B" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#ff00cc] flex items-center justify-center text-white text-sm font-bold shadow-lg z-10"
                  >
                    ✓
                  </motion.div>
                )}
                <span className="text-sm font-bold uppercase tracking-widest text-[#ff00cc] mb-3">
                  Opción B
                </span>
                <span className="text-white text-lg md:text-xl text-center font-medium leading-relaxed">
                  {currentQuestion?.optionB}
                </span>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-5 w-full space-y-1.5"
                  >
                    <div className="flex justify-between text-xs text-white/60 tabular-nums">
                      <span>{Math.round(percB)}%</span>
                      <span>{currentQuestion.votesB} votos</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percB}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#ff00cc] to-[#ff00cc]/60"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Mobile vs label */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex md:hidden flex-col items-center -mt-4 -mb-2"
                >
                  <span className="text-sm font-extrabold bg-gradient-to-r from-[#b300ff] to-[#ff00cc] bg-clip-text text-transparent tracking-wide">
                    {Math.round(percA)}% vs {Math.round(percB)}%
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {currentQuestion.votesA + currentQuestion.votesB} votos
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showResult && (
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
