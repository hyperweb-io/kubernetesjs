import { create } from 'zustand';

interface HyperwebStore {
  isHyperwebAdded: boolean;
  setIsHyperwebAdded: (isAdded: boolean) => void;
}

export const useHyperwebStore = create<HyperwebStore>()((set) => ({
  isHyperwebAdded: false,
  setIsHyperwebAdded: (isAdded) => set({ isHyperwebAdded: isAdded }),
}));
