import { User } from "@/features/users/infraestructure/models/user.model";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setHydrated: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      login: (user, token) =>
        set({ user, token, isAuthenticated: !!user && !!token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user && !!get().token,
        }),
      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!get().user && !!token,
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
