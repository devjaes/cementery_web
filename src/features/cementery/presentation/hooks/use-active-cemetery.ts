import { useCemeteryStore } from "../context/cemetery.store";

export const useActiveCemetery = () => {
  const activeCemetery = useCemeteryStore((state) => state.activeCemetery);
  const setActiveCemetery = useCemeteryStore((state) => state.setActiveCemetery);
  const clearActiveCemetery = useCemeteryStore((state) => state.clearActiveCemetery);

  const getActiveCemeteryId = () => activeCemetery?.idCementerio ?? null;
  
  const isActiveCemetery = (id: string) => activeCemetery?.idCementerio === id;

  return {
    activeCemetery,
    setActiveCemetery,
    clearActiveCemetery,
    getActiveCemeteryId,
    isActiveCemetery,
  };
};
