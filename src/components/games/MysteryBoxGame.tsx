"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { MysteryBox } from "@/types/games";
import { CAJAS_MISTERIOS, MYSTERY_TYPE_CONFIG } from "@/data/games";

interface MysteryBoxState extends MysteryBox {
  opened: boolean;
}

function buildBoxGradient(index: number): string {
  const hues = [42, 38, 45, 35, 48, 40, 36, 43, 37, 46, 41, 39];
  const hue = hues[index % hues.length];
  return `linear-gradient(145deg, hsl(${hue}, 80%, 65%), hsl(${hue}, 70%, 45%), hsl(${hue}, 75%, 35%))`;
}

export default function MysteryBoxGame() {
  const [boxes, setBoxes] = useState<MysteryBoxState[]>(
    () => CAJAS_MISTERIOS.map((b) => ({ ...b, opened: false })),
  );
  const [selectedBox, setSelectedBox] = useState<MysteryBoxState | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [openingId, setOpeningId] = useState<number | null>(null);

  const remaining = boxes.filter((b) => !b.opened).length;

  const handleBoxClick = useCallback(
    (box: MysteryBoxState) => {
      if (box.opened || openingId !== null || showModal) return;

      setOpeningId(box.id);

      setTimeout(() => {
        const updated = { ...box, opened: true };
        setBoxes((prev) =>
          prev.map((b) => (b.id === box.id ? updated : b)),
        );
        setSelectedBox(updated);
        setShowModal(true);
        setOpeningId(null);
      }, 600);
    },
    [openingId, showModal],
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setTimeout(() => setSelectedBox(null), 300);
  }, []);

  const handleReset = useCallback(() => {
    if (
      window.confirm(
        "¿Estás segura de que quieres reiniciar las cajas? Se cerrarán todas.",
      )
    ) {
      setBoxes(CAJAS_MISTERIOS.map((b) => ({ ...b, opened: false })));
      setSelectedBox(null);
      setShowModal(false);
      setOpeningId(null);
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
          🎁 CAJA MISTERIOSA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-white/40 text-base md:text-lg"
        >
          Elige una caja y descubre tu sorpresa
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
        <span>cajas</span>
      </motion.div>

      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {boxes.map((box, index) => {
          const isOpening = openingId === box.id;
          const isOpened = box.opened && openingId !== box.id;
          const isIdle = !isOpened && !isOpening;

          return (
            <motion.button
              key={box.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={
                isOpening
                  ? {
                      scale: [1, 1.08, 1],
                      y: [0, -20, 0],
                    }
                  : { opacity: 1, scale: 1, y: 0 }
              }
              transition={
                isOpening
                  ? { duration: 0.6, ease: "easeOut" }
                  : { delay: index * 0.04, duration: 0.4, ease: "easeOut" }
              }
              onClick={() => handleBoxClick(box)}
              disabled={!isIdle}
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b300ff]/50",
                isIdle && "cursor-pointer group",
                isOpened && "cursor-default",
              )}
            >
              {/* Closed box */}
              {isIdle && (
                <>
                  {/* Box body */}
                  <div
                    className="absolute inset-2 rounded-xl"
                    style={{
                      background: buildBoxGradient(index),
                      boxShadow:
                        "0 4px 15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2)",
                    }}
                  />

                  {/* Ribbon horizontal */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[14%] bg-gradient-to-b from-[#dc143c] via-[#ff1493] to-[#dc143c] shadow-[0_0_6px_rgba(220,20,60,0.5)]" />

                  {/* Ribbon vertical */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[14%] bg-gradient-to-r from-[#dc143c] via-[#ff1493] to-[#dc143c] shadow-[0_0_6px_rgba(220,20,60,0.5)]" />

                  {/* Bow center */}
                  <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-10">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff1493] to-[#8b0000] shadow-[0_0_8px_rgba(255,20,147,0.6)]" />
                    <div className="absolute -top-2 -left-3 w-4 h-3 rounded-t-full bg-gradient-to-b from-[#ff1493] to-[#dc143c] rotate-[-25deg]" />
                    <div className="absolute -top-2 -right-3 w-4 h-3 rounded-t-full bg-gradient-to-b from-[#ff1493] to-[#dc143c] rotate-[25deg]" />
                  </div>

                  {/* Lid */}
                  <div
                    className="absolute -top-1 left-1 right-1 h-[30%] rounded-t-xl"
                    style={{
                      background: `linear-gradient(180deg, hsl(${42 + index * 0.5}, 80%, 70%), hsl(${42 + index * 0.5}, 75%, 50%))`,
                      boxShadow:
                        "0 -2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }}
                  />

                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{ transform: "skewX(-20deg) translateX(-100%)" }}
                      animate={{ x: ["0%", "200%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.15,
                      }}
                    />
                  </div>

                  {/* Bobbing animation */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 2 + (index % 3) * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1,
                    }}
                  >
                    {/* Box number */}
                    <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white/40 z-10 select-none drop-shadow-md">
                      #{box.id}
                    </span>
                  </motion.div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_-4px_rgba(212,175,55,0.5)]" />

                  {/* Hover scale lift */}
                  <div className="absolute inset-0 rounded-2xl group-hover:scale-[1.04] transition-transform duration-200" />
                </>
              )}

              {/* Opening animation */}
              {isOpening && (
                <>
                  {/* Lid flying up */}
                  <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute -top-1 left-2 right-2 h-[30%] rounded-t-xl z-20"
                    style={{
                      background: `linear-gradient(180deg, hsl(42, 80%, 70%), hsl(42, 75%, 50%))`,
                      boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Golden sparkle burst */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#d4af37] blur-xl opacity-60" />
                    <div className="absolute w-14 h-14 rounded-full bg-[#ffd700] blur-md opacity-80" />
                  </motion.div>

                  {/* Sparkle particles */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i / 12) * 360;
                    const dist = 30 + Math.random() * 40;
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{
                          x: Math.cos((angle * Math.PI) / 180) * dist,
                          y: Math.sin((angle * Math.PI) / 180) * dist,
                          scale: [0, 1.2, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#d4af37]"
                      />
                    );
                  })}

                  {/* Type icon floating up */}
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.5 }}
                    animate={{ y: -10, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center z-20"
                  >
                    <span className="text-3xl">
                      {MYSTERY_TYPE_CONFIG[box.type]?.icon ?? "🎁"}
                    </span>
                  </motion.div>

                  {/* Dark box interior */}
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border border-white/[0.04]" />
                </>
              )}

              {/* Opened box */}
              {isOpened && (
                <>
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border border-white/[0.04]" />

                  {/* Open lid */}
                  <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -20, opacity: 0.3 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -top-1 left-2 right-2 h-[30%] rounded-t-xl"
                    style={{
                      background: `linear-gradient(180deg, hsl(42, 80%, 70%), hsl(42, 75%, 50%))`,
                      boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
                      opacity: 0.25,
                    }}
                  />

                  {/* Diminished icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 18, stiffness: 220 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-2xl opacity-60">
                        {MYSTERY_TYPE_CONFIG[box.type]?.icon ?? "🎁"}
                      </span>
                      <span className="text-white/15 text-[10px] uppercase tracking-wider">
                        Abierto
                      </span>
                    </motion.div>
                  </div>
                </>
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
        Reiniciar Cajas
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedBox && (
          <motion.div
            key="mystery-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
              key="mystery-modal-content"
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
              <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#b300ff] to-transparent opacity-50" />

              {/* Type badge */}
              {(() => {
                const cfg = MYSTERY_TYPE_CONFIG[selectedBox.type];
                return (
                  <div className="flex items-center justify-center mb-6">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r text-white shadow-lg tracking-wide",
                        cfg?.color ?? "from-gray-500 to-gray-700",
                      )}
                    >
                      <span>{cfg?.icon ?? "🎁"}</span>
                      <span>{cfg?.label ?? selectedBox.type}</span>
                    </span>
                  </div>
                );
              })()}

              {/* Content */}
              <div className="relative">
                <p className="text-white text-xl md:text-2xl leading-relaxed text-center font-light">
                  {selectedBox.content}
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

              <div className="absolute bottom-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff00cc] to-transparent opacity-40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </div>
  );
}
