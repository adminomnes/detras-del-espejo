"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

const IMAGES = [
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  "https://images.unsplash.com/photo-1516280440502-861f65bb1b2e?w=800&q=80",
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
  "https://images.unsplash.com/photo-1520004434532-6d9b35b62b08?w=800&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
];

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-outfit uppercase tracking-widest text-white mb-4">
          La <span className="text-primary">Galería</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Momentos detrás de escena, grabaciones y eventos exclusivos.</p>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(src)}
            className="relative break-inside-avoid rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-primary/50 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Gallery" className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium uppercase tracking-widest text-sm border border-white/20 px-4 py-2 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(179,0,255,0.5)]">Ver Imagen</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selectedImage.replace("w=800", "w=1600")} alt="Gallery full" className="w-full h-auto rounded-xl" />
        )}
      </Modal>
    </div>
  );
}
