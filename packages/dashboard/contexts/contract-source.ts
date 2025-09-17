import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store state interface
interface ContractSourceStoreState {
  // path (outFile) -> {filename -> file content}
  sourceFiles: Record<string, Record<string, string>>;
}

// Store actions interface
interface ContractSourceStoreActions {
  saveSourceFiles: (outFile: string, sourceFiles: Record<string, string>) => void;
  getSourceFiles: (outFile: string) => Record<string, string> | undefined;
  clearSourceFiles: (outFile?: string) => void;
  clearAllSourceFiles: () => void;
  hasSourceFiles: (outFile: string) => boolean;
  getAllSourceFiles: () => Record<string, Record<string, string>>;
}

// Combined store interface
interface ContractSourceStore extends ContractSourceStoreState, ContractSourceStoreActions {}

// Create the store
const contractSourceStore = create<ContractSourceStore>()(
  persist(
    (set, get) => ({
      // State
      sourceFiles: {},

      // Actions
      saveSourceFiles: (outFile: string, sourceFiles: Record<string, string>) =>
        set((state) => ({
          sourceFiles: {
            ...state.sourceFiles,
            [outFile]: sourceFiles,
          },
        })),

      getSourceFiles: (outFile: string) => {
        const state = get();
        return state.sourceFiles[outFile];
      },

      clearSourceFiles: (outFile?: string) => {
        if (outFile) {
          set((state) => {
            const newSourceFiles = { ...state.sourceFiles };
            delete newSourceFiles[outFile];
            return { sourceFiles: newSourceFiles };
          });
        } else {
          // If no outFile specified, clear all
          set({ sourceFiles: {} });
        }
      },

      clearAllSourceFiles: () => set({ sourceFiles: {} }),

      hasSourceFiles: (outFile: string) => {
        const state = get();
        return !!state.sourceFiles[outFile] && Object.keys(state.sourceFiles[outFile]).length > 0;
      },

      getAllSourceFiles: () => {
        const state = get();
        return state.sourceFiles;
      },
    }),
    {
      name: 'contract-source-storage',
      partialize: (state) => ({
        sourceFiles: state.sourceFiles,
      }),
    }
  )
);

// Export hook for React components
export const useContractSourceStore = contractSourceStore;

// Export actions object for use outside React components
export const contractSourceStoreActions = {
  saveSourceFiles: (outFile: string, sourceFiles: Record<string, string>) =>
    contractSourceStore.getState().saveSourceFiles(outFile, sourceFiles),
  getSourceFiles: (outFile: string) => contractSourceStore.getState().getSourceFiles(outFile),
  clearSourceFiles: (outFile?: string) => contractSourceStore.getState().clearSourceFiles(outFile),
  clearAllSourceFiles: () => contractSourceStore.getState().clearAllSourceFiles(),
  hasSourceFiles: (outFile: string) => contractSourceStore.getState().hasSourceFiles(outFile),
  getAllSourceFiles: () => contractSourceStore.getState().getAllSourceFiles(),
};
