"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { MirrorFragment } from "@/types/games";
import { FRAGMENTOS, FRAGMENT_TYPE_CONFIG } from "@/data/games";

export default function MirrorGame() {
  const [fragments, setFragments] = useState<MirrorFragment[]>(
    () => FRAGMENTOS.map((f) => ({ ...f })),
  );
  const [selectedFragment, setSelectedFragment] =
    useState<MirrorFragment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [shatteringId, setShatteringId] = useState<number | null>(null);

  const remaining = fragments.filter((f) => !f.used).length;

  const handleFragmentClick = useCallback(
    (fragment: MirrorFragment) => {
      if (fragment.used || shatteringId !== null || showModal) return;

      setShatteringId(fragment.id);

      setTimeout(() => {
        const updated = { ...fragment, used: true };
        setFragments((prev) =>
          prev.map((f) => (f.id === fragment.id ? updated : f)),
        );
        setSelectedFragment(updated);
        setShowModal(true);
        setShatteringId(null);
      }, 450);
    },
    [shatteringId, showModal],
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => setSelectedFragment(null), 300);
  }, []);

  const handleReset = useCallback(() => {
    if (
      window.confirm(
        "¿Estás segura de que quieres reiniciar la partida? Se perderá todo el progreso.",
      )
    ) {
      setFragments(FRAGMENTOS.map((f) => ({ ...f })));
      setSelectedFragment(null);
      setShowModal(false);
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-black via-black to-[#0a0015] flex flex-col items-center py-16 px-4 md:px-8 overflow-hidden">
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#b300ff] via-[#ff00cc] to-[#d4af37] bg-clip-text text-transparent tracking-tight"
        >
          🪞 ROMPE EL ESPEJO
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-white/40 text-base md:text-lg"
        >
          Toca un fragmento para romperlo y revelar su contenido
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 mb-10 text-white/40 text-sm tracking-wide"
      >
        <span>Quedan</span>
        <span className="text-[#d4af37] font-bold text-lg tabular-nums">
          {remaining}
        </span>
        <span>fragmentos</span>
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {fragments.map((fragment, index) => {
          const isShattering = shatteringId === fragment.id;
          const isUsed = fragment.used && shatteringId !== fragment.id;
          const isIdle = !isUsed && !isShattering;

          return (
            <motion.button
              key={fragment.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={
                isShattering
                  ? {
                      scale: [1, 1.05, 0.8, 0],
                      opacity: [1, 1, 0.5, 0],
                      rotate: [0, 3, -2, 0],
                    }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              transition={
                isShattering
                  ? { duration: 0.45, ease: "easeOut" }
                  : { delay: index * 0.04, duration: 0.4, ease: "easeOut" }
              }
              onClick={() => handleFragmentClick(fragment)}
              disabled={!isIdle}
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b300ff]/50",
                isIdle && "cursor-pointer group",
                isUsed && "cursor-default",
              )}
            >
              {/* Mirror base surface */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl transition-all duration-500",
                  isUsed &&
                    "bg-gradient-to-br from-gray-800/30 to-gray-900/30",
                  isIdle &&
                    "bg-gradient-to-br from-gray-700/50 via-gray-600/30 to-gray-800/50",
                )}
              />

              {/* Mirror frame edge */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl border transition-all duration-300",
                  isUsed
                    ? "border-white/[0.03]"
                    : "border-white/[0.08] group-hover:border-[#b300ff]/30",
                )}
              />

              {/* Reflective diagonal shine */}
              {isIdle && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.1] to-transparent"
                    style={{
                      transform: "skewX(-18deg) scale(1.5) translateX(-8%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#b300ff]/5 via-transparent to-[#ff00cc]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" />
                </div>
              )}

              {/* Hover glow */}
              {isIdle && (
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_-8px_rgba(179,0,255,0.3)]" />
              )}

              {/* Gold corner accents */}
              {isIdle && (
                <>
                  <div className="absolute top-0 right-0 w-6 h-6">
                    <div className="absolute top-0 right-0 w-3 h-[1.5px] bg-gradient-to-l from-[#d4af37]/40 to-transparent" />
                    <div className="absolute top-0 right-0 w-[1.5px] h-3 bg-gradient-to-b from-[#d4af37]/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-6 h-6">
                    <div className="absolute bottom-0 left-0 w-3 h-[1.5px] bg-gradient-to-r from-[#d4af37]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-[1.5px] h-3 bg-gradient-to-t from-[#d4af37]/40 to-transparent" />
                  </div>
                </>
              )}

              {/* Fragment number */}
              {isIdle && (
                <span className="absolute top-2.5 left-3 text-[10px] font-mono font-bold text-white/20 z-10 select-none">
                  #{fragment.id}
                </span>
              )}

              {/* Center content */}
              {isIdle && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.span
                    className="text-3xl md:text-4xl opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    🔮
                  </motion.span>
                </div>
              )}

              {/* Used overlay */}
              {isUsed && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-2xl">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-green-400 text-3xl md:text-4xl">
                      ✓
                    </span>
                    <span className="text-white/20 text-[10px] uppercase tracking-wider">
                      Abierto
                    </span>
                  </motion.div>
                </div>
              )}

              {/* Shatter effect */}
              {isShattering && (
                <div className="absolute inset-0 z-20 rounded-2xl">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="15"
                      y1="5"
                      x2="85"
                      y2="95"
                      stroke="white"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />
                    <line
                      x1="50"
                      y1="0"
                      x2="35"
                      y2="100"
                      stroke="white"
                      strokeWidth="0.3"
                      opacity="0.35"
                    />
                    <line
                      x1="90"
                      y1="25"
                      x2="10"
                      y2="75"
                      stroke="white"
                      strokeWidth="0.4"
                      opacity="0.4"
                    />
                    <line
                      x1="5"
                      y1="40"
                      x2="95"
                      y2="60"
                      stroke="white"
                      strokeWidth="0.3"
                      opacity="0.3"
                    />
                    <line
                      x1="30"
                      y1="0"
                      x2="65"
                      y2="100"
                      stroke="white"
                      strokeWidth="0.4"
                      opacity="0.35"
                    />
                    <line
                      x1="80"
                      y1="0"
                      x2="20"
                      y2="100"
                      stroke="white"
                      strokeWidth="0.3"
                      opacity="0.25"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    {[
                      { dx: -35, dy: -40, s: 6, c: "#b300ff" },
                      { dx: 40, dy: -25, s: 4, c: "#ff00cc" },
                      { dx: -25, dy: 35, s: 5, c: "#d4af37" },
                      { dx: 38, dy: 30, s: 3, c: "#ff00cc" },
                      { dx: -45, dy: 8, s: 4, c: "#b300ff" },
                      { dx: 25, dy: -38, s: 5, c: "#d4af37" },
                      { dx: 12, dy: 42, s: 3, c: "#ff00cc" },
                      { dx: -10, dy: -35, s: 4, c: "#b300ff" },
                    ].map((p, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{
                          x: p.dx,
                          y: p.dy,
                          scale: [1, 1.2, 0],
                          opacity: [1, 0.8, 0],
                        }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: i * 0.02,
                        }}
                        className="absolute rounded-full"
                        style={{
                          width: p.s,
                          height: p.s,
                          backgroundColor: p.c,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Reset button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleReset}
        className="mt-12 px-8 py-3 rounded-full border border-white/10 text-white/40 hover:text-white/80 hover:border-white/30 transition-all duration-300 text-xs uppercase tracking-[0.15em]"
      >
        Reiniciar Partida
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedFragment && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
              key="modal-content"
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

              {/* Type badge */}
              {(() => {
                const cfg = FRAGMENT_TYPE_CONFIG[selectedFragment.type];
                return (
                  <div className="flex items-center justify-center mb-6">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r text-white shadow-lg tracking-wide",
                        cfg.color,
                      )}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </span>
                  </div>
                );
              })()}

              {/* Fragment content */}
              <div className="relative">
                <p className="text-white text-xl md:text-2xl leading-relaxed text-center font-light">
                  {selectedFragment.content}
                </p>
              </div>

              {/* Close button */}
              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={closeModal}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#b300ff] to-[#ff00cc] text-white font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#b300ff]/30"
                >
                  Cerrar
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
