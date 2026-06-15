"use client";

import { Search } from "lucide-react";

interface EpisodeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  hideCategories?: boolean;
}

export function EpisodeFilters({ search, onSearchChange, categories = ["Todos"], activeCategory = "Todos", onCategoryChange = () => {}, hideCategories = false }: EpisodeFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por título o invitado..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full glass pl-12 pr-4 py-3 rounded-full outline-none focus:border-primary/50 text-white transition-colors"
        />
      </div>

      {!hideCategories && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat ? "bg-accent text-black" : "glass text-gray-300 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
