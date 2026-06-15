import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Flyer {
  id: string;
  imageUrl: string;
  assignedWeek: number; // 1-52
  isActive: boolean;
  createdAt: string;
}

interface FlyerState {
  flyers: Flyer[];
  addFlyer: (flyer: Omit<Flyer, "id" | "createdAt">) => void;
  updateFlyer: (id: string, data: Partial<Omit<Flyer, "id" | "createdAt">>) => void;
  deleteFlyer: (id: string) => void;
  toggleActive: (id: string) => void;
}

export const useFlyerStore = create<FlyerState>()(
  persist(
    (set) => ({
      flyers: [],
      addFlyer: (data) =>
        set((state) => ({
          flyers: [
            ...state.flyers,
            {
              ...data,
              id: Math.random().toString(36).substring(2, 10),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateFlyer: (id, data) =>
        set((state) => ({
          flyers: state.flyers.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),
      deleteFlyer: (id) =>
        set((state) => ({
          flyers: state.flyers.filter((f) => f.id !== id),
        })),
      toggleActive: (id) =>
        set((state) => ({
          flyers: state.flyers.map((f) =>
            f.id === id ? { ...f, isActive: !f.isActive } : f
          ),
        })),
    }),
    {
      name: "weekly-flyer-storage",
    }
  )
);
