import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  nombre: string;
  rol: "superadmin" | "admin" | "user";
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
