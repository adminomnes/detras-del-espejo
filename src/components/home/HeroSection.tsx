"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const GUESTS = [
  {
    id: 1, name: "Ana María",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
  },
  {
    id: 2, name: "Carlos Ruiz",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    id: 3, name: "Laura Gómez",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  },
  {
    id: 4, name: "Miguel Santos",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
  {
    id: 5, name: "Sofía Vega",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
  },
  {
    id: 6, name: "Diego Torres",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  },
];

const SPARKLE_COLORS = [
  "radial-gradient(circle, rgba(255,0,204,0.8), transparent)",
  "radial-gradient(circle, rgba(212,175,55,0.8), transparent)",
  "radial-gradient(circle, rgba(179,0,255,0.8), transparent)",
];

interface SparkleConfig {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
  shadow: string;
}

function Sparkle({ config }: { config: SparkleConfig }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: config.size,
        height: config.size,
        left: `${config.x}%`,
        top: `${config.y}%`,
        background: config.color,
        boxShadow: config.shadow,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1.5, 0],
      }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        delay: config.delay,
        ease: "easeInOut",
      }}
    />
  );
}

function generateSparkles(count: number): SparkleConfig[] {
  const configs: SparkleConfig[] = [];
  for (let i = 0; i < count; i++) {
    const size = ((i * 7 + 3) % 4) + 2;
    const x = (i * 13 + 7) % 100;
    const y = (i * 17 + 11) % 100;
    const duration = ((i * 19 + 5) % 30) / 10 + 2;
    const delay = ((i * 23 + 3) % 30) / 10;
    const isPink = (i * 11 + 7) % 3 !== 0;
    const colorIndex = isPink ? 0 : 1;
    const shadowSize = size * 4;
    const shadowColor = isPink ? "rgba(255,0,204,0.4)" : "rgba(212,175,55,0.4)";
    configs.push({
      id: i,
      size,
      x,
      y,
      duration,
      delay,
      color: SPARKLE_COLORS[colorIndex % SPARKLE_COLORS.length],
      shadow: `0 0 ${shadowSize}px ${size}px ${shadowColor}`,
    });
  }
  return configs;
}

export function HeroSection() {
  const [currentGuest, setCurrentGuest] = useState(0);

  const sparkles = useMemo(() => generateSparkles(25), []);

  const nextGuest = useCallback(() => {
    setCurrentGuest((prev) => (prev + 1) % GUESTS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextGuest, 3000);
    return () => clearInterval(interval);
  }, [nextGuest]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0015] via-[#1a0025] to-[#0d0018] z-0" />

      {/* Animated gradient overlays */}
      <motion.div
        className="absolute inset-0 z-[1] opacity-30"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, #FF00CC 0%, transparent 60%)",
            "radial-gradient(ellipse at 80% 50%, #B300FF 0%, transparent 60%)",
            "radial-gradient(ellipse at 50% 20%, #FF00CC 0%, transparent 60%)",
            "radial-gradient(ellipse at 20% 50%, #FF00CC 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 z-[1] opacity-20"
        animate={{
          background: [
            "radial-gradient(ellipse at 80% 20%, #D4AF37 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 80%, #D4AF37 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 80%, #D4AF37 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 20%, #D4AF37 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Sparkle particles */}
      {sparkles.map((s) => (
        <Sparkle key={s.id} config={s} />
      ))}

      {/* Dark vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-[2]" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 md:px-12 lg:px-16">

        {/* Left: Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs md:text-sm font-bold tracking-[0.3em] text-secondary/80 uppercase mb-2 drop-shadow-[0_0_10px_rgba(255,0,204,0.3)]"
          >
            Podcast Original
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-outfit text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-4"
          >
            Lo que ves es solo{" "}
            <span className="text-accent font-semibold drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]">
              una parte
            </span>{" "}
            de la historia...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg text-gray-300 font-light leading-relaxed max-w-lg"
          >
            <span className="text-secondary drop-shadow-[0_0_10px_rgba(255,0,204,0.4)]">
              Historias reales.
            </span>{" "}
            <span className="drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
              Verdades sin filtro.
            </span>{" "}
            <span className="text-gray-400">
              Conversaciones que inspiran, emocionan y transforman.
            </span>
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-8"
          >
            <Link
              href="/episodios"
              className="group relative px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_100%] animate-gradient-x" />
              <span className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_100%] animate-gradient-x blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <span className="relative text-white drop-shadow-lg">
                Ver Episodios
              </span>
            </Link>

            <Link
              href="https://open.spotify.com/show/033yC0xW5iN3rMbhWRqYe4?si=vFBRpRQYSm66LEJpKR1t7A"
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm border-2 border-white/30 text-white overflow-hidden transition-all duration-300 hover:border-secondary hover:shadow-[0_0_25px_rgba(255,0,204,0.4)] group"
            >
              <span className="absolute inset-0 bg-white/5 group-hover:bg-secondary/20 transition-colors" />
              <span className="relative flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 8.5v7l6-3.5z" fill="black" />
                </svg>
                Escuchar Podcast
              </span>
            </Link>
          </motion.div>

          {/* Guest Carousel Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-3 mt-12"
          >
            {GUESTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentGuest(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentGuest
                    ? "w-8 bg-secondary shadow-[0_0_8px_rgba(255,0,204,0.6)]"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Right: Giant Logo */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Glow layers behind the logo */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 80px 30px rgba(255,0,204,0.3), 0 0 150px 60px rgba(179,0,255,0.15), 0 0 200px 100px rgba(212,175,55,0.1)",
                  "0 0 100px 50px rgba(255,0,204,0.4), 0 0 180px 80px rgba(179,0,255,0.2), 0 0 250px 120px rgba(212,175,55,0.15)",
                  "0 0 80px 30px rgba(255,0,204,0.3), 0 0 150px 60px rgba(179,0,255,0.15), 0 0 200px 100px rgba(212,175,55,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating logo */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/logo.png"
                alt="Detrás del Espejo"
                width={550}
                height={550}
                className="rounded-full object-cover relative z-10"
                style={{
                  filter: "drop-shadow(0 0 40px rgba(255,0,204,0.5)) drop-shadow(0 0 80px rgba(179,0,255,0.3)) drop-shadow(0 0 30px rgba(212,175,55,0.4))",
                  width: "clamp(300px, 40vw, 550px)",
                  height: "clamp(300px, 40vw, 550px)",
                }}
                priority
              />
            </motion.div>

            {/* Orbiting sparkles ring around the logo */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const size = 6 + (i % 3) * 2;
                const colors = [
                  "radial-gradient(circle, rgba(255,0,204,0.9), transparent)",
                  "radial-gradient(circle, rgba(212,175,55,0.9), transparent)",
                ];
                const shadows = [
                  "0 0 10px 3px rgba(255,0,204,0.6)",
                  "0 0 10px 3px rgba(212,175,55,0.6)",
                ];
                return (
                  <div
                    key={angle}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: size,
                      height: size,
                      top: "calc(50% - " + (size / 2) + "px)",
                      left: "calc(50% - " + (size / 2) + "px)",
                      transform: "rotate(" + angle + "deg) translateY(-230px)",
                      background: colors[i % 2],
                      boxShadow: shadows[i % 2],
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-[3]" />

      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
