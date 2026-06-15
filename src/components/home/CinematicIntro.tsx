"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [cracks, setCracks] = useState(0);

  useEffect(() => {
    // Step 0: Black screen.
    // Step 1: Mirror appears.
    const t1 = setTimeout(() => setStep(1), 1000);
    return () => clearTimeout(t1);
  }, []);

  const handleMouseMove = () => {
    if (step < 1 || step >= 4) return;
    
    // Simulate cracks increasing when moving mouse
    if (Math.random() > 0.92) {
      setCracks(c => {
        const newCracks = c + 1;
        if (newCracks === 5) setStep(2); // Show text
        if (newCracks === 15) setStep(3); // Ready to shatter
        return newCracks;
      });
    }
  };

  const handleShatter = () => {
    setStep(4); // Shatter animation
    setTimeout(() => setStep(5), 1500); // Show logo and button
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {step < 4 && (
          <motion.div
            key="mirror"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: step >= 1 ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)", transition: { duration: 1.5 } }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="relative w-64 h-96 md:w-80 md:h-[30rem] rounded-t-full border-[8px] border-accent/60 bg-gray-900 shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden cursor-pointer"
            onClick={step >= 2 ? handleShatter : undefined}
          >
            {/* Female silhouette placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-overlay" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-48 bg-black/80 blur-md rounded-t-full" />
            
            {/* Cracks Overlay */}
            {cracks > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-accent/80 drop-shadow-[0_0_8px_rgba(212,175,55,1)]" fill="none" strokeWidth="1.5">
                {Array.from({ length: cracks }).map((_, i) => {
                  const r1 = ((i * 13 + 7) % 150) - 75;
                  const r2 = ((i * 17 + 11) % 150) - 75;
                  const r3 = ((i * 19 + 3) % 200) - 100;
                  const r4 = ((i * 23 + 5) % 300) - 150;
                  return (
                    <path
                      key={i}
                      d={`M${160 + (i * 10 % 50)},${240} Q${160 + r1},${240 + r2} ${160 + r3},${240 + r4}`}
                      strokeDasharray="1000"
                      strokeDashoffset="0"
                    />
                  );
                })}
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 2 && step < 4 && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute bottom-20 text-center px-4"
          >
            <p className="font-outfit text-xl md:text-2xl font-light tracking-wider text-white drop-shadow-md">
              &ldquo;Lo que ves es solo una parte de la historia...&rdquo;
            </p>
            {step === 3 && (
              <p className="mt-4 text-xs text-accent animate-pulse uppercase tracking-[0.3em]">
                Haz clic en el espejo para revelar la verdad
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 5 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10"
          >
            <h1 className="font-outfit text-5xl md:text-7xl font-light tracking-widest text-white uppercase text-center mb-12 drop-shadow-[0_0_20px_rgba(179,0,255,0.6)]">
              Detrás del <span className="text-accent font-semibold">Espejo</span>
            </h1>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,0,204,0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium tracking-wider border border-white/20 uppercase text-sm shadow-lg shadow-primary/30"
            >
              Entrar al Podcast
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
