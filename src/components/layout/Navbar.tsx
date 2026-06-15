"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/utils/constants";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/5 shadow-lg shadow-black/50" : "bg-transparent py-2"}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Detrás del Espejo Logo" width={50} height={50} className="object-contain rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
          <span className="font-outfit text-xl sm:text-2xl font-light tracking-widest text-white uppercase drop-shadow-md hidden sm:inline-block">
            Detrás del <span className="text-accent font-semibold">Espejo</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium tracking-wide transition-colors hover:text-accent"
              >
                <span className={isActive ? "text-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "text-gray-300 drop-shadow-md"}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="text-xs text-gray-600 hover:text-accent transition-colors tracking-wider uppercase ml-4"
            title="Panel de Administración"
          >
            Admin
          </Link>
        </nav>

        <button className="md:hidden text-white drop-shadow-md" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 w-full glass border-b border-white/5 flex flex-col items-center py-6 gap-6"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium tracking-wide ${pathname === link.href ? "text-accent" : "text-gray-300"}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium tracking-wide text-gray-500 hover:text-accent transition-colors mt-2 pt-4 border-t border-white/5 w-full text-center"
          >
            Admin
          </Link>
        </motion.div>
      )}
    </header>
  );
}
