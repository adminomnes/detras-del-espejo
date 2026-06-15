"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          nombre: session.user.user_metadata?.nombre ?? "",
          rol: session.user.user_metadata?.rol ?? "user",
        });
      } else {
        clearUser();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          nombre: session.user.user_metadata?.nombre ?? "",
          rol: session.user.user_metadata?.rol ?? "user",
        });
      } else {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser]);

  return { user, isAuthenticated: !!user };
}
