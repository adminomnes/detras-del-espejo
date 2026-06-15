"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  currentImage?: string | null;
  onUpload: (url: string) => void;
}

export function ImageUploader({ currentImage, onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Upload to Supabase Storage
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
        setPreview(data.url);
      }
    } catch {
      // Keep local preview
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm text-gray-400 uppercase tracking-widest">Imagen</label>

      <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-white/10 bg-gray-900">
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(null); onUpload(""); }}
              className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Upload size={24} className="mb-2" />
            <span className="text-sm">{uploading ? "Subiendo..." : "Subir imagen"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
