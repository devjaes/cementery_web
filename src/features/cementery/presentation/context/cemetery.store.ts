import { CementeryEntity } from "../../domain/entities/cementery.entity";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type CemeteryStore = {
  activeCemetery: CementeryEntity | null;
  setActiveCemetery: (cemetery: CementeryEntity) => void;
  clearActiveCemetery: () => void;
};

export const useCemeteryStore = create<CemeteryStore>()(
  persist(
    (set) => ({
      activeCemetery: null,
      setActiveCemetery: (cemetery) => set({ activeCemetery: cemetery }),
      clearActiveCemetery: () => set({ activeCemetery: null }),
    }),
    {
      name: "cemetery-context",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : noopStorage)),
    }
  )
);
