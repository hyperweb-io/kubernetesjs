import { create } from 'zustand';

interface InteractFormState {
  contractAddress: string;
  setContractAddress: (address: string) => void;
  clearContractAddress: () => void;
}

export const useInteractFormStore = create<InteractFormState>((set) => ({
  contractAddress: '',
  setContractAddress: (address: string) => set({ contractAddress: address }),
  clearContractAddress: () => set({ contractAddress: '' }),
}));
